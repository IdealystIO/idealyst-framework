import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { GenerateProjectOptions } from '../types';
import { validateProjectName, copyTemplate, installDependencies, getTemplateData, updateWorkspacePackageJson, resolveProjectPath } from './utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateWebProject(options: GenerateProjectOptions): Promise<void> {
  const { name, directory, skipInstall } = options;
  
  if (!validateProjectName(name)) {
    throw new Error(`Invalid project name: ${name}`);
  }
  
  console.log(chalk.blue(`🌐 Creating React Web project: ${name}`));
  
  const { projectPath, workspacePath } = await resolveProjectPath(name, directory);
  const templatePath = path.join(__dirname, '..', 'templates', 'web');
  
  const templateData = getTemplateData(name, `React web app built with Idealyst Framework`);
  
  await copyTemplate(templatePath, projectPath, templateData);
  await installDependencies(projectPath, skipInstall);
  await updateWorkspacePackageJson(workspacePath, directory);
  
  console.log(chalk.green('✅ React Web project created successfully!'));
  console.log(chalk.blue('📋 Project includes:'));
  console.log(chalk.white('  • React 19.1'));
  console.log(chalk.white('  • Vite build system'));
  console.log(chalk.white('  • Idealyst Components'));
  console.log(chalk.white('  • Idealyst Navigation'));
  console.log(chalk.white('  • Idealyst Theme'));
  console.log(chalk.white('  • TypeScript configuration'));
  console.log(chalk.white('  • React Router'));
} 