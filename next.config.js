const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|swf|avi|flv|mov)$/,
      use: {
        loader: "ignore-loader",
      },
    });
    return config;
  },
};

module.exports = withSentryConfig(nextConfig, {
  org: "ask-nina-ai",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
