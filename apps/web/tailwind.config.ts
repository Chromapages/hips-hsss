import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        // All theme tokens cascade to the CSS variables defined in
        // globals.css. In [data-theme="dark"], these resolve to the dark
        // palette automatically. Static hex fallbacks (used when the
        // variable is unresolved during initial paint) are kept for SSR
        // safety.
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-active)",
          soft: "var(--color-primary-hover)",
          foreground: "var(--color-primary-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          dark: "var(--color-accent-dark)",
          soft: "var(--color-accent-soft)",
          foreground: "var(--color-primary-foreground)",
        },
        background: "var(--color-bg)",
        surface: "var(--color-bg-subtle)",
        "surface-alt": "var(--color-surface-offset)",
        border: "var(--color-border)",
        "text-primary": "var(--color-text)",
        "text-secondary": "var(--color-text-muted)",
        "text-muted": "var(--color-text-muted)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        destructive: "var(--color-destructive)",
        muted: {
          DEFAULT: "var(--color-surface-offset)",
          foreground: "var(--color-text-muted)",
        },
        secondary: {
          DEFAULT: "var(--color-surface-offset)",
          foreground: "var(--color-text)",
        },
        input: "var(--color-border-strong)",
        ring: "var(--color-primary)",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: {
            DEFAULT: "hsl(var(--sidebar-primary))",
            foreground: "hsl(var(--sidebar-primary-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--sidebar-accent))",
            foreground: "hsl(var(--sidebar-accent-foreground))",
          },
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        display: ["var(--font-dm-sans)", "sans-serif"],
        heading: ["var(--font-dm-sans)", "sans-serif"],
        "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
        body: ["Source Sans 3", "Arial", "sans-serif"],
        ui: ["Montserrat", "Arial", "sans-serif"],
        sans: ["Source Sans 3", "Arial", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.65" }],
        sm: ["0.875rem", { lineHeight: "1.65" }],
        base: ["1rem", { lineHeight: "1.65" }],
        md: ["1.125rem", { lineHeight: "1.65" }],
        lg: ["1.25rem", { lineHeight: "1.15" }],
        xl: ["1.5rem", { lineHeight: "1.15" }],
        "2xl": ["2rem", { lineHeight: "1.15" }],
        "3xl": ["2.75rem", { lineHeight: "1.15" }],
        "4xl": ["3.5rem", { lineHeight: "1.1" }],
        "5xl": ["4.5rem", { lineHeight: "1.1" }],
      },
      spacing: {
        "0": "0",
        "1": "0.25rem",
        "2": "0.5rem",
        "3": "0.75rem",
        "4": "1rem",
        "5": "1.25rem",
        "6": "1.5rem",
        "8": "2rem",
        "10": "2.5rem",
        "12": "3rem",
        "16": "4rem",
        "20": "5rem",
        "24": "6rem",
        "32": "8rem",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "16px",
        xl: "24px",
        pill: "9999px",
      },
      boxShadow: {
        // Theme-aware shadows — these are the same rgba values for light, but
        // a sibling @theme block in globals.css (--shadow-sm/md/lg) overrides
        // them in [data-theme="dark"] with subtle white-tinted borders since
        // dark drop-shadows are effectively invisible.
        soft: "var(--shadow-sm)",
        card: "var(--shadow-md)",
        elevated: "var(--shadow-lg)",
      },
      maxWidth: {
        content: "1200px",
        "text-measure": "68ch",
      },
      padding: {
        section: {
          desktop: "6rem",
          mobile: "4rem",
        },
      },
    },
  },
};

export default config;