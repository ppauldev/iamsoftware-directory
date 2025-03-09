import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { executeQuery, CompanyBySlugResponse, AllCompaniesResponse } from '@/lib/graphql-client';
import { GET_COMPANY_BY_SLUG, GET_ALL_COMPANIES } from '@/lib/graphql-queries';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/company/star-rating';
import { ExternalLink, Tag } from 'lucide-react';
import { CompanyNotFound } from '@/components/company/company-not-found';

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const data = await executeQuery<CompanyBySlugResponse>(GET_COMPANY_BY_SLUG, { slug });
    const company = data.company;

    if (!company) {
      return {
        title: 'Company Not Found - The IAM Directory',
        description: 'The requested company could not be found in the IAM Directory.',
      };
    }

    return {
      title: `${company.name} - The IAM Directory`,
      description: company.description?.substring(0, 160) || `Information about ${company.name} in The IAM Directory.`,
      keywords: [...company.categories.map((c) => c.name), ...company.tags.map((t) => t.name)],
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error - The IAM Directory',
      description: 'An error occurred while loading this page.',
    };
  }
}

// Generate static params for all possible company slugs
export async function generateStaticParams() {
  const data = await executeQuery<AllCompaniesResponse>(GET_ALL_COMPANIES);
  const companies = data.companies || [];

  return companies.map((company) => ({
    slug: company.slug
  }));
}

// Remove explicit return type to let TypeScript infer it
export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const data = await executeQuery<CompanyBySlugResponse>(GET_COMPANY_BY_SLUG, { slug });
    const company = data.company;
    const relatedPosts = data.posts || [];

    if (!company) {
      return <CompanyNotFound slug={slug} />;
    }

    // Generate URL structures for categories and tags if not provided by backend
    const categoryUrls: Record<string, string> = {};
    const tagUrls: Record<string, string> = {};

    // Create URLs for categories
    company.categories.forEach(category => {
      // Try to find a matching URL from the categoryUrls array
      const customUrlEntry = company.categoryUrls?.find(cu => cu.categoryId === category.slug);
      if (customUrlEntry?.url) {
        categoryUrls[category.id] = customUrlEntry.url;
      } else {
        // Fallback to just the category slug if no URL is available
        categoryUrls[category.id] = "";
      }
    });

    // Create URLs for tags
    company.tags.forEach(tag => {
      // Try to find a matching URL from the tagUrls array
      const customUrlEntry = company.tagUrls?.find(tu => tu.tagId === tag.slug);
      if (customUrlEntry?.url) {
        tagUrls[tag.id] = customUrlEntry.url;
      } else {
        // Fallback to just the tag slug if no URL is available
        tagUrls[tag.id] = ""
      }
    });
    return (
      <MainLayout>
        <Link href="/" className="text-sm text-muted-foreground hover:underline mb-8 inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="m15 18-6-6 6-6"></path></svg>
          Back to all companies
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-10">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">{company.name}</h1>

              {company.rating !== undefined && company.rating > 0 && (
                <div className="mb-4">
                  <StarRating rating={company.rating} />
                </div>
              )}
            </div>

            {company.description && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">About</h2>
                <div className="prose dark:prose-invert max-w-none prose-p:text-base prose-p:leading-relaxed">
                  <p>{company.description}</p>
                </div>
              </div>
            )}

            {company.features && company.features.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Key Features</h2>
                <ul className="space-y-2 ml-6">
                  {company.features.map((feature, index) => (
                    <li key={index} className="flex items-baseline gap-2 text-base">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-2"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {relatedPosts && relatedPosts.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Related Articles</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {relatedPosts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-5 hover:bg-muted/50 transition-colors">
                      <Link href={`/articles/${post.slug}`} className="block">
                        <h3 className="font-medium text-lg hover:underline">{post.title}</h3>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground mt-2">{post.excerpt}</p>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Related Articles</h2>
                <p className="text-muted-foreground">No related articles found for this company.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 md:sticky md:top-24 md:self-start">
            <div className="border rounded-lg p-6 space-y-5 bg-card shadow-sm">
              <h2 className="font-semibold text-lg">Company Information</h2>

              {company.url && (
                <div>
                  <p className="text-sm font-medium mb-2">Website</p>
                  <Button variant="outline" asChild className="w-full">
                    <a href={company.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      Visit Website
                      <ExternalLink size={16} />
                    </a>
                  </Button>
                </div>
              )}

              {company.categories && company.categories.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 h-4 w-4"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {company.categories.map((category) => {
                      const hasUrl = company.categoryUrls?.some(cu => cu.categoryId === category.slug);

                      const Badge = (
                        <span className={`text-xs px-2.5 py-1.5 bg-muted rounded-md ${hasUrl ? 'hover:bg-gradient-to-r hover:from-primary/80 hover:to-primary hover:text-primary-foreground transition-all duration-300' : ''} flex items-center gap-1`}>
                          {hasUrl && <ExternalLink size={10} className="flex-shrink-0" />}
                          {category.name}
                        </span>
                      );

                      return hasUrl ? (
                        <a
                          key={category.id}
                          href={categoryUrls[category.id]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {Badge}
                        </a>
                      ) : (
                        <div key={category.id}>
                          {Badge}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {company.license && (
                <div>
                  <p className="text-sm font-medium mb-1">License</p>
                  <p className="text-sm">{company.license}</p>
                </div>
              )}

              {company.pricingModel && (
                <div>
                  <p className="text-sm font-medium mb-1">Pricing Model</p>
                  <p className="text-sm">{company.pricingModel}</p>
                </div>
              )}

              {company.pricingDetails && (
                <div>
                  <p className="text-sm font-medium mb-1">Pricing Details</p>
                  <p className="text-sm">{company.pricingDetails}</p>
                </div>
              )}

              {company.tags && company.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center">
                    <Tag size={14} className="mr-1.5" />
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {company.tags.map((tag) => {
                      const hasUrl = company.tagUrls?.some(tu => tu.tagId === tag.slug);

                      const Badge = (
                        <span className={`text-xs px-2.5 py-1.5 bg-muted rounded-md ${hasUrl ? 'hover:bg-gradient-to-r hover:from-primary/80 hover:to-primary hover:text-primary-foreground transition-all duration-300' : ''} flex items-center gap-1`}>
                          {hasUrl && <ExternalLink size={10} className="flex-shrink-0" />}
                          {tag.name}
                        </span>
                      );

                      return hasUrl ? (
                        <a
                          key={tag.id}
                          href={tagUrls[tag.id]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {Badge}
                        </a>
                      ) : (
                        <div key={tag.id}>
                          {Badge}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {(company.productDocs || company.developerDocs) && (
              <div className="border rounded-lg p-6 space-y-5 bg-card shadow-sm">
                <h2 className="font-semibold text-lg">Documentation</h2>

                {company.productDocs && (
                  <Button variant="outline" asChild className="w-full">
                    <a href={company.productDocs} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      Product Documentation
                      <ExternalLink size={16} />
                    </a>
                  </Button>
                )}

                {company.developerDocs && (
                  <Button variant="outline" asChild className="w-full mt-2">
                    <a href={company.developerDocs} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      Developer Documentation
                      <ExternalLink size={16} />
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    );
  } catch (error) {
    console.error('Error loading company:', error);
    return <CompanyNotFound slug={slug} isError={true} />;
  }
} 