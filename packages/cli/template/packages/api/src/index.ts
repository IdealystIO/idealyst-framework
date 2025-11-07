// Main exports for the API
export { appRouter } from './router/index.js';
export type { AppRouter } from './router/index.js';

// Export context type for client usage
export type { Context } from './context.js';

// Export CRUD utilities for creating routers
export { createCrudRouter } from './lib/crud.js'; 