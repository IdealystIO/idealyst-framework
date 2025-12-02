import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type { Request, Response } from 'express';

/**
 * Shared Context
 *
 * This context is used by both tRPC and GraphQL handlers.
 * It provides access to the request/response objects and any
 * shared dependencies like database clients or authenticated user info.
 */
export interface Context {
  req: Request;
  res: Response;
  // Add your dependencies here (e.g., database client, external services)
  // Example: db: PrismaClient;
  // Example: user: User | null;
}

/**
 * Create tRPC Context
 *
 * Factory function for creating the context for tRPC procedures.
 * Called for each incoming tRPC request.
 */
export const createContext = ({ req, res }: CreateExpressContextOptions): Context => {
  return {
    req,
    res,
    // Initialize your dependencies here
    // Example: db: prisma,
    // Example: user: await getUserFromToken(req.headers.authorization),
  };
};

/**
 * Create GraphQL Context
 *
 * Factory function for creating the context for GraphQL resolvers.
 * This is called by GraphQL Yoga for each incoming request.
 *
 * Note: The GraphQL Yoga context factory is defined in src/graphql/index.ts
 * and uses this same Context interface for consistency.
 */
export const createGraphQLContext = (req: Request, res: Response): Context => {
  return {
    req,
    res,
    // Same initialization as tRPC context
  };
};

export type { CreateExpressContextOptions }; 