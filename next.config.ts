/** @type {import('next').NextConfig} */
const nextConfig = {
  // Avoid root inference drift when parent folders contain other lockfiles.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
