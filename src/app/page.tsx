export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { WebsiteCard } from '@/components/WebsiteCard';
import { CategoryNav } from '@/components/CategoryNav';

async function getFeaturedWebsites() {
  return prisma.website.findMany({
    where: { approved: true },
    include: {
      category: { select: { name: true } },
      tags: { select: { name: true } },
      _count: {
        select: { ratings: true, reviews: true }
      },
      ratings: {
        select: { value: true }
      }
    },
    orderBy: [
      { ratings: { _count: 'desc' } },
      { reviews: { _count: 'desc' } }
    ],
    take: 12
  });
}

export default async function HomePage() {
  const websites = await getFeaturedWebsites();

  if (!websites?.length) {
    return (
      <main className="container py-8">
        <CategoryNav />
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
      <CategoryNav />

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