/**
 * Init command - creates a new Idealyst workspace
 */

import chalk from 'chalk';
import {
  CLIArgs,
  ProjectConfig,
  MissingArgumentsError,
  InvalidExtensionError,
} from '../types';
import { runWizard, validateNonInteractiveArgs } from '../wizard';
import { generateProject } from '../generators';
import { generateIdentifiers } from '../identifiers';
import { logger } from '../utils/logger';
import { validateExtensions } from '../utils/validation';

export interface InitOptions {
  directory: string;
  orgDomain?: string;
  appName?: string;
  withApi?: boolean;
  withPrisma?: boolean;
  withTrpc?: boolean;
  withGraphql?: boolean;
  withDevcontainer?: boolean;
  currentDir?: boolean; // Initialize in current directory instead of creating a new folder
  interactive?: boolean; // Commander converts --no-interactive to interactive: false
  skipInstall?: boolean;
}

/**
 * Handle the `idealyst init` command
 */
export async function initCommand(
  projectName: string | undefined,
  options: InitOptions
): Promise<void> {
  try {
    const args: CLIArgs = {
      projectName,
      orgDomain: options.orgDomain,
      appDisplayName: options.appName,
      withApi: options.withApi,
      withPrisma: options.withPrisma,
      withTrpc: options.withTrpc,
      withGraphql: options.withGraphql,
      withDevcontainer: options.withDevcontainer,
      noInteractive: options.interactive === false,
      skipInstall: options.skipInstall,
      directory: options.directory,
    };

    // Validate extension dependencies
    const extValidation = validateExtensions({
      withApi: args.withApi,
      withTrpc: args.withTrpc,
      withGraphql: args.withGraphql,
    });

    if (!extValidation.valid) {
      throw new InvalidExtensionError(
        args.withTrpc ? 'trpc' : 'graphql',
        'api'
      );
    }

    let config: ProjectConfig | null;

    if (args.noInteractive) {
      // Non-interactive mode - validate all required args present
      const validation = validateNonInteractiveArgs(args);

      if (!validation.valid) {
        printMissingArgsError(validation.missing);
        process.exit(1);
      }

      // Build config directly from args
      const identifiers = generateIdentifiers(args.orgDomain!, args.projectName!);

      config = {
        projectName: args.projectName!,
        orgDomain: args.orgDomain!,
        appDisplayName: args.appDisplayName!,
        iosBundleId: identifiers.iosBundleId,
        androidPackageName: identifiers.androidPackageName,
        extensions: {
          api: args.withApi ?? false,
          prisma: args.withPrisma ?? false,
          trpc: args.withTrpc ?? false,
          graphql: args.withGraphql ?? false,
          devcontainer: args.withDevcontainer ?? false,
        },
        directory: args.directory ?? '.',
        useCurrentDir: options.currentDir ?? false,
        skipInstall: args.skipInstall ?? false,
        isInteractive: false,
      };
    } else {
      // Interactive wizard mode
      config = await runWizard(args);

      if (!config) {
        // User cancelled
        process.exit(0);
      }
    }

    // Generate the project
    const result = await generateProject(config);

    // Display results
    printResults(result, config);

  } catch (error) {
    if (error instanceof InvalidExtensionError) {
      logger.error(error.message);
      logger.dim('Add --with-api to enable the API server first.');
      process.exit(1);
    }

    if (error instanceof Error) {
      logger.error(error.message);
      if (process.env.DEBUG) {
        console.error(error.stack);
      }
    } else {
      logger.error('An unexpected error occurred');
    }
    process.exit(1);
  }
}

/**
 * Print missing arguments error for non-interactive mode
 */
function printMissingArgsError(missing: string[]): void {
  console.log(chalk.red.bold('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.red.bold('  Error: Missing required arguments'));
  console.log(chalk.red.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  console.log(chalk.yellow('The following arguments are required in non-interactive mode:\n'));

  for (const arg of missing) {
    console.log(chalk.red(`  ✗ ${arg}`));
  }

  console.log(chalk.dim('\nExample usage:'));
  console.log(chalk.cyan(`  idealyst init my-app --no-interactive \\
    --org-domain com.mycompany \\
    --app-name "My Awesome App"\n`));

  console.log(chalk.dim('Or run without --no-interactive to use the interactive wizard.'));
}

/**
 * Print generation results
 */
function printResults(
  result: import('../types').GeneratorResult,
  config: ProjectConfig
): void {
  console.log(chalk.green.bold('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.green.bold('  ✓ Project created successfully!'));
  console.log(chalk.green.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  console.log(chalk.cyan('  Location:'));
  console.log(`    ${result.projectPath}\n`);

  console.log(chalk.cyan('  Packages created:'));
  for (const pkg of result.packagesCreated) {
    console.log(chalk.green(`    ✓ ${pkg}`));
  }
  console.log('');

  if (result.extensionsEnabled.length > 0) {
    console.log(chalk.cyan('  Extensions enabled:'));
    for (const ext of result.extensionsEnabled) {
      console.log(chalk.green(`    ✓ ${ext}`));
    }
    console.log('');
  }

  if (result.warnings.length > 0) {
    console.log(chalk.yellow('  Warnings:'));
    for (const warning of result.warnings) {
      console.log(chalk.yellow(`    ⚠ ${warning}`));
    }
    console.log('');
  }

  console.log(chalk.cyan('  Next steps:'));
  if (!config.useCurrentDir) {
    console.log(chalk.dim(`    cd ${config.projectName}`));
  }
  for (const step of result.nextSteps) {
    console.log(chalk.dim(`    ${step}`));
  }
  console.log('');
}
