const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const commonWebpackConfig = require('./webpack.common.js')
const smp = new SpeedMeasurePlugin()
const isNeedSpeed = true
/**
 * @type {import("webpack").Configuration}
 */
const config = merge(commonWebpackConfig, {
  devServer: {
    static: path.resolve(__dirname, './dist'), // 静态文件目录
    hot: true,
    port: 8080,
    client: {
      progress: true, // 浏览器显示编译进度
      overlay: {
        errors: true,
        warnings: false
      }, // 浏览器全屏显示错误
    },
    compress: true, // 静态资源 gzip 压缩
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})

module.exports = isNeedSpeed ? smp.wrap(config) : config