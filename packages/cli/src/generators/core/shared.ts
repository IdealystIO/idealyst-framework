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
  await fs.ensureDir(path.join(sharedDir, 'src', 'screens'));
  await fs.ensureDir(path.join(sharedDir, 'src', 'navigation'));

  // Create utils directory for tRPC client if enabled
  if (data.hasTrpc) {
    await fs.ensureDir(path.join(sharedDir, 'src', 'utils'));
  }

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
    createSharedIndex(data)
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

  // Create src/screens/Home.tsx
  await fs.writeFile(
    path.join(sharedDir, 'src', 'screens', 'Home.tsx'),
    createHomeScreen(data)
  );

  // Create src/screens/About.tsx
  await fs.writeFile(
    path.join(sharedDir, 'src', 'screens', 'About.tsx'),
    createAboutScreen()
  );

  // Create src/screens/index.ts
  await fs.writeFile(
    path.join(sharedDir, 'src', 'screens', 'index.ts'),
    `export { default as Home } from './Home';\nexport { default as About } from './About';\n`
  );

  // Create src/navigation/AppRouter.ts
  await fs.writeFile(
    path.join(sharedDir, 'src', 'navigation', 'AppRouter.ts'),
    createAppRouter(data)
  );

  // Create src/navigation/index.ts
  await fs.writeFile(
    path.join(sharedDir, 'src', 'navigation', 'index.ts'),
    `export { AppRouter } from './AppRouter';\n`
  );

  // Create src/App.tsx - main app with all providers
  await fs.writeFile(
    path.join(sharedDir, 'src', 'App.tsx'),
    createAppComponent(data)
  );

  // Create tRPC client if enabled
  if (data.hasTrpc) {
    await fs.writeFile(
      path.join(sharedDir, 'src', 'utils', 'trpc.ts'),
      createTrpcClient(data)
    );
    await fs.writeFile(
      path.join(sharedDir, 'src', 'utils', 'index.ts'),
      `export * from './trpc';\n`
    );
  }
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
function createSharedIndex(data: TemplateData): string {
  const exports = [
    `/**`,
    ` * Shared package exports`,
    ` */`,
    ``,
    `export { default as App } from './App';`,
    `export * from './components';`,
    `export * from './screens';`,
    `export * from './navigation';`,
  ];

  if (data.hasTrpc) {
    exports.push(`export * from './utils';`);
  }

  exports.push(
    ``,
    `// Re-export Idealyst components for convenience`,
    `export * from '@idealyst/components';`,
    `export * from '@idealyst/theme';`,
  );

  return exports.join('\n') + '\n';
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

// Build themes as separate variables for babel plugin compatibility
const light = fromTheme(lightTheme)
  .build();

// Strongly type dark theme based on light theme - they should match!
const dark: typeof light = fromTheme(darkTheme)
  .build();

// Define the themes object for type inference
const themes = {
  light,
  dark,
} as const;

// Type definitions for custom themes
type AppBreakpoints = (typeof light)['breakpoints'];
type AppTheme = typeof light;

// Register theme with @idealyst/theme for proper type inference
declare module '@idealyst/theme' {
  interface CustomThemeRegistry {
    theme: AppTheme;
  }
}

// Augment Unistyles with custom theme types
declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppTheme {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

// Configure unistyles with the Idealyst themes
StyleSheet.configure({
  themes,
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

/**
 * Create Home screen
 */
function createHomeScreen(data: TemplateData): string {
  return `/**
 * Home screen - shared between web and mobile
 */

import { useNavigator } from '@idealyst/navigation';
import { HelloWorld } from '../components';

export default function Home() {
  const { navigate } = useNavigator();

  return (
    <HelloWorld
      name="${data.appDisplayName}"
      onPress={() => navigate({ path: '/about' })}
    />
  );
}
`;
}

/**
 * Create AppRouter - shared navigation configuration
 */
function createAppRouter(data: TemplateData): string {
  return `/**
 * Application navigation router
 * Shared between web and mobile platforms
 */

import { NavigatorParam } from '@idealyst/navigation';
import Home from '../screens/Home';
import About from '../screens/About';

export const AppRouter: NavigatorParam = {
  path: '/',
  type: 'navigator',
  layout: 'stack',
  options: {
    headerShown: false,
  },
  routes: [
    {
      path: '/',
      type: 'screen',
      component: Home,
      options: { title: '${data.appDisplayName}' },
    },
    {
      path: '/about',
      type: 'screen',
      component: About,
      options: { title: 'About Idealyst' },
    },
  ],
};

export default AppRouter;
`;
}

/**
 * Create About screen
 */
function createAboutScreen(): string {
  return `/**
 * About screen - explains what Idealyst is
 */

import { View, Text, Button } from '@idealyst/components';
import { useNavigator } from '@idealyst/navigation';
import { useUnistyles } from 'react-native-unistyles';

export default function About() {
  const { theme } = useUnistyles();
  const { goBack } = useNavigator();

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        backgroundColor: theme.colors.surface.primary,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: theme.colors.text.primary,
          marginBottom: 16,
        }}
      >
        What is Idealyst?
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: theme.colors.text.secondary,
          marginBottom: 16,
          lineHeight: 24,
        }}
      >
        Idealyst is a cross-platform framework for building React applications that run on both web and mobile from a single codebase.
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: theme.colors.text.secondary,
          marginBottom: 16,
          lineHeight: 24,
        }}
      >
        Key features:
      </Text>

      <View style={{ marginLeft: 16, marginBottom: 16 }}>
        <Text style={{ fontSize: 16, color: theme.colors.text.secondary, marginBottom: 8 }}>
          • Unified component library for web and mobile
        </Text>
        <Text style={{ fontSize: 16, color: theme.colors.text.secondary, marginBottom: 8 }}>
          • Shared navigation system across platforms
        </Text>
        <Text style={{ fontSize: 16, color: theme.colors.text.secondary, marginBottom: 8 }}>
          • Theme system with light/dark mode support
        </Text>
        <Text style={{ fontSize: 16, color: theme.colors.text.secondary, marginBottom: 8 }}>
          • Type-safe API integration with tRPC
        </Text>
        <Text style={{ fontSize: 16, color: theme.colors.text.secondary, marginBottom: 8 }}>
          • Monorepo structure for code sharing
        </Text>
      </View>

      <Text
        style={{
          fontSize: 16,
          color: theme.colors.text.secondary,
          marginBottom: 24,
          lineHeight: 24,
        }}
      >
        Write once, run everywhere - with native performance and consistent design.
      </Text>

      <Button onPress={goBack} intent="success">
        Go Back
      </Button>
    </View>
  );
}
`;
}

/**
 * Create App component with all providers
 */
function createAppComponent(data: TemplateData): string {
  if (data.hasTrpc) {
    return `/**
 * Main App component with all providers
 * Platform packages wrap this with their specific router (e.g., BrowserRouter for web)
 */

import { useMemo } from 'react';
import { NavigatorProvider } from '@idealyst/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './navigation';
import { trpc, createTrpcClient } from './utils/trpc';

export interface AppProps {
  /** Base URL for the API server (e.g., 'http://localhost:3001') */
  apiBaseUrl: string;
}

export default function App({ apiBaseUrl }: AppProps) {
  const queryClient = useMemo(() => new QueryClient(), []);
  const trpcClient = useMemo(() => createTrpcClient(apiBaseUrl), [apiBaseUrl]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <NavigatorProvider route={AppRouter} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
`;
  }

  return `/**
 * Main App component with all providers
 * Platform packages wrap this with their specific router (e.g., BrowserRouter for web)
 */

import { NavigatorProvider } from '@idealyst/navigation';
import { AppRouter } from './navigation';

export default function App() {
  return <NavigatorProvider route={AppRouter} />;
}
`;
}

/**
 * Create tRPC client for shared package
 */
function createTrpcClient(data: TemplateData): string {
  return `/**
 * tRPC client configuration
 * Shared between web and mobile platforms
 */

import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@${data.workspaceScope}/api';

export const trpc = createTRPCReact<AppRouter>();

/**
 * Create a tRPC client with the specified base URL
 * @param baseUrl - The API server base URL (e.g., 'http://localhost:3001')
 */
export function createTrpcClient(baseUrl: string) {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: \`\${baseUrl}/trpc\`,
      }),
    ],
  });
}
`;
}
