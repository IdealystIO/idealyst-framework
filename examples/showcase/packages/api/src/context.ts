import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export interface Context {
  req: CreateExpressContextOptions['req'];
  res: CreateExpressContextOptions['res'];
}

export const createContext = ({ req, res }: CreateExpressContextOptions): Context => {
  return {
    req,
    res,
  };
};

export type { CreateExpressContextOptions };
