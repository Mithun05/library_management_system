/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://web:8000/api/:path*/', // Proxy to Django container
      },
    ];
  },
};

export default nextConfig;
