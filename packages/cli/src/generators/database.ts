import path from 'path';
import chalk from 'chalk';
import { GenerateProjectOptions } from '../types';
import { validateProjectName, copyTemplate, installDependencies, getTemplateData, updateWorkspacePackageJson, resolveProjectPath, getTemplatePath } from './utils';

export async function generateDatabaseProject(options: GenerateProjectOptions): Promise<void> {
  const { name, directory, skipInstall } = options;
  
  if (!validateProjectName(name)) {
    throw new Error(`Invalid project name: ${name}`);
  }
  
  console.log(chalk.blue(`🗄️ Creating Database project: ${name}`));
  
  const { projectPath, workspacePath, workspaceScope } = await resolveProjectPath(name, directory);
  const templatePath = getTemplatePath('database');
  
  const templateData = getTemplateData(name, `Database models and client library with Prisma`, undefined, workspaceScope || undefined);
  
  await copyTemplate(templatePath, projectPath, templateData);
  await installDependencies(projectPath, skipInstall);
  await updateWorkspacePackageJson(workspacePath, directory);
  
  console.log(chalk.green('✅ Database project created successfully!'));
  console.log(chalk.blue('📋 Project includes:'));
  console.log(chalk.white('  • Prisma for database management'));
  console.log(chalk.white('  • TypeScript configuration'));
  console.log(chalk.white('  • Database migration scripts'));
  console.log(chalk.white('  • Exportable client and models'));
  console.log(chalk.white('  • Zod schemas for validation'));
  console.log(chalk.white('  • Clean template ready for your models'));
  console.log(chalk.white('  • Shared database types for client consumption'));
}
