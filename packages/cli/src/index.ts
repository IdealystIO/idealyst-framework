#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
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
  .option('-t, --type <type>', 'Project type: native, web, shared, or api')
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

      const validTypes = ['native', 'web', 'shared', 'api'];
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
        console.log(chalk.white('  yarn db:push    # Push database schema'));
        console.log(chalk.white('  yarn db:studio  # Open Prisma Studio'));
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
  .action(async (projectName: string | undefined, options: {
    directory: string;
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

      await generateProject({
        name: projectName,
        type: 'workspace',
        directory: options.directory,
        skipInstall: options.skipInstall || false
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

program.parse(); 