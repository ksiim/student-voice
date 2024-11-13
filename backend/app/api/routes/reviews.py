from datetime import datetime
import uuid
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import col, delete, func, select

from app import crud
from app.api.deps import (
    SessionDep,
)
from app.core.config import settings
from app.models import (
    Class,
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
    "/", response_model=ReviewsPublic,
)
async def read_reviews(
    *, session: SessionDep,
    skip: int = 0,
    limit: int = 100,
    subject_id: Optional[uuid.UUID] = Query(None),
    teacher_id: Optional[uuid.UUID] = Query(None),
    teaching_quality: Optional[int] = Query(None),
    material_clarity: Optional[int] = Query(None),
    event_quality: Optional[int] = Query(None),
    created_at: Optional[datetime] = Query(None),
    class_id: Optional[uuid.UUID] = Query(None),
) -> Any:
    """
    Retrieve reviews.
    """
    statement = select(Review)
    
    if subject_id:
        statement = (
            statement
            .join(Review.class_)
            .where(Class.subject_id == subject_id)
        )
    if teacher_id:
        statement = (
            statement
            .join(Review.class_)
            .where(Class.teacher_id == teacher_id)
        )
    if teaching_quality:
        statement = statement.where(Review.teaching_quality == teaching_quality)
    if material_clarity:
        statement = statement.where(Review.material_clarity == material_clarity)
    if event_quality:
        statement = statement.where(Review.event_quality == event_quality)
    if created_at:
        statement = statement.where(Review.created_at == created_at)
    if class_id:
        statement = statement.where(Review.class_id == class_id)

    
    count_statement = select(func.count()).select_from(statement.subquery())
    count = (await session.execute(count_statement)).scalar()
    
    statement = statement.offset(skip).limit(limit)
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