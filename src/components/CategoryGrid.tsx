'use client';

import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { CategoryWithCount } from '@/types';

export function CategoryGrid() {
  const { data: categories, isLoading } = trpc.category.getAll.useQuery<CategoryWithCount[]>();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories?.map((category) => (
        <Link key={category.id} href={`/category/${category.id}`}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <CardDescription>
                {category._count.websites} websites
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
} 