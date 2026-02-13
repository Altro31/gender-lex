# Build stage
FROM node:24-alpine AS builder
RUN npm install -g bun
WORKDIR /app
COPY package.json ./
COPY turbo.json ./
COPY apps/api ./apps/api
COPY packages ./packages
RUN bun i --frozen-lockfile
RUN bun build:api

# Production stage
FROM node:24-alpine
WORKDIR /app/apps/api
COPY --from=builder /app/apps/api/.output/index.js .
EXPOSE 3000
CMD ["node", "index.js"]
