import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { GenerateProjectOptions } from '../types';
import { validateProjectName, copyTemplate, installDependencies, getTemplateData, updateWorkspacePackageJson, resolveProjectPath, copyTrpcFiles, copyTrpcAppComponent, removeTrpcDependencies } from './utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateWebProject(options: GenerateProjectOptions): Promise<void> {
  const { name, directory, skipInstall, withTrpc } = options;
  
  if (!validateProjectName(name)) {
    throw new Error(`Invalid project name: ${name}`);
  }
  
  console.log(chalk.blue(`🌐 Creating React Web project: ${name}`));
  
  const { projectPath, workspacePath, workspaceScope } = await resolveProjectPath(name, directory);
  const templatePath = path.join(__dirname, '..', 'templates', 'web');
  
  const templateData = getTemplateData(name, `React web app built with Idealyst Framework`, undefined, workspaceScope || undefined);
  
  await copyTemplate(templatePath, projectPath, templateData);
  
  // Handle tRPC setup
  if (withTrpc) {
    await copyTrpcFiles(templatePath, projectPath, templateData);
    await copyTrpcAppComponent(templatePath, projectPath, templateData);
  } else {
    // Remove tRPC dependencies if not requested
    await removeTrpcDependencies(projectPath);
  }
  
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
  if (withTrpc) {
    console.log(chalk.white('  • tRPC client setup and utilities'));
    console.log(chalk.white('  • React Query integration'));
    console.log(chalk.white('  • Pre-configured tRPC provider'));
  }
} 