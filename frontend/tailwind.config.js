/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ECE9FB',
          300: '#8B7CE9',
          400: '#6451E1',
          500: '#533DDE',
          600: '#311EAE',
          800: '#180F57',
        },
        black: {
          50: '#F2F2F2',
          400: '#999999',
          700: '#4D4D4D',
          800: '#333333',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        '01': '0px 6px 18px rgba(100, 81, 225, 0.16)',
      }
    },
  },
  plugins: [],
}