# {{projectName}}

{{description}}

This API project is built with:
- **tRPC** - End-to-end typesafe APIs
- **Zod** - TypeScript-first schema validation
- **Express.js** - Web framework for Node.js
- **TypeScript** - Type-safe JavaScript

## Quick Start

1. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Start development server:**
   ```bash
   yarn dev
   ```

The API will be available at `http://localhost:3000`

## Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn type-check` - Run TypeScript type checking

## API Endpoints

### tRPC Routes

All tRPC routes are available at `/trpc/[procedure]`

#### Example Routes
- `hello` - Simple greeting endpoint (accepts optional name parameter)
- `health` - API health check with timestamp

### REST Endpoints
- `GET /` - API information
- `GET /health` - Health check

## Connecting to a Database

For database functionality, create a separate database package using:
```bash
idealyst create my-database --type database
```

Then import and use it in your API:
```typescript
// In your API context or controllers
import { db } from '@your-org/my-database';

// Use the database client
const users = await db.user.findMany();
```

## Development

### Adding New Routes

You can add routes in two ways:

#### 1. Simple tRPC Procedures (Traditional)
1. Create a new router file in `src/router/`
2. Define your procedures with Zod schemas for validation
3. Export the router and add it to `src/router/index.ts`

#### 2. Controller & Middleware System (Recommended)
This template includes a powerful controller and middleware system:

1. **Create a Controller:**
```typescript
// src/controllers/PostController.ts
import { z } from 'zod';
import { BaseController, controllerToRouter } from '../lib/controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { logger, rateLimit } from '../middleware/common.js';

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
});

export class PostController extends BaseController {
  // Public endpoint
  getAll = this.createQuery(
    z.object({ published: z.boolean().optional() }),
    async (input, ctx) => {
      // Mock data - replace with your database calls
      return [
        { id: '1', title: 'Post 1', content: 'Content 1', published: true },
        { id: '2', title: 'Post 2', content: 'Content 2', published: false },
      ];
    }
  );

  // Protected endpoint with middleware
  create = this.createMutationWithMiddleware(
    createPostSchema,
    [logger, rateLimit(5, 60000), requireAuth],
    async (input, ctx) => {
      // Mock creation - replace with your database calls
      return { id: '3', ...input, published: false };
    }
  );

  // Admin-only endpoint
  delete = this.createMutationWithMiddleware(
    z.object({ id: z.string() }),
    [requireAuth, requireAdmin],
    async (input, ctx) => {
      // Mock deletion - replace with your database calls
      return { success: true, deletedId: input.id };
    }
  );
}

export const postRouter = controllerToRouter({
  getAll: new PostController({} as any).getAll,
  create: new PostController({} as any).create,
  delete: new PostController({} as any).delete,
});
```

2. **Add to Main Router:**
```typescript
// src/router/index.ts
import { postRouter } from '../controllers/PostController.js';

export const appRouter = router({
  posts: postRouter,
  // ... other routes
});
```

### Available Middleware

#### Authentication
- `requireAuth` - Requires Bearer token authentication
- `requireRole(role)` - Requires specific user role
- `requireAdmin` - Requires admin role

#### Utility Middleware
- `logger` - Request/response logging with timing
- `rateLimit(maxRequests, windowMs)` - Rate limiting per IP
- `responseTime` - Adds X-Response-Time header
- `requestId` - Adds unique X-Request-ID header
- `errorHandler` - Centralized error handling

### Example tRPC Client Usage

```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './path/to/your/api';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

// Use the client
const greeting = await client.hello.query({ name: 'John' });
const healthStatus = await client.health.query();
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - CORS origin for client requests

## Deployment

1. Build the project: `yarn build`
2. Start the server: `yarn start`

## Learn More

- [tRPC Documentation](https://trpc.io/)
- [Zod Documentation](https://zod.dev/)
- [Express.js Documentation](https://expressjs.com/) 