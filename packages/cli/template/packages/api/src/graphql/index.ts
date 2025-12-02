import { createYoga } from 'graphql-yoga';
import { builder } from './builder.js';
import type { Context } from '../context.js';

// Import all type definitions to register them with the builder
import './types/index.js';

/**
 * Build the GraphQL Schema
 *
 * The schema is built from all types registered with the Pothos builder.
 * Type definitions are automatically imported from the types directory.
 */
export const schema = builder.toSchema();

/**
 * GraphQL Yoga Configuration
 *
 * Creates the GraphQL Yoga server instance configured for use with Express.
 * Yoga handles:
 * - GraphQL query execution
 * - GraphQL Playground (in development)
 * - Subscriptions (WebSocket support)
 * - File uploads (multipart requests)
 * - Batching
 */
export interface YogaContext {
  req: Express.Request;
  res: Express.Response;
}

export const yoga = createYoga<YogaContext>({
  schema,
  // GraphQL endpoint path (will be mounted at /graphql in server.ts)
  graphqlEndpoint: '/graphql',

  // Enable GraphiQL playground in development
  graphiql: process.env.NODE_ENV !== 'production',

  // Landing page configuration
  landingPage: process.env.NODE_ENV !== 'production',

  // Context factory - creates the context for each request
  context: async ({ req, res }): Promise<Context> => {
    return {
      req: req as any,
      res: res as any,
      // Add additional context here (e.g., authenticated user)
    };
  },

  // Logging configuration
  logging: {
    debug: (...args) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[GraphQL]', ...args);
      }
    },
    info: (...args) => console.info('[GraphQL]', ...args),
    warn: (...args) => console.warn('[GraphQL]', ...args),
    error: (...args) => console.error('[GraphQL]', ...args),
  },

  // Enable CORS handling (coordinate with Express CORS)
  cors: false, // Let Express handle CORS

  // Mask errors in production
  maskedErrors: process.env.NODE_ENV === 'production',
});

// Export schema for testing and introspection
export { schema as graphqlSchema };

// Export builder for extensions
export { builder } from './builder.js';
