/**
 * Summary wizard step
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { WizardStep, ProjectConfig } from '../../types';
import { generateIdentifiers } from '../../identifiers';

export const summaryStep: WizardStep<boolean> = {
  id: 'confirm',

  async prompt(currentConfig: Partial<ProjectConfig>): Promise<boolean> {
    // Generate identifiers for display
    const identifiers = generateIdentifiers(
      currentConfig.orgDomain!,
      currentConfig.projectName!
    );

    console.log(chalk.bold('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.bold.blue('  Configuration Summary'));
    console.log(chalk.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

    // Basic info
    console.log(chalk.cyan('  Basic Information:'));
    console.log(`    ${chalk.gray('Project Name:')}      ${currentConfig.projectName}`);
    console.log(`    ${chalk.gray('Display Name:')}      ${currentConfig.appDisplayName}`);
    console.log(`    ${chalk.gray('Organization:')}      ${currentConfig.orgDomain}`);
    console.log('');

    // Mobile identifiers
    console.log(chalk.cyan('  Mobile App Identifiers:'));
    console.log(`    ${chalk.gray('iOS Bundle ID:')}     ${identifiers.iosBundleId}`);
    console.log(`    ${chalk.gray('Android Package:')}   ${identifiers.androidPackageName}`);
    console.log('');

    // Core packages (always included)
    console.log(chalk.cyan('  Core Packages:'));
    console.log(`    ${chalk.green('✓')} shared    ${chalk.dim('- Shared components and utilities')}`);
    console.log(`    ${chalk.green('✓')} web       ${chalk.dim('- React web application')}`);
    console.log(`    ${chalk.green('✓')} mobile    ${chalk.dim('- React Native mobile application')}`);
    console.log('');

    // Extensions
    const extensions = currentConfig.extensions || { api: false, prisma: false, trpc: false, graphql: false };
    const enabledExtensions: string[] = [];

    if (extensions.api) enabledExtensions.push('api');
    if (extensions.prisma) enabledExtensions.push('prisma');
    if (extensions.trpc) enabledExtensions.push('trpc');
    if (extensions.graphql) enabledExtensions.push('graphql');

    console.log(chalk.cyan('  Extensions:'));
    if (enabledExtensions.length === 0) {
      console.log(`    ${chalk.dim('None selected')}`);
    } else {
      if (extensions.api) {
        console.log(`    ${chalk.green('✓')} api       ${chalk.dim('- Express API server')}`);
      }
      if (extensions.prisma) {
        console.log(`    ${chalk.green('✓')} database  ${chalk.dim('- Prisma database layer')}`);
      }
      if (extensions.trpc) {
        console.log(`    ${chalk.green('✓')} tRPC      ${chalk.dim('- Type-safe RPC')}`);
      }
      if (extensions.graphql) {
        console.log(`    ${chalk.green('✓')} GraphQL   ${chalk.dim('- GraphQL API')}`);
      }
    }
    console.log('');
    console.log(chalk.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Create project with this configuration?',
        default: true,
      },
    ]);

    return confirm;
  },

  validate(value: boolean) {
    return { valid: true };
  },
};
