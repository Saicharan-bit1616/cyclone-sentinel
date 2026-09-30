/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        risk: {
          low: '#22c55e',
          mod: '#eab308',
          high: '#f97316',
          critical: '#ef4444',
        }
      }
    },
  },
  plugins: [],
}
