/** @type {import('next').NextConfig} */
const nextConfig = {
    // Add this 'images' block
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.sanity.io',
          port: '',
          pathname: '/images/**',
        },
      ],
    },
  };
  
  export default nextConfig; // <-- This is the corrected line for .mjs files