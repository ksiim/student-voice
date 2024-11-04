from ast import Sub
import re
from typing import Any
import uuid
from app import crud
from app.models import Class, ClassesPublic, Room, RoomCreate, RoomPublic, RoomsPublic, Subject, SubjectCreate, SubjectPublic, SubjectsPublic
from fastapi import APIRouter, HTTPException

from app.api.deps import (
    SessionDep,
)
from sqlmodel import select, func


router = APIRouter()


@router.post(
    "/",
    # dependencies=[Depends(get_current_active_superuser)],
    response_model=RoomPublic
)
async def create_room(*, session: SessionDep, room_in: RoomCreate) -> Any:
    """
    Create new room.
    """
    room = await crud.get_room_by_number(session=session, name=room_in.number)
    if room:
        raise HTTPException(
            status_code=400,
            detail="The room with this name already exists in the system.",
        )

    room = await crud.create_room(session=session, room_create=room_in)
    return room

@router.get(
    "/",
    # dependencies=[Depends(get_current_active_superuser)],
    response_model=RoomsPublic
)
async def read_rooms(*, session: SessionDep) -> Any:
    """
    Retrieve rooms.
    """
    count_statement = select(func.count()).select_from(Room)
    count = (await session.execute(count_statement)).scalar()
    statement = select(Room)
    rooms = (await session.execute(statement)).scalars().all()

    return RoomsPublic(data=rooms, count=count)

@router.get(
    "/{room_id}",
    # dependencies=[Depends(get_current_active_superuser)],
    response_model=RoomPublic
)
async def read_room_by_id(*, session: SessionDep, room_id: uuid.UUID) -> Any:
    """
    Retrieve room.
    """
    """
    Get a specific user by id.
    """
    room = await session.get(Room, room_id)
    return room