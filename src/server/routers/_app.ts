import { router } from '../trpc';
import { categoryRouter } from './category';
import { websiteRouter } from './website';

export const appRouter = router({
  category: categoryRouter,
  website: websiteRouter,
});

export type AppRouter = typeof appRouter; 