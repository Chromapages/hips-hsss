import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#173B57",
          dark: "#102A3D",
          soft: "#2A5576",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#C59A35",
          dark: "#A67F28",
          soft: "#DFC06A",
          foreground: "#FFFFFF",
        },
        background: "#FFFFFF",
        surface: "#F6F8FA",
        "surface-alt": "#EEF3F6",
        border: "#D6E0E8",
        "text-primary": "#173B57",
        "text-secondary": "#445A6C",
        "text-muted": "#6F8291",
        success: "#2F7A5F",
        warning: "#A06A18",
        destructive: "#9C3E3E",
        muted: {
          DEFAULT: "#F6F8FA",
          foreground: "#6F8291",
        },
        secondary: {
          DEFAULT: "#F6F8FA",
          foreground: "#173B57",
        },
        input: "#D6E0E8",
        ring: "#173B57",
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
        soft: "0 4px 18px rgba(23, 59, 87, 0.08)",
        card: "0 10px 30px rgba(23, 59, 87, 0.10)",
        elevated: "0 18px 50px rgba(23, 59, 87, 0.16)",
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