import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { testRouter } from '../routers/test.js';
import { userRouter } from '../routers/user.js';

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

  // Test CRUD endpoints - generated automatically from Prisma model
  test: testRouter,

  // User CRUD endpoints with extended operations (search, settings, stats)
  users: userRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;

/*
SIMPLIFIED CRUD API SYSTEM:

This API template uses a simplified approach with automatic CRUD generation for Prisma models.

## Quick Start:

1. **Define your Prisma model** in packages/database/schema.prisma
2. **Create Zod schemas** for validation
3. **Generate CRUD router** using createCrudRouter()
4. **Add to main router** 

## Example - Adding a User model:

### 1. Define Prisma model:
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. Create router file (src/routers/user.ts):
```typescript
import { z } from 'zod';
import { createCrudRouter } from '../lib/crud.js';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
});

export const userRouter = createCrudRouter(
  'user',
  createUserSchema,
  updateUserSchema
);
```

### 3. Add to main router:
```typescript
import { userRouter } from '../routers/user.js';

export const appRouter = router({
  // ... other routes
  users: userRouter,
});
```

### 4. Use in frontend:
```typescript
// Get all users
const { data: users } = trpc.users.getAll.useQuery();

// Create user
const createUser = trpc.users.create.useMutation();
await createUser.mutateAsync({ 
  email: 'user@example.com', 
  name: 'John Doe' 
});

// Update user
const updateUser = trpc.users.update.useMutation();
await updateUser.mutateAsync({ 
  id: 'user-id', 
  data: { name: 'Jane Doe' } 
});
```

## Available CRUD Operations:

Each generated router includes:
- `getAll({ skip?, take?, orderBy? })` - List with pagination
- `getById({ id })` - Get single record
- `create(data)` - Create new record
- `update({ id, data })` - Update existing record
- `delete({ id })` - Delete record
- `count({ where? })` - Count records

## Advanced Usage:

### Custom procedures:
You can extend generated routers with custom procedures:

```typescript
import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { createCrudRouter } from '../lib/crud.js';
import { prisma } from '../lib/database.js';

const baseCrudRouter = createCrudRouter('user', createUserSchema);

export const userRouter = router({
  ...baseCrudRouter,
  
  // Add custom procedures
  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      return await prisma.user.findUnique({
        where: { email: input.email }
      });
    }),
});
```

### Authentication & Authorization:
Use middleware for protected procedures:

```typescript
import { protectedProcedure } from '../trpc.js';

// Replace publicProcedure with protectedProcedure in createCrudRouter
// or create a custom version for authenticated routes
```

This simplified system removes the controller layer complexity while providing
type-safe, validated CRUD operations for all your Prisma models.
*/ 