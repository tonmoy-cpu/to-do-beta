/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    cpus: 1,
    workerThreads: false
  },
   basePath: "/login"
};

module.exports = nextConfig;