FROM node:20-bullseye

# Install additional tools
RUN apt-get update && apt-get install -y \
    git \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Enable corepack for yarn
RUN corepack enable

# Install global tools that might be useful
RUN npm install -g @expo/cli

# Set up git (will be configured in setup script)
RUN git config --global init.defaultBranch main

# Create workspace directory
RUN mkdir -p /workspace
WORKDIR /workspace

# Keep container running
CMD ["sleep", "infinity"]
