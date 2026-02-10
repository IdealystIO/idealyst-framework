/**
 * Add command - adds a new project to an existing workspace
 */

import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { AddProjectOptions, AddableProjectType, NotInWorkspaceError } from '../types';
import { logger } from '../utils/logger';
import { generateWebPackage, generateMobilePackage, generateSharedPackage } from '../generators/core';
import { applyApiExtension } from '../generators/extensions/api';
import { addToWorkspaces } from '../templates/merger';
import { buildTemplateData } from '../templates/processor';
import { IDEALYST_VERSION } from '../constants';

export interface AddCommandOptions {
  type: string;
  appName?: string;
  withTrpc?: boolean;
  withGraphql?: boolean;
  skipInstall?: boolean;
}

/**
 * Handle the `idealyst add` command
 */
export async function addCommand(
  name: string,
  options: AddCommandOptions
): Promise<void> {
  try {
    // Validate project type
    const validTypes: AddableProjectType[] = ['web', 'mobile', 'api', 'shared'];
    if (!validTypes.includes(options.type as AddableProjectType)) {
      logger.error(`Invalid project type: ${options.type}`);
      logger.dim(`Valid types: ${validTypes.join(', ')}`);
      process.exit(1);
    }

    // Find workspace root
    const workspaceRoot = await findWorkspaceRoot(process.cwd());
    if (!workspaceRoot) {
      throw new NotInWorkspaceError('add');
    }

    // Get workspace info from root package.json
    const rootPackageJson = await fs.readJson(path.join(workspaceRoot, 'package.json'));
    const workspaceScope = extractWorkspaceScope(rootPackageJson.name);

    logger.header(`Adding ${options.type} project: ${name}`);

    // Build template data
    const templateData = buildTemplateData({
      projectName: name,
      appDisplayName: options.appName || toTitleCase(name.replace(/-/g, ' ')),
      iosBundleId: '', // Will be set for mobile
      androidPackageName: '', // Will be set for mobile
      extensions: {
        api: false,
        prisma: false,
        databaseProvider: 'sqlite',
        trpc: options.withTrpc ?? false,
        graphql: options.withGraphql ?? false,
        devcontainer: false,
      },
    }, IDEALYST_VERSION);

    // Override workspace scope
    templateData.workspaceScope = workspaceScope;
    templateData.packageName = `@${workspaceScope}/${name}`;

    // Generate the project based on type
    const type = options.type as AddableProjectType;
    const projectPath = path.join(workspaceRoot, 'packages', name);

    // Check if project already exists
    if (await fs.pathExists(projectPath)) {
      logger.error(`Project already exists: packages/${name}`);
      process.exit(1);
    }

    switch (type) {
      case 'web':
        await generateWebPackage(workspaceRoot, {
          ...templateData,
          projectName: name,
        });
        break;

      case 'mobile':
        if (!options.appName) {
          logger.error('Mobile projects require --app-name');
          logger.dim('Example: idealyst add admin --type mobile --app-name "Admin App"');
          process.exit(1);
        }
        // For mobile, we need bundle IDs
        const { generateIdentifiers } = await import('../identifiers');
        const identifiers = generateIdentifiers(
          extractOrgDomain(rootPackageJson.name),
          name
        );
        await generateMobilePackage(workspaceRoot, {
          ...templateData,
          projectName: name,
          appDisplayName: options.appName,
          bundleId: identifiers.iosBundleId,
          packageName: identifiers.androidPackageName,
          skipInstall: options.skipInstall,
        });
        break;

      case 'api':
        await applyApiExtension(workspaceRoot, {
          ...templateData,
          projectName: name,
        });
        break;

      case 'shared':
        await generateSharedPackage(workspaceRoot, {
          ...templateData,
          projectName: name,
        });
        break;
    }

    // Update root package.json workspaces (if not already using packages/*)
    if (!rootPackageJson.workspaces?.includes('packages/*')) {
      await addToWorkspaces(
        path.join(workspaceRoot, 'package.json'),
        `packages/${name}`
      );
    }

    // Print success
    printAddSuccess(name, type, workspaceRoot);

  } catch (error) {
    if (error instanceof NotInWorkspaceError) {
      logger.error(error.message);
      logger.dim('Run this command from within an Idealyst workspace directory.');
      process.exit(1);
    }

    if (error instanceof Error) {
      logger.error(error.message);
      if (process.env.DEBUG) {
        console.error(error.stack);
      }
    }
    process.exit(1);
  }
}

/**
 * Find workspace root by looking for package.json with workspaces
 */
async function findWorkspaceRoot(startDir: string): Promise<string | null> {
  let currentDir = startDir;

  while (currentDir !== path.dirname(currentDir)) {
    const packageJsonPath = path.join(currentDir, 'package.json');

    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      if (packageJson.workspaces) {
        return currentDir;
      }
    }

    currentDir = path.dirname(currentDir);
  }

  return null;
}

/**
 * Extract workspace scope from package name
 */
function extractWorkspaceScope(packageName: string): string {
  // Handle @scope/name format
  if (packageName.startsWith('@')) {
    const match = packageName.match(/@([^/]+)/);
    return match ? match[1] : packageName;
  }
  return packageName;
}

/**
 * Extract org domain from workspace name (best effort)
 */
function extractOrgDomain(packageName: string): string {
  const scope = extractWorkspaceScope(packageName);
  // Convert scope to reverse domain notation
  return `com.${scope.replace(/-/g, '')}`;
}

/**
 * Convert string to title case
 */
function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Print success message for add command
 */
function printAddSuccess(
  name: string,
  type: AddableProjectType,
  workspaceRoot: string
): void {
  console.log(chalk.green.bold('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.green.bold(`  ✓ Added ${type} project: ${name}`));
  console.log(chalk.green.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  console.log(chalk.cyan('  Location:'));
  console.log(`    ${path.join(workspaceRoot, 'packages', name)}\n`);

  console.log(chalk.cyan('  Next steps:'));
  console.log(chalk.dim('    yarn install'));

  switch (type) {
    case 'web':
      console.log(chalk.dim(`    yarn workspace @*/${name} dev`));
      break;
    case 'mobile':
      console.log(chalk.dim(`    yarn workspace @*/${name} start`));
      break;
    case 'api':
      console.log(chalk.dim(`    yarn workspace @*/${name} dev`));
      break;
  }

  console.log('');

  // Additional instructions for connecting to existing packages
  console.log(chalk.cyan('  To connect to existing packages:'));
  console.log(chalk.dim('    1. Add the dependency in package.json'));
  console.log(chalk.dim('    2. Import and use components/utilities'));
  console.log('');
}
