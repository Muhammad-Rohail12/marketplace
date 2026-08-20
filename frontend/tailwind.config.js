/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1920px',
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          50: '#f0f5ff', 100: '#dbe6fe', 200: '#bcd0fd', 300: '#8fb1fc', 400: '#5c8bf8',
          500: '#3466f0', 600: '#2249e0', 700: '#1c39b8', 800: '#1c3193', 900: '#1c2d74',
        },
        secondary: {
          50: '#fef7ee', 100: '#fdead7', 500: '#f5872f', 600: '#e6690f', 700: '#bf4f0c',
        },
        accent: {
          50: '#fdf4ff', 100: '#fae8ff', 500: '#c026d3', 600: '#a21caf',
        },
        success: { 50: '#f0fdf4', 500: '#22a565', 600: '#188349' },
        danger: { 50: '#fef2f2', 500: '#e5484d', 600: '#c93a3f' },
        warning: { 50: '#fffbeb', 500: '#f0b429', 600: '#d19412' },
        surface: { light: '#ffffff', dark: '#0f1218' },
        neutral: {
          25: '#fcfcfd', 50: '#f9fafb', 100: '#f2f4f7', 200: '#e4e7ec', 300: '#d0d5dd',
          400: '#98a2b3', 500: '#667085', 600: '#475467', 700: '#344054', 800: '#1d2939', 900: '#101828',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        xs: ['0.75rem', { lineHeight: '1.125rem' }],
        sm: ['0.8125rem', { lineHeight: '1.25rem' }],
        base: ['0.9375rem', { lineHeight: '1.5rem' }],
        lg: ['1.0625rem', { lineHeight: '1.6rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.3rem' }],
        '4xl': ['2.375rem', { lineHeight: '2.75rem' }],
        '5xl': ['3rem', { lineHeight: '3.4rem' }],
      },
      borderRadius: {
        sm: '0.375rem', md: '0.625rem', lg: '0.875rem', xl: '1.125rem', '2xl': '1.5rem',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(16,24,40,0.05)',
        card: '0 1px 3px 0 rgba(16,24,40,0.08), 0 1px 2px -1px rgba(16,24,40,0.06)',
        elevated: '0 4px 8px -2px rgba(16,24,40,0.10), 0 2px 4px -2px rgba(16,24,40,0.06)',
        dropdown: '0 10px 15px -3px rgba(16,24,40,0.10), 0 4px 6px -4px rgba(16,24,40,0.10)',
        modal: '0 20px 24px -4px rgba(16,24,40,0.12), 0 8px 8px -4px rgba(16,24,40,0.04)',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'toast-in': { '0%': { opacity: '0', transform: 'translateY(-8px) scale(0.98)' }, '100%': { opacity: '1', transform: 'translateY(0) scale(1)' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-up': { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        'slide-in-right': { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        shimmer: { '0%': { backgroundPosition: '-468px 0' }, '100%': { backgroundPosition: '468px 0' } },
      },
      animation: {
        'toast-in': 'toast-in 0.25s var(--tw-ease, cubic-bezier(0.16,1,0.3,1))',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.28s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-right': 'slide-in-right 0.28s cubic-bezier(0.16,1,0.3,1)',
        shimmer: 'shimmer 1.5s linear infinite',
      },
    },
  },
  plugins: [],
};