import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { GenerateProjectOptions } from '../types';
import { validateProjectName, installDependencies, getTemplateData, updateWorkspacePackageJson, initializeReactNativeProject, overlayIdealystFiles, configureAndroidVectorIcons, resolveProjectPath, copyTrpcFiles, copyTrpcAppComponent, removeTrpcDependencies } from './utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateNativeProject(options: GenerateProjectOptions): Promise<void> {
  const { name, directory, skipInstall, appName, withTrpc } = options;
  
  if (!validateProjectName(name)) {
    throw new Error(`Invalid project name: ${name}`);
  }
  
  const displayName = appName || name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
  
  console.log(chalk.blue(`📱 Creating React Native project: ${name}`));
  console.log(chalk.gray(`   App display name: ${displayName}`));
  
  const { projectPath, workspacePath, workspaceScope } = await resolveProjectPath(name, directory);
  const templatePath = path.join(__dirname, '..', 'templates', 'native');
  
  const templateData = getTemplateData(name, `React Native app built with Idealyst Framework`, displayName, workspaceScope || undefined);
  
  try {
    // Step 1: Update workspace configuration FIRST (before React Native CLI)
    await updateWorkspacePackageJson(workspacePath, directory);
    
    // Step 2: Initialize React Native project using CLI with --skip-install
    // Note: For React Native CLI, we need to run it in the parent directory and specify the project name
    const projectDir = path.dirname(projectPath);
    const projectName = path.basename(projectPath);
    await initializeReactNativeProject(projectName, projectDir, displayName, true);
    
    // Step 3: Overlay Idealyst-specific files
    await overlayIdealystFiles(templatePath, projectPath, templateData);
    
    // Step 4: Handle tRPC setup
    if (withTrpc) {
      await copyTrpcFiles(templatePath, projectPath, templateData);
      await copyTrpcAppComponent(templatePath, projectPath, templateData);
    }
    
    // Step 5: Configure Android vector icons
    await configureAndroidVectorIcons(projectPath);
    
    // Step 6: Remove tRPC dependencies if not requested (after merge but before install)
    if (!withTrpc) {
      await removeTrpcDependencies(projectPath);
    }
    
    // Step 7: Install dependencies (including Idealyst packages) after workspace config is updated
    await installDependencies(projectPath, skipInstall);
    
    console.log(chalk.green('✅ React Native project created successfully!'));
    console.log(chalk.blue('📋 Project includes:'));
    console.log(chalk.white('  • React Native with proper Android/iOS setup'));
    console.log(chalk.white('  • Idealyst Components'));
    console.log(chalk.white('  • Idealyst Navigation'));
    console.log(chalk.white('  • Idealyst Theme'));
    console.log(chalk.white('  • React Native Vector Icons (configured)'));
    console.log(chalk.white('  • TypeScript configuration'));
    console.log(chalk.white('  • Metro configuration'));
    console.log(chalk.white('  • Babel configuration'));
    console.log(chalk.white('  • Native platform directories (android/, ios/)'));
    if (withTrpc) {
      console.log(chalk.white('  • tRPC client setup and utilities'));
      console.log(chalk.white('  • React Query integration'));
      console.log(chalk.white('  • Pre-configured tRPC provider'));
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Error creating React Native project:'));
    console.error(error);
    throw error;
  }
} 