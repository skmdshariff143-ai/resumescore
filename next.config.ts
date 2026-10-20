import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Release policy: paid providers stay disabled regardless of remote variables.
  // Removing this lock requires a separately reviewed AI activation release.
  env: { AI_PAID_ENABLED: 'false' },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] }, { source: '/api/:path*', headers: [
      { key: 'Cache-Control', value: 'no-store' },
    ] }];
  },
};

export default nextConfig;
