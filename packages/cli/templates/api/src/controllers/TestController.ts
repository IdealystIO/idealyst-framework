import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { prisma } from '../lib/database.js';

// Zod schemas for Test model validation
const CreateTestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  message: z.string().min(1, 'Message is required'),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

const UpdateTestSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required').optional(),
  message: z.string().min(1, 'Message is required').optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

const GetTestByIdSchema = z.object({
  id: z.string(),
});

const DeleteTestSchema = z.object({
  id: z.string(),
});

// Test router with CRUD operations
export const testRouter = router({
  // Get all tests
  getAll: publicProcedure
    .query(async () => {
      try {
        const tests = await prisma.test.findMany({
          orderBy: { createdAt: 'desc' },
        });
        
        return {
          success: true,
          data: tests,
          count: tests.length,
        };
      } catch (error) {
        throw new Error('Failed to fetch tests');
      }
    }),

  // Get test by ID
  getById: publicProcedure
    .input(GetTestByIdSchema)
    .query(async ({ input }) => {
      try {
        const test = await prisma.test.findUnique({
          where: { id: input.id },
        });

        if (!test) {
          throw new Error('Test not found');
        }

        return {
          success: true,
          data: test,
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch test');
      }
    }),

  // Create new test
  create: publicProcedure
    .input(CreateTestSchema)
    .mutation(async ({ input }) => {
      try {
        const test = await prisma.test.create({
          data: {
            name: input.name,
            message: input.message,
            status: input.status,
          },
        });

        return {
          success: true,
          data: test,
          message: 'Test created successfully',
        };
      } catch (error) {
        throw new Error('Failed to create test');
      }
    }),

  // Update test
  update: publicProcedure
    .input(UpdateTestSchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;
        
        // Remove undefined values
        const cleanUpdateData = Object.fromEntries(
          Object.entries(updateData).filter(([_, value]) => value !== undefined)
        );

        const test = await prisma.test.update({
          where: { id },
          data: cleanUpdateData,
        });

        return {
          success: true,
          data: test,
          message: 'Test updated successfully',
        };
      } catch (error) {
        throw new Error('Failed to update test');
      }
    }),

  // Delete test
  delete: publicProcedure
    .input(DeleteTestSchema)
    .mutation(async ({ input }) => {
      try {
        await prisma.test.delete({
          where: { id: input.id },
        });

        return {
          success: true,
          message: 'Test deleted successfully',
        };
      } catch (error) {
        throw new Error('Failed to delete test');
      }
    }),
});
