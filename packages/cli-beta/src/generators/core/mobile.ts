/**
 * Mobile package generator
 */

import fs from 'fs-extra';
import path from 'path';
import { TemplateData, PackageGeneratorResult } from '../../types';
import { copyTemplateDirectory, getTemplatePath, templateHasContent } from '../../templates/copier';
import { initializeReactNative, overlayIdealystFiles, hasNativeFolders } from '../reactNative';
import { DEPENDENCIES, IDEALYST_VERSION } from '../../constants';
import { logger } from '../../utils/logger';

export interface MobileGeneratorOptions extends TemplateData {
  bundleId: string;
  packageName: string;
  skipInstall?: boolean;
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
  });

  // Now overlay Idealyst-specific files or generate programmatically
  const templatePath = getTemplatePath('core', 'mobile');

  if (await templateHasContent(templatePath)) {
    if (rnResult.success) {
      // Overlay on top of RN-generated project
      await overlayIdealystFiles(mobileDir, templatePath, options);
    } else {
      // No RN init, copy full template
      await copyTemplateDirectory(templatePath, mobileDir, options);
    }
  } else {
    // Generate programmatically
    await generateMobileFiles(mobileDir, options, rnResult.success);
  }

  return {
    success: true,
    warning: rnResult.warning,
  };
}

/**
 * Generate mobile package files programmatically
 */
async function generateMobileFiles(
  mobileDir: string,
  data: MobileGeneratorOptions,
  hasNative: boolean
): Promise<void> {
  // Create directory structure
  await fs.ensureDir(path.join(mobileDir, 'src', 'screens'));

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
    createBabelConfig()
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
    createIndexJs()
  );

  // Create src/App.tsx
  await fs.writeFile(
    path.join(mobileDir, 'src', 'App.tsx'),
    createAppTsx(data)
  );

  // Create src/screens/Home.tsx
  await fs.writeFile(
    path.join(mobileDir, 'src', 'screens', 'Home.tsx'),
    createHomeScreen(data)
  );

  if (!hasNative) {
    logger.warn('Native folders (android/ios) were not created.');
    logger.dim('Run "npx react-native init" in the mobile directory to create them.');
  }
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
      '@babel/core': '^7.24.0',
      '@babel/preset-env': '^7.24.0',
      '@babel/runtime': '^7.24.0',
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
  return {
    name: data.appDisplayName.replace(/\s+/g, ''),
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
function createBabelConfig(): string {
  return `module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
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
function createIndexJs(): string {
  return `import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

// Import shared unistyles configuration
import '@${'{'}workspaceScope{'}'}/shared/unistyles';

AppRegistry.registerComponent(appName, () => App);
`;
}

/**
 * Create App.tsx
 */
function createAppTsx(data: MobileGeneratorOptions): string {
  const imports: string[] = [
    `import React from 'react';`,
    `import { NavigationContainer } from '@react-navigation/native';`,
    `import { createNativeStackNavigator } from '@react-navigation/native-stack';`,
    `import { ThemeProvider } from '@idealyst/theme';`,
    `import Home from './screens/Home';`,
  ];

  if (data.hasTrpc) {
    imports.push(`import { QueryClient, QueryClientProvider } from '@tanstack/react-query';`);
    imports.push(`import { trpc, trpcClient } from './utils/trpc';`);
  }

  let appContent = `
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: '${data.appDisplayName}' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
`;

  if (data.hasTrpc) {
    appContent = `
const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ title: '${data.appDisplayName}' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
`;
  }

  return imports.join('\n') + '\n' + appContent;
}

/**
 * Create Home screen
 */
function createHomeScreen(data: MobileGeneratorOptions): string {
  return `import React from 'react';
import { HelloWorld } from '@${data.workspaceScope}/shared';

export default function Home() {
  return (
    <HelloWorld
      name="${data.appDisplayName}"
      onPress={() => console.log('Get Started pressed!')}
    />
  );
}
`;
}
