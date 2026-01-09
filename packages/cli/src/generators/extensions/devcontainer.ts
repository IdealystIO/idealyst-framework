/**
 * Devcontainer extension generator
 *
 * Creates a development container setup with optional services:
 * - Base: Node.js, Yarn, Expo CLI (always included)
 * - Optional: PostgreSQL database
 * - Optional: Redis cache
 * - Optional: Headless Chrome for browser automation
 * - Optional: Claude Code with MCP servers
 */

import fs from 'fs-extra';
import path from 'path';
import { TemplateData, DevcontainerConfig } from '../../types';
import { logger } from '../../utils/logger';

/**
 * Normalize devcontainer config from boolean or object
 */
function normalizeDevcontainerConfig(
  config: boolean | DevcontainerConfig
): DevcontainerConfig {
  if (typeof config === 'boolean') {
    // If just --with-devcontainer flag was used, enable all services with default MCP servers
    return {
      enabled: config,
      postgres: config,
      redis: config,
      chrome: config,
      claudeCode: config,
      mcpServers: config ? ['idealyst', 'serena'] : [],
    };
  }
  // Ensure mcpServers array exists
  return {
    ...config,
    mcpServers: config.mcpServers ?? [],
  };
}

/**
 * Generate MCP server setup commands for the selected servers
 */
function generateMcpSetupCommands(servers: string[], config: DevcontainerConfig): string {
  const commands: string[] = [];

  for (const server of servers) {
    switch (server) {
      case 'idealyst':
        commands.push(`
# Idealyst MCP (component documentation)
claude mcp add idealyst -s user -- npx -y @idealyst/mcp-server@latest 2>/dev/null || true`);
        break;

      case 'serena':
        commands.push(`
# Serena MCP (code navigation and semantic search)
claude mcp add serena -s user -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --project-from-cwd 2>/dev/null || true`);
        break;

      case 'playwright':
        if (config.chrome) {
          commands.push(`
# Playwright MCP (connects to browserless chrome)
claude mcp add playwright -s user -- npx -y @playwright/mcp@latest --cdp-endpoint ws://chrome:3000 2>/dev/null || true`);
        }
        break;

      case 'postgres':
        if (config.postgres) {
          commands.push(`
# PostgreSQL MCP (database queries)
claude mcp add postgres -s user -- npx -y @anthropic-ai/mcp-postgres@latest \$DATABASE_URL 2>/dev/null || true`);
        }
        break;
    }
  }

  return commands.join('\n');
}

/**
 * Apply devcontainer extension to a project
 */
export async function applyDevcontainerExtension(
  projectPath: string,
  data: TemplateData,
  devcontainerConfig?: boolean | DevcontainerConfig
): Promise<void> {
  // Normalize config - default to all services if not specified
  const config = normalizeDevcontainerConfig(devcontainerConfig ?? true);

  if (!config.enabled) {
    return;
  }

  logger.info('Creating devcontainer configuration...');

  const devcontainerDir = path.join(projectPath, '.devcontainer');
  await fs.ensureDir(devcontainerDir);

  // Create all devcontainer files
  const tasks: Promise<void>[] = [
    createDockerfile(devcontainerDir, config),
    createDockerCompose(devcontainerDir, data, config),
    createDevcontainerJson(devcontainerDir, data, config),
    createSetupScript(devcontainerDir, data, config),
  ];

  // Only create Claude setup script if Claude Code is enabled
  if (config.claudeCode) {
    tasks.push(createClaudeSetupScript(devcontainerDir));
  }

  await Promise.all(tasks);

  logger.success('Devcontainer configuration created');
}

/**
 * Create the Dockerfile
 */
async function createDockerfile(
  devcontainerDir: string,
  config: DevcontainerConfig
): Promise<void> {
  const aptPackages = ['git', 'curl'];

  // Add postgresql-client only if postgres is enabled
  if (config.postgres) {
    aptPackages.push('postgresql-client');
  }

  // Add redis-tools (provides redis-cli) only if redis is enabled
  if (config.redis) {
    aptPackages.push('redis-tools');
  }

  const globalPackages = ['@expo/cli'];

  // Add claude-code if enabled
  if (config.claudeCode) {
    globalPackages.push('@anthropic-ai/claude-code');
  }

  const claudeCodeSetup = config.claudeCode
    ? `
# Create Claude Code data directory (volume mount point)
RUN mkdir -p /home/node/.claude-code
`
    : '';

  // Install uv (Python package manager) if serena MCP is enabled
  const uvSetup = config.mcpServers?.includes('serena')
    ? `
# Install uv (Python package manager) for Serena MCP
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/home/node/.local/bin:$PATH"
`
    : '';

  const content = `FROM node:20-bullseye

# Install additional tools
RUN apt-get update && apt-get install -y \\
    ${aptPackages.join(' \\\n    ')} \\
    && rm -rf /var/lib/apt/lists/*

# Enable corepack for yarn
RUN corepack enable

# Disable corepack download prompts (auto-accept)
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# Install global tools
RUN npm install -g ${globalPackages.join(' ')}

# Set up git
RUN git config --global init.defaultBranch main

# Create workspace directory with correct ownership
RUN mkdir -p /workspace && chown -R node:node /workspace

WORKDIR /workspace

# Switch to node user
USER node
${uvSetup}${claudeCodeSetup}`;

  await fs.writeFile(path.join(devcontainerDir, 'Dockerfile'), content);
}

/**
 * Create docker-compose.yml
 */
async function createDockerCompose(
  devcontainerDir: string,
  data: TemplateData,
  config: DevcontainerConfig
): Promise<void> {
  const dbName = data.projectName.replace(/-/g, '_') + '_db';
  const services: string[] = [];
  const volumes: string[] = [];
  const appDependsOn: string[] = [];
  const appEnv: string[] = [
    'NODE_ENV: development',
  ];
  const appVolumes: string[] = [
    '../:/workspace:cached',
  ];

  // PostgreSQL service
  if (config.postgres) {
    services.push(`  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${dbName}
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
`);
    volumes.push('postgres_data');
    appDependsOn.push(`      postgres:
        condition: service_healthy`);
    appEnv.push(`DATABASE_URL: postgresql://postgres:postgres@postgres:5432/${dbName}`);
  }

  // Redis service
  if (config.redis) {
    services.push(`  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5
`);
    volumes.push('redis_data');
    appDependsOn.push(`      redis:
        condition: service_healthy`);
    appEnv.push('REDIS_URL: redis://redis:6379');
  }

  // Claude Code config
  if (config.claudeCode) {
    appEnv.push('CLAUDE_CONFIG_DIR: /home/node/.claude-code');
    appVolumes.push('claude_data:/home/node/.claude-code');
    volumes.push('claude_data');
  }

  // Chrome service
  if (config.chrome) {
    services.push(`  # Headless Chrome Browser (for Playwright)
  chrome:
    image: browserless/chrome:latest
    environment:
      - CONNECTION_TIMEOUT=600000
      - MAX_CONCURRENT_SESSIONS=10
      - ENABLE_DEBUGGER=true
      - PREBOOT_CHROME=true
    ports:
      - "3100:3000"
    shm_size: "2gb"
    dns:
      - 8.8.8.8
      - 8.8.4.4
    extra_hosts:
      - "localhost:host-gateway"
      - "host.docker.internal:host-gateway"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/json/version"]
      interval: 10s
      timeout: 5s
      retries: 3
`);
    appEnv.push('BROWSER_WS_ENDPOINT: ws://chrome:3000');
  }

  // Build the depends_on section
  const dependsOnSection = appDependsOn.length > 0
    ? `    depends_on:
${appDependsOn.join('\n')}`
    : '';

  // Build app service
  const appService = `  # Development Service (for devcontainer)
  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      ${appEnv.join('\n      ')}
    ports:
      - "3000:3000"   # API server
      - "5173:5173"   # Vite dev server
      - "8081:8081"   # Metro bundler
      - "19006:19006" # Expo dev tools
    volumes:
      - ${appVolumes.join('\n      - ')}
${dependsOnSection}
    command: sleep infinity
`;

  const volumesSection = volumes.length > 0
    ? `volumes:
${volumes.map(v => `  ${v}:`).join('\n')}
`
    : '';

  const content = `services:
${services.join('\n')}
${appService}
${volumesSection}`;

  await fs.writeFile(path.join(devcontainerDir, 'docker-compose.yml'), content);
}

/**
 * Create devcontainer.json
 */
async function createDevcontainerJson(
  devcontainerDir: string,
  data: TemplateData,
  config: DevcontainerConfig
): Promise<void> {
  // Build forward ports list
  const forwardPorts = [
    3000,  // API server
    5173,  // Vite dev server
    8081,  // Metro Bundler
    19006, // Expo dev tools
  ];

  const portsAttributes: Record<string, object> = {
    '3000': {
      label: 'API Server',
      onAutoForward: 'notify',
    },
    '5173': {
      label: 'Vite Dev Server',
      onAutoForward: 'openBrowser',
    },
    '8081': {
      label: 'Metro Bundler',
      onAutoForward: 'notify',
    },
    '19006': {
      label: 'Expo Dev Tools',
      onAutoForward: 'openBrowser',
    },
  };

  if (config.postgres) {
    forwardPorts.push(5432);
    portsAttributes['5432'] = {
      label: 'PostgreSQL Database',
      onAutoForward: 'silent',
    };
  }

  if (config.redis) {
    forwardPorts.push(6379);
    portsAttributes['6379'] = {
      label: 'Redis Cache',
      onAutoForward: 'silent',
    };
  }

  if (config.chrome) {
    forwardPorts.push(3100);
    portsAttributes['3100'] = {
      label: 'Browserless Chrome',
      onAutoForward: 'silent',
    };
  }

  const devcontainerJson: Record<string, unknown> = {
    name: `${data.appDisplayName} Development`,
    dockerComposeFile: 'docker-compose.yml',
    service: 'app',
    workspaceFolder: '/workspace',

    forwardPorts,
    portsAttributes,

    customizations: {
      vscode: {
        extensions: [
          // React Native/React development
          'msjsdiag.vscode-react-native',

          // TypeScript/JavaScript
          'ms-vscode.vscode-typescript-next',
          'dbaeumer.vscode-eslint',
          'esbenp.prettier-vscode',

          // General development
          'ms-vscode.vscode-json',
          'redhat.vscode-yaml',
          'ms-azuretools.vscode-docker',
          'christian-kohler.path-intellisense',
          'formulahendry.auto-rename-tag',

          // Testing
          'orta.vscode-jest',

          // Git
          'mhutchie.git-graph',
          'eamodio.gitlens',
          'github.vscode-pull-request-github',

          // AI
          'github.copilot',
          'github.copilot-chat',
        ],
        settings: {
          'terminal.integrated.defaultProfile.linux': 'bash',
          'typescript.preferences.includePackageJsonAutoImports': 'auto',
          'editor.formatOnSave': true,
          'editor.defaultFormatter': 'esbenp.prettier-vscode',
          'editor.codeActionsOnSave': {
            'source.fixAll.eslint': 'explicit',
            'source.organizeImports': 'explicit',
          },
          'files.watcherExclude': {
            '**/node_modules/**': true,
            '**/.git/**': true,
            '**/dist/**': true,
            '**/coverage/**': true,
          },
          'search.exclude': {
            '**/node_modules': true,
            '**/dist': true,
            '**/coverage': true,
            '**/.yarn': true,
          },
          'jest.jestCommandLine': 'yarn test',
          'jest.autoRun': 'off',
        },
      },
    },

    remoteUser: 'node',

    postCreateCommand: 'bash .devcontainer/setup.sh',
  };

  // Add post-start command only if Claude Code is enabled
  if (config.claudeCode) {
    devcontainerJson.postStartCommand = 'bash .devcontainer/setup-claude.sh';
  }

  await fs.writeJson(
    path.join(devcontainerDir, 'devcontainer.json'),
    devcontainerJson,
    { spaces: 2 }
  );
}

/**
 * Create setup.sh script
 */
async function createSetupScript(
  devcontainerDir: string,
  data: TemplateData,
  config: DevcontainerConfig
): Promise<void> {
  const dbName = data.projectName.replace(/-/g, '_') + '_db';

  const envVars: string[] = [
    '# API Configuration',
    'API_PORT=3000',
    'JWT_SECRET=change-this-in-production',
    '',
    '# Web Configuration',
    'WEB_PORT=5173',
    '',
    '# Development Configuration',
    'NODE_ENV=development',
    'LOG_LEVEL=debug',
  ];

  if (config.postgres) {
    envVars.unshift(
      '# Database Configuration',
      `DATABASE_URL=postgresql://postgres:postgres@postgres:5432/${dbName}`,
      `POSTGRES_DB=${dbName}`,
      'POSTGRES_USER=postgres',
      'POSTGRES_PASSWORD=postgres',
      ''
    );
  }

  if (config.redis) {
    envVars.push('', '# Redis Configuration', 'REDIS_URL=redis://redis:6379');
  }

  if (config.chrome) {
    envVars.push('', '# Browserless Chrome (for Playwright)', 'BROWSER_WS_ENDPOINT=ws://chrome:3000');
  }

  // Build wait sections
  const waitSections: string[] = [];

  if (config.postgres) {
    waitSections.push(`
# Wait for database to be ready (timeout: 30s)
echo "⏳ Waiting for database to be ready..."
TIMEOUT=30
ELAPSED=0
until pg_isready -h postgres -p 5432 -U postgres > /dev/null 2>&1; do
    if [ $ELAPSED -ge $TIMEOUT ]; then
        echo "⚠️  Database not available after \${TIMEOUT}s - continuing anyway"
        break
    fi
    echo "Database is unavailable - sleeping"
    sleep 1
    ELAPSED=$((ELAPSED + 1))
done
[ $ELAPSED -lt $TIMEOUT ] && echo "✅ Database is ready!"`);
  }

  if (config.redis) {
    waitSections.push(`
# Wait for Redis to be ready (timeout: 30s)
echo "⏳ Waiting for Redis to be ready..."
TIMEOUT=30
ELAPSED=0
until redis-cli -h redis ping > /dev/null 2>&1; do
    if [ $ELAPSED -ge $TIMEOUT ]; then
        echo "⚠️  Redis not available after \${TIMEOUT}s - continuing anyway"
        break
    fi
    echo "Redis is unavailable - sleeping"
    sleep 1
    ELAPSED=$((ELAPSED + 1))
done
[ $ELAPSED -lt $TIMEOUT ] && echo "✅ Redis is ready!"`);
  }

  if (config.chrome) {
    waitSections.push(`
# Wait for Chrome to be ready (timeout: 30s)
echo "⏳ Waiting for Chrome browser to be ready..."
TIMEOUT=30
ELAPSED=0
until curl -s http://chrome:3000/json/version > /dev/null; do
    if [ $ELAPSED -ge $TIMEOUT ]; then
        echo "⚠️  Chrome not available after \${TIMEOUT}s - continuing anyway"
        break
    fi
    echo "Chrome is unavailable - sleeping"
    sleep 1
    ELAPSED=$((ELAPSED + 1))
done
[ $ELAPSED -lt $TIMEOUT ] && echo "✅ Chrome browser is ready!"`);
  }

  // Claude Code setup - generate commands for selected MCP servers
  const claudeSetup = config.claudeCode && config.mcpServers.length > 0
    ? `
# Setup Claude Code MCP servers
echo "🤖 Configuring Claude Code MCP servers..."
${generateMcpSetupCommands(config.mcpServers, config)}
`
    : '';

  // Prisma setup
  const prismaSetup = data.hasPrisma
    ? `
# Generate Prisma client
echo "🗄️ Generating Prisma client..."
yarn db:generate

# Push schema to database (creates tables if needed)
echo "🗄️ Pushing schema to database..."
yarn db:push

# Run database migrations (if any exist)
if [ -d "packages/database/prisma/migrations" ]; then
    echo "🗄️ Running database migrations..."
    yarn db:migrate
fi
`
    : '';

  // Available commands
  const commands = [
    'echo "  yarn dev           - Start all development servers"',
    'echo "  yarn web:dev       - Start web dev server only"',
    'echo "  yarn mobile:start  - Start mobile dev server only"',
  ];

  if (data.hasApi) {
    commands.push('echo "  yarn api:dev       - Start API server only"');
  }

  if (data.hasPrisma) {
    commands.push('echo "  yarn db:studio     - Open Prisma Studio"');
  }

  const content = `#!/bin/bash

echo "🚀 Setting up ${data.appDisplayName} development environment..."

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
${envVars.join('\n')}
EOF
fi
${waitSections.join('\n')}

# Install dependencies
echo "📦 Installing dependencies..."
yarn install
${claudeSetup}${prismaSetup}
echo ""
echo "✅ Development environment is ready!"
echo ""
echo "🎉 You can now start developing your ${data.appDisplayName} application!"
echo ""
echo "Available commands:"
${commands.join('\n')}
echo ""
`;

  const scriptPath = path.join(devcontainerDir, 'setup.sh');
  await fs.writeFile(scriptPath, content);
  await fs.chmod(scriptPath, 0o755);
}

/**
 * Create setup-claude.sh script
 */
async function createClaudeSetupScript(devcontainerDir: string): Promise<void> {
  const content = `#!/bin/bash

# Setup Claude Code data directory in the dev container
# This creates a persistent volume-backed directory for all Claude Code data

echo "Setting up Claude Code data directory..."

# Create the Claude Code directory structure if it doesn't exist
mkdir -p /home/node/.claude-code/.claude
mkdir -p /home/node/.claude-code/.claude/session-env
mkdir -p /home/node/.claude-code/.claude/projects

# Create symlinks from default locations to the persisted volume
# Remove any existing files/dirs first
rm -rf /home/node/.claude 2>/dev/null || true
rm -f /home/node/.claude.json 2>/dev/null || true

# Create symlinks to the volume-backed directory
ln -sf /home/node/.claude-code/.claude /home/node/.claude
ln -sf /home/node/.claude-code/.claude.json /home/node/.claude.json 2>/dev/null || true

# Set proper permissions
chmod -R 700 /home/node/.claude-code 2>/dev/null || true

echo "Claude Code data directory configured at /home/node/.claude-code"
echo "All Claude Code data will persist across container rebuilds"
`;

  const scriptPath = path.join(devcontainerDir, 'setup-claude.sh');
  await fs.writeFile(scriptPath, content);
  await fs.chmod(scriptPath, 0o755);
}
