/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      // Add other domains you need here
    ],
  },
  async redirects() {
    return [
      // Handle legacy category URLs
      {
        source: '/categories/:name',
        destination: '/category/:name',
        permanent: true,
      },
      // Handle trailing slashes
      {
        source: '/category/:name/',
        destination: '/category/:name',
        permanent: true,
      },
      // Handle old query param format
      {
        source: '/',
        destination: '/category/:name',
        permanent: true,
        has: [
          {
            type: 'query',
            key: 'categories',
            value: '(?<name>.*)',
          },
        ],
      },
      // Handle uppercase URLs
      {
        source: '/category/:name(.*[A-Z].*)',
        destination: '/category/:name(.*)',
        permanent: true,
        has: [
          {
            type: 'query',
            key: 'name',
            value: '(?!^[a-z0-9-]+$)',
          },
        ],
      },
      // Handle spaces in URLs
      {
        source: '/category/:name(.*%20.*)',
        destination: '/category/:name(.*)',
        permanent: true,
      },
      // Handle multiple consecutive hyphens
      {
        source: '/category/:segment(.*--+.*)',
        destination: '/category/:segment',
        permanent: true,
        has: [
          {
            type: 'query',
            key: 'segment',
            value: '(?!^[a-z0-9]+-[a-z0-9]+$)',
          },
        ],
      }
    ];
  },
  // Add other Next.js config options as needed
}

module.exports = nextConfig 