from typing import Any
from app import crud
from app.models import Class, ClassCreate, ClassPublic, ClassesPublic
from fastapi import APIRouter, HTTPException

from app.api.deps import (
    SessionDep,
)
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
async def read_classes(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve classes.
    """
    count_statement = select(func.count()).select_from(Class)
    count = (await session.execute(count_statement)).scalar()
    statement = select(Class).offset(skip).limit(limit)
    users = (await session.execute(statement)).scalars().all()

    return ClassesPublic(data=users, count=count)