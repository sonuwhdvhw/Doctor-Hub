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
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd4ff',
          300: '#8eb8ff',
          400: '#5990ff',
          500: '#3366ff',
          600: '#1a4fd9',
          700: '#153fb0',
          800: '#17368f',
          900: '#182f75',
          950: '#0f1d4a',
        },
        accent: {
          50: '#ecfdf8',
          100: '#d1faf0',
          200: '#a7f3e1',
          300: '#6ee7cb',
          400: '#34d3b0',
          500: '#10b99a',
          600: '#059682',
          700: '#047867',
          800: '#065f53',
          900: '#064e45',
        },
        surface: {
          DEFAULT: '#f4f7fb',
          card: '#ffffff',
          muted: '#eef2f7',
          sidebar: '#0c1222',
          'sidebar-hover': '#161f35',
          'sidebar-active': '#1e2a45',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 4px 16px -2px rgb(15 23 42 / 0.06)',
        'card-hover': '0 8px 30px -4px rgb(15 23 42 / 0.12), 0 4px 12px -2px rgb(15 23 42 / 0.06)',
        glow: '0 0 48px -8px rgb(51 102 255 / 0.35)',
        'glow-accent': '0 0 48px -8px rgb(16 185 154 / 0.35)',
        nav: '0 1px 0 0 rgb(15 23 42 / 0.05), 0 4px 20px -4px rgb(15 23 42 / 0.08)',
        inner: 'inset 0 1px 0 0 rgb(255 255 255 / 0.06)',
      },
      backgroundImage: {
        'hero-mesh': 'radial-gradient(at 40% 20%, rgb(51 102 255 / 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(16 185 154 / 0.10) 0px, transparent 50%), radial-gradient(at 0% 50%, rgb(51 102 255 / 0.08) 0px, transparent 50%)',
        'gradient-brand': 'linear-gradient(135deg, #1a4fd9 0%, #3366ff 50%, #10b99a 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0c1222 0%, #161f35 100%)',
      },
      gridTemplateColumns: {
        auto: 'repeat(auto-fill, minmax(220px, 1fr))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.35s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
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
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
