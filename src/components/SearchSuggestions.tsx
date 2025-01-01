'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { highlightText } from '@/lib/utils';

interface Suggestion {
  id: string;
  type: 'website' | 'category' | 'tag';
  text: string;
  subtext?: string;
}

export function SearchSuggestions({
  query,
  onSelect,
}: {
  query: string;
  onSelect: () => void;
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    // Fetch suggestions
    fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => setSuggestions(data));
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const suggestion = suggestions[selectedIndex];
      handleSelect(suggestion);
    }
  };

  const handleSelect = (suggestion: Suggestion) => {
    switch (suggestion.type) {
      case 'website':
        router.push(`/website/${suggestion.id}`);
        break;
      case 'category':
        router.push(`/category/${suggestion.id}`);
        break;
      case 'tag':
        router.push(`/?tags=${suggestion.id}`);
        break;
    }
    onSelect();
  };

  if (!suggestions.length) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50"
      onKeyDown={handleKeyDown}
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={`${suggestion.type}-${suggestion.id}`}
          className={`w-full px-4 py-2 text-left hover:bg-accent flex flex-col ${index === selectedIndex ? 'bg-accent' : ''
            }`}
          onClick={() => handleSelect(suggestion)}
        >
          <span className="font-medium">
            {highlightText(suggestion.text, query)}
          </span>
          {suggestion.subtext && (
            <span className="text-sm text-muted-foreground">
              {suggestion.subtext}
            </span>
          )}
        </button>
      ))}
    </div>
  );
} 