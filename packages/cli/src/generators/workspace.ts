/**
 * Workspace root generator
 */

import fs from 'fs-extra';
import path from 'path';
import { TemplateData } from '../types';
import { copyTemplateDirectory, getTemplatePath, templateHasContent } from '../templates/copier';
import { logger } from '../utils/logger';

/**
 * Generate workspace root structure
 */
export async function generateWorkspace(
  projectPath: string,
  data: TemplateData
): Promise<void> {
  logger.info(`Creating workspace at ${projectPath}...`);

  // Ensure project directory exists
  await fs.ensureDir(projectPath);

  // Copy workspace template or generate programmatically
  const templatePath = getTemplatePath('core', 'workspace');

  if (await templateHasContent(templatePath)) {
    await copyTemplateDirectory(templatePath, projectPath, data);
  } else {
    // Generate workspace files programmatically if no template exists
    await generateWorkspaceFiles(projectPath, data);
  }
}

/**
 * Generate workspace files programmatically
 */
async function generateWorkspaceFiles(
  projectPath: string,
  data: TemplateData
): Promise<void> {
  // Create packages directory
  await fs.ensureDir(path.join(projectPath, 'packages'));

  // Generate root package.json
  const packageJson = createRootPackageJson(data);
  await fs.writeJson(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

  // Generate tsconfig.json
  const tsconfig = createRootTsConfig();
  await fs.writeJson(path.join(projectPath, 'tsconfig.json'), tsconfig, { spaces: 2 });

  // Generate .gitignore
  const gitignore = createGitignore();
  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);

  // Generate .yarnrc.yml
  const yarnrc = createYarnrc();
  await fs.writeFile(path.join(projectPath, '.yarnrc.yml'), yarnrc);

  // Generate README.md
  const readme = createReadme(data);
  await fs.writeFile(path.join(projectPath, 'README.md'), readme);

  // Generate react-native.config.js for monorepo setup
  const rnConfig = createReactNativeConfig(data);
  await fs.writeFile(path.join(projectPath, 'react-native.config.js'), rnConfig);
}

/**
 * Create root package.json content
 */
function createRootPackageJson(data: TemplateData): Record<string, unknown> {
  const scripts: Record<string, string> = {
    'dev': 'concurrently "yarn web:dev" "yarn mobile:start"',
    'build': 'yarn build:packages && yarn web:build',
    'build:packages': 'yarn workspace @' + data.workspaceScope + '/shared build',
    'test': 'jest',
    'test:watch': 'jest --watch',
    'test:coverage': 'jest --coverage',
    'web:dev': 'yarn workspace @' + data.workspaceScope + '/web dev',
    'web:build': 'yarn workspace @' + data.workspaceScope + '/web build',
    'web:preview': 'yarn workspace @' + data.workspaceScope + '/web preview',
    'mobile:start': 'yarn workspace @' + data.workspaceScope + '/mobile start',
    'mobile:android': 'yarn workspace @' + data.workspaceScope + '/mobile android',
    'mobile:ios': 'yarn workspace @' + data.workspaceScope + '/mobile ios',
  };

  // Add API scripts if API is enabled
  if (data.hasApi) {
    scripts['api:dev'] = 'yarn workspace @' + data.workspaceScope + '/api dev';
    scripts['api:build'] = 'yarn workspace @' + data.workspaceScope + '/api build';
    scripts['dev'] = 'concurrently "yarn api:dev" "yarn web:dev" "yarn mobile:start"';
  }

  // Add database scripts if Prisma is enabled
  if (data.hasPrisma) {
    scripts['db:generate'] = 'yarn workspace @' + data.workspaceScope + '/database db:generate';
    scripts['db:push'] = 'yarn workspace @' + data.workspaceScope + '/database db:push';
    scripts['db:migrate'] = 'yarn workspace @' + data.workspaceScope + '/database db:migrate';
    scripts['db:studio'] = 'yarn workspace @' + data.workspaceScope + '/database db:studio';
    scripts['db:seed'] = 'yarn workspace @' + data.workspaceScope + '/database db:seed';
    scripts['build:packages'] = 'yarn db:generate && yarn workspace @' + data.workspaceScope + '/shared build';
  }

  return {
    name: `@${data.workspaceScope}/${data.projectName}`,
    version: data.version,
    private: true,
    packageManager: 'yarn@4.1.0',
    workspaces: ['packages/*'],
    scripts,
    devDependencies: {
      'concurrently': '^9.0.0',
      'jest': '^29.7.0',
      '@types/jest': '^29.5.0',
      'ts-jest': '^29.1.0',
      'typescript': '^5.0.0',
    },
  };
}

/**
 * Create root tsconfig.json
 */
function createRootTsConfig(): Record<string, unknown> {
  return {
    compilerOptions: {
      target: 'ES2020',
      module: 'ESNext',
      jsx: 'react-jsx',
      sourceMap: true,
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      types: ['vite/client'],
    },
    include: ['packages/*/src/**/*'],
    exclude: ['node_modules', 'dist', 'build'],
  };
}

/**
 * Create .gitignore content
 */
function createGitignore(): string {
  return `# AI/Tool configs
.claude/
.serena/
.playwright/

# Dependencies
node_modules/
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

# Build outputs
dist/
build/
.cache/
*.tsbuildinfo

# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.jest/

# Mobile
ios/Pods/
android/.gradle/
android/app/build/
*.keystore
*.jks

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Misc
*.tmp
*.bak

# Turborepo
.turbo/

# Linting
.eslintcache

# SSL
*.pem

# Deployment
.vercel/
.netlify/

# Expo
.expo/
.expo-shared/

# Metro
.metro-health-check*

# Watchman
.watchman-*
`;
}

/**
 * Create .yarnrc.yml content
 */
function createYarnrc(): string {
  return `nodeLinker: node-modules

enableGlobalCache: true

# Ensure all packages are hoisted to root node_modules for proper resolution
nmHoistingLimits: none
`;
}

/**
 * Create README.md content
 */
function createReadme(data: TemplateData): string {
  return `# ${data.appDisplayName}

${data.description}

Built with [Idealyst Framework](https://github.com/IdealystIO/idealyst-framework).

## Getting Started

### Install Dependencies

\`\`\`bash
yarn install
\`\`\`

### Development

Start all development servers:

\`\`\`bash
yarn dev
\`\`\`

Or run individually:

\`\`\`bash
# Web
yarn web:dev

# Mobile
yarn mobile:start
yarn mobile:android  # or yarn mobile:ios
${data.hasApi ? `
# API
yarn api:dev
` : ''}
\`\`\`
${data.hasPrisma ? `
### Database

\`\`\`bash
# Generate Prisma client
yarn db:generate

# Push schema to database
yarn db:push

# Open Prisma Studio
yarn db:studio
\`\`\`
` : ''}
### Build

\`\`\`bash
yarn build
\`\`\`

### Testing

\`\`\`bash
yarn test
yarn test:watch
yarn test:coverage
\`\`\`

## Project Structure

\`\`\`
${data.projectName}/
├── packages/
│   ├── shared/     # Shared components and utilities
│   ├── web/        # React web application
│   └── mobile/     # React Native mobile application${data.hasApi ? `
│   └── api/        # API server` : ''}${data.hasPrisma ? `
│   └── database/   # Database layer (Prisma)` : ''}
├── package.json
└── README.md
\`\`\`
`;
}

/**
 * Create react-native.config.js for monorepo setup
 *
 * This file tells the React Native CLI where to find the mobile project
 * and its dependencies in a Yarn workspace monorepo structure.
 */
function createReactNativeConfig(data: TemplateData): string {
  return `/**
 * React Native configuration for monorepo setup
 *
 * This file tells the React Native CLI where to find the mobile project
 * and its dependencies in a Yarn workspace monorepo structure.
 */
module.exports = {
  project: {
    android: {
      sourceDir: './packages/mobile/android',
      appName: 'app',
      packageName: '${data.androidPackageName}',
    },
    ios: {
      sourceDir: './packages/mobile/ios',
    },
  },
  // Dependencies are auto-detected from node_modules
};
`;
}
