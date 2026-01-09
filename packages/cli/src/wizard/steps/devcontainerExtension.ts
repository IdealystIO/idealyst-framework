/**
 * Wizard step for devcontainer extension
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { WizardStep, ProjectConfig, DevcontainerConfig, AVAILABLE_MCP_SERVERS } from '../../types';

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
            name: 'Claude Code - AI assistant with MCP servers',
            value: 'claudeCode',
            checked: false,
          },
        ],
      },
    ]);

    const hasPostgres = services.includes('postgres');
    const hasClaudeCode = services.includes('claudeCode');

    let mcpServers: string[] = [];
    let needsChrome = false;

    // If Claude Code is selected, prompt for MCP server selection
    if (hasClaudeCode) {
      console.log('');
      console.log(chalk.gray('Select which MCP servers to configure for Claude Code:'));
      console.log('');

      // Build choices - Idealyst auto-selected, Playwright shows Chrome will be added, Postgres MCP disabled without Postgres
      const mcpChoices = AVAILABLE_MCP_SERVERS.map((server) => {
        // Postgres MCP requires PostgreSQL service
        if (server.requiresPostgres && !hasPostgres) {
          return {
            name: `${server.name} - ${server.description} ${chalk.yellow('(requires PostgreSQL)')}`,
            value: server.id,
            checked: false,
            disabled: 'Requires PostgreSQL service',
          };
        }

        // Playwright will auto-add Chrome
        if (server.requiresChrome) {
          return {
            name: `${server.name} - ${server.description} ${chalk.cyan('(will add Chrome service)')}`,
            value: server.id,
            checked: false,
            disabled: false,
          };
        }

        // Idealyst is auto-selected by default
        const isAutoSelected = server.id === 'idealyst';

        return {
          name: `${server.name} - ${server.description}`,
          value: server.id,
          checked: isAutoSelected,
          disabled: false,
        };
      });

      const { selectedMcpServers } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selectedMcpServers',
          message: 'MCP servers:',
          choices: mcpChoices,
        },
      ]);

      mcpServers = selectedMcpServers;

      // Check if any selected MCP server requires Chrome
      needsChrome = mcpServers.some((serverId) => {
        const server = AVAILABLE_MCP_SERVERS.find((s) => s.id === serverId);
        return server?.requiresChrome ?? false;
      });

      if (needsChrome) {
        console.log(chalk.cyan('  ℹ Chrome service will be added for Playwright MCP'));
      }
    }

    return {
      enabled: true,
      postgres: hasPostgres,
      redis: services.includes('redis'),
      chrome: needsChrome,
      claudeCode: hasClaudeCode,
      mcpServers,
    };
  },

  validate(value: DevcontainerConfig | false) {
    return { valid: true };
  },
};
