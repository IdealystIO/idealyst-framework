import { z } from 'zod';

// Add your Zod schemas here to match your Prisma models
// Example:
// export const UserSchema = z.object({
//   id: z.string().cuid(),
//   email: z.string().email(),
//   name: z.string().optional(),
//   createdAt: z.date(),
//   updatedAt: z.date(),
// });

// export const CreateUserSchema = UserSchema.omit({
//   id: true,
//   createdAt: true,
//   updatedAt: true,
// });

// export const UpdateUserSchema = CreateUserSchema.partial();

// Export all your schemas
export const schemas = {
  // user: UserSchema,
  // createUser: CreateUserSchema,
  // updateUser: UpdateUserSchema,
} as const;
