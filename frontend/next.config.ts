/*
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
/*  reactCompiler: true,
};

export default nextConfig;
*/

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This enables the standalone build
  output: 'standalone',

  /* rest of your config */
};

export default nextConfig;