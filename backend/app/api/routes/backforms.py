from typing import Any
import uuid
from app import crud
from app.models import BackForm, BackFormCreate, BackFormPublic, BackFormsPublic, BackFormUpdate
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
    response_model=BackFormPublic
)
async def create_backform(*, session: SessionDep, backform_in: BackFormCreate) -> Any:
    """
    Create new backform.
    """
    backform = await crud.create_backform(session=session, backform_create=backform_in)
    return backform

@router.get(
    "/",
    # dependencies=[Depends(get_current_active_superuser)],
    response_model=BackFormsPublic
)
async def read_backforms(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve backforms.
    """
    statement = select(BackForm)
    statement = statement.offset(skip).limit(limit)
    backforms = (await session.execute(statement)).scalars().all()
    return backforms

@router.get(
    "/{backform_id}",
    # dependencies=[Depends(get_current_active_superuser)],
    response_model=BackFormPublic
)
async def read_backform(
    session: SessionDep,
    backform_id: uuid.UUID,
) -> Any:
    """
    Retrieve backform by id.
    """
    backform = await crud.get_backform_by_id(session=session, backform_id=backform_id)
    if backform is None:
        raise HTTPException(status_code=404, detail="BackForm not found")
    return backform
