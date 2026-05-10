import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366F1',
          secondary: '#06B6D4',
          accent: '#F59E0B',
        },
        surface: {
          DEFAULT: '#0F1117',
          card: '#1A1D2B',
          border: '#2E3144',
        },
        text: {
          primary: '#F1F3F9',
          secondary: '#9CA3AF',
          dim: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-1': ['36px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-2': ['28px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['20px', { lineHeight: '1.6' }],
        'caption': ['14px', { lineHeight: '1.5' }],
        'code': ['18px', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
}

export default config
