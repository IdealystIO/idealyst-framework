# api API

API server template with tRPC and Express

A simplified tRPC API with automatic CRUD generation for Prisma models.

This API project is built with:
- **tRPC** - End-to-end```typescript
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
```Zod** - TypeScript-first schema validation
- **Express.js** - Web framework for Node.js
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Next-generation ORM for database access

## Quick Start

1. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Setup database:**
   ```bash
   # Generate Prisma client
   yarn prisma:generate
   
   # Run migrations
   yarn prisma:migrate
   
   # Seed database with sample data
   yarn prisma:seed
   ```

4. **Start development server:**
   ```bash
   yarn dev
   ```

The API will be available at `http://localhost:3000`

## Creating CRUD APIs

This template provides a simple way to create type-safe APIs with automatic CRUD operations for your Prisma models.

### 1. Define Your Prisma Model

Add models to `packages/database/schema.prisma`:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. Create a Router

Create `src/routers/user.ts`:

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

### 3. Add to Main Router

Update `src/router/index.ts`:

```typescript
import { userRouter } from '../routers/user.js';

export const appRouter = router({
  // ... existing routes
  users: userRouter,
});
```

### 4. Use in Frontend

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

// Delete user
const deleteUser = trpc.users.delete.useMutation();
await deleteUser.mutateAsync({ id: 'user-id' });
```

## Generated CRUD Operations

Each `createCrudRouter` call generates:

- `getAll({ skip?, take?, orderBy? })` - List with pagination
- `getById({ id })` - Get single record
- `create(data)` - Create new record
- `update({ id, data })` - Update existing record  
- `delete({ id })` - Delete record
- `count({ where? })` - Count records

## Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build production bundle
- `yarn start` - Start production server
- `yarn test` - Run tests
- `yarn lint` - Lint code
- `yarn type-check` - Check TypeScript types

## Project Structure

```
src/
├── router/
│   └── index.ts          # Main router definition
├── routers/
│   ├── test.ts          # Example CRUD router for Test model
│   └── user.example.ts  # Example CRUD router for User model
├── lib/
│   ├── crud.ts          # CRUD router generator
│   └── database.ts      # Database connection
├── context.ts           # tRPC context
├── trpc.ts             # tRPC setup
└── server.ts           # Express server setup
```

## Advanced Usage

### Custom Procedures

Extend generated routers with custom procedures:

```typescript
import { router, publicProcedure } from '../trpc.js';
import { createCrudRouter } from '../lib/crud.js';

const baseCrudRouter = createCrudRouter('user', createUserSchema);

export const userRouter = router({
  ...baseCrudRouter,
  
  // Add custom procedures
  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      return await db.user.findUnique({
        where: { email: input.email }
      });
    }),
});
```

### Authentication

For protected routes, you can add authentication middleware to the tRPC setup or create protected procedures:

```typescript
import { protectedProcedure } from '../trpc.js';

// Use protectedProcedure instead of publicProcedure in your CRUD router
```

## Development

1. **Add New Model**: 
   - Add to Prisma schema
   - Run `yarn db:migrate`
   - Create router with `createCrudRouter`
   - Add to main router

2. **Test API**: 
   - Start development: `yarn dev`
   - API available at `http://localhost:3000/trpc`

3. **Type Safety**: 
   - All operations are fully type-safe
   - Frontend gets autocomplete and validation
   - Schemas ensure data integrity

This simplified approach removes controller complexity while maintaining full type safety and providing powerful CRUD operations for all your Prisma models.

## Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL="file:./dev.db"

# API
PORT=3000
NODE_ENV=development

# Add your environment variables here
```

## Testing

The project includes Jest for testing:

```typescript
import { createContext } from '../src/context.js';
import { appRouter } from '../src/router/index.js';

describe('API Tests', () => {
  test('should get test records', async () => {
    const ctx = createContext({} as any);
    const caller = appRouter.createCaller(ctx);
    
    const tests = await caller.test.getAll({});
    expect(tests).toBeDefined();
  });
});
```

Run tests with:
```bash
yarn test
```