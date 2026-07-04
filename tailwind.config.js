/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          light: '#3B82F6',
          dark: '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
          dark: '#0891B2',
        },
        accent: {
          DEFAULT: '#22C55E',
          light: '#4ADE80',
          dark: '#15803D',
        },
        customBg: {
          light: '#F8FAFC',
          dark: '#0F172A',
        },
        customSurface: {
          light: '#FFFFFF',
          dark: '#111827',
          cardLight: '#F1F5F9',
          cardDark: '#1E293B',
          borderLight: '#E2E8F0',
          borderDark: '#334155',
        },
        customText: {
          light: '#0F172A',
          dark: '#F8FAFC',
          mutedLight: '#64748B',
          mutedDark: '#94A3B8',
        }
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        bangla: ['var(--font-hind-siliguri)', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
