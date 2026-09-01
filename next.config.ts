import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // As imagens agora são todas locais (/public) — os remotePatterns do
    // Unsplash/Framer eram só para os placeholders antigos da /links.
    unoptimized: true,
  },
};

export default nextConfig;
