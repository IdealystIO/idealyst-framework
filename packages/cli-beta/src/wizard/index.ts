/**
 * Wizard orchestrator - manages the step-by-step configuration flow
 */

import chalk from 'chalk';
import { ProjectConfig, CLIArgs, ExtensionConfig } from '../types';
import { generateIdentifiers } from '../identifiers';
import {
  projectNameStep,
  orgDomainStep,
  appDisplayNameStep,
  apiExtensionStep,
  trpcExtensionStep,
  graphqlExtensionStep,
  prismaExtensionStep,
  devcontainerExtensionStep,
  summaryStep,
} from './steps';

/**
 * Run the interactive wizard to collect all configuration
 */
export async function runWizard(
  prefilledArgs: Partial<CLIArgs> = {}
): Promise<ProjectConfig | null> {
  console.log(chalk.blue.bold('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.blue.bold('  🚀 Welcome to Idealyst Framework Setup!'));
  console.log(chalk.blue.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.gray('\nThis wizard will guide you through setting up your new project.'));
  console.log(chalk.gray('Press Ctrl+C at any time to cancel.\n'));

  // Build partial config from prefilled args
  const config: Partial<ProjectConfig> = {
    extensions: {
      api: prefilledArgs.withApi ?? false,
      prisma: prefilledArgs.withPrisma ?? false,
      trpc: prefilledArgs.withTrpc ?? false,
      graphql: prefilledArgs.withGraphql ?? false,
      devcontainer: prefilledArgs.withDevcontainer ?? false,
    },
  };

  // Step 1: Project name
  if (prefilledArgs.projectName) {
    config.projectName = prefilledArgs.projectName;
    console.log(chalk.gray(`✓ Project name: ${config.projectName} (from arguments)`));
  } else {
    config.projectName = await projectNameStep.prompt(config);
  }

  // Step 2: Organization domain
  if (prefilledArgs.orgDomain) {
    config.orgDomain = prefilledArgs.orgDomain;
    console.log(chalk.gray(`✓ Organization domain: ${config.orgDomain} (from arguments)`));
  } else {
    config.orgDomain = await orgDomainStep.prompt(config);
  }

  // Step 3: App display name
  if (prefilledArgs.appDisplayName) {
    config.appDisplayName = prefilledArgs.appDisplayName;
    console.log(chalk.gray(`✓ App display name: ${config.appDisplayName} (from arguments)`));
  } else {
    config.appDisplayName = await appDisplayNameStep.prompt(config);
  }

  // Step 4: API extension
  if (prefilledArgs.withApi !== undefined) {
    console.log(chalk.gray(`✓ API server: ${prefilledArgs.withApi ? 'enabled' : 'disabled'} (from arguments)`));
  } else {
    config.extensions!.api = await apiExtensionStep.prompt(config);
  }

  // Step 5: tRPC extension (only if API enabled)
  if (config.extensions!.api) {
    if (prefilledArgs.withTrpc !== undefined) {
      console.log(chalk.gray(`✓ tRPC: ${prefilledArgs.withTrpc ? 'enabled' : 'disabled'} (from arguments)`));
    } else {
      config.extensions!.trpc = await trpcExtensionStep.prompt(config);
    }

    // Step 6: GraphQL extension (only if API enabled)
    if (prefilledArgs.withGraphql !== undefined) {
      console.log(chalk.gray(`✓ GraphQL: ${prefilledArgs.withGraphql ? 'enabled' : 'disabled'} (from arguments)`));
    } else {
      config.extensions!.graphql = await graphqlExtensionStep.prompt(config);
    }
  }

  // Step 7: Prisma extension
  if (prefilledArgs.withPrisma !== undefined) {
    console.log(chalk.gray(`✓ Prisma database: ${prefilledArgs.withPrisma ? 'enabled' : 'disabled'} (from arguments)`));
  } else {
    config.extensions!.prisma = await prismaExtensionStep.prompt(config);
  }

  // Step 8: Devcontainer extension
  if (prefilledArgs.withDevcontainer !== undefined) {
    console.log(chalk.gray(`✓ Devcontainer: ${prefilledArgs.withDevcontainer ? 'enabled' : 'disabled'} (from arguments)`));
  } else {
    config.extensions!.devcontainer = await devcontainerExtensionStep.prompt(config);
  }

  // Summary and confirmation
  const confirmed = await summaryStep.prompt(config);

  if (!confirmed) {
    console.log(chalk.yellow('\nProject creation cancelled.'));
    return null;
  }

  // Generate mobile identifiers
  const identifiers = generateIdentifiers(config.orgDomain!, config.projectName!);

  return {
    projectName: config.projectName!,
    orgDomain: config.orgDomain!,
    appDisplayName: config.appDisplayName!,
    iosBundleId: identifiers.iosBundleId,
    androidPackageName: identifiers.androidPackageName,
    extensions: config.extensions as ExtensionConfig,
    directory: prefilledArgs.directory ?? '.',
    skipInstall: prefilledArgs.skipInstall ?? false,
    isInteractive: true,
  };
}

/**
 * Validate CLI args for non-interactive mode
 */
export function validateNonInteractiveArgs(args: CLIArgs): {
  valid: boolean;
  missing: string[];
} {
  const required: Array<{ field: keyof CLIArgs; flag: string; description: string }> = [
    { field: 'projectName', flag: 'project-name', description: 'Project name (positional argument)' },
    { field: 'orgDomain', flag: '--org-domain', description: 'Organization domain (e.g., com.company)' },
    { field: 'appDisplayName', flag: '--app-name', description: 'Mobile app display name' },
  ];

  const missing: string[] = [];

  for (const { field, flag, description } of required) {
    if (!args[field]) {
      missing.push(`${flag}: ${description}`);
    }
  }

  // Validate extension dependencies
  if (args.withTrpc && !args.withApi) {
    missing.push('--with-api: Required when using --with-trpc');
  }
  if (args.withGraphql && !args.withApi) {
    missing.push('--with-api: Required when using --with-graphql');
  }

  return { valid: missing.length === 0, missing };
}

/**
 * Build a ProjectConfig from CLI arguments (for non-interactive mode)
 */
export function buildConfigFromArgs(args: CLIArgs): ProjectConfig {
  const identifiers = generateIdentifiers(args.orgDomain!, args.projectName!);

  return {
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
    skipInstall: args.skipInstall ?? false,
    isInteractive: false,
  };
}

export * from './validators';
