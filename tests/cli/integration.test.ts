import fs from 'fs-extra';
import path from 'path';
import { tmpdir } from 'os';
import { spawn } from 'child_process';

// Test utilities
const TEST_TEMP_DIR = path.join(tmpdir(), 'idealyst-integration-tests');
const CLI_PATH = path.resolve(__dirname, '../../packages/cli/dist/index.js');

async function cleanupTestDir(): Promise<void> {
  if (await fs.pathExists(TEST_TEMP_DIR)) {
    await fs.remove(TEST_TEMP_DIR);
  }
}

function runCLI(args: string[], cwd: string = TEST_TEMP_DIR): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    const child = spawn('node', [CLI_PATH, ...args], {
      cwd,
      stdio: 'pipe',
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (exitCode) => {
      resolve({ stdout, stderr, exitCode: exitCode || 0 });
    });
  });
}

describe('CLI Integration Tests', () => {
  beforeEach(async () => {
    await cleanupTestDir();
    await fs.ensureDir(TEST_TEMP_DIR);
  });

  afterAll(async () => {
    await cleanupTestDir();
  });

  describe('init command', () => {
    test('should create workspace with init command', async () => {
      const { stdout, stderr, exitCode } = await runCLI([
        'init', 'test-workspace',
        '--skip-install'
      ]);

      expect(exitCode).toBe(0);
      expect(stderr).toBe('');
      expect(stdout).toContain('Successfully initialized Idealyst workspace');

      // Verify workspace structure
      const workspacePath = path.join(TEST_TEMP_DIR, 'test-workspace');
      expect(await fs.pathExists(workspacePath)).toBe(true);
      expect(await fs.pathExists(path.join(workspacePath, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(workspacePath, '.yarnrc.yml'))).toBe(true);

      const packageJson = await fs.readJSON(path.join(workspacePath, 'package.json'));
      expect(packageJson.name).toBe('test-workspace');
      expect(packageJson.private).toBe(true);
    }, 60000);

    test('should show helpful next steps after init', async () => {
      const { stdout } = await runCLI([
        'init', 'test-workspace-next-steps',
        '--skip-install'
      ]);

      expect(stdout).toContain('Next steps:');
      expect(stdout).toContain('cd test-workspace-next-steps');
      expect(stdout).toContain('idealyst create');
    });
  });

  describe('create command', () => {
    test('should create native project with create command', async () => {
      const { stdout, stderr, exitCode } = await runCLI([
        'create', 'test-native',
        '--type', 'native',
        '--app-name', 'Test Native App',
        '--skip-install'
      ]);

      expect(exitCode).toBe(0);
      expect(stderr).toBe('');
      expect(stdout).toContain('Successfully created test-native');

      // Verify native project structure
      const projectPath = path.join(TEST_TEMP_DIR, 'test-native');
      expect(await fs.pathExists(projectPath)).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'app.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'App.tsx'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'metro.config.js'))).toBe(true);

      const appJson = await fs.readJSON(path.join(projectPath, 'app.json'));
      expect(appJson.name).toBe('Test Native App');
      expect(appJson.displayName).toBe('Test Native App');
    }, 60000);

    test('should create web project with create command', async () => {
      const { stdout, stderr, exitCode } = await runCLI([
        'create', 'test-web',
        '--type', 'web',
        '--skip-install'
      ]);

      expect(exitCode).toBe(0);
      expect(stderr).toBe('');
      expect(stdout).toContain('Successfully created test-web');

      // Verify web project structure
      const projectPath = path.join(TEST_TEMP_DIR, 'test-web');
      expect(await fs.pathExists(projectPath)).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'index.html'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'vite.config.ts'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'src', 'App.tsx'))).toBe(true);
    }, 60000);

    test('should create shared library with create command', async () => {
      const { stdout, stderr, exitCode } = await runCLI([
        'create', 'test-shared',
        '--type', 'shared',
        '--skip-install'
      ]);

      expect(exitCode).toBe(0);
      expect(stderr).toBe('');
      expect(stdout).toContain('Successfully created test-shared');

      // Verify shared library structure
      const projectPath = path.join(TEST_TEMP_DIR, 'test-shared');
      expect(await fs.pathExists(projectPath)).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'tsconfig.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'src', 'index.ts'))).toBe(true);
    }, 60000);
  });

  describe('error handling', () => {
    test('should show error for invalid project type', async () => {
      const { stdout, stderr, exitCode } = await runCLI([
        'create', 'test-invalid',
        '--type', 'invalid'
      ]);

      expect(exitCode).toBe(1);
      expect(stderr).toContain('Invalid project type: invalid');
    });

    test('should show error for invalid project name', async () => {
      const { stdout, stderr, exitCode } = await runCLI([
        'create', 'Invalid Project Name',
        '--type', 'web'
      ]);

      expect(exitCode).toBe(1);
      expect(stderr).toContain('Invalid project name');
    });

    test('should show help when no arguments provided', async () => {
      const { stdout } = await runCLI(['--help']);

      expect(stdout).toContain('CLI tool for generating Idealyst Framework projects');
      expect(stdout).toContain('create');
      expect(stdout).toContain('init');
    });
  });

  describe('workspace integration', () => {
    test('should add projects to existing workspace', async () => {
      // First create a workspace
      await runCLI(['init', 'test-workspace', '--skip-install']);
      
      const workspacePath = path.join(TEST_TEMP_DIR, 'test-workspace');
      
      // Then create projects within the workspace
      await runCLI([
        'create', 'mobile-app',
        '--type', 'native',
        '--skip-install'
      ], workspacePath);
      
      await runCLI([
        'create', 'web-app',
        '--type', 'web',
        '--skip-install'
      ], workspacePath);

      // Verify projects were created in workspace
      expect(await fs.pathExists(path.join(workspacePath, 'mobile-app'))).toBe(true);
      expect(await fs.pathExists(path.join(workspacePath, 'web-app'))).toBe(true);

      // Verify workspace package.json was updated
      const packageJson = await fs.readJSON(path.join(workspacePath, 'package.json'));
      expect(packageJson.workspaces).toContain('mobile-app');
      expect(packageJson.workspaces).toContain('web-app');
    }, 90000);
  });

  describe('custom directory', () => {
    test('should create project in custom directory', async () => {
      const customDir = path.join(TEST_TEMP_DIR, 'custom');
      await fs.ensureDir(customDir);

      const { exitCode } = await runCLI([
        'create', 'custom-project',
        '--type', 'web',
        '--directory', customDir,
        '--skip-install'
      ]);

      expect(exitCode).toBe(0);
      expect(await fs.pathExists(path.join(customDir, 'custom-project'))).toBe(true);
    }, 60000);
  });

  describe('version and help', () => {
    test('should show version', async () => {
      const { stdout, exitCode } = await runCLI(['--version']);

      expect(exitCode).toBe(0);
      expect(stdout).toMatch(/\d+\.\d+\.\d+/); // Should match version pattern
    });

    test('should show help for create command', async () => {
      const { stdout } = await runCLI(['create', '--help']);

      expect(stdout).toContain('Create a new Idealyst project');
      expect(stdout).toContain('--type');
      expect(stdout).toContain('--directory');
      expect(stdout).toContain('--app-name');
    });

    test('should show help for init command', async () => {
      const { stdout } = await runCLI(['init', '--help']);

      expect(stdout).toContain('Initialize a new Idealyst monorepo workspace');
      expect(stdout).toContain('--directory');
      expect(stdout).toContain('--skip-install');
    });

    test('should show help for create command including tRPC flag', async () => {
      const { stdout } = await runCLI(['create', '--help']);

      expect(stdout).toContain('--with-trpc');
      expect(stdout).toContain('Include tRPC boilerplate and setup');
    });
  });

  describe('tRPC CLI Integration', () => {
    beforeEach(async () => {
      // Create a workspace first for project creation
      await runCLI(['init', 'test-workspace', '--skip-install'], TEST_TEMP_DIR);
    });

    test('should create web project with tRPC using --with-trpc flag', async () => {
      const workspaceDir = path.join(TEST_TEMP_DIR, 'test-workspace');
      const { stdout, stderr, exitCode } = await runCLI([
        'create', 'web-trpc-test', 
        '--type', 'web',
        '--with-trpc',
        '--skip-install'
      ], workspaceDir);

      expect(exitCode).toBe(0);
      expect(stderr).toBe('');
      expect(stdout).toContain('React Web project created successfully');
      expect(stdout).toContain('tRPC client setup and utilities');
      expect(stdout).toContain('React Query integration');
      expect(stdout).toContain('Pre-configured tRPC provider');

      // Verify the generated files
      const projectPath = path.join(workspaceDir, 'packages', 'web-trpc-test');
      expect(await fs.pathExists(path.join(projectPath, 'src', 'utils', 'trpc.ts'))).toBe(true);
      
      // Check package.json for tRPC dependencies
      const packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));
      expect(packageJson.dependencies['@trpc/client']).toBeDefined();
      expect(packageJson.dependencies['@tanstack/react-query']).toBeDefined();
    });

    test('should create native project with tRPC using --with-trpc flag', async () => {
      const workspaceDir = path.join(TEST_TEMP_DIR, 'test-workspace');
      const { stdout, stderr, exitCode } = await runCLI([
        'create', 'native-trpc-test',
        '--type', 'native',
        '--with-trpc',
        '--app-name', 'Test tRPC App',
        '--skip-install'
      ], workspaceDir);

      expect(exitCode).toBe(0);
      expect(stderr).toBe('');
      expect(stdout).toContain('React Native project created successfully');
      expect(stdout).toContain('tRPC client setup and utilities');

      // Verify the generated files
      const projectPath = path.join(workspaceDir, 'packages', 'native-trpc-test');
      expect(await fs.pathExists(path.join(projectPath, 'src', 'utils', 'trpc.ts'))).toBe(true);
      
      // Check App.tsx has tRPC setup
      const appContent = await fs.readFile(path.join(projectPath, 'src', 'App.tsx'), 'utf8');
      expect(appContent).toContain('trpc.Provider');
      expect(appContent).toContain('Test tRPC App');
    });

    test('should create web project without tRPC when flag is not provided', async () => {
      const workspaceDir = path.join(TEST_TEMP_DIR, 'test-workspace');
      
      // Mock "No" response to the tRPC prompt
      function runCLIWithInput(args: string[], cwd: string, input: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
        return new Promise((resolve) => {
          const child = spawn('node', [CLI_PATH, ...args], {
            cwd,
            stdio: 'pipe',
          });

          let stdout = '';
          let stderr = '';

          child.stdout?.on('data', (data) => {
            stdout += data.toString();
          });

          child.stderr?.on('data', (data) => {
            stderr += data.toString();
          });

          // Send input to stdin
          child.stdin?.write(input);
          child.stdin?.end();

          child.on('close', (exitCode) => {
            resolve({ stdout, stderr, exitCode: exitCode || 0 });
          });
        });
      }

      const { stdout, stderr, exitCode } = await runCLIWithInput([
        'create', 'web-no-trpc-test',
        '--type', 'web',
        '--skip-install'
      ], workspaceDir, 'n\n'); // Send "n" for No to tRPC prompt

      expect(exitCode).toBe(0);
      expect(stdout).toContain('React Web project created successfully');
      expect(stdout).not.toContain('tRPC client setup and utilities');

      // Verify no tRPC dependencies
      const projectPath = path.join(workspaceDir, 'packages', 'web-no-trpc-test');
      const packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));
      expect(packageJson.dependencies['@trpc/client']).toBeUndefined();
      expect(packageJson.dependencies['@tanstack/react-query']).toBeUndefined();
    });

    test('should create API project with proper exports structure', async () => {
      const workspaceDir = path.join(TEST_TEMP_DIR, 'test-workspace');
      const { stdout, stderr, exitCode } = await runCLI([
        'create', 'api-test',
        '--type', 'api',
        '--skip-install'
      ], workspaceDir);

      expect(exitCode).toBe(0);
      expect(stderr).toBe('');
      expect(stdout).toContain('API project created successfully');
      expect(stdout).toContain('tRPC for type-safe APIs');
      expect(stdout).toContain('Prisma for database management');
      expect(stdout).toContain('Clean template ready for your models');

      // Verify API structure for client imports
      const projectPath = path.join(workspaceDir, 'packages', 'api-test');
      
      // Check exports file
      const indexPath = path.join(projectPath, 'src', 'index.ts');
      const indexContent = await fs.readFile(indexPath, 'utf8');
      expect(indexContent).toContain('export { appRouter }');
      expect(indexContent).toContain('export type { AppRouter }');
      
      // Check server file
      const serverPath = path.join(projectPath, 'src', 'server.ts');
      expect(await fs.pathExists(serverPath)).toBe(true);
      
      // Check router with proper type export
      const routerPath = path.join(projectPath, 'src', 'router', 'index.ts');
      const routerContent = await fs.readFile(routerPath, 'utf8');
      expect(routerContent).toContain('export type AppRouter = typeof appRouter');
    });

    test('should handle invalid project type with meaningful error', async () => {
      const workspaceDir = path.join(TEST_TEMP_DIR, 'test-workspace');
      const { stderr, exitCode } = await runCLI([
        'create', 'invalid-test',
        '--type', 'invalid-type',
        '--skip-install'
      ], workspaceDir);

      expect(exitCode).toBe(1);
      expect(stderr).toContain('Invalid project type: invalid-type');
      expect(stderr).toContain('Valid types are: native, web, shared, api');
    });

    test('should create workspace and then projects in sequence', async () => {
      // Test the full workflow: workspace -> API -> client with tRPC
      const workspaceName = 'full-stack-test';
      
      // 1. Create workspace
      const { exitCode: workspaceExitCode } = await runCLI([
        'init', workspaceName, '--skip-install'
      ], TEST_TEMP_DIR);
      expect(workspaceExitCode).toBe(0);

      const workspaceDir = path.join(TEST_TEMP_DIR, workspaceName);

      // 2. Create API project
      const { exitCode: apiExitCode } = await runCLI([
        'create', 'my-api',
        '--type', 'api',
        '--skip-install'
      ], workspaceDir);
      expect(apiExitCode).toBe(0);

      // 3. Create web client with tRPC
      const { exitCode: webExitCode } = await runCLI([
        'create', 'my-web',
        '--type', 'web',
        '--with-trpc',
        '--skip-install'
      ], workspaceDir);
      expect(webExitCode).toBe(0);

      // 4. Verify the setup is ready for connection
      const apiPath = path.join(workspaceDir, 'packages', 'my-api');
      const webPath = path.join(workspaceDir, 'packages', 'my-web');
      
      // API should have proper exports
      const apiIndexContent = await fs.readFile(path.join(apiPath, 'src', 'index.ts'), 'utf8');
      expect(apiIndexContent).toContain('export type { AppRouter }');
      
      // Web should have tRPC utils ready for connection
      const trpcUtilsContent = await fs.readFile(path.join(webPath, 'src', 'utils', 'trpc.ts'), 'utf8');
      expect(trpcUtilsContent).toContain('AppRouter');
      expect(trpcUtilsContent).toContain('http://localhost:3000/trpc');
      
      // Web App should have working tRPC example
      const appContent = await fs.readFile(path.join(webPath, 'src', 'App.tsx'), 'utf8');
      expect(appContent).toContain('trpc.hello.useQuery');
    });
  });
}); 