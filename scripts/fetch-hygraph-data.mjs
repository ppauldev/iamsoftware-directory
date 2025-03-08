#!/usr/bin/env node

/**
 * This script fetches all data from Hygraph and saves it locally as JSON files.
 * Run this script before building the app to generate static data files.
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper function to fetch data from Hygraph
async function fetchData(query, variables = {}) {
  const endpoint = process.env.HYGRAPH_API_URL;
  if (!endpoint) {
    throw new Error('HYGRAPH_API_URL is not defined in .env file');
  }

  // Authorization token (if required)
  const authToken = process.env.HYGRAPH_API_TOKEN;
  const headers = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();

  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    throw new Error('Failed to fetch data from Hygraph');
  }

  return result.data;
}

// Fetch all data needed for the app
async function fetchAllData() {
  try {
    console.log('📊 Fetching data from Hygraph...');

    // Define all the queries to fetch data
    // These should match your existing queries in the app
    const queries = {
      companies: `
        query GetAllCompanies {
          companies {
            id
            name
            slug
            description
            url
            rating
            license
            pricingModel
            pricingDetails
            productDocs
            developerDocs
            features
            categories {
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
      `,
      posts: `
        query GetAllPosts {
          posts {
            id
            title
            slug
            date
            author
            excerpt
            keywords
            relatedContent {
              markdown
            }
            relatedCompanies {
              id
              name
              slug
            }
          }
        }
      `,
      // Add more queries as needed
    };

    // Fetch and save data for each query
    for (const [name, query] of Object.entries(queries)) {
      console.log(`🔍 Fetching ${name}...`);
      const data = await fetchData(query);

      const filePath = path.join(dataDir, `${name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Saved ${name} data to ${filePath}`);
    }

    console.log('🎉 All data fetched and saved successfully!');
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    process.exit(1);
  }
}

// Run the script
fetchAllData(); 