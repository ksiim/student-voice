from fastapi import APIRouter, Depends
from pydantic.networks import EmailStr

from app.api.deps import get_current_active_superuser
from app.models import Message
from app.utils import generate_test_email, send_email

import asyncio
import aiohttp
from pyppeteer import launch

router = APIRouter()


@router.post(
    "/test-email/",
    dependencies=[Depends(get_current_active_superuser)],
    status_code=201,
)
async def test_email(email_to: EmailStr) -> Message:
    """
    Test emails.
    """
    email_data = await generate_test_email(email_to=email_to)
    await send_email(
        email_to=email_to,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return Message(message="Test email sent")


@router.get("/health-check/")
async def health_check() -> bool:
    return True


from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import asyncio

class ModeusParser:
    link = 'https://urfu.modeus.org/'
    username = 'makskrutchev@gmail.com'
    password = 'Maks2006!!!'

    def __init__(self):
        self.driver = None

    def start_browser(self):
        """Запускает браузер с помощью Selenium."""
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Запуск в фоновом режиме
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        self.driver = webdriver.Chrome(service=Service(), options=chrome_options)

    def close_browser(self):
        """Закрывает браузер."""
        if self.driver:
            self.driver.quit()

    def login(self):
        """Авторизуется на сайте Modeus."""
        self.driver.get(self.link)

        # Ввод логина и пароля
        username_input = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.NAME, "username"))
        )
        username_input.send_keys(self.username)

        password_input = self.driver.find_element(By.NAME, "password")
        password_input.send_keys(self.password)

        # Нажатие кнопки входа
        submit_button = self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        submit_button.click()

        # Ожидание перехода на следующую страницу
        WebDriverWait(self.driver, 10).until(
            EC.url_to_be(self.link)
        )

    def get_html(self):
        """Получает HTML-код текущей страницы."""
        return self.driver.page_source

    def parse_page(self):
        """Парсит текущую страницу."""
        html = self.get_html()
        print(html)  # Здесь можно добавить логику парсинга с помощью BeautifulSoup или selectolax

    async def main(self):
        """Основная функция для выполнения парсинга."""
        try:
            self.start_browser()
            self.login()
            self.parse_page()
        finally:
            self.close_browser()