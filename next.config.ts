import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local uploads served from /uploads/* are handled directly by Next.js
    // No remote pattern needed for local files.
    // Unsplash is kept only for any remaining static mock data references.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Allow unoptimized local uploads so Next/Image can render /uploads/ paths
    // without needing a configured loader or remote pattern.
    localPatterns: [
      {
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
