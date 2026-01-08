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
  const { projectName, displayName, bundleId, packageName, directory, skipInstall } = options;

  try {
    logger.info('Initializing React Native with native platform support...');

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
      silent: false,
    });

    if (result.exitCode !== 0) {
      throw new Error('React Native CLI failed');
    }

    // Update iOS bundle identifier (RN CLI only sets Android package name)
    await updateIosBundleId(
      path.join(directory, projectName),
      bundleId,
      projectName
    );

    // Configure Android Vector Icons
    await configureAndroidVectorIcons(path.join(directory, projectName));

    return { success: true };

  } catch (error) {
    logger.warn('React Native CLI initialization failed');
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
    logger.success(`Updated iOS bundle identifier to: ${bundleId}`);
  }
}

/**
 * Configure Android Vector Icons in build.gradle
 */
async function configureAndroidVectorIcons(projectPath: string): Promise<void> {
  const buildGradlePath = path.join(projectPath, 'android', 'app', 'build.gradle');

  if (await fs.pathExists(buildGradlePath)) {
    let content = await fs.readFile(buildGradlePath, 'utf8');

    // Check if vector icons is already configured
    if (content.includes('react-native-vector-icons')) {
      return;
    }

    // Add vector icons configuration after the android block
    const vectorIconsLine = 'apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")';

    // Find a good place to add it (after the last apply statement or at the end)
    if (content.includes('apply plugin:')) {
      // Add after the last apply plugin line
      const lines = content.split('\n');
      let lastApplyIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('apply plugin:') || lines[i].includes('apply from:')) {
          lastApplyIndex = i;
        }
      }

      if (lastApplyIndex !== -1) {
        lines.splice(lastApplyIndex + 1, 0, vectorIconsLine);
        content = lines.join('\n');
      }
    } else {
      // Append at the end
      content += '\n' + vectorIconsLine + '\n';
    }

    await fs.writeFile(buildGradlePath, content);
    logger.success('Configured Android vector icons');
  }
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
