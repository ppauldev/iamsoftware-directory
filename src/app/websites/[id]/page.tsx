import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createSlug } from '@/lib/utils';
import { Website, Category, Tag } from '@prisma/client';

interface WebsiteWithRelations extends Website {
  extendedDescription: string | null;
  category: Category;
  tags: Tag[];
  _count: {
    ratings: number;
    reviews: number;
  };
}

export default async function WebsiteDetailPage({
  params
}: {
  params: { id: string }
}) {
  const website = await prisma.website.findUnique({
    where: {
      id: params.id,
      tier: 2,
      approved: true
    },
    include: {
      category: true,
      tags: true,
      _count: {
        select: { ratings: true, reviews: true }
      }
    }
  }) as WebsiteWithRelations | null;

  if (!website) {
    notFound();
  }

  return (
    <main className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="aspect-[16/9] relative rounded-lg overflow-hidden mb-8">
          <Image
            src={website.thumbnail || '/placeholder-website.png'}
            alt={website.name}
            priority
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{website.name}</h1>
            <Link
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="button primary"
            >
              Visit Website
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/category/${createSlug(website.category.name)}`}
              className="text-sm bg-secondary px-3 py-1.5 rounded-full hover:bg-secondary/80"
            >
              {website.category.name}
            </Link>
            <span className="text-sm px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full">
              Premium
            </span>
          </div>

          <p className="text-lg text-muted-foreground">
            {website.description}
          </p>

          {website.extendedDescription && (
            <div className="prose max-w-none">
              {website.extendedDescription}
            </div>
          )}

          <div className="flex gap-2">
            {website.tags.map(tag => (
              <span
                key={tag.name}
                className="text-sm text-muted-foreground"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 