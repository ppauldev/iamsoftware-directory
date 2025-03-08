This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Static Data Mode

The application supports a "static data mode" that prefetches all necessary data from Hygraph and saves it locally as JSON files. This reduces API calls, improves performance, and allows for offline development and builds.

## How It Works

When static data mode is enabled, the application:

1. Uses locally stored JSON files instead of making API calls to Hygraph
2. Falls back to API calls only when static data is not available
3. Significantly improves page load times since no external API requests are made

## Using Static Data Mode

### Development

To run the development server with static data mode:

```bash
# First, fetch the latest data from Hygraph (only needed once or when data changes)
npm run fetch-data

# Then run the dev server with static data
npm run dev:static
```

### Production Build

To create a production build with static data:

```bash
# This will fetch fresh data and build with static mode enabled
npm run build:static

# To start the static build
npm run start:static
```

### Updating Static Data

When content in Hygraph changes and you want to update your local data:

```bash
npm run fetch-data
```

## Environment Variables

To use static data mode, make sure your `.env` file contains:

```
# Hygraph API credentials (needed for fetching data)
HYGRAPH_API_URL=your-hygraph-endpoint
HYGRAPH_API_TOKEN=your-hygraph-token

# Enable static mode (for manual override)
USE_STATIC_DATA=true
```
