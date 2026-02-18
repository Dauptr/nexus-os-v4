/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fixes OpenSSL issue in Node 17 if not using the flag in package.json
  experimental: {
    // ...
  },
  async rewrites() {
    return [
      {
        source: '/space.app/:path*',
        destination: 'https://s12eh1dx2vs1-d.space.z.ai/:path*',
      },
    ];
  },
}

module.exports = nextConfig
