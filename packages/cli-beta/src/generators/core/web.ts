/**
 * Web package generator
 */

import fs from 'fs-extra';
import path from 'path';
import { TemplateData, PackageGeneratorResult } from '../../types';
import { copyTemplateDirectory, getTemplatePath, templateHasContent } from '../../templates/copier';
import { DEPENDENCIES, IDEALYST_VERSION } from '../../constants';
import { logger } from '../../utils/logger';

/**
 * Generate the web package
 */
export async function generateWebPackage(
  projectPath: string,
  data: TemplateData
): Promise<PackageGeneratorResult> {
  const webDir = path.join(projectPath, 'packages', 'web');

  logger.info('Creating web package...');

  await fs.ensureDir(webDir);

  // Try to use template first, or generate programmatically
  const templatePath = getTemplatePath('core', 'web');

  if (await templateHasContent(templatePath)) {
    await copyTemplateDirectory(templatePath, webDir, data);
  } else {
    // Generate programmatically
    await generateWebFiles(webDir, data);
  }

  return { success: true };
}

/**
 * Generate web package files programmatically
 */
async function generateWebFiles(
  webDir: string,
  data: TemplateData
): Promise<void> {
  // Create directory structure
  await fs.ensureDir(path.join(webDir, 'src', 'pages'));
  await fs.ensureDir(path.join(webDir, 'src', 'navigation'));
  await fs.ensureDir(path.join(webDir, 'public'));

  // Create package.json
  await fs.writeJson(
    path.join(webDir, 'package.json'),
    createWebPackageJson(data),
    { spaces: 2 }
  );

  // Create vite.config.ts
  await fs.writeFile(
    path.join(webDir, 'vite.config.ts'),
    createViteConfig(data)
  );

  // Create tsconfig.json
  await fs.writeJson(
    path.join(webDir, 'tsconfig.json'),
    createWebTsConfig(),
    { spaces: 2 }
  );

  // Create tsconfig.node.json (for Vite config)
  await fs.writeJson(
    path.join(webDir, 'tsconfig.node.json'),
    createWebTsConfigNode(),
    { spaces: 2 }
  );

  // Create index.html
  await fs.writeFile(
    path.join(webDir, 'index.html'),
    createIndexHtml(data)
  );

  // Create src/main.tsx
  await fs.writeFile(
    path.join(webDir, 'src', 'main.tsx'),
    createMainTsx(data)
  );

  // Create src/App.tsx
  await fs.writeFile(
    path.join(webDir, 'src', 'App.tsx'),
    createAppTsx(data)
  );

  // Create src/pages/Home.tsx
  await fs.writeFile(
    path.join(webDir, 'src', 'pages', 'Home.tsx'),
    createHomePage(data)
  );

  // Create src/navigation/AppRouter.tsx
  await fs.writeFile(
    path.join(webDir, 'src', 'navigation', 'AppRouter.tsx'),
    createAppRouter(data)
  );
}

/**
 * Create web package.json
 */
function createWebPackageJson(data: TemplateData): Record<string, unknown> {
  const dependencies: Record<string, string> = {
    ...DEPENDENCIES.core,
    ...DEPENDENCIES.web,
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
    name: `@${data.workspaceScope}/web`,
    version: data.version,
    type: 'module',
    scripts: {
      'dev': 'vite',
      'build': 'tsc && vite build',
      'preview': 'vite preview',
      'test': 'jest',
    },
    dependencies,
    devDependencies: {
      '@babel/core': '^7.24.0',
      '@babel/preset-react': '^7.24.0',
      '@babel/preset-typescript': '^7.24.0',
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      '@vitejs/plugin-react': '^4.3.0',
      'typescript': '^5.0.0',
      'vite': '^5.2.0',
      'vite-plugin-babel': '^1.2.0',
    },
  };
}

/**
 * Create vite.config.ts
 */
function createViteConfig(data: TemplateData): string {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from 'vite-plugin-babel';
import path from 'path';

// Monorepo root (where hoisted node_modules live)
const monorepoRoot = path.resolve(__dirname, '../..');

export default defineConfig({
  plugins: [
    babel({
      filter: (id) =>
        id.includes('node_modules/@idealyst/') ||
        (id.includes('/packages/') && /\\.(tsx?|jsx?)$/.test(id)),
      babelConfig: {
        presets: [
          ['@babel/preset-react', { runtime: 'automatic' }],
          ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
        ],
        plugins: [
          // 1. Idealyst theme plugin - processes $iterator patterns FIRST
          [
            '@idealyst/theme/plugin',
            {
              autoProcessPaths: [
                'packages/',
                '@idealyst/components',
                '@idealyst/navigation',
                '@idealyst/theme',
              ],
              themePath: '../shared/src/theme.ts',
            },
          ],
          // 2. Unistyles plugin - processes StyleSheet.create SECOND
          [
            'react-native-unistyles/plugin',
            {
              root: 'src',
              autoProcessPaths: [
                'packages/',
                '@idealyst/components',
                '@idealyst/navigation',
                '@idealyst/theme',
              ],
            },
          ],
          // 3. Idealyst components web plugin
          ['@idealyst/components/plugin/web', { root: 'src' }],
        ],
      },
    }),
    react(),
  ],
  resolve: {
    alias: {
      'react-native': path.resolve(monorepoRoot, 'node_modules/react-native-web'),
      'react-native-unistyles': path.resolve(monorepoRoot, 'node_modules/react-native-unistyles'),
      '@react-native/normalize-colors': path.resolve(monorepoRoot, 'node_modules/@react-native/normalize-colors'),
      '@mdi/react': path.resolve(monorepoRoot, 'node_modules/@mdi/react'),
      '@mdi/js': path.resolve(monorepoRoot, 'node_modules/@mdi/js'),
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.js', '.jsx'],
    conditions: ['browser', 'import', 'module', 'default'],
    preserveSymlinks: false,
  },
  define: {
    global: 'globalThis',
    __DEV__: JSON.stringify(true),
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  optimizeDeps: {
    include: [
      'react-native-web',
      '@react-native/normalize-colors',
    ],
    exclude: [
      '@\${data.workspaceScope}/shared',
    ],
    esbuildOptions: {
      resolveExtensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.jsx', '.js'],
      loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
      },
    },
  },
});
`;
}

/**
 * Create web tsconfig.json
 */
function createWebTsConfig(): Record<string, unknown> {
  return {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      paths: {
        '@/*': ['./src/*'],
      },
    },
    include: ['src'],
    references: [{ path: './tsconfig.node.json' }],
  };
}

/**
 * Create web tsconfig.node.json (for Vite config and Node.js files)
 */
function createWebTsConfigNode(): Record<string, unknown> {
  return {
    compilerOptions: {
      composite: true,
      skipLibCheck: true,
      module: 'ESNext',
      moduleResolution: 'bundler',
      allowSyntheticDefaultImports: true,
      strict: true,
    },
    include: ['vite.config.ts'],
  };
}

/**
 * Create index.html
 */
function createIndexHtml(data: TemplateData): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data.appDisplayName}</title>
    <style>
      html, body, #root {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

/**
 * Create main.tsx
 */
function createMainTsx(data: TemplateData): string {
  return `// Import shared theme configuration FIRST (initializes unistyles before any StyleSheet.create)
import '@${data.workspaceScope}/shared/theme';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
}

/**
 * Create App.tsx
 */
function createAppTsx(data: TemplateData): string {
  const imports: string[] = [
    `import React from 'react';`,
    `import { BrowserRouter } from 'react-router-dom';`,
    `import { NavigatorProvider } from '@idealyst/navigation';`,
    `import { AppRouter } from './navigation/AppRouter';`,
  ];

  if (data.hasTrpc) {
    imports.push(`import { QueryClient, QueryClientProvider } from '@tanstack/react-query';`);
    imports.push(`import { trpc, trpcClient } from './utils/trpc';`);
  }

  let appContent = `
export default function App() {
  return (
    <BrowserRouter>
      <NavigatorProvider route={AppRouter} />
    </BrowserRouter>
  );
}
`;

  if (data.hasTrpc) {
    appContent = `
const queryClient = new QueryClient();

export default function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <NavigatorProvider route={AppRouter} />
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
`;
  }

  return imports.join('\n') + '\n' + appContent;
}

/**
 * Create Home page
 */
function createHomePage(data: TemplateData): string {
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

/**
 * Create AppRouter
 */
function createAppRouter(data: TemplateData): string {
  return `import { NavigatorParam } from '@idealyst/navigation';
import Home from '../pages/Home';

/**
 * Application navigation router
 */
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
      options: { title: 'Home' },
    },
  ],
};

export default AppRouter;
`;
}
