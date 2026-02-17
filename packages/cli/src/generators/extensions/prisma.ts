/**
 * Prisma extension generator
 */

import fs from 'fs-extra';
import path from 'path';
import { TemplateData, PackageGeneratorResult, DatabaseProvider } from '../../types';
import { copyTemplateDirectory, getTemplatePath, templateHasContent } from '../../templates/copier';
import { addScripts } from '../../templates/merger';
import { DEPENDENCIES } from '../../constants';
import { logger } from '../../utils/logger';

/**
 * Apply Prisma extension to a workspace
 */
export async function applyPrismaExtension(
  projectPath: string,
  data: TemplateData
): Promise<PackageGeneratorResult> {
  const dbDir = path.join(projectPath, 'packages', 'database');

  logger.info('Creating database package...');

  await fs.ensureDir(dbDir);

  // Try to use template first, or generate programmatically
  const templatePath = getTemplatePath('extensions', 'prisma');

  if (await templateHasContent(templatePath)) {
    await copyTemplateDirectory(templatePath, dbDir, data);
  } else {
    // Generate programmatically
    await generatePrismaFiles(dbDir, data);
  }

  // Add database scripts to root package.json
  await addScripts(path.join(projectPath, 'package.json'), {
    'db:generate': `yarn workspace @${data.workspaceScope}/database db:generate`,
    'db:push': `yarn workspace @${data.workspaceScope}/database db:push`,
    'db:migrate': `yarn workspace @${data.workspaceScope}/database db:migrate`,
    'db:studio': `yarn workspace @${data.workspaceScope}/database db:studio`,
    'db:seed': `yarn workspace @${data.workspaceScope}/database db:seed`,
  });

  return { success: true };
}

/**
 * Generate Prisma package files programmatically
 * Creates a single schema.prisma with the selected provider
 */
async function generatePrismaFiles(
  dbDir: string,
  data: TemplateData
): Promise<void> {
  const prismaDir = path.join(dbDir, 'prisma');
  await fs.ensureDir(prismaDir);
  await fs.ensureDir(path.join(dbDir, 'src'));

  const provider = data.databaseProvider;

  // Create package.json
  await fs.writeJson(
    path.join(dbDir, 'package.json'),
    createPrismaPackageJson(data),
    { spaces: 2 }
  );

  // Create tsconfig.json
  await fs.writeJson(
    path.join(dbDir, 'tsconfig.json'),
    createPrismaTsConfig(),
    { spaces: 2 }
  );

  // Create schema.prisma with selected provider
  await fs.writeFile(
    path.join(prismaDir, 'schema.prisma'),
    createPrismaSchema(provider, data.hasGraphql)
  );

  // Create prisma.config.ts (Prisma 7+)
  await fs.writeFile(
    path.join(dbDir, 'prisma.config.ts'),
    createPrismaConfig()
  );

  // Create src/index.ts
  await fs.writeFile(
    path.join(dbDir, 'src', 'index.ts'),
    createPrismaIndex()
  );

  // Create src/schemas.ts
  await fs.writeFile(
    path.join(dbDir, 'src', 'schemas.ts'),
    createZodSchemas()
  );

  // Create .env.example
  // Shell environment DATABASE_URL takes precedence over .env file
  const envExample = `# Database connection URL
# Note: Shell environment DATABASE_URL takes precedence over this file
${provider === 'postgresql'
    ? 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app"'
    : 'DATABASE_URL="file:./dev.db"'}
`;
  await fs.writeFile(path.join(dbDir, '.env.example'), envExample);

  // Create .env with default value for local development
  const envContent = provider === 'postgresql'
    ? 'DATABASE_URL="postgresql://postgres:postgres@db:5432/app"\n'
    : 'DATABASE_URL="file:./dev.db"\n';
  await fs.writeFile(path.join(dbDir, '.env'), envContent);

  logger.dim(`Created Prisma schema with ${provider} provider`);
}

/**
 * Create Prisma package.json
 */
function createPrismaPackageJson(data: TemplateData): Record<string, unknown> {
  const devDeps: Record<string, string> = {
    ...DEPENDENCIES.prismaDev,
    'tsx': '^4.7.0',
    'typescript': '^5.0.0',
  };

  // Add @pothos/plugin-prisma for the prisma-pothos-types generator
  // This is needed so `prisma generate` can find the generator
  if (data.hasGraphql) {
    devDeps['@pothos/plugin-prisma'] = DEPENDENCIES.graphqlServerPrisma['@pothos/plugin-prisma'];
  }

  return {
    name: `@${data.workspaceScope}/database`,
    version: data.version,
    type: 'module',
    main: 'src/index.ts',
    types: 'src/index.ts',
    exports: {
      '.': './src/index.ts',
      './client': './src/index.ts',
      './schemas': './src/schemas.ts',
      // Export pothos types when GraphQL is enabled
      ...(data.hasGraphql ? { './pothos': './prisma/generated/pothos.ts' } : {}),
    },
    scripts: {
      'build': 'tsc',
      'db:generate': 'prisma generate',
      'db:push': 'prisma db push',
      'db:migrate': 'prisma migrate dev',
      'db:studio': 'prisma studio',
      'db:seed': 'tsx prisma/seed.ts',
    },
    dependencies: {
      ...DEPENDENCIES.prisma,
      'dotenv': '^16.4.0',
      'zod': '^3.22.0',
    },
    devDependencies: devDeps,
  };
}

/**
 * Create Prisma tsconfig.json
 */
function createPrismaTsConfig(): Record<string, unknown> {
  return {
    compilerOptions: {
      target: 'ES2020',
      module: 'ESNext',
      moduleResolution: 'bundler',
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
      outDir: './dist',
      declaration: true,
    },
    include: ['src/**/*', 'prisma/generated/**/*'],
    exclude: ['node_modules', 'dist'],
  };
}

/**
 * Create Prisma schema file with selected provider
 */
function createPrismaSchema(provider: DatabaseProvider, hasGraphql: boolean = false): string {
  const pothosGenerator = hasGraphql ? `
generator pothos {
  provider     = "prisma-pothos-types"
  output       = "./generated/pothos.ts"
  clientOutput = "./generated/client"
}
` : '';

  return `// Prisma schema - ${provider} provider
// To change providers, regenerate the project with --db-provider flag

generator client {
  provider = "prisma-client-js"
  output   = "./generated/client"
}
${pothosGenerator}
datasource db {
  provider = "${provider}"
}

model Item {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
`;
}

/**
 * Create Prisma config file (Prisma 7+)
 * Uses dotenv to load .env file before accessing DATABASE_URL
 */
function createPrismaConfig(): string {
  return `import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
`;
}

/**
 * Create Prisma index.ts
 */
function createPrismaIndex(): string {
  return `/**
 * Database package exports
 */

import { PrismaClient } from '../prisma/generated/client/index.js';

// Prevent multiple instances of Prisma Client in development
declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export { PrismaClient };
export * from '../prisma/generated/client/index.js';
`;
}

/**
 * Create Zod schemas
 */
function createZodSchemas(): string {
  return `/**
 * Zod validation schemas for database models
 */

import { z } from 'zod';

// Item schemas
export const createItemSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export const updateItemSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().nullable().optional(),
  completed: z.boolean().optional(),
});

// Export types
export type CreateItem = z.infer<typeof createItemSchema>;
export type UpdateItem = z.infer<typeof updateItemSchema>;
`;
}
