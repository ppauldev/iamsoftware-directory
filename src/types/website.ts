import { Website, Category, Tag } from '@prisma/client';

export interface WebsiteWithRelations extends Website {
  category: Category;
  tags: Tag[];
  _count: {
    ratings: number;
    reviews: number;
  };
  extendedDescription?: string | null;
} 