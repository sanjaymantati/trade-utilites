/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '/trade-utilites/' : '',
  images: {
    unoptimized: true, // Required if you're using <Image> component
  },
};

module.exports = nextConfig;
