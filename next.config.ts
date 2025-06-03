/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // ou especifique domínios específicos
      },
    ],
  },
};

module.exports = nextConfig;
