/** @type {import('next').NextConfig} */
const repoName = 'trade-utilites';

const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '',
  basePath: process.env.NODE_ENV === 'production' ? `/${repoName}` : '',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
