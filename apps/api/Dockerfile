FROM node:24-alpine AS base

# Build stage
FROM base AS builder
RUN npm install -g bun
WORKDIR /app
COPY package.json bun.lock* ./
COPY turbo.json ./
COPY apps/api ./apps/api
COPY packages ./packages
RUN bun install --no-save
RUN bun build:api

# Production stage
FROM base
WORKDIR /app
COPY --from=builder /app/apps/api/.output .
EXPOSE 3000
CMD ["node", "server/index.mjs"]
