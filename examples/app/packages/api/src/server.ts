import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createYoga } from 'graphql-yoga';
import { appRouter } from './router/index.js';
import { createContext } from './context.js';
import { schema } from './graphql/schema.js';
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// tRPC middleware
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// GraphQL Yoga middleware
const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  // Enable GraphiQL playground in development
  graphiql: process.env.NODE_ENV !== 'production',
});

app.use('/graphql', yoga);

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to api API',
    endpoints: {
      health: '/health',
      trpc: '/trpc',
      graphql: '/graphql',
      playground: '/trpc-playground' // Available in development
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 tRPC API available at http://localhost:${PORT}/trpc`);
  console.log(`📊 GraphQL API available at http://localhost:${PORT}/graphql`);
  console.log(`🏥 Health check at http://localhost:${PORT}/health`);
}); 