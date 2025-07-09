/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cor primária principal
        primary: {
          50: '#fefcfc',
          100: '#fdf8f8',
          200: '#fbeeed',
          300: '#f7ddd9',
          400: '#f1c4be',
          500: '#e8b8b6', // Cor primária principal
          600: '#d99692',
          700: '#c67570',
          800: '#a85d57',
          900: '#8f4e49',
        },
        sage: {
          50: '#f8f9f7',
          100: '#f1f3ef',
          200: '#e3e7de',
          300: '#d0d6c8',
          400: '#b8c1ad',
          500: '#9ca892',
          600: '#636655',
          700: '#4f5244',
          800: '#3f4237',
          900: '#35372f',
        },
        stone: {
          50: '#fafafa',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        // Mantendo blush como alias para compatibilidade
        blush: {
          50: '#fefcfc',
          100: '#fdf8f8',
          200: '#fbeeed',
          300: '#f7ddd9',
          400: '#f1c4be',
          500: '#e8b8b6',
          600: '#d99692',
          700: '#c67570',
          800: '#a85d57',
          900: '#8f4e49',
        },
        rose: {
          50: '#fdfcfc',
          100: '#fcf9f9',
          200: '#f9f1f1',
          300: '#f5e6e6',
          400: '#f0d4d4',
          500: '#f7dadc',
          600: '#e8b8ba',
          700: '#d69699',
          800: '#c17478',
          900: '#a85d61',
        }
      }
    },
  },
  plugins: [],
};