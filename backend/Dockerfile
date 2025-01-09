FROM python:3.10

# RUN apt-get update -qq -y && \
#     apt-get install -y \
#         libasound2 \
#         libatk-bridge2.0-0 \
#         libgtk-4-1 \
#         libnss3 \
#         xdg-utils \
#         wget && \
#     wget -q -O chrome-linux64.zip https://bit.ly/chrome-linux64-121-0-6167-85 && \
#     unzip chrome-linux64.zip && \
#     rm chrome-linux64.zip && \
#     mv chrome-linux64 /opt/chrome/ && \
#     ln -s /opt/chrome/chrome /usr/local/bin/ && \
#     wget -q -O chromedriver-linux64.zip https://chromedriver.storage.googleapis.com/121.0.6167.85/chromedriver_linux64.zip && \
#     unzip -j chromedriver-linux64.zip chromedriver-linux64/chromedriver && \
#     rm chromedriver-linux64.zip && \
#     mv chromedriver /usr/local/bin/

# # Установка зависимостей
#     RUN apt-get update -qq -y && \
#     apt-get install -y \
#         libasound2 \
#         libatk-bridge2.0-0 \
#         libgtk-4-1 \
#         libnss3 \
#         xdg-utils \
#         wget && \
#     wget -q -O chrome-linux64.zip https://bit.ly/chrome-linux64-121-0-6167-85 && \
#     unzip chrome-linux64.zip && \
#     rm chrome-linux64.zip && \
#     mv chrome-linux64 /opt/chrome/ && \
#     ln -s /opt/chrome/chrome /usr/local/bin/ && \
#     wget -q -O chromedriver-linux64.zip https://bit.ly/chromedriver-linux64-121-0-6167-85 && \
#     unzip -j chromedriver-linux64.zip chromedriver-linux64/chromedriver && \
#     rm chromedriver-linux64.zip && \
#     mv chromedriver /usr/local/bin/


WORKDIR /app/

# Установка uv
COPY --from=ghcr.io/astral-sh/uv:0.4.15 /uv /bin/uv

# Обновление PATH
ENV PATH="/app/.venv/bin:$PATH"
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Установка зависимостей через uv
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project

ENV PYTHONPATH=/app

COPY ./scripts /app/scripts
COPY ./pyproject.toml ./uv.lock ./alembic.ini /app/
COPY ./app /app/app

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync

CMD ["fastapi", "run", "--workers", "4", "app/main.py"]