'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

interface PostNotFoundProps {
  slug?: string;
  isError?: boolean;
}

export function PostNotFound({ slug, isError = false }: PostNotFoundProps) {
  return (
    <MainLayout maxWidth="narrow">
      <div className="py-12 text-center flex flex-col items-center">
        <FileQuestion className="w-16 h-16 text-muted-foreground mb-6" />

        <h1 className="text-2xl font-bold mb-4">
          {isError ? 'Error Loading Post' : 'Post Not Found'}
        </h1>

        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {isError
            ? `There was an error loading this post. The post may not exist or there might be an issue with the connection.`
            : `We couldn't find a post with the slug "${slug}". It may have been removed or the URL might be incorrect.`
          }
        </p>

        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/">Go to Home</Link>
          </Button>
          <Button asChild>
            <Link href="/articles">Browse All Articles</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
} 