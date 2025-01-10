from io import BytesIO
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
import qrcode
from sqlmodel import col, delete, func, select

from app import crud
from app.api.deps import (
    SessionDep
)
from app.core.config import settings
from app.models import BackForm, Class, QRCode
from app.models import BackForm, Class, QRCode

router = APIRouter()

async def generate_and_save_qr_code(session: SessionDep, base_url: str, class_id: uuid.UUID) -> bytes:
    qr_code = await session.get(QRCode, class_id)
    if qr_code:
        raise HTTPException(status_code=400, detail="QR code already exists")
    
    class_url = f'{base_url}/{class_id}'

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(class_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    
    qr_code_data = img_bytes.getvalue()

    backform = await crud.get_backform_by_class_id(session, class_id)
    if not backform:
        raise HTTPException(status_code=404, detail="Backform not found")
    # Создание экземпляра модели QRCode
    qr_code_record = QRCode(qr_code=qr_code_data, backform_id=backform.id)

    # Сохранение записи в базу данных
    session.add(qr_code_record)
    await session.commit()
    
    return qr_code_data

@router.get("/generate/{class_id}")
async def generate_qr_code(
    *,
    class_id: uuid.UUID,
    session: SessionDep
) -> StreamingResponse:
    base_url = "http://localhost:5173/feedback"
    qr_code_data = await generate_and_save_qr_code(session, base_url, class_id)
    
    img_bytes = BytesIO(qr_code_data)
    img_bytes.seek(0)
    
    return StreamingResponse(img_bytes, media_type="image/png")

@router.get("/download/{class_id}")
async def download_qr_code(
    class_id: uuid.UUID,
    session: SessionDep
) -> StreamingResponse:
    
    qr_code_data = (await crud.get_qr_code_by_class_id(class_id, session)).qr_code
    
    img_bytes = BytesIO(qr_code_data)
    img_bytes.seek(0)
    
    return StreamingResponse(img_bytes, media_type="image/png", headers={
        "Content-Disposition": f"attachment; filename=qr_code_{class_id}.png"
    })
    
@router.get("/get/{class_id}")
async def get_qr_code(
    class_id: uuid.UUID,
    session: SessionDep
) -> bytes:
    class_ = await session.get(Class, class_id)
    if not class_:
        raise HTTPException(status_code=404, detail="Class not found")
    if not await crud.get_qr_code_by_class_id(class_id, session):
        raise HTTPException(status_code=404, detail="QR code not found")
    
    qr_code_data = (await crud.get_qr_code_by_class_id(class_id, session)).qr_code
    
    img_bytes = BytesIO(qr_code_data)
    img_bytes.seek(0)
    
    return StreamingResponse(img_bytes, media_type="image/png")