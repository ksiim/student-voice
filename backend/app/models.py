from datetime import datetime
from typing import Optional, Union
import uuid

from click import Option
from networkx import null_graph

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    role_id: uuid.UUID = Field(
        foreign_key="role.id", nullable=False, ondelete="CASCADE"
    )
    role: Optional["Role"] = Relationship(back_populates="users")


class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


class ItemCreate(ItemBase):
    pass


class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


class Message(SQLModel):
    message: str


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)
    
class RoleBase(SQLModel):
    name: str = Field(max_length=255)
    

class RoleCreate(RoleBase):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class RoleUpdate(RoleBase):
    name: str | None = Field(default=None, max_length=255)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class Role(RoleBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    users: list["User"] = Relationship(back_populates="roles", cascade_delete=True)
    

class RolePublic(RoleBase):
    id: uuid.UUID
    
class RolesPublic(SQLModel):
    data: list[RolePublic]
    count: int
    
class ClassBase(SQLModel):
    name: str = Field(max_length=255)
    description: str | None = Field(default=None, max_length=255)
    start_time: datetime | None = Field(default_factory=datetime.now)
    end_time: datetime | None = Field(default_factory=datetime.now)
    end_of_active_status: datetime | None = Field(default_factory=datetime.now)
    
class ClassCreate(ClassBase):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class ClassUpdate(ClassBase):
    name: str | None = Field(default=None, max_length=255)
    description: str | None = Field(default=None, max_length=255)
    start_time: datetime | None = Field(default_factory=datetime.now)
    end_time: datetime | None = Field(default_factory=datetime.now)
    end_of_active_status: datetime | None = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class Class(ClassBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    teacher_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    subject_id: uuid.UUID = Field(
        foreign_key="subject.id", nullable=False, ondelete="CASCADE"
    )
    # location: 
    users: list["User"] = Relationship(back_populates="classes", cascade_delete=True)
    subject: Optional["Subject"] = Relationship(back_populates="classes")
    teacher: Optional["User"] = Relationship(back_populates="classes")
    
class ClassPublic(ClassBase):
    id: uuid.UUID
    teacher_id: uuid.UUID
    subject_id: uuid.UUID
    
class ClassesPublic(SQLModel):
    data: list[ClassPublic]
    count: int
    
class SubjectBase(SQLModel):
    name: str = Field(max_length=255)
    
class SubjectCreate(SubjectBase):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class SubjectUpdate(SubjectBase):
    name: str | None = Field(default=None, max_length=255)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class Subject(SubjectBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    classes: list["Class"] = Relationship(back_populates="subjects", cascade_delete=True)

class SubjectPublic(SubjectBase):
    id: uuid.UUID
    
class SubjectsPublic(SQLModel):
    data: list[SubjectPublic]
    count: int
    
class BuildingBase(SQLModel):
    name: str = Field(max_length=255)
    address: str = Field(max_length=255)
    
class BuildingCreate(BuildingBase):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class BuildingUpdate(BuildingBase):
    name: str | None = Field(default=None, max_length=255)
    address: str | None = Field(default=None, max_length=255)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class Building(BuildingBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    rooms: list["Room"] = Relationship(back_populates="buildings", cascade_delete=True)
    
class BuildingPublic(BuildingBase):
    id: uuid.UUID
    
class BuildingsPublic(SQLModel):
    data: list[BuildingPublic]
    count: int
    
class RoomBase(SQLModel):
    room_number: str = Field(max_length=50)
    capacity: int
    
class RoomCreate(RoomBase):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class RoomUpdate(RoomBase):
    room_number: str | None = Field(default=None, max_length=50)
    capacity: int | None = Field(default=None)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class Room(RoomBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    building_id: uuid.UUID = Field(
        foreign_key="building.id", nullable=False, ondelete="CASCADE"
    )
    building: Optional["Building"] = Relationship(back_populates="rooms")
    
class RoomPublic(RoomBase):
    id: uuid.UUID
    building_id: uuid.UUID
    
class RoomsPublic(SQLModel):
    data: list[RoomPublic]
    count: int
    
class AttendanceBase(SQLModel):
    student_full_name: str = Field(max_length=255)
    
class AttendanceCreate(AttendanceBase):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class AttendanceUpdate(AttendanceBase):
    student_full_name: str | None = Field(default=None, max_length=255)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class Attendance(AttendanceBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    class_id: uuid.UUID = Field(
        foreign_key="class.id", nullable=False, ondelete="CASCADE"
    )
    class_: Optional["Class"] = Relationship(back_populates="attendances")
    
class AttendancePublic(AttendanceBase):
    id: uuid.UUID
    class_id: uuid.UUID
    
class AttendancesPublic(SQLModel):
    data: list[AttendancePublic]
    count: int
    
class ReviewBase(SQLModel):
    comment: str = Field(max_length=255)
    teaching_quality: int
    material_clarity: int
    event_quality: int
    
class ReviewCreate(ReviewBase):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class ReviewUpdate(ReviewBase):
    comment: str | None = Field(default=None, max_length=255)
    teaching_quality: int | None = Field(default=None)
    material_clarity: int | None = Field(default=None)
    event_quality: int | None = Field(default=None)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class Review(ReviewBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    class_id: uuid.UUID = Field(
        foreign_key="class.id", nullable=False, ondelete="CASCADE"
    )
    class_: Optional["Class"] = Relationship(back_populates="reviews")
    
class ReviewPublic(ReviewBase):
    id: uuid.UUID
    class_id: uuid.UUID
    
class ReviewsPublic(SQLModel):
    data: list[ReviewPublic]
    count: int