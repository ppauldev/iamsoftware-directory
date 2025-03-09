import { MetadataRoute } from 'next';
import { executeQuery, AllCompaniesResponse, AllPostsResponse } from '@/lib/graphql-client';
import { GET_ALL_COMPANIES, GET_ALL_POSTS } from '@/lib/graphql-queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all companies and posts
  const companiesData = await executeQuery<AllCompaniesResponse>(GET_ALL_COMPANIES);
  const postsData = await executeQuery<AllPostsResponse>(GET_ALL_POSTS);

  const companies = companiesData.companies || [];
  const posts = postsData.posts || [];

  // Base URLs
  const baseUrls: MetadataRoute.Sitemap = [
    {
      url: 'https://www.iamsoftware.directory',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://www.iamsoftware.directory/articles',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Company URLs
  const companyUrls: MetadataRoute.Sitemap = companies.map((company) => ({
    url: `https://www.iamsoftware.directory/companies/${company.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Article URLs
  const articleUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://www.iamsoftware.directory/articles/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...baseUrls, ...companyUrls, ...articleUrls];
} 