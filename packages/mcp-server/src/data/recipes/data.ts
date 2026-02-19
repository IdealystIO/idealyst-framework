/**
 * Data Recipes - Lists, filtering, and data display patterns
 */

import { Recipe } from "./types.js";

export const dataRecipes: Record<string, Recipe> = {
  "data-list": {
    name: "Data List",
    description: "Scrollable list with loading states and pull-to-refresh",
    category: "data",
    difficulty: "beginner",
    packages: ["@idealyst/components"],
    code: `import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Card, List, ActivityIndicator } from '@idealyst/components';

interface Item {
  id: string;
  title: string;
  description: string;
}

export function DataList() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    // Simulated API call
    const response = await fetch('/api/items');
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchData();
      setItems(data);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="lg" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {items.length === 0 ? (
        <View style={{ padding: 32, alignItems: 'center' }}>
          <Text typography="body1" color="tertiary">No items found</Text>
        </View>
      ) : (
        items.map((item) => (
          <Card key={item.id} style={{ margin: 8 }}>
            <Text typography="subtitle1" weight="semibold">{item.title}</Text>
            <Text typography="body2" color="secondary">{item.description}</Text>
          </Card>
        ))
      )}
    </View>
  );
}`,
    explanation: `Data list with:
- Loading state with ActivityIndicator
- Empty state handling
- Card-based list items with proper typography
- Uses only @idealyst/components (no react-native imports)`,
    tips: [
      "Use the List component for virtualized rendering of large datasets",
      "Consider pagination for large datasets",
      "Add error state handling for failed requests",
    ],
    relatedRecipes: ["search-filter"],
  },

  "search-filter": {
    name: "Search & Filter",
    description: "Search input with real-time filtering and category filters",
    category: "data",
    difficulty: "intermediate",
    packages: ["@idealyst/components"],
    code: `import React, { useState, useMemo } from 'react';
import { View, TextInput, Chip, Text, Card, Icon } from '@idealyst/components';

interface Item {
  id: string;
  title: string;
  category: string;
}

const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home'];

export function SearchFilter({ items }: { items: Item[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 12 }}>
        <TextInput
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </View>
      </View>

      <View style={{ padding: 16, gap: 8 }}>
        <Text typography="caption" color="tertiary">
          {filteredItems.length} results
        </Text>

        {filteredItems.map((item) => (
          <Card key={item.id}>
            <Text typography="body1">{item.title}</Text>
            <Chip label={item.category} size="sm" />
          </Card>
        ))}
      </View>
    </View>
  );
}`,
    explanation: `Search and filter functionality:
- Real-time search with TextInput
- Category filter chips
- Combined filtering with useMemo for performance
- Results count display`,
    tips: [
      "Debounce search input for API calls",
      "Consider fuzzy matching for better search results",
      "Save filter state for persistence across navigation",
    ],
    relatedRecipes: ["data-list"],
  },

  "trpc-feature": {
    name: "tRPC Feature with Prisma (Backend + Frontend)",
    description: "Complete pattern for adding a new tRPC API router with Prisma model, Zod validation, and UI screen to a scaffolded Idealyst monorepo workspace. Covers project structure, backend API file locations, and integration steps.",
    category: "data",
    difficulty: "advanced",
    packages: ["@idealyst/components", "@idealyst/navigation"],
    code: `// ============================================================
// SCAFFOLDED PROJECT STRUCTURE (generated by \`idealyst init\`)
// ============================================================
// Understanding where files go is CRITICAL. The CLI generates this layout:
//
// <workspace>/
// ├── packages/
// │   ├── api/                          <-- tRPC API server
// │   │   ├── src/
// │   │   │   ├── index.ts              <-- exports { appRouter, AppRouter }
// │   │   │   ├── server.ts             <-- Express server, mounts tRPC at /trpc
// │   │   │   └── trpc/
// │   │   │       ├── trpc.ts           <-- initTRPC, createContext, router, publicProcedure exports
// │   │   │       ├── router.ts         <-- re-exports appRouter from routers/index.ts
// │   │   │       └── routers/
// │   │   │           └── index.ts      <-- appRouter = router({ ... }) definition
// │   ├── database/                     <-- Prisma database layer
// │   │   ├── prisma/
// │   │   │   └── schema.prisma         <-- Prisma models go here
// │   │   └── src/
// │   │       ├── index.ts              <-- exports { prisma, PrismaClient }
// │   │       └── schemas.ts            <-- Zod validation schemas
// │   ├── shared/                       <-- Shared code (types, utils)
// │   ├── web/                          <-- Web app (Vite + React)
// │   │   └── src/utils/trpc.ts         <-- tRPC client for web
// │   └── mobile/                       <-- React Native app
// │       └── src/utils/trpc.ts         <-- tRPC client for mobile
//
// KEY RULE: New routers go in packages/api/src/trpc/routers/
// KEY RULE: Prisma models go in packages/database/prisma/schema.prisma
// KEY RULE: New screens go in packages/web/src/ or packages/mobile/src/

// ============================================================
// STEP 1: Add Prisma model (packages/database/prisma/schema.prisma)
// ============================================================
// Append to existing schema.prisma (keep existing models):
//
// model Todo {
//   id        String   @id @default(cuid())
//   title     String
//   completed Boolean  @default(false)
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }

// ============================================================
// STEP 2: Add Zod schema (packages/database/src/schemas.ts)
// ============================================================
// Append to existing schemas.ts:
//
// export const createTodoSchema = z.object({
//   title: z.string().min(1).max(200),
// });

// ============================================================
// STEP 3: Create router (packages/api/src/trpc/routers/todo.ts)
// ============================================================
// IMPORTANT: File MUST be in packages/api/src/trpc/routers/
// Import router and publicProcedure from '../trpc' (one level up)
import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const todoRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.todo.findMany({ orderBy: { createdAt: 'desc' } });
  }),
  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.create({ data: input });
    }),
  toggle: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.findUnique({ where: { id: input.id } });
      if (!todo) throw new Error('Todo not found');
      return ctx.prisma.todo.update({
        where: { id: input.id },
        data: { completed: !todo.completed },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.delete({ where: { id: input.id } });
    }),
});

// ============================================================
// STEP 4: Register in main router
// ============================================================
// Open packages/api/src/trpc/routers/index.ts (the existing appRouter)
// Add your new router to the appRouter:
//
// import { todoRouter } from './todo';
//
// export const appRouter = router({
//   ...existingRoutes,         // keep all existing routes
//   todo: todoRouter,          // ADD THIS LINE
// });

// ============================================================
// STEP 5: Frontend screen
// ============================================================
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Card, Checkbox, Pressable, Icon, ActivityIndicator } from '@idealyst/components';
// import { trpc } from '../utils/trpc'; // from packages/web/src/utils/trpc.ts

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export function TodoScreen() {
  const [newTitle, setNewTitle] = useState('');
  // Real app would use tRPC hooks:
  // const { data: todos, isLoading, refetch } = trpc.todo.list.useQuery();
  // const createMutation = trpc.todo.create.useMutation({ onSuccess: () => refetch() });
  // const toggleMutation = trpc.todo.toggle.useMutation({ onSuccess: () => refetch() });
  // const deleteMutation = trpc.todo.delete.useMutation({ onSuccess: () => refetch() });

  // Placeholder data for demonstration
  const todos: Todo[] = [];
  const isLoading = false;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="lg" />
      </View>
    );
  }

  return (
    <View padding="md" gap="md" style={{ flex: 1 }}>
      <Text typography="h5" weight="bold">Todos</Text>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <TextInput
            placeholder="What needs to be done?"
            value={newTitle}
            onChangeText={setNewTitle}
          />
        </View>
        <Button
          leftIcon="plus"
          onPress={() => {
            if (!newTitle.trim()) return;
            // createMutation.mutate({ title: newTitle });
            setNewTitle('');
          }}
        >
          Add
        </Button>
      </View>

      {todos.length === 0 ? (
        <View style={{ padding: 32, alignItems: 'center' }}>
          <Icon name="check-all" size="lg" color="secondary" />
          <Text typography="body1" color="secondary" style={{ marginTop: 8 }}>
            No todos yet
          </Text>
        </View>
      ) : (
        todos.map((todo) => (
          <Card key={todo.id} padding="md">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Checkbox
                checked={todo.completed}
                onChange={() => {
                  // toggleMutation.mutate({ id: todo.id });
                }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  typography="body1"
                  style={{
                    textDecorationLine: todo.completed ? 'line-through' : 'none',
                    opacity: todo.completed ? 0.6 : 1,
                  }}
                >
                  {todo.title}
                </Text>
              </View>
              <Pressable onPress={() => { /* deleteMutation.mutate({ id: todo.id }) */ }}>
                <Icon name="delete-outline" color="red" />
              </Pressable>
            </View>
          </Card>
        ))
      )}
    </View>
  );
}`,
    explanation: `Complete tRPC feature integration in a scaffolded Idealyst monorepo:

**Project structure** (generated by \`idealyst init --with-api --with-prisma --with-trpc\`):
- \`packages/api/src/trpc/routers/\` -- where ALL tRPC routers live
- \`packages/api/src/trpc/trpc.ts\` -- exports \`router\`, \`publicProcedure\`, \`createContext\`
- \`packages/api/src/trpc/routers/index.ts\` -- the main \`appRouter\` that merges all routers
- \`packages/database/prisma/schema.prisma\` -- all Prisma models
- \`packages/database/src/schemas.ts\` -- Zod validation schemas
- \`packages/web/src/utils/trpc.ts\` -- tRPC client hooks

**Integration steps:**
1. Add Prisma model to schema.prisma
2. Add Zod validation schema
3. Create feature router in packages/api/src/trpc/routers/
4. Register router in the main appRouter (packages/api/src/trpc/routers/index.ts)
5. Build UI screen using @idealyst/components
6. Register screen in navigation config`,
    tips: [
      "EXPLORE the project first: use Glob/Read to find existing files before writing new ones",
      "Router files MUST go in packages/api/src/trpc/routers/ -- never at the project root or src/",
      "Always merge new routers into the appRouter in packages/api/src/trpc/routers/index.ts",
      "Import router/publicProcedure from '../trpc' (relative to the routers directory)",
      "The tRPC client is already set up at packages/web/src/utils/trpc.ts and packages/mobile/src/utils/trpc.ts",
      "Card is a simple container -- put children directly inside, no Card.Content or Card.Header",
      "Use Pressable from @idealyst/components for touch handling (View has no onPress prop)",
    ],
    relatedRecipes: ["data-list", "search-filter"],
  },
};
