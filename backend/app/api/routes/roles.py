import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import col, delete, func, select

from app import crud
from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
)
from app.core.config import settings
from app.models import (
    Role,
    RoleCreate,
    RolePublic,
    RolesPublic,
    RoleUpdate,
    User,
)

router = APIRouter()

@router.post(
    "/", response_model=RolePublic
)
async def create_role(*, session: SessionDep, role_in: RoleCreate) -> Any:
    """
    Create new role.
    """
    role = await crud.get_role_by_name(session=session, name=role_in.name)
    if role:
        raise HTTPException(
            status_code=400,
            detail="The role with this name already exists in the system.",
        )
        
    role = await crud.create_role(session=session, role_create=role_in)
    return role

@router.get(
    "/", response_model=RolesPublic
)
async def read_roles(*, session: SessionDep) -> Any:
    """
    Retrieve roles.
    """
    count_statement = select(func.count()).select_from(Role)
    count = (await session.execute(count_statement)).scalar()
    statement = select(Role)
    roles = (await session.execute(statement)).scalars().all()
    
    return RolesPublic(data=roles, count=count)

@router.get(
    "/{role_id}", response_model=RolePublic
)
async def read_role_by_id(*, session: SessionDep, role_id: uuid.UUID) -> Any:
    """
    Retrieve role by ID.
    """
    role = await crud.get_role_by_id(session=session, role_id=role_id)
    if not role:
        raise HTTPException(
            status_code=404,
            detail="Role not found",
        )
    return role

    
@router.get(
    "/name/{name}", response_model=RolePublic
)
async def read_role_by_name(*, session: SessionDep, name: str) -> Any:
    """
    Retrieve role by name.
    """
    role = await crud.get_role_by_name(session=session, name=name)
    if not role:
        raise HTTPException(
            status_code=404,
            detail="Role not found",
        )
    return role