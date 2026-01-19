/**
 * Prisma extension generator
 */

import fs from 'fs-extra';
import path from 'path';
import { TemplateData, PackageGeneratorResult } from '../../types';
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
 */
async function generatePrismaFiles(
  dbDir: string,
  data: TemplateData
): Promise<void> {
  // Create directory structure
  await fs.ensureDir(path.join(dbDir, 'prisma'));
  await fs.ensureDir(path.join(dbDir, 'src'));

  // Determine database provider based on devcontainer setting
  const usePostgres = data.hasDevcontainer;
  const dbProvider = usePostgres ? 'postgresql' : 'sqlite';

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

  // Try to use template schema.prisma, or generate programmatically
  const templateSchemaPath = getTemplatePath('core', 'database', 'schema.prisma');
  if (await fs.pathExists(templateSchemaPath)) {
    // Read template schema and adjust provider
    let schemaContent = await fs.readFile(templateSchemaPath, 'utf8');

    // Replace provider based on devcontainer setting
    if (usePostgres) {
      schemaContent = schemaContent.replace(
        /provider\s*=\s*"sqlite"/g,
        'provider = "postgresql"'
      );
    }

    // Add pothos generator if GraphQL is enabled
    if (data.hasGraphql) {
      // Insert pothos generator after the client generator
      const pothosGenerator = `
generator pothos {
  provider     = "prisma-pothos-types"
  output       = "./generated/pothos.ts"
  clientOutput = "./client"
}
`;
      schemaContent = schemaContent.replace(
        /(generator client \{[^}]+\})/,
        `$1\n${pothosGenerator}`
      );
    }

    // Process template variables
    const { processTemplateContent } = await import('../../templates/processor');
    schemaContent = processTemplateContent(schemaContent, data);

    await fs.writeFile(
      path.join(dbDir, 'schema.prisma'),
      schemaContent
    );
    logger.dim(`Using showcase schema with ${dbProvider} provider`);
  } else {
    // Generate schema programmatically
    await fs.writeFile(
      path.join(dbDir, 'schema.prisma'),
      createPrismaSchema(dbProvider, data.hasGraphql)
    );
  }

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

  // Create .env.example with appropriate DATABASE_URL
  const envExample = usePostgres
    ? 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app"\n'
    : 'DATABASE_URL="file:./dev.db"\n';
  await fs.writeFile(path.join(dbDir, '.env.example'), envExample);

  // Create .env with default value for local development
  const envContent = usePostgres
    ? 'DATABASE_URL="postgresql://postgres:postgres@db:5432/app"\n'
    : 'DATABASE_URL="file:./dev.db"\n';
  await fs.writeFile(path.join(dbDir, '.env'), envContent);
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
      ...(data.hasGraphql ? { './pothos': './generated/pothos.ts' } : {}),
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
    include: ['src/**/*', 'generated/**/*'],
    exclude: ['node_modules', 'dist'],
  };
}

/**
 * Create Prisma schema
 */
function createPrismaSchema(provider: 'sqlite' | 'postgresql' = 'sqlite', hasGraphql: boolean = false): string {
  const pothosGenerator = hasGraphql ? `
generator pothos {
  provider     = "prisma-pothos-types"
  output       = "./generated/pothos.ts"
  clientOutput = "./client"
}
` : '';

  return `// This is your Prisma schema file
// Learn more: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
  output   = "./generated/client"
}
${pothosGenerator}
datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}

// Example models - customize for your app

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?
  bio       String?
  posts     Post[]
  settings  UserSettings?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String    @id @default(cuid())
  title     String
  content   String?
  published Boolean   @default(false)
  author    User      @relation(fields: [authorId], references: [id])
  authorId  String
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  createdAt DateTime @default(now())
}

model UserSettings {
  id            String  @id @default(cuid())
  user          User    @relation(fields: [userId], references: [id])
  userId        String  @unique
  theme         String  @default("light")
  notifications Boolean @default(true)
}
`;
}

/**
 * Create Prisma index.ts
 */
function createPrismaIndex(): string {
  return `/**
 * Database package exports
 */

import { PrismaClient } from '../generated/client/index.js';

// Prevent multiple instances of Prisma Client in development
declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export { PrismaClient };
export * from '../generated/client/index.js';
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

// User schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

export const updateUserSchema = createUserSchema.partial();

// Post schemas
export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().optional(),
  published: z.boolean().default(false),
});

export const updatePostSchema = createPostSchema.partial();

// Comment schemas
export const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  postId: z.string(),
});

// UserSettings schemas
export const updateUserSettingsSchema = z.object({
  theme: z.enum(['light', 'dark']).optional(),
  notifications: z.boolean().optional(),
});

// Export types
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type CreatePost = z.infer<typeof createPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
export type CreateComment = z.infer<typeof createCommentSchema>;
export type UpdateUserSettings = z.infer<typeof updateUserSettingsSchema>;
`;
}
