import fs from 'fs-extra';
import path from 'path';
import { spawn } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';
import validatePackageName from 'validate-npm-package-name';
import inquirer from 'inquirer';
import { TemplateData } from '../types';

/**
 * Get the current CLI version from package.json
 */
function getCurrentVersion(): string {
  try {
    const packageJsonPath = path.join(__dirname, '../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version;
  } catch (error) {
    console.warn('Could not read CLI version, using fallback');
    return '1.0.67'; // Fallback version
  }
}

export function validateProjectName(name: string): boolean {
  // Use npm validation as base but add our own restrictions
  const npmValidation = validatePackageName(name);
  if (!npmValidation.validForNewPackages) {
    return false;
  }
  
  // Additional restrictions for our projects:
  // - No underscores (prefer kebab-case)
  // - No starting with numbers
  // - Only lowercase letters, numbers, and hyphens
  const pattern = /^[a-z][a-z0-9-]*$/;
  return pattern.test(name);
}

export function getTemplatePath(templateName: string): string {
  // In tests, use the current directory + templates
  // In production, use the built directory + templates
  const isTest = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;
  
  if (isTest) {
    // During tests, use the templates directory relative to the project root
    return path.join(__dirname, '..', '..', 'templates', templateName);
  } else {
    // In production, use the templates directory relative to the dist folder
    return path.join(__dirname, '..', 'templates', templateName);
  }
}

export function createPackageName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

export async function updateWorkspacePackageJson(workspacePath: string, directory: string): Promise<void> {
  // Look for package.json in the directory to see if we're in a workspace
  const packageJsonPath = path.join(directory, 'package.json');
  
  if (await fs.pathExists(packageJsonPath)) {
    try {
      const packageJson = await fs.readJSON(packageJsonPath);
      
      // Check if this is a workspace (has workspaces property)
      if (packageJson.workspaces && Array.isArray(packageJson.workspaces)) {
        // Check if workspace already covers this path with a wildcard
        const workspaceDir = path.dirname(workspacePath);
        const wildcardPattern = `${workspaceDir}/*`;
                 const isAlreadyCovered = packageJson.workspaces.some((ws: string) => 
           ws === wildcardPattern || ws === workspacePath
         );
        
        // Add the new project to workspaces if not already present or covered
        if (!isAlreadyCovered) {
          packageJson.workspaces.push(workspacePath);
          await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
          console.log(chalk.green(`✅ Added ${workspacePath} to workspace configuration`));
        } else {
          console.log(chalk.blue(`📦 Project ${workspacePath} already covered by existing workspace configuration`));
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
        // Skip special App files that are only used in fullstack generation
        // Skip .git directories but allow .gitignore files
        return !relativePath.includes('node_modules') && 
               !relativePath.includes('.git' + path.sep) &&
               !relativePath.endsWith('App-with-trpc.tsx') &&
               !relativePath.endsWith('App-with-trpc-and-shared.tsx');
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
      // Skip common directories that shouldn't be processed
      if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build' || file === '.cache') {
        continue;
      }
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
    content = content.replace(/\{\{idealystVersion\}\}/g, data.idealystVersion);
    
    // Handle appName (with fallback to projectName if not provided)
    const appName = data.appName || data.projectName;
    content = content.replace(/\{\{appName\}\}/g, appName);
    
    // Handle workspaceScope (with fallback to projectName if not provided)
    const workspaceScope = data.workspaceScope || data.projectName;
    content = content.replace(/\{\{workspaceScope\}\}/g, workspaceScope);
    
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

export function runCommand(command: string, args: string[], options: { cwd: string; timeout?: number }): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutMs = options.timeout || 300000; // 5 minutes default timeout
    
    const process = spawn(command, args, {
      cwd: options.cwd,
      stdio: ['pipe', 'inherit', 'inherit'], // Pipe stdin to prevent hanging on prompts
      shell: true
    });
    
    // Set up timeout
    const timeoutId = setTimeout(() => {
      process.kill('SIGTERM');
      reject(new Error(`Command timed out after ${timeoutMs / 1000} seconds`));
    }, timeoutMs);
    
    // Close stdin immediately to prevent hanging on interactive prompts
    if (process.stdin) {
      process.stdin.end();
    }
    
    process.on('close', (code) => {
      clearTimeout(timeoutId);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    process.on('error', (error) => {
      clearTimeout(timeoutId);
      reject(error);
    });
  });
}

export function getTemplateData(projectName: string, description?: string, appName?: string, workspaceScope?: string): TemplateData {
  let packageName = createPackageName(projectName);
  
  // If we have a workspace scope, prefix the package name with it
  if (workspaceScope) {
    packageName = `@${workspaceScope}/${packageName}`;
  }
  
  const currentVersion = getCurrentVersion();
  
  return {
    projectName,
    packageName,
    version: currentVersion,
    description: description || `A new Idealyst project: ${projectName}`,
    appName,
    workspaceScope,
    idealystVersion: currentVersion
  };
}

/**
 * Detects if we're in a workspace root directory
 */
export async function isWorkspaceRoot(directory: string): Promise<boolean> {
  const packageJsonPath = path.join(directory, 'package.json');
  
  if (await fs.pathExists(packageJsonPath)) {
    try {
      const packageJson = await fs.readJSON(packageJsonPath);
      return !!(packageJson.workspaces && Array.isArray(packageJson.workspaces));
    } catch (error) {
      return false;
    }
  }
  
  return false;
}

/**
 * Gets the workspace scope from the workspace root's package.json
 * Extracts just the scope name (without @) from scoped package names
 */
export async function getWorkspaceName(directory: string): Promise<string | null> {
  const packageJsonPath = path.join(directory, 'package.json');
  
  if (await fs.pathExists(packageJsonPath)) {
    try {
      const packageJson = await fs.readJSON(packageJsonPath);
      const fullName = packageJson.name;
      
      if (!fullName) return null;
      
      // If it's a scoped package like @scope/name, extract just the scope
      if (fullName.startsWith('@')) {
        const scopeMatch = fullName.match(/^@([^/]+)/);
        return scopeMatch ? scopeMatch[1] : null;
      }
      
      // If it's not scoped, return the full name
      return fullName;
    } catch (error) {
      return null;
    }
  }
  
  return null;
}

/**
 * Resolves the correct project path for individual projects (native, web, shared).
 * Individual projects can ONLY be created within an existing workspace.
 * This enforces proper monorepo structure and prevents scattered individual projects.
 */
export async function resolveProjectPath(projectName: string, directory: string): Promise<{ projectPath: string; workspacePath: string; workspaceScope: string | null }> {
  // Check if we're in a workspace directory
  const isWorkspace = await isWorkspaceRoot(directory);
  
  if (!isWorkspace) {
    throw new Error(
      `Individual projects can only be created within a workspace.\n` +
      `Please first create a workspace with: idealyst init my-workspace\n` +
      `Then navigate to the workspace directory and create your project.`
    );
  }
  
  // Get the workspace name to use as scope
  const workspaceScope = await getWorkspaceName(directory);
  
  // Create project in workspace's packages/ folder
  const packagesDir = path.join(directory, 'packages');
  await fs.ensureDir(packagesDir);
  
  return {
    projectPath: path.join(packagesDir, projectName),
    workspacePath: `packages/${projectName}`,
    workspaceScope
  };
}

export async function initializeReactNativeProject(projectName: string, directory: string, displayName?: string, skipInstall?: boolean): Promise<void> {
  const spinner = ora('Initializing React Native project...').start();
  
  try {
    // Try the modern approach first
    const cliCommand = 'npx';
    const args = [
      '@react-native-community/cli@latest', 
      'init', 
      projectName,
      '--pm', 'yarn',
      '--skip-git-init'
    ];
    
    // Add title if displayName is provided
    if (displayName) {
      args.push('--title', displayName);
    }
    
    // Skip install if requested (we'll handle it separately for workspace integration)
    if (skipInstall) {
      args.push('--skip-install');
    }
    
    spinner.text = 'Initializing React Native project (this may take a few minutes)...';
    
    // Run React Native initialization with timeout
    await runCommand(cliCommand, args, { 
      cwd: directory,
      timeout: 600000 // 10 minutes timeout for React Native init
    });
    
    spinner.succeed('React Native project initialized successfully');
  } catch (error) {
    spinner.fail('Failed to initialize React Native project with CLI');
    
    // Try fallback to regular react-native init
    try {
      spinner.start('Trying fallback: react-native@latest init...');
      
      const fallbackArgs = [
        'react-native@latest', 
        'init', 
        projectName,
        '--pm', 'yarn',
        '--skip-git-init'
      ];
      
      if (displayName) {
        fallbackArgs.push('--title', displayName);
      }
      
      if (skipInstall) {
        fallbackArgs.push('--skip-install');
      }
      
      await runCommand('npx', fallbackArgs, { 
        cwd: directory,
        timeout: 600000
      });
      
      spinner.succeed('React Native project initialized with fallback method');
    } catch (fallbackError) {
      spinner.fail('All React Native initialization methods failed');
      
      console.log(chalk.yellow('\n💡 Alternative approaches:'));
      console.log(chalk.white('1. Try manually creating the project:'));
      console.log(chalk.white(`   npx @react-native-community/cli@latest init ${projectName} --pm yarn --skip-git-init`));
      console.log(chalk.white('\n2. Use Expo (recommended for easier setup):'));
      console.log(chalk.white(`   npx create-expo-app@latest ${projectName} --template blank-typescript`));
      console.log(chalk.white('\n3. Ensure prerequisites:'));
      console.log(chalk.white('   npm install -g @react-native-community/cli'));
      
      throw fallbackError;
    }
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
        // Skip App-with-trpc.tsx and App-with-trpc-and-shared.tsx as they're only copied when tRPC is enabled
        return !relativePath.includes('node_modules') && 
               !relativePath.includes('.git') && 
               !relativePath.endsWith('package.json') &&
               !relativePath.endsWith('App-with-trpc.tsx') &&
               !relativePath.endsWith('App-with-trpc-and-shared.tsx');
      }
    });
    
    // Remove the root App.tsx created by React Native CLI since we use src/App.tsx
    const rootAppPath = path.join(projectPath, 'App.tsx');
    if (await fs.pathExists(rootAppPath)) {
      await fs.remove(rootAppPath);
    }
    
    // Process template files
    await processTemplateFiles(projectPath, data);
    
    // Merge package.json dependencies
    await mergePackageJsonDependencies(templatePath, projectPath, data);
    
    spinner.succeed('Idealyst Framework files applied successfully');
  } catch (error) {
    spinner.fail('Failed to apply Idealyst Framework files');
    throw error;
  }
}

export async function mergePackageJsonDependencies(templatePath: string, projectPath: string, data: TemplateData): Promise<void> {
  const templatePackageJsonPath = path.join(templatePath, 'package.json');
  const projectPackageJsonPath = path.join(projectPath, 'package.json');
  
  try {
    // Read both package.json files
    const templatePackageJson = await fs.readJSON(templatePackageJsonPath);
    const projectPackageJson = await fs.readJSON(projectPackageJsonPath);
    
    // Merge dependencies with current version
    const idealystDependencies = {
      [`@idealyst/components`]: `^${data.idealystVersion}`,
      [`@idealyst/navigation`]: `^${data.idealystVersion}`,
      [`@idealyst/theme`]: `^${data.idealystVersion}`,
      '@react-native-vector-icons/common': '^12.0.1',
      '@react-native-vector-icons/material-design-icons': '^12.0.1',
      '@react-navigation/bottom-tabs': '^7.4.2',
      '@react-navigation/drawer': '^7.5.3',
      '@react-navigation/native': '^7.1.14',
      '@react-navigation/native-stack': '^7.3.21',
      '@tanstack/react-query': '^5.83.0',
      '@trpc/client': '^11.5.1',
      '@trpc/react-query': '^11.5.1',
      '@trpc/server': '^11.5.1',
      'react-native-edge-to-edge': '^1.6.2',
      'react-native-gesture-handler': '^2.27.1',
      'react-native-nitro-modules': '^0.30.0',
      'react-native-reanimated': '^3.18.0',
      'react-native-safe-area-context': '^5.5.1',
      'react-native-screens': '^4.11.1',
      'react-native-svg': '^15.8.0',
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
        { name: 'Shared Library', value: 'shared' },
        { name: 'API Server (tRPC + Express)', value: 'api' },
        { name: 'Database (Prisma + Zod)', value: 'database' }
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

export async function promptForTrpcIntegration(): Promise<boolean> {
  const { withTrpc } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'withTrpc',
      message: 'Would you like to include tRPC client setup and boilerplate?',
      default: false
    }
  ]);
  return withTrpc;
}

export async function copyTrpcFiles(templatePath: string, projectPath: string, data: TemplateData): Promise<void> {
  const spinner = ora('Adding tRPC client utilities...').start();
  
  try {
    const trpcUtilsSource = path.join(templatePath, 'src', 'utils', 'trpc.ts');
    const trpcUtilsTarget = path.join(projectPath, 'src', 'utils', 'trpc.ts');
    
    // Ensure utils directory exists
    await fs.ensureDir(path.join(projectPath, 'src', 'utils'));
    
    // Copy and process the tRPC utils file
    await fs.copy(trpcUtilsSource, trpcUtilsTarget);
    await processTemplateFile(trpcUtilsTarget, data);
    
    spinner.succeed('tRPC client utilities added');
  } catch (error) {
    spinner.fail('Failed to add tRPC client utilities');
    console.warn(chalk.yellow('⚠️  tRPC utilities could not be copied, but the project was created successfully'));
  }
}

export async function copyTrpcAppComponent(templatePath: string, projectPath: string, data: TemplateData): Promise<void> {
  const spinner = ora('Setting up tRPC App component...').start();
  
  try {
    // For React Native, do NOT copy App-with-trpc-and-shared.tsx
    const isNativeProject = await fs.pathExists(path.join(projectPath, 'metro.config.js')) || 
                            await fs.pathExists(path.join(projectPath, 'android')) ||
                            await fs.pathExists(path.join(projectPath, 'ios'));
    
    if (isNativeProject) {
      // Use the default App.tsx for native, do not overwrite with shared tRPC App
      spinner.succeed('Skipped tRPC App component for native project');
      return;
    }
    
    // For web, copy App-with-trpc.tsx as App.tsx
    const trpcAppSource = path.join(templatePath, 'src', 'App-with-trpc.tsx');
    const appTarget = path.join(projectPath, 'src', 'App.tsx');
    
    await fs.copy(trpcAppSource, appTarget, { overwrite: true });
    await processTemplateFile(appTarget, data);
    
    spinner.succeed('tRPC App component configured');
  } catch (error) {
    spinner.fail('Failed to configure tRPC App component');
    console.warn(chalk.yellow('⚠️  tRPC App component could not be configured, but the project was created successfully'));
  }
}

export async function addTrpcDependencies(projectPath: string): Promise<void> {
  try {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = await fs.readJSON(packageJsonPath);
    
    // Add tRPC-related dependencies
    const trpcDeps = {
      '@tanstack/react-query': '^5.83.0',
      '@trpc/client': '^11.5.1',
      '@trpc/react-query': '^11.5.1'
    };
    
    // Ensure dependencies object exists
    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }
    
    // Add tRPC dependencies
    Object.assign(packageJson.dependencies, trpcDeps);
    
    await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
  } catch (error) {
    console.warn(chalk.yellow('⚠️  Could not add tRPC dependencies to package.json'));
  }
}

export async function removeTrpcDependencies(projectPath: string): Promise<void> {
  try {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = await fs.readJSON(packageJsonPath);
    
    // Remove tRPC-related dependencies
    const trpcDeps = [
      '@tanstack/react-query',
      '@trpc/client',
      '@trpc/react-query',
      '@trpc/server'
    ];
    
    trpcDeps.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        delete packageJson.dependencies[dep];
      }
    });
    
    await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
  } catch (error) {
    console.warn(chalk.yellow('⚠️  Could not remove tRPC dependencies from package.json'));
  }
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