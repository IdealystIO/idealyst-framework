/**
 * Database Generator Integration Test
 * 
 * This test validates the database generation functionality by:
 * 1. Creating a workspace and database project
 * 2. Verifying file structure and content
 * 3. Testing the complete Prisma workflow
 * 4. Ensuring proper TypeScript compilation
 */

import { execSync } from 'child_process';
import { mkdtempSync, rmSync } from 'fs';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('Database Generation Integration Test', () => {
  let testDir: string;
  let cliPath: string;

  beforeAll(() => {
    // Create temporary directory for testing
    testDir = mkdtempSync(join(tmpdir(), 'cli-db-test-'));
    cliPath = join(__dirname, '..', 'dist', 'index.js');
    
    console.log(`Test directory: ${testDir}`);
    console.log(`CLI path: ${cliPath}`);
  });

  afterAll(() => {
    // Clean up test directory
    if (testDir) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('should generate complete database project structure', () => {
    // Create workspace
    execSync(`node "${cliPath}" init test-workspace --skip-install`, {
      cwd: testDir,
      stdio: 'pipe'
    });

    const workspaceDir = join(testDir, 'test-workspace');
    expect(existsSync(workspaceDir)).toBe(true);

    // Create database project
    execSync(`node "${cliPath}" create user-database --type database --skip-install`, {
      cwd: workspaceDir,
      stdio: 'pipe'
    });

    const dbDir = join(workspaceDir, 'packages', 'user-database');
    expect(existsSync(dbDir)).toBe(true);

    // Verify main files exist
    expect(existsSync(join(dbDir, 'package.json'))).toBe(true);
    expect(existsSync(join(dbDir, 'tsconfig.json'))).toBe(true);
    expect(existsSync(join(dbDir, 'schema.prisma'))).toBe(true);
    expect(existsSync(join(dbDir, 'src', 'index.ts'))).toBe(true);
    expect(existsSync(join(dbDir, 'src', 'validators.ts'))).toBe(true);
  });

  test('should have correct package.json configuration', () => {
    const workspaceDir = join(testDir, 'test-workspace');
    const dbDir = join(workspaceDir, 'packages', 'user-database');
    const packageJsonPath = join(dbDir, 'package.json');
    
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    // Verify dependencies
    expect(packageJson.dependencies).toHaveProperty('@prisma/client');
    expect(packageJson.dependencies).toHaveProperty('zod');
    expect(packageJson.devDependencies).toHaveProperty('prisma');

    // Verify package structure
    expect(packageJson.name).toBe('@test-workspace/user-database');
    expect(packageJson.main).toBe('dist/index.js');
    expect(packageJson.types).toBe('dist/index.d.ts');

    // Verify files include generated content
    expect(packageJson.files).toContain('dist/**/*');
    expect(packageJson.files).toContain('generated/**/*');
  });

  test('should have correct Prisma schema configuration', () => {
    const workspaceDir = join(testDir, 'test-workspace');
    const dbDir = join(workspaceDir, 'packages', 'user-database');
    const schemaPath = join(dbDir, 'schema.prisma');
    
    const schemaContent = readFileSync(schemaPath, 'utf8');

    // Verify custom output path
    expect(schemaContent).toContain('output   = "./generated/client"');
    expect(schemaContent).toContain('provider = "prisma-client-js"');
    expect(schemaContent).toContain('provider = "sqlite"');
  });

  test('should have correct index.ts exports structure', () => {
    const workspaceDir = join(testDir, 'test-workspace');
    const dbDir = join(workspaceDir, 'packages', 'user-database');
    const indexPath = join(dbDir, 'src', 'index.ts');
    
    const indexContent = readFileSync(indexPath, 'utf8');

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

  test('should have correct validators file', () => {
    const workspaceDir = join(testDir, 'test-workspace');
    const dbDir = join(workspaceDir, 'packages', 'user-database');
    const validatorsPath = join(dbDir, 'src', 'validators.ts');
    
    const validatorsContent = readFileSync(validatorsPath, 'utf8');

    // Verify Zod import and example validator
    expect(validatorsContent).toContain("import { z } from 'zod'");
    expect(validatorsContent).toContain('export const TestValidator');
    expect(validatorsContent).toContain('z.object({');
  });

  test('should complete full Prisma generation workflow', () => {
    const workspaceDir = join(testDir, 'test-workspace');
    const dbDir = join(workspaceDir, 'packages', 'user-database');
    const schemaPath = join(dbDir, 'schema.prisma');
    
    // Add a model to test generation
    const userModel = `
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`;
    
    const originalSchema = readFileSync(schemaPath, 'utf8');
    writeFileSync(schemaPath, originalSchema + userModel);

    // Install dependencies
    execSync('yarn install', {
      cwd: workspaceDir,
      stdio: 'pipe'
    });

    // Generate Prisma client
    execSync('yarn db:generate', {
      cwd: dbDir,
      stdio: 'pipe'
    });

    // Verify generated structure
    const generatedDir = join(dbDir, 'generated', 'client');
    expect(existsSync(generatedDir)).toBe(true);
    expect(existsSync(join(generatedDir, 'index.d.ts'))).toBe(true);
    expect(existsSync(join(generatedDir, 'index.js'))).toBe(true);

    // Build TypeScript
    execSync('yarn build', {
      cwd: dbDir,
      stdio: 'pipe'
    });

    // Verify built output
    const distDir = join(dbDir, 'dist');
    expect(existsSync(distDir)).toBe(true);
    expect(existsSync(join(distDir, 'index.js'))).toBe(true);
    expect(existsSync(join(distDir, 'index.d.ts'))).toBe(true);
    expect(existsSync(join(distDir, 'validators.js'))).toBe(true);
  });
});

export {};
