import { PrismaClient } from '@prisma/client';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

// Create Prisma client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export interface Context {
  prisma: PrismaClient;
  req: CreateExpressContextOptions['req'];
  res: CreateExpressContextOptions['res'];
}

export const createContext = ({ req, res }: CreateExpressContextOptions): Context => {
  return {
    prisma,
    req,
    res,
  };
};

export type { CreateExpressContextOptions }; 