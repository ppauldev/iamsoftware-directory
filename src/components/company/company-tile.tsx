import Link from 'next/link';
import { Company } from '@/lib/graphql-client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from './star-rating';
import { ArrowRight } from 'lucide-react';

interface CompanyTileProps {
  company: Company;
}

export function CompanyTile({ company }: CompanyTileProps) {
  // Limit description to 200 characters
  const truncatedDescription = company.description && company.description.length > 200
    ? `${company.description.substring(0, 200)}...`
    : company.description;

  // Get top 3 categories with null checking
  const displayedCategories = company.topCategories ? company.topCategories.slice(0, 3) : [];
  const remainingCategories = company.categories.length - displayedCategories.length;

  // Debugging log
  console.log(`Company ${company.name}: topCategories=${company.topCategories?.length || 0}, categories=${company.categories.length}`);

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow border border-muted overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-xl line-clamp-2">
          <Link href={`/companies/${company.slug}`} className="hover:text-primary hover:underline transition-colors">
            {company.name}
          </Link>
        </CardTitle>

        {company.rating !== undefined && company.rating > 0 && (
          <StarRating rating={company.rating} />
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {displayedCategories.map((category) => (
            <Badge key={category.id} variant="secondary" className="text-xs">
              {category.name}
            </Badge>
          ))}
          {remainingCategories > 0 && (
            <Badge variant="outline" className="text-xs">+{remainingCategories} more</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow pt-1">
        <p className="text-sm text-muted-foreground line-clamp-4">
          {truncatedDescription || 'No description available.'}
        </p>
      </CardContent>

      <CardFooter className="border-t bg-muted/30 pt-3">
        <Button asChild className="w-full" variant="outline">
          <Link href={`/companies/${company.slug}`} className="gap-2">
            View Details
            <ArrowRight size={16} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 