/**
 * Organization domain wizard step
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { WizardStep, ProjectConfig } from '../../types';
import { validateOrgDomain, formatValidationError } from '../validators';

export const orgDomainStep: WizardStep<string> = {
  id: 'orgDomain',

  async prompt(currentConfig: Partial<ProjectConfig>): Promise<string> {
    console.log(chalk.bold('\nStep 2: Organization Domain'));
    console.log(chalk.dim('This is used for mobile app identifiers (bundle ID, package name).'));
    console.log(chalk.dim('Use reverse domain notation like: com.company, io.myorg\n'));

    const { orgDomain } = await inquirer.prompt([
      {
        type: 'input',
        name: 'orgDomain',
        message: 'Organization domain:',
        default: 'com.example',
        validate: (input: string) => {
          const result = validateOrgDomain(input);
          if (!result.valid) {
            return formatValidationError(result);
          }
          return true;
        },
      },
    ]);

    return orgDomain;
  },

  validate(value: string) {
    return validateOrgDomain(value);
  },
};
