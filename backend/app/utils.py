import logging
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from app.models import Review
import emails  # type: ignore
import jwt
from jinja2 import Template
from jwt.exceptions import InvalidTokenError

from app.core.config import settings


@dataclass
class EmailData:
    html_content: str
    subject: str


async def render_email_template(*, template_name: str, context: dict[str, Any]) -> str:
    template_str = (
        Path(__file__).parent / "email-templates" / "build" / template_name
    ).read_text()
    html_content = Template(template_str).render(context)
    return html_content


async def send_email(
    *,
    email_to: str,
    subject: str = "",
    html_content: str = "",
) -> None:
    assert settings.emails_enabled, "no provided configuration for email variables"
    message = emails.Message(
        subject=subject,
        html=html_content,
        mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL),
    )
    smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}
    if settings.SMTP_TLS:
        smtp_options["tls"] = True
    elif settings.SMTP_SSL:
        smtp_options["ssl"] = True
    if settings.SMTP_USER:
        smtp_options["user"] = settings.SMTP_USER
    if settings.SMTP_PASSWORD:
        smtp_options["password"] = settings.SMTP_PASSWORD
    response = message.send(to=email_to, smtp=smtp_options)
    logging.info(f"send email result: {response}")


async def generate_test_email(email_to: str) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Test email"
    html_content = await render_email_template(
        template_name="test_email.html",
        context={"project_name": settings.PROJECT_NAME, "email": email_to},
    )
    return EmailData(html_content=html_content, subject=subject)


async def generate_text_email(name: str, text: str, email: str) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Text email"
    html_content = await render_email_template(
        template_name="text_email.html",
        context={"project_name": settings.PROJECT_NAME,
                 "text": text, "name": name, "email": email},
    )
    return EmailData(html_content=html_content, subject=subject)


async def generate_new_password_email(
    email_to: str, username: str, password: str, title: str
) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} {title} {username}"
    subject = f"{project_name} {title} {username}"
    html_content = await render_email_template(
        template_name="new_account.html",
        context={
            "project_name": settings.PROJECT_NAME,
            "username": username,
            "password": password,
            "email": email_to,
            "link": settings.FRONTEND_HOST,
        },
    )
    return EmailData(html_content=html_content, subject=subject)


async def generate_password_reset_token(email: str) -> str:
    delta = timedelta(hours=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS)
    now = datetime.now(timezone.utc)
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email},
        settings.SECRET_KEY,
        algorithm="HS256",
    )
    return encoded_jwt


async def verify_password_reset_token(token: str) -> str | None:
    try:
        decoded_token = jwt.decode(
            token, settings.SECRET_KEY, algorithms=["HS256"])
        return str(decoded_token["sub"])
    except InvalidTokenError:
        return None


async def calculate_average_event_quality(reviews: list[Review]) -> float:
    return sum(review.event_quality for review in reviews) / len(reviews)


async def calculate_average_material_clarity(reviews: list[Review]) -> float:
    return sum(review.material_clarity for review in reviews) / len(reviews)


async def calculate_average_teaching_quality(reviews: list[Review]) -> float:
    return sum(review.teaching_quality for review in reviews) / len(reviews)


async def get_answers_to_questions(reviews: list[Review]) -> list[dict[str, str]]:
    answers_to_questions = []
    for review in reviews:
        answers_to_questions.append({
            "answer_to_question_1": review.answer_to_question_1,
            "answer_to_question_2": review.answer_to_question_2,
            "answer_to_question_3": review.answer_to_question_3,
        })
    return answers_to_questions
