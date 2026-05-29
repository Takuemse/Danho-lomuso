// next.config.ts
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  // Strict security headers
  async headers() {
    const scriptSources = ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"];
    if (isDev) {
      scriptSources.push("'unsafe-eval'");
    }

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src ${scriptSources.join(" ")}`,
              "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
              "font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    domains: [],
  },

  // Minimize bundle
  experimental: {
    optimizePackageImports: ["@google/generative-ai"],
  },

  // Turbopack configuration
  turbopack: {
    root: __dirname,
  },

  // Compress output
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;