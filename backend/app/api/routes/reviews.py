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
    Review,
    ReviewCreate,
    ReviewPublic,
    ReviewsPublic,
)

router = APIRouter()

@router.post(
    "/", response_model=ReviewPublic
)
async def create_review(*, session: SessionDep, review_in: ReviewCreate) -> Any:
    """
    Create new review.
    """
    review = await crud.create_review(session=session, review_create=review_in)
    return review

@router.get(
    "/", response_model=ReviewsPublic
)
async def read_reviews(*, session: SessionDep) -> Any:
    """
    Retrieve reviews.
    """
    count_statement = select(func.count()).select_from(Review)
    count = (await session.execute(count_statement)).scalar()
    statement = select(Review)
    reviews = (await session.execute(statement)).scalars().all()
    
    return ReviewsPublic(data=reviews, count=count)

@router.get(
    "/{review_id}", response_model=ReviewPublic
)
async def read_review_by_id(*, session: SessionDep, review_id: uuid.UUID) -> Any:
    """
    Retrieve review.
    """
    review = await session.get(Review, review_id)
    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found",
        )
    return review