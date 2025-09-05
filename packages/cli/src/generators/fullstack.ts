import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { GenerateProjectOptions, TemplateData } from '../types';
import { 
  validateProjectName, 
  installDependencies, 
  getTemplateData, 
  getTemplatePath,
  copyTemplate,
  processTemplateFile
} from './utils';
import { generateDatabaseProject } from './database';
import { generateApiProject } from './api';
import { generateWebProject } from './web';
import { generateNativeProject } from './native';
import { generateSharedLibrary } from './shared';

export async function generateFullStackWorkspace(options: GenerateProjectOptions): Promise<void> {
  const { name, directory, skipInstall, figmaToken } = options;
  
  if (!validateProjectName(name)) {
    throw new Error(`Invalid project name: ${name}`);
  }
  
  console.log(chalk.blue(`🚀 Creating Full-Stack Idealyst workspace: ${name}`));
  console.log(chalk.gray('   This will generate a comhttps://open.spotify.com/track/0jVTol3hCYkU8NVVtMQjUS?si=f76828854a174463plete workspace with all packages integrated'));
  
  const projectPath = path.join(directory, name);
  const templatePath = getTemplatePath('workspace');
  
  const templateData = getTemplateData(name, `Full-stack Idealyst Framework workspace`, undefined, name);
  
  // Step 1: Create base workspace
  console.log(chalk.blue('📦 Setting up workspace structure...'));
  await copyTemplate(templatePath, projectPath, templateData);
  
  // Handle devcontainer setup
  const devcontainerDir = path.join(projectPath, '.devcontainer');
  const envPath = path.join(devcontainerDir, '.env');
  const envContent = figmaToken 
    ? `# Figma Integration\nFIGMA_ACCESS_TOKEN=${figmaToken.trim()}\n`
    : `# Figma Integration\nFIGMA_ACCESS_TOKEN=\n`;
  
  await require('fs-extra').writeFile(envPath, envContent);
  
  // Step 2: Generate all packages with integration
  console.log(chalk.blue('🗄️  Creating database package...'));
  await generateDatabaseProject({
    name: 'database',
    type: 'database',
    directory: projectPath,
    skipInstall: true
  });
  
  console.log(chalk.blue('🚀 Creating API server...'));
  await generateApiProject({
    name: 'api',
    type: 'api', 
    directory: projectPath,
    skipInstall: true,
    withTrpc: true
  });
  
  console.log(chalk.blue('📦 Creating shared components...'));
  await generateSharedLibrary({
    name: 'shared',
    type: 'shared',
    directory: projectPath,
    skipInstall: true
  });
  
  console.log(chalk.blue('🌐 Creating web application...'));
  await generateWebProject({
    name: 'web',
    type: 'web',
    directory: projectPath,
    skipInstall: true,
    withTrpc: true
  });
  
  console.log(chalk.blue('📱 Creating mobile application...'));
  await generateNativeProject({
    name: 'mobile',
    type: 'native',
    directory: projectPath,
    skipInstall: true,
    appName: templateData.appName || name,
    withTrpc: true
  });
  
  // Step 3: Create integration files and update app files
  console.log(chalk.blue('🔗 Setting up package integration...'));
  await setupPackageIntegration(projectPath, templateData);
  await updateAppFilesWithSharedComponents(projectPath, templateData);
  
  // Step 4: Install dependencies
  await installDependencies(projectPath, skipInstall);
  
  console.log(chalk.green('✅ Full-stack workspace created successfully!'));
  console.log(chalk.blue('📋 Your workspace includes:'));
  console.log(chalk.white('  • 🗄️  Database package with Prisma'));
  console.log(chalk.white('  • 🚀 API server with tRPC'));
  console.log(chalk.white('  • 🌐 React web app'));
  console.log(chalk.white('  • 📱 React Native mobile app'));
  console.log(chalk.white('  • 📦 Shared component library'));
  console.log(chalk.white('  • 🔗 All packages pre-integrated'));
  console.log(chalk.white('  • 📊 Sample data and demo features'));
  
  console.log('');
  console.log(chalk.green('🚀 Quick start:'));
  console.log(chalk.white(`  cd ${name}`));
  console.log(chalk.white('  yarn dev        # Start all development servers'));
  console.log(chalk.white('  yarn web        # Start web app only'));
  console.log(chalk.white('  yarn mobile     # Start mobile app'));
  console.log(chalk.white('  yarn api        # Start API server only'));
  console.log('');
  console.log(chalk.gray('💡 Check README.md for detailed setup instructions'));
  
  if (figmaToken) {
    console.log(chalk.blue('🎨 Figma integration configured in .devcontainer/.env'));
  } else {
    console.log(chalk.gray('💡 Tip: Add Figma integration later by editing .devcontainer/.env'));
  }
}

/**
 * Updates App files to use enhanced versions with shared components
 */
async function updateAppFilesWithSharedComponents(projectPath: string, templateData: TemplateData): Promise<void> {
  const templateDir = getTemplatePath('web');
  
  // Update web App.tsx with enhanced version
  const webAppSourcePath = path.join(templateDir, '..', 'web', 'src', 'App-with-trpc-and-shared.tsx');
  const webAppTargetPath = path.join(projectPath, 'packages', 'web', 'src', 'App.tsx');
  
  if (await fs.pathExists(webAppSourcePath)) {
    let webAppContent = await fs.readFile(webAppSourcePath, 'utf8');
    // Simple template variable replacement
    webAppContent = webAppContent.replace(/\{\{workspaceScope\}\}/g, templateData.workspaceScope || templateData.projectName);
    webAppContent = webAppContent.replace(/\{\{projectName\}\}/g, templateData.projectName);
    webAppContent = webAppContent.replace(/\{\{appName\}\}/g, templateData.appName || templateData.projectName);
    await fs.writeFile(webAppTargetPath, webAppContent);
  }
  
  // Update native App.tsx with enhanced version  
  const nativeAppSourcePath = path.join(templateDir, '..', 'native', 'src', 'App-with-trpc-and-shared.tsx');
  const nativeAppTargetPath = path.join(projectPath, 'packages', 'mobile', 'src', 'App.tsx');
  
  if (await fs.pathExists(nativeAppSourcePath)) {
    let nativeAppContent = await fs.readFile(nativeAppSourcePath, 'utf8');
    // Simple template variable replacement
    nativeAppContent = nativeAppContent.replace(/\{\{workspaceScope\}\}/g, templateData.workspaceScope || templateData.projectName);
    nativeAppContent = nativeAppContent.replace(/\{\{projectName\}\}/g, templateData.projectName);
    nativeAppContent = nativeAppContent.replace(/\{\{appName\}\}/g, templateData.appName || templateData.projectName);
    await fs.writeFile(nativeAppTargetPath, nativeAppContent);
  }
  
  // Update API database.ts with workspace scope for client import
  const databaseTsPath = path.join(projectPath, 'packages', 'api', 'src', 'lib', 'database.ts');
  if (await fs.pathExists(databaseTsPath)) {
    let databaseContent = await fs.readFile(databaseTsPath, 'utf8');
    databaseContent = databaseContent.replace(/\{\{workspaceScope\}\}/g, templateData.workspaceScope || templateData.projectName);
    await fs.writeFile(databaseTsPath, databaseContent);
  }
  
  // Update web tRPC utils with workspace scope for API types
  const webTrpcUtilsPath = path.join(projectPath, 'packages', 'web', 'src', 'utils', 'trpc.ts');
  if (await fs.pathExists(webTrpcUtilsPath)) {
    let trpcContent = await fs.readFile(webTrpcUtilsPath, 'utf8');
    trpcContent = trpcContent.replace(/\{\{workspaceScope\}\}/g, templateData.workspaceScope || templateData.projectName);
    await fs.writeFile(webTrpcUtilsPath, trpcContent);
  }

  // Update mobile tRPC utils with workspace scope for API types
  const mobileTrpcUtilsPath = path.join(projectPath, 'packages', 'mobile', 'src', 'utils', 'trpc.ts');
  if (await fs.pathExists(mobileTrpcUtilsPath)) {
    let trpcContent = await fs.readFile(mobileTrpcUtilsPath, 'utf8');
    trpcContent = trpcContent.replace(/\{\{workspaceScope\}\}/g, templateData.workspaceScope || templateData.projectName);
    await fs.writeFile(mobileTrpcUtilsPath, trpcContent);
  }
  
  // Update package.json files to include shared dependencies
  await updatePackageJsonWithSharedDeps(projectPath, templateData.workspaceScope || templateData.projectName);
}

/**
 * Updates package.json files to include shared and database dependencies
 */
async function updatePackageJsonWithSharedDeps(projectPath: string, workspaceScope: string): Promise<void> {
  // Update web package.json
  const webPackageJsonPath = path.join(projectPath, 'packages', 'web', 'package.json');
  if (await fs.pathExists(webPackageJsonPath)) {
    const webPackageJson = await fs.readJSON(webPackageJsonPath);
    webPackageJson.dependencies = {
      ...webPackageJson.dependencies,
      [`@${workspaceScope}/shared`]: 'workspace:*',
      [`@${workspaceScope}/database`]: 'workspace:*',
      [`@${workspaceScope}/api`]: 'workspace:*'
    };
    await fs.writeJSON(webPackageJsonPath, webPackageJson, { spaces: 2 });
  }
  
  // Update native package.json
  const nativePackageJsonPath = path.join(projectPath, 'packages', 'mobile', 'package.json');
  if (await fs.pathExists(nativePackageJsonPath)) {
    const nativePackageJson = await fs.readJSON(nativePackageJsonPath);
    nativePackageJson.dependencies = {
      ...nativePackageJson.dependencies,
      [`@${workspaceScope}/shared`]: 'workspace:*',
      [`@${workspaceScope}/database`]: 'workspace:*'
    };
    await fs.writeJSON(nativePackageJsonPath, nativePackageJson, { spaces: 2 });
  }
  
  // Update API package.json
  const apiPackageJsonPath = path.join(projectPath, 'packages', 'api', 'package.json');
  if (await fs.pathExists(apiPackageJsonPath)) {
    const apiPackageJson = await fs.readJSON(apiPackageJsonPath);
    apiPackageJson.dependencies = {
      ...apiPackageJson.dependencies,
      [`@${workspaceScope}/database`]: 'workspace:*',
      [`@${workspaceScope}/shared`]: 'workspace:*'
    };
    await fs.writeJSON(apiPackageJsonPath, apiPackageJson, { spaces: 2 });
  }
}

async function setupPackageIntegration(workspacePath: string, templateData: any): Promise<void> {
  const fs = require('fs-extra');
  
  // Update workspace package.json with integrated scripts
  const workspacePackageJsonPath = path.join(workspacePath, 'package.json');
  const workspacePackageJson = await fs.readJSON(workspacePackageJsonPath);
  
  workspacePackageJson.scripts = {
    ...workspacePackageJson.scripts,
    "dev": "concurrently \"yarn api:dev\" \"yarn web:dev\" \"yarn mobile:start\"",
    "build": "yarn build:packages && yarn api:build && yarn web:build",
    "build:packages": `yarn workspace @${templateData.workspaceScope}/database build && yarn workspace @${templateData.workspaceScope}/shared build`,
    "api:dev": `yarn workspace @${templateData.workspaceScope}/api dev`,
    "api:build": `yarn workspace @${templateData.workspaceScope}/api build`,
    "web:dev": `yarn workspace @${templateData.workspaceScope}/web dev`,
    "web:build": `yarn workspace @${templateData.workspaceScope}/web build`,
    "mobile:start": `yarn workspace @${templateData.workspaceScope}/mobile start`,
    "mobile:android": `yarn workspace @${templateData.workspaceScope}/mobile android`,
    "mobile:ios": `yarn workspace @${templateData.workspaceScope}/mobile ios`,
    "db:generate": `yarn workspace @${templateData.workspaceScope}/database db:generate`,
    "db:push": `yarn workspace @${templateData.workspaceScope}/database db:push`,
    "db:migrate": `yarn workspace @${templateData.workspaceScope}/database db:migrate`,
    "db:studio": `yarn workspace @${templateData.workspaceScope}/database db:studio`,
    "test": "yarn workspaces run test",
    "type-check": "yarn workspaces run type-check"
  };
  
  // Add development dependencies for the workspace
  workspacePackageJson.devDependencies = {
    ...workspacePackageJson.devDependencies,
    "concurrently": "^8.2.2"
  };
  
  await fs.writeJSON(workspacePackageJsonPath, workspacePackageJson, { spaces: 2 });
  
  // Create integrated README with quick start guide
  await createIntegratedReadme(workspacePath, templateData);
}

async function createIntegratedReadme(workspacePath: string, templateData: any): Promise<void> {
  const fs = require('fs-extra');
  const readmePath = path.join(workspacePath, 'README.md');
  
  const readmeContent = `# ${templateData.projectName}

A full-stack application built with the Idealyst Framework.

## 🏗️ Architecture

This workspace contains a complete full-stack application with:

- **📱 Mobile App** (\`packages/mobile\`) - React Native app with Idealyst components
- **🌐 Web App** (\`packages/web\`) - React web app with Idealyst components  
- **🚀 API Server** (\`packages/api\`) - tRPC API server with Express
- **🗄️ Database** (\`packages/database\`) - Prisma database layer with PostgreSQL
- **📦 Shared** (\`packages/shared\`) - Cross-platform shared components and utilities

All packages are pre-integrated and work together seamlessly.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Yarn 3+
- PostgreSQL (or use Docker)

### Setup
\`\`\`bash
# Install dependencies
yarn install

# Set up environment variables
cp packages/api/.env.example packages/api/.env
cp packages/database/.env.example packages/database/.env
# Edit .env files with your database URL

# Generate database client
yarn db:generate

# Push database schema
yarn db:push

# Start all development servers
yarn dev
\`\`\`

This will start:
- 🌐 Web app at http://localhost:5173
- 🚀 API server at http://localhost:3000
- 📱 Mobile app (Metro bundler)

### Individual Commands

\`\`\`bash
# Web development
yarn web:dev           # Start web app
yarn web:build         # Build web app

# Mobile development  
yarn mobile:start      # Start Metro bundler
yarn mobile:android    # Run on Android
yarn mobile:ios        # Run on iOS

# API development
yarn api:dev           # Start API server
yarn api:build         # Build API server

# Database management
yarn db:generate       # Generate Prisma client
yarn db:push           # Push schema to database
yarn db:migrate        # Create migrations
yarn db:studio         # Open Prisma Studio

# Build all packages
yarn build             # Build everything
yarn build:packages    # Build shared packages only

# Testing
yarn test              # Run all tests
yarn type-check        # Type check all packages
\`\`\`

## 📱 Demo Features

The generated application includes working demo features:

### User Management
- User registration and authentication
- User profiles with avatars
- User listings and search

### Real-time Features  
- Live chat/messaging
- Real-time notifications
- Live user presence

### Data Flow
- **Mobile/Web** → **API** → **Database**
- Shared types and validation across all layers
- Real-time updates via tRPC subscriptions

## 🔧 Development

### Adding New Features

1. **Database Changes**: Update \`packages/database/prisma/schema.prisma\`
2. **API Endpoints**: Add routes in \`packages/api/src/routers/\`
3. **Shared Types**: Add to \`packages/shared/src/\`
4. **UI Components**: Update \`packages/web/src/\` and \`packages/mobile/src/\`

### Package Structure

\`\`\`
${templateData.projectName}/
├── packages/
│   ├── api/           # tRPC API server
│   ├── database/      # Prisma database layer
│   ├── mobile/        # React Native app
│   ├── shared/        # Shared components/utils
│   └── web/           # React web app
├── package.json       # Workspace configuration
├── docker-compose.yml # Database services
└── README.md         # This file
\`\`\`

## 🔗 Package Integration

All packages are properly integrated:

- **Database**: Exports typed Prisma client and schemas
- **API**: Imports database client, exports tRPC router
- **Shared**: Cross-platform components used by web/mobile
- **Web/Mobile**: Import shared components and API client

### Type Safety

Full end-to-end type safety:
- Database schema → Generated Prisma types
- API routes → Generated tRPC types  
- Frontend → Typed API client calls
- Shared components → Typed props

## 📚 Documentation

- [Idealyst Framework](https://github.com/IdealystIO/idealyst-framework)
- [Prisma Docs](https://www.prisma.io/docs)
- [tRPC Docs](https://trpc.io)
- [React Native Docs](https://reactnative.dev)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
`;

  await fs.writeFile(readmePath, readmeContent);
}
