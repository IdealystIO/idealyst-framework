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

  // Always generate config files programmatically (package.json, tsconfig, etc.)
  await generateSharedConfigFiles(sharedDir, data);

  // Try to use template src/ files first, or generate programmatically
  const templateSrcPath = getTemplatePath('core', 'shared', 'src');

  if (await templateHasContent(templateSrcPath)) {
    // Copy base src/ from templates (showcase-based, excludes API-dependent files)
    await copyTemplateDirectory(templateSrcPath, path.join(sharedDir, 'src'), data);
    logger.dim('Using showcase-based source files');

    // Copy API-dependent files based on user selection
    await copyApiDependentFiles(sharedDir, data);
  } else {
    // Generate src/ programmatically (fallback)
    await generateSharedSrcFiles(sharedDir, data);
  }

  return { success: true };
}

/**
 * Copy API-dependent files (trpc/, graphql/, components/, screens/, navigation/, layouts/) based on user selection
 */
async function copyApiDependentFiles(
  sharedDir: string,
  data: TemplateData
): Promise<void> {
  const srcDir = path.join(sharedDir, 'src');

  // Copy tRPC client if enabled
  if (data.hasTrpc) {
    const trpcTemplatePath = getTemplatePath('core', 'shared', 'src-trpc');
    if (await templateHasContent(trpcTemplatePath)) {
      await copyTemplateDirectory(trpcTemplatePath, path.join(srcDir, 'trpc'), data);
      logger.dim('Added tRPC client');
    }
  }

  // Copy GraphQL client if enabled
  if (data.hasGraphql) {
    const graphqlTemplatePath = getTemplatePath('core', 'shared', 'src-graphql');
    if (await templateHasContent(graphqlTemplatePath)) {
      await copyTemplateDirectory(graphqlTemplatePath, path.join(srcDir, 'graphql'), data);
      logger.dim('Added GraphQL client');
    }
  }

  // Copy layouts (AppLayout.tsx with tab/stack layouts)
  const layoutsTemplatePath = getTemplatePath('core', 'shared', 'src-layouts');
  if (await templateHasContent(layoutsTemplatePath)) {
    await copyTemplateDirectory(layoutsTemplatePath, path.join(srcDir, 'layouts'), data);
  }

  // Copy base screens and conditionally add API demo screens
  await copyScreensWithApiDemos(srcDir, data);

  // Generate navigation/AppRouter.tsx based on API selection
  await generateNavigation(srcDir, data);

  // Generate components/App.tsx and components/index.ts based on API selection
  await generateAppComponent(srcDir, data);
}

/**
 * Copy screens and conditionally add API demo screens
 */
async function copyScreensWithApiDemos(srcDir: string, data: TemplateData): Promise<void> {
  const screensDir = path.join(srcDir, 'screens');
  await fs.ensureDir(screensDir);

  // Copy base screens (Home, Explore, Profile, Settings)
  const baseScreensPath = getTemplatePath('core', 'shared', 'src-screens');
  if (await templateHasContent(baseScreensPath)) {
    await copyTemplateDirectory(baseScreensPath, screensDir, data);
  }

  // Copy tRPC demo screen if enabled
  if (data.hasTrpc) {
    const trpcScreenPath = getTemplatePath('core', 'shared', 'src-screens-trpc');
    if (await templateHasContent(trpcScreenPath)) {
      await copyTemplateDirectory(trpcScreenPath, screensDir, data);

      // Modify HAS_DATABASE constant based on Prisma availability
      const trpcDemoPath = path.join(screensDir, 'TRPCDemoScreen.tsx');
      if (await fs.pathExists(trpcDemoPath)) {
        let content = await fs.readFile(trpcDemoPath, 'utf8');
        if (!data.hasPrisma) {
          // Replace HAS_DATABASE = true with HAS_DATABASE = false
          content = content.replace(
            /const HAS_DATABASE = true;/,
            'const HAS_DATABASE = false;'
          );
          await fs.writeFile(trpcDemoPath, content);
        }
      }
    }
  }

  // Copy GraphQL demo screen ONLY if both GraphQL AND Prisma are enabled
  // (GraphQL demo requires database for meaningful operations)
  if (data.hasGraphql && data.hasPrisma) {
    const graphqlScreenPath = getTemplatePath('core', 'shared', 'src-screens-graphql');
    if (await templateHasContent(graphqlScreenPath)) {
      await copyTemplateDirectory(graphqlScreenPath, screensDir, data);
    }
  }

  // Generate screens/index.ts based on what's enabled
  await generateScreensIndex(screensDir, data);
}

/**
 * Generate screens/index.ts based on API selection
 */
async function generateScreensIndex(screensDir: string, data: TemplateData): Promise<void> {
  const exports = [
    `export { HomeScreen } from './HomeScreen';`,
    `export { ExploreScreen } from './ExploreScreen';`,
    `export { ProfileScreen } from './ProfileScreen';`,
    `export { SettingsScreen } from './SettingsScreen';`,
  ];

  if (data.hasTrpc) {
    exports.push(`export { TRPCDemoScreen } from './TRPCDemoScreen';`);
  }

  // GraphQL demo only available when both GraphQL AND Prisma are enabled
  if (data.hasGraphql && data.hasPrisma) {
    exports.push(`export { GraphQLDemoScreen } from './GraphQLDemoScreen';`);
  }

  await fs.writeFile(path.join(screensDir, 'index.ts'), exports.join('\n') + '\n');
}

/**
 * Generate navigation/AppRouter.tsx based on API selection
 */
async function generateNavigation(srcDir: string, data: TemplateData): Promise<void> {
  const navigationDir = path.join(srcDir, 'navigation');
  await fs.ensureDir(navigationDir);

  // Generate AppRouter.tsx
  const routerContent = createAppRouter(data);
  await fs.writeFile(path.join(navigationDir, 'AppRouter.tsx'), routerContent);

  // Generate navigation/index.ts
  await fs.writeFile(
    path.join(navigationDir, 'index.ts'),
    `export { AppRouter } from './AppRouter';\n`
  );
}

/**
 * Create AppRouter based on API selection
 */
function createAppRouter(data: TemplateData): string {
  const hasTrpc = data.hasTrpc;
  const hasGraphql = data.hasGraphql;

  // Build screen imports
  const screenImports = [
    `import { HomeScreen } from '../screens/HomeScreen';`,
    `import { ExploreScreen } from '../screens/ExploreScreen';`,
    `import { ProfileScreen } from '../screens/ProfileScreen';`,
    `import { SettingsScreen } from '../screens/SettingsScreen';`,
  ];

  if (hasTrpc) {
    screenImports.push(`import { TRPCDemoScreen } from '../screens/TRPCDemoScreen';`);
  }

  // GraphQL demo only available when both GraphQL AND Prisma are enabled
  const hasGraphqlDemo = hasGraphql && data.hasPrisma;
  if (hasGraphqlDemo) {
    screenImports.push(`import { GraphQLDemoScreen } from '../screens/GraphQLDemoScreen';`);
  }

  // Build tab routes
  const tabRoutes = [
    `    {
      path: '',
      type: 'screen',
      component: HomeScreen,
      options: {
        title: 'Home',
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused, color, size }) => (
          <Icon
            name={focused ? 'home' : 'home-outline'}
            color={color}
            size={size}
          />
        ),
      } as TabBarScreenOptions,
    }`,
    `    {
      path: 'explore',
      type: 'screen',
      component: ExploreScreen,
      options: {
        title: 'Explore',
        tabBarLabel: 'Explore',
        tabBarIcon: ({ focused, color, size }) => (
          <Icon
            name={focused ? 'compass' : 'compass-outline'}
            color={color}
            size={size}
          />
        ),
      } as TabBarScreenOptions,
    }`,
    `    {
      path: 'profile',
      type: 'screen',
      component: ProfileScreen,
      options: {
        title: 'Profile',
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused, color, size }) => (
          <Icon
            name={focused ? 'account' : 'account-outline'}
            color={color}
            size={size}
          />
        ),
      } as TabBarScreenOptions,
    }`,
  ];

  if (hasTrpc) {
    tabRoutes.push(`    {
      path: 'trpc',
      type: 'screen',
      component: TRPCDemoScreen,
      options: {
        title: 'tRPC',
        tabBarLabel: 'tRPC',
        tabBarIcon: ({ focused, color, size }) => (
          <Icon
            name="api"
            color={color}
            size={size}
          />
        ),
      } as TabBarScreenOptions,
    }`);
  }

  if (hasGraphqlDemo) {
    tabRoutes.push(`    {
      path: 'graphql',
      type: 'screen',
      component: GraphQLDemoScreen,
      options: {
        title: 'GraphQL',
        tabBarLabel: 'GraphQL',
        tabBarIcon: ({ focused, color, size }) => (
          <Icon
            name="graphql"
            color={color}
            size={size}
          />
        ),
      } as TabBarScreenOptions,
    }`);
  }

  return `import React from 'react';
import { Icon } from '@idealyst/components';
import type { NavigatorParam, TabBarScreenOptions } from '@idealyst/navigation';

// Screens
${screenImports.join('\n')}

// Custom Layouts
import { AppTabLayout, AppStackLayout } from '../layouts/AppLayout';

/**
 * Tab Navigator - Contains main tabs
 */
const MainTabNavigator: NavigatorParam = {
  path: '',
  type: 'navigator',
  layout: 'tab',
  layoutComponent: AppTabLayout,
  routes: [
${tabRoutes.join(',\n')},
  ],
};

/**
 * Root Stack Navigator - Wraps tabs and adds Settings screen
 */
export const AppRouter: NavigatorParam = {
  path: '/',
  type: 'navigator',
  layout: 'stack',
  layoutComponent: AppStackLayout,
  routes: [
    MainTabNavigator,
    {
      path: 'settings',
      type: 'screen',
      component: SettingsScreen,
      options: {
        title: 'Settings',
        headerShown: true,
      },
    },
  ],
};

export default AppRouter;
`;
}

/**
 * Generate App.tsx and components/index.ts based on API selection
 */
async function generateAppComponent(srcDir: string, data: TemplateData): Promise<void> {
  const componentsDir = path.join(srcDir, 'components');
  await fs.ensureDir(componentsDir);

  // Generate App.tsx based on what's enabled
  const appContent = createTemplateAppComponent(data);
  await fs.writeFile(path.join(componentsDir, 'App.tsx'), appContent);

  // Generate components/index.ts
  await fs.writeFile(
    path.join(componentsDir, 'index.ts'),
    `export { App, default } from './App';\n`
  );
}

/**
 * Create App component based on API selection (for showcase templates)
 */
function createTemplateAppComponent(data: TemplateData): string {
  const hasTrpc = data.hasTrpc;
  const hasGraphql = data.hasGraphql;
  const hasApi = data.hasApi;

  // No API - simple app
  if (!hasApi || (!hasTrpc && !hasGraphql)) {
    return `import React from 'react';
import { NavigatorProvider } from '@idealyst/navigation';
import { AppRouter } from '../navigation/AppRouter';

/**
 * Main App component for ${data.appDisplayName}
 */
export const App: React.FC = () => {
  return <NavigatorProvider route={AppRouter} />;
};

export default App;
`;
  }

  // Build imports
  const imports: string[] = [
    `import React, { useState } from 'react';`,
    `import { NavigatorProvider } from '@idealyst/navigation';`,
  ];

  if (hasTrpc || hasGraphql) {
    imports.push(`import { QueryClient, QueryClientProvider } from '@tanstack/react-query';`);
  }

  imports.push(`import { AppRouter } from '../navigation/AppRouter';`);

  if (hasTrpc) {
    imports.push(`import { trpc, createTRPCClient } from '../trpc/client';`);
  }

  if (hasGraphql) {
    imports.push(`import { ApolloProvider, createApolloClient } from '../graphql/client';`);
  }

  // Build component body
  const stateSetup: string[] = [];

  if (hasTrpc || hasGraphql) {
    stateSetup.push(`  // Create React Query client
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5000,
      },
    },
  }));`);
  }

  if (hasTrpc) {
    stateSetup.push(`
  // Create tRPC client
  const [trpcClient] = useState(() =>
    createTRPCClient({
      apiUrl: \`\${API_URL}/trpc\`,
    })
  );`);
  }

  if (hasGraphql) {
    stateSetup.push(`
  // Create Apollo client
  const [apolloClient] = useState(() =>
    createApolloClient({
      graphqlUrl: \`\${API_URL}/graphql\`,
    })
  );`);
  }

  // Build JSX tree
  let jsx = `<NavigatorProvider route={AppRouter} />`;

  if (hasGraphql) {
    jsx = `<ApolloProvider client={apolloClient}>
          ${jsx}
        </ApolloProvider>`;
  }

  if (hasTrpc || hasGraphql) {
    jsx = `<QueryClientProvider client={queryClient}>
        ${jsx}
      </QueryClientProvider>`;
  }

  if (hasTrpc) {
    jsx = `<trpc.Provider client={trpcClient} queryClient={queryClient}>
      ${jsx}
    </trpc.Provider>`;
  }

  return `${imports.join('\n')}

// API configuration
const API_URL = 'http://localhost:3000';

/**
 * Main App component for ${data.appDisplayName}
 * Sets up navigation${hasTrpc ? ' with tRPC' : ''}${hasGraphql ? (hasTrpc ? ' and Apollo' : ' with Apollo') : ''} providers
 */
export const App: React.FC = () => {
${stateSetup.join('\n')}

  return (
    ${jsx}
  );
};

export default App;
`;
}

/**
 * Generate shared package config files (package.json, tsconfig)
 */
async function generateSharedConfigFiles(
  sharedDir: string,
  data: TemplateData
): Promise<void> {
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
}

/**
 * Generate shared package src files programmatically (fallback when no template)
 */
async function generateSharedSrcFiles(
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
    'react': DEPENDENCIES.web.react,
    'react-native': DEPENDENCIES.mobile['react-native'],
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
    },
    scripts: {
      'build': 'tsc',
      'test': 'jest',
    },
    dependencies,
    peerDependencies,
    devDependencies: {
      // Core dependencies are also devDependencies for TypeScript type-checking
      ...DEPENDENCIES.core,
      'react': DEPENDENCIES.web.react,
      'react-dom': DEPENDENCIES.web['react-dom'],
      'react-native': DEPENDENCIES.mobile['react-native'],
      'react-native-unistyles': '^3.0.0',
      'react-native-svg': '^15.0.0',
      'react-router-dom': DEPENDENCIES.web['react-router-dom'],
      '@mdi/react': DEPENDENCIES.web['@mdi/react'],
      'typescript': '^5.0.0',
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      '@types/node': '^20.0.0',
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
 * Create AppRouter - shared navigation configuration (fallback when no templates)
 */
function createFallbackAppRouter(data: TemplateData): string {
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
