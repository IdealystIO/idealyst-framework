import path from 'path';
import * as fs from 'fs-extra';
import chalk from 'chalk';
import { GenerateProjectOptions } from '../types';
import { validateProjectName, copyTemplate, installDependencies, getTemplateData } from './utils';

export async function generateWorkspace(options: GenerateProjectOptions): Promise<void> {
  const { name, directory, skipInstall, figmaToken } = options;
  
  if (!validateProjectName(name)) {
    throw new Error(`Invalid project name: ${name}`);
  }
  
  console.log(chalk.blue(`🏗️ Creating Idealyst workspace: ${name}`));
  
  const projectPath = path.join(directory, name);
  const templatePath = path.join(__dirname, '..', 'templates', 'workspace');
  
  const templateData = getTemplateData(name, `Idealyst Framework monorepo workspace`);
  
  await copyTemplate(templatePath, projectPath, templateData);
  
  // Make figma-mcp.sh executable
  const figmaMcpScript = path.join(projectPath, '.devcontainer', 'figma-mcp.sh');
  if (await fs.pathExists(figmaMcpScript)) {
    await fs.chmod(figmaMcpScript, '755');
  }
  
  // Always create .devcontainer/.env file (even if no token provided)
  const devcontainerDir = path.join(projectPath, '.devcontainer');
  await fs.ensureDir(devcontainerDir);
  
  const envPath = path.join(devcontainerDir, '.env');
  const envContent = figmaToken 
    ? `# Figma Integration\nFIGMA_ACCESS_TOKEN=${figmaToken.trim()}\n`
    : `# Figma Integration\nFIGMA_ACCESS_TOKEN=\n`;
  
  await fs.writeFile(envPath, envContent);
  
  await installDependencies(projectPath, skipInstall);
  
  console.log(chalk.green('✅ Workspace created successfully!'));
  console.log(chalk.blue('📋 Workspace includes:'));
  console.log(chalk.white('  • Yarn workspace configuration'));
  console.log(chalk.white('  • Idealyst packages (theme, components, navigation)'));
  console.log(chalk.white('  • TypeScript configuration'));
  console.log(chalk.white('  • Build scripts'));
  console.log(chalk.white('  • Version management scripts'));
  
  if (figmaToken) {
    console.log(chalk.green('🎨 Figma MCP server configured and ready!'));
    console.log(chalk.blue('   Server will be available at http://localhost:3333'));
  } else {
    console.log(chalk.yellow('💡 Tip: Add Figma integration later by editing .devcontainer/.env'));
  }
} 