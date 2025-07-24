import { TRPCError } from '@trpc/server';
import type { Context } from '../context.js';

// Middleware function type that works with tRPC
export type MiddlewareFunction = (opts: {
  ctx: Context;
  next: () => Promise<{ ctx: Context }>;
}) => Promise<{ ctx: Context }>;

// Authentication middleware
export const requireAuth: MiddlewareFunction = async ({ ctx, next }) => {
  // Example: Check for authorization header
  const authHeader = ctx.req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Missing or invalid authorization header',
    });
  }

  const token = authHeader.substring(7);
  
  // Here you would validate the token (JWT, session, etc.)
  // For this example, we'll just check if it's not empty
  if (!token) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid token',
    });
  }

  // Add user info to context (replace with your actual user lookup)
  const user = {
    id: 'user-id-from-token',
    email: 'user@example.com',
    // ... other user properties
  };

  return next({
    ctx: {
      ...ctx,
      user, // Add user to context
    },
  });
};

// Role-based authorization middleware
export const requireRole = (role: string): MiddlewareFunction => {
  return async ({ ctx, next }) => {
    const user = (ctx as any).user;
    
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Check if user has required role
    if (!user.roles?.includes(role)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Role '${role}' required`,
      });
    }

    return next();
  };
};

// Logging middleware
export const logger: MiddlewareFunction = async ({ ctx, next }) => {
  const start = Date.now();
  
  console.log(`📝 ${ctx.req.method} ${ctx.req.url} - ${new Date().toISOString()}`);
  
  try {
    const result = await next();
    const duration = Date.now() - start;
    console.log(`✅ Request completed in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.log(`❌ Request failed in ${duration}ms:`, error);
    throw error;
  }
};

// Rate limiting middleware (simple in-memory implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (maxRequests: number, windowMs: number): MiddlewareFunction => {
  return async ({ ctx, next }) => {
    const clientId = ctx.req.ip || 'unknown';
    const now = Date.now();
    
    const clientData = requestCounts.get(clientId);
    
    if (!clientData || now > clientData.resetTime) {
      // Reset or initialize
      requestCounts.set(clientId, {
        count: 1,
        resetTime: now + windowMs,
      });
    } else {
      clientData.count++;
      
      if (clientData.count > maxRequests) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Rate limit exceeded',
        });
      }
    }
    
    return next();
  };
};

// Validation middleware factory
export const validateInput = <T>(schema: import('zod').ZodSchema<T>) => {
  const middleware: MiddlewareFunction = async ({ ctx, next }) => {
    return next();
  };
  return middleware;
};

// Error handling middleware
export const errorHandler: MiddlewareFunction = async ({ ctx, next }) => {
  try {
    return await next();
  } catch (error) {
    // Log the error
    console.error('❌ API Error:', error);
    
    // Re-throw tRPC errors as-is
    if (error instanceof TRPCError) {
      throw error;
    }
    
    // Convert unknown errors to internal server error
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      cause: error,
    });
  }
};

// Middleware composer utility
export const composeMiddleware = (...middlewares: MiddlewareFunction[]): MiddlewareFunction => {
  return async ({ ctx, next }) => {
    let index = 0;
    
    const runMiddleware = async (currentCtx: Context): Promise<{ ctx: Context }> => {
      if (index >= middlewares.length) {
        return next();
      }
      
      const middleware = middlewares[index++];
      return middleware({
        ctx: currentCtx,
        next: () => runMiddleware(currentCtx),
      });
    };
    
    return runMiddleware(ctx);
  };
}; 