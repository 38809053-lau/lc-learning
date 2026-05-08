/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        toc: {
          gold: '#10B981',
          crutch: '#F59E0B',
          mermaid: '#6366F1',
          crocodile: '#EF4444',
        },
      },
    },
  },
  plugins: [],
};
