/** @type {import('tailwindcss').Config} */
import trac from "tailwindcss-react-aria-components";
import contQueries from "@tailwindcss/container-queries";

export default {
  content: ["./index.html", "./download.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
    },
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        primary:
          "light-dark(oklch(55% 0.24 265), oklch(65.69% 0.196 285.75))",
        "primary-content":
          "light-dark(#ffffff, oklch(0.13138 0.0392 285.75))",
        secondary:
          "light-dark(oklch(55% 0.2 160), oklch(74.8% 0.26 342.55))",
        accent:
          "light-dark(oklch(55% 0.15 250), oklch(74.51% 0.167 183.61))",
        "base-content": "light-dark(#1a1a1a, #d4d4d8)",
        "base-100": "light-dark(#ffffff, #18181b)",
        "base-200": "light-dark(#f7f7f8, #1e1e22)",
        "base-300": "light-dark(#ebebed, #27272a)",
      },
    },
    fontFamily: {
      keycap: ["Inter", "system-ui"],
    },
  },
  plugins: [contQueries, trac({ prefix: "rac" })],
};
