import { z } from 'zod';
import { BaseController, controllerToRouter } from '../lib/controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

// Input schemas
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

const getUserSchema = z.object({
  id: z.string(),
});

const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
});

// User controller class
export class UserController extends BaseController {
  // Get all users (admin only)
  getAll = this.createQueryWithMiddleware(
    z.object({}),
    [requireAuth, requireAdmin],
    async (input, ctx) => {
      // Simulate database query
      return [
        { id: '1', email: 'user1@example.com', name: 'User 1' },
        { id: '2', email: 'user2@example.com', name: 'User 2' },
      ];
    }
  );

  // Get user by ID (authenticated users)
  getById = this.createQueryWithMiddleware(
    getUserSchema,
    [requireAuth],
    async (input, ctx) => {
      // In a real app, you'd query your database
      const user = { id: input.id, email: 'user@example.com', name: 'John Doe' };
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    }
  );

  // Create user (public endpoint)
  create = this.createMutation(
    createUserSchema,
    async (input, ctx) => {
      // In a real app, you'd save to database
      const newUser = {
        id: Math.random().toString(36),
        email: input.email,
        name: input.name || null,
        createdAt: new Date(),
      };
      
      return newUser;
    }
  );

  // Update user (authenticated users)
  update = this.createMutationWithMiddleware(
    updateUserSchema,
    [requireAuth],
    async (input, ctx) => {
      // In a real app, you'd update the database
      const updatedUser = {
        id: input.id,
        email: 'user@example.com', // Would come from database
        name: input.name || 'Updated Name',
        updatedAt: new Date(),
      };
      
      return updatedUser;
    }
  );

  // Delete user (admin only)
  delete = this.createMutationWithMiddleware(
    z.object({ id: z.string() }),
    [requireAuth, requireAdmin],
    async (input, ctx) => {
      // In a real app, you'd delete from database
      return { success: true, deletedId: input.id };
    }
  );
}

// Export router - this would be used in your main router
export const userRouter = controllerToRouter({
  getAll: new UserController({} as any).getAll,
  getById: new UserController({} as any).getById,
  create: new UserController({} as any).create,
  update: new UserController({} as any).update,
  delete: new UserController({} as any).delete,
}); 