import { TRPCError } from '@trpc/server';
import type { Context } from '../context.js';
import type { MiddlewareFn } from '../lib/controller.js';

// Extended context with user
export interface AuthContext extends Context {
  user: {
    id: string;
    email: string;
    roles?: string[];
  };
}

// Authentication middleware
export const requireAuth: MiddlewareFn = async ({ ctx, next }) => {
  const authHeader = ctx.req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Missing or invalid authorization header',
    });
  }

  const token = authHeader.substring(7);
  
  // Here you would validate the token (JWT, session, etc.)
  // For example purposes, we'll simulate token validation
  if (!token || token === 'invalid') {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid token',
    });
  }

  // Mock user lookup - replace with your actual implementation
  const user = {
    id: 'user-123',
    email: 'user@example.com',
    roles: ['user'],
  };

  return next({
    ctx: {
      ...ctx,
      user,
    } as AuthContext,
  });
};

// Role-based authorization middleware factory
export const requireRole = (requiredRole: string): MiddlewareFn => {
  return async ({ ctx, next }) => {
    const authCtx = ctx as AuthContext;
    
    if (!authCtx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    if (!authCtx.user.roles?.includes(requiredRole)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Role '${requiredRole}' required`,
      });
    }

    return next();
  };
};

// Admin role middleware
export const requireAdmin = requireRole('admin'); 