import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      // `server-only` is a Next.js convention package that throws at build
      // time if it leaks to a client bundle. Under vitest it's a no-op.
      "server-only": resolve(root, "tests/_stubs/server-only.ts"),
      // Web app path alias
      "@/": `${resolve(root, "apps/web/src")}/`,
      // Types workspace package
      "@hips/types": resolve(root, "packages/types/src/index.ts"),
      // Workspace-only deps declared in apps/web/package.json. Resolve
      // them through pnpm's nested store when vitest runs from the root.
      jose: resolve(root, "node_modules/.pnpm/jose@6.2.3/node_modules/jose"),
      otplib: resolve(root, "node_modules/.pnpm/otplib@12.0.1/node_modules/otplib"),
      qrcode: resolve(root, "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode"),
      bcrypt: resolve(root, "node_modules/.pnpm/bcrypt@6.0.0/node_modules/bcrypt"),
    },
  },
  test: {
    include: ["tests/**/*.spec.ts", "src/**/*.spec.ts", "apps/**/*.spec.ts", "services/**/*.spec.ts"],
    exclude: [
      "tests/**/*.blueprint.ts",
      "**/node_modules/**/*.spec.ts",
      "**/._*",
      "**/*._*",
    ],
    globals: false,
    environment: "node",
    passWithNoTests: false,
  },
});
