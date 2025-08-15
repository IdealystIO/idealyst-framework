import { generateApiProject } from '../src/generators/api';
import fs from 'fs-extra';
import path from 'path';
import { createTempDir, cleanupTempDir, verifyFileExists } from './setup';

describe('API Generator', () => {
  let tempDir: string;
  let workspaceDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('api-generator');
    
    // Create a workspace first
    workspaceDir = path.join(tempDir, 'test-workspace');
    await fs.ensureDir(workspaceDir);
    
    const workspacePackageJson = {
      name: 'test-workspace',
      workspaces: ['packages/*'],
      private: true
    };
    await fs.writeJSON(path.join(workspaceDir, 'package.json'), workspacePackageJson);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should create an API project within a workspace', async () => {
    await generateApiProject({
      name: 'my-api',
      type: 'api',
      directory: workspaceDir,
      skipInstall: true
    });

    const projectPath = path.join(workspaceDir, 'packages', 'my-api');

    // Verify main files
    await verifyFileExists(path.join(projectPath, 'package.json'), [
      '"name": "@test-workspace/my-api"',
      '"type": "module"',
      '"scripts"'
    ]);

    await verifyFileExists(path.join(projectPath, 'tsconfig.json'));
    await verifyFileExists(path.join(projectPath, 'jest.config.js'));
    await verifyFileExists(path.join(projectPath, 'jest.setup.js'));

    // Verify source files
    await verifyFileExists(path.join(projectPath, 'src', 'index.ts'));
    await verifyFileExists(path.join(projectPath, 'src', 'router', 'index.ts'));

    // Verify Prisma setup
    await verifyFileExists(path.join(projectPath, 'prisma', 'schema.prisma'));

    // Verify test files
    await verifyFileExists(path.join(projectPath, '__tests__', 'api.test.ts'));

    // Verify package.json has correct dependencies
    const packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));
    expect(packageJson.dependencies).toHaveProperty('@trpc/server');
    expect(packageJson.dependencies).toHaveProperty('prisma');
    expect(packageJson.dependencies).toHaveProperty('express');
    expect(packageJson.dependencies).toHaveProperty('cors');
    expect(packageJson.dependencies).toHaveProperty('zod');
  });

  it('should fail when not in a workspace', async () => {
    const nonWorkspaceDir = path.join(tempDir, 'non-workspace');
    await fs.ensureDir(nonWorkspaceDir);

    await expect(generateApiProject({
      name: 'my-api',
      type: 'api',
      directory: nonWorkspaceDir,
      skipInstall: true
    })).rejects.toThrow('Individual projects can only be created within a workspace');
  });

  it('should validate project names', async () => {
    await expect(generateApiProject({
      name: 'Invalid Name',
      type: 'api',
      directory: workspaceDir,
      skipInstall: true
    })).rejects.toThrow('Invalid project name');
  });

  it('should create correct directory structure', async () => {
    await generateApiProject({
      name: 'backend-service',
      type: 'api',
      directory: workspaceDir,
      skipInstall: true
    });

    const projectPath = path.join(workspaceDir, 'packages', 'backend-service');

    // Verify directory structure
    const dirs = [
      'src',
      'src/router',
      'src/controllers',
      'src/middleware',
      'src/lib',
      'prisma',
      '__tests__'
    ];

    for (const dir of dirs) {
      expect(await fs.pathExists(path.join(projectPath, dir))).toBe(true);
    }
  });
});
