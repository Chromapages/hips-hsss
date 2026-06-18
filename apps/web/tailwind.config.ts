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
        xs: ["var(--text-xs)", { lineHeight: "var(--text-xs-leading)" }],
        sm: ["var(--text-sm)", { lineHeight: "var(--text-sm-leading)" }],
        base: ["var(--text-base)", { lineHeight: "var(--text-base-leading)" }],
        md: ["var(--text-md)", { lineHeight: "var(--text-md-leading)" }],
        lg: ["var(--text-lg)", { lineHeight: "var(--text-lg-leading)" }],
        xl: ["var(--text-xl)", { lineHeight: "var(--text-xl-leading)" }],
        "2xl": ["var(--text-2xl)", { lineHeight: "var(--text-2xl-leading)" }],
        "3xl": ["var(--text-3xl)", { lineHeight: "var(--text-3xl-leading)" }],
        "4xl": ["var(--text-4xl)", { lineHeight: "var(--text-4xl-leading)" }],
        "5xl": ["var(--text-5xl)", { lineHeight: "var(--text-5xl-leading)" }],
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