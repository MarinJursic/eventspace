import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // WARNING: This option will allow production builds even if there are type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
