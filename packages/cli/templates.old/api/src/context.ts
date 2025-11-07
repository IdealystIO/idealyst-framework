import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export interface Context {
  req: CreateExpressContextOptions['req'];
  res: CreateExpressContextOptions['res'];
  // Add your dependencies here (e.g., database client, external services)
  // Example: db: PrismaClient;
}

export const createContext = ({ req, res }: CreateExpressContextOptions): Context => {
  return {
    req,
    res,
    // Initialize your dependencies here
    // Example: db: prisma,
  };
};

export type { CreateExpressContextOptions }; 