import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is disabled: Next 16.4's cross-request cache dedupe can
  // hang on Cloudflare Workers and surface as Error 1101.
  // See https://github.com/opennextjs/opennextjs-cloudflare/issues/1464
  // cacheComponents: true,
  // partialPrefetching: true,
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
