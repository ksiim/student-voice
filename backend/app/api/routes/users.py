import uuid
from typing import Any, Optional
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlmodel import col, delete, func, select

from app import crud
from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
)
from app.core.config import settings
from app.core.security import get_password_hash, verify_password
from app.models import (
    Item,
    Message,
    Role,
    SendToAdminEmailIn,
    UpdatePassword,
    User,
    UserCreate,
    UserPublic,
    UserRegister,
    UsersPublic,
    UserUpdate,
    UserUpdateMe,
)
from app.utils import generate_new_password_email, generate_text_email, send_email

import secrets

router = APIRouter()


@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UsersPublic,
)
async def read_users(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100,
    role_name: Optional[str] = Query(None)
) -> Any:
    """
    Retrieve users.
    """
    statement = select(User)
    
    if role_name:
        statement = statement.join(User.role).where(Role.name == role_name)
    
    count_statement = select(func.count()).select_from(statement.subquery())
    count = (await session.execute(count_statement)).scalar()
    
    statement = statement.offset(skip).limit(limit)
    users = (await session.execute(statement)).scalars().all()

    return UsersPublic(data=users, count=count)


@router.get(
    '/search/',
    # dependencies=[Depends(get_current_active_superuser)],
    response_model=UsersPublic,
)
async def search_users(
    session: SessionDep,
    query: str = Query(..., description="Search query"),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Search users.
    """
    
    if not query:
        raise HTTPException(
            status_code=400,
            detail="Query cannot be empty",
        )
    
    words = query.split()

    conditions = []
    for word in words:
        conditions.append(User.name.ilike(f"%{word}%"))
        conditions.append(User.surname.ilike(f"%{word}%"))
        conditions.append(User.patronymic.ilike(f"%{word}%"))

    statement = select(User).where(or_(*conditions))

    count_statement = select(func.count()).select_from(statement.subquery())
    count = (await session.execute(count_statement)).scalar()

    statement = statement.offset(skip).limit(limit)

    users = (await session.execute(statement)).scalars().all()

    return UsersPublic(data=users, count=count)



@router.post(
    "/", dependencies=[Depends(get_current_active_superuser)], response_model=UserPublic
)
async def create_user(*, session: SessionDep, user_in: UserCreate) -> Any:
    """
    Create new user.
    """
    user = await crud.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )

    user = await crud.create_user(session=session, user_create=user_in)
    return user


@router.patch("/me", response_model=UserPublic)
async def update_user_me(
    *, session: SessionDep, user_in: UserUpdateMe, current_user: CurrentUser
) -> Any:
    """
    Update own user.
    """
    if user_in.email:
        existing_user = await crud.get_user_by_email(session=session, email=user_in.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=409, detail="User with this email already exists"
            )
    user_data = user_in.model_dump(exclude_unset=True)
    current_user.sqlmodel_update(user_data)
    session.add(current_user)
    await session.commit()
    await session.refresh(current_user)
    return current_user


@router.patch("/me/password", response_model=Message)
async def update_password_me(
    *, session: SessionDep, body: UpdatePassword, current_user: CurrentUser
) -> Any:
    """
    Update own password.
    """
    if not await verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    if body.current_password == body.new_password:
        raise HTTPException(
            status_code=400, detail="New password cannot be the same as the current one"
        )
    hashed_password = await get_password_hash(body.new_password)
    current_user.hashed_password = hashed_password
    session.add(current_user)
    await session.commit()
    return Message(message="Password updated successfully")


@router.get("/me", response_model=UserPublic)
async def read_user_me(current_user: CurrentUser) -> Any:
    """
    Get current user.
    """
    return current_user


@router.delete("/me", response_model=Message)
async def delete_user_me(session: SessionDep, current_user: CurrentUser) -> Any:
    """
    Delete own user.
    """
    if current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="Super users are not allowed to delete themselves"
        )
    statement = delete(Item).where(col(Item.owner_id) == current_user.id)
    await session.execute(statement)  # type: ignore
    await session.delete(current_user)
    await session.commit()
    return Message(message="User deleted successfully")


@router.post("/signup", response_model=UserPublic)
async def register_user(session: SessionDep, user_in: UserRegister) -> Any:
    """
    Create new user without the need to be logged in.
    """
    user = await crud.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    user_create = UserCreate.model_validate(user_in)
    user = await crud.create_user(session=session, user_create=user_create)
    return user


@router.get("/{user_id}", response_model=UserPublic)
async def read_user_by_id(
    user_id: uuid.UUID, session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Get a specific user by id.
    """
    user = await session.get(User, user_id)
    if user == current_user:
        return user
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403,
            detail="The user doesn't have enough privileges",
        )
    return user


@router.patch(
    "/{user_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UserPublic,
)
async def update_user(
    *,
    session: SessionDep,
    user_id: uuid.UUID,
    user_in: UserUpdate,
) -> Any:
    """
    Update a user.
    """

    db_user = await session.get(User, user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    if user_in.email:
        existing_user = await crud.get_user_by_email(session=session, email=user_in.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=409, detail="User with this email already exists"
            )

    db_user = await crud.update_user(session=session, db_user=db_user, user_in=user_in)
    return db_user


@router.delete("/{user_id}", dependencies=[Depends(get_current_active_superuser)])
async def delete_user(
    session: SessionDep, current_user: CurrentUser, user_id: uuid.UUID
) -> Message:
    """
    Delete a user.
    """
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user == current_user:
        raise HTTPException(
            status_code=403, detail="Super users are not allowed to delete themselves"
        )
    statement = delete(Item).where(col(Item.owner_id) == user_id)
    await session.execute(statement)  # type: ignore
    await session.delete(user)
    await session.commit()
    return Message(message="User deleted successfully")


@router.get('/generate_password/')
async def generate_password():
    return {"password": secrets.token_urlsafe(16)}

@router.post(
    '/send_new_password_on_mail',
)
async def send_new_password_on_mail(
    email: str,
    password: str,
    title: str
):
    email_data = await generate_new_password_email(
        email_to=email, username=email, password=password, title=title
    )
    await send_email(
        email_to=email,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return {"message": "Email sent successfully"}


@router.post(
    '/send_to_admin',
)
async def send_to_admin(
    send_to_admin_email_in: SendToAdminEmailIn
):
    email_data = await generate_text_email(
        name=send_to_admin_email_in.name,
        text=send_to_admin_email_in.text,
        email=send_to_admin_email_in.email
    )
    await send_email(
        email_to=settings.EMAILS_FROM_EMAIL,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return {"message": "Email sent successfully"}


