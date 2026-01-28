#!/usr/bin/env node

/**
 * Idealyst CLI - Main entry point
 */

import { Command } from 'commander';
import { VERSION } from './constants';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { infoCommand } from './commands/info';

const program = new Command();

program
  .name('idealyst')
  .description('CLI tool for generating Idealyst Framework projects')
  .version(VERSION);

// Main init command with wizard
program
  .command('init [project-name]')
  .description('Initialize a new Idealyst workspace with interactive wizard')
  .option('-d, --directory <dir>', 'Output directory', '.')
  .option('--org-domain <domain>', 'Organization domain (e.g., com.company)')
  .option('--app-name <name>', 'Mobile app display name')
  .option('--with-api', 'Enable API server')
  .option('--with-prisma', 'Enable Prisma database')
  .option('--with-trpc', 'Enable tRPC (requires --with-api)')
  .option('--with-graphql', 'Enable GraphQL (requires --with-api)')
  .option('--with-devcontainer', 'Enable devcontainer setup (Docker, PostgreSQL, Redis, Claude Code)')
  .option('--current-dir', 'Initialize in current directory instead of creating a new folder')
  .option('--blank', 'Create a minimal Hello World app instead of the showcase app')
  .option('--no-interactive', 'Disable interactive mode (requires all options)')
  .option('--skip-install', 'Skip dependency installation')
  .action(initCommand);

// Add projects to existing workspace
program
  .command('add <name>')
  .description('Add a new project to an existing workspace')
  .requiredOption('-t, --type <type>', 'Project type: web, mobile, api, shared')
  .option('--app-name <name>', 'Mobile app display name (for mobile type)')
  .option('--with-trpc', 'Include tRPC setup')
  .option('--with-graphql', 'Include GraphQL setup')
  .option('--skip-install', 'Skip dependency installation')
  .action(addCommand);

// Info command
program
  .command('info')
  .description('Display CLI information and usage')
  .option('--format <format>', 'Output format: text, json, markdown', 'text')
  .action(infoCommand);

// LLM-friendly help command
program
  .command('llm-help')
  .description('Quick reference for LLM usage (non-interactive)')
  .action(() => infoCommand({ format: 'llm' }));

// Parse arguments
program.parse();
