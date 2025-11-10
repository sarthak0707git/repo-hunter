/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg-primary)",
        "bg-sec": "var(--bg-secondary)",
        "bg-tert": "var(--bg-tertiary)",
        accent: "var(--accent-primary)",
        "accent-sec": "var(--accent-secondary)",
        text: "var(--text-primary)",
        "text-sec": "var(--text-secondary)",
      },
    },
  },
  plugins: [],
}

