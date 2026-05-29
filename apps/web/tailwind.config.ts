import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        "brand-teal": "#0D2E2B",
        "brand-gold": "#D4AF37",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Arial", "Helvetica", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        "glow-white": "0 0 40px rgba(255, 255, 255, 0.1)",
        "glow-indigo": "0 0 30px rgba(99, 102, 241, 0.15)",
        "glow-indigo-strong": "0 0 40px rgba(99, 102, 241, 0.3)",
        "glow-indigo-pulse": "0 0 28px 8px rgba(99, 102, 241, 0.35)",
        "glow-emerald": "0 0 30px rgba(16, 185, 129, 0.15)",
        "glow-amber": "0 0 50px rgba(245, 158, 11, 0.2)",
        "glow-white-subtle": "0 0 20px rgba(255, 255, 255, 0.05)",
        "glow-white-small": "0 0 10px rgba(255, 255, 255, 1)",
        "glow-black": "0 0 50px rgba(0, 0, 0, 0.8)",
        "glow-indigo-inset": "inset 0 0 100px rgba(255, 255, 255, 0.02)",
        "card": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        "glass": "0 0 50px rgba(0, 0, 0, 0.8)",
      },
      dropShadow: {
        "glow-emerald": "0 0 8px rgba(16, 185, 129, 0.5)",
        "glow-indigo": "0 0 8px rgba(129, 140, 248, 0.5)",
      },
      spacing: {
        "2xs": "0.5625rem",
        "xs": "0.625rem",
        "sm": "0.75rem",
      },
      borderRadius: {
        "2xs": "0.375rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
};

export default config;
