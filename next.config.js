/** @type {import('next').NextConfig} */


const nextConfig = {
  output: 'export',
  basePath: process.env.PAGES_BASE_PATH,
  reactStrictMode: true,

};

module.exports = nextConfig;

