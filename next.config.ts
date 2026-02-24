import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jgqicrlbamfjfjdsajaz.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "hygglo.imgix.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
// https://hygglo.imgix.net/fat-llama/products/macbook-pro-retina-mid2015-48227417.jpg?cs=strip&fm=pjpg&q=70)
