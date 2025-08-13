# Multi-stage Dockerfile for Idealyst Workspace
# Supports web apps, API services, and can be used for staging/production

# Base stage with Node.js and build tools
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat git
WORKDIR /app

# Enable corepack for yarn
RUN corepack enable

# Dependencies stage - install all dependencies
FROM base AS deps
COPY package.json yarn.lock* .yarnrc.yml ./
COPY .yarn .yarn
RUN yarn install --immutable

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
EXPOSE 3001
ENV NODE_ENV=production
ENV PORT=3001

# Health check for API
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["node", "packages/api/dist/server.js"]

# Production Web stage
FROM nginx:alpine AS web-runner
COPY --from=builder /app/packages/web/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Development stage - for use with dev containers
FROM base AS dev
RUN apk add --no-cache \
    docker \
    docker-compose \
    bash \
    zsh \
    fish \
    git \
    curl \
    wget \
    vim \
    nano

# Install global development tools
RUN npm install -g @types/node typescript ts-node nodemon

# Copy package files
COPY package.json yarn.lock* .yarnrc.yml ./
COPY .yarn .yarn

# Install dependencies including dev dependencies
RUN yarn install

# Create non-root user for development
RUN addgroup --system --gid 1001 devuser
RUN adduser --system --uid 1001 --ingroup devuser devuser
RUN chown -R devuser:devuser /app

USER devuser

# Set up shell
RUN echo 'alias ll="ls -la"' >> ~/.bashrc
RUN echo 'alias la="ls -la"' >> ~/.bashrc

EXPOSE 3000 3001 5173 8080 19006

CMD ["tail", "-f", "/dev/null"]

# Test runner stage
FROM base AS test-runner
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run tests
CMD ["yarn", "test:ci"]
