import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FBF6EC', raised: '#FDF9F0', sunk: '#F3ECDC' },
        navy: { DEFAULT: '#1b2a6b', deep: '#11194a', soft: '#3a4a8c' },
        corn: { DEFAULT: '#5B8DEF', dim: '#3a6fd8' },
        planet: '#4A90D9',
        gold: { DEFAULT: '#FFC23C', deep: '#d99e20' },
        pinkp: '#F58BB0',
        purplep: '#9B7BD6',
        inkmute: '#5a6488',
        inkfaint: '#8a93b0',
      },
      fontFamily: {
        display: ['var(--font-fredoka)', 'system-ui', 'sans-serif'],
        body: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        hand: ['var(--font-caveat)', 'cursive'],
      },
      boxShadow: {
        'lip': '0 6px 0 #11194a',
        'lip-gold': '0 6px 0 #d99e20',
        'card': '0 8px 22px rgba(74,144,217,.10)',
        'card-hover': '0 16px 34px rgba(74,144,217,.16)',
      },
      borderRadius: { xl2: '1.3rem' },
    },
  },
  plugins: [],
} satisfies Config
