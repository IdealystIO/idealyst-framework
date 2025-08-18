import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import path from 'path';
import fs from 'fs-extra';
import { generateDatabaseProject } from '../src/generators/database';
import { cleanupTempDir, createTempDir } from './setup';

describe('Database Generator', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('database-generator');
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should create database project with correct structure', async () => {
    const projectName = 'test-database';
    
    await generateDatabaseProject({
      name: projectName,
      type: 'database',
      directory: tempDir,
      skipInstall: true
    });

    const projectPath = path.join(tempDir, 'packages', projectName);
    
    // Check if main files exist
    expect(await fs.pathExists(path.join(projectPath, 'package.json'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'tsconfig.json'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'README.md'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, '.env.example'))).toBe(true);
    
    // Check Prisma setup
    expect(await fs.pathExists(path.join(projectPath, 'prisma', 'schema.prisma'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'prisma', 'seed.ts'))).toBe(true);
    
    // Check source files
    expect(await fs.pathExists(path.join(projectPath, 'src', 'index.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'src', 'client.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'src', 'schemas.ts'))).toBe(true);
    
    // Check test setup
    expect(await fs.pathExists(path.join(projectPath, '__tests__', 'database.test.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'jest.config.js'))).toBe(true);
    
    // Verify package.json has correct dependencies
    const packageJson = await fs.readJson(path.join(projectPath, 'package.json'));
    expect(packageJson.dependencies).toHaveProperty('@prisma/client');
    expect(packageJson.dependencies).toHaveProperty('zod');
    expect(packageJson.devDependencies).toHaveProperty('prisma');
    expect(packageJson.devDependencies).not.toHaveProperty('@trpc/server');
  });
});
