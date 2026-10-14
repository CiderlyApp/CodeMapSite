import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'monospace',
        ],
      },
      colors: {
        canvas: '#FBFBFC',
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F6F8FA',
          muted: '#EEF0F2',
        },
        graphite: {
          50: '#F7F8F9',
          100: '#EBECEE',
          200: '#D5D7DA',
          300: '#AAAEB4',
          400: '#7B8189',
          500: '#545963',
          600: '#383C43',
          700: '#25282D',
          800: '#17191C',
          900: '#0E1012',
        },
        brand: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          500: '#0969DA',
          600: '#0550AE',
          700: '#033D8B',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;