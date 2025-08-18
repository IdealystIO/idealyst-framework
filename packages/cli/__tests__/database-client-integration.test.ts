import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import path from 'path';
import fs from 'fs-extra';
import { generateDatabaseProject, generateApiProject } from '../src/generators';
import { cleanupTempDir, createTempDir } from './setup';

describe('Database Client Integration', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('database-client-integration');
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should export client and types that can be consumed by other packages', async () => {
    // Create a workspace structure
    const workspaceDir = path.join(tempDir, 'test-workspace');
    await fs.ensureDir(workspaceDir);
    await fs.writeJson(path.join(workspaceDir, 'package.json'), {
      name: 'test-workspace',
      private: true,
      workspaces: ['packages/*']
    });
    
    // Create database project
    await generateDatabaseProject({
      name: 'my-database',
      type: 'database',
      directory: workspaceDir,
      skipInstall: true
    });

    // Create API project
    await generateApiProject({
      name: 'my-api',
      type: 'api', 
      directory: workspaceDir,
      skipInstall: true
    });

    const databasePath = path.join(workspaceDir, 'packages', 'my-database');
    const apiPath = path.join(workspaceDir, 'packages', 'my-api');

    // Verify database exports are properly configured
    const dbPackageJson = await fs.readJson(path.join(databasePath, 'package.json'));
    expect(dbPackageJson.exports).toHaveProperty('.');
    expect(dbPackageJson.exports).toHaveProperty('./client');
    expect(dbPackageJson.exports).toHaveProperty('./schemas');

    // Verify main index exports all necessary items
    const dbIndexContent = await fs.readFile(path.join(databasePath, 'src', 'index.ts'), 'utf8');
    expect(dbIndexContent).toContain('export { PrismaClient }');
    expect(dbIndexContent).toContain('export { default as db }');
    expect(dbIndexContent).toContain('export * from \'./schemas\'');
    expect(dbIndexContent).toContain('export type * from \'@prisma/client\'');

    // Verify client file has proper singleton pattern
    const clientContent = await fs.readFile(path.join(databasePath, 'src', 'client.ts'), 'utf8');
    expect(clientContent).toContain('PrismaClient');
    expect(clientContent).toContain('globalThis.__globalPrisma');
    expect(clientContent).toContain('export default prisma');

    // Verify schemas file exists and has proper structure
    const schemasContent = await fs.readFile(path.join(databasePath, 'src', 'schemas.ts'), 'utf8');
    expect(schemasContent).toContain('import { z } from \'zod\'');
    expect(schemasContent).toContain('export const schemas');

    // Create a test API controller that would use the database
    const testControllerContent = `
import { db, schemas, PrismaClient } from '@test-workspace/my-database';
import type { User } from '@test-workspace/my-database';

// Test that we can import and use the database client
const testDatabaseIntegration = async () => {
  // Should be able to use the singleton db instance
  console.log('Database client:', typeof db);
  
  // Should be able to import PrismaClient for type annotations
  const client: PrismaClient = db;
  
  // Should be able to access schemas
  console.log('Schemas:', typeof schemas);
  
  // Should be able to use Prisma types (this would fail at compile time if types aren't exported)
  // const user: User = { id: '1', email: 'test@example.com' };
  
  return { success: true };
};

export { testDatabaseIntegration };
`;

    // Write the test controller to verify import syntax
    await fs.writeFile(path.join(apiPath, 'src', 'test-integration.ts'), testControllerContent);

    // Verify the file was created
    expect(await fs.pathExists(path.join(apiPath, 'src', 'test-integration.ts'))).toBe(true);
    
    // Read it back to ensure it contains our expected imports
    const writtenContent = await fs.readFile(path.join(apiPath, 'src', 'test-integration.ts'), 'utf8');
    expect(writtenContent).toContain('import { db, schemas, PrismaClient }');
    expect(writtenContent).toContain('import type { User }');
  });

  it('should generate TypeScript declarations for proper type safety', async () => {
    const projectName = 'type-test-db';
    
    await generateDatabaseProject({
      name: projectName,
      type: 'database',
      directory: tempDir,
      skipInstall: true
    });

    const projectPath = path.join(tempDir, 'packages', projectName);
    
    // Check TypeScript configuration supports declaration generation
    const tsConfig = await fs.readJson(path.join(projectPath, 'tsconfig.json'));
    expect(tsConfig.compilerOptions.declaration).toBe(true);
    expect(tsConfig.compilerOptions.declarationMap).toBe(true);
    expect(tsConfig.compilerOptions.outDir).toBe('./dist');

    // Verify that build script exists to generate declarations
    const packageJson = await fs.readJson(path.join(projectPath, 'package.json'));
    expect(packageJson.scripts.build).toBe('tsc');
    expect(packageJson.main).toBe('dist/index.js');
    expect(packageJson.types).toBe('dist/index.d.ts');
  });

  it('should include example usage in README for client consumption', async () => {
    const projectName = 'readme-test-db';
    
    await generateDatabaseProject({
      name: projectName,
      type: 'database',
      directory: tempDir,
      skipInstall: true
    });

    const projectPath = path.join(tempDir, 'packages', projectName);
    const readmeContent = await fs.readFile(path.join(projectPath, 'README.md'), 'utf8');
    
    // Verify README includes usage examples
    expect(readmeContent).toContain('## Usage');
    expect(readmeContent).toContain('### In Other Packages');
    expect(readmeContent).toContain('import { db, schemas }');
    expect(readmeContent).toContain('const users = await db.user.findMany()');
    expect(readmeContent).toContain('schemas.createUser.parse(input)');
  });
});
