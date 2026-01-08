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

  // Create src/unistyles.ts
  await fs.writeFile(
    path.join(sharedDir, 'src', 'unistyles.ts'),
    createUnistylesConfig()
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
      './unistyles': './src/unistyles.ts',
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
 * Create unistyles configuration
 */
function createUnistylesConfig(): string {
  return `/**
 * Unistyles theme configuration
 */

import { StyleSheet } from 'react-native-unistyles';
import { fromTheme } from '@idealyst/theme';

// Configure custom theme extensions
StyleSheet.configure({
  themes: {
    light: fromTheme('light', {
      colors: {
        brand: '#007AFF',
        accent: '#FF9500',
      },
    }),
    dark: fromTheme('dark', {
      colors: {
        brand: '#0A84FF',
        accent: '#FF9F0A',
      },
    }),
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
import { StyleSheet } from 'react-native-unistyles';

export interface HelloWorldProps {
  name?: string;
  onPress?: () => void;
}

export function HelloWorld({ name = 'World', onPress }: HelloWorldProps) {
  const { styles } = useStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {name}!</Text>
      <Text style={styles.subtitle}>
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

const useStyles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
}));
`;
}
