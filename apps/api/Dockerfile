FROM node:24-alpine as base
ENV NODE_ENV=production
WORKDIR /app

FROM base as bun
RUN npm install -g bun turbo

FROM bun as prepare
RUN bun add -g turbo
COPY . .
RUN turbo prune api --docker

FROM bun AS builder
COPY --from=prepare /app/out/json/ .
RUN bun i --no-safe
COPY --from=prepare /app/out/full/ .
RUN bun run build:api

FROM base AS runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nitro
USER nitro
ENV NODE_ENV=production

COPY --from=builder --chown=nitro:nodejs /app ./
WORKDIR /app/apps/api

EXPOSE 3000
CMD node .output/server/index.mjs
