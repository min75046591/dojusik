import type { NextConfig } from "next";
const withPWA = require("next-pwa") as any;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_URL: process.env.NODE_ENV === "production"
      ? "https://api.example.com"
      : "http://localhost:3000",
  },
};

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
  ],
});

export default pwaConfig(nextConfig);
