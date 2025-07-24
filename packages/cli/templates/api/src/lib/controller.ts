import { z } from 'zod';
import type { Context } from '../context.js';
import { publicProcedure } from '../trpc.js';

// Base controller class
export abstract class BaseController {
  protected ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  // Helper method to create a query procedure
  protected createQuery<TInput, TOutput>(
    inputSchema: z.ZodSchema<TInput>,
    handler: (input: TInput, ctx: Context) => Promise<TOutput> | TOutput
  ) {
    return publicProcedure
      .input(inputSchema)
      .query(async ({ input, ctx }) => {
        return handler(input, ctx);
      });
  }

  // Helper method to create a mutation procedure
  protected createMutation<TInput, TOutput>(
    inputSchema: z.ZodSchema<TInput>,
    handler: (input: TInput, ctx: Context) => Promise<TOutput> | TOutput
  ) {
    return publicProcedure
      .input(inputSchema)
      .mutation(async ({ input, ctx }) => {
        return handler(input, ctx);
      });
  }

  // Helper method to create a query with middleware
  protected createQueryWithMiddleware<TInput, TOutput>(
    inputSchema: z.ZodSchema<TInput>,
    middleware: MiddlewareFn[],
    handler: (input: TInput, ctx: Context) => Promise<TOutput> | TOutput
  ) {
    let procedure = publicProcedure.input(inputSchema);
    
    // Apply middleware
    for (const mw of middleware) {
      procedure = procedure.use(mw);
    }
    
    return procedure.query(async ({ input, ctx }) => {
      return handler(input, ctx);
    });
  }

  // Helper method to create a mutation with middleware
  protected createMutationWithMiddleware<TInput, TOutput>(
    inputSchema: z.ZodSchema<TInput>,
    middleware: MiddlewareFn[],
    handler: (input: TInput, ctx: Context) => Promise<TOutput> | TOutput
  ) {
    let procedure = publicProcedure.input(inputSchema);
    
    // Apply middleware
    for (const mw of middleware) {
      procedure = procedure.use(mw);
    }
    
    return procedure.mutation(async ({ input, ctx }) => {
      return handler(input, ctx);
    });
  }
}

// Middleware function type compatible with tRPC
export type MiddlewareFn = (opts: {
  ctx: Context;
  next: () => Promise<{ ctx: Context }>;
}) => Promise<{ ctx: Context }>;

// Controller method decorator type
export interface ControllerMethod {
  [key: string]: ReturnType<typeof publicProcedure.query> | ReturnType<typeof publicProcedure.mutation>;
}

// Helper function to convert controller to tRPC router object
export function controllerToRouter<T extends Record<string, any>>(
  controllerMethods: T
): T {
  return controllerMethods;
} 