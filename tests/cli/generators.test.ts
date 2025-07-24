import fs from 'fs-extra';
import path from 'path';
import { tmpdir } from 'os';
import { generateProject } from '../../packages/cli/src/generators';
import { ProjectType, GenerateProjectOptions } from '../../packages/cli/src/types';

// Test utilities
const TEST_TEMP_DIR = path.join(tmpdir(), 'idealyst-cli-tests');

async function cleanupTestDir(testDir?: string): Promise<void> {
  const dirToClean = testDir || TEST_TEMP_DIR;
  if (await fs.pathExists(dirToClean)) {
    await fs.remove(dirToClean);
  }
}

async function createTestDir(): Promise<string> {
  await cleanupTestDir();
  await fs.ensureDir(TEST_TEMP_DIR);
  return TEST_TEMP_DIR;
}

describe('CLI Generators', () => {
  beforeEach(async () => {
    await createTestDir();
  });

  afterAll(async () => {
    await cleanupTestDir();
  });

  describe('Workspace Generation', () => {
    test('should generate a valid workspace structure', async () => {
      const options: GenerateProjectOptions = {
        name: 'test-workspace',
        type: 'workspace',
        directory: TEST_TEMP_DIR,
        skipInstall: true,
      };

      await generateProject(options);

      const workspacePath = path.join(TEST_TEMP_DIR, 'test-workspace');
      
      // Check if workspace directory exists
      expect(await fs.pathExists(workspacePath)).toBe(true);
      
      // Check for essential workspace files
      const packageJsonPath = path.join(workspacePath, 'package.json');
      expect(await fs.pathExists(packageJsonPath)).toBe(true);
      
      const readmePath = path.join(workspacePath, 'README.md');
      expect(await fs.pathExists(readmePath)).toBe(true);
      
      const yarnrcPath = path.join(workspacePath, '.yarnrc.yml');
      expect(await fs.pathExists(yarnrcPath)).toBe(true);

      // Verify package.json content
      const packageJson = await fs.readJSON(packageJsonPath);
      expect(packageJson.name).toBe('test-workspace');
      expect(packageJson.private).toBe(true);
      expect(packageJson.workspaces).toBeDefined();
      expect(Array.isArray(packageJson.workspaces)).toBe(true);
    });

    test('should create workspace with correct yarn configuration', async () => {
      const options: GenerateProjectOptions = {
        name: 'test-workspace-yarn',
        type: 'workspace',
        directory: TEST_TEMP_DIR,
        skipInstall: true,
      };

      await generateProject(options);

      const workspacePath = path.join(TEST_TEMP_DIR, 'test-workspace-yarn');
      const yarnrcPath = path.join(workspacePath, '.yarnrc.yml');
      
      expect(await fs.pathExists(yarnrcPath)).toBe(true);
      
      const yarnrcContent = await fs.readFile(yarnrcPath, 'utf8');
      expect(yarnrcContent).toContain('nodeLinker');
    });
  });

  describe('Native Project Generation', () => {
    test('should generate a valid React Native project', async () => {
      const options: GenerateProjectOptions = {
        name: 'test-native-app',
        type: 'native',
        directory: TEST_TEMP_DIR,
        skipInstall: true,
        appName: 'Test Native App',
      };

      await generateProject(options);

      const projectPath = path.join(TEST_TEMP_DIR, 'test-native-app');
      
      // Check if project directory exists
      expect(await fs.pathExists(projectPath)).toBe(true);
      
      // Check for essential React Native files
      const packageJsonPath = path.join(projectPath, 'package.json');
      expect(await fs.pathExists(packageJsonPath)).toBe(true);
      
      const appJsonPath = path.join(projectPath, 'app.json');
      expect(await fs.pathExists(appJsonPath)).toBe(true);
      
      const indexPath = path.join(projectPath, 'index.js');
      expect(await fs.pathExists(indexPath)).toBe(true);
      
      const appTsxPath = path.join(projectPath, 'App.tsx');
      expect(await fs.pathExists(appTsxPath)).toBe(true);
      
      const metroConfigPath = path.join(projectPath, 'metro.config.js');
      expect(await fs.pathExists(metroConfigPath)).toBe(true);
      
      const babelConfigPath = path.join(projectPath, 'babel.config.js');
      expect(await fs.pathExists(babelConfigPath)).toBe(true);

      // Verify package.json content
      const packageJson = await fs.readJSON(packageJsonPath);
      expect(packageJson.name).toBe('test-native-app');
      expect(packageJson.dependencies).toBeDefined();
      expect(packageJson.dependencies['react']).toBeDefined();
      expect(packageJson.dependencies['react-native']).toBeDefined();

      // Verify app.json content
      const appJson = await fs.readJSON(appJsonPath);
      expect(appJson.name).toBe('Test Native App');
      expect(appJson.displayName).toBe('Test Native App');
    });

    test('should generate native project with default app name when not provided', async () => {
      const options: GenerateProjectOptions = {
        name: 'test-native-default',
        type: 'native',
        directory: TEST_TEMP_DIR,
        skipInstall: true,
      };

      await generateProject(options);

      const projectPath = path.join(TEST_TEMP_DIR, 'test-native-default');
      const appJsonPath = path.join(projectPath, 'app.json');
      
      const appJson = await fs.readJSON(appJsonPath);
      expect(appJson.name).toBeTruthy();
      expect(appJson.displayName).toBeTruthy();
    });
  });

  describe('Web Project Generation', () => {
    test('should generate a valid React web project', async () => {
      const options: GenerateProjectOptions = {
        name: 'test-web-app',
        type: 'web',
        directory: TEST_TEMP_DIR,
        skipInstall: true,
      };

      await generateProject(options);

      const projectPath = path.join(TEST_TEMP_DIR, 'test-web-app');
      
      // Check if project directory exists
      expect(await fs.pathExists(projectPath)).toBe(true);
      
      // Check for essential React web files
      const packageJsonPath = path.join(projectPath, 'package.json');
      expect(await fs.pathExists(packageJsonPath)).toBe(true);
      
      const indexHtmlPath = path.join(projectPath, 'index.html');
      expect(await fs.pathExists(indexHtmlPath)).toBe(true);
      
      const viteConfigPath = path.join(projectPath, 'vite.config.ts');
      expect(await fs.pathExists(viteConfigPath)).toBe(true);
      
      const srcPath = path.join(projectPath, 'src');
      expect(await fs.pathExists(srcPath)).toBe(true);
      
      const mainTsxPath = path.join(srcPath, 'main.tsx');
      expect(await fs.pathExists(mainTsxPath)).toBe(true);
      
      const appTsxPath = path.join(srcPath, 'App.tsx');
      expect(await fs.pathExists(appTsxPath)).toBe(true);

      // Verify package.json content
      const packageJson = await fs.readJSON(packageJsonPath);
      expect(packageJson.name).toBe('test-web-app');
      expect(packageJson.dependencies).toBeDefined();
      expect(packageJson.dependencies['react']).toBeDefined();
      expect(packageJson.dependencies['react-dom']).toBeDefined();
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts['dev']).toBeDefined();
      expect(packageJson.scripts['build']).toBeDefined();
    });

    test('should generate web project with Vite configuration', async () => {
      const options: GenerateProjectOptions = {
        name: 'test-web-vite',
        type: 'web',
        directory: TEST_TEMP_DIR,
        skipInstall: true,
      };

      await generateProject(options);

      const projectPath = path.join(TEST_TEMP_DIR, 'test-web-vite');
      const viteConfigPath = path.join(projectPath, 'vite.config.ts');
      
      expect(await fs.pathExists(viteConfigPath)).toBe(true);
      
      const viteConfigContent = await fs.readFile(viteConfigPath, 'utf8');
      expect(viteConfigContent).toContain('defineConfig');
      expect(viteConfigContent).toContain('@vitejs/plugin-react');
    });
  });

  describe('Shared Library Generation', () => {
    test('should generate a valid shared library project', async () => {
      const options: GenerateProjectOptions = {
        name: 'test-shared-lib',
        type: 'shared',
        directory: TEST_TEMP_DIR,
        skipInstall: true,
      };

      await generateProject(options);

      const projectPath = path.join(TEST_TEMP_DIR, 'test-shared-lib');
      
      // Check if project directory exists
      expect(await fs.pathExists(projectPath)).toBe(true);
      
      // Check for essential shared library files
      const packageJsonPath = path.join(projectPath, 'package.json');
      expect(await fs.pathExists(packageJsonPath)).toBe(true);
      
      const readmePath = path.join(projectPath, 'README.md');
      expect(await fs.pathExists(readmePath)).toBe(true);
      
      const srcPath = path.join(projectPath, 'src');
      expect(await fs.pathExists(srcPath)).toBe(true);
      
      const indexPath = path.join(srcPath, 'index.ts');
      expect(await fs.pathExists(indexPath)).toBe(true);
      
      const tsconfigPath = path.join(projectPath, 'tsconfig.json');
      expect(await fs.pathExists(tsconfigPath)).toBe(true);

      // Verify package.json content
      const packageJson = await fs.readJSON(packageJsonPath);
      expect(packageJson.name).toBe('test-shared-lib');
      expect(packageJson.main).toBeDefined();
      expect(packageJson.types).toBeDefined();
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts['build']).toBeDefined();
    });

    test('should generate shared library with TypeScript configuration', async () => {
      const options: GenerateProjectOptions = {
        name: 'test-shared-typescript',
        type: 'shared',
        directory: TEST_TEMP_DIR,
        skipInstall: true,
      };

      await generateProject(options);

      const projectPath = path.join(TEST_TEMP_DIR, 'test-shared-typescript');
      const tsconfigPath = path.join(projectPath, 'tsconfig.json');
      
      expect(await fs.pathExists(tsconfigPath)).toBe(true);
      
      const tsconfig = await fs.readJSON(tsconfigPath);
      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.declaration).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should throw error for invalid project type', async () => {
      const options = {
        name: 'test-invalid',
        type: 'invalid' as ProjectType,
        directory: TEST_TEMP_DIR,
        skipInstall: true,
      };

      await expect(generateProject(options)).rejects.toThrow('Unknown project type: invalid');
    });

    test('should handle invalid directory paths gracefully', async () => {
      const options: GenerateProjectOptions = {
        name: 'test-invalid-dir',
        type: 'web',
        directory: '/invalid/nonexistent/path',
        skipInstall: true,
      };

      // This should either succeed by creating the directory or fail gracefully
      try {
        await generateProject(options);
        // If it succeeds, verify the directory was created
        expect(await fs.pathExists('/invalid/nonexistent/path/test-invalid-dir')).toBe(true);
      } catch (error) {
        // If it fails, it should be a meaningful error
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('tRPC Integration', () => {
    describe('Web Projects with tRPC', () => {
      test('should generate web project with tRPC when flag is enabled', async () => {
        const options: GenerateProjectOptions = {
          name: 'test-web-trpc',
          type: 'web',
          directory: TEST_TEMP_DIR,
          skipInstall: true,
          withTrpc: true,
        };

        await generateProject(options);

        const projectPath = path.join(TEST_TEMP_DIR, 'test-web-trpc');
        
        // Check if project directory exists
        expect(await fs.pathExists(projectPath)).toBe(true);
        
        // Check for tRPC utilities
        const trpcUtilsPath = path.join(projectPath, 'src', 'utils', 'trpc.ts');
        expect(await fs.pathExists(trpcUtilsPath)).toBe(true);
        
        // Verify tRPC utils content
        const trpcUtils = await fs.readFile(trpcUtilsPath, 'utf8');
        expect(trpcUtils).toContain('createTRPCReact');
        expect(trpcUtils).toContain('httpBatchLink');
        expect(trpcUtils).toContain('AppRouter');
        
        // Check App component is tRPC-enabled
        const appPath = path.join(projectPath, 'src', 'App.tsx');
        const appContent = await fs.readFile(appPath, 'utf8');
        expect(appContent).toContain('trpc.Provider');
        expect(appContent).toContain('QueryClientProvider');
        expect(appContent).toContain('trpc.hello.useQuery');
        
        // Verify tRPC dependencies in package.json
        const packageJsonPath = path.join(projectPath, 'package.json');
        const packageJson = await fs.readJSON(packageJsonPath);
        expect(packageJson.dependencies['@tanstack/react-query']).toBeDefined();
        expect(packageJson.dependencies['@trpc/client']).toBeDefined();
        expect(packageJson.dependencies['@trpc/react-query']).toBeDefined();
        expect(packageJson.dependencies['@trpc/server']).toBeDefined();
      });

      test('should generate web project without tRPC when flag is disabled', async () => {
        const options: GenerateProjectOptions = {
          name: 'test-web-no-trpc',
          type: 'web',
          directory: TEST_TEMP_DIR,
          skipInstall: true,
          withTrpc: false,
        };

        await generateProject(options);

        const projectPath = path.join(TEST_TEMP_DIR, 'test-web-no-trpc');
        
        // Check App component is NOT tRPC-enabled
        const appPath = path.join(projectPath, 'src', 'App.tsx');
        const appContent = await fs.readFile(appPath, 'utf8');
        expect(appContent).not.toContain('trpc.Provider');
        expect(appContent).not.toContain('@tanstack/react-query');
        expect(appContent).not.toContain('trpc.hello.useQuery');
        
        // Verify tRPC dependencies are NOT in package.json
        const packageJsonPath = path.join(projectPath, 'package.json');
        const packageJson = await fs.readJSON(packageJsonPath);
        expect(packageJson.dependencies['@tanstack/react-query']).toBeUndefined();
        expect(packageJson.dependencies['@trpc/client']).toBeUndefined();
        expect(packageJson.dependencies['@trpc/react-query']).toBeUndefined();
        expect(packageJson.dependencies['@trpc/server']).toBeUndefined();
      });

      test('should generate web project without tRPC when flag is not provided', async () => {
        const options: GenerateProjectOptions = {
          name: 'test-web-default',
          type: 'web',
          directory: TEST_TEMP_DIR,
          skipInstall: true,
          // withTrpc not provided - should default to false
        };

        await generateProject(options);

        const projectPath = path.join(TEST_TEMP_DIR, 'test-web-default');
        
        // Verify tRPC dependencies are NOT in package.json
        const packageJsonPath = path.join(projectPath, 'package.json');
        const packageJson = await fs.readJSON(packageJsonPath);
        expect(packageJson.dependencies['@tanstack/react-query']).toBeUndefined();
        expect(packageJson.dependencies['@trpc/client']).toBeUndefined();
      });
    });

    describe('Native Projects with tRPC', () => {
      test('should generate native project with tRPC when flag is enabled', async () => {
        const options: GenerateProjectOptions = {
          name: 'test-native-trpc',
          type: 'native',
          directory: TEST_TEMP_DIR,
          skipInstall: true,
          withTrpc: true,
          appName: 'Test Native tRPC App',
        };

        await generateProject(options);

        const projectPath = path.join(TEST_TEMP_DIR, 'test-native-trpc');
        
        // Check for tRPC utilities
        const trpcUtilsPath = path.join(projectPath, 'src', 'utils', 'trpc.ts');
        expect(await fs.pathExists(trpcUtilsPath)).toBe(true);
        
        // Verify tRPC utils content has React Native specific comments
        const trpcUtils = await fs.readFile(trpcUtilsPath, 'utf8');
        expect(trpcUtils).toContain('React Native');
        expect(trpcUtils).toContain('device testing');
        expect(trpcUtils).toContain('192.168.1.xxx');
        
        // Check App component is tRPC-enabled
        const appPath = path.join(projectPath, 'src', 'App.tsx');
        const appContent = await fs.readFile(appPath, 'utf8');
        expect(appContent).toContain('trpc.Provider');
        expect(appContent).toContain('QueryClientProvider');
        expect(appContent).toContain('trpc.hello.useQuery');
        expect(appContent).toContain('Test Native tRPC App'); // App name templating
      });

      test('should generate native project without tRPC when flag is disabled', async () => {
        const options: GenerateProjectOptions = {
          name: 'test-native-no-trpc',
          type: 'native',
          directory: TEST_TEMP_DIR,
          skipInstall: true,
          withTrpc: false,
          appName: 'Test Native App',
        };

        await generateProject(options);

        const projectPath = path.join(TEST_TEMP_DIR, 'test-native-no-trpc');
        
        // Check App component is NOT tRPC-enabled
        const appPath = path.join(projectPath, 'src', 'App.tsx');
        const appContent = await fs.readFile(appPath, 'utf8');
        expect(appContent).not.toContain('trpc.Provider');
        expect(appContent).not.toContain('@tanstack/react-query');
      });
    });

    describe('API Project Generation', () => {
      test('should generate API project with proper exports', async () => {
        const options: GenerateProjectOptions = {
          name: 'test-api-project',
          type: 'api',
          directory: TEST_TEMP_DIR,
          skipInstall: true,
        };

        await generateProject(options);

        const projectPath = path.join(TEST_TEMP_DIR, 'test-api-project');
        
        // Check for API exports file
        const indexPath = path.join(projectPath, 'src', 'index.ts');
        expect(await fs.pathExists(indexPath)).toBe(true);
        
        // Verify exports for client usage
        const indexContent = await fs.readFile(indexPath, 'utf8');
        expect(indexContent).toContain('export { appRouter }');
        expect(indexContent).toContain('export type { AppRouter }');
        expect(indexContent).toContain('export type { Context }');
        
        // Check for server file
        const serverPath = path.join(projectPath, 'src', 'server.ts');
        expect(await fs.pathExists(serverPath)).toBe(true);
        
        // Verify server content
        const serverContent = await fs.readFile(serverPath, 'utf8');
        expect(serverContent).toContain('express');
        expect(serverContent).toContain('createExpressMiddleware');
        expect(serverContent).toContain('appRouter');
        
        // Check router content
        const routerPath = path.join(projectPath, 'src', 'router', 'index.ts');
        const routerContent = await fs.readFile(routerPath, 'utf8');
        expect(routerContent).toContain('export type AppRouter = typeof appRouter');
        
        // Verify package.json has correct scripts
        const packageJsonPath = path.join(projectPath, 'package.json');
        const packageJson = await fs.readJSON(packageJsonPath);
        expect(packageJson.scripts.dev).toBe('tsx watch src/server.ts');
        expect(packageJson.scripts.start).toBe('node dist/server.js');
      });
    });

    describe('Shared Projects (should not have tRPC options)', () => {
      test('should generate shared project ignoring tRPC flag', async () => {
        const options: GenerateProjectOptions = {
          name: 'test-shared-trpc',
          type: 'shared',
          directory: TEST_TEMP_DIR,
          skipInstall: true,
          withTrpc: true, // Should be ignored for shared projects
        };

        await generateProject(options);

        const projectPath = path.join(TEST_TEMP_DIR, 'test-shared-trpc');
        
        // Check if project directory exists
        expect(await fs.pathExists(projectPath)).toBe(true);
        
        // Shared projects shouldn't have tRPC utilities
        const trpcUtilsPath = path.join(projectPath, 'src', 'utils', 'trpc.ts');
        expect(await fs.pathExists(trpcUtilsPath)).toBe(false);
      });
    });
  });
}); 