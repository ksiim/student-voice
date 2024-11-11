import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import col, delete, func, select

from app import crud
from app.api.deps import (
    SessionDep,
)
from app.core.config import settings
from app.models import (
    Attendance,
    AttendanceCreate,
    AttendancePublic,
    AttendancesPublic
)

router = APIRouter()

@router.post(
    "/", response_model=AttendancePublic
)
async def create_attendance(*, session: SessionDep, attendance_in: AttendanceCreate) -> Any:
    """
    Create new attendance.
    """
    attendance = await crud.create_attendance(session=session, attendance_in=attendance_in)
    return attendance

@router.get(
    "/", response_model=AttendancesPublic
)
async def read_attendances(*, session: SessionDep) -> Any:
    """
    Retrieve attendances.
    """
    count_statement = select(func.count()).select_from(Attendance)
    count = (await session.execute(count_statement)).scalar()
    statement = select(Attendance)
    attendances = (await session.execute(statement)).scalars().all()
    
    return AttendancesPublic(data=attendances, count=count)

@router.get(
    "/{attendance_id}", response_model=AttendancePublic
)
async def read_attendance_by_id(*, session: SessionDep, attendance_id: uuid.UUID) -> Any:
    """
    Retrieve attendance.
    """
    attendance = await session.get(Attendance, attendance_id)
    if not attendance:
        raise HTTPException(
            status_code=404,
            detail="Attendance not found",
        )
    return attendance

@router.get(
    '/{class_id}/', response_model=AttendancesPublic
)
async def read_attendances_by_class_id(*, session: SessionDep, class_id: uuid.UUID) -> Any:
    """
    Retrieve attendances by class id.
    """
    count_statement = select(func.count()).where(Attendance.class_id == class_id).select_from(Attendance)
    count = (await session.execute(count_statement)).scalar()
    statement = select(Attendance).where(Attendance.class_id == class_id)
    attendances = (await session.execute(statement)).scalars().all()
    
    return AttendancesPublic(data=attendances, count=count)