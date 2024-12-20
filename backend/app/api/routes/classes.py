from datetime import datetime
from typing import Any, Optional
import uuid
from app import crud
from app.models import Class, ClassCreate, ClassPublic, ClassUpdate, ClassesPublic
from fastapi import APIRouter, HTTPException, Query

from app.api.deps import (
    SessionDep,
)
from sqlalchemy import delete
from sqlmodel import select, func


router = APIRouter()

@router.post(
    "/",
    # dependencies=[Depends(get_current_active_superuser)],
    response_model=ClassPublic
)
async def create_class(*, session: SessionDep, class_in: ClassCreate) -> Any:
    """
    Create new class.
    """
    class_ = await crud.create_class(session=session, class_create=class_in)
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

@router.delete(
    "/{class_id}",
    # dependencies=[Depends(get_current_active_superuser)],
    response_model=ClassPublic
)
async def delete_class(*, session: SessionDep, class_id: uuid.UUID) -> Any:
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
