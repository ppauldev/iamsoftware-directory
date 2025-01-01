import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { WebsiteCard } from '@/components/WebsiteCard';
import CategoryNav from '@/components/CategoryNav';
import { SortSelect } from '@/components/SortSelect';
import { SearchBar } from '@/components/SearchBar';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: {
    sort?: 'rating' | 'newest' | 'name' | 'reviews';
    q?: string;
  };
}

interface Website {
  id: string;
  name: string;
  approved: boolean;
  description: string;
  createdAt: Date;
  url: string;
  thumbnail: string | null;
  categoryId: string;
  ownerId: string;
  ratings: { value: number }[];
  category: { name: string };
  tags: { id: string; name: string }[];
  _count: { ratings: number; reviews: number };
  tier: number;
}

interface Category {
  id: string;
  name: string;
  websites: Website[];
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const sort = searchParams.sort || 'rating';
  const search = searchParams.q;

  const [category, allCategories] = await Promise.all([
    prisma.category.findFirst({
      where: {
        name: {
          equals: params.slug.replace(/-/g, ' '),
          mode: 'insensitive'
        }
      },
      include: {
        websites: {
          where: {
            approved: true,
            ...(search ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { some: { name: { contains: search, mode: 'insensitive' } } } },
              ]
            } : {})
          },
          include: {
            category: true,
            tags: true,
            ratings: true,
            _count: {
              select: { ratings: true, reviews: true }
            }
          },
          orderBy: sort === 'rating'
            ? [{ ratings: { _count: 'desc' } }, { name: 'asc' }]
            : sort === 'newest'
              ? [{ createdAt: 'desc' }, { name: 'asc' }]
              : [{ name: 'asc' }]
        }
      }
    }) as Promise<Category | null>,
    prisma.category.findMany({
      include: {
        websites: {
          where: { approved: true }
        },
        _count: {
          select: {
            websites: {
              where: { approved: true }
            }
          }
        }
      },
      orderBy: [
        { websites: { _count: 'desc' } },
        { name: 'asc' }
      ]
    })
  ]);

  if (!category) {
    return <div>Category not found</div>;
  }

  const websitesWithAvgRating = category.websites.map((website: Website) => {
    console.log('Processing website:', {
      id: website.id,
      name: website.name,
      tier: website.tier,
      hasCategory: !!website.category,
      hasTags: Array.isArray(website.tags)
    });

    return {
      ...website,
      averageRating: website.ratings.length
        ? website.ratings.reduce((acc, curr) => acc + curr.value, 0) / website.ratings.length
        : undefined
    };
  });

  console.log('Category page data:', {
    categoryName: category.name,
    websiteCount: websitesWithAvgRating.length,
    websites: websitesWithAvgRating.map(w => ({
      id: w.id,
      name: w.name,
      tier: w.tier
    }))
  });

  return (
    <main className="container py-8">
      <CategoryNav categories={allCategories} />

      <section className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{category.name}</h2>
          <div className="flex items-center gap-4">
            <SearchBar />
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by</span>
              <SortSelect defaultValue={sort} />
            </div>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-[300px] rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {websitesWithAvgRating.map(website => (
              <WebsiteCard key={website.id} website={website} />
            ))}
          </div>
        </Suspense>
      </section>
    </main>
  );
} 