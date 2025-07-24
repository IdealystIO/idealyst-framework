import type { Context } from '../context.js';
import type { MiddlewareFn } from '../lib/controller.js';

// Logging middleware
export const logger: MiddlewareFn = async ({ ctx, next }) => {
  const start = Date.now();
  const { method, url } = ctx.req;
  
  console.log(`📝 ${method} ${url} - ${new Date().toISOString()}`);
  
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

// Simple rate limiting middleware (in-memory)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000): MiddlewareFn => {
  return async ({ ctx, next }) => {
    const clientId = ctx.req.ip || ctx.req.socket.remoteAddress || 'unknown';
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
        throw new Error('Rate limit exceeded');
      }
    }
    
    return next();
  };
};

// CORS middleware (though this should typically be handled at Express level)
export const cors: MiddlewareFn = async ({ ctx, next }) => {
  // Set CORS headers (note: this is just for demonstration)
  // In practice, use the cors Express middleware
  ctx.res.setHeader('Access-Control-Allow-Origin', '*');
  ctx.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  ctx.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return next();
};

// Error handling middleware
export const errorHandler: MiddlewareFn = async ({ ctx, next }) => {
  try {
    return await next();
  } catch (error) {
    // Log the error
    console.error('❌ API Error:', error);
    
    // Re-throw the error (tRPC will handle it properly)
    throw error;
  }
};

// Response time header middleware
export const responseTime: MiddlewareFn = async ({ ctx, next }) => {
  const start = Date.now();
  
  const result = await next();
  
  const duration = Date.now() - start;
  ctx.res.setHeader('X-Response-Time', `${duration}ms`);
  
  return result;
};

// Request ID middleware
export const requestId: MiddlewareFn = async ({ ctx, next }) => {
  const id = Math.random().toString(36).substring(2, 15);
  
  // Add request ID to context
  const newCtx = {
    ...ctx,
    requestId: id,
  };
  
  // Set response header
  ctx.res.setHeader('X-Request-ID', id);
  
  return next({
    ctx: newCtx,
  });
}; 