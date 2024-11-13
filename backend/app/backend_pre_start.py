import asyncio
import logging

from sqlalchemy import Engine, text
from sqlmodel import Session, select
from sqlalchemy.ext.asyncio import AsyncSession
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

from app.core.db import async_engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

max_tries = 60 * 5  # 5 minutes
wait_seconds = 1


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
async def init(db_engine: Engine) -> None:
    try:
        async with AsyncSession(db_engine) as session:
            # Try to create session to check if DB is awake
            await session.execute(text('DROP TABLE alembic_version'))
            await session.commit()
            await session.execute(select(1))
    except Exception as e:
        logger.error(e)
        raise e

async def main() -> None:
    logger.info("Initializing service")
    await init(async_engine)
    logger.info("Service finished initializing")


if __name__ == "__main__":
    asyncio.run(main())
