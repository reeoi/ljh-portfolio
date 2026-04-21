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
        // 暖深色 editorial 调色板（paper=暖深底 / ink=暖浅字，语义保持以兼容旧组件）
        paper: {
          50:  '#2A1F17',  // 略浅——卡片/浮层
          100: '#1E1610',  // 主背景
          200: '#342820',  // hover / 次层
          300: '#443427',  // 深卡
          400: '#54402F',
        },
        ink: {
          900: '#F5EFE6',  // 主文字（最亮）
          800: '#E9DEC9',
          700: '#D8C7A8',
          600: '#C09B74',  // 次要/链接
          500: '#9A8670',
          400: '#786859',
          300: '#5A4E40',  // 弱分隔
          200: '#40342A',  // 边框
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
        // 保留旧别名以防残留引用不崩（深色版）
        sakura:   { 100:'#2A1F17',200:'#342820',300:'#D4A373',400:'#C99B6F',500:'#B25E4B' },
        electric: { 300:'#8A6442',400:'#A67C52',500:'#C99B6F',600:'#8A6442' },
        neon:     { 300:'#E7C59A',400:'#D4A373',500:'#C99B6F' },
        midnight: { 700:'#2A1F17',800:'#1E1610',900:'#140E0A',950:'#0B0704' },
        accent: '#D27A66',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(0,0,0,0.35), 0 8px 24px -12px rgba(0,0,0,0.55)',
        'card': '0 1px 0 rgba(0,0,0,0.35), 0 12px 40px -20px rgba(0,0,0,0.65)',
        'ring-warm': '0 0 0 1px rgba(212,163,115,0.30)',
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
