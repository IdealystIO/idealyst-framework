import fs from 'fs-extra';
import path from 'path';
import { spawn } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';
import validatePackageName from 'validate-npm-package-name';
import inquirer from 'inquirer';
import { TemplateData } from '../types';

export function validateProjectName(name: string): boolean {
  const validation = validatePackageName(name);
  return validation.validForNewPackages;
}

export function createPackageName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

export async function updateWorkspacePackageJson(projectName: string, directory: string): Promise<void> {
  // Look for package.json in the directory to see if we're in a workspace
  const packageJsonPath = path.join(directory, 'package.json');
  
  if (await fs.pathExists(packageJsonPath)) {
    try {
      const packageJson = await fs.readJSON(packageJsonPath);
      
      // Check if this is a workspace (has workspaces property)
      if (packageJson.workspaces && Array.isArray(packageJson.workspaces)) {
        // Add the new project to workspaces if not already present
        if (!packageJson.workspaces.includes(projectName)) {
          packageJson.workspaces.push(projectName);
          await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
          console.log(chalk.green(`✅ Added ${projectName} to workspace configuration`));
        }
      }
    } catch (error) {
      // Silently ignore if we can't read/write package.json
      console.log(chalk.yellow(`⚠️  Could not update workspace configuration: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }
}

export async function copyTemplate(templatePath: string, destPath: string, data: TemplateData): Promise<void> {
  const spinner = ora(`Copying template files...`).start();
  
  try {
    await fs.ensureDir(destPath);
    await fs.copy(templatePath, destPath, {
      filter: (src) => {
        const relativePath = path.relative(templatePath, src);
        return !relativePath.includes('node_modules') && !relativePath.includes('.git');
      }
    });
    
    // Process template files
    await processTemplateFiles(destPath, data);
    
    spinner.succeed('Template files copied successfully');
  } catch (error) {
    spinner.fail('Failed to copy template files');
    throw error;
  }
}

export async function processTemplateFiles(dir: string, data: TemplateData): Promise<void> {
  const files = await fs.readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    
    if (stat.isDirectory()) {
      await processTemplateFiles(filePath, data);
    } else if (file.endsWith('.json') || file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.md')) {
      await processTemplateFile(filePath, data);
    }
  }
}

export async function processTemplateFile(filePath: string, data: TemplateData): Promise<void> {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    
    // Replace template variables
    content = content.replace(/\{\{projectName\}\}/g, data.projectName);
    content = content.replace(/\{\{packageName\}\}/g, data.packageName);
    content = content.replace(/\{\{version\}\}/g, data.version);
    content = content.replace(/\{\{description\}\}/g, data.description);
    
    await fs.writeFile(filePath, content);
  } catch (error) {
    // Skip files that can't be processed
    console.warn(chalk.yellow(`Warning: Could not process template file ${filePath}`));
  }
}

export async function installDependencies(projectPath: string, skipInstall: boolean = false): Promise<void> {
  if (skipInstall) {
    console.log(chalk.yellow('Skipping dependency installation'));
    return;
  }
  
  const spinner = ora('Installing dependencies...').start();
  
  try {
    await runCommand('yarn', ['install'], { cwd: projectPath });
    spinner.succeed('Dependencies installed successfully');
  } catch (error) {
    spinner.fail('Failed to install dependencies with yarn');
    console.log(chalk.yellow('You can install dependencies manually by running:'));
    console.log(chalk.white('  cd ' + path.basename(projectPath)));
    console.log(chalk.white('  yarn install'));
    console.log(chalk.white('  # or alternatively:'));
    console.log(chalk.white('  npm install'));
  }
}

export function runCommand(command: string, args: string[], options: { cwd: string }): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      cwd: options.cwd,
      stdio: 'inherit',
      shell: true
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    process.on('error', (error) => {
      reject(error);
    });
  });
}

export function getTemplateData(projectName: string, description?: string, appName?: string): TemplateData {
  return {
    projectName,
    packageName: createPackageName(projectName),
    version: '1.0.0',
    description: description || `A new Idealyst project: ${projectName}`,
    appName
  };
}

export async function initializeReactNativeProject(projectName: string, directory: string, displayName?: string, skipInstall?: boolean): Promise<void> {
  const spinner = ora('Initializing React Native project...').start();
  
  try {
    // Use the correct React Native CLI command format with specific version and yarn
    const cliCommand = 'npx';
    const args = ['@react-native-community/cli@latest', 'init', projectName, '--version', '0.80.1', '--pm', 'yarn', '--skip-git-init'];
    
    // Add title if displayName is provided
    if (displayName) {
      args.push('--title', displayName);
    }
    
    // Skip install if requested (we'll handle it separately for workspace integration)
    if (skipInstall) {
      args.push('--skip-install');
    }
    
    // Run React Native initialization in the target directory
    await runCommand(cliCommand, args, { cwd: directory });
    
    spinner.succeed('React Native project initialized successfully');
  } catch (error) {
    spinner.fail('Failed to initialize React Native project');
    console.log(chalk.yellow('Make sure you have the React Native CLI and yarn available:'));
    console.log(chalk.white('  npx @react-native-community/cli@latest init ProjectName --version 0.80.1 --pm yarn --skip-git-init'));
    console.log(chalk.yellow('If you encounter issues, try:'));
    console.log(chalk.white('  npm install -g @react-native-community/cli'));
    console.log(chalk.white('  npm install -g yarn'));
    console.log(chalk.white('  # or'));
    console.log(chalk.white('  yarn global add @react-native-community/cli'));
    throw error;
  }
}

export async function overlayIdealystFiles(templatePath: string, projectPath: string, data: TemplateData): Promise<void> {
  const spinner = ora('Applying Idealyst Framework files...').start();
  
  try {
    // Copy Idealyst-specific files over the React Native project
    await fs.copy(templatePath, projectPath, {
      overwrite: true,
      filter: (src) => {
        const relativePath = path.relative(templatePath, src);
        // Skip package.json as we'll merge it separately
        return !relativePath.includes('node_modules') && 
               !relativePath.includes('.git') && 
               !relativePath.endsWith('package.json');
      }
    });
    
    // Process template files
    await processTemplateFiles(projectPath, data);
    
    // Merge package.json dependencies
    await mergePackageJsonDependencies(templatePath, projectPath);
    
    spinner.succeed('Idealyst Framework files applied successfully');
  } catch (error) {
    spinner.fail('Failed to apply Idealyst Framework files');
    throw error;
  }
}

export async function mergePackageJsonDependencies(templatePath: string, projectPath: string): Promise<void> {
  const templatePackageJsonPath = path.join(templatePath, 'package.json');
  const projectPackageJsonPath = path.join(projectPath, 'package.json');
  
  try {
    // Read both package.json files
    const templatePackageJson = await fs.readJSON(templatePackageJsonPath);
    const projectPackageJson = await fs.readJSON(projectPackageJsonPath);
    
    // Merge dependencies
    const idealystDependencies = {
      '@idealyst/components': '^1.0.3',
      '@idealyst/navigation': '^1.0.3',
      '@idealyst/theme': '^1.0.3',
      '@react-native-vector-icons/common': '^12.0.1',
      '@react-native-vector-icons/material-design-icons': '^12.0.1',
      '@react-navigation/bottom-tabs': '^7.4.2',
      '@react-navigation/drawer': '^7.5.3',
      '@react-navigation/native': '^7.1.14',
      '@react-navigation/native-stack': '^7.3.21',
      'react-native-edge-to-edge': '^1.6.2',
      'react-native-gesture-handler': '^2.27.1',
      'react-native-nitro-modules': '^0.26.3',
      'react-native-reanimated': '^3.18.0',
      'react-native-safe-area-context': '^5.5.1',
      'react-native-screens': '^4.11.1',
      'react-native-unistyles': '^3.0.4',
      'react-native-vector-icons': '^10.2.0'
    };
    
    // Merge the dependencies
    projectPackageJson.dependencies = {
      ...projectPackageJson.dependencies,
      ...idealystDependencies
    };
    
    // Write back the merged package.json
    await fs.writeJSON(projectPackageJsonPath, projectPackageJson, { spaces: 2 });
    
    console.log(chalk.green('✅ Merged Idealyst dependencies into package.json'));
  } catch (error) {
    console.warn(chalk.yellow('⚠️  Could not merge package.json dependencies'));
    throw error;
  }
}

export async function promptForProjectName(): Promise<string> {
  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Project name is required';
        }
        const lowerName = input.toLowerCase();
        if (!validateProjectName(lowerName)) {
          return 'Project name must be a valid npm package name (lowercase, no spaces)';
        }
        return true;
      },
      filter: (input: string) => input.toLowerCase().trim()
    }
  ]);
  return projectName;
}

export async function promptForProjectType(): Promise<string> {
  const { projectType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'projectType',
      message: 'What type of project would you like to create?',
      choices: [
        { name: 'React Native App', value: 'native' },
        { name: 'React Web App', value: 'web' },
        { name: 'Shared Library', value: 'shared' }
      ],
      default: 'native'
    }
  ]);
  return projectType;
}

export async function promptForAppName(projectName: string): Promise<string> {
  const { appName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'appName',
      message: 'What is the display name for your app? (used for native app titles)',
      default: projectName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' '),
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'App name is required';
        }
        return true;
      },
      filter: (input: string) => input.trim()
    }
  ]);
  return appName;
} 

export async function configureAndroidVectorIcons(projectPath: string): Promise<void> {
  const buildGradlePath = path.join(projectPath, 'android', 'app', 'build.gradle');
  
  try {
    if (await fs.pathExists(buildGradlePath)) {
      let content = await fs.readFile(buildGradlePath, 'utf8');
      
      // Check if the vector icons line is already present
      if (content.includes('react-native-vector-icons/fonts.gradle')) {
        console.log(chalk.yellow('Vector icons configuration already exists in build.gradle'));
        return;
      }
      
      // Find the line with jscFlavor definition and add the vector icons line after it
      const jscFlavorRegex = /def jscFlavor = ['"][^'"]*['"]/;
      const match = content.match(jscFlavorRegex);
      
      if (match) {
        const insertionPoint = content.indexOf(match[0]) + match[0].length;
        const beforeInsertion = content.substring(0, insertionPoint);
        const afterInsertion = content.substring(insertionPoint);
        
        const vectorIconsLine = '\napply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")';
        content = beforeInsertion + vectorIconsLine + afterInsertion;
        
        await fs.writeFile(buildGradlePath, content);
        console.log(chalk.green('✅ Added react-native-vector-icons configuration to Android build.gradle'));
      } else {
        console.log(chalk.yellow('⚠️  Could not find jscFlavor line in build.gradle, vector icons configuration not added'));
      }
    } else {
      console.log(chalk.yellow('⚠️  Android build.gradle not found, skipping vector icons configuration'));
    }
  } catch (error) {
    console.log(chalk.yellow(`⚠️  Could not configure vector icons in build.gradle: ${error instanceof Error ? error.message : 'Unknown error'}`));
  }
} 