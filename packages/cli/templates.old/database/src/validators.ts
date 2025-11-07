// Create model validators for each model defined in the Prisma schema using Zod
// E.g
import { z } from 'zod';

export const TestValidator = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2).max(100),
  age: z.number().min(0).optional()
});