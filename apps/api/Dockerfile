# Build stage
FROM oven/bun:1.2 AS builder
WORKDIR /app
COPY package.json ./
COPY turbo.json ./
COPY apps/api ./apps/api
COPY packages ./packages
RUN bun install
RUN bun build:api

# Production stage
FROM oven/bun:1-slim
WORKDIR /app/apps/api
COPY --from=builder /app/apps/api/.output/index.js .
EXPOSE 3000
CMD ["node", "index.js"]
