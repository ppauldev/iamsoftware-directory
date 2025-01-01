import { prisma } from '@/lib/prisma';
import { WebsiteCard } from '@/components/WebsiteCard';
import CategoryNav from '@/components/CategoryNav';
import { SortSelect } from '@/components/SortSelect';
import { SearchBar } from '@/components/SearchBar';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { sort?: string; q?: string };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const sort = searchParams.sort || 'rating';
  const search = searchParams.q;

  const [category, allCategories] = await Promise.all([
    prisma.category.findUnique({
      where: { id: params.slug },
      include: { /* ... */ }
    }),
    prisma.category.findMany({
      include: { _count: { select: { websites: true } } }
    })
  ]);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <main className="container py-8">
      <CategoryNav
        categories={allCategories}
        activeCategory={{ id: category.id, name: category.name }}
      />

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

        // ... rest of the component
      </section>
    </main>
  );
} 