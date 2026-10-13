import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dynamic theme colors using CSS variables
        background: "var(--color-background)",
        "surface-primary": "var(--color-surface-primary)",
        "surface-secondary": "var(--color-surface-secondary)",
        "accent-primary": "var(--color-accent-primary)",
        "accent-secondary": "var(--color-accent-secondary)",
        border: "var(--color-border)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
        },
      },
      fontSize: {
        // iOS system font sizes
        'xs': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'base': ['15px', { lineHeight: '22px', fontWeight: '400' }],
        'lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'xl': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        '2xl': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        '3xl': ['24px', { lineHeight: '32px', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
};

export default config;

