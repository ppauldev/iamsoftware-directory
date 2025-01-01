import { Skeleton } from '@/components/ui/skeleton';

export function CategoryNavSkeleton() {
  return (
    <nav className="flex flex-wrap gap-2 pb-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-8 w-24 rounded-full"
        />
      ))}
    </nav>
  );
} 