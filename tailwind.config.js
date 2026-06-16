/** @type {import('tailwindcss').Config} */
module.exports = {
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
      },
      animation: {
        'loader-scale': 'scale 1s ease-in-out infinite alternate',
        'slide-up': 'slideToUp 0.2s linear forwards',
        'notify': 'notifySlideToDown 0.3s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
