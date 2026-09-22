/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          light: '#EEF2FF',
          dark: '#818CF8',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
          light: '#F5F3FF',
        },
        accent: {
          DEFAULT: '#06B6D4',
          emerald: '#10B981',
          rose: '#F43F5E',
          amber: '#F59E0B',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
          border: '#E2E8F0',
        },
        darkSurface: {
          DEFAULT: '#0B0F19',
          card: '#1E293B',
          border: '#334155',
        },
      },
      boxShadow: {
        soft: '0 10px 30px -5px rgba(15, 23, 42, 0.05), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
        glow: '0 0 25px -5px rgba(99, 102, 241, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
}


