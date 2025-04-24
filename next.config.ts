import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // WARNING: This option will allow production builds even if there are type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // WARNING: This will ignore ESLint errors during production builds.
    ignoreDuringBuilds: true,
  },
  images: {
    // --- Add or modify this section ---
    remotePatterns: [
      {
        protocol: "https", // Cloudinary uses HTTPS
        hostname: "res.cloudinary.com", // The hostname from the error
        // Optional: You can specify port or pathname if needed, but usually not for Cloudinary's main domain
        // port: '',
        // pathname: '/your-cloud-name/image/upload/**', // Example if you want more specific paths
      },
      // --- Add any other domains you use ---
      {
        protocol: "https",
        hostname: "images.unsplash.com", // If you use Unsplash images
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // If you use placeholder images
      },
    ],
    // --- End of images section ---
  },
};

export default nextConfig;
