'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';

interface SortSelectProps {
  defaultValue: string;
}

const sortOptions = {
  rating: 'Most Popular',
  reviews: 'Most Reviewed',
  newest: 'Recently Added',
  name: 'Alphabetical',
} as const;

export function SortSelect({ defaultValue }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    params.delete('page');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Select defaultValue={defaultValue} onValueChange={handleSort}>
      <SelectTrigger className="w-[160px] bg-background/50 hover:bg-background/80 transition-colors">
        <SelectValue placeholder="Select order..." />
      </SelectTrigger>
      <SelectContent align="end">
        {Object.entries(sortOptions).map(([key, label]) => (
          <SelectItem
            key={key}
            value={key}
            className="cursor-pointer"
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function SortSelectSkeleton() {
  return <div className="w-[160px] h-10 rounded-md bg-muted/50 animate-pulse" />;
} 