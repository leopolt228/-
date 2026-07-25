FROM node:24.15-slim

# Install build tools for native SQLite modules (better-sqlite3)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Enable pnpm package manager
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy pnpm workspace configuration & manifests
COPY package.json pnpm-workspace.yaml .npmrc openclaw.mjs railway.json ./
COPY packages/ ./packages/
COPY extensions/ ./extensions/
COPY dist/ ./dist/
COPY scripts/ ./scripts/

# Run pnpm install to install dependencies & create @openclaw/* workspace links
RUN NODE_OPTIONS="--max-old-space-size=2048" pnpm install --prod --no-frozen-lockfile --ignore-scripts

# Create app data directory
RUN mkdir -p /app/data && chmod -R 777 /app/data

ENV NODE_OPTIONS="--max-old-space-size=384"
ENV NODE_ENV=production
ENV OPENCLAW_STATE_DIR=/app/data
ENV OPENCLAW_CONFIG_PATH=/app/data/openclaw.json
ENV OPENCLAW_GATEWAY_TOKEN=bf8b765dcc89a10103317b6918e370b301da4f520a058efa

EXPOSE 10000 3000

# Run bootstrap then start gateway listening explicitly on dynamic PORT
CMD ["sh", "-c", "node scripts/huggingface-bootstrap.mjs && node openclaw.mjs gateway run --bind lan --port ${PORT:-10000} --token bf8b765dcc89a10103317b6918e370b301da4f520a058efa"]
