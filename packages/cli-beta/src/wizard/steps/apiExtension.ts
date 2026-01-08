/**
 * API extension wizard step
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { WizardStep, ProjectConfig } from '../../types';
import { validateBoolean } from '../validators';

export const apiExtensionStep: WizardStep<boolean> = {
  id: 'extensions.api',

  async prompt(currentConfig: Partial<ProjectConfig>): Promise<boolean> {
    console.log(chalk.bold('\nStep 4: API Server'));
    console.log(chalk.dim('An Express-based API server for your backend.'));
    console.log(chalk.dim('Required if you want to use tRPC or GraphQL.\n'));

    const { enableApi } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'enableApi',
        message: 'Enable API server?',
        default: false,
      },
    ]);

    return enableApi;
  },

  validate(value: boolean) {
    return validateBoolean(value);
  },
};
