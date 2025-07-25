import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { GenerateProjectOptions } from '../types';
import { validateProjectName, copyTemplate, installDependencies, getTemplateData, updateWorkspacePackageJson, resolveProjectPath } from './utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateApiProject(options: GenerateProjectOptions): Promise<void> {
  const { name, directory, skipInstall } = options;
  
  if (!validateProjectName(name)) {
    throw new Error(`Invalid project name: ${name}`);
  }
  
  console.log(chalk.blue(`🚀 Creating API project: ${name}`));
  
  const { projectPath, workspacePath, workspaceScope } = await resolveProjectPath(name, directory);
  const templatePath = path.join(__dirname, '..', 'templates', 'api');
  
  const templateData = getTemplateData(name, `Clean API server template with tRPC, Prisma, and Zod`, undefined, workspaceScope || undefined);
  
  await copyTemplate(templatePath, projectPath, templateData);
  await installDependencies(projectPath, skipInstall);
  await updateWorkspacePackageJson(workspacePath, directory);
  
  console.log(chalk.green('✅ API project created successfully!'));
  console.log(chalk.blue('📋 Project includes:'));
  console.log(chalk.white('  • tRPC for type-safe APIs'));
  console.log(chalk.white('  • Prisma for database management'));
  console.log(chalk.white('  • Zod for schema validation'));
  console.log(chalk.white('  • Express.js server'));
  console.log(chalk.white('  • TypeScript configuration'));
  console.log(chalk.white('  • CORS and middleware setup'));
  console.log(chalk.white('  • Database migration scripts'));
  console.log(chalk.white('  • Clean template ready for your models'));
} 