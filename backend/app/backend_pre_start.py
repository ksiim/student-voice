import asyncio
import logging

from sqlalchemy import Engine, text
from sqlmodel import Session, select
from sqlalchemy.ext.asyncio import AsyncSession
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed
from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

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
            await session.execute(text('DROP TABLE IF EXISTS alembic_version;'))
            await session.commit()
            # Try to create session to check if DB is awake
            await session.execute(select(1))
    except Exception as e:
        logger.error(e)
        raise e

async def main() -> None:
    logger.info("Initializing service")

    logger_selenium = logging.getLogger('selenium')
    logger_selenium.setLevel(logging.DEBUG)

    
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.get("https://python.org")
    print(driver.title)
    driver.close()
    
    await init(async_engine)
    logger.info("Service finished initializing")


if __name__ == "__main__":
    asyncio.run(main())
