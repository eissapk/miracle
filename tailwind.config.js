/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './context/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        tajawal: ['"Tajawal"', 'Helvetica', 'Arial', 'sans-serif'],
        kitab: ['"Kitab-Regular2"', 'serif'],
        almushaf: ['"almushaf"', 'serif'],
      },
      keyframes: {
        scale: {
          from: { transform: 'translate(-50%, -50%) scale(0.9)' },
          to: { transform: 'translate(-50%, -50%) scale(1.1)' },
        },
        slideToUp: {
          from: { transform: 'translate3d(0,100vh,0)' },
          to: { transform: 'translate3d(0,5vh,0)' },
        },
        slideToDown: {
          to: { transform: 'translate3d(0,100vh,0)' },
        },
        notifySlideToDown: {
          from: { top: '-100px' },
          to: { top: '10px' },
        },
        popupScale: {
          from: { transform: 'translate(-50%,-50%) scale(0.5)' },
          to: { transform: 'translate(-50%,-50%) scale(1)' },
        },
        floatPhone: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'loader-scale': 'scale 1s ease-in-out infinite alternate',
        'slide-up': 'slideToUp 0.2s linear forwards',
        'notify': 'notifySlideToDown 0.3s ease-in-out forwards',
        'float': 'floatPhone 3s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'marquee': 'marquee 45s linear infinite',
        'glow-pulse': 'glow-pulse 9s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};
