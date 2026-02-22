/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        /* Feminine purple palette */
        brand: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6d28d9',
          900: '#5b21b6',
        },
        /* Feminine pink accent palette */
        accent: {
          50:  '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
        'gradient-soft':  'linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass':  '0 8px 32px rgba(124, 58, 237, 0.12)',
        'glow':   '0 0 20px rgba(124, 58, 237, 0.35)',
        'pink':   '0 4px 14px rgba(236, 72, 153, 0.3)',
      },
    },
  },
  plugins: [],
};
