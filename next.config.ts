import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: process.env.USE_STATIC_DATA ? "export" : undefined, // Enable static export if USE_STATIC_DATA is true
  trailingSlash: true, // Add trailing slash for better static site serving
  webpack: (config, { isServer }) => {
    // Enable source maps in development
    if (!isServer) {
      config.devtool = "source-map";
    }
    return config;
  },
};

export default nextConfig;
