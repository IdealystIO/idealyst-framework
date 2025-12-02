import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './router/index.js';
import { createContext } from './context.js';
import { yoga } from './graphql/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Parse JSON bodies (needed for some GraphQL clients)
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// tRPC middleware - for internal TypeScript clients
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// GraphQL middleware - for public API, mobile clients, etc.
// GraphQL Yoga handles the /graphql endpoint
// Using all() to handle both GET (GraphiQL) and POST (queries)
app.all('/graphql', yoga as unknown as express.RequestHandler);

// Default route
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to {{projectName}} API',
    endpoints: {
      health: '/health',
      trpc: '/trpc',
      graphql: '/graphql',
      graphiql: process.env.NODE_ENV !== 'production' ? '/graphql' : undefined,
    },
    documentation: {
      trpc: 'Use tRPC for internal TypeScript clients with full type safety',
      graphql: 'Use GraphQL for public APIs, mobile apps, and third-party integrations',
    },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 tRPC API available at http://localhost:${PORT}/trpc`);
  console.log(`📊 GraphQL API available at http://localhost:${PORT}/graphql`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🎮 GraphiQL Playground at http://localhost:${PORT}/graphql`);
  }
  console.log(`🏥 Health check at http://localhost:${PORT}/health`);
}); 