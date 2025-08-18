# Idealyst Framework CLI - Quick LLM Command Reference

⚠️ **LLM CRITICAL**: Always provide ALL arguments to prevent interactive prompts that hang automation!

## 🚨 Commands That Will Hang LLMs
```bash
# ❌ These will hang waiting for user input:
idealyst init                              # Missing workspace name
idealyst create my-app                     # Missing --type
idealyst create my-app --type native       # Missing --app-name
idealyst create my-app --type web          # Missing tRPC choice
idealyst create my-app --type native --app-name "App"  # Missing tRPC choice
```

## ✅ LLM-Safe Command Templates
```bash
# Always use these exact patterns:
idealyst init <workspace-name>
idealyst create <name> --type database
idealyst create <name> --type api  
idealyst create <name> --type shared
idealyst create <name> --type native --app-name "Display Name" --with-trpc
idealyst create <name> --type native --app-name "Display Name" --no-trpc
idealyst create <name> --type web --with-trpc
idealyst create <name> --type web --no-trpc
```

## Essential Commands

### Initialize Workspace (Required First)
```bash
# ✅ Always provide workspace name
idealyst init <workspace-name>
cd <workspace-name>

# ❌ Never run without name (will prompt)
# idealyst init
```

### Create Projects (Run from workspace directory)
```bash
# Database layer (Prisma + Zod) - No prompts
idealyst create <name> --type database

# API server (tRPC + Express) - No prompts  
idealyst create <name> --type api

# React Native mobile app - REQUIRES app-name and trpc preference
idealyst create <name> --type native --app-name "Display Name" --with-trpc
idealyst create <name> --type native --app-name "Display Name" --no-trpc

# React web app (Vite) - REQUIRES trpc preference
idealyst create <name> --type web --with-trpc
idealyst create <name> --type web --no-trpc

# Shared TypeScript library - No prompts
idealyst create <name> --type shared
```

## Project Types & Purposes

| Type | Purpose | Key Technologies | Exports |
|------|---------|------------------|---------|
| `database` | Data layer | Prisma, Zod, TypeScript | `{ db, schemas, PrismaClient, types }` |
| `api` | Backend server | tRPC, Express, Zod | tRPC router, middleware |
| `native` | Mobile app | React Native, TypeScript | Mobile application |
| `web` | Web app | React, Vite, TypeScript | Web application |
| `shared` | Utilities | TypeScript, Rollup | Reusable functions/types |

## Architecture Patterns

### Full-Stack App (Recommended)
```bash
# ✅ LLM-Safe: All arguments provided
idealyst init my-app && cd my-app
idealyst create database --type database
idealyst create api --type api
idealyst create mobile --type native --app-name "Mobile App" --with-trpc
idealyst create web --type web --with-trpc
```

### Database Integration
```typescript
// In API server
import { db } from '@workspace/database';
const users = await db.user.findMany();

// In clients (with tRPC)
const { data } = await api.users.getAll.useQuery();
```

## Key Rules for LLMs
1. **Always provide workspace name** - `idealyst init my-project` (never just `idealyst init`)
2. **Always provide project name AND --type** - `idealyst create api --type api` 
3. **For native: Always provide --app-name AND tRPC choice** - `--app-name "App Name" --with-trpc`
4. **For web: Always provide tRPC choice** - `--with-trpc` or `--no-trpc`
5. **Use --skip-install** - For faster testing/iteration
6. **Use descriptive names** - `user-database`, `product-api`, not `db`, `api`

## Common Patterns
```bash
# E-commerce (full arguments)
idealyst init ecommerce-platform && cd ecommerce-platform
idealyst create product-database --type database
idealyst create api --type api
idealyst create customer-mobile --type native --app-name "Customer App" --with-trpc
idealyst create admin-web --type web --with-trpc

# SaaS (full arguments) 
idealyst init saas-app && cd saas-app
idealyst create user-database --type database
idealyst create auth-api --type api
idealyst create main-api --type api
idealyst create dashboard --type web --with-trpc
idealyst create mobile --type native --app-name "SaaS Mobile" --with-trpc

# Content platform (full arguments)
idealyst init content-platform && cd content-platform
idealyst create content-database --type database
idealyst create cms-api --type api
idealyst create public-web --type web --no-trpc
idealyst create admin-web --type web --with-trpc
```
