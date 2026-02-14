FROM node:24-alpine AS builder

RUN npm install -g bun
WORKDIR /app
ENV NODE_ENV=production

COPY package.json bun.lock* turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN bun install --frozen-lockfile
RUN bun run build:api

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app ./
WORKDIR /app/apps/api

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
