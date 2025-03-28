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
};

export default nextConfig;
