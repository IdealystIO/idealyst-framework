// Export Prisma client
export { PrismaClient } from '@prisma/client';

// Export database client instance
export { default as db } from './client';

// Export Zod schemas
export * from './schemas';

// Export types from Prisma
export type * from '@prisma/client';
