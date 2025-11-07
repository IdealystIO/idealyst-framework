# Database Package

This package provides database access and validation schemas for the workspace using Prisma ORM.

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Set up your environment:
```bash
cp .env.example .env
# Edit .env with your database URL
```

3. Generate the Prisma client:
```bash
yarn db:generate
```

4. Push the schema to your database:
```bash
yarn db:push
```

5. Seed the database with test data:
```bash
yarn db:seed
```

## Database Schema

### Test Model

The Test model is included for quick testing and API demonstration:

```prisma
model Test {
  id        String   @id @default(cuid())
  name      String
  message   String
  status    String   @default("active")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Fields:
- `id`: Unique identifier (CUID)
- `name`: Test name/title
- `message`: Test message content
- `status`: Test status (defaults to "active")
- `createdAt`: Record creation timestamp
- `updatedAt`: Record last update timestamp

### Sample Models

The schema also includes comprehensive example models for reference:

#### User Model
- Complete user management with authentication fields
- Email validation and profile information
- Timestamps for tracking

#### Post Model
- Blog post or content management
- User relationship for authorship
- Publishing status and timestamps

#### Comment Model
- Comment system for posts
- User and post relationships
- Moderation support

## Usage

### In API Code

```typescript
import { db } from '@{{workspaceScope}}/database';

// Create a test record
const test = await db.test.create({
  data: {
    name: 'My Test',
    message: 'This is a test message',
    status: 'active'
  }
});

// Get all tests
const tests = await db.test.findMany();

// Update a test
const updatedTest = await db.test.update({
  where: { id: 'test-id' },
  data: { status: 'completed' }
});
```

### Prisma Commands

```bash
# Generate client
yarn prisma:generate

# Run migrations
yarn prisma:migrate

# Reset database
yarn prisma:reset

# Seed database
yarn prisma:seed

# Open Prisma Studio
yarn prisma:studio
```

## Quick Test

The database includes a simple `Test` model for immediate testing:

```typescript
import { prisma } from '@{{workspaceScope}}/{{name}}';

// Get all test entries
const tests = await prisma.test.findMany();

// Create a new test entry
const newTest = await prisma.test.create({
  data: {
    name: 'My Test',
    message: 'Testing the database connection',
    status: 'active',
  },
});
```

## Usage

```typescript
import { prisma, User, TestValidator } from '@{{workspaceScope}}/{{name}}';

// Use the database client
const users = await prisma.user.findMany();

// Use validators
const validatedData = TestValidator.parse(userData);
```

## Scripts

- `yarn db:generate` - Generate Prisma client
- `yarn db:push` - Push schema to database
- `yarn db:migrate` - Create and run migrations
- `yarn db:studio` - Open Prisma Studio
- `yarn db:reset` - Reset the database
- `yarn build` - Build the package
- `yarn dev` - Build in watch mode
