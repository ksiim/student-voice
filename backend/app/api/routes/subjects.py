from ast import Sub
from typing import Any
from app import crud
from app.models import Class, ClassesPublic, Subject, SubjectCreate, SubjectPublic, SubjectsPublic
from fastapi import APIRouter, HTTPException

from app.api.deps import (
    SessionDep,
)
from sqlmodel import select, func


router = APIRouter()


@router.post(
    "/",
    # dependencies=[Depends(get_current_active_superuser)],
    response_model=SubjectPublic
)
async def create_subject(*, session: SessionDep, subject_in: SubjectCreate) -> Any:
    """
    Create new subject.
    """
    subject = await crud.get_subject_by_name(session=session, name=subject_in.name)
    if subject:
        raise HTTPException(
            status_code=400,
            detail="The subject with this name already exists in the system.",
        )

    subject = await crud.create_subject(session=session, subject_create=subject_in)
    return subject


@router.get(
    "/",
    # dependencies=[Depends(get_current_active_superuser)],
    response_model=SubjectsPublic
)
async def read_subjects(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve subjects.
    """
    count_statement = select(func.count()).select_from(Subject)
    count = (await session.execute(count_statement)).scalar()
    statement = select(Subject).offset(skip).limit(limit)
    subjects = (await session.execute(statement)).scalars().all()

    return SubjectsPublic(data=subjects, count=count)