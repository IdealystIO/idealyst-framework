// Main exports for the API
export { appRouter } from './router/index.js';
export type { AppRouter } from './router/index.js';

// Export context type for client usage
export type { Context } from './context.js';

// Export middleware for potential external usage
export * from './middleware/auth.js';
export * from './middleware/common.js';

// Export controller base classes for extensions
export { BaseController, controllerToRouter } from './lib/controller.js';
export type { MiddlewareFn } from './lib/controller.js'; 