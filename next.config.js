/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/space.app/:path*', // The local "build" path
        destination: 'https://s12eh1dx2vs1-d.space.z.ai/:path*', // The target host
      },
    ];
  },
}

module.exports = nextConfig
