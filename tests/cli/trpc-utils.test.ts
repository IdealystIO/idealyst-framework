import fs from 'fs-extra';
import path from 'path';
import { tmpdir } from 'os';
import { 
  copyTrpcFiles, 
  copyTrpcAppComponent, 
  removeTrpcDependencies,
  getTemplateData,
  promptForTrpcIntegration 
} from '../../packages/cli/src/generators/utils';

// Test utilities
const TEST_TEMP_DIR = path.join(tmpdir(), 'idealyst-trpc-utils-tests');

async function cleanupTestDir(): Promise<void> {
  if (await fs.pathExists(TEST_TEMP_DIR)) {
    await fs.remove(TEST_TEMP_DIR);
  }
}

async function createTestDir(): Promise<string> {
  await cleanupTestDir();
  await fs.ensureDir(TEST_TEMP_DIR);
  return TEST_TEMP_DIR;
}

async function createMockTemplate(templatePath: string, platform: 'web' | 'native'): Promise<void> {
  await fs.ensureDir(path.join(templatePath, 'src', 'utils'));
  await fs.ensureDir(path.join(templatePath, 'src'));
  
  // Create mock tRPC utils file
  const trpcUtilsContent = platform === 'web' ? `
import { createTRPCReact } from '@trpc/react-query';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

// For {{projectName}} web project
type AppRouter = any;

export const trpc = createTRPCReact<AppRouter>();
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});
` : `
import { createTRPCReact } from '@trpc/react-query';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

// For {{projectName}} React Native project
type AppRouter = any;

export const trpc = createTRPCReact<AppRouter>();
// React Native specific setup
// For device testing, you might need: 'http://192.168.1.xxx:3000/trpc'
`;
  
  await fs.writeFile(path.join(templatePath, 'src', 'utils', 'trpc.ts'), trpcUtilsContent);
  
  // Create mock tRPC-enabled App component
  const appWithTrpcContent = platform === 'web' ? `
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from './utils/trpc';

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <h1>Welcome to {{projectName}}!</h1>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
` : `
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from './utils/trpc';

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Text>Welcome to {{appName}}!</Text>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
`;
  
  await fs.writeFile(path.join(templatePath, 'src', 'App-with-trpc.tsx'), appWithTrpcContent);
}

async function createMockProject(projectPath: string): Promise<void> {
  await fs.ensureDir(path.join(projectPath, 'src'));
  
  // Create a basic package.json with some dependencies including tRPC ones
  const packageJson = {
    name: 'test-project',
    version: '1.0.0',
    dependencies: {
      react: '^18.0.0',
      '@tanstack/react-query': '^5.83.0',
      '@trpc/client': '^11.4.3',
      '@trpc/react-query': '^11.4.3',
      '@trpc/server': '^11.4.3',
      'other-dependency': '^1.0.0',
    },
  };
  
  await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
  
  // Create a basic App.tsx
  await fs.writeFile(path.join(projectPath, 'src', 'App.tsx'), `
import React from 'react';

function App() {
  return <div>Basic App</div>;
}

export default App;
`);
}

describe('tRPC Utility Functions', () => {
  beforeEach(async () => {
    await createTestDir();
  });

  afterAll(async () => {
    await cleanupTestDir();
  });

  describe('copyTrpcFiles', () => {
    test('should copy tRPC utilities to web project', async () => {
      const templatePath = path.join(TEST_TEMP_DIR, 'template');
      const projectPath = path.join(TEST_TEMP_DIR, 'project');
      
      await createMockTemplate(templatePath, 'web');
      await fs.ensureDir(projectPath);
      
      const templateData = getTemplateData('test-web-project', 'Test description');
      
      await copyTrpcFiles(templatePath, projectPath, templateData);
      
      // Check that tRPC utils were copied
      const trpcUtilsPath = path.join(projectPath, 'src', 'utils', 'trpc.ts');
      expect(await fs.pathExists(trpcUtilsPath)).toBe(true);
      
      // Check template variables were replaced
      const content = await fs.readFile(trpcUtilsPath, 'utf8');
      expect(content).toContain('test-web-project');
      expect(content).not.toContain('{{projectName}}');
    });

    test('should copy tRPC utilities to native project', async () => {
      const templatePath = path.join(TEST_TEMP_DIR, 'template');
      const projectPath = path.join(TEST_TEMP_DIR, 'project');
      
      await createMockTemplate(templatePath, 'native');
      await fs.ensureDir(projectPath);
      
      const templateData = getTemplateData('test-native-project', 'Test description');
      
      await copyTrpcFiles(templatePath, projectPath, templateData);
      
      // Check that tRPC utils were copied with React Native specifics
      const trpcUtilsPath = path.join(projectPath, 'src', 'utils', 'trpc.ts');
      const content = await fs.readFile(trpcUtilsPath, 'utf8');
      expect(content).toContain('React Native');
      expect(content).toContain('192.168.1.xxx');
    });

    test('should handle missing template gracefully', async () => {
      const templatePath = path.join(TEST_TEMP_DIR, 'nonexistent');
      const projectPath = path.join(TEST_TEMP_DIR, 'project');
      
      await fs.ensureDir(projectPath);
      const templateData = getTemplateData('test-project', 'Test description');
      
      // Should not throw, but should log a warning
      await expect(copyTrpcFiles(templatePath, projectPath, templateData)).resolves.not.toThrow();
    });
  });

  describe('copyTrpcAppComponent', () => {
    test('should replace App component with tRPC version for web', async () => {
      const templatePath = path.join(TEST_TEMP_DIR, 'template');
      const projectPath = path.join(TEST_TEMP_DIR, 'project');
      
      await createMockTemplate(templatePath, 'web');
      await createMockProject(projectPath);
      
      const templateData = getTemplateData('test-web-app', 'Test description');
      
      await copyTrpcAppComponent(templatePath, projectPath, templateData);
      
      // Check that App.tsx was replaced
      const appPath = path.join(projectPath, 'src', 'App.tsx');
      const content = await fs.readFile(appPath, 'utf8');
      expect(content).toContain('trpc.Provider');
      expect(content).toContain('QueryClientProvider');
      expect(content).toContain('test-web-app');
      expect(content).not.toContain('{{projectName}}');
    });

    test('should replace App component with tRPC version for native', async () => {
      const templatePath = path.join(TEST_TEMP_DIR, 'template');
      const projectPath = path.join(TEST_TEMP_DIR, 'project');
      
      await createMockTemplate(templatePath, 'native');
      await createMockProject(projectPath);
      
      const templateData = getTemplateData('test-native-app', 'Test description', 'Test Native App');
      
      await copyTrpcAppComponent(templatePath, projectPath, templateData);
      
      // Check that App.tsx was replaced with native-specific content
      const appPath = path.join(projectPath, 'src', 'App.tsx');
      const content = await fs.readFile(appPath, 'utf8');
      expect(content).toContain('trpc.Provider');
      expect(content).toContain('Test Native App');
      expect(content).not.toContain('{{appName}}');
    });
  });

  describe('removeTrpcDependencies', () => {
    test('should remove tRPC dependencies from package.json', async () => {
      const projectPath = path.join(TEST_TEMP_DIR, 'project');
      await createMockProject(projectPath);
      
      await removeTrpcDependencies(projectPath);
      
      const packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));
      
      // tRPC dependencies should be removed
      expect(packageJson.dependencies['@tanstack/react-query']).toBeUndefined();
      expect(packageJson.dependencies['@trpc/client']).toBeUndefined();
      expect(packageJson.dependencies['@trpc/react-query']).toBeUndefined();
      expect(packageJson.dependencies['@trpc/server']).toBeUndefined();
      
      // Other dependencies should remain
      expect(packageJson.dependencies['react']).toBeDefined();
      expect(packageJson.dependencies['other-dependency']).toBeDefined();
    });

    test('should handle missing package.json gracefully', async () => {
      const projectPath = path.join(TEST_TEMP_DIR, 'empty-project');
      await fs.ensureDir(projectPath);
      
      // Should not throw
      await expect(removeTrpcDependencies(projectPath)).resolves.not.toThrow();
    });

    test('should handle package.json without dependencies', async () => {
      const projectPath = path.join(TEST_TEMP_DIR, 'project');
      await fs.ensureDir(projectPath);
      
      const packageJson = {
        name: 'test-project',
        version: '1.0.0',
        // No dependencies field
      };
      
      await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson);
      
      // Should not throw
      await expect(removeTrpcDependencies(projectPath)).resolves.not.toThrow();
    });
  });

  describe('Integration scenarios', () => {
    test('should handle full tRPC setup flow for web project', async () => {
      const templatePath = path.join(TEST_TEMP_DIR, 'template');
      const projectPath = path.join(TEST_TEMP_DIR, 'project');
      
      await createMockTemplate(templatePath, 'web');
      await createMockProject(projectPath);
      
      const templateData = getTemplateData('my-web-app', 'My awesome web app');
      
      // Simulate the full tRPC setup flow
      await copyTrpcFiles(templatePath, projectPath, templateData);
      await copyTrpcAppComponent(templatePath, projectPath, templateData);
      
      // Verify everything is set up correctly
      const trpcUtilsPath = path.join(projectPath, 'src', 'utils', 'trpc.ts');
      expect(await fs.pathExists(trpcUtilsPath)).toBe(true);
      
      const appPath = path.join(projectPath, 'src', 'App.tsx');
      const appContent = await fs.readFile(appPath, 'utf8');
      expect(appContent).toContain('trpc.Provider');
      expect(appContent).toContain('my-web-app');
      
      const packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));
      expect(packageJson.dependencies['@trpc/client']).toBeDefined();
    });

    test('should handle full tRPC removal flow', async () => {
      const projectPath = path.join(TEST_TEMP_DIR, 'project');
      await createMockProject(projectPath);
      
      // Verify tRPC dependencies exist initially
      let packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));
      expect(packageJson.dependencies['@trpc/client']).toBeDefined();
      
      // Remove tRPC dependencies
      await removeTrpcDependencies(projectPath);
      
      // Verify they're gone
      packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));
      expect(packageJson.dependencies['@trpc/client']).toBeUndefined();
      expect(packageJson.dependencies['@tanstack/react-query']).toBeUndefined();
    });
  });
}); 