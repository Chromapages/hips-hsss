import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "../../packages/ui/src/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--color-brand-primary)",
          secondary: "var(--color-brand-secondary)",
          accent: "var(--color-brand-accent)",
          warm: "var(--color-brand-warm)",
          deep: "var(--color-brand-deep)",
        },
        semantic: {
          success: "var(--color-success)",
          warning: "var(--color-warning)",
          error: "var(--color-error)",
          info: "#2563eb",
          crisis: "var(--color-crisis)",
        },
        // Apple design system colors
        apple: {
          primary: "var(--apple-primary)",
          "primary-focus": "var(--apple-primary-focus)",
          "primary-on-dark": "var(--apple-primary-on-dark)",
          ink: "var(--apple-ink)",
          "body-on-dark": "var(--apple-body-on-dark)",
          "body-muted": "var(--apple-body-muted)",
          "ink-muted-48": "var(--apple-ink-muted-48)",
          canvas: "var(--apple-canvas)",
          parchment: "var(--apple-canvas-parchment)",
          "surface-tile-1": "var(--apple-surface-tile-1)",
          "surface-tile-2": "var(--apple-surface-tile-2)",
          black: "var(--apple-surface-black)",
        },
      },
      fontFamily: {
        // Apple SF Pro Display / Text as first choice, fallback to system
        sans: ["SF Pro Display", "SF Pro Text", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        // Apple typography scale
        "hero-display": ["56px", { lineHeight: "1.07", letterSpacing: "-0.028em", fontWeight: "600" }],
        "display-lg": ["40px", { lineHeight: "1.1", letterSpacing: "0", fontWeight: "600" }],
        "display-md": ["34px", { lineHeight: "1.47", letterSpacing: "-0.0374em", fontWeight: "600" }],
        "lead": ["28px", { lineHeight: "1.14", letterSpacing: "0.0196em", fontWeight: "400" }],
        "tagline": ["21px", { lineHeight: "1.19", letterSpacing: "0.0231em", fontWeight: "600" }],
      },
      spacing: {
        // Apple spacing scale
        "section": "80px",
        "section-sm": "48px",
      },
      borderRadius: {
        // Apple rounded tokens
        pill: "9999px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
