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

  // Create index.html
  await fs.writeFile(
    path.join(webDir, 'index.html'),
    createIndexHtml(data)
  );

  // Create src/main.tsx
  await fs.writeFile(
    path.join(webDir, 'src', 'main.tsx'),
    createMainTsx()
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
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      '@vitejs/plugin-react': '^4.3.0',
      'typescript': '^5.0.0',
      'vite': '^5.2.0',
    },
  };
}

/**
 * Create vite.config.ts
 */
function createViteConfig(data: TemplateData): string {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.js', '.jsx'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  optimizeDeps: {
    exclude: ['@idealyst/components', '@idealyst/theme', '@idealyst/navigation'],
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
function createMainTsx(): string {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import shared unistyles configuration
import '@${'{'}workspaceScope{'}'}/shared/unistyles';

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
    `import { BrowserRouter, Routes, Route } from 'react-router-dom';`,
    `import { ThemeProvider } from '@idealyst/theme';`,
    `import Home from './pages/Home';`,
  ];

  if (data.hasTrpc) {
    imports.push(`import { QueryClient, QueryClientProvider } from '@tanstack/react-query';`);
    imports.push(`import { trpc, trpcClient } from './utils/trpc';`);
  }

  let appContent = `
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
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
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </BrowserRouter>
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
