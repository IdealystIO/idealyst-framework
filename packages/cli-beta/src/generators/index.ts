/**
 * Generator orchestrator - main entry point for project generation
 */

import path from 'path';
import { ProjectConfig, GeneratorResult, TemplateData } from '../types';
import { generateWorkspace } from './workspace';
import { generateSharedPackage, generateWebPackage, generateMobilePackage } from './core';
import { applyApiExtension } from './extensions/api';
import { applyPrismaExtension } from './extensions/prisma';
import { applyTrpcExtension } from './extensions/trpc';
import { applyGraphqlExtension } from './extensions/graphql';
import { installDependencies } from '../utils/shell';
import { logger } from '../utils/logger';
import { IDEALYST_VERSION } from '../constants';
import { buildTemplateData } from '../templates/processor';

/**
 * Main generator function - orchestrates all generation
 */
export async function generateProject(config: ProjectConfig): Promise<GeneratorResult> {
  const projectPath = path.join(config.directory, config.projectName);
  const warnings: string[] = [];
  const nextSteps: string[] = [];

  logger.header(`Creating Idealyst workspace: ${config.projectName}`);

  // Build template data
  const templateData = buildTemplateData(config, IDEALYST_VERSION);

  // Step 1: Generate workspace root
  logger.step('Creating workspace structure...');
  await generateWorkspace(projectPath, templateData);

  // Step 2: Generate core packages (always included)
  logger.step('Creating shared package...');
  await generateSharedPackage(projectPath, templateData);

  logger.step('Creating web package...');
  await generateWebPackage(projectPath, templateData);

  // Step 3: Generate mobile package with React Native
  logger.step('Setting up React Native mobile package...');
  const mobileResult = await generateMobilePackage(projectPath, {
    ...templateData,
    bundleId: config.iosBundleId,
    packageName: config.androidPackageName,
    skipInstall: true, // We'll install all at once at the end
  });

  if (mobileResult.warning) {
    warnings.push(mobileResult.warning);
  }

  // Step 4: Apply extensions
  const packagesCreated = ['shared', 'web', 'mobile'];
  const extensionsEnabled: string[] = [];

  if (config.extensions.api) {
    logger.step('Adding API server...');
    await applyApiExtension(projectPath, templateData);
    packagesCreated.push('api');
    extensionsEnabled.push('api');
  }

  if (config.extensions.prisma) {
    logger.step('Adding Prisma database...');
    await applyPrismaExtension(projectPath, templateData);
    packagesCreated.push('database');
    extensionsEnabled.push('prisma');
    nextSteps.push('Run `yarn db:generate` to generate Prisma client');
  }

  if (config.extensions.trpc) {
    logger.step('Configuring tRPC...');
    await applyTrpcExtension(projectPath, templateData);
    extensionsEnabled.push('trpc');
  }

  if (config.extensions.graphql) {
    logger.step('Configuring GraphQL...');
    await applyGraphqlExtension(projectPath, templateData);
    extensionsEnabled.push('graphql');
  }

  // Step 5: Install dependencies
  if (!config.skipInstall) {
    logger.step('Installing dependencies...');
    try {
      await installDependencies(projectPath);
      logger.success('Dependencies installed successfully!');
    } catch (error) {
      warnings.push('Failed to install dependencies. Run `yarn install` manually.');
    }
  } else {
    nextSteps.unshift('Run `yarn install` to install dependencies');
  }

  // Add common next steps
  nextSteps.push('Run `yarn dev` to start all development servers');

  return {
    success: true,
    projectPath,
    packagesCreated,
    extensionsEnabled,
    warnings,
    nextSteps,
  };
}

export * from './workspace';
export * from './core';
export * from './reactNative';
