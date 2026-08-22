import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Resolve the workspace root to the project directory.
    // Required when the project lives inside a subdirectory of a larger Git repo
    // (e.g. /Users/hongquan/Documents/matcha-bowl-website inside /Users/hongquan/Documents).
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        // Shopify CDN for product images
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:version/graphql.json",
        destination: "/api/shopify-analytics/:version/graphql.json",
      },
    ];
  },
};

export default nextConfig;
