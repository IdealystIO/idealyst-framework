import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { GenerateProjectOptions } from '../types';
import { validateProjectName, installDependencies, getTemplateData, updateWorkspacePackageJson, initializeReactNativeProject, overlayIdealystFiles, configureAndroidVectorIcons, resolveProjectPath, copyTrpcFiles, copyTrpcAppComponent, addTrpcDependencies, removeTrpcDependencies, copyTemplate, getTemplatePath } from './utils';

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
  const templatePath = getTemplatePath('native');
  
  const templateData = getTemplateData(name, `React Native app built with Idealyst Framework`, displayName, workspaceScope || undefined);
  
  try {
    // Step 1: Update workspace configuration FIRST
    await updateWorkspacePackageJson(workspacePath, directory);
    
    // Step 2: Try React Native CLI initialization, with fallback to template-only
    const useRnCli = process.env.IDEALYST_USE_RN_CLI !== 'false';
    
    if (useRnCli) {
      try {
        console.log(chalk.blue('🚀 Attempting React Native CLI initialization...'));
        console.log(chalk.gray('   (This creates proper Android/iOS native directories)'));
        
        // Initialize React Native project using CLI with --skip-install
        const projectDir = path.dirname(projectPath);
        const projectName = path.basename(projectPath);
        await initializeReactNativeProject(projectName, projectDir, displayName, true);
        
        // Step 3: Overlay Idealyst-specific files
        await overlayIdealystFiles(templatePath, projectPath, templateData);
        
        console.log(chalk.green('✅ React Native project created with native platform support'));
      } catch (rnError) {
        console.log(chalk.yellow('✖ Failed to initialize React Native project'));
        console.log('');
        console.log(chalk.yellow('💡 Alternative approaches:'));
        console.log(chalk.white('1. Try manually creating the project:'));
        console.log(chalk.white(`   npx @react-native-community/cli@latest init ${path.basename(projectPath)} --pm yarn --skip-git-init`));
        console.log('');
        console.log(chalk.white('2. Use Expo (faster alternative):'));
        console.log(chalk.white(`   npx create-expo-app@latest ${path.basename(projectPath)} --template blank-typescript`));
        console.log('');
        console.log(chalk.white('3. Ensure prerequisites:'));
        console.log(chalk.white('   npm install -g @react-native-community/cli'));
        console.log('');
        console.log(chalk.yellow('⚠️  React Native CLI failed, falling back to template-only approach...'));
        await createNativeProjectFromTemplate(templatePath, projectPath, templateData);
        console.log(chalk.yellow('📝 Template-only project created. You may need to run "npx react-native init" later for native platforms.'));
      }
    } else {
      console.log(chalk.blue('��️  Creating project from template only (IDEALYST_USE_RN_CLI=false)'));
      await createNativeProjectFromTemplate(templatePath, projectPath, templateData);
    }
    
    // Step 4: Handle tRPC setup
    if (withTrpc) {
      await copyTrpcFiles(templatePath, projectPath, templateData);
      await copyTrpcAppComponent(templatePath, projectPath, templateData);
      await addTrpcDependencies(projectPath);
    }
    
    // Step 5: Configure Android vector icons (only if we have Android directory)
    const hasAndroid = await fs.pathExists(path.join(projectPath, 'android'));
    if (hasAndroid) {
      await configureAndroidVectorIcons(projectPath);
    }
    
    // Step 6: Remove tRPC dependencies if not requested
    if (!withTrpc) {
      await removeTrpcDependencies(projectPath);
    }
    
    // Step 7: Install dependencies
    await installDependencies(projectPath, skipInstall);
    
    console.log(chalk.green('✅ React Native project created successfully!'));
    console.log(chalk.blue('📋 Project includes:'));
    console.log(chalk.white('  • React Native with TypeScript'));
    console.log(chalk.white('  • Idealyst Components & Navigation'));
    console.log(chalk.white('  • Idealyst Theme & Styling'));
    console.log(chalk.white('  • Jest testing configuration'));
    console.log(chalk.white('  • Metro & Babel configuration'));
    
    if (hasAndroid) {
      console.log(chalk.white('  • Android native platform setup'));
      console.log(chalk.white('  • React Native Vector Icons (configured)'));
    }
    
    const hasIos = await fs.pathExists(path.join(projectPath, 'ios'));
    if (hasIos) {
      console.log(chalk.white('  • iOS native platform setup'));
    }
    
    if (!hasAndroid && !hasIos) {
      console.log(chalk.yellow('  ⚠️  No native platforms detected'));
      console.log(chalk.yellow('     Run "npx react-native init" in project directory for native support'));
    }
    
    if (withTrpc) {
      console.log(chalk.white('  • tRPC client setup and utilities'));
      console.log(chalk.white('  • React Query integration'));
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Error creating React Native project:'));
    console.error(error);
    throw error;
  }
}

// Helper function to create project from template only (fallback when RN CLI fails)
async function createNativeProjectFromTemplate(templatePath: string, projectPath: string, templateData: any): Promise<void> {
  await copyTemplate(templatePath, projectPath, templateData);
}
