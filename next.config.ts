import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "0" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https://*.githubusercontent.com https://images.unsplash.com https://*.github.com data: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.github.com; frame-ancestors 'none'" },
];

const cacheHeaders = [
  { key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400" },
];

const noCacheHeaders = [
  { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  headers: async () => [
    {
      source: "/",
      headers: [...securityHeaders, ...cacheHeaders],
    },
    {
      source: "/about",
      headers: [...securityHeaders, ...cacheHeaders],
    },
    {
      source: "/contact",
      headers: [...securityHeaders, ...cacheHeaders],
    },
    {
      source: "/legal",
      headers: [...securityHeaders, ...cacheHeaders],
    },
    {
      source: "/projects",
      headers: [...securityHeaders, ...cacheHeaders],
    },
    {
      source: "/projects/:slug",
      headers: [...securityHeaders, ...cacheHeaders],
    },
    {
      source: "/api/projects",
      headers: [...securityHeaders, ...cacheHeaders],
    },
    {
      source: "/api/projects/:path*",
      headers: [...securityHeaders, ...cacheHeaders],
    },
    {
      source: "/api/social",
      headers: [...securityHeaders, ...cacheHeaders],
    },
    {
      source: "/api/github/:path*",
      headers: [...securityHeaders, ...cacheHeaders],
    },
    {
      source: "/dashboard/:path*",
      headers: [...securityHeaders, ...noCacheHeaders],
    },
    {
      source: "/api/auth/:path*",
      headers: [...securityHeaders, ...noCacheHeaders],
    },
  ],
};

export default nextConfig;
