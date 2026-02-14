FROM node:24-alpine AS base

FROM base AS bun
RUN npm install -g bun

# Build stage
FROM bun AS builder
RUN npm install -g bun
WORKDIR /app
COPY package.json bun.lock* ./
COPY turbo.json ./
COPY apps/api ./apps/api
COPY packages ./packages
RUN bun install --no-save
RUN bun build:api


FROM base AS runner
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
WORKDIR /app/apps/api
CMD ["node", ".output/server/index.mjs"]
