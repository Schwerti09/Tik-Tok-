/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f3d0fe',
          300: '#e9a8fd',
          400: '#d770f9',
          500: '#c03ef2',
          600: '#a21bcc',
          700: '#8714a8',
          800: '#6f1389',
          900: '#5b1470',
        },
      },
    },
  },
  plugins: [],
}
