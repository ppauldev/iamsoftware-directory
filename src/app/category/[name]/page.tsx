import { prisma } from '@/lib/prisma';
import { WebsiteCard } from '@/components/WebsiteCard';
import CategoryNav from '@/components/CategoryNav';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SortSelect, SortSelectSkeleton } from '@/components/SortSelect';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Website, Category, Rating } from '@prisma/client';
import { getCategories } from '@/lib/categories';
import { Pagination, PaginationSkeleton } from '@/components/Pagination';
import { Metadata } from 'next';
import Script from 'next/script';
import { createSlug } from '@/lib/utils';

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
        equals: decodeURIComponent(categoryName).replace(/-/g, ' '),
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

  try {
    const [data, categories] = await Promise.all([
      getCategoryWebsites(params.name, page, sort),
      getCategories()
    ]);

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

    const jsonLd = await generateJsonLd({ params, searchParams });

    return (
      <main className="container py-8">
        <Script
          id="category-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <CategoryNav categories={categories} />

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

          <Suspense fallback={<PaginationSkeleton />}>
            {data.pagination.totalPages > 1 && (
              <Pagination
                {...data.pagination}
                createUrl={(page) =>
                  `/category/${encodeURIComponent(params.name)}?${new URLSearchParams({
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
  } catch (error) {
    return (
      <main className="container py-8">
        <div className="rounded-md bg-destructive/10 p-6 text-center">
          <h1 className="text-lg font-semibold text-destructive mb-2">
            Error Loading Category
          </h1>
          <p className="text-muted-foreground">
            There was a problem loading this category. Please try again later.
          </p>
        </div>
      </main>
    );
  }
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

export async function generateMetadata({
  params
}: {
  params: { name: string }
}): Promise<Metadata> {
  const category = await prisma.category.findFirst({
    where: {
      name: {
        equals: decodeURIComponent(params.name).replace(/-/g, ' '),
        mode: 'insensitive'
      }
    },
    include: {
      _count: { select: { websites: true } }
    }
  });

  if (!category) return {
    title: 'Category Not Found',
    description: 'The requested category could not be found.'
  };

  const canonicalSlug = createSlug(category.name);
  const canonicalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/category/${canonicalSlug}`;

  return {
    title: `${category.name} Tools and Websites - AI Directory`,
    description: `Discover ${category._count.websites} curated ${category.name.toLowerCase()} tools and websites. Browse, rate, and review the best ${category.name.toLowerCase()} resources.`,
    openGraph: {
      title: `${category.name} - AI Directory`,
      description: `Explore ${category._count.websites} hand-picked ${category.name.toLowerCase()} tools and websites.`,
      url: canonicalUrl,
      type: 'website',
    },
    alternates: {
      canonical: canonicalUrl
    }
  };
}

export async function generateJsonLd({
  params,
  searchParams
}: {
  params: { name: string },
  searchParams: { sort?: string, page?: string }
}) {
  const category = await prisma.category.findFirst({
    where: {
      name: {
        equals: decodeURIComponent(params.name).replace(/-/g, ' '),
        mode: 'insensitive'
      }
    },
    include: {
      websites: {
        where: { approved: true },
        include: {
          ratings: true,
          _count: { select: { reviews: true } }
        }
      }
    }
  });

  if (!category) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Tools and Websites`,
    description: `Curated collection of ${category.name.toLowerCase()} tools and websites`,
    url: `/category/${params.name}`,
    numberOfItems: category.websites.length,
    itemListElement: category.websites.map((website, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'WebSite',
        name: website.name,
        description: website.description,
        url: website.url,
        aggregateRating: website.ratings.length ? {
          '@type': 'AggregateRating',
          ratingValue: website.ratings.reduce((acc, curr) => acc + curr.value, 0) / website.ratings.length,
          ratingCount: website.ratings.length,
          reviewCount: website._count.reviews
        } : undefined
      }
    }))
  };
} 