const path = require('path')
const glob = require('glob')
const { merge } = require('webpack-merge')
const TerserWebpackPlugin = require('terser-webpack-plugin') // 压缩js
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 抽离单独css文件
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin') // 压缩css
const PurgeCSSPlugin = require('purgecss-webpack-plugin').PurgeCSSPlugin // css tree-shaking
const CompressionPlugin = require('compression-webpack-plugin') // 开启gzip压缩
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // 产物分析
const commonWebpackConfig = require('./webpack.common.js')
const { EsbuildPlugin } = require('esbuild-loader')
/**
 * @type {import("webpack").Configuration}
 */
const config = merge(commonWebpackConfig, {
  plugins: [
    new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: '[hash:8].css',
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.resolve(__dirname, 'src')}/**/*`, { nodir: true }),
    }),
    // new CompressionPlugin(),
  ],
  optimization: {
    minimize: true,
    runtimeChunk: true, // 为运行时代码创建一个额外的 chunk，减少 entry chunk 体积
    moduleIds: 'deterministic', // hash 不随依赖改变而改变
    minimizer: [
      // new TerserWebpackPlugin({
      //   parallel: 4,
      //   terserOptions: {
      //     parse: {
      //       ecma: 8,
      //     },
      //     compress: {
      //       ecma: 5,
      //       warnings: false,
      //       comparisons: false,
      //       inline: 2,
      //     },
      //     mangle: {
      //       safari10: true,
      //     },
      //     output: {
      //       ecma: 5,
      //       comments: false,
      //       ascii_only: true,
      //     },
      //   },
      // }),
      // new CssMinimizerPlugin({
      //   parallel: 4,
      // }),
      new EsbuildPlugin({
        target: 'es2015',
        css: true, // Apply minification to CSS assets
        minify: true, // Enable JS minification. Enables all minify* flags below.
        minifyWhitespace: true, // 去掉空格
        minifyIdentifiers: true, // 缩短标识符
        minifySyntax: true, // 缩短语法
        legalComments: 'none', // 去掉注释
        // implementation: esbuild, // 自定义 esbuild 版本
      })
    ],
    splitChunks: {
      chunks: 'all', // 优化范围
      cacheGroups: {
        // 第三方模块
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          // name: 'vendors', 一定不要定义固定的name
          priority: 10, // 优先级
          enforce: true,
        },
        // 公共的模块
        common: {
          name: 'common', // chunk 名称
          priority: 0, // 优先级
          minSize: 0, // 公共模块的大小限制
          minChunks: 2, // 公共模块最少复用过几次
        },
      },
    },
  },
})

module.exports = config