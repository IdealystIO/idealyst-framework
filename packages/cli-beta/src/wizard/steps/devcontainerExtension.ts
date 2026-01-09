/**
 * Wizard step for devcontainer extension
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { WizardStep, ProjectConfig, DevcontainerConfig } from '../../types';

export const devcontainerExtensionStep: WizardStep<DevcontainerConfig | false> = {
  id: 'devcontainer',

  async prompt(_currentConfig: Partial<ProjectConfig>): Promise<DevcontainerConfig | false> {
    console.log('');
    console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.blue.bold('  Development Container Setup'));
    console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log('');
    console.log(chalk.gray('A devcontainer provides a consistent development environment'));
    console.log(chalk.gray('using Docker with VS Code integration.'));
    console.log('');

    const { enableDevcontainer } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'enableDevcontainer',
        message: 'Enable devcontainer setup?',
        default: false,
      },
    ]);

    if (!enableDevcontainer) {
      return false;
    }

    console.log('');
    console.log(chalk.gray('Select which optional services to include:'));
    console.log('');

    const { services } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'services',
        message: 'Optional services:',
        choices: [
          {
            name: 'PostgreSQL - Database server',
            value: 'postgres',
            checked: false,
          },
          {
            name: 'Redis - Cache and session store',
            value: 'redis',
            checked: false,
          },
          {
            name: 'Chrome - Headless browser for Playwright testing',
            value: 'chrome',
            checked: false,
          },
          {
            name: 'Claude Code - AI assistant with MCP servers',
            value: 'claudeCode',
            checked: false,
          },
        ],
      },
    ]);

    return {
      enabled: true,
      postgres: services.includes('postgres'),
      redis: services.includes('redis'),
      chrome: services.includes('chrome'),
      claudeCode: services.includes('claudeCode'),
    };
  },

  validate(value: DevcontainerConfig | false) {
    return { valid: true };
  },
};
