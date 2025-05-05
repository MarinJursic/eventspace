import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        hostname: "via.placeholder.com", // If you use placeholder imagescc
      },
      {
        protocol: "https",
        hostname: "sm-img.imgix.net",
      },
      // Allow all other domains (not recommended for production)
      {
        protocol: "https",
        hostname: "**", // This will allow all domains
        // port: '',
        // pathname: '/**', // This will allow all paths
      },
    ],
    // --- End of images section ---
  },
};

export default nextConfig;
