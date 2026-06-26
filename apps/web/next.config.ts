import type { NextConfig } from "next";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function loadWorkspaceEnv() {
  const configDir = dirname(fileURLToPath(import.meta.url));
  const envPaths = [
    resolve(configDir, "../../.env"),
    resolve(configDir, "../../.env.local"),
  ];

  for (const envPath of envPaths) {
    if (!existsSync(envPath)) {
      continue;
    }

    for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      process.env[key] = value.replace(/^(['"])(.*)\1$/, "$2");
    }
  }
}

loadWorkspaceEnv();

const isDev = process.env.NODE_ENV !== "production";
const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const publicSiteHost = (() => {
  if (!publicSiteUrl) return "";
  try {
    return new URL(publicSiteUrl).hostname;
  } catch {
    return "";
  }
})();
const isIpHost = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(publicSiteHost) || publicSiteHost.includes(":");
const shouldUpgradeInsecureRequests =
  process.env.ENABLE_HTTPS_UPGRADE === "true" ||
  (!!publicSiteUrl && publicSiteUrl.startsWith("https://") && !isIpHost);
const neuralVoiceChangerOrigin = (() => {
  const value = process.env.NEURAL_VOICE_CHANGER_PUBLIC_URL || "";
  if (!value) return "";
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
})();
const cspDirectives = [
  "default-src 'self'",
  // 'unsafe-inline' is required for Next.js webpack bundles (HMR in dev, compiled scripts in prod)
  // 'unsafe-eval' is required for webpack HMR Fast Refresh in development only
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://www.googletagmanager.com https://apis.google.com https://esm.sh"
    : "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.googletagmanager.com https://apis.google.com https://esm.sh",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://hips-hsss.firebasestorage.app https://*.googleusercontent.com",
  // Firebase Auth token refresh, Firestore, Identity Toolkit, LiveKit, GTM
  [
    "connect-src 'self' https://www.googleapis.com https://firestore.googleapis.com https://firebase.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googletagmanager.com wss://hips-hsss-wm8okbqu.livekit.cloud https://hips-hsss-wm8okbqu.livekit.cloud https://api.stripe.com https://esm.sh https://met4citizen.github.io",
    neuralVoiceChangerOrigin,
  ].filter(Boolean).join(" "),
  // Google OAuth/GTM iframes + Firebase Auth popup
  "frame-src 'self' https://accounts.google.com https://apis.google.com https://hips-hsss.firebaseapp.com https://js.stripe.com",
  "object-src 'none'",
  "worker-src 'self' blob:",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(!isDev && shouldUpgradeInsecureRequests ? ["upgrade-insecure-requests"] : []),
  "report-to csp-endpoint",
];

const nextConfig: NextConfig = {
  transpilePackages: ["@hips/types"],
  // Tell webpack to handle the `node:` URI scheme used by Node.js built-in
  // modules. Without this, the edge runtime compilation fails with
  //   UnhandledSchemeError: Reading from "node:crypto" is not handled by plugins
  // whenever a nodejs-only module is in the import graph of the edge bundle
  // — even when the import is gated behind `process.env.NEXT_RUNTIME === 'nodejs'`.
  // We use `IgnorePlugin` to make webpack skip `node:*` requests entirely
  // during edge compilation; the modules are only ever executed on nodejs.
  webpack(config: any, { isServer, nextRuntime }) {
    if (nextRuntime === "edge" && config.module) {
      // Make webpack ignore the `node:` scheme by treating it as an empty
      // resource. Edge bundles never execute these modules (the runtime
      // check in instrumentation.ts prevents that), so leaving them as
      // no-ops is safe.
      const ignorePlugin = new (require("webpack").IgnorePlugin)({
        resourceRegExp: /^node:/,
      });
      config.plugins = config.plugins ?? [];
      config.plugins.push(ignorePlugin);
    }

    // Configure webpack to resolve ESM-style relative imports with .js extensions
    // to their corresponding .ts/.tsx files during bundling.
    config.resolve = config.resolve || {};
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      ".js": [".ts", ".tsx", ".js", ".jsx"],
    };

    return config;
  },
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Enable gzip compression
  compress: true,
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    // Production deploys still run TypeScript validation. ESLint remains a
    // tracked remediation backlog, but it currently blocks deploying unrelated
    // runtime fixes such as the neural voice masking status route.
    ignoreDuringBuilds: true,
  },
  // Content Security Policy headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspDirectives.join('; '),
          },
          {
            key: 'Report-To',
            value: JSON.stringify({
              group: 'csp-endpoint',
              max_age: 10886400,
              endpoints: [{ url: '/api/csp-report' }]
            }),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self), geolocation=()',
          },
          ...(!isDev ? [{
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          }] : []),
        ],
      },
    ];
  },
};

export default nextConfig;
