import path from 'path';
import chalk from 'chalk';
import { GenerateProjectOptions } from '../types';
import { validateProjectName, copyTemplate, installDependencies, getTemplateData } from './utils';

export async function generateWorkspace(options: GenerateProjectOptions): Promise<void> {
  const { name, directory, skipInstall } = options;
  
  if (!validateProjectName(name)) {
    throw new Error(`Invalid project name: ${name}`);
  }
  
  console.log(chalk.blue(`🏗️ Creating Idealyst workspace: ${name}`));
  
  const projectPath = path.join(directory, name);
  const templatePath = path.join(__dirname, '..', 'templates', 'workspace');
  
  const templateData = getTemplateData(name, `Idealyst Framework monorepo workspace`);
  
  await copyTemplate(templatePath, projectPath, templateData);
  await installDependencies(projectPath, skipInstall);
  
  console.log(chalk.green('✅ Workspace created successfully!'));
  console.log(chalk.blue('📋 Workspace includes:'));
  console.log(chalk.white('  • Yarn workspace configuration'));
  console.log(chalk.white('  • Idealyst packages (theme, components, navigation)'));
  console.log(chalk.white('  • TypeScript configuration'));
  console.log(chalk.white('  • Build scripts'));
  console.log(chalk.white('  • Version management scripts'));
} 