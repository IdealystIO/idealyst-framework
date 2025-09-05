#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { generateProject } from './generators/index';
import { ProjectType } from './types';
import { promptForProjectName, promptForProjectType, promptForAppName, promptForTrpcIntegration } from './generators/utils';

const program = new Command();

program
  .name('idealyst')
  .description('CLI tool for generating Idealyst Framework projects')
  .version('1.0.1');

program
  .command('create [project-name]')
  .description('Create a new Idealyst project')
  .option('-t, --type <type>', 'Project type: native, web, shared, api, or database')
  .option('-d, --directory <directory>', 'Output directory', '.')
  .option('-a, --app-name <app-name>', 'Display name for native apps (e.g., "My Awesome App")')
  .option('--with-trpc', 'Include tRPC boilerplate and setup (for web/native projects)')
  .option('--skip-install', 'Skip installing dependencies')
  .action(async (projectName: string | undefined, options: {
    type?: string;
    directory: string;
    appName?: string;
    withTrpc?: boolean;
    skipInstall?: boolean;
  }) => {
    try {
      // Prompt for project name if not provided
      if (!projectName) {
        projectName = await promptForProjectName();
      } else {
        // Validate provided project name
        const { validateProjectName } = await import('./generators/utils');
        if (!validateProjectName(projectName.toLowerCase())) {
          console.error(chalk.red(`Invalid project name: ${projectName}`));
          console.error(chalk.yellow('Project name must be a valid npm package name (lowercase, no spaces)'));
          process.exit(1);
        }
        projectName = projectName.toLowerCase();
      }

      // Prompt for project type if not provided
      let projectType = options.type;
      if (!projectType) {
        projectType = await promptForProjectType();
      }

      const validTypes = ['native', 'web', 'shared', 'api', 'database'];
      if (!validTypes.includes(projectType)) {
        console.error(chalk.red(`Invalid project type: ${projectType}`));
        console.error(chalk.yellow(`Valid types are: ${validTypes.join(', ')}`));
        process.exit(1);
      }

      // Prompt for app name if it's a native project and app name not provided
      let appName = options.appName;
      if (projectType === 'native' && !appName) {
        appName = await promptForAppName(projectName);
      }

      // Prompt for tRPC integration if it's a web/native project and flag not provided
      let withTrpc = options.withTrpc;
      if ((projectType === 'web' || projectType === 'native') && withTrpc === undefined) {
        withTrpc = await promptForTrpcIntegration();
      }

      await generateProject({
        name: projectName,
        type: projectType as ProjectType,
        directory: options.directory,
        skipInstall: options.skipInstall || false,
        appName,
        withTrpc: withTrpc || false
      });
      
      console.log(chalk.green(`✨ Successfully created ${projectName}!`));
      console.log(chalk.blue(`📁 Project created in: ${options.directory}/packages/${projectName}`));
      
      if (projectType === 'native') {
        console.log(chalk.yellow('\n📱 Next steps for React Native:'));
        console.log(chalk.white('  cd packages/' + projectName));
        console.log(chalk.white('  yarn android  # or yarn ios'));
      } else if (projectType === 'web') {
        console.log(chalk.yellow('\n🌐 Next steps for React Web:'));
        console.log(chalk.white('  cd packages/' + projectName));
        console.log(chalk.white('  yarn dev'));
      } else if (projectType === 'api') {
        console.log(chalk.yellow('\n🚀 Next steps for API Server:'));
        console.log(chalk.white('  cd packages/' + projectName));
        console.log(chalk.white('  yarn dev        # Start development server'));
        console.log(chalk.white('  yarn build      # Build for production'));
      } else if (projectType === 'database') {
        console.log(chalk.yellow('\n🗄️ Next steps for Database:'));
        console.log(chalk.white('  cd packages/' + projectName));
        console.log(chalk.white('  yarn db:generate # Generate Prisma client'));
        console.log(chalk.white('  yarn db:push    # Push database schema'));
        console.log(chalk.white('  yarn db:studio  # Open Prisma Studio'));
        console.log(chalk.white('  yarn build      # Build for export to other packages'));
      } else {
        console.log(chalk.yellow('\n📦 Next steps for Shared Library:'));
        console.log(chalk.white('  cd packages/' + projectName));
        console.log(chalk.white('  yarn build'));
      }
    } catch (error) {
      console.error(chalk.red('❌ Error creating project:'), error);
      process.exit(1);
    }
  });

program
  .command('init [project-name]')
  .description('Initialize a new Idealyst monorepo workspace')
  .option('-d, --directory <directory>', 'Output directory', '.')
  .option('--skip-install', 'Skip installing dependencies')
  .option('--figma-token <token>', 'Figma personal access token (enables figma-developer-mcp server)')
  .action(async (projectName: string | undefined, options: {
    directory: string;
    skipInstall?: boolean;
    figmaToken?: string;
  }) => {
    try {
      // Prompt for project name if not provided
      if (!projectName) {
        projectName = await promptForProjectName();
      } else {
        // Validate provided project name
        const { validateProjectName } = await import('./generators/utils');
        if (!validateProjectName(projectName.toLowerCase())) {
          console.error(chalk.red(`Invalid project name: ${projectName}`));
          console.error(chalk.yellow('Project name must be a valid npm package name (lowercase, no spaces)'));
          process.exit(1);
        }
        projectName = projectName.toLowerCase();
      }

      await generateProject({
        name: projectName,
        type: 'workspace',
        directory: options.directory,
        skipInstall: options.skipInstall || false,
        figmaToken: options.figmaToken
      });
      
      console.log(chalk.green('✨ Successfully initialized Idealyst workspace!'));
      console.log(chalk.blue(`📁 Workspace created in: ${options.directory}/${projectName}`));
      console.log(chalk.yellow('\n🚀 Next steps:'));
      console.log(chalk.white(`  cd ${projectName}`));
      console.log(chalk.white('  idealyst create my-app --type native'));
      console.log(chalk.white('  idealyst create my-web-app --type web'));
    } catch (error) {
      console.error(chalk.red('❌ Error initializing workspace:'), error);
      process.exit(1);
    }
  });

// LLM Reference Data Structure
function getLLMReference() {
  return {
    overview: {
      description: "The Idealyst Framework CLI is a powerful tool for generating TypeScript monorepo projects with React Native, React Web, API servers, database layers, and shared libraries.",
      warning: "⚠️ CRITICAL: Always provide ALL required arguments to avoid interactive prompts that can hang automated processes!"
    },
    safeCommands: {
      workspace: {
        command: "idealyst init <workspace-name>",
        description: "Create a new monorepo workspace",
        example: "idealyst init my-awesome-project"
      },
      database: {
        command: "idealyst create <name> --type database",
        description: "Create standalone database package with Prisma + Zod",
        example: "idealyst create user-db --type database"
      },
      api: {
        command: "idealyst create <name> --type api",
        description: "Create API server with Express + tRPC (no database)",
        example: "idealyst create user-api --type api"
      },
      shared: {
        command: "idealyst create <name> --type shared",
        description: "Create shared utilities and types package",
        example: "idealyst create common-utils --type shared"
      },
      web: {
        command: "idealyst create <name> --type web --with-trpc|--no-trpc",
        description: "Create React web app with Vite",
        examples: [
          "idealyst create web-app --type web --with-trpc",
          "idealyst create web-app --type web --no-trpc"
        ]
      },
      native: {
        command: "idealyst create <name> --type native --app-name \"Name\" --with-trpc|--no-trpc",
        description: "Create React Native app",
        examples: [
          "idealyst create mobile-app --type native --app-name \"My App\" --with-trpc",
          "idealyst create mobile-app --type native --app-name \"My App\" --no-trpc"
        ]
      }
    },
    dangerousCommands: [
      {
        command: "idealyst init",
        issue: "Missing workspace name - will prompt interactively"
      },
      {
        command: "idealyst create my-app",
        issue: "Missing --type parameter - will prompt interactively"
      },
      {
        command: "idealyst create my-app --type web",
        issue: "Missing tRPC choice - will prompt interactively"
      },
      {
        command: "idealyst create my-app --type native",
        issue: "Missing --app-name and tRPC choice - will prompt interactively"
      }
    ],
    projectTypes: {
      workspace: "Monorepo setup with Yarn workspaces",
      database: "Prisma + Zod schemas (standalone, no API)",
      api: "Express + tRPC server (no database included)",
      shared: "Shared utilities and types",
      web: "React web app with Vite",
      native: "React Native app"
    },
    architecture: {
      database: "Export: { db, schemas, PrismaClient, types }",
      api: "Consume database packages as dependencies",
      typescript: "All projects use strict TypeScript",
      monorepo: "Yarn workspaces for dependency management"
    }
  };
}

function generateTextReference(reference: any): string {
  const lines = [];
  
  lines.push('🤖 IDEALYST CLI - COMPLETE LLM REFERENCE');
  lines.push('='.repeat(50));
  lines.push('');
  lines.push(reference.overview.description);
  lines.push('');
  lines.push(reference.overview.warning);
  lines.push('');
  
  lines.push('✅ LLM-SAFE COMMANDS:');
  lines.push('-'.repeat(25));
  Object.entries(reference.safeCommands).forEach(([key, cmd]: [string, any]) => {
    lines.push(`\n${key.toUpperCase()}:`);
    lines.push(`  Command: ${cmd.command}`);
    lines.push(`  Description: ${cmd.description}`);
    if (cmd.example) {
      lines.push(`  Example: ${cmd.example}`);
    }
    if (cmd.examples) {
      lines.push(`  Examples:`);
      cmd.examples.forEach((ex: string) => lines.push(`    ${ex}`));
    }
  });
  
  lines.push('\n❌ DANGEROUS COMMANDS (WILL HANG):');
  lines.push('-'.repeat(35));
  reference.dangerousCommands.forEach((cmd: any) => {
    lines.push(`  ${cmd.command}`);
    lines.push(`    Issue: ${cmd.issue}`);
  });
  
  lines.push('\n📋 PROJECT TYPES:');
  lines.push('-'.repeat(20));
  Object.entries(reference.projectTypes).forEach(([type, desc]) => {
    lines.push(`  ${type}: ${desc}`);
  });
  
  lines.push('\n🏗️ ARCHITECTURE:');
  lines.push('-'.repeat(18));
  Object.entries(reference.architecture).forEach(([key, desc]) => {
    lines.push(`  ${key}: ${desc}`);
  });
  
  return lines.join('\n');
}

function generateMarkdownReference(reference: any): string {
  const lines = [];
  
  lines.push('# Idealyst CLI - LLM Reference');
  lines.push('');
  lines.push(reference.overview.description);
  lines.push('');
  lines.push(`> ${reference.overview.warning}`);
  lines.push('');
  
  lines.push('## ✅ LLM-Safe Commands');
  lines.push('');
  Object.entries(reference.safeCommands).forEach(([key, cmd]: [string, any]) => {
    lines.push(`### ${key.charAt(0).toUpperCase() + key.slice(1)}`);
    lines.push('');
    lines.push('```bash');
    lines.push(cmd.command);
    lines.push('```');
    lines.push('');
    lines.push(cmd.description);
    lines.push('');
    if (cmd.example) {
      lines.push('**Example:**');
      lines.push('```bash');
      lines.push(cmd.example);
      lines.push('```');
      lines.push('');
    }
    if (cmd.examples) {
      lines.push('**Examples:**');
      lines.push('```bash');
      cmd.examples.forEach((ex: string) => lines.push(ex));
      lines.push('```');
      lines.push('');
    }
  });
  
  lines.push('## ❌ Dangerous Commands');
  lines.push('');
  lines.push('These commands will hang by prompting for user input:');
  lines.push('');
  reference.dangerousCommands.forEach((cmd: any) => {
    lines.push(`- \`${cmd.command}\` - ${cmd.issue}`);
  });
  lines.push('');
  
  lines.push('## 📋 Project Types');
  lines.push('');
  Object.entries(reference.projectTypes).forEach(([type, desc]) => {
    lines.push(`- **${type}**: ${desc}`);
  });
  lines.push('');
  
  lines.push('## 🏗️ Architecture');
  lines.push('');
  Object.entries(reference.architecture).forEach(([key, desc]) => {
    lines.push(`- **${key}**: ${desc}`);
  });
  
  return lines.join('\n');
}

program
  .command('llm-commands')
  .description('Display only safe LLM command templates')
  .action(() => {
    const reference = getLLMReference();
    
    console.log(chalk.yellow('⚠️  Always provide ALL required arguments!\n'));
    
    Object.entries(reference.safeCommands).forEach(([key, cmd]: [string, any]) => {
      console.log(chalk.cyan(cmd.command));
      if (cmd.examples) {
        cmd.examples.forEach((ex: string) => console.log(chalk.cyan(ex)));
      }
    });
  });

program
  .command('llm-info')
  .description('Display LLM access methods and available formats')
  .action(() => {
    console.log(chalk.blue.bold('🤖 LLM Access Methods for Idealyst CLI\n'));
    
    console.log(chalk.green('Available Commands:'));
    console.log(chalk.white('  idealyst llm-help          ') + chalk.gray('- Quick reference with safe commands'));
    console.log(chalk.white('  idealyst llm-commands      ') + chalk.gray('- Just the command templates'));
    console.log(chalk.white('  idealyst llm-reference     ') + chalk.gray('- Complete reference (text format)'));
    console.log(chalk.white('  idealyst llm-reference --format json      ') + chalk.gray('- Machine-readable JSON'));
    console.log(chalk.white('  idealyst llm-reference --format markdown  ') + chalk.gray('- Generated markdown'));
    console.log(chalk.white('  idealyst llm-reference --format file      ') + chalk.gray('- Full markdown documentation\n'));
    
    console.log(chalk.yellow('⚠️  Critical for LLMs:'));
    console.log(chalk.red('  • Never use commands without required arguments'));
    console.log(chalk.red('  • Always specify --type for create commands'));
    console.log(chalk.red('  • Always specify --app-name for native projects'));
    console.log(chalk.red('  • Always specify --with-trpc or --no-trpc for web/native\n'));
    
    console.log(chalk.blue('📖 Documentation:'));
    console.log(chalk.white('  • Built-in: Use commands above'));
    console.log(chalk.white('  • Files: docs/LLM-CLI-REFERENCE.md (comprehensive)'));
    console.log(chalk.white('  • Files: docs/LLM-CLI-QUICK-REFERENCE.md (condensed)'));
  });

program
  .command('llm-reference')
  .description('Display complete LLM reference documentation')
  .option('--format <format>', 'Output format: text, json, markdown, or file', 'text')
  .action((options: { format: string }) => {
    const reference = getLLMReference();
    
    switch (options.format) {
      case 'json':
        console.log(JSON.stringify(reference, null, 2));
        break;
      case 'markdown':
        console.log(generateMarkdownReference(reference));
        break;
      case 'file':
        // Try to read the markdown file from docs
        const docsPath = path.join(__dirname, '..', 'docs', 'LLM-CLI-REFERENCE.md');
        try {
          if (fs.existsSync(docsPath)) {
            const content = fs.readFileSync(docsPath, 'utf8');
            console.log(content);
          } else {
            console.log(chalk.yellow('⚠️  Docs file not found, generating markdown instead:'));
            console.log(generateMarkdownReference(reference));
          }
        } catch (error) {
          console.log(chalk.yellow('⚠️  Error reading docs file, generating markdown instead:'));
          console.log(generateMarkdownReference(reference));
        }
        break;
      default:
        console.log(generateTextReference(reference));
    }
  });

program
  .command('llm-help')
  .description('Display quick LLM-friendly CLI reference')
  .action(() => {
    console.log(chalk.blue.bold('🤖 Idealyst CLI - LLM Quick Reference\n'));
    
    console.log(chalk.yellow('⚠️  CRITICAL: Always provide ALL required arguments to avoid interactive prompts!\n'));
    
    console.log(chalk.green.bold('✅ LLM-Safe Commands:\n'));
    
    console.log(chalk.white('📁 Initialize Workspace:'));
    console.log(chalk.cyan('  idealyst init <workspace-name>\n'));
    
    console.log(chalk.white('📦 Create Projects (No extra args needed):'));
    console.log(chalk.cyan('  idealyst create <name> --type database'));
    console.log(chalk.cyan('  idealyst create <name> --type api'));
    console.log(chalk.cyan('  idealyst create <name> --type shared\n'));
    
    console.log(chalk.white('🌐 Create Web Projects (tRPC choice required):'));
    console.log(chalk.cyan('  idealyst create <name> --type web --with-trpc'));
    console.log(chalk.cyan('  idealyst create <name> --type web --no-trpc\n'));
    
    console.log(chalk.white('📱 Create Native Projects (app-name + tRPC required):'));
    console.log(chalk.cyan('  idealyst create <name> --type native --app-name "Display Name" --with-trpc'));
    console.log(chalk.cyan('  idealyst create <name> --type native --app-name "Display Name" --no-trpc\n'));
    
    console.log(chalk.red.bold('❌ Commands That Will Hang LLMs:\n'));
    console.log(chalk.red('  idealyst init                          # Missing name'));
    console.log(chalk.red('  idealyst create my-app                 # Missing --type'));
    console.log(chalk.red('  idealyst create my-app --type web      # Missing tRPC choice'));
    console.log(chalk.red('  idealyst create my-app --type native   # Missing --app-name + tRPC\n'));
    
    console.log(chalk.blue('📋 Project Types:'));
    console.log(chalk.white('  • workspace  - Monorepo setup with Yarn workspaces'));
    console.log(chalk.white('  • database   - Prisma + Zod schemas (new standalone type)'));
    console.log(chalk.white('  • api        - Express + tRPC server (no database included)'));
    console.log(chalk.white('  • shared     - Shared utilities and types'));
    console.log(chalk.white('  • web        - React web app with Vite'));
    console.log(chalk.white('  • native     - React Native app\n'));
    
    console.log(chalk.magenta('🔗 Key Architecture:'));
    console.log(chalk.white('  • Database packages export: { db, schemas, PrismaClient, types }'));
    console.log(chalk.white('  • API packages consume database packages as dependencies'));
    console.log(chalk.white('  • All projects are TypeScript with strict type safety'));
    console.log(chalk.white('  • Monorepo uses Yarn workspaces for dependency management\n'));
    
    console.log(chalk.green('📖 For complete documentation:'));
    console.log(chalk.cyan('  idealyst llm-reference'));
    console.log(chalk.cyan('  idealyst llm-reference --format markdown'));
    console.log(chalk.cyan('  idealyst llm-reference --format json'));
  });

program.parse(); 