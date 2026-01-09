/**
 * Shared package generator
 */

import fs from 'fs-extra';
import path from 'path';
import { TemplateData, PackageGeneratorResult } from '../../types';
import { copyTemplateDirectory, getTemplatePath, templateHasContent } from '../../templates/copier';
import { DEPENDENCIES, IDEALYST_VERSION } from '../../constants';
import { logger } from '../../utils/logger';

/**
 * Generate the shared package
 */
export async function generateSharedPackage(
  projectPath: string,
  data: TemplateData
): Promise<PackageGeneratorResult> {
  const sharedDir = path.join(projectPath, 'packages', 'shared');

  logger.info('Creating shared package...');

  await fs.ensureDir(sharedDir);

  // Try to use template first, or generate programmatically
  const templatePath = getTemplatePath('core', 'shared');

  if (await templateHasContent(templatePath)) {
    await copyTemplateDirectory(templatePath, sharedDir, data);
  } else {
    // Generate programmatically
    await generateSharedFiles(sharedDir, data);
  }

  return { success: true };
}

/**
 * Generate shared package files programmatically
 */
async function generateSharedFiles(
  sharedDir: string,
  data: TemplateData
): Promise<void> {
  // Create directory structure
  await fs.ensureDir(path.join(sharedDir, 'src', 'components'));
  await fs.ensureDir(path.join(sharedDir, 'src', 'utils'));

  // Create package.json
  await fs.writeJson(
    path.join(sharedDir, 'package.json'),
    createSharedPackageJson(data),
    { spaces: 2 }
  );

  // Create tsconfig.json
  await fs.writeJson(
    path.join(sharedDir, 'tsconfig.json'),
    createSharedTsConfig(),
    { spaces: 2 }
  );

  // Create src/index.ts
  await fs.writeFile(
    path.join(sharedDir, 'src', 'index.ts'),
    createSharedIndex()
  );

  // Create src/theme.ts
  await fs.writeFile(
    path.join(sharedDir, 'src', 'theme.ts'),
    createThemeConfig()
  );

  // Create src/components/HelloWorld.tsx
  await fs.writeFile(
    path.join(sharedDir, 'src', 'components', 'HelloWorld.tsx'),
    createHelloWorldComponent()
  );

  // Create src/components/index.ts
  await fs.writeFile(
    path.join(sharedDir, 'src', 'components', 'index.ts'),
    `export * from './HelloWorld';\n`
  );
}

/**
 * Create shared package.json
 */
function createSharedPackageJson(data: TemplateData): Record<string, unknown> {
  const dependencies: Record<string, string> = {};
  const peerDependencies: Record<string, string> = {
    ...DEPENDENCIES.core,
    'react': `^${DEPENDENCIES.web.react}`,
    'react-native': `^${DEPENDENCIES.mobile['react-native']}`,
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
    name: `@${data.workspaceScope}/shared`,
    version: data.version,
    main: 'src/index.ts',
    types: 'src/index.ts',
    exports: {
      '.': './src/index.ts',
      './theme': './src/theme.ts',
    },
    scripts: {
      'build': 'tsc',
      'test': 'jest',
    },
    dependencies,
    peerDependencies,
    devDependencies: {
      'typescript': '^5.0.0',
      '@types/react': '^18.2.0',
    },
  };
}

/**
 * Create shared tsconfig.json
 */
function createSharedTsConfig(): Record<string, unknown> {
  return {
    extends: '../../tsconfig.json',
    compilerOptions: {
      outDir: './dist',
      rootDir: './src',
      jsx: 'react-jsx',
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };
}

/**
 * Create shared index.ts
 */
function createSharedIndex(): string {
  return `/**
 * Shared package exports
 */

export * from './components';

// Re-export Idealyst components for convenience
export * from '@idealyst/components';
export * from '@idealyst/theme';
`;
}

/**
 * Create theme configuration
 */
function createThemeConfig(): string {
  return `/**
 * Theme configuration for the application
 */

import { StyleSheet } from 'react-native-unistyles';
import { fromTheme, lightTheme, darkTheme } from '@idealyst/theme';

// Configure unistyles with the Idealyst themes
// fromTheme().build() is required for babel transpilation
StyleSheet.configure({
  themes: {
    light: fromTheme(lightTheme).build(),
    dark: fromTheme(darkTheme).build(),
  },
  settings: {
    initialTheme: 'light',
  },
});

export { StyleSheet };
`;
}

/**
 * Create HelloWorld component
 */
function createHelloWorldComponent(): string {
  return `/**
 * Hello World component - demonstrates cross-platform usage
 */

import React from 'react';
import { View, Text, Button } from '@idealyst/components';
import { useUnistyles } from 'react-native-unistyles';

export interface HelloWorldProps {
  name?: string;
  onPress?: () => void;
}

export function HelloWorld({ name = 'World', onPress }: HelloWorldProps) {
  const { theme } = useUnistyles();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: theme.colors.surface.primary,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: theme.colors.text.primary,
          marginBottom: 8,
        }}
      >
        Hello, {name}!
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: theme.colors.text.secondary,
          marginBottom: 24,
        }}
      >
        Built with Idealyst Framework
      </Text>
      {onPress && (
        <Button onPress={onPress} intent="primary">
          Get Started
        </Button>
      )}
    </View>
  );
}
`;
}
