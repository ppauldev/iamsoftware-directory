import { gql } from 'graphql-request';

// Query to fetch all companies
export const GET_ALL_COMPANIES = gql`
  query GetAllCompanies {
    companies {
      id
      name
      description
      url
      slug
      rating
      features
      license
      pricingModel
      pricingDetails
      categories {
        id
        name
        slug
      }
      topCategories {
        id
        name
        slug
      }
      tags {
        id
        name
        slug
      }
    }
  }
`;

// Query to fetch a single company by slug
export const GET_COMPANY_BY_SLUG = gql`
  query GetCompanyBySlug($slug: String!) {
    company(where: { slug: $slug }) {
      id
      name
      description
      url
      slug
      rating
      features
      license
      pricingModel
      pricingDetails
      productDocs
      developerDocs
      categoryUrls
      tagUrls
      categories {
        id
        name
        slug
      }
      topCategories {
        id
        name
        slug
      }
      tags {
        id
        name
        slug
      }
    }
    # Fetch posts where this company is in their relatedCompanies list
    posts(where: { relatedCompanies_some: { slug: $slug } }) {
      id
      title
      slug
      excerpt
      date
    }
  }
`;

// Query to fetch all posts
export const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts {
      id
      title
      slug
      date
      author
      excerpt
      keywords
      relatedCompanies {
        id
        name
        slug
      }
    }
  }
`;

// Query variations for fetching a single post by slug
export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
    post(where: { slug: $slug }) {
      id
      title
      slug
      date
      author
      excerpt
      keywords
      relatedCompanies {
        id
        name
        slug
      }
    }
  }
`;

// Alternative query with content field as a complex object
export const GET_POST_BY_SLUG_ALT1 = gql`
  query GetPostBySlug($slug: String!) {
    post(where: { slug: $slug }) {
      id
      title
      slug
      date
      author
      excerpt
      keywords
      relatedCompanies {
        id
        name
        slug
      }
      content {
        markdown
      }
    }
  }
`;

// Alternative query with markdown directly on post
export const GET_POST_BY_SLUG_ALT2 = gql`
  query GetPostBySlug($slug: String!) {
    post(where: { slug: $slug }) {
      id
      title
      slug
      date
      author
      excerpt
      keywords
      relatedCompanies {
        id
        name
        slug
      }
      markdown
    }
  }
`;

// Alternative query with connection-based content
export const GET_POST_BY_SLUG_ALT3 = gql`
  query GetPostBySlug($slug: String!) {
    post(where: { slug: $slug }) {
      id
      title
      slug
      date
      author
      excerpt
      keywords
      relatedCompanies {
        id
        name
        slug
      }
      contentConnection {
        edges {
          node {
            markdown
          }
        }
      }
    }
  }
`;

// Query to fetch all taxonomy data (groups, categories, tags)
export const GET_ALL_TAXONOMY = gql`
  query GetAllTaxonomy {
    groups {
      id
      name
      description
      slug
      category {
        id
        name
        slug
      }
    }
    categories {
      id
      name
      description
      slug
      group {
        id
        name
        slug
      }
      tag {
        id
        name
        slug
      }
    }
    tags {
      id
      name
      description
      slug
      category {
        id
        name
        slug
      }
    }
  }
`;

// Query to fetch content by slug
export const GET_CONTENT_BY_SLUG = gql`
  query GetContentBySlug($slug: String!) {
    content(where: { slug: $slug }) {
      slug
      markdown
    }
  }
`;

// Query for relatedContent field - this is likely the correct structure
export const GET_POST_WITH_RELATED_CONTENT = gql`
  query GetPostBySlug($slug: String!) {
    post(where: { slug: $slug }) {
      id
      title
      slug
      date
      author
      excerpt
      keywords
      relatedCompanies {
        id
        name
        slug
      }
      relatedContent {
        markdown
      }
    }
  }
`; 