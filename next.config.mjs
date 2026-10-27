/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/:all*(svg|png|jpg|jpeg|webp|avif|woff2|ico)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
