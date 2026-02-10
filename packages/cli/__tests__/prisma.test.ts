/**
 * Unit tests for Prisma extension generator
 */

import fs from 'fs-extra';
import path from 'path';
import { TemplateData } from '../src/types';

// Mock logger to avoid chalk ESM issues
jest.mock('../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    dim: jest.fn(),
  },
}));

// Import after mocking
import { applyPrismaExtension } from '../src/generators/extensions/prisma';

const TEST_DIR = '/tmp/idealyst-prisma-tests';

describe('Prisma Extension Generator', () => {
  const baseTemplateData: TemplateData = {
    projectName: 'test-project',
    packageName: '@test-project/database',
    workspaceScope: 'test-project',
    version: '1.0.0',
    description: 'Test project',
    appDisplayName: 'Test Project',
    iosBundleId: 'com.test.testproject',
    androidPackageName: 'com.test.testproject',
    idealystVersion: '1.2.0',
    hasApi: true,
    hasPrisma: true,
    hasTrpc: false,
    hasGraphql: false,
    hasDevcontainer: false,
    isBlank: false,
    databaseProvider: 'sqlite',
  };

  beforeEach(async () => {
    await fs.ensureDir(TEST_DIR);
    // Create minimal workspace structure
    await fs.ensureDir(path.join(TEST_DIR, 'packages'));
    await fs.writeJson(path.join(TEST_DIR, 'package.json'), {
      name: 'test-workspace',
      scripts: {},
    });
  });

  afterEach(async () => {
    await fs.remove(TEST_DIR);
  });

  describe('File Generation', () => {
    it('should create database package directory', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const dbDir = path.join(TEST_DIR, 'packages', 'database');
      expect(await fs.pathExists(dbDir)).toBe(true);
    });

    it('should create package.json with correct name', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const packageJson = await fs.readJson(
        path.join(TEST_DIR, 'packages', 'database', 'package.json')
      );
      expect(packageJson.name).toBe('@test-project/database');
    });

    it('should create prisma.config.ts file', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const configPath = path.join(TEST_DIR, 'packages', 'database', 'prisma.config.ts');
      expect(await fs.pathExists(configPath)).toBe(true);
    });

    it('should create tsconfig.json', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const tsconfigPath = path.join(TEST_DIR, 'packages', 'database', 'tsconfig.json');
      expect(await fs.pathExists(tsconfigPath)).toBe(true);
    });

    it('should create src/index.ts', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const indexPath = path.join(TEST_DIR, 'packages', 'database', 'src', 'index.ts');
      expect(await fs.pathExists(indexPath)).toBe(true);
    });

    it('should create src/schemas.ts with Zod schemas', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const schemasPath = path.join(TEST_DIR, 'packages', 'database', 'src', 'schemas.ts');
      expect(await fs.pathExists(schemasPath)).toBe(true);

      const content = await fs.readFile(schemasPath, 'utf8');
      expect(content).toContain('import { z } from \'zod\'');
      expect(content).toContain('createItemSchema');
    });

    it('should create .env file', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const envPath = path.join(TEST_DIR, 'packages', 'database', '.env');
      expect(await fs.pathExists(envPath)).toBe(true);
    });

    it('should create .env.example file', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const envExamplePath = path.join(TEST_DIR, 'packages', 'database', '.env.example');
      expect(await fs.pathExists(envExamplePath)).toBe(true);
    });
  });

  describe('Schema Generation', () => {
    it('should create prisma/schema.prisma', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const schemaPath = path.join(TEST_DIR, 'packages', 'database', 'prisma', 'schema.prisma');
      expect(await fs.pathExists(schemaPath)).toBe(true);
    });

    it('should create schema with sqlite provider by default', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const schemaPath = path.join(TEST_DIR, 'packages', 'database', 'prisma', 'schema.prisma');
      const content = await fs.readFile(schemaPath, 'utf8');

      expect(content).toContain('provider = "sqlite"');
      expect(content).toContain('generator client');
      expect(content).toContain('model Item');
    });

    it('should create schema with postgresql provider when specified', async () => {
      const postgresData: TemplateData = {
        ...baseTemplateData,
        databaseProvider: 'postgresql',
      };
      await applyPrismaExtension(TEST_DIR, postgresData);

      const schemaPath = path.join(TEST_DIR, 'packages', 'database', 'prisma', 'schema.prisma');
      const content = await fs.readFile(schemaPath, 'utf8');

      expect(content).toContain('provider = "postgresql"');
    });

    it('should NOT include url in datasource block (Prisma 7)', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const schemaPath = path.join(TEST_DIR, 'packages', 'database', 'prisma', 'schema.prisma');
      const content = await fs.readFile(schemaPath, 'utf8');

      // Extract datasource block
      const datasource = content.match(/datasource db \{[\s\S]*?\}/)?.[0];
      expect(datasource).not.toContain('url');
    });

    it('should include Item model', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const schemaPath = path.join(TEST_DIR, 'packages', 'database', 'prisma', 'schema.prisma');
      const content = await fs.readFile(schemaPath, 'utf8');

      expect(content).toContain('model Item');
      expect(content).toContain('id        String');
      expect(content).toContain('name      String');
      expect(content).toContain('createdAt DateTime');
      expect(content).toContain('updatedAt DateTime');
    });
  });

  describe('Prisma Config (Prisma 7)', () => {
    it('should create valid prisma.config.ts with defineConfig', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const configPath = path.join(TEST_DIR, 'packages', 'database', 'prisma.config.ts');
      const content = await fs.readFile(configPath, 'utf8');

      expect(content).toContain("import { defineConfig, env } from 'prisma/config'");
      expect(content).toContain('export default defineConfig');
    });

    it('should configure schema path', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const configPath = path.join(TEST_DIR, 'packages', 'database', 'prisma.config.ts');
      const content = await fs.readFile(configPath, 'utf8');

      expect(content).toContain("schema: 'prisma/schema.prisma'");
    });

    it('should configure datasource url via env() in config', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const configPath = path.join(TEST_DIR, 'packages', 'database', 'prisma.config.ts');
      const content = await fs.readFile(configPath, 'utf8');

      expect(content).toContain("url: env('DATABASE_URL')");
    });

    it('should configure migrations path and seed', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const configPath = path.join(TEST_DIR, 'packages', 'database', 'prisma.config.ts');
      const content = await fs.readFile(configPath, 'utf8');

      expect(content).toContain("path: 'prisma/migrations'");
      expect(content).toContain("seed: 'tsx prisma/seed.ts'");
    });

    it('should import dotenv/config for env loading', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const configPath = path.join(TEST_DIR, 'packages', 'database', 'prisma.config.ts');
      const content = await fs.readFile(configPath, 'utf8');

      expect(content).toContain("import 'dotenv/config'");
    });
  });

  describe('Environment Files', () => {
    describe('SQLite provider', () => {
      it('should set DATABASE_URL to file path in .env', async () => {
        await applyPrismaExtension(TEST_DIR, baseTemplateData);

        const envPath = path.join(TEST_DIR, 'packages', 'database', '.env');
        const content = await fs.readFile(envPath, 'utf8');

        expect(content).toContain('DATABASE_URL="file:./dev.db"');
      });

      it('should set DATABASE_URL to file path in .env.example', async () => {
        await applyPrismaExtension(TEST_DIR, baseTemplateData);

        const envPath = path.join(TEST_DIR, 'packages', 'database', '.env.example');
        const content = await fs.readFile(envPath, 'utf8');

        expect(content).toContain('DATABASE_URL="file:./dev.db"');
      });
    });

    describe('PostgreSQL provider', () => {
      const postgresTemplateData: TemplateData = {
        ...baseTemplateData,
        databaseProvider: 'postgresql',
      };

      it('should set DATABASE_URL to postgresql connection in .env', async () => {
        await applyPrismaExtension(TEST_DIR, postgresTemplateData);

        const envPath = path.join(TEST_DIR, 'packages', 'database', '.env');
        const content = await fs.readFile(envPath, 'utf8');

        expect(content).toContain('DATABASE_URL="postgresql://');
      });

      it('should set DATABASE_URL to postgresql connection in .env.example', async () => {
        await applyPrismaExtension(TEST_DIR, postgresTemplateData);

        const envPath = path.join(TEST_DIR, 'packages', 'database', '.env.example');
        const content = await fs.readFile(envPath, 'utf8');

        expect(content).toContain('DATABASE_URL="postgresql://');
      });
    });
  });

  describe('GraphQL Integration', () => {
    const graphqlTemplateData: TemplateData = {
      ...baseTemplateData,
      hasGraphql: true,
    };

    it('should include pothos generator when GraphQL is enabled', async () => {
      await applyPrismaExtension(TEST_DIR, graphqlTemplateData);

      const schemaPath = path.join(TEST_DIR, 'packages', 'database', 'prisma', 'schema.prisma');
      const content = await fs.readFile(schemaPath, 'utf8');

      expect(content).toContain('generator pothos');
      expect(content).toContain('provider     = "prisma-pothos-types"');
    });

    it('should add @pothos/plugin-prisma to devDependencies', async () => {
      await applyPrismaExtension(TEST_DIR, graphqlTemplateData);

      const packageJson = await fs.readJson(
        path.join(TEST_DIR, 'packages', 'database', 'package.json')
      );

      expect(packageJson.devDependencies).toHaveProperty('@pothos/plugin-prisma');
    });

    it('should export pothos types in package.json exports', async () => {
      await applyPrismaExtension(TEST_DIR, graphqlTemplateData);

      const packageJson = await fs.readJson(
        path.join(TEST_DIR, 'packages', 'database', 'package.json')
      );

      expect(packageJson.exports['./pothos']).toBe('./generated/pothos.ts');
    });

    it('should NOT include pothos generator when GraphQL is disabled', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const schemaPath = path.join(TEST_DIR, 'packages', 'database', 'prisma', 'schema.prisma');
      const content = await fs.readFile(schemaPath, 'utf8');

      expect(content).not.toContain('generator pothos');
      expect(content).not.toContain('prisma-pothos-types');
    });
  });

  describe('Package.json Configuration', () => {
    it('should include correct scripts', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const packageJson = await fs.readJson(
        path.join(TEST_DIR, 'packages', 'database', 'package.json')
      );

      expect(packageJson.scripts['db:generate']).toBe('prisma generate');
      expect(packageJson.scripts['db:push']).toBe('prisma db push');
      expect(packageJson.scripts['db:migrate']).toBe('prisma migrate dev');
      expect(packageJson.scripts['db:studio']).toBe('prisma studio');
      expect(packageJson.scripts['db:seed']).toBe('tsx prisma/seed.ts');
    });

    it('should include @prisma/client in dependencies', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const packageJson = await fs.readJson(
        path.join(TEST_DIR, 'packages', 'database', 'package.json')
      );

      expect(packageJson.dependencies).toHaveProperty('@prisma/client');
    });

    it('should include prisma in devDependencies', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const packageJson = await fs.readJson(
        path.join(TEST_DIR, 'packages', 'database', 'package.json')
      );

      expect(packageJson.devDependencies).toHaveProperty('prisma');
    });

    it('should include zod in dependencies', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const packageJson = await fs.readJson(
        path.join(TEST_DIR, 'packages', 'database', 'package.json')
      );

      expect(packageJson.dependencies).toHaveProperty('zod');
    });

    it('should set type to module', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const packageJson = await fs.readJson(
        path.join(TEST_DIR, 'packages', 'database', 'package.json')
      );

      expect(packageJson.type).toBe('module');
    });

    it('should have correct exports configuration', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const packageJson = await fs.readJson(
        path.join(TEST_DIR, 'packages', 'database', 'package.json')
      );

      expect(packageJson.exports['.']).toBe('./src/index.ts');
      expect(packageJson.exports['./client']).toBe('./src/index.ts');
      expect(packageJson.exports['./schemas']).toBe('./src/schemas.ts');
    });
  });

  describe('Root Package.json Scripts', () => {
    it('should add db scripts to root package.json', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const rootPackageJson = await fs.readJson(path.join(TEST_DIR, 'package.json'));

      expect(rootPackageJson.scripts['db:generate']).toContain('yarn workspace');
      expect(rootPackageJson.scripts['db:push']).toContain('yarn workspace');
      expect(rootPackageJson.scripts['db:migrate']).toContain('yarn workspace');
      expect(rootPackageJson.scripts['db:studio']).toContain('yarn workspace');
      expect(rootPackageJson.scripts['db:seed']).toContain('yarn workspace');
    });

    it('should reference correct workspace package in scripts', async () => {
      await applyPrismaExtension(TEST_DIR, baseTemplateData);

      const rootPackageJson = await fs.readJson(path.join(TEST_DIR, 'package.json'));

      expect(rootPackageJson.scripts['db:generate']).toContain('@test-project/database');
    });
  });
});
