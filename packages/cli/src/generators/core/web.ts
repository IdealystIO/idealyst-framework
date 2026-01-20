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
  await fs.ensureDir(path.join(webDir, 'src'));
  await fs.ensureDir(path.join(webDir, 'public'));

  // Always generate config files programmatically
  await generateWebConfigFiles(webDir, data);

  // Try to use template src/ and index.html first, or generate programmatically
  const templatePath = getTemplatePath('core', 'web');
  const templateSrcPath = getTemplatePath('core', 'web', 'src');
  const templateIndexHtml = path.join(templatePath, 'index.html');
  const templatePublicPath = path.join(templatePath, 'public');

  if (await templateHasContent(templateSrcPath)) {
    // Copy src/ from templates (showcase-based)
    await copyTemplateDirectory(templateSrcPath, path.join(webDir, 'src'), data);
    logger.dim('Using showcase-based source files');
  } else {
    // Generate src/ programmatically (fallback)
    await generateWebSrcFiles(webDir, data);
  }

  // Copy index.html from template if exists
  if (await fs.pathExists(templateIndexHtml)) {
    await fs.copy(templateIndexHtml, path.join(webDir, 'index.html'));
    // Process template variables in index.html
    const content = await fs.readFile(path.join(webDir, 'index.html'), 'utf8');
    const { processTemplateContent } = await import('../../templates/processor');
    await fs.writeFile(path.join(webDir, 'index.html'), processTemplateContent(content, data));
  } else {
    await fs.writeFile(path.join(webDir, 'index.html'), createIndexHtml(data));
  }

  // Copy public/ from template if exists
  if (await templateHasContent(templatePublicPath)) {
    await copyTemplateDirectory(templatePublicPath, path.join(webDir, 'public'), data);
  }

  return { success: true };
}

/**
 * Generate web package config files (package.json, vite.config, tsconfig)
 */
async function generateWebConfigFiles(
  webDir: string,
  data: TemplateData
): Promise<void> {
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
}

/**
 * Generate web package src files programmatically (fallback)
 */
async function generateWebSrcFiles(
  webDir: string,
  data: TemplateData
): Promise<void> {
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
      ...DEPENDENCIES.tooling,
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
          // 0. Config plugin - injects env vars at build time
          ['@idealyst/config/plugin', {
            extends: ['../shared/.env'],
          }],
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
      '@${data.workspaceScope}/shared',
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
      types: ['vite/client'],
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
    <!-- Inter font from Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <style>
      html, body, #root {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
 * Web just wraps the shared App with BrowserRouter for web routing
 */
function createAppTsx(data: TemplateData): string {
  return `/**
 * Web App entry point
 * Wraps the shared App with BrowserRouter for web routing
 */

import { BrowserRouter } from 'react-router-dom';
import { App } from '@${data.workspaceScope}/shared';

export default function WebApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
`;
}

