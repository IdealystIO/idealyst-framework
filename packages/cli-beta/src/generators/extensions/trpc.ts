/**
 * tRPC extension generator
 */

import fs from 'fs-extra';
import path from 'path';
import { TemplateData, PackageGeneratorResult } from '../../types';
import { copyTemplateDirectory, getTemplatePath } from '../../templates/copier';
import { addDependencies } from '../../templates/merger';
import { DEPENDENCIES } from '../../constants';
import { logger } from '../../utils/logger';

/**
 * Apply tRPC extension to a workspace
 * This adds tRPC to API, web, and mobile packages
 */
export async function applyTrpcExtension(
  projectPath: string,
  data: TemplateData
): Promise<PackageGeneratorResult> {
  logger.info('Configuring tRPC...');

  // Add tRPC to API package
  await addTrpcToApi(projectPath, data);

  // Add tRPC to web package
  await addTrpcToWeb(projectPath, data);

  // Add tRPC to mobile package
  await addTrpcToMobile(projectPath, data);

  // Add tRPC to shared package (for shared types)
  await addTrpcToShared(projectPath, data);

  return { success: true };
}

/**
 * Add tRPC server setup to API package
 */
async function addTrpcToApi(projectPath: string, data: TemplateData): Promise<void> {
  const apiDir = path.join(projectPath, 'packages', 'api');
  const trpcDir = path.join(apiDir, 'src', 'trpc');

  await fs.ensureDir(trpcDir);

  // Create trpc.ts (context and initialization)
  await fs.writeFile(
    path.join(trpcDir, 'trpc.ts'),
    createTrpcInit(data)
  );

  // Create router.ts
  await fs.writeFile(
    path.join(trpcDir, 'router.ts'),
    createTrpcRouter(data)
  );

  // Create routers/index.ts
  await fs.ensureDir(path.join(trpcDir, 'routers'));
  await fs.writeFile(
    path.join(trpcDir, 'routers', 'index.ts'),
    createExampleRouter(data)
  );

  // Add dependencies
  await addDependencies(
    path.join(apiDir, 'package.json'),
    DEPENDENCIES.trpcServer
  );
}

/**
 * Add tRPC client to web package
 */
async function addTrpcToWeb(projectPath: string, data: TemplateData): Promise<void> {
  const webDir = path.join(projectPath, 'packages', 'web');
  const utilsDir = path.join(webDir, 'src', 'utils');

  await fs.ensureDir(utilsDir);

  // Create trpc.ts client
  await fs.writeFile(
    path.join(utilsDir, 'trpc.ts'),
    createTrpcClient(data, 'web')
  );

  // Add dependencies
  await addDependencies(
    path.join(webDir, 'package.json'),
    DEPENDENCIES.trpc
  );
}

/**
 * Add tRPC client to mobile package
 */
async function addTrpcToMobile(projectPath: string, data: TemplateData): Promise<void> {
  const mobileDir = path.join(projectPath, 'packages', 'mobile');
  const utilsDir = path.join(mobileDir, 'src', 'utils');

  await fs.ensureDir(utilsDir);

  // Create trpc.ts client
  await fs.writeFile(
    path.join(utilsDir, 'trpc.ts'),
    createTrpcClient(data, 'mobile')
  );

  // Add dependencies
  await addDependencies(
    path.join(mobileDir, 'package.json'),
    DEPENDENCIES.trpc
  );
}

/**
 * Add tRPC types to shared package
 */
async function addTrpcToShared(projectPath: string, data: TemplateData): Promise<void> {
  const sharedDir = path.join(projectPath, 'packages', 'shared');
  const trpcDir = path.join(sharedDir, 'src', 'trpc');

  await fs.ensureDir(trpcDir);

  // Create shared tRPC client factory
  await fs.writeFile(
    path.join(trpcDir, 'client.ts'),
    createSharedTrpcClient(data)
  );

  // Create index.ts
  await fs.writeFile(
    path.join(trpcDir, 'index.ts'),
    `export * from './client';\n`
  );

  // Add dependencies
  await addDependencies(
    path.join(sharedDir, 'package.json'),
    DEPENDENCIES.trpc
  );
}

/**
 * Create tRPC initialization (server-side)
 */
function createTrpcInit(data: TemplateData): string {
  return `/**
 * tRPC initialization
 */

import { initTRPC } from '@trpc/server';
import { ZodError } from 'zod';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
${data.hasPrisma ? `import { prisma } from '@${data.workspaceScope}/database';` : ''}

/**
 * Create context for each request
 */
export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  return {
    req,
    res,
${data.hasPrisma ? '    prisma,' : ''}
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

/**
 * Initialize tRPC
 */
const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

// Example protected procedure (add your auth logic)
// export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
//   if (!ctx.user) {
//     throw new TRPCError({ code: 'UNAUTHORIZED' });
//   }
//   return next({ ctx: { ...ctx, user: ctx.user } });
// });
`;
}

/**
 * Create tRPC router
 */
function createTrpcRouter(data: TemplateData): string {
  return `/**
 * tRPC router
 */

import { router, publicProcedure, createContext } from './trpc';
import { exampleRouter } from './routers';

export const appRouter = router({
  // Health check
  health: publicProcedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })),

  // Example router
  example: exampleRouter,

  // Add more routers here
});

export type AppRouter = typeof appRouter;
export { createContext };
`;
}

/**
 * Create example router
 */
function createExampleRouter(data: TemplateData): string {
  return `/**
 * Example router
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: \`Hello, \${input.name || 'World'}!\`,
      };
    }),

  // Add more procedures here
});
`;
}

/**
 * Create tRPC client (for web/mobile)
 */
function createTrpcClient(data: TemplateData, platform: 'web' | 'mobile'): string {
  const apiUrl = platform === 'mobile'
    ? 'http://10.0.2.2:3000/trpc' // Android emulator localhost
    : 'http://localhost:3000/trpc';

  return `/**
 * tRPC client for ${platform}
 */

import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@${data.workspaceScope}/api';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: process.env.${platform === 'web' ? 'VITE_' : ''}API_URL || '${apiUrl}',
    }),
  ],
});
`;
}

/**
 * Create shared tRPC client factory
 */
function createSharedTrpcClient(data: TemplateData): string {
  return `/**
 * Shared tRPC client factory
 */

import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import type { AppRouter } from '@${data.workspaceScope}/api';

/**
 * Create a tRPC client with custom configuration
 */
export function createTrpcClient(options: {
  url?: string;
  headers?: () => Record<string, string>;
} = {}) {
  const trpc = createTRPCReact<AppRouter>();

  const client = trpc.createClient({
    links: [
      httpBatchLink({
        url: options.url || 'http://localhost:3000/trpc',
        headers: options.headers,
      }),
    ],
  });

  return { trpc, client };
}

export type { AppRouter };
`;
}
