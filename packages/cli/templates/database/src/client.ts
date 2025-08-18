import { PrismaClient } from '@prisma/client';

declare global {
  // Prevent multiple instances of Prisma Client in development
  var __globalPrisma: PrismaClient | undefined;
}

const prisma =
  globalThis.__globalPrisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__globalPrisma = prisma;
}

export default prisma;
