/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d9edff',
          200: '#baddff',
          300: '#8bc7ff',
          400: '#57a6ff',
          500: '#2d82ff',
          600: '#1d63db',
          700: '#194eb0',
          800: '#1a458f',
          900: '#1a3b75',
        },
      },
    },
  },
  plugins: [],
};