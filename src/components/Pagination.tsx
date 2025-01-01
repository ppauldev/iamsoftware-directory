import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  createUrl: (page: number) => string;
}

export function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  createUrl
}: PaginationProps) {
  return (
    <nav className="flex justify-center gap-2 mt-8">
      {hasPrevPage && (
        <Link
          href={createUrl(currentPage - 1)}
          className="px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80"
        >
          Previous
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => (
        <Link
          key={i + 1}
          href={createUrl(i + 1)}
          className={`px-4 py-2 rounded-md ${currentPage === i + 1
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary hover:bg-secondary/80'
            }`}
        >
          {i + 1}
        </Link>
      ))}

      {hasNextPage && (
        <Link
          href={createUrl(currentPage + 1)}
          className="px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80"
        >
          Next
        </Link>
      )}
    </nav>
  );
}

export function PaginationSkeleton() {
  return (
    <nav className="flex justify-center gap-2 mt-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-10 h-10 rounded-md bg-muted animate-pulse"
        />
      ))}
    </nav>
  );
} 