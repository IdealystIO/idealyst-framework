import { initTRPC } from '@trpc/server';
import { type Context } from './context.js';
import { ZodError } from 'zod';

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// Export reusable router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// You can create additional procedures with middleware here
// For example, a protected procedure that requires authentication:
// export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
//   // Add your authentication logic here
//   // Example: check for valid session/token
//   return next({ ctx: { ...ctx, user: { id: 'user-id' } } });
// }); 