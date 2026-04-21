import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-serif)', '"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
        serif: ['var(--font-serif)', '"Noto Serif SC"', 'ui-serif', 'serif'],
        sans: ['var(--font-sans)', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // 暖色亮色 editorial 调色板
        paper: {
          50:  '#FFFDFA',
          100: '#FAF7F2',
          200: '#F5EFE6',
          300: '#EFE4D2',
          400: '#E6D7BC',
        },
        ink: {
          900: '#1B1510',
          800: '#2B2118',
          700: '#3F372E',
          600: '#5A5046',
          500: '#80766B',
          400: '#A69D92',
          300: '#CFC7BC',
        },
        amber: {
          300: '#E7C59A',
          400: '#D4A373',
          500: '#C99B6F',
          600: '#A67C52',
          700: '#8A6442',
        },
        terracotta: {
          400: '#D27A66',
          500: '#B25E4B',
          600: '#8E4838',
        },
        // 保留旧别名以防残留引用不崩
        sakura:   { 100:'#FAF7F2',200:'#F5EFE6',300:'#D4A373',400:'#C99B6F',500:'#B25E4B' },
        electric: { 300:'#8A6442',400:'#A67C52',500:'#C99B6F',600:'#8A6442' },
        neon:     { 300:'#E7C59A',400:'#D4A373',500:'#C99B6F' },
        midnight: { 700:'#FAF7F2',800:'#F5EFE6',900:'#EFE4D2',950:'#E6D7BC' },
        accent: '#B25E4B',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(27,21,16,0.04), 0 8px 24px -12px rgba(27,21,16,0.12)',
        'card': '0 1px 0 rgba(27,21,16,0.04), 0 12px 40px -20px rgba(27,21,16,0.18)',
        'ring-warm': '0 0 0 1px rgba(166,124,82,0.25)',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translate3d(0,14px,0)' },
          '100%': { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.2,0.7,0.2,1) both',
        'marquee': 'marquee 40s linear infinite',
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter2: '-0.035em',
      },
    },
  },
  plugins: [],
};
export default config;
