import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Courier New'],
        'nunito': ['Nunito', 'sans-serif'],
      },
      colors: {
        primaryPink: "#F267ED",
        primaryPurple: "#423EEE",
        pink: {
          100: "#FF95FB",
          200: "#FFAEFC"
        },
        grey: {
          100: "#ECECF1",
          200: "#C5C5D1",
          300: "#9A9B9F",
          400: "#444654"
        },
        orange: {
          100: "#FEF8C4", // light tan
          200: "#E6B52C", // subdued orange
          300: "#F9A277", // light reddish orange
          400: "#D56450" // reddish orange
        },
        midGreen: "#04BC00",
        cerulean: "#4CA7DC",
        bgPurple: "#6350D5",
        yellowGreen: "#D9DC4C",
        paleGreen: "#B9EE3E",
        brightLightBlue: "#3EEBEE",
        brightYellow: "#FFE400",
        peach: "#F97777"

      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
