'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  _count: {
    websites: number;
  };
}

interface CategoryFilterProps {
  categories: Category[];
  currentPath: string;
}

export function CategoryFilter({ categories, currentPath }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse and clean up categories from URL
  const activeCategories = searchParams
    .get('categories')
    ?.split(',')
    .filter(Boolean) || [];

  const toggleCategory = (categoryName: string) => {
    const params = new URLSearchParams(searchParams);
    const updatedCategories = new Set(activeCategories);

    if (updatedCategories.has(categoryName)) {
      updatedCategories.delete(categoryName);
    } else {
      updatedCategories.add(categoryName);
    }

    // Clean up URL parameters
    if (updatedCategories.size === 0) {
      params.delete('categories');
    } else {
      params.set('categories', Array.from(updatedCategories).sort().join(','));
    }
    params.delete('page');

    // Only include non-empty parameters
    const queryString = params.toString();
    const newPath = queryString
      ? `${currentPath}?${queryString}`
      : currentPath;

    router.push(newPath, { scroll: false });
  };

  return (
    <nav className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => toggleCategory(category.name)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors
            ${activeCategories.includes(category.name)
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/80'
            }`}
        >
          <span>{category.name}</span>
          <span className={`text-sm ${activeCategories.includes(category.name)
            ? 'text-primary-foreground/80'
            : 'text-muted-foreground'
            }`}>
            ({category._count.websites})
          </span>
        </button>
      ))}
    </nav>
  );
} 