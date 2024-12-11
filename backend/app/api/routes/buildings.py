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
    Building,
    BuildingCreate,
    BuildingPublic,
    BuildingsPublic
)

router = APIRouter()

@router.post(
    "/", response_model=BuildingPublic
)
async def create_building(*, session: SessionDep, building_in: BuildingCreate) -> Any:
    """
    Create new building.
    """
    building = await crud.create_building(session=session, building_create=building_in)
    return building

@router.get(
    "/", response_model=BuildingsPublic
)
async def read_buildings(*, session: SessionDep) -> Any:
    """
    Retrieve buildings.
    """
    count_statement = select(func.count()).select_from(Building)
    count = (await session.execute(count_statement)).scalar()
    statement = select(Building)
    buildings = (await session.execute(statement)).scalars().all()
    
    return BuildingsPublic(data=buildings, count=count)

@router.get(
    "/{building_id}", response_model=BuildingPublic
)
async def read_building_by_id(*, session: SessionDep, building_id: uuid.UUID) -> Any:
    """
    Retrieve building.
    """
    building = await session.get(Building, building_id)
    if not building:
        raise HTTPException(
            status_code=404,
            detail="Building not found",
        )
    return building