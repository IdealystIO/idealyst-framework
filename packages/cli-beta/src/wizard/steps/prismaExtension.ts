/**
 * Prisma extension wizard step
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { WizardStep, ProjectConfig } from '../../types';
import { validateBoolean } from '../validators';

export const prismaExtensionStep: WizardStep<boolean> = {
  id: 'extensions.prisma',

  async prompt(currentConfig: Partial<ProjectConfig>): Promise<boolean> {
    console.log(chalk.bold('\nStep 7: Prisma Database'));
    console.log(chalk.dim('Type-safe database client with migrations and studio.'));
    console.log(chalk.dim('Supports PostgreSQL, MySQL, SQLite, and more.\n'));

    const { enablePrisma } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'enablePrisma',
        message: 'Enable Prisma database?',
        default: false,
      },
    ]);

    return enablePrisma;
  },

  validate(value: boolean) {
    return validateBoolean(value);
  },
};
