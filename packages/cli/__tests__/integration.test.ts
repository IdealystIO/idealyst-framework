import { spawn } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { createTempDir, cleanupTempDir, verifyFileExists, mockInquirerResponses } from './setup';

describe('CLI Integration Tests', () => {
  let tempDir: string;
  const cliPath = path.join(__dirname, '..', 'dist', 'index.js');

  beforeEach(async () => {
    tempDir = await createTempDir('cli-integration');
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  const runCLI = (args: string[], cwd: string = tempDir): Promise<{ stdout: string; stderr: string; code: number | null }> => {
    return new Promise((resolve) => {
      const child = spawn('node', [cliPath, ...args], {
        cwd,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      // Provide default answers for interactive prompts
      if (child.stdin) {
        child.stdin.write('n\n'); // No to tRPC by default
        child.stdin.end();
      }

      child.on('close', (code) => {
        resolve({ stdout, stderr, code });
      });
    });
  };

  it('should show help when no arguments provided', async () => {
    const result = await runCLI(['--help']);
    
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('CLI tool for generating Idealyst Framework projects');
    expect(result.stdout).toContain('init');
    expect(result.stdout).toContain('create');
  });

  it('should initialize a workspace successfully', async () => {
    const result = await runCLI(['init', 'test-workspace', '--skip-install']);
    
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Full-stack workspace created successfully!');

    const workspacePath = path.join(tempDir, 'test-workspace');
    await verifyFileExists(path.join(workspacePath, 'package.json'));
    await verifyFileExists(path.join(workspacePath, 'README.md'));
    await verifyFileExists(path.join(workspacePath, 'docker-compose.yml'));
  });

  it('should create web project within workspace', async () => {
    // First create workspace
    await runCLI(['init', 'test-workspace', '--skip-install']);
    
    const workspacePath = path.join(tempDir, 'test-workspace');
    
    // Then create web project
    const result = await runCLI(['create', 'my-web-app', '--type', 'web', '--skip-install'], workspacePath);
    
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Successfully created my-web-app');

    const projectPath = path.join(workspacePath, 'packages', 'my-web-app');
    await verifyFileExists(path.join(projectPath, 'package.json'));
    await verifyFileExists(path.join(projectPath, 'src', 'App.tsx'));
    await verifyFileExists(path.join(projectPath, 'vite.config.ts'));
  });

  it('should create API project within workspace', async () => {
    // First create workspace
    await runCLI(['init', 'test-workspace', '--skip-install']);
    
    const workspacePath = path.join(tempDir, 'test-workspace');
    
    // Then create API project
    const result = await runCLI(['create', 'my-api', '--type', 'api', '--skip-install'], workspacePath);
    
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Successfully created my-api');

    const projectPath = path.join(workspacePath, 'packages', 'my-api');
    await verifyFileExists(path.join(projectPath, 'package.json'));
    await verifyFileExists(path.join(projectPath, 'src', 'index.ts'));
    await verifyFileExists(path.join(projectPath, 'src', 'server.ts'));
    await verifyFileExists(path.join(projectPath, 'src', 'context.ts'));
    
    // Verify package.json doesn't include Prisma dependencies
    const packageJson = JSON.parse(await fs.readFile(path.join(projectPath, 'package.json'), 'utf8'));
    expect(packageJson.dependencies).not.toHaveProperty('@prisma/client');
    expect(packageJson.devDependencies).not.toHaveProperty('prisma');
  });

  it('should create database project within workspace', async () => {
    // First create workspace
    await runCLI(['init', 'test-workspace', '--skip-install']);
    
    const workspacePath = path.join(tempDir, 'test-workspace');
    
    // Then create database project
    const result = await runCLI(['create', 'my-custom-database', '--type', 'database', '--skip-install'], workspacePath);
    
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Database project created successfully!');

    const projectPath = path.join(workspacePath, 'packages', 'my-custom-database');
    
    await verifyFileExists(path.join(projectPath, 'package.json'));
    await verifyFileExists(path.join(projectPath, 'src', 'index.ts'));
    await verifyFileExists(path.join(projectPath, 'src', 'validators.ts'));
    await verifyFileExists(path.join(projectPath, 'schema.prisma')); // schema.prisma is in root, not prisma/ dir
    await verifyFileExists(path.join(projectPath, 'prisma', 'seed.ts'));
    
    // Verify package.json includes Prisma dependencies
    const packageJson = JSON.parse(await fs.readFile(path.join(projectPath, 'package.json'), 'utf8'));
    expect(packageJson.dependencies).toHaveProperty('@prisma/client');
    expect(packageJson.dependencies).toHaveProperty('zod');
    expect(packageJson.devDependencies).toHaveProperty('prisma');
  });

  it('should export database client and types for consumption by other packages', async () => {
    // First create workspace
    await runCLI(['init', 'test-workspace', '--skip-install']);
    
    const workspacePath = path.join(tempDir, 'test-workspace');
    
    // Create database project
    const dbResult = await runCLI(['create', 'my-database', '--type', 'database', '--skip-install'], workspacePath);
    expect(dbResult.code).toBe(0);

    // Create API project  
    const apiResult = await runCLI(['create', 'my-api', '--type', 'api', '--skip-install'], workspacePath);
    expect(apiResult.code).toBe(0);

    const databasePath = path.join(workspacePath, 'packages', 'my-database');
    const apiPath = path.join(workspacePath, 'packages', 'my-api');

    // Verify database exports are properly configured
    const dbPackageJson = JSON.parse(await fs.readFile(path.join(databasePath, 'package.json'), 'utf8'));
    expect(dbPackageJson.exports).toBeDefined();
    expect(dbPackageJson.exports['.']).toBeDefined();
    expect(dbPackageJson.exports['./client']).toBeDefined();
    expect(dbPackageJson.exports['./schemas']).toBeDefined();
    
    // Verify the main export has correct paths
    expect(dbPackageJson.exports['.']).toHaveProperty('import', './dist/index.js');
    expect(dbPackageJson.exports['.']).toHaveProperty('types', './dist/index.d.ts');

    // Verify main index exports all necessary items
    const dbIndexContent = await fs.readFile(path.join(databasePath, 'src', 'index.ts'), 'utf8');
    expect(dbIndexContent).toContain('export * from \'../generated/client\'');
    expect(dbIndexContent).toContain('export default prisma');
    expect(dbIndexContent).toContain('export * from \'./validators\'');
    expect(dbIndexContent).toContain('export const prisma');

    // Verify validators file exists and has Zod schemas
    const validatorsContent = await fs.readFile(path.join(databasePath, 'src', 'validators.ts'), 'utf8');
    expect(validatorsContent).toContain('z.object');

    // Verify TypeScript configuration supports declaration generation for type safety
    const tsConfig = JSON.parse(await fs.readFile(path.join(databasePath, 'tsconfig.json'), 'utf8'));
    expect(tsConfig.compilerOptions.declaration).toBe(true);
    expect(tsConfig.compilerOptions.declarationMap).toBe(true);

    // Create a test file in the API project showing how to consume the database
    const testConsumerContent = `
// Example of how to consume the database package from an API server
import { db, schemas, PrismaClient } from '@test-workspace/my-database';
import type { User } from '@test-workspace/my-database';

export class UserService {
  // Use the singleton database instance
  async getAllUsers() {
    return await db.user.findMany();
  }

  // Use Zod schemas for validation
  async createUser(userData: unknown) {
    const validatedData = schemas.createUser.parse(userData);
    return await db.user.create({ data: validatedData });
  }

  // Use Prisma types for type safety
  async getUserById(id: string): Promise<User | null> {
    return await db.user.findUnique({ where: { id } });
  }
}`;

    await fs.writeFile(path.join(apiPath, 'src', 'UserService.ts'), testConsumerContent);
    
    // Verify the consumer file was created successfully
    expect(await fs.pathExists(path.join(apiPath, 'src', 'UserService.ts'))).toBe(true);
    
    const consumerContent = await fs.readFile(path.join(apiPath, 'src', 'UserService.ts'), 'utf8');
    expect(consumerContent).toContain('import { db, schemas, PrismaClient }');
    expect(consumerContent).toContain('import type { User }');
    expect(consumerContent).toContain('db.user.findMany()');
    expect(consumerContent).toContain('schemas.createUser.parse');
  });

  it('should create shared library within workspace', async () => {
    // First create workspace
    await runCLI(['init', 'test-workspace', '--skip-install']);
    
    const workspacePath = path.join(tempDir, 'test-workspace');
    
    // Then create shared library
    const result = await runCLI(['create', 'shared-lib', '--type', 'shared', '--skip-install'], workspacePath);
    
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Successfully created shared-lib');

    const projectPath = path.join(workspacePath, 'packages', 'shared-lib');
    await verifyFileExists(path.join(projectPath, 'package.json'));
    await verifyFileExists(path.join(projectPath, 'src', 'index.ts'));
    await verifyFileExists(path.join(projectPath, 'rollup.config.js'));
  });

  it('should create native project with template fallback', async () => {
    // Set environment variable to disable RN CLI for test
    const originalEnv = process.env.IDEALYST_USE_RN_CLI;
    process.env.IDEALYST_USE_RN_CLI = 'false';

    try {
      // First create workspace
      await runCLI(['init', 'test-workspace', '--skip-install']);
      
      const workspacePath = path.join(tempDir, 'test-workspace');
      
      // Then create native project
      const result = await runCLI([
        'create', 'my-native-app', 
        '--type', 'native', 
        '--app-name', 'My Test App',
        '--skip-install'
      ], workspacePath);
      
      expect(result.code).toBe(0);
      expect(result.stdout).toContain('Successfully created my-native-app');

      const projectPath = path.join(workspacePath, 'packages', 'my-native-app');
      await verifyFileExists(path.join(projectPath, 'package.json'));
      await verifyFileExists(path.join(projectPath, 'App.tsx'));
      await verifyFileExists(path.join(projectPath, 'app.json'));
    } finally {
      process.env.IDEALYST_USE_RN_CLI = originalEnv;
    }
  });

  it('should fail when creating individual project outside workspace', async () => {
    const result = await runCLI(['create', 'my-app', '--type', 'web', '--skip-install']);
    
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Individual projects can only be created within a workspace');
  });

  it('should fail with invalid project name', async () => {
    await runCLI(['init', 'test-workspace', '--skip-install']);
    const workspacePath = path.join(tempDir, 'test-workspace');
    
    const result = await runCLI(['create', 'Invalid Name', '--type', 'web', '--skip-install'], workspacePath);
    
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Invalid project name');
  });

  it('should fail with invalid project type', async () => {
    await runCLI(['init', 'test-workspace', '--skip-install']);
    const workspacePath = path.join(tempDir, 'test-workspace');
    
    const result = await runCLI(['create', 'my-app', '--type', 'invalid', '--skip-install'], workspacePath);
    
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Invalid project type');
  });

  it('should create projects with tRPC when requested', async () => {
    await runCLI(['init', 'test-workspace', '--skip-install']);
    const workspacePath = path.join(tempDir, 'test-workspace');
    
    const result = await runCLI(['create', 'my-trpc-app', '--type', 'web', '--with-trpc', '--skip-install'], workspacePath);
    
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('tRPC client setup and utilities');

    const projectPath = path.join(workspacePath, 'packages', 'my-trpc-app');
    await verifyFileExists(path.join(projectPath, 'src', 'utils', 'trpc.ts'));
  });

  it('should handle workspace scope correctly', async () => {
    await runCLI(['init', 'my-workspace', '--skip-install']);
    const workspacePath = path.join(tempDir, 'my-workspace');
    
    await runCLI(['create', 'my-app', '--type', 'web', '--skip-install'], workspacePath);
    
    const projectPath = path.join(workspacePath, 'packages', 'my-app');
    const packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));
    
    expect(packageJson.name).toBe('@my-workspace/my-app');
  });
});
