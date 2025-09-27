import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://aiwqlgjxswovdtoc.public.blob.vercel-storage.com/**"),
    ],
  },
};

export default nextConfig;
