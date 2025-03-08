'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

interface CompanyNotFoundProps {
  slug?: string;
  isError?: boolean;
}

export function CompanyNotFound({ slug, isError = false }: CompanyNotFoundProps) {
  return (
    <MainLayout>
      <div className="py-12 text-center flex flex-col items-center">
        <Building2 className="w-16 h-16 text-muted-foreground mb-6" />

        <h1 className="text-2xl font-bold mb-4">
          {isError ? 'Error Loading Company' : 'Company Not Found'}
        </h1>

        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {isError
            ? `There was an error loading this company. The company may not exist or there might be an issue with the connection.`
            : `We couldn't find a company with the slug "${slug}". It may have been removed or the URL might be incorrect.`
          }
        </p>

        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/">Browse All Companies</Link>
          </Button>
          <Button asChild>
            <Link href="/articles">View Articles</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
} 