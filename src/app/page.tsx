export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { WebsiteCard } from '@/components/WebsiteCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { headers } from 'next/headers';
import CategoryNav from '@/components/CategoryNav';
import { Suspense } from 'react';
import { CategoryNavSkeleton } from '@/components/CategoryNav.loading';
import { SortSelect } from '@/components/SortSelect';
import Link from 'next/link';
import { Pagination, PaginationSkeleton } from '@/components/Pagination';

interface HomePageProps {
  searchParams: {
    categories?: string;
    sort?: 'rating' | 'newest' | 'name' | 'reviews';
    page?: string;
    q?: string;
  }
}

async function getFeaturedWebsites(
  sort: 'rating' | 'newest' | 'name' | 'reviews' = 'rating',
  page = 1,
  search?: string
) {
  const itemsPerPage = 12;
  const skip = (page - 1) * itemsPerPage;

  const where = {
    approved: true,
    ...(search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { category: { name: { contains: search, mode: 'insensitive' as const } } },
        { tags: { some: { name: { contains: search, mode: 'insensitive' as const } } } }
      ]
    } : {})
  };

  const orderBy = (() => {
    switch (sort) {
      case 'rating':
        return [
          { ratings: { _count: 'desc' as const } },
          { name: 'asc' as const }
        ];
      case 'reviews':
        return [
          { reviews: { _count: 'desc' as const } },
          { name: 'asc' as const }
        ];
      case 'name':
        return [{ name: 'asc' as const }];
      case 'newest':
        return [
          { createdAt: 'desc' as const },
          { name: 'asc' as const }
        ];
      default:
        return [{ name: 'asc' as const }];
    }
  })();

  const [websites, count] = await Promise.all([
    prisma.website.findMany({
      where,
      include: {
        category: { select: { name: true } },
        tags: { select: { name: true } },
        _count: {
          select: { ratings: true, reviews: true }
        },
        ratings: true
      },
      orderBy,
      take: itemsPerPage,
      skip,
    }),
    prisma.website.count({ where })
  ]);

  const totalPages = Math.ceil(count / itemsPerPage);

  return {
    websites,
    pagination: {
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    }
  };
}

async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: { select: { websites: true } }
    },
    orderBy: [
      { websites: { _count: 'desc' } },
      { name: 'asc' }
    ]
  });
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const sort = (searchParams.sort || 'rating') as 'rating' | 'newest' | 'name' | 'reviews';
  const page = Math.max(1, Number(searchParams.page) || 1);
  const search = searchParams.q;
  const allCategories = await getCategories();
  const data = await getFeaturedWebsites(sort, page, search);

  if (!data.websites.length) {
    return (
      <main className="container py-8">
        <Suspense fallback={<CategoryNavSkeleton />}>
          <CategoryNav categories={allCategories} />
        </Suspense>
        <section className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Websites</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Sort by</span>
              <SortSelect defaultValue={sort} />
            </div>
          </div>
          <p>No websites found. Please add some websites first.</p>
        </section>
      </main>
    );
  }

  const websitesWithAvgRating = data.websites.map(website => ({
    ...website,
    averageRating: website.ratings.length
      ? website.ratings.reduce((acc, curr) => acc + curr.value, 0) / website.ratings.length
      : undefined
  }));

  return (
    <main className="container py-8">
      <Suspense fallback={<CategoryNavSkeleton />}>
        <CategoryNav categories={allCategories} />
      </Suspense>

      <section className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Websites</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Sort by</span>
            <SortSelect defaultValue={sort} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {websitesWithAvgRating.map(website => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </div>

        <Suspense fallback={<PaginationSkeleton />}>
          {data.pagination.totalPages > 1 && (
            <Pagination
              {...data.pagination}
              createUrl={(page) =>
                `/?${new URLSearchParams({
                  sort,
                  page: String(page)
                })}`
              }
            />
          )}
        </Suspense>
      </section>
    </main>
  );
} 