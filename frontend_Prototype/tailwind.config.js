/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background": "#051424",
        "secondary": "#5de6ff",
        "inverse-primary": "#005ac2",
        "surface-tint": "#adc6ff",
        "secondary-container": "#00cbe6",
        "tertiary-fixed": "#d4e3ff",
        "on-tertiary-container": "#002a51",
        "on-surface-variant": "#c2c6d6",
        "on-tertiary-fixed-variant": "#004883",
        "surface-container-high": "#1c2b3c",
        "surface-container-lowest": "#010f1f",
        "secondary-fixed-dim": "#2fd9f4",
        "secondary-fixed": "#a2eeff",
        "error": "#ffb4ab",
        "primary-fixed": "#d8e2ff",
        "error-container": "#93000a",
        "on-surface": "#d4e4fa",
        "primary-fixed-dim": "#adc6ff",
        "primary": "#adc6ff",
        "on-secondary": "#00363e",
        "on-error": "#690005",
        "surface": "#051424",
        "tertiary-container": "#4c93e7",
        "on-secondary-container": "#00515d",
        "primary-container": "#4d8eff",
        "on-primary-container": "#00285d",
        "inverse-on-surface": "#233143",
        "surface-container": "#122131",
        "on-primary-fixed": "#001a42",
        "on-background": "#d4e4fa",
        "on-primary-fixed-variant": "#004395",
        "on-secondary-fixed": "#001f25",
        "outline-variant": "#424754",
        "surface-container-low": "#0d1c2d",
        "surface-bright": "#2c3a4c",
        "on-secondary-fixed-variant": "#004e5a",
        "outline": "#8e919f",
        "surface-container-highest": "#273546"
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      spacing: {
        "unit": "8px",
        "gutter": "24px",
        "margin-mobile": "16px",
        "container-max": "1200px",
        "margin-desktop": "40px"
      },
      fontFamily: {
        "body-md": ["Inter", "sans-serif"],
        "label-sm": ["Geist", "sans-serif"],
        "headline-lg-mobile": ["Hanken Grotesk", "sans-serif"],
        "display-lg": ["Hanken Grotesk", "sans-serif"],
        "headline-lg": ["Hanken Grotesk", "sans-serif"]
      },
      fontSize: {
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }]
      }
    },
  },
  plugins: [],
}
