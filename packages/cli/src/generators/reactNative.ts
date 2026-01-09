/**
 * React Native initialization utilities
 */

import path from 'path';
import fs from 'fs-extra';
import { ReactNativeInitOptions, PackageGeneratorResult } from '../types';
import { runCommand } from '../utils/shell';
import { logger } from '../utils/logger';
import { RN_TIMEOUT } from '../constants';

/**
 * Initialize a React Native project with correct identifiers
 */
export async function initializeReactNative(
  options: ReactNativeInitOptions
): Promise<PackageGeneratorResult> {
  const { projectName, displayName, bundleId, packageName, directory, skipInstall, interactive } = options;

  // Use spinner in interactive mode, regular logging otherwise
  const spinner = interactive ? logger.spinner('Installing React Native project...') : null;

  try {
    if (!interactive) {
      logger.info('Initializing React Native with native platform support...');
    }

    // Build the React Native CLI command
    const args = [
      '@react-native-community/cli@latest',
      'init',
      projectName,
      '--title', displayName,
      '--package-name', packageName,  // Sets Android package name
      '--pm', 'yarn',
      '--skip-git-init',
    ];

    if (skipInstall) {
      args.push('--skip-install');
    }

    const result = await runCommand('npx', args, {
      cwd: directory,
      timeout: RN_TIMEOUT,
      silent: interactive, // Hide output in interactive mode
    });

    if (result.exitCode !== 0) {
      throw new Error('React Native CLI failed');
    }

    if (spinner) {
      spinner.text = 'Configuring iOS bundle identifier...';
    }

    // Update iOS bundle identifier (RN CLI only sets Android package name)
    await updateIosBundleId(
      path.join(directory, projectName),
      bundleId,
      projectName
    );

    if (spinner) {
      spinner.text = 'Configuring Android for monorepo...';
    }

    // Fix Android gradle files for monorepo node_modules paths
    await fixMonorepoGradlePaths(path.join(directory, projectName));

    if (spinner) {
      spinner.succeed('React Native project installed');
    }

    return { success: true };

  } catch (error) {
    if (spinner) {
      spinner.fail('React Native initialization failed');
    } else {
      logger.warn('React Native CLI initialization failed');
    }
    logger.dim('Native folders could not be created automatically.');
    logger.dim('You may need to run React Native init manually or use Expo.');

    return {
      success: false,
      warning: 'Native folders could not be created. You may need to initialize React Native manually.',
    };
  }
}

/**
 * Update iOS bundle identifier in project.pbxproj
 */
async function updateIosBundleId(
  projectPath: string,
  bundleId: string,
  projectName: string
): Promise<void> {
  const pbxprojPath = path.join(
    projectPath,
    'ios',
    `${projectName}.xcodeproj`,
    'project.pbxproj'
  );

  if (await fs.pathExists(pbxprojPath)) {
    let content = await fs.readFile(pbxprojPath, 'utf8');

    // Replace default bundle identifier pattern
    // RN CLI uses org.reactjs.native.example.{projectName} by default
    content = content.replace(
      /PRODUCT_BUNDLE_IDENTIFIER = "[^"]+"/g,
      `PRODUCT_BUNDLE_IDENTIFIER = "${bundleId}"`
    );

    await fs.writeFile(pbxprojPath, content);
  }
}

/**
 * Fix Android gradle files for monorepo structure
 *
 * In a Yarn workspace monorepo, dependencies are hoisted to the root node_modules.
 * The React Native CLI generates paths assuming node_modules is in the package directory,
 * but we need to point to the monorepo root instead.
 *
 * Directory structure:
 *   monorepo-root/
 *     node_modules/           <- hoisted dependencies here
 *     packages/
 *       mobile/
 *         android/
 *           settings.gradle   <- needs ../../../node_modules (3 levels up)
 *           app/
 *             build.gradle    <- needs ../../../../node_modules (4 levels up)
 */
async function fixMonorepoGradlePaths(projectPath: string): Promise<void> {
  await fixSettingsGradle(projectPath);
  await fixAppBuildGradle(projectPath);
}

/**
 * Fix settings.gradle for monorepo paths
 */
async function fixSettingsGradle(projectPath: string): Promise<void> {
  const settingsPath = path.join(projectPath, 'android', 'settings.gradle');

  if (!await fs.pathExists(settingsPath)) {
    return;
  }

  let content = await fs.readFile(settingsPath, 'utf8');

  // Add monorepo comment at the top if not already present
  if (!content.includes('MONOREPO NOTE')) {
    const monorepoComment = `// MONOREPO NOTE: In a Yarn workspace monorepo, dependencies are hoisted to the root node_modules.
// Paths must point to the monorepo root (../../../node_modules) not the package's node_modules.
`;
    content = monorepoComment + content;
  }

  // Fix pluginManagement includeBuild path
  content = content.replace(
    /includeBuild\s*\(\s*["']\.\.\/node_modules\/@react-native\/gradle-plugin["']\s*\)/g,
    'includeBuild("../../../node_modules/@react-native/gradle-plugin")'
  );

  // Fix any other includeBuild paths for @react-native/gradle-plugin at the end of the file
  content = content.replace(
    /includeBuild\s*\(\s*["']\.\.\/node_modules\/@react-native\/gradle-plugin["']\s*\)(?!.*pluginManagement)/g,
    'includeBuild(\'../../../node_modules/@react-native/gradle-plugin\')'
  );

  await fs.writeFile(settingsPath, content);
}

/**
 * Fix app/build.gradle for monorepo paths and add vector icons
 */
async function fixAppBuildGradle(projectPath: string): Promise<void> {
  const buildGradlePath = path.join(projectPath, 'android', 'app', 'build.gradle');

  if (!await fs.pathExists(buildGradlePath)) {
    return;
  }

  let content = await fs.readFile(buildGradlePath, 'utf8');

  // Add vector icons configuration if not present
  if (!content.includes('react-native-vector-icons')) {
    // Add after the apply plugin lines with monorepo comment
    const vectorIconsBlock = `
// MONOREPO NOTE: In a Yarn workspace monorepo, dependencies are hoisted to the root node_modules.
// Paths must point to the monorepo root (../../../../node_modules from android/app) not the package's node_modules.
apply from: file("../../../../node_modules/react-native-vector-icons/fonts.gradle")
`;

    // Find the last apply plugin/from line and insert after it
    const lines = content.split('\n');
    let lastApplyIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('apply plugin:') || lines[i].includes('apply from:')) {
        lastApplyIndex = i;
      }
    }

    if (lastApplyIndex !== -1) {
      lines.splice(lastApplyIndex + 1, 0, vectorIconsBlock);
      content = lines.join('\n');
    }
  }

  // Fix the react block to use monorepo paths
  // We need to uncomment and update the root, reactNativeDir, codegenDir, and cliFile paths

  // First, check if the react block exists
  if (content.includes('react {')) {
    // Update or add the monorepo paths in the react block
    const reactBlockRegex = /(react\s*\{[\s\S]*?)(\/\*\s*Folders\s*\*\/[\s\S]*?)(\/\*\s*Variants\s*\*\/)/;
    const match = content.match(reactBlockRegex);

    if (match) {
      const newFoldersSection = `/* Folders */
    // MONOREPO: Point to monorepo root where package.json and node_modules live
    root = file("../../../..")
    // MONOREPO: Point to hoisted node_modules
    reactNativeDir = file("../../../../node_modules/react-native")
    codegenDir = file("../../../../node_modules/@react-native/codegen")
    cliFile = file("../../../../node_modules/react-native/cli.js")

    `;

      content = content.replace(reactBlockRegex, `$1${newFoldersSection}$3`);
    }
  }

  await fs.writeFile(buildGradlePath, content);
}

/**
 * Check if native folders exist in a mobile package
 */
export async function hasNativeFolders(mobileDir: string): Promise<{
  android: boolean;
  ios: boolean;
}> {
  return {
    android: await fs.pathExists(path.join(mobileDir, 'android')),
    ios: await fs.pathExists(path.join(mobileDir, 'ios')),
  };
}

/**
 * Overlay Idealyst files onto an existing React Native project
 */
export async function overlayIdealystFiles(
  mobileDir: string,
  templateDir: string,
  data: import('../types').TemplateData
): Promise<void> {
  const { copyTemplateDirectory } = await import('../templates/copier');

  // Copy template files, skipping android/ios directories
  const entries = await fs.readdir(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    // Skip native folders - we don't want to overwrite RN CLI generated ones
    if (entry.name === 'android' || entry.name === 'ios') {
      continue;
    }

    const sourcePath = path.join(templateDir, entry.name);
    const destPath = path.join(mobileDir, entry.name);

    if (entry.isDirectory()) {
      await copyTemplateDirectory(sourcePath, destPath, data);
    } else {
      // Copy file with template processing
      const { copyTemplateFile } = await import('../templates/copier');
      await copyTemplateFile(sourcePath, destPath, data);
    }
  }
}
