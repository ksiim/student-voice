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
    