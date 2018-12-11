module.exports = {
  devServer: {
    port: 5000,
    open: true,
    proxy: {
      '/api': {
        target: "http://localhost:5001",
        ws: true,
        changeOrigin: true
      }
    },
  }
};