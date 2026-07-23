import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Vercel Blob: replace <store-id> with your actual store ID from the Vercel dashboard.
      // Format: https://<store-id>.public.blob.vercel-storage.com
      {
        protocol: "https",
        hostname: "https://dycwbvq5i0c2u057.public.blob.vercel-storage.com",
      },
    ],
    localPatterns: [
      {
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
