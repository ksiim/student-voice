
from sqlalchemy import select as select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

from app.core.config import settings
from app.models import RoleCreate, User, UserCreate
from app.crud import create_role, create_user

async_engine = create_async_engine(str(settings.SQLALCHEMY_DATABASE_URI))


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


async def init_db(session: AsyncSession) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # from app.core.engine import engine
    # This works because the models are already imported and registered from app.models
    # SQLModel.metadata.create_all(engine)

    user = (await session.execute(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    )).first()
    if not user:
        teacher_role_in = RoleCreate(
            name='teacher'
        )
        teacher_role = await create_role(session=session, role_create=teacher_role_in)
        
        admin_role_in = RoleCreate(
            name='admin'
        )
        admin_role = await create_role(session=session, role_create=admin_role_in)
        
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            is_superuser=True,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            role_id=admin_role.id,
        )
        user = await create_user(session=session, user_create=user_in)
        