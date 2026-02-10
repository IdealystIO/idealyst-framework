/**
 * Integration tests for CLI template generation
 * Tests all template variations to ensure correct structure and dependencies
 *
 * These tests generate projects using the CLI and verify the output structure
 */

import fs from 'fs-extra';
import path from 'path';
import { execSync, spawnSync } from 'child_process';

const TEST_DIR = '/tmp/idealyst-cli-tests';
const CLI_PATH = path.join(__dirname, '..', 'dist', 'index.js');
const TIMEOUT = 180000; // 3 minutes for generation + install

/**
 * Template configurations to test
 */
// Common flags for all tests
const COMMON_FLAGS = '--org-domain com.test --skip-install --no-interactive';

const TEST_CONFIGURATIONS = [
  {
    name: 'trpc-no-db',
    description: 'tRPC without database',
    flags: `--with-api --with-trpc ${COMMON_FLAGS}`,
    hasApi: true,
    hasTrpc: true,
    hasGraphql: false,
    hasPrisma: false,
    isBlank: false,
  },
  {
    name: 'trpc-with-db',
    description: 'tRPC with database',
    flags: `--with-api --with-trpc --with-prisma ${COMMON_FLAGS}`,
    hasApi: true,
    hasTrpc: true,
    hasGraphql: false,
    hasPrisma: true,
    isBlank: false,
  },
  {
    name: 'no-api',
    description: 'No API at all',
    flags: COMMON_FLAGS,
    hasApi: false,
    hasTrpc: false,
    hasGraphql: false,
    hasPrisma: false,
    isBlank: false,
  },
  {
    name: 'graphql-no-db',
    description: 'GraphQL without database',
    flags: `--with-api --with-graphql ${COMMON_FLAGS}`,
    hasApi: true,
    hasTrpc: false,
    hasGraphql: true,
    hasPrisma: false,
    isBlank: false,
  },
  {
    name: 'graphql-with-db',
    description: 'GraphQL with database',
    flags: `--with-api --with-graphql --with-prisma ${COMMON_FLAGS}`,
    hasApi: true,
    hasTrpc: false,
    hasGraphql: true,
    hasPrisma: true,
    isBlank: false,
  },
  {
    name: 'blank-no-api',
    description: 'Blank project without API',
    flags: `--blank ${COMMON_FLAGS}`,
    hasApi: false,
    hasTrpc: false,
    hasGraphql: false,
    hasPrisma: false,
    isBlank: true,
  },
  {
    name: 'blank-with-trpc',
    description: 'Blank project with tRPC',
    flags: `--blank --with-api --with-trpc ${COMMON_FLAGS}`,
    hasApi: true,
    hasTrpc: true,
    hasGraphql: false,
    hasPrisma: false,
    isBlank: true,
  },
  {
    name: 'blank-with-graphql',
    description: 'Blank project with GraphQL',
    flags: `--blank --with-api --with-graphql ${COMMON_FLAGS}`,
    hasApi: true,
    hasTrpc: false,
    hasGraphql: true,
    hasPrisma: false,
    isBlank: true,
  },
];

/**
 * Generate a test project using the CLI
 */
function generateTestProject(config: typeof TEST_CONFIGURATIONS[0]): string {
  const projectName = `test-${config.name}`;
  const projectPath = path.join(TEST_DIR, projectName);

  // Clean up if exists
  fs.removeSync(projectPath);

  // Run CLI to generate project
  const cmd = `node ${CLI_PATH} init ${projectName} --app-name "Test App" ${config.flags}`;

  try {
    execSync(cmd, {
      cwd: TEST_DIR,
      encoding: 'utf8',
      timeout: TIMEOUT,
      stdio: 'pipe',
    });
  } catch (error: any) {
    console.error(`Failed to generate ${projectName}:`, error.message);
    if (error.stdout) console.log('stdout:', error.stdout);
    if (error.stderr) console.error('stderr:', error.stderr);
    throw error;
  }

  return projectPath;
}

describe('CLI Template Integration Tests', () => {
  beforeAll(async () => {
    // Clean up test directory
    await fs.remove(TEST_DIR);
    await fs.ensureDir(TEST_DIR);

    // Verify CLI is built
    if (!await fs.pathExists(CLI_PATH)) {
      throw new Error(`CLI not built. Run 'yarn build' first. Expected: ${CLI_PATH}`);
    }
  }, 30000);

  afterAll(async () => {
    // Optional: Keep for debugging, remove for clean CI
    // await fs.remove(TEST_DIR);
  });

  describe.each(TEST_CONFIGURATIONS)('$description ($name)', (config) => {
    let projectPath: string;

    beforeAll(() => {
      projectPath = generateTestProject(config);
    }, TIMEOUT);

    describe('Project Structure', () => {
      it('should have correct package directories', async () => {
        const packages = await fs.readdir(path.join(projectPath, 'packages'));

        // Always present
        expect(packages).toContain('shared');
        expect(packages).toContain('web');
        expect(packages).toContain('mobile');

        // API only when enabled
        if (config.hasApi) {
          expect(packages).toContain('api');
        } else {
          expect(packages).not.toContain('api');
        }

        // Database only when Prisma enabled
        if (config.hasPrisma) {
          expect(packages).toContain('database');
        } else {
          expect(packages).not.toContain('database');
        }
      });

      it('should have valid root package.json', async () => {
        const pkgPath = path.join(projectPath, 'package.json');
        expect(await fs.pathExists(pkgPath)).toBe(true);

        const pkg = await fs.readJson(pkgPath);
        // Root package.json uses scoped name format: @{projectName}/{projectName}
        const projectName = `test-${config.name}`;
        expect(pkg.name).toBe(`@${projectName}/${projectName}`);
        expect(pkg.workspaces).toBeDefined();
      });
    });

    describe('Shared Package', () => {
      it('should have correct dependencies based on configuration', async () => {
        const pkgPath = path.join(projectPath, 'packages', 'shared', 'package.json');
        const pkg = await fs.readJson(pkgPath);

        if (config.hasTrpc) {
          expect(pkg.dependencies['@trpc/client']).toBeDefined();
          expect(pkg.dependencies['@trpc/react-query']).toBeDefined();
          expect(pkg.dependencies['@tanstack/react-query']).toBeDefined();
        }

        if (config.hasGraphql) {
          expect(pkg.dependencies['@apollo/client']).toBeDefined();
          expect(pkg.dependencies['@tanstack/react-query']).toBeDefined();
          expect(pkg.dependencies['graphql']).toBeDefined();
        }

        if (!config.hasTrpc && !config.hasGraphql) {
          expect(pkg.dependencies?.['@trpc/client']).toBeUndefined();
          expect(pkg.dependencies?.['@apollo/client']).toBeUndefined();
        }
      });

      it('should have correct App.tsx providers', async () => {
        const appPath = path.join(projectPath, 'packages', 'shared', 'src', 'components', 'App.tsx');
        const appContent = await fs.readFile(appPath, 'utf8');

        if (config.hasTrpc) {
          expect(appContent).toContain('trpc.Provider');
          expect(appContent).toContain('QueryClientProvider');
          expect(appContent).toContain('createTRPCClient');
        } else {
          expect(appContent).not.toContain('trpc.Provider');
          expect(appContent).not.toContain('createTRPCClient');
        }

        if (config.hasGraphql) {
          expect(appContent).toContain('ApolloProvider');
          expect(appContent).toContain('createApolloClient');
        } else {
          expect(appContent).not.toContain('ApolloProvider');
          expect(appContent).not.toContain('createApolloClient');
        }

        if (!config.hasApi) {
          expect(appContent).not.toContain('QueryClientProvider');
          expect(appContent).not.toContain('API_URL');
        }
      });

      it('should have correct navigation routes', async () => {
        const routerPath = path.join(projectPath, 'packages', 'shared', 'src', 'navigation', 'AppRouter.tsx');
        const routerContent = await fs.readFile(routerPath, 'utf8');

        // HomeScreen always present
        expect(routerContent).toContain('HomeScreen');

        if (config.isBlank) {
          // Blank projects only have HomeScreen
          expect(routerContent).not.toContain('ExploreScreen');
          expect(routerContent).not.toContain('ProfileScreen');
          expect(routerContent).not.toContain('TRPCDemoScreen');
          expect(routerContent).not.toContain('GraphQLDemoScreen');
        } else {
          // Showcase projects have all standard screens
          expect(routerContent).toContain('ExploreScreen');
          expect(routerContent).toContain('ProfileScreen');

          // tRPC screen only when tRPC enabled
          if (config.hasTrpc) {
            expect(routerContent).toContain('TRPCDemoScreen');
          } else {
            expect(routerContent).not.toContain('TRPCDemoScreen');
          }

          // GraphQL screen only when GraphQL AND Prisma enabled
          if (config.hasGraphql && config.hasPrisma) {
            expect(routerContent).toContain('GraphQLDemoScreen');
          } else {
            expect(routerContent).not.toContain('GraphQLDemoScreen');
          }
        }
      });

      it('should have correct client files', async () => {
        const srcDir = path.join(projectPath, 'packages', 'shared', 'src');

        if (config.hasTrpc) {
          expect(await fs.pathExists(path.join(srcDir, 'trpc', 'client.ts'))).toBe(true);
        } else {
          expect(await fs.pathExists(path.join(srcDir, 'trpc'))).toBe(false);
        }

        if (config.hasGraphql) {
          expect(await fs.pathExists(path.join(srcDir, 'graphql', 'client.ts'))).toBe(true);
        } else {
          expect(await fs.pathExists(path.join(srcDir, 'graphql'))).toBe(false);
        }
      });
    });

    if (config.hasApi) {
      describe('API Package', () => {
        it('should have correct dependencies', async () => {
          const pkgPath = path.join(projectPath, 'packages', 'api', 'package.json');
          const pkg = await fs.readJson(pkgPath);

          // Base dependencies
          expect(pkg.dependencies['express']).toBeDefined();
          expect(pkg.dependencies['cors']).toBeDefined();

          if (config.hasTrpc) {
            expect(pkg.dependencies['@trpc/server']).toBeDefined();
          } else {
            expect(pkg.dependencies?.['@trpc/server']).toBeUndefined();
          }

          if (config.hasGraphql) {
            expect(pkg.dependencies['@pothos/core']).toBeDefined();
            expect(pkg.dependencies['graphql-yoga']).toBeDefined();
          } else {
            expect(pkg.dependencies?.['@pothos/core']).toBeUndefined();
            expect(pkg.dependencies?.['graphql-yoga']).toBeUndefined();
          }

          if (config.hasGraphql && config.hasPrisma) {
            expect(pkg.dependencies['@pothos/plugin-prisma']).toBeDefined();
          }
        });

        it('should have correct server configuration', async () => {
          const serverPath = path.join(projectPath, 'packages', 'api', 'src', 'server.ts');
          const serverContent = await fs.readFile(serverPath, 'utf8');

          if (config.hasTrpc) {
            expect(serverContent).toContain('/trpc');
            expect(serverContent).toContain('trpcExpress');
          } else {
            expect(serverContent).not.toContain('trpcExpress');
          }

          if (config.hasGraphql) {
            expect(serverContent).toContain('/graphql');
            expect(serverContent).toContain('createYoga');
          } else {
            expect(serverContent).not.toContain('createYoga');
          }
        });

        it('should have correct API structure', async () => {
          const apiSrcDir = path.join(projectPath, 'packages', 'api', 'src');

          if (config.hasTrpc) {
            expect(await fs.pathExists(path.join(apiSrcDir, 'trpc'))).toBe(true);
          }

          if (config.hasGraphql) {
            expect(await fs.pathExists(path.join(apiSrcDir, 'graphql'))).toBe(true);
          }
        });
      });
    }

    if (config.hasPrisma) {
      describe('Database Package', () => {
        it('should have correct package.json', async () => {
          const pkgPath = path.join(projectPath, 'packages', 'database', 'package.json');
          const pkg = await fs.readJson(pkgPath);

          expect(pkg.type).toBe('module');
          expect(pkg.dependencies['@prisma/client']).toBeDefined();
          expect(pkg.devDependencies['prisma']).toBeDefined();
        });

        it('should have Prisma schema with correct output', async () => {
          const schemaPath = path.join(projectPath, 'packages', 'database', 'prisma', 'schema.prisma');
          const schemaContent = await fs.readFile(schemaPath, 'utf8');

          expect(schemaContent).toContain('generator client');
          expect(schemaContent).toContain('output');
          expect(schemaContent).toContain('./generated/client');
        });

        it('should have Prisma 7 schema format (no url in datasource)', async () => {
          const schemaPath = path.join(projectPath, 'packages', 'database', 'prisma', 'schema.prisma');
          const schemaContent = await fs.readFile(schemaPath, 'utf8');

          // Extract datasource block and verify it doesn't contain url
          const datasourceMatch = schemaContent.match(/datasource db \{[\s\S]*?\}/);
          expect(datasourceMatch).not.toBeNull();
          const datasourceBlock = datasourceMatch![0];
          expect(datasourceBlock).not.toContain('url');
          expect(datasourceBlock).toContain('provider');
        });

        it('should have prisma.config.ts with datasource url', async () => {
          const configPath = path.join(projectPath, 'packages', 'database', 'prisma.config.ts');
          expect(await fs.pathExists(configPath)).toBe(true);

          const configContent = await fs.readFile(configPath, 'utf8');
          expect(configContent).toContain('defineConfig');
          expect(configContent).toContain("url: env('DATABASE_URL')");
        });

        it('should have .env with DATABASE_URL', async () => {
          const envPath = path.join(projectPath, 'packages', 'database', '.env');
          expect(await fs.pathExists(envPath)).toBe(true);

          const envContent = await fs.readFile(envPath, 'utf8');
          expect(envContent).toContain('DATABASE_URL=');
        });

        it('should have correct index.ts imports', async () => {
          const indexPath = path.join(projectPath, 'packages', 'database', 'src', 'index.ts');
          const indexContent = await fs.readFile(indexPath, 'utf8');

          expect(indexContent).toContain('../generated/client/index.js');
          expect(indexContent).toContain('export const prisma');
          expect(indexContent).toContain('export { PrismaClient }');
        });
      });
    }
  });
});

describe('Build Verification', () => {
  // These tests are slower - run them separately
  const buildConfigs = TEST_CONFIGURATIONS.filter(c => c.hasTrpc || c.hasGraphql);

  describe.each(buildConfigs)('$description ($name) - Build Tests', (config) => {
    const projectPath = path.join(TEST_DIR, `test-${config.name}`);

    it('should install dependencies successfully', () => {
      // Skip if project doesn't exist (previous tests may have failed)
      if (!fs.existsSync(projectPath)) {
        console.log(`Skipping: ${projectPath} does not exist`);
        return;
      }

      const result = execSync('yarn install', {
        cwd: projectPath,
        encoding: 'utf8',
        timeout: TIMEOUT,
        stdio: 'pipe',
      });
      expect(result).toBeDefined();
    }, TIMEOUT);

    if (config.hasPrisma) {
      it('should generate Prisma client successfully', () => {
        if (!fs.existsSync(projectPath)) return;

        execSync('yarn db:generate', {
          cwd: projectPath,
          encoding: 'utf8',
          timeout: TIMEOUT,
          stdio: 'pipe',
        });

        // Check that client was generated
        const clientPath = path.join(projectPath, 'packages', 'database', 'generated', 'client');
        expect(fs.existsSync(clientPath)).toBe(true);
      }, TIMEOUT);

      it('should push database schema successfully', () => {
        if (!fs.existsSync(projectPath)) return;

        execSync('yarn db:push', {
          cwd: projectPath,
          encoding: 'utf8',
          timeout: TIMEOUT,
          stdio: 'pipe',
        });

        // Check that database was created (sqlite creates file relative to schema location)
        const dbPath = path.join(projectPath, 'packages', 'database', 'prisma', 'dev.db');
        expect(fs.existsSync(dbPath)).toBe(true);
      }, TIMEOUT);
    }

    it('should pass TypeScript type checking', () => {
      // Skip if project doesn't exist (previous tests may have failed)
      if (!fs.existsSync(projectPath)) {
        console.log(`Skipping: ${projectPath} does not exist`);
        return;
      }

      // Run tsc --noEmit to verify all TypeScript types are correct
      const result = spawnSync('yarn', ['tsc', '--noEmit'], {
        cwd: projectPath,
        encoding: 'utf8',
        timeout: TIMEOUT,
        stdio: 'pipe',
      });

      if (result.status !== 0) {
        console.error('TypeScript errors:', result.stdout, result.stderr);
      }

      expect(result.status).toBe(0);
    }, TIMEOUT);
  });
});
