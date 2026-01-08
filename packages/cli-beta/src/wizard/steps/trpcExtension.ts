/**
 * tRPC extension wizard step
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { WizardStep, ProjectConfig } from '../../types';
import { validateBoolean } from '../validators';

export const trpcExtensionStep: WizardStep<boolean> = {
  id: 'extensions.trpc',

  async prompt(currentConfig: Partial<ProjectConfig>): Promise<boolean> {
    console.log(chalk.bold('\nStep 5: tRPC'));
    console.log(chalk.dim('Type-safe RPC for end-to-end type safety between frontend and backend.'));
    console.log(chalk.dim('Integrates with React Query for data fetching.\n'));

    const { enableTrpc } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'enableTrpc',
        message: 'Enable tRPC?',
        default: true,
      },
    ]);

    return enableTrpc;
  },

  validate(value: boolean) {
    return validateBoolean(value);
  },

  // Only show if API is enabled
  shouldShow(config: Partial<ProjectConfig>): boolean {
    return config.extensions?.api === true;
  },
};
