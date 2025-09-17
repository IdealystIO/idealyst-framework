import type { Prisma } from '@test-select-demo/database/client';
import { z } from 'zod';
import { prisma } from '../lib/database.js';
import { publicProcedure, router } from '../trpc.js';

/**
 * Creates a standard CRUD router for any Prisma model
 * 
 * @param modelName - The name of the Prisma model (e.g., 'user', 'post', 'test')
 * @param createSchema - Zod schema for creating new records
 * @param updateSchema - Zod schema for updating records (optional, defaults to createSchema.partial())
 * @returns tRPC router with standard CRUD operations
 */
export function createCrudRouter<
  TModelName extends Prisma.ModelName,
  TCreateInput extends Record<string, any>,
  TUpdateInput extends Record<string, any> = Partial<TCreateInput>
>(
  modelName: TModelName,
  createSchema: z.ZodSchema<TCreateInput>,
  updateSchema?: z.ZodSchema<TUpdateInput>
) {
  const model = (prisma as any)[modelName];
  const updateSchemaToUse = updateSchema || createSchema.partial();

  return router({
    // Get all records
    getAll: publicProcedure
      .input(z.object({
        skip: z.number().min(0).optional(),
        take: z.number().min(1).max(100).optional(),
        orderBy: z.record(z.enum(['asc', 'desc'])).optional(),
      }))
      .query(async ({ input }) => {
        return await model.findMany({
          skip: input.skip,
          take: input.take || 10,
          orderBy: input.orderBy,
        });
      }),

    // Get record by ID
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const record = await model.findUnique({
          where: { id: input.id },
        });
        
        if (!record) {
          throw new Error(`${modelName} not found`);
        }
        
        return record;
      }),

    // Create new record
    create: publicProcedure
      .input(createSchema)
      .mutation(async ({ input }) => {
        return await model.create({
          data: input,
        });
      }),

    // Update record
    update: publicProcedure
      .input(z.object({
        id: z.string(),
        data: updateSchemaToUse,
      }))
      .mutation(async ({ input }) => {
        const existingRecord = await model.findUnique({
          where: { id: input.id },
        });

        if (!existingRecord) {
          throw new Error(`${modelName} not found`);
        }

        return await model.update({
          where: { id: input.id },
          data: input.data,
        });
      }),

    // Delete record
    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const existingRecord = await model.findUnique({
          where: { id: input.id },
        });

        if (!existingRecord) {
          throw new Error(`${modelName} not found`);
        }

        return await model.delete({
          where: { id: input.id },
        });
      }),

    // Get count
    count: publicProcedure
      .input(z.object({
        where: z.record(z.any()).optional(),
      }))
      .query(async ({ input }) => {
        return await model.count({
          where: input.where,
        });
      }),
  });
}

/**
 * Example usage:
 * 
 * ```typescript
 * import { z } from 'zod';
 * import { createCrudRouter } from '../lib/crud.js';
 * 
 * // Define schemas for your model
 * const createUserSchema = z.object({
 *   email: z.string().email(),
 *   name: z.string(),
 * });
 * 
 * const updateUserSchema = z.object({
 *   email: z.string().email().optional(),
 *   name: z.string().optional(),
 * });
 * 
 * // Create the CRUD router
 * export const userRouter = createCrudRouter(
 *   'user',
 *   createUserSchema,
 *   updateUserSchema
 * );
 * ```
 * 
 * This will generate:
 * - users.getAll() - Get all users with pagination
 * - users.getById({ id }) - Get user by ID
 * - users.create({ email, name }) - Create new user
 * - users.update({ id, data: { email?, name? } }) - Update user
 * - users.delete({ id }) - Delete user
 * - users.count() - Get user count
 */
