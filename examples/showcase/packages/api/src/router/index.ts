import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { prisma } from '../lib/database.js';
import { ItemCreateSchema, ItemUpdateSchema } from '@idealyst-showcase/database';

// ==========================================================================
// Base Routes (no database required)
// ==========================================================================

const baseRoutes = {
  // Hello world procedure
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

  // Echo procedure - returns what you send
  echo: publicProcedure
    .input(z.object({ message: z.string() }))
    .query(({ input }) => {
      return {
        original: input.message,
        reversed: input.message.split('').reverse().join(''),
        length: input.message.length,
        timestamp: new Date().toISOString(),
      };
    }),

  // Counter - in-memory state demo
  counter: router({
    // Get current counter value
    get: publicProcedure.query(() => {
      return { value: counterState.value };
    }),

    // Increment counter
    increment: publicProcedure.mutation(() => {
      counterState.value += 1;
      return { value: counterState.value };
    }),

    // Decrement counter
    decrement: publicProcedure.mutation(() => {
      counterState.value -= 1;
      return { value: counterState.value };
    }),

    // Reset counter
    reset: publicProcedure.mutation(() => {
      counterState.value = 0;
      return { value: counterState.value };
    }),
  }),
};

// In-memory counter state
const counterState = { value: 0 };

// ==========================================================================
// Database Routes (requires Prisma)
// ==========================================================================

const itemsRouter = router({
  // List all items
  list: publicProcedure
    .input(
      z.object({
        completed: z.boolean().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const where: any = {};

      if (input?.completed !== undefined) {
        where.completed = input.completed;
      }

      if (input?.search) {
        where.OR = [
          { title: { contains: input.search } },
          { description: { contains: input.search } },
        ];
      }

      return await prisma.item.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    }),

  // Get single item by ID
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.item.findUnique({
        where: { id: input.id },
      });
    }),

  // Create item
  create: publicProcedure
    .input(ItemCreateSchema)
    .mutation(async ({ input }) => {
      return await prisma.item.create({
        data: input,
      });
    }),

  // Update item
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: ItemUpdateSchema,
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.item.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  // Delete item
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.item.delete({
        where: { id: input.id },
      });
    }),

  // Toggle completed status
  toggle: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const item = await prisma.item.findUnique({
        where: { id: input.id },
      });

      if (!item) {
        throw new Error('Item not found');
      }

      return await prisma.item.update({
        where: { id: input.id },
        data: { completed: !item.completed },
      });
    }),

  // Get stats
  stats: publicProcedure.query(async () => {
    const items = await prisma.item.findMany();

    return {
      total: items.length,
      completed: items.filter((i: { completed: boolean }) => i.completed).length,
      pending: items.filter((i: { completed: boolean }) => !i.completed).length,
    };
  }),
});

// ==========================================================================
// Combined Router
// ==========================================================================

export const appRouter = router({
  ...baseRoutes,
  items: itemsRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
