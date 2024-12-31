export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: { select: { websites: true } }
    }
  });
}

export async function CategoryNav() {
  const categories = await getCategories();

  return (
    <nav className="flex gap-4 overflow-x-auto pb-2">
      {categories.map(category => (
        <Link
          key={category.id}
          href={`/category/${category.name}`}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80"
        >
          <span>{category.name}</span>
          <span className="text-sm text-muted-foreground">
            ({category._count.websites})
          </span>
        </Link>
      ))}
    </nav>
  );
} 