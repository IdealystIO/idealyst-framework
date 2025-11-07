import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Configures React Native Android and iOS to work in a Yarn workspace monorepo
 * with hoisted node_modules at the workspace root.
 *
 * Based on: https://www.callstack.com/blog/setting-up-react-native-monorepo-with-yarn-workspaces
 */

interface ConfigureOptions {
  mobilePackagePath: string;
  workspaceRoot: string;
}

/**
 * Calculate relative path from mobile package to workspace root node_modules
 */
function getRelativeNodeModulesPath(mobilePackagePath: string, workspaceRoot: string): string {
  const relativePath = path.relative(mobilePackagePath, workspaceRoot);
  // Normalize to forward slashes for consistency
  return relativePath.replace(/\\/g, '/');
}

/**
 * Updates Android gradle files to use workspace root node_modules
 */
export async function configureAndroid(options: ConfigureOptions): Promise<void> {
  const { mobilePackagePath, workspaceRoot } = options;
  const androidDir = path.join(mobilePackagePath, 'android');

  if (!await fs.pathExists(androidDir)) {
    console.log('   ⚠️  Android directory not found, skipping Android configuration');
    return;
  }

  const relativeRoot = getRelativeNodeModulesPath(path.join(androidDir, 'app'), workspaceRoot);
  const relativeRootFromSettings = getRelativeNodeModulesPath(androidDir, workspaceRoot);

  // 1. Update settings.gradle
  const settingsGradlePath = path.join(androidDir, 'settings.gradle');
  if (await fs.pathExists(settingsGradlePath)) {
    let settingsContent = await fs.readFile(settingsGradlePath, 'utf8');

    // Fix existing includeBuild paths to point to root node_modules
    settingsContent = settingsContent.replace(
      /includeBuild\(["']\.\.\/node_modules\/@react-native\/gradle-plugin["']\)/g,
      `includeBuild("${relativeRootFromSettings}/node_modules/@react-native/gradle-plugin")`
    );

    // Note: React Native 0.82+ uses autolinking via ReactSettingsExtension (ex.autolinkLibrariesFromCommand())
    // so we don't need to manually add native_modules.gradle anymore
    // The gradle plugin is already included via pluginManagement at the top of the file

    await fs.writeFile(settingsGradlePath, settingsContent);
  }

  // 2. Update build.gradle (top-level)
  const buildGradlePath = path.join(androidDir, 'build.gradle');
  if (await fs.pathExists(buildGradlePath)) {
    let buildContent = await fs.readFile(buildGradlePath, 'utf8');

    // Add rootProject.ext configuration BEFORE apply plugin line
    // This is critical - reactNativeDir must be set before the plugin applies
    const rootProjectConfig = `
rootProject.ext {
    reactNativeDir = rootProject.file("${relativeRoot}/node_modules/react-native/")
    codegenDir = rootProject.file("${relativeRoot}/node_modules/@react-native/codegen/")
}
`;

    if (!buildContent.includes('reactNativeDir = rootProject.file')) {
      // Add before "apply plugin" line
      buildContent = buildContent.replace(
        /(apply plugin:\s*["']com\.facebook\.react\.rootproject["'])/,
        `${rootProjectConfig}\n$1`
      );
      await fs.writeFile(buildGradlePath, buildContent);
    }
  }

  // 3. Update app/build.gradle
  const appBuildGradlePath = path.join(androidDir, 'app', 'build.gradle');
  if (await fs.pathExists(appBuildGradlePath)) {
    let appBuildContent = await fs.readFile(appBuildGradlePath, 'utf8');

    // Update react {} block to point to root node_modules
    if (appBuildContent.includes('react {')) {
      // Uncomment and set reactNativeDir, codegenDir, and cliFile
      appBuildContent = appBuildContent.replace(
        /react\s*\{/,
        `react {
    /* Monorepo configuration - paths to workspace root node_modules */
    reactNativeDir = file("${relativeRoot}/node_modules/react-native")
    codegenDir = file("${relativeRoot}/node_modules/@react-native/codegen")
    cliFile = file("${relativeRoot}/node_modules/react-native/cli.js")`
      );
      await fs.writeFile(appBuildGradlePath, appBuildContent);
    }
  }

  console.log('   ✅ Android configured for monorepo');
}

/**
 * Updates iOS Podfile to use workspace root node_modules
 */
export async function configureIOS(options: ConfigureOptions): Promise<void> {
  const { mobilePackagePath, workspaceRoot } = options;
  const iosDir = path.join(mobilePackagePath, 'ios');

  if (!await fs.pathExists(iosDir)) {
    console.log('   ⚠️  iOS directory not found, skipping iOS configuration');
    return;
  }

  const podfilePath = path.join(iosDir, 'Podfile');
  if (!await fs.pathExists(podfilePath)) {
    console.log('   ⚠️  Podfile not found, skipping iOS configuration');
    return;
  }

  const relativeRoot = getRelativeNodeModulesPath(iosDir, workspaceRoot);

  let podfileContent = await fs.readFile(podfilePath, 'utf8');

  // Update the paths to react-native from root node_modules
  // Replace relative paths like ../node_modules/react-native with workspace root paths
  podfileContent = podfileContent.replace(
    /['"]\.\.\/node_modules\/react-native['"]/g,
    `'${relativeRoot}/node_modules/react-native'`
  );

  // Also handle cases where it's used in require statements
  podfileContent = podfileContent.replace(
    /require_relative\s+['"]\.\.\/node_modules\/react-native/g,
    `require_relative '${relativeRoot}/node_modules/react-native`
  );

  // Update Flipper configuration if present
  podfileContent = podfileContent.replace(
    /['"]\.\.\/node_modules\/react-native-flipper['"]/g,
    `'${relativeRoot}/node_modules/react-native-flipper'`
  );

  await fs.writeFile(podfilePath, podfileContent);

  console.log('   ✅ iOS configured for monorepo');
}

/**
 * Main function to configure both Android and iOS
 */
export async function configureReactNativeMonorepo(
  mobilePackagePath: string,
  workspaceRoot: string
): Promise<void> {
  console.log('🔧 Configuring React Native for monorepo...');

  const options = { mobilePackagePath, workspaceRoot };

  await configureAndroid(options);
  await configureIOS(options);

  console.log('✅ React Native monorepo configuration complete');
}
