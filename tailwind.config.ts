import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "var(--brand-50)",
          100: "var(--brand-100)",
          200: "var(--brand-200)",
          400: "var(--brand-400)",
          500: "var(--brand-500)",
          600: "var(--brand-600)",
          700: "var(--brand-700)",
          900: "var(--brand-900)",
        },
        surface: {
          page:    "var(--surface-page)",
          card:    "var(--surface-card)",
          subtle:  "var(--surface-subtle)",
          overlay: "var(--surface-overlay)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          strong:  "var(--border-strong)",
          focus:   "var(--border-focus)",
        },
        text: {
          primary:   "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted:     "var(--text-muted)",
          inverse:   "var(--text-inverse)",
          link:      "var(--text-link)",
        },
        success: {
          50:  "#F0FDF4",
          500: "#22C55E",
          700: "#15803D",
        },
        warning: {
          50:  "#FFFBEB",
          500: "#F59E0B",
          700: "#B45309",
        },
        danger: {
          50:  "#FEF2F2",
          500: "#EF4444",
          700: "#B91C1C",
        },
        info: {
          50:  "#EFF6FF",
          500: "#3B82F6",
          700: "#1D4ED8",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      fontSize: {
        xs:   ["0.75rem",  { lineHeight: "1rem" }],
        sm:   ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem",     { lineHeight: "1.5rem" }],
        lg:   ["1.125rem", { lineHeight: "1.75rem" }],
        xl:   ["1.25rem",  { lineHeight: "1.75rem" }],
        "2xl":["1.5rem",   { lineHeight: "2rem" }],
        "3xl":["1.875rem", { lineHeight: "2.25rem" }],
        "4xl":["2.25rem",  { lineHeight: "2.75rem" }],
        "5xl":["3rem",     { lineHeight: "3.5rem" }],
      },
      borderRadius: {
        sm:   "4px",
        DEFAULT: "8px",
        md:   "8px",
        lg:   "12px",
        xl:   "16px",
        full: "9999px",
      },
      boxShadow: {
        sm:   "0 1px 3px rgba(0,0,0,0.06)",
        md:   "0 4px 12px rgba(0,0,0,0.08)",
        lg:   "0 8px 24px rgba(0,0,0,0.12)",
      },
      maxWidth: {
        container: "1200px",
        content:   "1100px",
        prose:     "720px",
        form:      "440px",
      },
      spacing: {
        sidebar:       "240px",
        "sidebar-admin": "260px",
        header:        "64px",
      },
    },
  },
  plugins: [],
};

export default config;
