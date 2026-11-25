/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nunito Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Nunito Sans"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        brand: {
          teal: '#00adb5',
          tealSoft: '#b8eef0',
          noir: '#222831',
          noirLight: '#303640',
          darkBg: '#1d232c',
          surface: '#eeeeee',
          purple: '#8B5CF6',
          blue: '#3B82F6',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E'
        },
        noir: {
          950: '#15181e',
          900: '#1d232c',
          850: '#222831',
          800: '#2b323c',
          700: '#303640',
          600: '#3f4754',
          500: '#525b6c'
        },
        surface: {
          glass: 'rgba(34, 40, 49, 0.75)',
          glassLight: 'rgba(238, 238, 238, 0.88)',
          glassBorder: 'rgba(255, 255, 255, 0.1)',
          glassBorderDark: '#303640'
        }
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.35)',
        glassSm: '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
        glassGlowTeal: '0 0 25px rgba(0, 173, 181, 0.35)',
        glassGlowTealSm: '0 0 12px rgba(0, 173, 181, 0.25)',
        clay: '8px 8px 0px 0px rgba(0,0,0,0.25)',
        claySm: '4px 4px 0px 0px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        pill: '9999px'
      },
      transitionDuration: {
        fast: '120ms',
        normal: '180ms',
        slow: '260ms'
      }
    }
  },
  plugins: []
}
