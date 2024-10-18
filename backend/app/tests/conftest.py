import pytest

from collections.abc import AsyncGenerator

from httpx import AsyncClient

from fastapi.testclient import TestClient

from sqlmodel import AsyncSession, delete

from app.core.config import settings
from app.core.db import async_engine, init_db
from app.main import app
from app.models import Item, User
from app.tests.utils.user import authentication_token_from_email
from app.tests.utils.utils import get_superuser_token_headers


@pytest.fixture(scope="session", autouse=True)
async def db():
    async with AsyncSession(async_engine) as session:
        await init_db(session)
        yield session
        statement = delete(Item)
        await session.execute(statement)
        statement = delete(User)
        await session.execute(statement)
        await session.commit()


@pytest.fixture(scope="module")
async def client() -> AsyncGenerator[AsyncClient, None, None]:
    async with AsyncClient(app) as c:
        yield c


@pytest.fixture(scope="module")
async def superuser_token_headers(client: TestClient) -> dict[str, str]:
    return get_superuser_token_headers(client)


@pytest.fixture(scope="module")
async def normal_user_token_headers(client: TestClient, db: AsyncSession) -> dict[str, str]:
    return await authentication_token_from_email(
        client=client, email=settings.EMAIL_TEST_USER, db=db
    )
