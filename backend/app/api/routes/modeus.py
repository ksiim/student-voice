import uuid
from typing import Any

from app.api.routes.utils import ModeusParser
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import col, delete, func, select

from app import crud
from app.api.deps import (
    SessionDep
)
from app.core.config import settings

router = APIRouter()


@router.post(
    '/'
)
async def parse(
    session: SessionDep,
    teacher_fio: str,
) -> Any:
    """
    Parse modeus data.
    """
    modeus_parser = ModeusParser()
    await modeus_parser.main()