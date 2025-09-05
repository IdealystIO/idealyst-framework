import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import path from 'path';
import fs from 'fs-extra';
import { generateDatabaseProject, generateApiProject } from '../src/generators';
import { cleanupTempDir, createTempDir } from './setup';

describe('Database Client Integration', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('database-client-integration');
    
    // Set up workspace structure for all tests
    await fs.writeJson(path.join(tempDir, 'package.json'), {
      name: 'test-workspace',
      private: true,
      workspaces: ['packages/*']
    });
    
    // Create packages directory
    await fs.ensureDir(path.join(tempDir, 'packages'));
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should export client and types that can be consumed by other packages', async () => {
    // Create database project
    await generateDatabaseProject({
      name: 'my-database',
      type: 'database',
      directory: tempDir,
      skipInstall: true
    });

    // Create API project
    await generateApiProject({
      name: 'my-api',
      type: 'api', 
      directory: tempDir,
      skipInstall: true
    });

    const databasePath = path.join(tempDir, 'packages', 'my-database');
    const apiPath = path.join(tempDir, 'packages', 'my-api');

    // Verify database package.json structure
    const dbPackageJson = await fs.readJson(path.join(databasePath, 'package.json'));
    expect(dbPackageJson.name).toBe('@test-workspace/my-database');
    expect(dbPackageJson.main).toBe('dist/index.js');
    expect(dbPackageJson.types).toBe('dist/index.d.ts');
    expect(dbPackageJson.files).toContain('generated/**/*');

    // Verify main index exports all necessary items
    const dbIndexContent = await fs.readFile(path.join(databasePath, 'src', 'index.ts'), 'utf8');
    expect(dbIndexContent).toContain("import { PrismaClient } from '../generated/client'");
    expect(dbIndexContent).toContain('export const prisma');
    expect(dbIndexContent).toContain("export * from './validators'");
    expect(dbIndexContent).toContain("export * from '../generated/client'");
    expect(dbIndexContent).toContain('export default prisma');

    // Verify validators file exists and has proper structure
    const validatorsContent = await fs.readFile(path.join(databasePath, 'src', 'validators.ts'), 'utf8');
    expect(validatorsContent).toContain("import { z } from 'zod'");
    expect(validatorsContent).toContain('export const TestValidator');

    // Create a test API controller that would use the database
    const testControllerContent = `
import { prisma, PrismaClient, TestValidator } from '@test-workspace/my-database';

// Test that we can import and use the database client
const testDatabaseIntegration = async () => {
  // Should be able to use the singleton prisma instance
  console.log('Database client:', typeof prisma);
  
  // Should be able to import PrismaClient for type annotations
  const client: PrismaClient = prisma;
  
  // Should be able to access validators
  console.log('Validator:', typeof TestValidator);
  
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
    expect(writtenContent).toContain('import { prisma, PrismaClient, TestValidator }');
    expect(writtenContent).toContain('typeof prisma');
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
    expect(readmeContent).toContain('import { prisma,');
    expect(readmeContent).toContain('const users = await prisma.user.findMany()');
    expect(readmeContent).toContain('TestValidator.parse(');
  });
});
