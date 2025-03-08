import { MainLayout } from '@/components/layout/main-layout';
import { executeQuery, PostBySlugResponse, AllPostsResponse } from '@/lib/graphql-client';
import {
  GET_POST_BY_SLUG,
  GET_POST_BY_SLUG_ALT1,
  GET_POST_BY_SLUG_ALT2,
  GET_POST_BY_SLUG_ALT3,
  GET_POST_WITH_RELATED_CONTENT,
  GET_ALL_POSTS
} from '@/lib/graphql-queries';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/date-utils';
import { CalendarIcon, User2 } from 'lucide-react';
import { PostNotFound } from '@/components/post/post-not-found';

// Add ReactMarkdown for rendering markdown content
import ReactMarkdown from 'react-markdown';

// Import the CSS module
import styles from './post.module.css';
import { Metadata } from 'next';

// Get markdown content from different possible structures
function getPostContent(post: PostBySlugResponse['post']): string | null {
  // Check each possible location for markdown content
  if (post?.content?.markdown) {
    return post.content.markdown;
  }

  if (post?.contentConnection?.edges && post.contentConnection.edges.length > 0) {
    const edge = post.contentConnection.edges[0];
    if (edge?.node?.markdown) {
      return edge.node.markdown;
    }
  }

  if (post?.markdown) {
    return post.markdown;
  }

  // Add check for relatedContent field
  if (post?.relatedContent?.markdown) {
    return post.relatedContent.markdown;
  }

  return null;
}

// Try all query variations to see which one works with the Hygraph schema
async function tryAllQueries(slug: string): Promise<{
  data: PostBySlugResponse | null,
  error: Error | null
}> {
  // Try each query variation, returning the first successful one
  try {
    // Try the new query with relatedContent first
    const dataRelated = await executeQuery<PostBySlugResponse>(GET_POST_WITH_RELATED_CONTENT, { slug });
    if (dataRelated?.post && getPostContent(dataRelated.post)) {
      return { data: dataRelated, error: null };
    }

    // Try basic query first
    const data = await executeQuery<PostBySlugResponse>(GET_POST_BY_SLUG, { slug });
    if (data?.post && getPostContent(data.post)) {
      return { data, error: null };
    }

    // Try with content.markdown
    const data1 = await executeQuery<PostBySlugResponse>(GET_POST_BY_SLUG_ALT1, { slug });
    if (data1?.post && getPostContent(data1.post)) {
      return { data: data1, error: null };
    }

    // Try with direct markdown
    const data2 = await executeQuery<PostBySlugResponse>(GET_POST_BY_SLUG_ALT2, { slug });
    if (data2?.post && getPostContent(data2.post)) {
      return { data: data2, error: null };
    }

    // Try with contentConnection
    const data3 = await executeQuery<PostBySlugResponse>(GET_POST_BY_SLUG_ALT3, { slug });
    if (data3?.post && getPostContent(data3.post)) {
      return { data: data3, error: null };
    }

    // If we have a valid post but no content, return the post anyway
    if (dataRelated?.post) return { data: dataRelated, error: null };
    if (data?.post) return { data, error: null };
    if (data1?.post) return { data: data1, error: null };
    if (data2?.post) return { data: data2, error: null };
    if (data3?.post) return { data: data3, error: null };

    // None worked, return null
    return { data: null, error: new Error("No post found with any query") };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const result = await tryAllQueries(slug);
    const post = result.data?.post;

    if (!post) {
      return {
        title: 'Post Not Found - The IAM Directory',
        description: 'The requested blog post could not be found.',
      };
    }

    return {
      title: `${post.title} - Articles - The IAM Directory`,
      description: post.excerpt || `Read about ${post.title} in the IAM Directory blog.`,
      keywords: post.keywords || [],
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error - The IAM Directory',
      description: 'An error occurred while loading this page.',
    };
  }
}

// Generate static params for all possible article slugs
export async function generateStaticParams() {
  const data = await executeQuery<AllPostsResponse>(GET_ALL_POSTS);
  const posts = data.posts || [];

  return posts.map((post) => ({
    slug: post.slug
  }));
}

// Remove explicit return type to let TypeScript infer it
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const result = await tryAllQueries(slug);

    // If no data or post, show the NotFound component
    if (!result.data?.post) {
      return <PostNotFound slug={slug} isError={!!result.error} />;
    }

    const post = result.data.post;
    const markdownContent = getPostContent(post);

    return (
      <MainLayout maxWidth="narrow">
        <Link href="/articles" className="text-sm text-muted-foreground hover:underline mb-8 inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="m15 18-6-6 6-6"></path></svg>
          Back to all articles
        </Link>

        <article className="space-y-10">
          <header className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              {post.date && (
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
              )}

              {post.author && (
                <div className="flex items-center">
                  <User2 className="mr-2 h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              )}
            </div>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>
            )}
          </header>

          <div className={`prose prose-slate dark:prose-invert max-w-none ${styles.markdownContent}`}>
            {markdownContent ? (
              <ReactMarkdown>
                {markdownContent}
              </ReactMarkdown>
            ) : (
              <div className="p-6 border rounded-md bg-muted">
                <p className="text-center text-muted-foreground">No content available for this post.</p>
              </div>
            )}
          </div>

          {post.keywords && post.keywords.length > 0 && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-3">Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {post.relatedCompanies && post.relatedCompanies.length > 0 && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-3">Related Companies</h2>
              <div className="flex flex-wrap gap-2">
                {post.relatedCompanies.map((company) => (
                  <Badge
                    key={company.id}
                    variant="outline"
                    className="text-sm py-1.5 px-3 hover:bg-blue-50 dark:hover:bg-blue-950 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <Link href={`/companies/${company.slug}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      {company.name}
                    </Link>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>
      </MainLayout>
    );
  } catch (error) {
    console.error('Error loading post:', error);
    return <PostNotFound slug={slug} isError={true} />;
  }
} 