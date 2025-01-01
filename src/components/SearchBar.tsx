'use client';

import { Input } from './ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchSuggestions } from './SearchSuggestions';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const handleSearch = useDebounce((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    startTransition(() => {
      router.push(`/?${params.toString()}`, { scroll: false });
    });
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