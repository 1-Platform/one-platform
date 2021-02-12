module.exports = {
  publicPath: '/feedback',
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].minify = {
          ...args[0].minify,
          removeComments: false
        }
        return args
      })
  }
}
