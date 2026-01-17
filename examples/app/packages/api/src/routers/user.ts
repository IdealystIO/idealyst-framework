/**
 * User Router - Full CRUD operations with strong typing
 *
 * This router demonstrates:
 * - Zod schema validation for type-safe inputs
 * - Extended CRUD operations with custom procedures
 * - Prisma relations (posts, comments, settings)
 * - Search and filtering capabilities
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { createCrudRouter } from '../lib/crud.js';
import { prisma } from '../lib/database.js';

// =============================================================================
// Zod Schemas - These define the shape of data and provide runtime validation
// =============================================================================

/**
 * Schema for creating a new user
 * All fields except email are optional
 */
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  avatar: z.string().url('Invalid avatar URL').optional().nullable(),
  bio: z.string().max(500, 'Bio too long').optional().nullable(),
  location: z.string().max(100, 'Location too long').optional().nullable(),
  website: z.string().url('Invalid website URL').optional().nullable(),
});

/**
 * Schema for updating a user - all fields are optional
 */
export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  avatar: z.string().url('Invalid avatar URL').optional().nullable(),
  bio: z.string().max(500, 'Bio too long').optional().nullable(),
  location: z.string().max(100, 'Location too long').optional().nullable(),
  website: z.string().url('Invalid website URL').optional().nullable(),
});

/**
 * Schema for searching/filtering users
 */
export const searchUserSchema = z.object({
  query: z.string().optional(),
  skip: z.number().min(0).default(0),
  take: z.number().min(1).max(100).default(10),
  orderBy: z.enum(['name', 'email', 'createdAt']).default('createdAt'),
  orderDirection: z.enum(['asc', 'desc']).default('desc'),
});

// =============================================================================
// Base CRUD Router - Provides standard operations
// =============================================================================

const baseCrudRouter = createCrudRouter('User', createUserSchema, updateUserSchema);

// =============================================================================
// Extended User Router - Adds custom procedures beyond basic CRUD
// =============================================================================

export const userRouter = router({
  // Include all base CRUD operations
  ...baseCrudRouter._def.procedures,

  /**
   * Get all users with pagination and sorting
   * Overrides the base getAll to include post/comment counts
   */
  getAll: publicProcedure
    .input(
      z.object({
        skip: z.number().min(0).optional().default(0),
        take: z.number().min(1).max(100).optional().default(10),
        orderBy: z.enum(['name', 'email', 'createdAt']).optional().default('createdAt'),
        orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
      })
    )
    .query(async ({ input }) => {
      const [data, count] = await Promise.all([
        prisma.user.findMany({
          skip: input.skip,
          take: input.take,
          orderBy: { [input.orderBy]: input.orderDirection },
          include: {
            _count: {
              select: {
                posts: true,
                comments: true,
              },
            },
          },
        }),
        prisma.user.count(),
      ]);

      return { data, count };
    }),

  /**
   * Get a single user by ID with full relations
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.id },
        include: {
          posts: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
          comments: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
          settings: true,
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    }),

  /**
   * Find user by email address
   */
  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        include: {
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
      });

      return user;
    }),

  /**
   * Search users by name or email
   */
  search: publicProcedure.input(searchUserSchema).query(async ({ input }) => {
    const where = input.query
      ? {
          OR: [
            { name: { contains: input.query, mode: 'insensitive' as const } },
            { email: { contains: input.query, mode: 'insensitive' as const } },
            { bio: { contains: input.query, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, count] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: input.skip,
        take: input.take,
        orderBy: { [input.orderBy]: input.orderDirection },
        include: {
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { data, count };
  }),

  /**
   * Create user with optional initial settings
   */
  create: publicProcedure
    .input(
      createUserSchema.extend({
        createSettings: z.boolean().optional().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { createSettings, ...userData } = input;

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new Error('A user with this email already exists');
      }

      return await prisma.user.create({
        data: {
          ...userData,
          settings: createSettings
            ? {
                create: {
                  theme: 'auto',
                  notifications: true,
                  emailUpdates: false,
                  publicProfile: true,
                },
              }
            : undefined,
        },
        include: {
          settings: true,
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
      });
    }),

  /**
   * Update user settings
   */
  updateSettings: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        settings: z.object({
          theme: z.enum(['light', 'dark', 'auto']).optional(),
          notifications: z.boolean().optional(),
          emailUpdates: z.boolean().optional(),
          publicProfile: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
        include: { settings: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.settings) {
        // Update existing settings
        return await prisma.userSettings.update({
          where: { userId: input.userId },
          data: input.settings,
        });
      } else {
        // Create settings if they don't exist
        return await prisma.userSettings.create({
          data: {
            userId: input.userId,
            theme: input.settings.theme ?? 'auto',
            notifications: input.settings.notifications ?? true,
            emailUpdates: input.settings.emailUpdates ?? false,
            publicProfile: input.settings.publicProfile ?? true,
          },
        });
      }
    }),

  /**
   * Get user statistics
   */
  getStats: publicProcedure.query(async () => {
    const [totalUsers, newUsersThisWeek, usersWithPosts] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.user.count({
        where: {
          posts: {
            some: {},
          },
        },
      }),
    ]);

    return {
      totalUsers,
      newUsersThisWeek,
      usersWithPosts,
      usersWithoutPosts: totalUsers - usersWithPosts,
    };
  }),
});

// Export types for use in frontend
export type UserRouter = typeof userRouter;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type SearchUserInput = z.infer<typeof searchUserSchema>;
