import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
    ],
  },
  serverExternalPackages: ['nodemailer', '@prisma/client', 'bcryptjs'],
};

export default nextConfig;
