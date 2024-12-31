import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const websiteRouter = router({
  getFeatured: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.website.findMany({
      where: {
        approved: true,
      },
      take: 6,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),
}); 