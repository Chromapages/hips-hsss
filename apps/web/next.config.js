/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@hips/ui", "@hips/types"],
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  async headers() {
    const securityHeaders = [
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "frame-ancestors 'none'",
          "object-src 'none'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.gstatic.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https:",
          "font-src 'self' data:",
          "connect-src 'self' https://api.stripe.com https://*.firebaseio.com https://*.googleapis.com https://*.gstatic.com wss://*.firebaseio.com wss://session.hips.org",
          "frame-src https://js.stripe.com https://hooks.stripe.com",
          "form-action 'self'",
          "upgrade-insecure-requests",
        ].join("; "),
      },
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=()" },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
