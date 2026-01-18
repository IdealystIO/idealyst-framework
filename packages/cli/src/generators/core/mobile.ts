/**
 * Mobile package generator
 */

import fs from 'fs-extra';
import path from 'path';
import { TemplateData, PackageGeneratorResult } from '../../types';
import { copyTemplateDirectory, getTemplatePath, templateHasContent } from '../../templates/copier';
import { initializeReactNative } from '../reactNative';
import { DEPENDENCIES, IDEALYST_VERSION } from '../../constants';
import { logger } from '../../utils/logger';

export interface MobileGeneratorOptions extends TemplateData {
  bundleId: string;
  packageName: string;
  skipInstall?: boolean;
  interactive?: boolean;
}

/**
 * Generate the mobile package
 */
export async function generateMobilePackage(
  projectPath: string,
  options: MobileGeneratorOptions
): Promise<PackageGeneratorResult> {
  const mobileDir = path.join(projectPath, 'packages', 'mobile');

  logger.info('Creating mobile package...');

  // First, try to initialize React Native with proper identifiers
  const rnResult = await initializeReactNative({
    projectName: 'mobile',
    displayName: options.appDisplayName,
    bundleId: options.bundleId,
    packageName: options.packageName,
    directory: path.join(projectPath, 'packages'),
    skipInstall: options.skipInstall ?? true,
    interactive: options.interactive ?? false,
  });

  // Always generate config files programmatically
  await generateMobileConfigFiles(mobileDir, options);

  // Try to use template src/ files first, or generate programmatically
  const templateSrcPath = getTemplatePath('core', 'mobile', 'src');

  if (await templateHasContent(templateSrcPath)) {
    // Copy src/ from templates (showcase-based)
    await copyTemplateDirectory(templateSrcPath, path.join(mobileDir, 'src'), options);
    logger.dim('Using showcase-based source files');
  } else {
    // Generate src/ programmatically (fallback)
    await generateMobileSrcFiles(mobileDir, options);
  }

  if (!rnResult.success) {
    logger.warn('Native folders (android/ios) were not created.');
    logger.dim('Run "npx react-native init" in the mobile directory to create them.');
  }

  return {
    success: true,
    warning: rnResult.warning,
  };
}

/**
 * Generate mobile package config files (package.json, app.json, configs)
 */
async function generateMobileConfigFiles(
  mobileDir: string,
  data: MobileGeneratorOptions
): Promise<void> {
  // Create directory structure
  await fs.ensureDir(path.join(mobileDir, 'src'));

  // Create package.json
  await fs.writeJson(
    path.join(mobileDir, 'package.json'),
    createMobilePackageJson(data),
    { spaces: 2 }
  );

  // Create app.json
  await fs.writeJson(
    path.join(mobileDir, 'app.json'),
    createAppJson(data),
    { spaces: 2 }
  );

  // Create metro.config.js
  await fs.writeFile(
    path.join(mobileDir, 'metro.config.js'),
    createMetroConfig()
  );

  // Create babel.config.js
  await fs.writeFile(
    path.join(mobileDir, 'babel.config.js'),
    createBabelConfig(data)
  );

  // Create tsconfig.json
  await fs.writeJson(
    path.join(mobileDir, 'tsconfig.json'),
    createMobileTsConfig(),
    { spaces: 2 }
  );

  // Create index.js (entry point)
  await fs.writeFile(
    path.join(mobileDir, 'index.js'),
    createIndexJs(data)
  );
}

/**
 * Generate mobile package src files programmatically (fallback)
 */
async function generateMobileSrcFiles(
  mobileDir: string,
  data: MobileGeneratorOptions
): Promise<void> {
  // Create src/App.tsx
  await fs.writeFile(
    path.join(mobileDir, 'src', 'App.tsx'),
    createAppTsx(data)
  );
}

/**
 * Create mobile package.json
 */
function createMobilePackageJson(data: MobileGeneratorOptions): Record<string, unknown> {
  const dependencies: Record<string, string> = {
    ...DEPENDENCIES.core,
    ...DEPENDENCIES.mobile,
    [`@${data.workspaceScope}/shared`]: 'workspace:*',
  };

  // Add tRPC dependencies if enabled
  if (data.hasTrpc) {
    Object.assign(dependencies, DEPENDENCIES.trpc);
  }

  // Add GraphQL dependencies if enabled
  if (data.hasGraphql) {
    Object.assign(dependencies, DEPENDENCIES.graphql);
  }

  return {
    name: `@${data.workspaceScope}/mobile`,
    version: data.version,
    scripts: {
      'start': 'react-native start',
      'android': 'react-native run-android',
      'ios': 'react-native run-ios',
      'test': 'jest',
    },
    dependencies,
    devDependencies: {
      ...DEPENDENCIES.tooling,
      '@babel/core': '^7.24.0',
      '@babel/preset-env': '^7.24.0',
      '@babel/runtime': '^7.24.0',
      '@react-native-community/cli': '^18.0.0',
      '@react-native/babel-preset': '^0.83.0',
      '@react-native/eslint-config': '^0.83.0',
      '@react-native/metro-config': '^0.83.0',
      '@react-native/typescript-config': '^0.83.0',
      '@types/react': '^18.2.0',
      'jest': '^29.7.0',
      'typescript': '^5.0.0',
    },
  };
}

/**
 * Create app.json
 */
function createAppJson(data: MobileGeneratorOptions): Record<string, unknown> {
  // The 'name' must match the project name used in React Native init ('mobile')
  // This is what AppRegistry.registerComponent uses and what native code expects
  // The 'displayName' is what shows to users in the app launcher
  return {
    name: 'mobile',
    displayName: data.appDisplayName,
  };
}

/**
 * Create metro.config.js
 */
function createMetroConfig(): string {
  return `const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    sourceExts: ['native.tsx', 'native.ts', 'tsx', 'ts', 'native.jsx', 'native.js', 'jsx', 'js', 'json', 'cjs'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
`;
}

/**
 * Create babel.config.js
 */
function createBabelConfig(data: MobileGeneratorOptions): string {
  return `module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@idealyst/theme/plugin', {
      themePath: '../shared/src/theme.ts',
      autoProcessPaths: [
        '@idealyst/components',
        '@${data.workspaceScope}/shared',
      ],
    }],
    ['react-native-unistyles/plugin', {
      root: 'src',
      autoProcessPaths: [
        '@idealyst/components',
        '@${data.workspaceScope}/shared',
      ],
    }],
    'react-native-worklets/plugin',
  ],
};
`;
}

/**
 * Create mobile tsconfig.json
 */
function createMobileTsConfig(): Record<string, unknown> {
  return {
    extends: '@react-native/typescript-config/tsconfig.json',
    compilerOptions: {
      paths: {
        '@/*': ['./src/*'],
      },
    },
    include: ['src/**/*', 'index.js'],
    exclude: ['node_modules', 'android', 'ios'],
  };
}

/**
 * Create index.js (entry point)
 */
function createIndexJs(data: MobileGeneratorOptions): string {
  return `// Import shared theme configuration FIRST (initializes unistyles before any StyleSheet.create)
import '@${data.workspaceScope}/shared/theme';

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
`;
}

/**
 * Create App.tsx
 * Mobile wraps the shared App with SafeAreaProvider
 */
function createAppTsx(data: MobileGeneratorOptions): string {
  if (data.hasTrpc) {
    return `/**
 * Mobile App entry point
 * Wraps the shared App with SafeAreaProvider and mobile-specific API configuration
 */

import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { App } from '@${data.workspaceScope}/shared';

// API base URL for mobile
// Android emulator uses 10.0.2.2 to reach host localhost
// iOS simulator can use localhost directly
// For physical devices, use your machine's local IP address
const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3001',
  ios: 'http://localhost:3001',
  default: 'http://localhost:3001',
});

export default function MobileApp() {
  return (
    <SafeAreaProvider>
      <App apiBaseUrl={API_BASE_URL} />
    </SafeAreaProvider>
  );
}
`;
  }

  return `/**
 * Mobile App entry point
 * Wraps the shared App with SafeAreaProvider
 */

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { App } from '@${data.workspaceScope}/shared';

export default function MobileApp() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}
`;
}
