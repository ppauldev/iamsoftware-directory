export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { WebsiteCard } from '@/components/WebsiteCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { headers } from 'next/headers';

async function getFeaturedWebsites(categories?: string[]) {
  const where = {
    approved: true,
    ...(categories?.length ? {
      category: {
        name: {
          in: categories
        }
      }
    } : {})
  };

  return prisma.website.findMany({
    where,
    include: {
      category: { select: { name: true } },
      tags: { select: { name: true } },
      _count: {
        select: { ratings: true, reviews: true }
      },
      ratings: true
    },
    orderBy: [
      { ratings: { _count: 'desc' as const } },
      { reviews: { _count: 'desc' as const } }
    ],
    take: 12
  });
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

export default async function HomePage({
  searchParams
}: {
  searchParams: { categories?: string }
}) {
  const categories = searchParams.categories?.split(',');
  const allCategories = await getCategories();
  const websites = await getFeaturedWebsites(categories);

  if (!websites?.length) {
    return (
      <main className="container py-8">
        <CategoryFilter categories={allCategories} currentPath="/" />
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Featured Websites</h2>
          <p>No websites found. Please add some websites first.</p>
        </section>
      </main>
    );
  }

  const websitesWithAvgRating = websites.map(website => ({
    ...website,
    averageRating: website.ratings.length
      ? website.ratings.reduce((acc, curr) => acc + curr.value, 0) / website.ratings.length
      : undefined
  }));

  return (
    <main className="container py-8">
      <CategoryFilter categories={allCategories} currentPath="/" />

      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Featured Websites</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {websitesWithAvgRating.map(website => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </div>
      </section>
    </main>
  );
} 