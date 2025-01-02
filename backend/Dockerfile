FROM python:3.10

RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    unzip \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libnspr4 \
    libnss3 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    chromium

RUN apt-get install -y curl && \
    CHROME_DRIVER_VERSION=$(curl -sS https://chromedriver.storage.googleapis.com/LATEST_RELEASE) && \
    wget -O /tmp/chromedriver.zip https://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip && \
    unzip /tmp/chromedriver.zip -d /usr/local/bin && \
    rm /tmp/chromedriver.zip

RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    unzip \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libnspr4 \
    libnss3 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    chromium

# Установка ChromeDriver
RUN apt-get install -y curl && \
    CHROME_DRIVER_VERSION=$(curl -sS https://chromedriver.storage.googleapis.com/LATEST_RELEASE) && \
    wget -O /tmp/chromedriver.zip https://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip && \
    unzip -o /tmp/chromedriver.zip -d /usr/local/bin && \
    rm /tmp/chromedriver.zip

WORKDIR /app/

# Install uv
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#installing-uv
COPY --from=ghcr.io/astral-sh/uv:0.4.15 /uv /bin/uv

# Place executables in the environment at the front of the path
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#using-the-environment
ENV PATH="/app/.venv/bin:$PATH"

# Compile bytecode
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#compiling-bytecode
ENV UV_COMPILE_BYTECODE=1

# uv Cache
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#caching
ENV UV_LINK_MODE=copy

# Install dependencies
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#intermediate-layers
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project

ENV PYTHONPATH=/app

COPY ./scripts /app/scripts

COPY ./pyproject.toml ./uv.lock ./alembic.ini /app/

COPY ./app /app/app

# Sync the project
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#intermediate-layers
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync

CMD ["fastapi", "run", "--workers", "4", "app/main.py"]
