# {{projectName}}

{{description}}

A database layer built with Prisma and TypeScript, designed to be shared across multiple applications in your monorepo.

## Features

- 🗄️ **Prisma ORM** - Type-safe database access
- 📝 **Zod Schemas** - Runtime validation matching your database models
- 📦 **Exportable Client** - Share database access across packages
- 🔒 **TypeScript** - Full type safety
- 🧪 **Testing Setup** - Jest configuration for database testing
- 🔄 **Migration Scripts** - Database versioning and seeding

## Getting Started

1. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

2. **Generate Prisma Client**
   ```bash
   yarn db:generate
   ```

3. **Push Schema to Database**
   ```bash
   yarn db:push
   ```

4. **Open Prisma Studio** (Optional)
   ```bash
   yarn db:studio
   ```

## Usage

### In Other Packages

```typescript
import { db, schemas } from '@your-org/{{projectName}}';

// Use the database client
const users = await db.user.findMany();

// Use Zod schemas for validation
const userData = schemas.createUser.parse(input);
```

### Adding Models

1. Update `prisma/schema.prisma` with your models
2. Update `src/schemas.ts` with corresponding Zod schemas
3. Run `yarn db:generate` to update the client
4. Run `yarn db:push` to update the database

## Scripts

- `yarn build` - Build the package for distribution
- `yarn dev` - Run in development mode with file watching
- `yarn test` - Run tests
- `yarn test:watch` - Run tests in watch mode
- `yarn db:generate` - Generate Prisma client
- `yarn db:push` - Push schema changes to database
- `yarn db:studio` - Open Prisma Studio
- `yarn db:migrate` - Create and apply migrations
- `yarn db:reset` - Reset database and apply migrations
- `yarn db:seed` - Seed the database

## Project Structure

```
src/
├── index.ts          # Main exports
├── client.ts         # Prisma client setup
└── schemas.ts        # Zod validation schemas
prisma/
├── schema.prisma     # Database schema
└── migrations/       # Database migrations
__tests__/
└── database.test.ts  # Database tests
```

## Best Practices

- Always update Zod schemas when changing Prisma models
- Use meaningful migration names
- Test database operations
- Export only what's needed from the main index
- Keep the client singleton pattern for performance
