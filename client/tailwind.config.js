/** @type {import('tailwindcss').Config} */
const config = {
  content: [],
  purge: ['./src/**/*.{js,ts,jsx,tsx}', './public/index.html'],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '1085px',
        'lg': '1200px',
        'xl': '1440px',
      },
      colors: {
        primary: 'white', // Change this to your desired base color
      },
      fontFamily: {
        'sans': ['Roboto', 'Open Sans', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [require("daisyui")],
}
export default config;

