/**
 * Project name wizard step
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { WizardStep, ProjectConfig } from '../../types';
import { validateProjectName, formatValidationError } from '../validators';

export const projectNameStep: WizardStep<string> = {
  id: 'projectName',

  async prompt(currentConfig: Partial<ProjectConfig>): Promise<string> {
    console.log(chalk.bold('\nStep 1: Project Name'));
    console.log(chalk.dim('This will be used for the workspace directory and npm package names.'));
    console.log(chalk.dim('Use lowercase letters, numbers, and hyphens only.\n'));

    const { projectName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'my-app',
        validate: (input: string) => {
          const result = validateProjectName(input);
          if (!result.valid) {
            return formatValidationError(result);
          }
          return true;
        },
      },
    ]);

    return projectName;
  },

  validate(value: string) {
    return validateProjectName(value);
  },
};
