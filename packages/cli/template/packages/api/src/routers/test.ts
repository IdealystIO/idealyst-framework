import { z } from "zod";
import { createCrudRouter } from "../lib/crud.js";

// Define Zod schemas for the Test model based on the Prisma schema
const createTestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  message: z.string().min(1, "Message is required"),
  status: z.string().optional().default("active"),
});

const updateTestSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  message: z.string().min(1, "Message is required").optional(),
  status: z.string().optional(),
});

// Create the CRUD router for the Test model
export const testRouter = createCrudRouter(
  "Test",
  createTestSchema,
  updateTestSchema
);

/**
 * This generates the following endpoints:
 * 
 * - test.getAll({ skip?, take?, orderBy? }) - Get all test records with pagination
 * - test.getById({ id }) - Get test record by ID
 * - test.create({ name, message, status? }) - Create new test record
 * - test.update({ id, data: { name?, message?, status? } }) - Update test record
 * - test.delete({ id }) - Delete test record
 * - test.count({ where? }) - Get test record count
 * 
 * Example usage in frontend:
 * 
 * ```typescript
 * // Get all tests
 * const { data: tests } = trpc.test.getAll.useQuery({ take: 10 });
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
