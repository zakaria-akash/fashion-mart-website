/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.dummyjson.com",
      },
    ],
  },
};

export default nextConfig;
