/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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

module.exports = nextConfig;
