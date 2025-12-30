// frontend/postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // ここを tailwindcss から @tailwindcss/postcss に変更
    autoprefixer: {},
  },
}