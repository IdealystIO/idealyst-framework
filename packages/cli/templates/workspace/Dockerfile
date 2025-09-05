# Multi-stage Dockerfile for Idealyst Workspace
# Supports web apps, API services, and can be used for staging/production

# Base stage with Node.js and build tools
FROM node:20-bullseye-slim AS base
RUN apt-get update && apt-get install -y \
    libc6-dev \
    git \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Enable corepack for yarn
RUN corepack enable

# Dependencies stage - install all dependencies
FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

# Create packages directory structure and copy package.json files
RUN mkdir -p packages/api packages/app packages/components packages/web
COPY packages/api/package.json ./packages/api/
COPY packages/app/package.json ./packages/app/
COPY packages/components/package.json ./packages/components/
COPY packages/web/package.json ./packages/web/

RUN yarn install

# Build stage - build all packages
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build all packages
RUN yarn build:all

# Production API stage
FROM base AS api-runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 apiuser

# Copy built API and dependencies
COPY --from=builder /app/packages/*/dist ./packages/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER apiuser
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

# Health check for API
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["node", "packages/api/dist/server.js"]

# Production Web stage
FROM nginx:alpine AS web-runner
COPY --from=builder /app/packages/web/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Development stage - for use with dev containers
FROM base AS dev

# Install additional tools for development
RUN apt-get update && apt-get install -y \
    sudo \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Create dev user with proper permissions
RUN groupadd --gid 1000 devuser \
    && useradd --uid 1000 --gid devuser --shell /bin/bash --create-home devuser \
    && echo 'devuser ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Set up workspace directory with proper ownership
RUN mkdir -p /app && chown -R devuser:devuser /app

# Switch to dev user for remaining setup
USER devuser
WORKDIR /app

# Copy package files
COPY --chown=devuser:devuser package.json yarn.lock .yarnrc.yml ./
COPY --chown=devuser:devuser .yarn .yarn

# Create packages directory structure and copy package.json files
RUN mkdir -p packages/api packages/app packages/components packages/web
COPY --chown=devuser:devuser packages/api/package.json ./packages/api/
COPY --chown=devuser:devuser packages/app/package.json ./packages/app/
COPY --chown=devuser:devuser packages/components/package.json ./packages/components/
COPY --chown=devuser:devuser packages/web/package.json ./packages/web/

# Install dependencies including dev dependencies
RUN yarn install

EXPOSE 3000 5173 8080 19006

CMD ["tail", "-f", "/dev/null"]

# Test runner stage
FROM base AS test-runner
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run tests
CMD ["yarn", "test:ci"]
