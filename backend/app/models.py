from datetime import datetime
from email.policy import default
from typing import Optional
import uuid

from click import Option
from networkx import null_graph

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    name: str | None = Field(default=None, max_length=255)
    surname: str | None = Field(default=None, max_length=255)
    patronymic: str | None = Field(default=None, max_length=255)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)
    role_id: uuid.UUID = Field(
        foreign_key="role.id", nullable=True, ondelete="SET NULL"
    )


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    name: str | None = Field(default=None, max_length=255)
    surname: str | None = Field(default=None, max_length=255)
    patronymic: str | None = Field(default=None, max_length=255)
    role_id: uuid.UUID = Field(
        foreign_key="role.id", nullable=True, ondelete="SET NULL"
    )


class UserUpdate(UserBase):
    email: EmailStr | None = Field(
        default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    name: str | None = Field(default=None, max_length=255)
    surname: str | None = Field(default=None, max_length=255)
    patronymic: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    role_id: uuid.UUID = Field(
        foreign_key="role.id", nullable=True, ondelete="CASCADE"
    )
    role: Optional["Role"] = Relationship(back_populates="users")
    items: list["Item"] = Relationship(
        back_populates="owner", cascade_delete=True)
    classes: list["Class"] = Relationship(back_populates="teacher")
    ical_schedulers: list["iCalScheduler"] = Relationship(back_populates="teacher")
    export_setting: Optional["ExportSetting"] = Relationship(back_populates="teacher")


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
    title: str | None = Field(
        default=None, min_length=1, max_length=255)  # type: ignore


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
    users: list["User"] = Relationship(
        back_populates="role", cascade_delete=True)


class RolePublic(RoleBase):
    id: uuid.UUID


class RolesPublic(SQLModel):
    data: list[RolePublic]
    count: int


class ClassBase(SQLModel):
    name: str = Field(max_length=255)
    description: str | None = Field(default=None, max_length=255)
    start_time: datetime = Field(default=datetime.now)
    end_time: datetime = Field(default=datetime.now)


class ClassCreate(ClassBase):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    subject_id: uuid.UUID = Field(
        foreign_key="subject.id", nullable=False, ondelete="CASCADE"
    )
    teacher_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )


class ClassUpdate(ClassBase):
    name: str | None = Field(default=None, max_length=255)
    description: str | None = Field(default=None, max_length=255)
    start_time: datetime | None = Field(default=None)
    end_time: datetime | None = Field(default=None)
    updated_at: datetime = Field(default_factory=datetime.now)


class Class(ClassBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    teacher_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    subject_id: uuid.UUID = Field(
        foreign_key="subject.id", nullable=False, ondelete="CASCADE"
    )
    subject: Optional["Subject"] = Relationship(back_populates="classes")
    teacher: Optional["User"] = Relationship(back_populates="classes")
    attendances: list["Attendance"] = Relationship(
        back_populates="class_", cascade_delete=True)
    backform: Optional["BackForm"] = Relationship(back_populates="class_")
    reviews: list["Review"] = Relationship(
        back_populates="class_", cascade_delete=True)


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
    classes: list["Class"] = Relationship(
        back_populates="subject", cascade_delete=True)
    ical_schedulers: list["iCalScheduler"] = Relationship(back_populates="subject")


class SubjectPublic(SubjectBase):
    id: uuid.UUID


class SubjectsPublic(SQLModel):
    data: list[SubjectPublic]
    count: int

class RoomBase(SQLModel):
    number: str = Field(max_length=50)
    capacity: int


class RoomCreate(RoomBase):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class RoomUpdate(RoomBase):
    number: str | None = Field(default=None, max_length=50)
    capacity: int | None = Field(default=None)
    updated_at: datetime = Field(default_factory=datetime.now)


class Room(RoomBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class RoomPublic(RoomBase):
    id: uuid.UUID


class RoomsPublic(SQLModel):
    data: list[RoomPublic]
    count: int


class AttendanceBase(SQLModel):
    student_full_name: str = Field(max_length=255)
    class_id: uuid.UUID = Field(
        foreign_key="class.id", nullable=False, ondelete="CASCADE"
    )


class AttendanceCreate(AttendanceBase):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class AttendanceUpdate(AttendanceBase):
    student_full_name: str | None = Field(default=None, max_length=255)
    updated_at: datetime = Field(default_factory=datetime.now)


class Attendance(AttendanceBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
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
    study_group: str = Field(default=None, max_length=255)
    answer_to_question_1: str | None = Field(default=None, max_length=255)
    answer_to_question_2: str | None = Field(default=None, max_length=255)
    answer_to_question_3: str | None = Field(default=None, max_length=255)


class ReviewCreate(ReviewBase):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    class_id: uuid.UUID = Field(
        foreign_key="class.id", nullable=False, ondelete="CASCADE"
    )


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
    
class QRCode(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    backform_id: uuid.UUID = Field(
        foreign_key="backform.id", nullable=False, ondelete="CASCADE"
    )
    backform: Optional["BackForm"] = Relationship(back_populates="qr_code")
    qr_code: bytes
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    expiration_date: datetime = Field(default_factory=datetime.now)
    
class BackFormBase(SQLModel):
    class_theme: str = Field(max_length=255)
    additional_question_1: str | None = Field(default=None, max_length=255)
    additional_question_2: str | None = Field(default=None, max_length=255)
    additional_question_3: str | None = Field(default=None, max_length=255)
    end_of_active_status: datetime = Field(default=datetime.now)
    
class BackFormCreate(BackFormBase):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    class_id: uuid.UUID = Field(
        foreign_key="class.id", nullable=False, ondelete="CASCADE"
    )
    
class BackFormUpdate(BackFormBase):
    class_theme: str | None = Field(default=None, max_length=255)
    additional_question_1: str | None = Field(default=None, max_length=255)
    additional_question_2: str | None = Field(default=None, max_length=255)
    additional_question_3: str | None = Field(default=None, max_length=255)
    updated_at: datetime = Field(default_factory=datetime.now)
    end_of_active_status: datetime = Field(default=datetime.now)
    
class BackForm(BackFormBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    class_id: uuid.UUID = Field(
        foreign_key="class.id", nullable=False, ondelete="CASCADE"
    )
    class_: Optional["Class"] = Relationship(back_populates="backform")
    qr_code: Optional["QRCode"] = Relationship(back_populates="backform")
    
class BackFormPublic(BackFormBase):
    id: uuid.UUID
    class_id: uuid.UUID
    
class BackFormsPublic(SQLModel):
    data: list[BackFormPublic]
    count: int
    
class ExportSettingBase(SQLModel):
    frequency: str = Field(max_length=255)
    next_export_date: datetime = Field(default=datetime.now)

class ExportSettingCreate(ExportSettingBase):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    teacher_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    
class ExportSettingUpdate(ExportSettingBase):
    frequency: str | None = Field(default=None, max_length=255)
    next_export_date: datetime = Field(default=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class ExportSetting(ExportSettingBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    teacher_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    teacher: Optional["User"] = Relationship(back_populates="export_setting")
    
class ExportSettingPublic(ExportSettingBase):
    id: uuid.UUID
    teacher_id: uuid.UUID
    
class ExportSettingsPublic(SQLModel):
    data: list[ExportSettingPublic]
    count: int
    
class iCalSchedulerBase(SQLModel):
    day_of_week: int
    start_time: datetime
    end_time: datetime
    location: str = Field(max_length=255)
    study_groups: str = Field(max_length=255)
    is_excluded: bool = Field(default=False)

class iCalSchedulerCreate(iCalSchedulerBase):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    teacher_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    subject_id: uuid.UUID = Field(
        foreign_key="subject.id", nullable=False, ondelete="CASCADE"
    )
    
class iCalSchedulerUpdate(iCalSchedulerBase):
    day_of_week: int | None = Field(default=None)
    start_time: datetime | None = Field(default=None)
    end_time: datetime | None = Field(default=None)
    location: str | None = Field(default=None, max_length=255)
    study_groups: str | None = Field(default=None, max_length=255)
    is_excluded: bool | None = Field(default=None)
    updated_at: datetime = Field(default_factory=datetime.now)
    
class iCalScheduler(iCalSchedulerBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    teacher_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    subject_id: uuid.UUID = Field(
        foreign_key="subject.id", nullable=False, ondelete="CASCADE"
    )
    teacher: Optional["User"] = Relationship(back_populates="ical_schedulers")
    subject: Optional["Subject"] = Relationship(back_populates="ical_schedulers")
    
class iCalSchedulerPublic(iCalSchedulerBase):
    id: uuid.UUID
    teacher_id: uuid.UUID
    subject_id: uuid.UUID
    
class iCalSchedulersPublic(SQLModel):
    data: list[iCalSchedulerPublic]
    count: int
