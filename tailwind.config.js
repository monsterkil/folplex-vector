/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'folplex': {
          50: '#fef3e8',
          100: '#fcdcc0',
          200: '#f8b87a',
          300: '#f59e4a',
          400: '#f07a1c',
          500: '#eb6a0c',
          600: '#d45e0a',
          700: '#bd5209',
          800: '#9c4508',
          900: '#7a3806',
          950: '#4a2204',
        },
        'steel': {
          50: '#f8f8fa',
          100: '#f0f0f2',
          200: '#e0e0e2',
          300: '#c8c8ca',
          400: '#b0b0b2',
          500: '#a2a2a4',
          600: '#4a4b4f',
          700: '#37383c',
          800: '#25262a',
          900: '#202124',
          950: '#101115',
        }
      },
      fontFamily: {
        'display': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'cnc': '0 0 0 1px rgba(235, 106, 12, 0.15), 0 4px 16px rgba(0, 0, 0, 0.2)',
        'cnc-hover': '0 0 0 1px rgba(235, 106, 12, 0.3), 0 8px 32px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}
