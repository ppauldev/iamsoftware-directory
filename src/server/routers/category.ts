import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const categoryRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.category.findMany({
      include: {
        _count: {
          select: { websites: true }
        }
      }
    });
  }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(50),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.category.create({
        data: input,
      });
    }),
}); 