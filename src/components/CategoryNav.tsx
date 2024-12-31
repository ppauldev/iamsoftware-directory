export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';

interface CategoryNavProps {
  currentCategory?: string;
}

interface CategoryWithCount extends Category {
  _count: {
    websites: number;
  };
}

async function getCategories(): Promise<CategoryWithCount[]> {
  try {
    return await prisma.category.findMany({
      include: {
        _count: { select: { websites: true } }
      },
      orderBy: [
        { websites: { _count: 'desc' } },
        { name: 'asc' } // Secondary sort for consistent ordering
      ]
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export async function CategoryNav({ currentCategory }: CategoryNavProps) {
  const categories = await getCategories();

  if (!categories.length) {
    return null;
  }

  // Decode and normalize the current category for comparison
  const normalizedCurrentCategory = currentCategory
    ? decodeURIComponent(currentCategory).toLowerCase()
    : '';

  return (
    <nav className="flex flex-wrap gap-2 pb-2">
      {categories.map(category => {
        // Normalize each category name for comparison
        const isActive = category.name.toLowerCase() === normalizedCurrentCategory;

        return (
          <Link
            key={category.id}
            href={`/category/${encodeURIComponent(category.name)}`}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors whitespace-nowrap
              ${isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
              }`}
          >
            <span>{category.name}</span>
            <span className={`text-sm ${isActive
              ? 'text-primary-foreground/80'
              : 'text-muted-foreground'
              }`}>
              ({category._count.websites})
            </span>
          </Link>
        );
      })}
    </nav>
  );
} 