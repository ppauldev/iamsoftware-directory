'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Website } from '@prisma/client';
import { createSlug } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface WebsiteCardProps {
  website: Website & {
    category: { name: string };
    tags: { name: string }[];
    _count: { ratings: number; reviews: number };
    averageRating?: number;
    tier: number;
    slug: string;
  };
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  console.log('Full website data:', website);
  const [isMounted, setIsMounted] = useState(false);
  const wrapperClasses = "block relative rounded-lg border p-4 hover:shadow-lg transition-shadow";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const content = (
    <>
      <div className="aspect-[3/2] relative rounded-md overflow-hidden mb-4">
        <Image
          src={website.thumbnail || '/placeholder-website.png'}
          alt={website.name}
          priority={website.tier === 2}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary">
        {website.name}
      </h3>

      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
        {website.description}
      </p>

      <div className="flex items-center gap-2 mb-2">
        {website.tier === 2 ? (
          <span className="text-xs bg-secondary px-2 py-1 rounded-full">
            {website.category.name}
          </span>
        ) : (
          <Link
            href={`/category/${createSlug(website.category.name)}`}
            className="text-xs bg-secondary px-2 py-1 rounded-full hover:bg-secondary/80"
            onClick={(e) => e.stopPropagation()}
          >
            {website.category.name}
          </Link>
        )}
      </div>

      <div className="flex gap-1">
        {website.tags.slice(0, 3).map(tag => (
          <span key={tag.name} className="text-xs text-muted-foreground">
            #{tag.name}
          </span>
        ))}
      </div>

      {website.tier === 2 && (
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
          Premium
        </span>
      )}
    </>
  );

  console.log('Website data:', { name: website.name, slug: website.slug });

  return website.tier === 2 ? (
    <Link href={`/websites/${website.slug}`} className={wrapperClasses}>
      {content}
    </Link>
  ) : (
    <div className={wrapperClasses}>
      {content}
    </div>
  );
} 