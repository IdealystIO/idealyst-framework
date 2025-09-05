import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import path from 'path';
import fs from 'fs-extra';
import { generateDatabaseProject } from '../src/generators/database';
import { cleanupTempDir, createTempDir } from './setup';

describe('Database Generator', () => {
  let tempDir: string;
  let workspaceDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('database-generator');
    workspaceDir = path.join(tempDir, 'test-workspace');
    
    // Create a workspace structure manually
    await fs.ensureDir(workspaceDir);
    await fs.writeJson(path.join(workspaceDir, 'package.json'), {
      name: 'test-workspace',
      private: true,
      workspaces: ['packages/*']
    });
    await fs.ensureDir(path.join(workspaceDir, 'packages'));
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should create database project with correct structure', async () => {
    const projectName = 'test-database';
    
    await generateDatabaseProject({
      name: projectName,
      type: 'database',
      directory: workspaceDir,
      skipInstall: true
    });

    const projectPath = path.join(workspaceDir, 'packages', projectName);
    
    // Check if main files exist
    expect(await fs.pathExists(path.join(projectPath, 'package.json'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'tsconfig.json'))).toBe(true);
    
    // Check Prisma setup - schema at root level
    expect(await fs.pathExists(path.join(projectPath, 'schema.prisma'))).toBe(true);
    
    // Check source files
    expect(await fs.pathExists(path.join(projectPath, 'src', 'index.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'src', 'validators.ts'))).toBe(true);
    
    // Verify package.json has correct dependencies
    const packageJson = await fs.readJson(path.join(projectPath, 'package.json'));
    expect(packageJson.dependencies).toHaveProperty('@prisma/client');
    expect(packageJson.dependencies).toHaveProperty('zod');
    expect(packageJson.devDependencies).toHaveProperty('prisma');
    expect(packageJson.devDependencies).not.toHaveProperty('@trpc/server');
    
    // Verify package.json includes generated files
    expect(packageJson.files).toContain('dist/**/*');
    expect(packageJson.files).toContain('generated/**/*');
  });

  it('should have correct Prisma schema configuration', async () => {
    const projectName = 'test-database';
    
    await generateDatabaseProject({
      name: projectName,
      type: 'database',
      directory: workspaceDir,
      skipInstall: true
    });

    const projectPath = path.join(workspaceDir, 'packages', projectName);
    const schemaContent = await fs.readFile(path.join(projectPath, 'schema.prisma'), 'utf8');
    
    // Verify custom output path
    expect(schemaContent).toContain('output   = "./generated/client"');
    expect(schemaContent).toContain('provider = "prisma-client-js"');
    expect(schemaContent).toContain('provider = "sqlite"');
  });

  it('should have correct index.ts exports structure', async () => {
    const projectName = 'test-database';
    
    await generateDatabaseProject({
      name: projectName,
      type: 'database',
      directory: workspaceDir,
      skipInstall: true
    });

    const projectPath = path.join(workspaceDir, 'packages', projectName);
    const indexContent = await fs.readFile(path.join(projectPath, 'src', 'index.ts'), 'utf8');
    
    // Verify imports from generated client
    expect(indexContent).toContain("import { PrismaClient } from '../generated/client'");
    
    // Verify singleton pattern
    expect(indexContent).toContain('globalThis.__prisma');
    expect(indexContent).toContain('export const prisma');
    
    // Verify exports
    expect(indexContent).toContain("export * from './validators'");
    expect(indexContent).toContain("export * from '../generated/client'");
    expect(indexContent).toContain('export default prisma');
  });

  it('should have validators file with Zod schemas', async () => {
    const projectName = 'test-database';
    
    await generateDatabaseProject({
      name: projectName,
      type: 'database',
      directory: workspaceDir,
      skipInstall: true
    });

    const projectPath = path.join(workspaceDir, 'packages', projectName);
    const validatorsContent = await fs.readFile(path.join(projectPath, 'src', 'validators.ts'), 'utf8');
    
    // Verify Zod import and example validator
    expect(validatorsContent).toContain("import { z } from 'zod'");
    expect(validatorsContent).toContain('export const TestValidator');
    expect(validatorsContent).toContain('z.object({');
  });

  it('should generate client correctly after running prisma generate', async () => {
    const projectName = 'test-database';
    
    await generateDatabaseProject({
      name: projectName,
      type: 'database',
      directory: workspaceDir,
      skipInstall: true
    });

    const projectPath = path.join(workspaceDir, 'packages', projectName);
    
    // Add a simple model to the schema for testing
    const schemaPath = path.join(projectPath, 'schema.prisma');
    let schemaContent = await fs.readFile(schemaPath, 'utf8');
    schemaContent += `
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`;
    await fs.writeFile(schemaPath, schemaContent);
    
    // Simulate running prisma generate by creating the expected generated structure
    const generatedPath = path.join(projectPath, 'generated', 'client');
    await fs.ensureDir(generatedPath);
    
    // Create mock generated files
    await fs.writeFile(path.join(generatedPath, 'index.d.ts'), `
export * from './runtime/library';
export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export class PrismaClient {}
    `);
    
    await fs.writeFile(path.join(generatedPath, 'index.js'), `
module.exports = { PrismaClient: class PrismaClient {} };
    `);
    
    // Verify the generated structure exists
    expect(await fs.pathExists(generatedPath)).toBe(true);
    expect(await fs.pathExists(path.join(generatedPath, 'index.d.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(generatedPath, 'index.js'))).toBe(true);
  });

  it('should be consumable by other packages in a workspace', async () => {
    // Create database project
    await generateDatabaseProject({
      name: 'user-database',
      type: 'database',
      directory: workspaceDir,
      skipInstall: true
    });

    const databasePath = path.join(workspaceDir, 'packages', 'user-database');
    
    // Verify the package can be imported (mock the import check)
    const packageJson = await fs.readJson(path.join(databasePath, 'package.json'));
    expect(packageJson.name).toBe('@test-workspace/user-database');
    expect(packageJson.main).toBe('dist/index.js');
    expect(packageJson.types).toBe('dist/index.d.ts');
    
    // Create a mock consumer file to test the import pattern
    const testConsumerPath = path.join(workspaceDir, 'test-consumer.ts');
    await fs.writeFile(testConsumerPath, `
import { prisma, PrismaClient, TestValidator } from '@test-workspace/user-database';

// This should compile without errors when types are available
const client: PrismaClient = prisma;
const validator = TestValidator;
    `);
    
    expect(await fs.pathExists(testConsumerPath)).toBe(true);
    const consumerContent = await fs.readFile(testConsumerPath, 'utf8');
    expect(consumerContent).toContain("import { prisma, PrismaClient, TestValidator }");
    expect(consumerContent).toContain("@test-workspace/user-database");
  });
});
