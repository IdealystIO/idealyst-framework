# Database Package

This package provides database access and validation schemas for the workspace.

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
