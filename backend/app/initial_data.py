import asyncio
import logging

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import async_engine, init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def init() -> None:
    async with AsyncSession(async_engine) as session:
        await init_db(session)


async def main() -> None:
    logger.info("Creating initial data")
    await init()
    logger.info("Initial data created")


if __name__ == "__main__":
    asyncio.run(main())
