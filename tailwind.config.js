/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html","./src/**/*.{html,js,jsx,tsx,ts}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        'custom': '0.6fr 1.1fr',
      },
      maxWidth: {
        '100p':'100%',
      }
    },
  },
  plugins: [],
}

