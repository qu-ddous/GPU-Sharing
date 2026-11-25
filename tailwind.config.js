/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#8B5CF6',
          purpleDark: '#7C3AED',
          blue: '#3B82F6',
          blueDark: '#2563EB',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E'
        },
        surface: {
          950: '#0B0D11',
          900: '#0F1115',
          850: '#15181E',
          800: '#1A1D23',
          750: '#1F232B',
          700: '#242830',
          600: '#30353F',
          border: '#3C4260'
        }
      },
      boxShadow: {
        clay: '8px 8px 0px 0px rgba(0,0,0,0.25)',
        claySm: '4px 4px 0px 0px rgba(0,0,0,0.25)',
        clayGlowPurple: '0 0 20px rgba(139, 92, 246, 0.35)',
        clayGlowBlue: '0 0 20px rgba(59, 130, 246, 0.35)'
      }
    }
  },
  plugins: []
}
