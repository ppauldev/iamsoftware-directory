'use client';

import { Input } from './ui/input';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useTransition, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchSuggestions } from './SearchSuggestions';

interface SearchBarProps {
  defaultValue?: string;
  onSearch?: (term: string) => void;
}

export function SearchBar({ defaultValue = '', onSearch }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(defaultValue);
  const pathname = usePathname();

  const handleSearch = useDebounce((term: string) => {
    if (onSearch) {
      onSearch(term);
    } else {
      // Default behavior for main site search
      const params = new URLSearchParams(searchParams?.toString());
      if (term) {
        params.set('q', term);
      } else {
        params.delete('q');
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }
  }, 300);

  return (
    <div className="relative w-full max-w-sm">
      <Input
        type="search"
        placeholder="Search websites..."
        className="w-full"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
        </div>
      )}
      <SearchSuggestions
        query={query}
        onSelect={() => setQuery('')}
      />
    </div>
  );
} 