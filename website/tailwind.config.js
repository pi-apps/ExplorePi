/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nav-purple':'#8A2BE2',
        'nav-gold':'#F7B52C',
        'search-bar':'rgb(255,255,255,.1)',
      },
      backgroundImage:{
        'border':'linear-gradient(to left, #743ad5, #d53a9d);',
        
      },
      backgroundSize: {
        'border-size': '100% 2px',        
      },
      height: {
        'explorer': 'calc(100% - 8rem)',
        'stream': 'calc(100% - 4rem)',
      }
    },
  },
  darkMode: "class",
  plugins: [
    require('tw-elements/dist/plugin'),
    require('flowbite/plugin'),
    require("@nextui-org/theme")
  ],
}
