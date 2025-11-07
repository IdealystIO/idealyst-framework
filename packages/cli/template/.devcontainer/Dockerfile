FROM node:20-bullseye

# Install additional tools including gosu for proper user switching
RUN apt-get update && apt-get install -y \
    git \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Enable corepack for yarn
RUN corepack enable

# Install global tools that might be useful
RUN npm install -g @expo/cli @anthropic-ai/claude-code

# Set up git (will be configured in setup script)
RUN git config --global init.defaultBranch main

# Create workspace directory
RUN mkdir -p /workspace
WORKDIR /workspace
RUN chown -R node:node /workspace

# Note: We don't switch to node user here anymore - entrypoint.sh will do it
# This allows the entrypoint to fix permissions as root first

USER node