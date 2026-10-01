import fs from "fs";

// 1. Update index.css
const css = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    background-color: #f8fafc;
    color: #0f172a;
  }
}
`;
fs.writeFileSync("src/index.css", css, "utf8");

// 2. Update tailwind.config.js
const tw = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          dark: "#081c33",
          navy: "#0b2545",
          blue: "#134074",
          subtle: "#1d4e89",
          accent: "#0077b6",
          sky: "#e0f2fe",
          surface: "#f8fafc",
          border: "#e2e8f0",
          saffron: "#ea580c",
          teal: "#0d9488",
          purple: "#7c3aed",
          gold: "#b45309"
        }
      },
      boxShadow: {
        "xs": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      }
    },
  },
  plugins: [],
};
`;
fs.writeFileSync("tailwind.config.js", tw, "utf8");
console.log("Tailwind & index.css updated cleanly");
