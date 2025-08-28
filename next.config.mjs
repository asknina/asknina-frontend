import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables - these will work on Cloudflare Pages
  env: {
    BACKEND_API: process.env.BACKEND_API,
  },

  // Add output configuration for Cloudflare Pages
  output: "export",

  // Disable image optimization for static export (required for Cloudflare Pages)
  images: {
    unoptimized: true,
  },

  // Optional: Add trailing slash for better compatibility
  trailingSlash: true,
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "ask-nina-ai",
  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // Note: This won't work with static export - you'd need to use Cloudflare Workers for this
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // REMOVED: automaticVercelMonitors - this is Vercel-specific and won't work on Cloudflare
  // For Cloudflare, you'll need to set up monitoring using Cloudflare's tools or other services
});
