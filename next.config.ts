import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // self-contained server build (.next/standalone) for running as a service
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
