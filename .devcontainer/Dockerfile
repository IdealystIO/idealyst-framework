FROM mcr.microsoft.com/devcontainers/javascript-node:18

# Install additional OS packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        git \
        curl \
        wget \
        vim \
        nano \
        build-essential \
        python3 \
        python3-pip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Yarn (latest version)
RUN corepack enable && corepack prepare yarn@stable --activate

# Install global packages using npm instead of yarn global
RUN npm install -g \
    typescript \
    ts-node \
    nodemon \
    @types/node \
    eslint \
    prettier \
    jest

# Set up workspace directory
WORKDIR /workspace

# Configure Yarn for better performance (via environment variables)
ENV YARN_REGISTRY=https://registry.npmjs.org/

# Set default shell to bash
SHELL ["/bin/bash", "-c"]

# Set environment variables for performance
ENV NODE_ENV=development
ENV YARN_CACHE_FOLDER=/usr/local/share/.cache/yarn
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Create cache directories with proper permissions
RUN mkdir -p /usr/local/share/.cache/yarn && \
    chown -R node:node /usr/local/share/.cache/yarn

# Pre-create node_modules directories with proper ownership
RUN mkdir -p /workspace/node_modules && \
    mkdir -p /workspace/packages/components/node_modules && \
    mkdir -p /workspace/packages/example-native/node_modules && \
    mkdir -p /workspace/packages/example-web/node_modules && \
    chown -R node:node /workspace

# Expose common development ports
EXPOSE 3000 3002 3003 3004 3005 8081 8082 9000 9001 5173

# Default command
CMD ["/bin/bash"] 