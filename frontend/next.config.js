/** @type {import('next').NextConfig} */
const getDomain = (url) => url?.replace('https://', '').split('/')[0];

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: [
      getDomain(process.env.NEXT_PUBLIC_POCKETBASE_URL),
      getDomain(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL)
    ].filter(Boolean)
  },
  output: 'standalone',
};

module.exports = nextConfig;
