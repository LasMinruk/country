/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#1877f2',
        },
        animation: {
          'spin-slow': 'spin 3s linear infinite',
        },
        transitionDuration: {
          '2000': '2000ms',
        },
      },
    },
    plugins: [],
}
  