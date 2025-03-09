import { GraphQLClient } from 'graphql-request';
import fs from 'fs';
import path from 'path';

// Check if static mode is enabled
const useStaticData = process.env.USE_STATIC_DATA === 'true';

// Create a GraphQL client instance with the Hygraph API URL and token
const client = new GraphQLClient(process.env.HYGRAPH_API_URL as string, {
  headers: {
    Authorization: `Bearer ${process.env.HYGRAPH_API_TOKEN}`,
  },
});

// Response types for GraphQL queries
export interface AllCompaniesResponse {
  companies: Company[];
}

export interface CompanyBySlugResponse {
  company: Company;
  posts: Post[];
}

export interface AllPostsResponse {
  posts: Post[];
}

export interface PostBySlugResponse {
  post: Post;
}

export interface AllTaxonomyResponse {
  groups: Group[];
  categories: Category[];
  tags: Tag[];
}

export interface ContentBySlugResponse {
  content: Content;
}

// Helper function to read a static data file
function getStaticData(file: string): Record<string, unknown> | null {
  try {
    const dataPath = path.join(process.cwd(), 'data', `${file}.json`);

    if (!fs.existsSync(dataPath)) {
      console.warn(`Static data file not found: ${dataPath}`);
      return null;
    }

    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading static data: ${error}`);
    return null;
  }
}

// Function to get company by slug from static data
function getStaticCompanyBySlug(slug: string): Company | null {
  const data = getStaticData('companies') as { companies: Company[] } | null;
  if (!data || !data.companies) return null;

  return data.companies.find((company: Company) => company.slug === slug) || null;
}

// Function to get post by slug from static data
function getStaticPostBySlug(slug: string): Post | null {
  const data = getStaticData('posts') as { posts: Post[] } | null;
  if (!data || !data.posts) return null;

  return data.posts.find((post: Post) => post.slug === slug) || null;
}

// Function to execute GraphQL queries with typed responses
export async function executeQuery<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  // If static mode is enabled, try to retrieve data from local files
  if (useStaticData) {
    // Determine what data we need based on the query
    if (query.includes('GetAllCompanies')) {
      const data = getStaticData('companies');
      if (data) return data as T;
    }
    else if (query.includes('GetAllPosts')) {
      const data = getStaticData('posts');
      if (data) return data as T;
    }
    else if (query.includes('GetCompanyBySlug') && 'slug' in variables) {
      const company = getStaticCompanyBySlug(variables.slug as string);

      // Also fetch related posts
      const postsData = getStaticData('posts') as { posts: Post[] } | null;
      const relatedPosts = postsData?.posts?.filter(post =>
        post.relatedCompanies?.some(comp => comp.slug === variables.slug)
      ) || [];
      // Load categoryUrls and tagUrls from static data or create dummy URLs
      if (company) {
        return { company, posts: relatedPosts } as T;
      }
    }
    else if (query.includes('GetPostBySlug') && 'slug' in variables) {
      const post = getStaticPostBySlug(variables.slug as string);
      if (post) return { post } as T;
    }

    // If we couldn't find static data, log a warning and fall back to API
    console.warn(`No static data found for query. Falling back to API call.`);
  }

  // Fall back to API call if static mode is disabled or data not found
  try {
    const data = await client.request<T>(query, variables);
    return data;
  } catch (error) {
    console.error('GraphQL query error:', error);

    // Add more detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      // Try to extract and parse the response error details if available
      const errorMatch = error.message.match(/\{.*\}/);
      if (errorMatch) {
        try {
          const errorDetails = JSON.parse(errorMatch[0]);
          console.error('Detailed error:', JSON.stringify(errorDetails, null, 2));

          // Check for specific field errors
          if (errorDetails.response && errorDetails.response.errors) {
            console.error('GraphQL field errors:', errorDetails.response.errors);
          }
        } catch (parseError) {
          console.error('Failed to parse error details:', parseError);
        }
      }
    }

    throw error;
  }
}

// Type definitions for our data models
export interface Group {
  id: string;
  name: string;
  description?: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  group?: Group;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  slug: string;
  category?: Category;
}

interface CategoryUrl {
  id: string;
  url: string;
  categoryId: string;
  softwareId: string;
}

interface TagUrl {
  id: string;
  url: string;
  tagId: string;
  softwareId: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  url?: string;
  slug: string;
  rating?: number;
  features?: string[];
  license?: string;
  pricingModel?: string;
  pricingDetails?: string;
  productDocs?: string;
  developerDocs?: string;
  categories: Category[];
  topCategories: Category[];
  tags: Tag[];
  relatedPosts?: Post[];
  categoryUrls?: CategoryUrl[];
  tagUrls?: TagUrl[];
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  date?: string;
  author?: string;
  excerpt?: string;
  keywords?: string[];
  relatedCompanies?: Company[];
  content?: {
    markdown?: string;
  };
  contentConnection?: {
    edges: Array<{
      node: {
        markdown?: string;
      }
    }>
  };
  markdown?: string;
  relatedContent?: {
    markdown?: string;
  };
}

export interface Content {
  slug: string;
  markdown?: string;
} 