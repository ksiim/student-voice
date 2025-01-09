from datetime import datetime
import io
from typing import Any, Optional
from urllib.parse import quote
import uuid
from app import crud
from app.models import Attendance, BackFormCreate, Class, ClassCreate, ClassPublic, ClassReport, ClassUpdate, ClassesPublic, Review
from fastapi import APIRouter, HTTPException, Query

from app.api.deps import (
    SessionDep,
)
from fastapi.responses import StreamingResponse
import pandas as pd
from sqlalchemy import delete
from sqlalchemy.orm import joinedload
from sqlmodel import select, func


router = APIRouter()

@router.post(
    "/",
    # dependencies=[Depends(get_current_active_superuser)],
    response_model=ClassPublic
)
async def create_class(*, session: SessionDep, class_in: ClassCreate) -> Any:
    """
    Create new class with backform
    """
    class_ = await crud.create_class(session=session, class_create=class_in)
    backform_in = BackFormCreate(
        class_id=class_.id,
    )
    backform = await crud.create_backform(session=session, backform_create=backform_in)
    await session.refresh(class_)
    return class_

@router.get(
    "/",
    # dependencies=[Depends(get_current_active_superuser)],
    response_model=ClassesPublic
)
async def read_classes(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100,
    start_time: Optional[datetime] = Query(None),
    end_time: Optional[datetime] = Query(None),
    room_id: Optional[uuid.UUID] = Query(None),
    teacher_id: Optional[uuid.UUID] = Query(None),
) -> Any:
    """
    Retrieve classes.
    """
    statement = select(Class)
    
    if start_time:
        statement = statement.where(Class.start_time >= start_time)
    if end_time:
        statement = statement.where(Class.end_time <= end_time)
    if room_id:
        statement = statement.where(Class.room_id == room_id)
    if teacher_id:
        statement = statement.where(Class.teacher_id == teacher_id)
    
    count_statement = select(func.count()).select_from(statement.subquery())
    count = (await session.execute(count_statement)).scalar()
    
    statement = statement.offset(skip).limit(limit)
    classes = (await session.execute(statement)).scalars().all()

    return ClassesPublic(data=classes, count=count)

@router.get(
    '/info/{class_id}',
)
async def read_class_info(
    session: SessionDep,
    class_id: uuid.UUID
) -> Any:
    """
    Retrieve class info.
    """
    class_ = await crud.get_class_info(session=session, class_id=class_id)
    if not class_:
        raise HTTPException(
            status_code=404,
            detail="The class with this id does not exist in the system.",
        )
    return class_

@router.delete(
    "/{class_id}",
    # dependencies=[Depends(get_current_active_superuser)],
)
async def delete_class(session: SessionDep, class_id: uuid.UUID) -> Any:
    """
    Delete class.
    """
    class_ = await session.execute(select(Class).where(Class.id == class_id))
    if not class_:
        raise HTTPException(
            status_code=404,
            detail="The class with this id does not exist in the system.",
        )
    
    await session.execute(delete(Class).where(Class.id == class_id))
    await session.commit()
    return {"message": "Class deleted successfully."}


@router.put(
    "/{class_id}",
    # dependencies=[Depends(get_current_active_superuser)],
    response_model=ClassPublic
)
async def update_class(
    session: SessionDep,
    class_id: uuid.UUID,
    class_in: ClassUpdate,
) -> Any:
    """
    Update class.
    """
    class_ = await session.get(Class, class_id)
    if not class_:
        raise HTTPException(
            status_code=404,
            detail="The class with this id does not exist in the system.",
        )
    
    class_ = await crud.update_class(session=session, class_=class_, class_in=class_in)
    return class_    


@router.get(
    '/get_class_groups',
    
)
async def read_class_groups(
    session: SessionDep,
    start_time: datetime,
    end_time: datetime,
    teacher_id: uuid.UUID,
    subject_id: uuid.UUID,
) -> Any:
    """
    Retrieve class groups.
    """
    query = select(Class).where(
        Class.start_time == start_time,
        Class.end_time == end_time,
        Class.teacher_id == teacher_id,
        Class.subject_id == subject_id,
    )
    class_ = await session.execute(query)
    class_ = class_.scalars().all()[-1]
    if not class_:
        raise HTTPException(
            status_code=404,
            detail="The class with this id does not exist in the system.",
        )
    return class_.study_groups


@router.post(
    '/excel'
)
async def download_class_report(
    session: SessionDep,
    request: ClassReport,
):
    """
    Download class report.
    """
    class_query = select(Class).where(
        Class.start_time == request.start_time,
        Class.end_time == request.end_time,
        Class.teacher_id == request.teacher_id,
        Class.subject_id == request.subject_id,
    ).options(joinedload(Class.attendances), joinedload(Class.reviews)).distinct()
    class_ = await session.execute(class_query)
    class_ = class_.unique().scalars().all()
    if not class_:
        raise HTTPException(
            status_code=404,
            detail="The class does not exist in the system.",
        )
    class_ = class_[-1]
    print(class_)
    
    attendances = class_.attendances
    reviews = class_.reviews
    event_quality = sum(review.event_quality for review in reviews) / len(reviews)
    material_clarity = sum(review.material_clarity for review in reviews) / len(reviews)
    teaching_quality = sum(review.teaching_quality for review in reviews) / len(reviews)
    comments = [review.comment for review in reviews if review.comment]
    
    data_list, data_statistics, data_comments = [], [], []
    
    for attendance in attendances:
        data_list.append({
            "Группа": attendance.study_group,
            "Студент": attendance.student_full_name,
        })
    data_statistics.append({
        "Статистика": "Качество преподавания",
        "Значение": teaching_quality,
    })
    data_statistics.append({
        "Статистика": "Доступность материала",
        "Значение": material_clarity,
    })
    data_statistics.append({
        "Статистика": "Качество проведения мероприятия",
        "Значение": event_quality,
    })
    
    for comment in comments:
        data_comments.append({
            "Комментарий": comment,
        })
        
    df_list = pd.DataFrame(data_list)
    df_statistics = pd.DataFrame(data_statistics)
    df_comments = pd.DataFrame(data_comments)
    
    empty_df = pd.DataFrame(columns=[''])
    df_combined = pd.concat([df_list, empty_df, df_statistics, empty_df, df_comments], axis=1)
    
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df_combined.to_excel(writer, index=False, sheet_name='Вместе')
        df_list.to_excel(writer, index=False, sheet_name='Список')
        df_statistics.to_excel(writer, index=False, sheet_name='Статистика')
        df_comments.to_excel(writer, index=False, sheet_name='Комментарии')
        writer._save()
    output.seek(0)

    # Формирование имени файла
    start_time = class_.start_time.strftime('%H:%M')
    end_time = class_.end_time.strftime('%H:%M')
    filename = f"отчет_{class_.name}_{start_time}-{end_time}_{class_.start_time.date()}.xlsx"
    encoded_filename = quote(filename)

    # Возврат файла в виде ответа
    return StreamingResponse(output, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers={
        "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"
    })

    
