/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.twilio.com',
      },
    ],
  },
  serverExternalPackages: ['twilio'],
  turbopack: {},
}

module.exports = nextConfig
