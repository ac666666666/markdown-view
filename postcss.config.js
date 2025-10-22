export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      overrideBrowserslist: [
        'defaults',
        'not IE 11',
        'Chrome >= 49',
        'Safari >= 10',
        'iOS >= 10',
        'Android >= 4.4',
        'Samsung >= 4',
        'UCAndroid >= 11.8',
        'QQAndroid >= 10.4'
      ],
      grid: 'autoplace',
      flexbox: 'no-2009'
    },
  },
}