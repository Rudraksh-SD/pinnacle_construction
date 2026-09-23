/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "cms.thepinnacleconstruction.in" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "*.wp.com" },
    ],
  },
};

export default nextConfig;
