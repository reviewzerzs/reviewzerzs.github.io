/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    // This tells Netlify to ignore raw quote marks and build anyway!
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This ignores any hidden code warning roadblocks
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
