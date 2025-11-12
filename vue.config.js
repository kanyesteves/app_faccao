module.exports = {
  devServer: {
    proxy: {
      '/configurations': {
        target: 'http://localhost:',
        changeOrigin: true,
      },
    },
  },
}
