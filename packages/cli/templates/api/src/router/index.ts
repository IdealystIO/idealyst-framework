import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { testRouter } from '../controllers/TestController.js';

export const appRouter = router({
  // Simple hello world procedure
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name || 'World'}!`,
        timestamp: new Date().toISOString(),
      };
    }),

  // Health check procedure
  health: publicProcedure.query(() => {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }),

  // Test endpoints for database testing
  test: testRouter,

  // Add your procedures here
  // Example:
  // users: userRouter,
  // posts: postRouter,

  // Example controller integration:
  // Uncomment the lines below and create the corresponding controllers
  
  // 1. Import your controllers at the top:
  // import { userRouter } from '../controllers/UserController.js';
  
  // 2. Add them to the router:
  // users: userRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;

/*
CONTROLLER & MIDDLEWARE SYSTEM USAGE:

This API template includes a controller and middleware system that works seamlessly with tRPC.

## Quick Start with Controllers:

1. Create a controller (see src/controllers/UserController.ts for example):

```typescript
import { z } from 'zod';
import { BaseController, controllerToRouter } from '../lib/controller.js';
import { requireAuth } from '../middleware/auth.js';

export class UserController extends BaseController {
  getAll = this.createQueryWithMiddleware(
    z.object({}),
    [requireAuth],
    async (input, ctx) => {
      return await ctx.prisma.user.findMany();
    }
  );
}

export const userRouter = controllerToRouter({
  getAll: new UserController({} as any).getAll,
});
```

2. Add to main router:

```typescript
import { userRouter } from '../controllers/UserController.js';

export const appRouter = router({
  users: userRouter,
  // ... other routes
});
```

## Available Middleware:

### Authentication:
- `requireAuth` - Requires Bearer token
- `requireRole(role)` - Requires specific role
- `requireAdmin` - Requires admin role

### Utility:
- `logger` - Request/response logging
- `rateLimit(max, window)` - Rate limiting
- `responseTime` - Adds response time header
- `requestId` - Adds unique request ID
- `errorHandler` - Centralized error handling

## Usage Examples:

```typescript
// Public endpoint
getPublicData = this.createQuery(schema, handler);

// Protected endpoint
getPrivateData = this.createQueryWithMiddleware(
  schema,
  [requireAuth],
  handler
);

// Admin-only endpoint
adminAction = this.createMutationWithMiddleware(
  schema,
  [requireAuth, requireAdmin],
  handler
);

// Multiple middleware
complexEndpoint = this.createQueryWithMiddleware(
  schema,
  [logger, rateLimit(10, 60000), requireAuth],
  handler
);
```

This system provides:
✅ Type safety with tRPC
✅ Reusable middleware
✅ Clean controller organization
✅ Easy testing
✅ Consistent error handling
*/ 