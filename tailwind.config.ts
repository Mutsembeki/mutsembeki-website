import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
import animatePlugin from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        foreground: '#FFFFFF',
        gold: {
          DEFAULT: '#FFD700',
          soft: '#F4C542',
          dark: '#D4AF37',
          muted: '#B8860B',
        },
        brown: {
          DEFAULT: '#2D1B12',
          light: '#3D2820',
          dark: '#1A0E08',
        },
        glass: {
          DEFAULT: 'rgba(255, 215, 0, 0.05)',
          border: 'rgba(255, 215, 0, 0.15)',
          strong: 'rgba(255, 215, 0, 0.1)',
        },
        primary: {
          DEFAULT: '#FFD700',
          foreground: '#050505',
        },
        secondary: {
          DEFAULT: '#2D1B12',
          foreground: '#F4C542',
        },
        muted: {
          DEFAULT: '#1A1A1A',
          foreground: '#888888',
        },
        accent: {
          DEFAULT: '#F4C542',
          foreground: '#050505',
        },
        card: {
          DEFAULT: '#0D0D0D',
          foreground: '#FFFFFF',
        },
        border: 'rgba(255, 215, 0, 0.15)',
        input: '#1A1A1A',
        ring: '#FFD700',
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#22C55E',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        display: ['var(--font-playfair)', ...fontFamily.serif],
        mono: ['var(--font-mono)', ...fontFamily.mono],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFD700 0%, #F4C542 50%, #D4AF37 100%)',
        'dark-gradient': 'linear-gradient(180deg, #050505 0%, #0D0D0D 100%)',
        'hero-gradient': 'radial-gradient(ellipse at center, #2D1B12 0%, #050505 70%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(244,197,66,0.05) 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(45,27,18,0.6) 0%, rgba(5,5,5,0.8) 100%)',
      },
      boxShadow: {
        gold: '0 0 30px rgba(255, 215, 0, 0.3)',
        'gold-sm': '0 0 15px rgba(255, 215, 0, 0.2)',
        'gold-lg': '0 0 60px rgba(255, 215, 0, 0.4)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.5)',
        'glass-lg': '0 16px 64px rgba(0, 0, 0, 0.7)',
        inner: 'inset 0 1px 0 rgba(255, 215, 0, 0.1)',
      },
      borderRadius: {
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
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
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [animatePlugin],
}

export default config
