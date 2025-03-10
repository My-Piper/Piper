FROM node:22

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    ffmpeg \
    socat

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
    google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./backend/package-lock.json ./backend/package-lock.json
COPY ./backend/package.json ./backend/package.json
COPY ./frontend/package-lock.json ./frontend/package-lock.json
COPY ./frontend/package.json ./frontend/package.json

RUN npm --prefix ./backend ci
RUN npm --prefix ./frontend ci

COPY ./backend ./backend
COPY ./frontend ./frontend

RUN npm --prefix ./frontend run build

EXPOSE 8080

CMD npm run --prefix ./backend server
