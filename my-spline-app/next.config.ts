import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Spline butuh ini agar tidak di-bundle server-side
  transpilePackages: ['@splinetool/react-spline'],
}

export default nextConfig