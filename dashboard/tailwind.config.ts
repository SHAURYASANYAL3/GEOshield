import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050816",
        card: "#0D1224",
        primary: "#00E5FF",
        danger: "#FF4B5C",
        success: "#00FF88",
        warning: "#FFB300"
      },
    },
  },
  plugins: [],
} satisfies Config;
