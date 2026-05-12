FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
ENV DISPLAY=:99
ENV PULSE_SINK=kuraviz_sink
ENV IS_CONTAINER=1

# ── System packages ─────────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    xvfb \
    pulseaudio \
    ffmpeg \
    curl \
    ca-certificates \
    gnupg \
    python3 \
    # Firefox runtime deps
    libgtk-3-0 \
    libdbus-glib-1-2 \
    libxt6 \
    libnss3 \
    libasound2t64 \
    libxss1 \
    libgbm1 \
    libxrandr2 \
    libxcomposite1 \
    libxcursor1 \
    libxi6 \
    libxtst6 \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    fonts-liberation \
    fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*

# ── Node.js 22 ──────────────────────────────────────────────────────────────
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# ── App dependencies + Playwright Firefox ────────────────────────────────────
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install \
    && npx playwright install firefox \
    && rm -rf /var/lib/apt/lists/*

# ── Tool scripts ────────────────────────────────────────────────────────────
COPY tools/capture.mjs tools/test-collisions.mjs tools/
COPY tools/docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
