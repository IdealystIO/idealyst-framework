/**
 * GraphQL extension wizard step
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { WizardStep, ProjectConfig } from '../../types';
import { validateBoolean } from '../validators';

export const graphqlExtensionStep: WizardStep<boolean> = {
  id: 'extensions.graphql',

  async prompt(currentConfig: Partial<ProjectConfig>): Promise<boolean> {
    console.log(chalk.bold('\nStep 6: GraphQL'));
    console.log(chalk.dim('GraphQL API with Pothos for type-safe schema building.'));
    console.log(chalk.dim('Can be used alongside or instead of tRPC.\n'));

    const { enableGraphql } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'enableGraphql',
        message: 'Enable GraphQL?',
        default: false,
      },
    ]);

    return enableGraphql;
  },

  validate(value: boolean) {
    return validateBoolean(value);
  },

  // Only show if API is enabled
  shouldShow(config: Partial<ProjectConfig>): boolean {
    return config.extensions?.api === true;
  },
};
