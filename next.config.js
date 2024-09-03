/* eslint-disable @typescript-eslint/indent */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com'],
  },

  // eslint-disable-next-line require-await
  async redirects() {
    return [
      {
        source: '/instagram',
        destination:
          'https://instagram.com/power.gym.khouribga?utm_source=qr&igshid=ZDc4ODBmNjlmNQ%3D%3D',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
