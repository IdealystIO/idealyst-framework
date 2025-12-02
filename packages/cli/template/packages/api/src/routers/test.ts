import { z } from 'zod';
import { prisma } from '../lib/database.js';
import { publicProcedure, router } from '../trpc.js';

/**
 * Test Router - tRPC CRUD operations for the Test model
 *
 * This router provides standard CRUD operations via tRPC.
 * For the GraphQL equivalent, see src/graphql/types/test.ts
 *
 * Endpoints:
 * - test.getById({ id })           - Get test by ID
 * - test.getAll({ skip, take })    - Get all tests with pagination
 * - test.count({ status })         - Get count of tests
 * - test.create({ name, message }) - Create new test
 * - test.update({ id, data })      - Update existing test
 * - test.delete({ id })            - Delete test
 */
export const testRouter = router({
  // Get a single test by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const test = await prisma.test.findUnique({
        where: { id: input.id },
      });

      if (!test) {
        throw new Error('Test not found');
      }

      return test;
    }),

  // Get all tests with pagination
  getAll: publicProcedure
    .input(z.object({
      skip: z.number().min(0).optional(),
      take: z.number().min(1).max(100).optional(),
      orderBy: z.enum(['createdAt', 'updatedAt', 'name']).optional(),
      orderDir: z.enum(['asc', 'desc']).optional(),
    }))
    .query(async ({ input }) => {
      const take = input.take ?? 10;
      const orderField = input.orderBy ?? 'createdAt';
      const orderDir = input.orderDir ?? 'desc';

      return prisma.test.findMany({
        ...(input.skip != null ? { skip: input.skip } : {}),
        take,
        orderBy: { [orderField]: orderDir },
      });
    }),

  // Get count of tests
  count: publicProcedure
    .input(z.object({
      status: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return prisma.test.count({
        ...(input.status != null ? { where: { status: input.status } } : {}),
      });
    }),

  // Create a new test
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1, 'Name is required'),
      message: z.string().min(1, 'Message is required'),
      status: z.string().optional().default('active'),
    }))
    .mutation(async ({ input }) => {
      return prisma.test.create({
        data: {
          name: input.name,
          message: input.message,
          status: input.status,
        },
      });
    }),

  // Update an existing test
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: z.object({
        name: z.string().min(1).optional(),
        message: z.string().min(1).optional(),
        status: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      const existing = await prisma.test.findUnique({
        where: { id: input.id },
      });

      if (!existing) {
        throw new Error('Test not found');
      }

      // Build update data only with defined values
      const updateData: { name?: string; message?: string; status?: string } = {};
      if (input.data.name != null) updateData.name = input.data.name;
      if (input.data.message != null) updateData.message = input.data.message;
      if (input.data.status != null) updateData.status = input.data.status;

      return prisma.test.update({
        where: { id: input.id },
        data: updateData,
      });
    }),

  // Delete a test
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const existing = await prisma.test.findUnique({
        where: { id: input.id },
      });

      if (!existing) {
        throw new Error('Test not found');
      }

      return prisma.test.delete({
        where: { id: input.id },
      });
    }),
});

/**
 * Example usage in frontend:
 *
 * ```typescript
 * // Get all tests
 * const { data: tests } = trpc.test.getAll.useQuery({ take: 10 });
 *
 * // Get test by ID
 * const { data: test } = trpc.test.getById.useQuery({ id: 'test-id' });
 *
 * // Create a new test
 * const createTest = trpc.test.create.useMutation();
 * await createTest.mutateAsync({
 *   name: 'My Test',
 *   message: 'This is a test message',
 *   status: 'active'
 * });
 *
 * // Update a test
 * const updateTest = trpc.test.update.useMutation();
 * await updateTest.mutateAsync({
 *   id: 'test-id',
 *   data: { name: 'Updated Test' }
 * });
 *
 * // Delete a test
 * const deleteTest = trpc.test.delete.useMutation();
 * await deleteTest.mutateAsync({ id: 'test-id' });
 * ```
 */
