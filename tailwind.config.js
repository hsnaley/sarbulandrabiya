/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        urdu: ['Noto Nastaliq Urdu', 'serif'],
      },
      colors: {
        velvet: '#071423',
        rouge: '#8c1323',
        sindoor: '#b0202f',
        marigold: '#f2a51f',
        mehndi: '#1f6b45',
        antique: '#c99b52',
        parchment: '#fff8ea',
        ink: '#2b1514',
      },
      boxShadow: {
        glow: '0 0 70px rgba(242,165,31,.35)',
        'gold-soft': '0 22px 90px rgba(201,155,82,.26)',
      },
      backgroundImage: {
        'velvet-radial':
          'radial-gradient(circle at 50% 20%, rgba(45,78,112,.34), transparent 34%), linear-gradient(135deg, #071423 0%, #10243a 48%, #050b14 100%)',
        'gold-line':
          'linear-gradient(90deg, transparent, rgba(242,165,31,.72), transparent)',
      },
    },
  },
  plugins: [],
}
