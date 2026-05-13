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
        neutral: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#e5e7eb',   // --color-border
          300: '#d1d5db',
          400: '#9ca3af',   // --color-text-muted
          500: '#6b7280',   // --color-text-secondary
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',   // --color-text-primary
          950: '#030712',
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
          "divider-soft": "var(--apple-divider-soft)",
          hairline: "var(--apple-hairline)",
          "surface-pearl": "var(--apple-surface-pearl)",
          "surface-tile-3": "var(--apple-surface-tile-3)",
          "on-primary": "var(--apple-on-primary)",
          "on-dark": "var(--apple-on-dark)",
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
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
