/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  env: {
    NETWORK_MODE: process.env.NETWORK_MODE,
  },
}

module.exports = nextConfig
