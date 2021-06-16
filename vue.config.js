/*
 * @Author: showier
 * @since: 2020-08-25 15:16:05
 * @lastTime: 2020-08-25 15:42:49
 * @LastAuthor: Do not edit
 * @FilePath: \vue-admin-pro\vue.config.js
 * @Description: vue项目配置
 */
'use strict'

module.exports = {
  publicPath: './',
  outputDir: 'admin-www',
  chainWebpack(config) {
    const cdn = {
      css: [],
      js: []
    }
    config.plugin('html')
      .tap(args => {
        args[0].cdn = cdn
        return args
      })
  }
}