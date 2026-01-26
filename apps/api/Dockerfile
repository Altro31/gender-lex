# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy workspace files
COPY package.json ./
COPY turbo.json ./
COPY apps/api ./apps/api
COPY packages ./packages

# Install dependencies
RUN bun install --frozen-lockfile

# Build the application
RUN bun build:api

# Production stage
FROM oven/bun:1-slim

WORKDIR /app

# Copy built application
COPY --from=builder /app/apps/api/.output/index.js .

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["bun", "index.js"]
