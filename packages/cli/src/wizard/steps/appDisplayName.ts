/**
 * App display name wizard step
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { WizardStep, ProjectConfig } from '../../types';
import { validateAppDisplayName, formatValidationError } from '../validators';

export const appDisplayNameStep: WizardStep<string> = {
  id: 'appDisplayName',

  async prompt(currentConfig: Partial<ProjectConfig>): Promise<string> {
    // Suggest a display name based on project name
    const suggestedName = currentConfig.projectName
      ? toTitleCase(currentConfig.projectName.replace(/-/g, ' '))
      : 'My App';

    console.log(chalk.bold('\nStep 3: App Display Name'));
    console.log(chalk.dim('This is the human-readable name shown to users.'));
    console.log(chalk.dim('It will appear on the device home screen and in app stores.\n'));

    const { appDisplayName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'appDisplayName',
        message: 'App display name:',
        default: suggestedName,
        validate: (input: string) => {
          const result = validateAppDisplayName(input);
          if (!result.valid) {
            return formatValidationError(result);
          }
          return true;
        },
      },
    ]);

    return appDisplayName;
  },

  validate(value: string) {
    return validateAppDisplayName(value);
  },
};

/**
 * Convert string to title case
 */
function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
