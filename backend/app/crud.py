import uuid
from typing import Any

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.security import get_password_hash, verify_password
from app.models import (
    Attendance, AttendanceCreate, BackForm, BackFormCreate,
    Class, ClassCreate, ClassUpdate,
    Item, ItemCreate,
    QRCode,
    Review, ReviewCreate,
    Role, RoleCreate,
    Room,
    Subject, SubjectCreate,
    User, UserCreate, UserUpdate
)


async def create_user(*, session: AsyncSession, user_create: UserCreate) -> User:
    statement = select(Role.id)
    roles_ids = (await session.execute(statement)).scalars().all()
    if user_create.role_id not in roles_ids:
        raise HTTPException(
            status_code=400,
            detail="Role not found",
        )
    
    db_obj = User.model_validate(
        user_create,
        update={
            "hashed_password": await get_password_hash(user_create.password),
            'role_id': user_create.role_id
        },
    )
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj


async def update_user(*, session: AsyncSession, db_user: User, user_in: UserUpdate) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = await get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return db_user


async def get_user_by_email(*, session: AsyncSession, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = (await session.execute(statement)).scalars().first()
    return session_user


async def authenticate(*, session: AsyncSession, email: str, password: str) -> User | None:
    db_user = await get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not await verify_password(password, db_user.hashed_password):
        return None
    return db_user


async def create_item(*, session: AsyncSession, item_in: ItemCreate, owner_id: uuid.UUID) -> Item:
    db_item = Item.model_validate(item_in, update={"owner_id": owner_id})
    session.add(db_item)
    await session.commit()
    await session.refresh(db_item)
    return db_item

async def create_role(*, session: AsyncSession, role_create: RoleCreate) -> Role:
    db_obj = Role.model_validate(role_create)
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj

async def get_role_by_id(*, session: AsyncSession, role_id: uuid.UUID) -> Role | None:
    statement = select(Role).where(Role.id == role_id)
    session_role = (await session.execute(statement)).scalars().first()
    return session_role

async def get_role_by_name(*, session: AsyncSession, name: str) -> Role | None:
    statement = select(Role).where(Role.name == name)
    session_role = (await session.execute(statement)).scalars().first()
    return session_role

async def create_subject(*, session: AsyncSession, subject_create: SubjectCreate) -> Subject:
    db_obj = Subject.model_validate(subject_create)
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj

async def get_subject_by_name(*, session: AsyncSession, name: str) -> Subject | None:
    statement = select(Subject).where(Subject.name == name)
    session_subject = (await session.execute(statement)).scalars().first()
    return session_subject

async def create_class(*, session: AsyncSession, class_create: ClassCreate) -> Class:
    db_obj = Class.model_validate(
        class_create,
        update={
            'updated_at': class_create.updated_at,
            'start_time': class_create.start_time.replace(tzinfo=None),
            'end_time': class_create.end_time.replace(tzinfo=None),
        }
    )
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj

async def update_class(*, session: AsyncSession, class_: Class, class_in: ClassUpdate) -> Any:
    class_data = class_in.model_dump(exclude_unset=True)
    class_.sqlmodel_update(class_data)
    session.add(class_)
    await session.commit()
    await session.refresh(class_)
    return class_

async def create_review(*, session: AsyncSession, review_create: ReviewCreate) -> Review:
    db_obj = Review.model_validate(review_create)
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj

async def get_room_by_number(*, session: AsyncSession, name: str) -> Room | None:
    statement = select(Room).where(Room.number == name)
    session_room = (await session.execute(statement)).scalars().first()
    return session_room

async def create_room(*, session: AsyncSession, room_create: Room) -> Room:
    db_obj = Room.model_validate(room_create)
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj

async def create_attendance(*, session: AsyncSession, attendance_in: AttendanceCreate) -> Attendance:
    db_obj = Attendance.model_validate(attendance_in)
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj

async def get_qr_code_by_class_id(class_id, session: AsyncSession) -> QRCode:
    statement = select(QRCode).where(QRCode.class_id == class_id)
    qr_code = (await session.execute(statement)).scalars().all()[-1]
    return qr_code

async def create_backform(session: AsyncSession, backform_create: BackFormCreate) -> BackForm:
    db_obj = BackForm.model_validate(
        backform_create,
        update={
            'created_at': backform_create.created_at,
            'updated_at': backform_create.updated_at,
            'end_of_active_status': backform_create.end_of_active_status.replace(tzinfo=None),
        }
    )
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj

async def get_backform_by_id(session: AsyncSession, backform_id: uuid.UUID) -> BackForm | None:
    statement = select(BackForm).where(BackForm.id == backform_id)
    backform = (await session.execute(statement)).scalars().first()
    return backform

async def get_backform_by_class_id(session: AsyncSession, class_id: uuid.UUID) -> BackForm | None:
    statement = select(BackForm).where(BackForm.class_id == class_id)
    backform = (await session.execute(statement)).scalars().first()
    return backform
