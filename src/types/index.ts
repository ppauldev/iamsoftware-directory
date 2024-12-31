import { inferRouterOutputs, inferRouterInputs } from '@trpc/server';
import { type AppRouter } from '@/server/routers/_app';

type RouterOutput = inferRouterOutputs<AppRouter>;
type RouterInput = inferRouterInputs<AppRouter>;

export type Category = RouterOutput['category']['getAll'][0];
export type Website = RouterOutput['website']['getFeatured'][0];

export interface CategoryWithCount extends Category {
  _count: {
    websites: number;
  };
} 