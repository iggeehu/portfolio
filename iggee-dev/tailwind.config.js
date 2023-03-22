/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors:{
      'silver-tree': {
        '50': '#f7fcfa', 
        '100': '#eff9f5', 
        '200': '#d6f0e6', 
        '300': '#bde7d7', 
        '400': '#8cd4b9', 
        '500': '#5bc29b', 
        '600': '#52af8c', 
        '700': '#449274', 
        '800': '#37745d', 
        '900': '#2d5f4c'
        },
    },
    fontFamily:{
      cyber: ['"Rajdhani"'],
      sans: ['sans-serif'],
      serif: ['Merriweather', 'serif'], 
      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
    },
    extend: {},
  },
  plugins: [],
}
