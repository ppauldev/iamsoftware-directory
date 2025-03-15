import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { executeQuery, Post, Company, AllPostsResponse } from '@/lib/graphql-client';
import { GET_ALL_POSTS } from '@/lib/graphql-queries';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/date-utils';

export const metadata: Metadata = {
  title: 'Articles - The IAM Directory',
  description: 'Read articles, comparisons, and guides about Identity and Access Management software and solutions.',
  keywords: ['IAM blog', 'IAM articles', 'Identity and Access Management blog', 'IAM guides', 'IAM comparisons'],
};

export default async function ArticlesPage() {
  // Fetch posts data
  const data = await executeQuery<AllPostsResponse>(GET_ALL_POSTS);
  const posts = data.posts || [];

  return (
    <MainLayout>
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 tracking-tight">
          Articles
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore comparisons, guides, and insights about Identity and Access Management
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: Post) => (
            <Card key={post.id} className="flex flex-col h-full hover:shadow-md transition-shadow border border-muted">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl line-clamp-3">
                  <Link href={`/articles/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </CardTitle>
                {post.date && (
                  <p className="text-sm text-muted-foreground">
                    {formatDate(post.date)}
                  </p>
                )}
              </CardHeader>

              <CardContent className="flex-grow">
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
              </CardContent>

              <CardFooter className="flex flex-col items-start pt-0">
                {post.relatedCompanies && post.relatedCompanies.length > 0 && (
                  <div className="w-full">
                    <p className="text-xs text-muted-foreground mb-2">Related Companies:</p>
                    <div className="flex flex-wrap gap-2">
                      {post.relatedCompanies.map((company: Company) => (
                        <Badge key={company.id} variant="outline">
                          <Link href={`/companies/${company.slug}`} className="hover:text-foreground transition-colors">
                            {company.name}
                          </Link>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {post.keywords && post.keywords.length > 0 && (
                  <div className="mt-4 w-full">
                    <p className="text-xs text-muted-foreground mb-2">Keywords:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {post.keywords.map((keyword: string, index: number) => (
                        <span key={index} className="text-xs px-2 py-0.5 bg-muted rounded-md">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg font-medium">No posts found</p>
          <p className="text-muted-foreground mt-2">Check back later for new content</p>
        </div>
      )}
    </MainLayout>
  );
} 