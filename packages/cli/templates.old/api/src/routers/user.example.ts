import { z } from 'zod';
import { createCrudRouter } from '../lib/crud.js';

// Define Zod schemas for the User model
const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required'),
});

const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  name: z.string().min(1, 'Name is required').optional(),
});

// Create the CRUD router for the User model
export const userRouter = createCrudRouter(
  'user',
  createUserSchema,
  updateUserSchema
);

/**
 * This generates the following endpoints:
 * 
 * - users.getAll({ skip?, take?, orderBy? }) - Get all users with pagination
 * - users.getById({ id }) - Get user by ID
 * - users.create({ name, email }) - Create new user
 * - users.update({ id, data: { name?, email? } }) - Update user
 * - users.delete({ id }) - Delete user
 * - users.count({ where? }) - Get user count
 * 
 * To use this router:
 * 
 * 1. First add a User model to your Prisma schema:
 * 
 * ```prisma
 * model User {
 *   id        String   @id @default(cuid())
 *   email     String   @unique
 *   name      String
 *   createdAt DateTime @default(now())
 *   updatedAt DateTime @updatedAt
 * }
 * ```
 * 
 * 2. Run `yarn db:migrate` to apply the schema changes
 * 
 * 3. Uncomment the users router in src/router/index.ts:
 * 
 * ```typescript
 * import { userRouter } from '../routers/user.js';
 * 
 * export const appRouter = router({
 *   // ... other routes
 *   users: userRouter,
 * });
 * ```
 * 
 * 4. Use in your frontend:
 * 
 * ```typescript
 * // Get all users
 * const { data: users } = trpc.users.getAll.useQuery({ take: 10 });
 * 
 * // Create a new user
 * const createUser = trpc.users.create.useMutation();
 * await createUser.mutateAsync({ 
 *   name: 'John Doe', 
 *   email: 'john@example.com' 
 * });
 * 
 * // Update a user
 * const updateUser = trpc.users.update.useMutation();
 * await updateUser.mutateAsync({ 
 *   id: 'user-id', 
 *   data: { name: 'Jane Doe' } 
 * });
 * 
 * // Delete a user
 * const deleteUser = trpc.users.delete.useMutation();
 * await deleteUser.mutateAsync({ id: 'user-id' });
 * ```
 */
