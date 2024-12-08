# Stage 0, "development-stage", based on Node.js, for hot-reloading
FROM node:20 AS dev-stage

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json /app/
RUN npm install

# Копируем весь проект
COPY ./ /app/

# Stage 1, "build-stage", for production build
FROM node:20 AS build-stage

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY ./ /app/
ARG VITE_API_URL
RUN npm run build

# Stage 2, "production-stage", based on Nginx
FROM nginx:1 AS production-stage

COPY --from=build-stage /app/dist/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx-backend-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf
