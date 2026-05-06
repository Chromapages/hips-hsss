/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@hips/ui", "@hips/types"],
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

module.exports = nextConfig;
