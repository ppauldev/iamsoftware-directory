import { prisma } from '@/lib/prisma';
import { WebsiteCard } from '@/components/WebsiteCard';
import { CategoryNav } from '@/components/CategoryNav';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SortSelect, SortSelectSkeleton } from '@/components/SortSelect';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Website, Category, Rating } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: {
    name: string;
  };
  searchParams: {
    page?: string;
    sort?: 'rating' | 'newest' | 'name' | 'reviews';
  };
}

async function getCategoryWebsites(
  categoryName: string,
  page = 1,
  sort: 'rating' | 'newest' | 'name' | 'reviews' = 'rating'
) {
  const itemsPerPage = 12;
  const skip = (page - 1) * itemsPerPage;

  const category = await prisma.category.findFirst({
    where: {
      name: {
        equals: decodeURIComponent(categoryName),
        mode: 'insensitive'
      }
    },
    include: {
      _count: { select: { websites: true } },
    },
  });

  if (!category) return null;

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

  const websites = await prisma.website.findMany({
    where: {
      categoryId: category.id,
      approved: true,
    },
    include: {
      category: { select: { name: true } },
      tags: { select: { name: true } },
      _count: {
        select: { ratings: true, reviews: true }
      },
      ratings: true,
    },
    orderBy,
    take: itemsPerPage,
    skip,
  });

  const totalPages = Math.ceil(category._count.websites / itemsPerPage);

  return {
    category,
    websites,
    pagination: {
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    }
  };
}

interface WebsiteWithRelations extends Website {
  category: { name: string };
  tags: { name: string }[];
  ratings: Rating[];
  _count: {
    ratings: number;
    reviews: number;
  };
  averageRating?: number;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const sort = (searchParams.sort || 'rating') as 'rating' | 'newest' | 'name' | 'reviews';

  const data = await getCategoryWebsites(params.name, page, sort);

  if (!data) {
    notFound();
  }

  // Validate page number is within bounds
  if (page > data.pagination.totalPages) {
    notFound();
  }

  const websitesWithAvgRating = data.websites.map(website => ({
    ...website,
    averageRating: website.ratings.length
      ? website.ratings.reduce((acc, curr) => acc + curr.value, 0) / website.ratings.length
      : undefined
  }));

  return (
    <main className="container py-8">
      <nav className="flex items-center gap-2 text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground">{data.category.name}</span>
      </nav>

      <CategoryNav currentCategory={params.name} />

      <section className="mt-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{data.category.name}</h1>
            <p className="text-muted-foreground mt-2">
              {data.category._count.websites} {data.category._count.websites === 1 ? 'website' : 'websites'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <span className="text-sm text-muted-foreground">Sort by</span>
            <SortSelect defaultValue={sort} />
          </div>
        </div>

        <Suspense fallback={<WebsiteGridSkeleton />}>
          {websitesWithAvgRating.length === 0 ? (
            <EmptyState />
          ) : (
            <WebsiteGrid websites={websitesWithAvgRating} />
          )}
        </Suspense>

        {data.pagination.totalPages > 1 && (
          <nav className="flex justify-center gap-2 mt-8">
            {data.pagination.hasPrevPage && (
              <Link
                href={`/category/${params.name}?page=${page - 1}&sort=${sort}`}
                className="px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80"
              >
                Previous
              </Link>
            )}

            {Array.from({ length: data.pagination.totalPages }, (_, i) => (
              <Link
                key={i + 1}
                href={`/category/${params.name}?page=${i + 1}&sort=${sort}`}
                className={`px-4 py-2 rounded-md ${data.pagination.currentPage === i + 1
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
                  }`}
              >
                {i + 1}
              </Link>
            ))}

            {data.pagination.hasNextPage && (
              <Link
                href={`/category/${params.name}?page=${page + 1}&sort=${sort}`}
                className="px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80"
              >
                Next
              </Link>
            )}
          </nav>
        )}
      </section>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-lg">
      <p className="text-lg text-muted-foreground">
        No websites found in this category.
      </p>
    </div>
  );
}

function WebsiteGrid({ websites }: { websites: WebsiteWithRelations[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {websites.map(website => (
        <WebsiteCard key={website.id} website={website} />
      ))}
    </div>
  );
}

function WebsiteGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="h-[200px] rounded-lg" />
      ))}
    </div>
  );
} 