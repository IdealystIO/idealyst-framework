/**
 * Info command - display CLI information
 */

import chalk from 'chalk';
import { VERSION } from '../constants';

export interface InfoOptions {
  format?: 'text' | 'json' | 'markdown' | 'llm';
}

/**
 * Handle the `idealyst-beta info` command
 */
export async function infoCommand(options: InfoOptions = {}): Promise<void> {
  const format = options.format || 'text';

  switch (format) {
    case 'json':
      printJsonInfo();
      break;
    case 'markdown':
      printMarkdownInfo();
      break;
    case 'llm':
      printLlmInfo();
      break;
    default:
      printTextInfo();
  }
}

/**
 * Print text format info
 */
function printTextInfo(): void {
  console.log(chalk.blue.bold('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.blue.bold('  Idealyst CLI (Beta)'));
  console.log(chalk.blue.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  console.log(chalk.cyan('  Version:'), VERSION);
  console.log('');

  console.log(chalk.cyan('  Commands:'));
  console.log('');
  console.log(chalk.white('    idealyst-beta init [project-name]'));
  console.log(chalk.dim('      Initialize a new Idealyst workspace'));
  console.log('');
  console.log(chalk.white('    idealyst-beta add <name> --type <type>'));
  console.log(chalk.dim('      Add a project to existing workspace'));
  console.log(chalk.dim('      Types: web, mobile, api, shared'));
  console.log('');
  console.log(chalk.white('    idealyst-beta info'));
  console.log(chalk.dim('      Display this help information'));
  console.log('');

  console.log(chalk.cyan('  Options (init):'));
  console.log(chalk.dim('    --org-domain <domain>   Organization domain (e.g., com.company)'));
  console.log(chalk.dim('    --app-name <name>       Mobile app display name'));
  console.log(chalk.dim('    --with-api              Enable API server'));
  console.log(chalk.dim('    --with-prisma           Enable Prisma database'));
  console.log(chalk.dim('    --with-trpc             Enable tRPC (requires --with-api)'));
  console.log(chalk.dim('    --with-graphql          Enable GraphQL (requires --with-api)'));
  console.log(chalk.dim('    --no-interactive        Disable interactive wizard'));
  console.log(chalk.dim('    --skip-install          Skip dependency installation'));
  console.log('');

  console.log(chalk.cyan('  Examples:'));
  console.log('');
  console.log(chalk.dim('    # Interactive wizard'));
  console.log(chalk.white('    idealyst-beta init my-app'));
  console.log('');
  console.log(chalk.dim('    # Non-interactive with all options'));
  console.log(chalk.white('    idealyst-beta init my-app --no-interactive \\'));
  console.log(chalk.white('      --org-domain com.company \\'));
  console.log(chalk.white('      --app-name "My App" \\'));
  console.log(chalk.white('      --with-api --with-trpc --with-prisma'));
  console.log('');
  console.log(chalk.dim('    # Add a new web app to workspace'));
  console.log(chalk.white('    idealyst-beta add admin --type web'));
  console.log('');
}

/**
 * Print JSON format info
 */
function printJsonInfo(): void {
  const info = {
    name: '@idealyst/cli-beta',
    version: VERSION,
    commands: {
      init: {
        description: 'Initialize a new Idealyst workspace',
        usage: 'idealyst-beta init [project-name]',
        options: [
          { flag: '--org-domain', description: 'Organization domain' },
          { flag: '--app-name', description: 'Mobile app display name' },
          { flag: '--with-api', description: 'Enable API server' },
          { flag: '--with-prisma', description: 'Enable Prisma database' },
          { flag: '--with-trpc', description: 'Enable tRPC' },
          { flag: '--with-graphql', description: 'Enable GraphQL' },
          { flag: '--no-interactive', description: 'Disable wizard' },
          { flag: '--skip-install', description: 'Skip installation' },
        ],
      },
      add: {
        description: 'Add a project to existing workspace',
        usage: 'idealyst-beta add <name> --type <type>',
        types: ['web', 'mobile', 'api', 'shared'],
      },
    },
  };

  console.log(JSON.stringify(info, null, 2));
}

/**
 * Print markdown format info
 */
function printMarkdownInfo(): void {
  console.log(`# Idealyst CLI (Beta)

Version: ${VERSION}

## Commands

### \`idealyst-beta init [project-name]\`

Initialize a new Idealyst workspace.

**Options:**
- \`--org-domain <domain>\` - Organization domain (e.g., com.company)
- \`--app-name <name>\` - Mobile app display name
- \`--with-api\` - Enable API server
- \`--with-prisma\` - Enable Prisma database
- \`--with-trpc\` - Enable tRPC (requires --with-api)
- \`--with-graphql\` - Enable GraphQL (requires --with-api)
- \`--no-interactive\` - Disable interactive wizard
- \`--skip-install\` - Skip dependency installation

### \`idealyst-beta add <name> --type <type>\`

Add a project to an existing workspace.

**Types:** web, mobile, api, shared

## Examples

\`\`\`bash
# Interactive wizard
idealyst-beta init my-app

# Non-interactive
idealyst-beta init my-app --no-interactive \\
  --org-domain com.company \\
  --app-name "My App" \\
  --with-api --with-trpc

# Add project to workspace
idealyst-beta add admin --type web
\`\`\`
`);
}

/**
 * Print LLM-friendly info
 */
function printLlmInfo(): void {
  console.log(`IDEALYST CLI BETA - SAFE COMMANDS FOR LLM USAGE

IMPORTANT: Always use --no-interactive flag to avoid hanging on prompts.

SAFE COMMANDS (non-interactive):

1. Initialize workspace with all options:
   idealyst-beta init <name> --no-interactive --org-domain <domain> --app-name "<name>"

2. Initialize with extensions:
   idealyst-beta init <name> --no-interactive --org-domain <domain> --app-name "<name>" --with-api --with-trpc --with-prisma

3. Add project to workspace:
   idealyst-beta add <name> --type web
   idealyst-beta add <name> --type mobile --app-name "<name>"
   idealyst-beta add <name> --type api
   idealyst-beta add <name> --type shared

REQUIRED ARGUMENTS (non-interactive):
- project-name: Positional argument, kebab-case
- --org-domain: Reverse domain notation (com.company)
- --app-name: Human-readable app name

OPTIONAL ARGUMENTS:
- --with-api: Enable API server
- --with-prisma: Enable database
- --with-trpc: Enable tRPC (requires --with-api)
- --with-graphql: Enable GraphQL (requires --with-api)
- --skip-install: Skip yarn install

EXAMPLE:
idealyst-beta init my-app --no-interactive --org-domain com.mycompany --app-name "My App" --with-api --with-trpc --with-prisma --skip-install
`);
}
