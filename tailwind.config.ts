import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-to-b": "linear-gradient(to bottom, var(--tw-gradient-stops))",
      },
      colors: {
        blue: {
          500: '#3B82F6',
          600: '#2563EB',
        },
        navy: {
          DEFAULT: '#2B3A55',
          dark: '#1E2A3E',
        },
      },
    },
  },
  plugins: [],
};
export default config;