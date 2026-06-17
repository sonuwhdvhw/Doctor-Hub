/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff0f0',
          100: '#ffdddd',
          200: '#ffc0c0',
          300: '#ff9494',
          400: '#ff5757',
          500: '#ff2323',
          600: '#e60000',
          700: '#c20000',
          800: '#a10000',
          900: '#850000',
          950: '#4a0000',
        },
        accent: {
          50: '#fff8f0',
          100: '#ffeedd',
          200: '#ffd9b5',
          300: '#ffbe82',
          400: '#ff9a3d',
          500: '#ff7c0a',
          600: '#e06200',
          700: '#b84d00',
          800: '#933d00',
          900: '#783200',
        },
        surface: {
          DEFAULT: '#fafafa',
          card: '#ffffff',
          muted: '#f5f5f5',
          sidebar: '#0a0a0a',
          'sidebar-hover': '#1a1a1a',
          'sidebar-active': '#2a0000',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 4px 16px -2px rgb(15 23 42 / 0.06)',
        'card-hover': '0 8px 30px -4px rgb(230 0 0 / 0.15), 0 4px 12px -2px rgb(15 23 42 / 0.06)',
        glow: '0 0 48px -8px rgb(230 0 0 / 0.5)',
        'glow-red': '0 0 80px -8px rgb(230 0 0 / 0.4)',
        'glow-accent': '0 0 48px -8px rgb(255 124 10 / 0.35)',
        nav: '0 1px 0 0 rgb(15 23 42 / 0.05), 0 4px 20px -4px rgb(15 23 42 / 0.08)',
        inner: 'inset 0 1px 0 0 rgb(255 255 255 / 0.06)',
        '3d': '0 20px 60px -10px rgb(230 0 0 / 0.3), 0 8px 20px -4px rgb(0 0 0 / 0.2)',
      },
      backgroundImage: {
        'hero-mesh': 'radial-gradient(at 40% 20%, rgb(230 0 0 / 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(255 124 10 / 0.10) 0px, transparent 50%), radial-gradient(at 0% 50%, rgb(230 0 0 / 0.08) 0px, transparent 50%)',
        'gradient-brand': 'linear-gradient(135deg, #c20000 0%, #e60000 50%, #ff5757 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0a0a 0%, #1a0000 100%)',
        'gradient-red-dark': 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #2a0000 100%)',
      },
      gridTemplateColumns: {
        auto: 'repeat(auto-fill, minmax(220px, 1fr))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.35s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'rotate-reverse': 'rotateReverse 15s linear infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'counter': 'counter 2s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(2deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        rotateReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgb(230 0 0 / 0.4)' },
          '50%': { boxShadow: '0 0 60px rgb(230 0 0 / 0.8)' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
    },
  },
  plugins: [],
}
