export default {

  content: [
    './**/*.ts',
    './wwwroot/**/*.{html,php}'
  ],

  safelist: [
    'bg-red-500',
    'hover:bg-red-700'
  ],

  theme: {
    extend: {
      colors: {
        'primary': '#ff49db',
      },
      fontFamily: {
        'sans': ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },

  plugins: [],
}
