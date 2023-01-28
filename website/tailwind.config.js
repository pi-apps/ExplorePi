/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'nav-purple':'#8A2BE2',
        'nav-gold':'#F7B52C',
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
  plugins: [
    require('tw-elements/dist/plugin'),
    require('flowbite/plugin')
  ],
}
