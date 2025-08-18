# Idealyst Framework CLI - LLM Reference Guide

This is a comprehensive reference for LLMs to understand and use the Idealyst Framework CLI to create full-stack TypeScript projects.

## Overview

The Idealyst Framework CLI is a powerful tool for generating TypeScript monorepo projects with React Native, React Web, API servers, database layers, and shared libraries. All projects are type-safe and follow modern development practices.

## CLI Installation & Usage

```bash
# Install globally
npm install -g @idealyst/cli

# Or use via npx
npx @idealyst/cli [command] [options]
```

⚠️ **IMPORTANT FOR LLMs**: Always provide ALL required arguments to avoid interactive prompts that can hang automated processes.

## 🚨 Critical LLM Requirements

### Commands That Will Hang LLMs
```bash
# ❌ These commands will hang waiting for user input:
idealyst init                                    # Missing workspace name  
idealyst create my-app                           # Missing --type
idealyst create my-app --type native             # Missing --app-name
idealyst create my-app --type web                # Missing tRPC preference
idealyst create my-app --type native --app-name "App"  # Missing tRPC preference
```

### LLM-Safe Command Templates
```bash
# ✅ Always use these exact patterns:
idealyst init <workspace-name>                   # Always provide name
idealyst create <name> --type database           # Database: no extra args needed
idealyst create <name> --type api                # API: no extra args needed
idealyst create <name> --type shared             # Shared: no extra args needed
idealyst create <name> --type native --app-name "Name" --with-trpc    # Native: both required
idealyst create <name> --type native --app-name "Name" --no-trpc      # Native: both required  
idealyst create <name> --type web --with-trpc    # Web: tRPC choice required
idealyst create <name> --type web --no-trpc      # Web: tRPC choice required
```

## Core Commands

### 1. Initialize Workspace
**Purpose**: Create a new monorepo workspace that can contain multiple related projects.

```bash
# Create a new workspace (ALWAYS provide project name)
idealyst init <workspace-name> [options]

# Options:
# -d, --directory <dir>    Output directory (default: .)
# --skip-install          Skip installing dependencies

# ✅ LLM-Safe Examples:
idealyst init my-workspace
idealyst init ecommerce-platform --directory ./projects
idealyst init my-app --skip-install
```

**⚠️ LLM Warning**: Never run `idealyst init` without a project name - it will prompt interactively and hang.

**What it creates:**
- Yarn workspace configuration
- TypeScript configuration
- Build scripts and tooling
- Package management setup
- Version management scripts
- Base Idealyst packages (theme, components, navigation)

### 2. Create Projects
**Purpose**: Create individual projects within a workspace.

```bash
# General syntax (ALWAYS provide project name AND type)
idealyst create <project-name> --type <type> [options]

# Options:
# -t, --type <type>           Project type: native, web, shared, api, or database
# -d, --directory <dir>       Output directory (default: .)
# -a, --app-name <name>       Display name for native apps (REQUIRED for native)
# --with-trpc                 Include tRPC boilerplate (for web/native)
# --no-trpc                   Explicitly disable tRPC (for web/native)
# --skip-install              Skip installing dependencies

# ✅ LLM-Safe Examples:
idealyst create my-api --type api
idealyst create user-database --type database
idealyst create mobile-app --type native --app-name "Mobile App"
idealyst create web-app --type web --with-trpc
idealyst create utils --type shared
```

**⚠️ LLM Critical Rules**:
1. **Always provide `<project-name>`** - CLI will prompt if missing
2. **Always provide `--type <type>`** - CLI will prompt if missing  
3. **For native projects**: Always provide `--app-name "Display Name"` - CLI will prompt if missing
4. **For web/native projects**: Always specify `--with-trpc` or `--no-trpc` - CLI will prompt if missing

## Project Types

### 1. Native (React Native)
**Purpose**: Cross-platform mobile applications

```bash
# ✅ LLM-Safe Command (always include --app-name)
idealyst create my-mobile-app --type native --app-name "My Mobile App"

# With tRPC integration
idealyst create mobile-app --type native --app-name "Mobile App" --with-trpc

# Without tRPC integration (explicit)
idealyst create mobile-app --type native --app-name "Mobile App" --no-trpc
```

**⚠️ LLM Required**: `--app-name` is REQUIRED for native projects to avoid interactive prompts.

**Includes:**
- React Native setup with TypeScript
- Idealyst UI components
- Navigation system
- Platform-specific configurations (iOS/Android)
- Jest testing setup
- Optional tRPC integration

**Key files:**
- `src/App.tsx` - Main application component
- `android/` - Android-specific code
- `ios/` - iOS-specific code
- `jest.config.js` - Testing configuration

### 2. Web (React Web)
**Purpose**: Web applications using React

```bash
# ✅ LLM-Safe Commands (always specify tRPC preference)
idealyst create my-web-app --type web --with-trpc
idealyst create my-web-app --type web --no-trpc

# With additional options
idealyst create web-dashboard --type web --with-trpc --skip-install
```

**⚠️ LLM Required**: Always specify `--with-trpc` or `--no-trpc` to avoid interactive prompts.

**Includes:**
- React with TypeScript and Vite
- Idealyst UI components (web-compatible)
- Unistyles for styling
- Jest testing setup
- Optional tRPC integration

**Key files:**
- `src/App.tsx` - Main application component
- `src/main.tsx` - Entry point
- `vite.config.ts` - Vite configuration
- `index.html` - HTML template

### 3. API Server
**Purpose**: Backend API servers with tRPC

```bash
# ✅ LLM-Safe Command
idealyst create my-api --type api

# With additional options
idealyst create user-api --type api --skip-install
```

**Includes:**
- tRPC for type-safe APIs
- Express.js server
- Zod schema validation
- TypeScript configuration
- Middleware system (auth, CORS, etc.)
- Controller pattern
- Jest testing setup

**Key files:**
- `src/server.ts` - Express server setup
- `src/index.ts` - Main exports
- `src/context.ts` - tRPC context
- `src/router/index.ts` - Route definitions
- `src/controllers/` - API controllers
- `src/middleware/` - Custom middleware

**Note**: API projects no longer include database functionality (see Database type below).

### 4. Database
**Purpose**: Shared database layer with Prisma

```bash
# ✅ LLM-Safe Command
idealyst create my-database --type database

# With additional options
idealyst create user-database --type database --skip-install
```

**Includes:**
- Prisma ORM setup
- TypeScript configuration
- Zod schemas for validation
- Database client singleton
- Migration scripts
- Seed scripts
- Jest testing setup

**Key files:**
- `src/index.ts` - Main exports (db, schemas, types)
- `src/client.ts` - Prisma client singleton
- `src/schemas.ts` - Zod validation schemas
- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Database seeding

**Exports for consumption:**
```typescript
// Import in other packages
import { db, schemas, PrismaClient } from '@workspace/my-database';
import type { User, Post } from '@workspace/my-database';

// Use the database
const users = await db.user.findMany();
const validData = schemas.createUser.parse(input);
```

### 5. Shared Library
**Purpose**: Reusable code shared across projects

```bash
# ✅ LLM-Safe Command
idealyst create my-shared-lib --type shared

# With additional options
idealyst create utils --type shared --skip-install
```

**Includes:**
- TypeScript library setup
- Rollup build configuration
- Jest testing setup
- NPM package structure

**Key files:**
- `src/index.ts` - Main exports
- `rollup.config.js` - Build configuration

## Project Architecture Patterns

### Monorepo Structure
```
my-workspace/
├── package.json              # Workspace root
├── packages/
│   ├── mobile-app/           # React Native app
│   ├── web-app/              # React web app
│   ├── api-server/           # tRPC API server
│   ├── user-database/        # Database layer
│   └── shared-utils/         # Shared library
└── node_modules/
```

### Database + API Pattern
**Recommended approach for full-stack applications:**

1. **Create database package first:**
```bash
idealyst create user-database --type database
```

2. **Create API server:**
```bash
idealyst create api-server --type api
```

3. **Connect them in API:**
```typescript
// In api-server/src/controllers/UserController.ts
import { db } from '@workspace/user-database';
import type { User } from '@workspace/user-database';

export class UserController {
  async getUsers() {
    return await db.user.findMany();
  }
}
```

### Client + API Pattern
**For frontend applications with backend:**

1. **Create API first:**
```bash
idealyst create api-server --type api
idealyst create user-database --type database
```

2. **Create client apps:**
```bash
idealyst create mobile-app --type native --with-trpc
idealyst create web-app --type web --with-trpc
```

3. **Connect with tRPC:**
```typescript
// In client app
import { createTRPCProxyClient } from '@trpc/client';
import type { AppRouter } from '@workspace/api-server';

const api = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: 'http://localhost:3000/trpc' })]
});
```

## Development Workflow

### 1. Initial Setup
```bash
# Create workspace (provide name to avoid prompts)
idealyst init my-project

cd my-project

# Create database layer (no additional args needed)
idealyst create database --type database

# Create API server (no additional args needed)
idealyst create api --type api

# Create client apps (specify tRPC and app-name to avoid prompts)
idealyst create mobile --type native --app-name "Mobile App" --with-trpc
idealyst create web --type web --with-trpc
```

### 2. Database Development
```bash
cd packages/database

# Edit prisma/schema.prisma
# Add your models

# Generate client
yarn db:generate

# Push to database
yarn db:push

# Build for consumption
yarn build
```

### 3. API Development
```bash
cd packages/api

# Import database
# Edit src/controllers/ files
# Add your endpoints

# Start development server
yarn dev
```

### 4. Client Development
```bash
# Mobile
cd packages/mobile
yarn android  # or yarn ios

# Web
cd packages/web
yarn dev
```

## Best Practices for LLMs

### 1. Always Start with Workspace
Never create individual projects without a workspace:
```bash
# ❌ Wrong - will fail
idealyst create my-app --type native --app-name "My App"

# ✅ Correct - always init workspace first
idealyst init my-workspace
cd my-workspace
idealyst create my-app --type native --app-name "My App" --with-trpc
```

### 2. Always Provide ALL Required Arguments
```bash
# ❌ Wrong - will hang on prompts
idealyst init
idealyst create --type native
idealyst create mobile-app

# ✅ Correct - full arguments prevent prompts
idealyst init my-project
idealyst create mobile-app --type native --app-name "Mobile App" --with-trpc
idealyst create web-app --type web --no-trpc
```

### 3. Use --skip-install for Speed
```bash
# ✅ For faster iteration/testing
idealyst init my-project --skip-install
idealyst create api --type api --skip-install
```

### 2. Database-First for Full-Stack
For applications needing persistence:
```bash
# 1. Create workspace (provide name)
idealyst init e-commerce-app

# 2. Create database first (no prompts)
idealyst create database --type database

# 3. Create API (no prompts)
idealyst create api --type api

# 4. Create clients (specify all args)
idealyst create mobile --type native --app-name "E-Commerce Mobile" --with-trpc
idealyst create admin --type web --with-trpc
```

### 3. Use Descriptive Names (No Prompts)
```bash
# ✅ Good names with full arguments
idealyst create user-database --type database
idealyst create product-api --type api
idealyst create customer-mobile --type native --app-name "Customer Mobile" --with-trpc

# ❌ Avoid generic names and missing arguments
idealyst create db --type database
idealyst create api --type api
idealyst create app  # Missing --type, will prompt
```

### 4. Leverage Type Safety
The framework provides end-to-end type safety:
- Database types from Prisma
- API types from tRPC
- Component types from TypeScript React

### 5. Follow the Separation of Concerns
- **Database packages**: Only data models and database access
- **API packages**: Only business logic and endpoints
- **Client packages**: Only UI and user interaction
- **Shared packages**: Only reusable utilities

## Example Project Setups

### E-commerce Platform
```bash
idealyst init ecommerce-platform
cd ecommerce-platform

# Core data layer
idealyst create product-database --type database

# Backend services
idealyst create product-api --type api
idealyst create payment-api --type api

# Client applications
idealyst create customer-mobile --type native --with-trpc
idealyst create admin-web --type web --with-trpc

# Shared utilities
idealyst create shared-utils --type shared
```

### SaaS Application
```bash
idealyst init saas-app
cd saas-app

# Data layer
idealyst create user-database --type database

# Backend
idealyst create auth-api --type api
idealyst create main-api --type api

# Clients
idealyst create mobile-app --type native --with-trpc
idealyst create web-dashboard --type web --with-trpc

# Shared
idealyst create common-types --type shared
```

## Error Handling

### Common Issues:
1. **"Individual projects can only be created within a workspace"**
   - Solution: Run `idealyst init` first

2. **"Invalid project name"**
   - Solution: Use lowercase, no spaces, valid npm package names

3. **"Invalid project type"**
   - Solution: Use one of: native, web, shared, api, database

### Debugging:
- Use `--skip-install` for faster iteration
- Check generated package.json files
- Verify workspace structure

This reference should enable LLMs to effectively use the Idealyst Framework CLI to create comprehensive, type-safe, full-stack TypeScript applications.
