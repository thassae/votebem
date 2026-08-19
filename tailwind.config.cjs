module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#138b83',
          50: '#effcf9',
          100: '#d7f7f1',
          200: '#b2eee5',
          300: '#7fe0d5',
          400: '#4fcac1',
          500: '#2aafa7',
          600: '#138b83',
          700: '#11716c',
          800: '#115a57',
          900: '#104b48'
        }
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 18px 50px -28px rgba(9, 18, 43, 0.35)'
      }
    }
  },
  darkMode: 'class',
  plugins: []
}
