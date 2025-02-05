/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['pocketbase-elmrqdwp.az-csprod1.cloud-station.io', 'n8n-zjrvqodz.cloud-station.app']
  },
};

module.exports = nextConfig;
