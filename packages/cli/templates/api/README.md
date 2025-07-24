# {{projectName}}

{{description}}

This API project is built with:
- **tRPC** - End-to-end typesafe APIs
- **Prisma** - Modern database toolkit
- **Zod** - TypeScript-first schema validation
- **Express.js** - Web framework for Node.js
- **TypeScript** - Type-safe JavaScript

## Quick Start

1. **Setup environment variables:**
   ```bash
   cp env.example .env
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Setup database:**
   ```bash
   # Generate Prisma client
   yarn db:generate
   
   # Push schema to database (for development)
   yarn db:push
   
   # Or run migrations (for production)
   yarn db:migrate
   ```

4. **Start development server:**
   ```bash
   yarn dev
   ```

The API will be available at `http://localhost:3000`

## Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn db:generate` - Generate Prisma client
- `yarn db:push` - Push schema changes to database
- `yarn db:studio` - Open Prisma Studio (database GUI)
- `yarn db:migrate` - Run database migrations
- `yarn db:reset` - Reset database and run all migrations
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

## Database

This project uses SQLite by default for development. You can switch to PostgreSQL or MySQL by updating the `DATABASE_URL` in your `.env` file and the `provider` in `prisma/schema.prisma`.

### Database Schema

The schema starts empty - you can add your own models in `prisma/schema.prisma`. Example model structure is provided in comments.

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
      return ctx.prisma.post.findMany({
        where: { published: input.published }
      });
    }
  );

  // Protected endpoint with middleware
  create = this.createMutationWithMiddleware(
    createPostSchema,
    [logger, rateLimit(5, 60000), requireAuth],
    async (input, ctx) => {
      return ctx.prisma.post.create({ data: input });
    }
  );

  // Admin-only endpoint
  delete = this.createMutationWithMiddleware(
    z.object({ id: z.string() }),
    [requireAuth, requireAdmin],
    async (input, ctx) => {
      return ctx.prisma.post.delete({ where: { id: input.id } });
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

Copy `env.example` to `.env` and configure:

- `DATABASE_URL` - Database connection string
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - CORS origin for client requests

## Deployment

1. Build the project: `yarn build`
2. Set up your production database
3. Run migrations: `yarn db:migrate`
4. Start the server: `yarn start`

## Learn More

- [tRPC Documentation](https://trpc.io/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Zod Documentation](https://zod.dev/)
- [Express.js Documentation](https://expressjs.com/) 