/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {},
  async rewrites() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'nunes-transport.vercel.app',
          },
        ],
        destination: '/transport',
      },
    ];
  },
};

export default nextConfig;
