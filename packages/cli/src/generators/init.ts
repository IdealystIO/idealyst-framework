import path from 'path';
import * as fs from 'fs-extra';
import chalk from 'chalk';
import { GenerateProjectOptions } from '../types';
import { validateProjectName, installDependencies, getTemplateData, initializeReactNativeProject, overlayIdealystFiles } from './utils';
import { configureReactNativeMonorepo } from '../scripts/configure-react-native-monorepo';

/**
 * Generate a complete full-stack workspace from the unified template
 */
export async function generateFullStackProject(options: GenerateProjectOptions): Promise<void> {
  const { name, directory, skipInstall, figmaToken } = options;

  if (!validateProjectName(name)) {
    throw new Error(`Invalid project name: ${name}`);
  }

  console.log(chalk.blue(`🚀 Creating Full-Stack Idealyst workspace: ${name}`));
  console.log(chalk.gray('   This will generate a complete workspace with all packages integrated'));

  const projectPath = path.join(directory, name);
  const templatePath = path.join(__dirname, '../../template');

  // Check if template exists
  if (!await fs.pathExists(templatePath)) {
    throw new Error(`Template directory not found at ${templatePath}`);
  }

  const templateData = getTemplateData(name, `Full-stack Idealyst Framework workspace`, undefined, name);

  // Copy the entire template
  console.log(chalk.blue('📦 Copying template files...'));
  await copyTemplateWithReplacements(templatePath, projectPath, templateData);

  // Handle devcontainer setup
  const devcontainerDir = path.join(projectPath, '.devcontainer');
  const envPath = path.join(devcontainerDir, '.env');
  const envContent = figmaToken
    ? `# Figma Integration\nFIGMA_ACCESS_TOKEN=${figmaToken.trim()}\n`
    : `# Figma Integration\nFIGMA_ACCESS_TOKEN=\n`;

  await fs.writeFile(envPath, envContent);

  // Make scripts executable
  const scriptsToMakeExecutable = [
    path.join(devcontainerDir, 'figma-mcp.sh'),
    path.join(projectPath, 'setup.sh'),
  ];

  for (const script of scriptsToMakeExecutable) {
    if (await fs.pathExists(script)) {
      await fs.chmod(script, '755');
    }
  }

  // Initialize React Native native folders for mobile package
  console.log(chalk.blue('📱 Setting up React Native mobile package...'));
  await initializeMobilePackage(projectPath, templatePath, templateData, skipInstall);

  // Install dependencies
  await installDependencies(projectPath, skipInstall);

  // Configure React Native for monorepo AFTER dependencies are installed
  // TEMPORARILY DISABLED FOR TESTING
  // if (!skipInstall) {
  //   const mobilePackagePath = path.join(projectPath, 'packages', 'mobile');
  //   if (await fs.pathExists(path.join(mobilePackagePath, 'android')) ||
  //       await fs.pathExists(path.join(mobilePackagePath, 'ios'))) {
  //     await configureReactNativeMonorepo(mobilePackagePath, projectPath);
  //   }
  // }

  console.log(chalk.green('✅ Full-stack workspace created successfully!'));
  console.log(chalk.blue('📋 Your workspace includes:'));
  console.log(chalk.white('  • 🗄️  Database package with Prisma'));
  console.log(chalk.white('  • 🚀 API server with tRPC'));
  console.log(chalk.white('  • 🌐 React web app'));
  console.log(chalk.white('  • 📱 React Native mobile app'));
  console.log(chalk.white('  • 📦 Shared component library'));
  console.log(chalk.white('  • 🔗 All packages pre-integrated'));

  console.log('');
  console.log(chalk.green('🚀 Quick start:'));
  console.log(chalk.white(`  cd ${name}`));
  console.log(chalk.white('  yarn db:generate # Generate Prisma client'));
  console.log(chalk.white('  yarn dev         # Start all development servers'));
  console.log('');
  console.log(chalk.gray('💡 Check README.md for detailed setup instructions'));

  if (figmaToken) {
    console.log(chalk.blue('🎨 Figma integration configured in .devcontainer/.env'));
  } else {
    console.log(chalk.gray('💡 Tip: Add Figma integration later by editing .devcontainer/.env'));
  }
}

/**
 * Copy template directory with template variable replacements
 */
async function copyTemplateWithReplacements(
  srcDir: string,
  destDir: string,
  templateData: any
): Promise<void> {
  await fs.ensureDir(destDir);

  const files = await fs.readdir(srcDir);

  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);

    // Skip excluded files
    if (shouldExcludeFile(file)) {
      continue;
    }

    const stat = await fs.stat(srcPath);

    if (stat.isDirectory()) {
      // Recursively copy directories
      await copyTemplateWithReplacements(srcPath, destPath, templateData);
    } else {
      // Check if file should be processed for template variables
      if (shouldProcessFile(file)) {
        let content = await fs.readFile(srcPath, 'utf8');
        content = replaceTemplateVariables(content, templateData);
        await fs.writeFile(destPath, content);
      } else {
        // Just copy binary files or files that shouldn't be processed
        await fs.copy(srcPath, destPath);
      }
    }
  }
}

/**
 * Determine if a file should be excluded from the generated project
 * These are template-only files that users don't need
 */
function shouldExcludeFile(filename: string): boolean {
  const baseName = path.basename(filename);

  // Exclude template variant files (we already copied the correct one)
  if (baseName.includes('App-with-trpc') && !baseName.includes('App-with-trpc-and-shared')) {
    return true;
  }

  // Exclude App-with-trpc-and-shared ONLY if it's not being used as App.tsx
  // (The overlay process already handles this correctly)
  if (baseName === 'App-with-trpc-and-shared.tsx') {
    return true;
  }

  if (baseName === 'App-with-trpc.tsx') {
    return true;
  }

  // Exclude development artifacts
  if (baseName.endsWith('.bak') || baseName.endsWith('~')) {
    return true;
  }

  // Exclude template-specific documentation
  // (Users get the main README which is customized)
  if (baseName === '.idealystignore' || baseName === '.templateignore') {
    return true;
  }

  return false;
}

/**
 * Determine if a file should be processed for template variables
 */
function shouldProcessFile(filename: string): boolean {
  const textExtensions = [
    '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt',
    '.yml', '.yaml', '.env', '.example', '.gitignore',
    '.dockerignore', '.sh', '.conf', '.sql'
  ];

  const baseName = path.basename(filename);

  // Check if it's a known text file
  if (textExtensions.some(ext => baseName.endsWith(ext))) {
    return true;
  }

  // Check for files without extensions that are typically text
  if (!baseName.includes('.') && ['Dockerfile', 'LICENSE', 'README'].some(name => baseName.includes(name))) {
    return true;
  }

  return false;
}

/**
 * Replace template variables in content
 */
function replaceTemplateVariables(content: string, templateData: any): string {
  let result = content;

  // Replace all template variables
  Object.entries(templateData).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), String(value));
  });

  return result;
}

/**
 * Initialize React Native mobile package with native iOS/Android folders
 */
async function initializeMobilePackage(
  projectPath: string,
  templatePath: string,
  templateData: any,
  skipInstall: boolean
): Promise<void> {
  const mobilePackagePath = path.join(projectPath, 'packages', 'mobile');
  const mobileTemplatePath = path.join(templatePath, 'packages', 'mobile');

  // Check if mobile package exists
  if (!await fs.pathExists(mobilePackagePath)) {
    console.log(chalk.yellow('   ⚠️  Mobile package not found, skipping React Native initialization'));
    return;
  }

  const displayName = templateData.appName || templateData.projectName
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Try to initialize React Native project with native folders
  const useRnCli = process.env.IDEALYST_USE_RN_CLI !== 'false';

  if (useRnCli) {
    try {
      console.log(chalk.gray('   Initializing React Native with native platform support...'));
      console.log(chalk.gray('   (This creates proper Android/iOS directories)'));

      // Back up our Idealyst-specific files
      const backupPath = path.join(projectPath, '.mobile-backup');
      await fs.copy(mobilePackagePath, backupPath);

      // Remove the mobile directory to let RN CLI create it fresh
      await fs.remove(mobilePackagePath);

      // Run React Native init in packages directory
      const packagesDir = path.join(projectPath, 'packages');
      await initializeReactNativeProject('mobile', packagesDir, displayName, true);

      // Overlay our Idealyst-specific files on top
      console.log(chalk.gray('   Applying Idealyst Framework configuration...'));
      await overlayIdealystFiles(mobileTemplatePath, mobilePackagePath, templateData);

      // Configure React Native for monorepo (Android/iOS paths)
      // Only configure if we're going to install dependencies (paths need node_modules to exist)
      if (!skipInstall) {
        console.log(chalk.gray('   Configuring monorepo paths (will complete after dependency install)...'));
      }

      // Clean up backup
      await fs.remove(backupPath);

      console.log(chalk.green('   ✅ React Native mobile package initialized with native support'));
    } catch (rnError) {
      console.log(chalk.yellow('   ⚠️  React Native CLI initialization failed'));
      console.log(chalk.yellow('   The mobile package will work but may need manual setup for native platforms'));
      console.log('');
      console.log(chalk.gray('   You can initialize native folders later with:'));
      console.log(chalk.gray(`     cd ${path.relative(process.cwd(), mobilePackagePath)}`));
      console.log(chalk.gray('     npx @react-native-community/cli@latest init mobile --title "' + displayName + '"'));
      console.log('');

      // Restore from backup if it exists
      const backupPath = path.join(projectPath, '.mobile-backup');
      if (await fs.pathExists(backupPath)) {
        await fs.remove(mobilePackagePath);
        await fs.copy(backupPath, mobilePackagePath);
        await fs.remove(backupPath);
      }
    }
  } else {
    console.log(chalk.gray('   ⚠️  Skipping React Native CLI (IDEALYST_USE_RN_CLI=false)'));
    console.log(chalk.gray('   You will need to set up native platforms manually'));
  }
}
