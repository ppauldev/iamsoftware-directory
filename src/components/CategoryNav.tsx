'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createSlug } from '@/lib/utils';

interface CategoryNavProps {
  categories: {
    id: string;
    name: string;
    _count: { websites: number };
  }[];
  activeCategory?: {
    id: string;
    name: string;
  };
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  if (!categories?.length) return null;

  const pathname = usePathname();
  const router = useRouter();

  // Get the current category slug from the URL
  const currentCategorySlug = pathname.startsWith('/category/')
    ? pathname.split('/')[2]
    : null;

  const handleClick = (categoryName: string, e: React.MouseEvent) => {
    // Compare slugs instead of raw names
    if (createSlug(categoryName) === currentCategorySlug) {
      e.preventDefault();
      router.push('/', { scroll: false });
    }
  };

  return (
    <nav className="flex flex-wrap gap-2 pb-2">
      {categories.map(category => {
        // Compare slugs for active state
        const isActive = createSlug(category.name) === currentCategorySlug;

        return (
          <Link
            key={category.id}
            href={`/category/${createSlug(category.name)}`}
            onClick={(e) => handleClick(category.name, e)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors whitespace-nowrap
              ${isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}
          >
            <span>{category.name}</span>
            <span className={`text-sm ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              ({category._count.websites})
            </span>
          </Link>
        );
      })}
    </nav>
  );
} 