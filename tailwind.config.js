/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial'],
        'inter': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial'],
      },
      colors: {
        primary: '#1E3A8A',
        secondary: '#4B5EAA',
        accent: '#D4A017',
        'dark-blue': '#1E2A5E',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'scroll-slow': 'scroll 15s linear infinite',
        'scroll-fast': 'scroll 8s linear infinite',
        'scroll-very-slow': 'scroll 20s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        scroll: {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-100%)',
          },
        },
      },
    },
  },
  plugins: [],
}
