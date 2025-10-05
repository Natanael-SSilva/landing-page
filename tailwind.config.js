// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  // AQUI ESTÁ A CORREÇÃO:
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'), // O nome correto do pacote
  ],
}