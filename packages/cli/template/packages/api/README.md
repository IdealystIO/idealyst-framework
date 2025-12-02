# {{projectName}} API

{{description}}

A dual-API backend with both **tRPC** (for internal TypeScript clients) and **GraphQL** (for public APIs and mobile apps).

## Tech Stack

- **tRPC** - End-to-end type-safe APIs for TypeScript clients
- **GraphQL + Pothos** - Code-first GraphQL schema with Prisma integration
- **GraphQL Yoga** - Modern, performant GraphQL server
- **Zod** - TypeScript-first schema validation
- **Express.js** - Web framework for Node.js
- **Prisma** - Next-generation ORM for database access
- **TypeScript** - Type-safe JavaScript

## API Architecture

```
┌─────────────────────────────────────────────────┐
│              Single Express Server              │
│                 (port 3000)                     │
├─────────────────────────────────────────────────┤
│                                                 │
│   GET  /health        → Health check            │
│   POST /trpc/*        → tRPC procedures         │
│   POST /graphql       → GraphQL queries         │
│   GET  /graphql       → GraphiQL Playground     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### When to Use Each

| Use Case | Recommended API |
|----------|----------------|
| Internal web app (TypeScript) | tRPC |
| Mobile apps (React Native, iOS, Android) | GraphQL |
| Third-party integrations | GraphQL |
| Admin dashboards | tRPC |
| Auth flows (login, register) | tRPC |
| Public data queries | GraphQL |
| File uploads | tRPC |

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
   # Generate Prisma client and Pothos types
   yarn generate

   # Run migrations
   cd ../database && yarn db:migrate

   # Seed database with sample data
   yarn db:seed
   ```

4. **Start development server:**
   ```bash
   yarn dev
   ```

The API will be available at:
- **tRPC**: `http://localhost:3000/trpc`
- **GraphQL**: `http://localhost:3000/graphql`
- **GraphiQL Playground**: `http://localhost:3000/graphql` (in development)

## Test API - tRPC vs GraphQL Comparison

The template includes a `Test` model with equivalent implementations in both tRPC and GraphQL, demonstrating how the same functionality can be exposed through both APIs.

### API Equivalence Table

| Operation | tRPC | GraphQL |
|-----------|------|---------|
| Get all | `trpc.test.getAll({ skip, take })` | `query { tests(skip, take) { ... } }` |
| Get by ID | `trpc.test.getById({ id })` | `query { test(id) { ... } }` |
| Create | `trpc.test.create({ name, message })` | `mutation { createTest(input) { ... } }` |
| Update | `trpc.test.update({ id, data })` | `mutation { updateTest(id, input) { ... } }` |
| Delete | `trpc.test.delete({ id })` | `mutation { deleteTest(id) { ... } }` |
| Count | `trpc.test.count({})` | `query { testCount }` |

### tRPC Usage (TypeScript Client)

```typescript
import { trpc } from './utils/trpc';

// Get all tests
const { data: tests } = trpc.test.getAll.useQuery({ take: 10 });

// Get test by ID
const { data: test } = trpc.test.getById.useQuery({ id: 'test-id' });

// Create a new test
const createTest = trpc.test.create.useMutation();
await createTest.mutateAsync({
  name: 'My Test',
  message: 'Hello World',
  status: 'active',
});

// Update a test
const updateTest = trpc.test.update.useMutation();
await updateTest.mutateAsync({
  id: 'test-id',
  data: { name: 'Updated Name' },
});

// Delete a test
const deleteTest = trpc.test.delete.useMutation();
await deleteTest.mutateAsync({ id: 'test-id' });

// Get count
const { data: count } = trpc.test.count.useQuery({});
```

### GraphQL Usage

Visit `http://localhost:3000/graphql` to access the GraphiQL playground.

```graphql
# Get all tests (equivalent to trpc.test.getAll)
query GetTests {
  tests(take: 10) {
    id
    name
    message
    status
    createdAt
  }
}

# Get test by ID (equivalent to trpc.test.getById)
query GetTest($id: String!) {
  test(id: $id) {
    id
    name
    message
    status
  }
}

# Create a new test (equivalent to trpc.test.create)
mutation CreateTest {
  createTest(input: {
    name: "My Test"
    message: "Hello World"
    status: "active"
  }) {
    id
    name
    message
  }
}

# Update a test (equivalent to trpc.test.update)
mutation UpdateTest($id: String!) {
  updateTest(id: $id, input: { name: "Updated Name" }) {
    id
    name
  }
}

# Delete a test (equivalent to trpc.test.delete)
mutation DeleteTest($id: String!) {
  deleteTest(id: $id) {
    id
  }
}

# Get count (equivalent to trpc.test.count)
query GetTestCount {
  testCount
}
```

### GraphQL with React/Apollo Client

```typescript
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_TESTS = gql`
  query GetTests($take: Int) {
    tests(take: $take) {
      id
      name
      message
      status
    }
  }
`;

const CREATE_TEST = gql`
  mutation CreateTest($input: CreateTestInput!) {
    createTest(input: $input) {
      id
      name
    }
  }
`;

// In your component
function TestList() {
  const { data, loading } = useQuery(GET_TESTS, { variables: { take: 10 } });
  const [createTest] = useMutation(CREATE_TEST);

  const handleCreate = async () => {
    await createTest({
      variables: {
        input: { name: 'New Test', message: 'Hello!' },
      },
    });
  };

  return (/* ... */);
}
```

## Adding New Models

### Step 1: Define Prisma Model

Add to `packages/database/prisma/schema.prisma`:

```prisma
model Product {
  id        String   @id @default(cuid())
  name      String
  price     Float
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Step 2: Create tRPC Router

Create `src/routers/product.ts`:

```typescript
import { z } from 'zod';
import { createCrudRouter } from '../lib/crud.js';

const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
});

export const productRouter = createCrudRouter('Product', createProductSchema);
```

Add to `src/router/index.ts`:

```typescript
import { productRouter } from '../routers/product.js';

export const appRouter = router({
  test: testRouter,
  product: productRouter,  // Add here
});
```

### Step 3: Create GraphQL Type

Create `src/graphql/types/product.ts`:

```typescript
import { builder } from '../builder.js';
import { prisma } from '../../lib/database.js';

builder.prismaObject('Product', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    price: t.exposeFloat('price'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
  }),
});

builder.queryFields((t) => ({
  products: t.prismaField({
    type: ['Product'],
    args: {
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args) => {
      return prisma.product.findMany({
        ...query,
        skip: args.skip ?? undefined,
        take: args.take ?? 10,
      });
    },
  }),
}));

const CreateProductInput = builder.inputType('CreateProductInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    price: t.float({ required: true }),
  }),
});

builder.mutationFields((t) => ({
  createProduct: t.prismaField({
    type: 'Product',
    args: {
      input: t.arg({ type: CreateProductInput, required: true }),
    },
    resolve: async (query, _root, args) => {
      return prisma.product.create({
        ...query,
        data: args.input,
      });
    },
  }),
}));
```

Register in `src/graphql/types/index.ts`:

```typescript
import './product.js';
```

### Step 4: Regenerate Types

```bash
yarn generate
```

## Project Structure

```
src/
├── graphql/
│   ├── builder.ts        # Pothos schema builder setup
│   ├── generated.ts      # Auto-generated Prisma types
│   ├── index.ts          # GraphQL Yoga server
│   └── types/
│       ├── index.ts      # Type registration
│       ├── test.ts       # Test model (active)
│       ├── user.ts       # User model (example)
│       ├── post.ts       # Post model (example)
│       └── comment.ts    # Comment model (example)
├── router/
│   └── index.ts          # Main tRPC router
├── routers/
│   ├── test.ts           # Test tRPC CRUD router
│   └── user.example.ts   # User tRPC example
├── lib/
│   ├── crud.ts           # tRPC CRUD generator
│   └── database.ts       # Prisma client
├── context.ts            # Shared context
├── trpc.ts               # tRPC setup
├── index.ts              # Exports
└── server.ts             # Express server
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start development server with hot reload |
| `yarn build` | Build production bundle |
| `yarn start` | Start production server |
| `yarn generate` | Generate Prisma client and Pothos types |
| `yarn test` | Run tests |
| `yarn lint` | Lint code |
| `yarn type-check` | Check TypeScript types |

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# API
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## Testing

### Testing tRPC

```typescript
import { createContext } from '../src/context.js';
import { appRouter } from '../src/router/index.js';

describe('tRPC Test API', () => {
  test('should get all tests', async () => {
    const ctx = createContext({} as any);
    const caller = appRouter.createCaller(ctx);

    const tests = await caller.test.getAll({ take: 10 });
    expect(tests).toBeDefined();
  });

  test('should create a test', async () => {
    const ctx = createContext({} as any);
    const caller = appRouter.createCaller(ctx);

    const test = await caller.test.create({
      name: 'Test Name',
      message: 'Test Message',
    });
    expect(test.id).toBeDefined();
    expect(test.name).toBe('Test Name');
  });
});
```

### Testing GraphQL

```typescript
import { schema } from '../src/graphql/index.js';
import { graphql } from 'graphql';

describe('GraphQL Test API', () => {
  test('should query tests', async () => {
    const query = `
      query {
        tests(take: 5) {
          id
          name
          message
        }
      }
    `;

    const result = await graphql({ schema, source: query });
    expect(result.errors).toBeUndefined();
    expect(result.data?.tests).toBeDefined();
  });

  test('should create a test', async () => {
    const mutation = `
      mutation {
        createTest(input: {
          name: "Test Name"
          message: "Test Message"
        }) {
          id
          name
        }
      }
    `;

    const result = await graphql({ schema, source: mutation });
    expect(result.errors).toBeUndefined();
    expect(result.data?.createTest.name).toBe('Test Name');
  });
});
```

## Advanced: Shared Service Layer

For complex business logic, use a shared service layer:

```typescript
// src/services/test.service.ts
import { prisma } from '../lib/database.js';

export const testService = {
  async getAll(options: { skip?: number; take?: number }) {
    return prisma.test.findMany({
      skip: options.skip,
      take: options.take ?? 10,
      orderBy: { createdAt: 'desc' },
    });
  },

  async create(data: { name: string; message: string; status?: string }) {
    // Add business logic, validation, etc.
    return prisma.test.create({ data });
  },
};

// Use in tRPC (src/routers/test.ts)
import { testService } from '../services/test.service.js';

export const testRouter = router({
  getAll: publicProcedure
    .input(z.object({ skip: z.number().optional(), take: z.number().optional() }))
    .query(({ input }) => testService.getAll(input)),
});

// Use in GraphQL (src/graphql/types/test.ts)
builder.queryFields((t) => ({
  tests: t.field({
    type: [TestType],
    args: { skip: t.arg.int(), take: t.arg.int() },
    resolve: (_, args) => testService.getAll(args),
  }),
}));
```

This ensures consistent business logic across both APIs.
