import Image from 'next/image';
import Link from 'next/link';
import { Website } from '@prisma/client';

interface WebsiteCardProps {
  website: Website & {
    category: { name: string };
    tags: { name: string }[];
    _count: { ratings: number; reviews: number };
    averageRating?: number;
  };
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  return (
    <div className="group relative rounded-lg border p-4 hover:shadow-lg transition-shadow">
      <div className="aspect-[3/2] relative rounded-md overflow-hidden mb-4">
        <Image
          src={website.thumbnail || '/placeholder-website.png'}
          alt={website.name}
          fill
          className="object-cover"
        />
      </div>

      <Link href={`/website/${website.id}`}>
        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary">
          {website.name}
        </h3>
      </Link>

      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
        {website.description}
      </p>

      <div className="flex items-center gap-2 mb-2">
        <Link
          href={`/category/${website.category.name}`}
          className="text-xs bg-secondary px-2 py-1 rounded-full hover:bg-secondary/80"
        >
          {website.category.name}
        </Link>
      </div>

      <div className="flex gap-1">
        {website.tags.slice(0, 3).map(tag => (
          <span
            key={tag.name}
            className="text-xs text-muted-foreground"
          >
            #{tag.name}
          </span>
        ))}
      </div>
    </div>
  );
} 