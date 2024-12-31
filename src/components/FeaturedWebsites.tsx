'use client';

import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Website } from '@/types';
import Image from 'next/image';

export function FeaturedWebsites() {
  const { data: websites, isLoading } = trpc.website.getFeatured.useQuery<Website[]>();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {websites?.map((website) => (
        <Card key={website.id} className="hover:shadow-lg transition-shadow">
          {website.thumbnail && (
            <div className="relative aspect-video">
              <Image
                src={website.thumbnail}
                alt={website.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-lg">{website.name}</CardTitle>
            <CardDescription>{website.description}</CardDescription>
            <Link
              href={`/website/${website.id}`}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              Learn More →
            </Link>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
} 