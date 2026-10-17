/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FAF9F6',
          100: '#F5F3EF',
          200: '#EBE7DF',
          300: '#DBD5C9',
        },
        charcoal: {
          50: '#78716C',
          100: '#57534E',
          200: '#44403C',
          800: '#1C1917',
          900: '#121110',
          950: '#0A0A0A',
        },
        warmgray: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'lift': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'photo': '0 16px 40px -12px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
