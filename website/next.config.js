/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  experimental: {
    appDir: true,
  },
}
module.exports = nextConfig
