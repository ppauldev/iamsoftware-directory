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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const sort = searchParams.sort || 'rating';
  const search = searchParams.q;

  const [category, allCategories] = await Promise.all([
    prisma.category.findUnique({
      where: { id: params.slug },
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
    }),
    prisma.category.findMany({
      include: {
        _count: { select: { websites: true } }
      }
    })
  ]);

  if (!category) {
    return <div>Category not found</div>;
  }

  const websitesWithAvgRating = category.websites.map(website => ({
    ...website,
    averageRating: website.ratings.length
      ? website.ratings.reduce((acc, curr) => acc + curr.value, 0) / website.ratings.length
      : undefined
  }));

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {websitesWithAvgRating.map(website => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </div>
      </section>
    </main>
  );
} 