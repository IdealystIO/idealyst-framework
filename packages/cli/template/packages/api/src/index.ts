// Main exports for the API

// ============================================
// tRPC Exports
// ============================================
export { appRouter } from './router/index.js';
export type { AppRouter } from './router/index.js';

// Export tRPC utilities for creating routers
export { router, publicProcedure } from './trpc.js';

// ============================================
// GraphQL Exports
// ============================================
export { schema as graphqlSchema, yoga, builder } from './graphql/index.js';

// ============================================
// Shared Exports
// ============================================

// Export context types for client usage
export type { Context } from './context.js';
export { createContext, createGraphQLContext } from './context.js';

// Export Prisma client for direct database access if needed
export { prisma } from './lib/database.js'; 