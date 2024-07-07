import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
const isEnvProd = process.env.NODE_ENV === 'production'
const isBabel = process.env.Transpiler === 'babel'
import { Configuration } from 'webpack'
import 'webpack-dev-server'

const config: Configuration = {
	// @ts-expect-error
	mode: process.env.NODE_ENV,
	devtool: isEnvProd ? false : 'eval-cheap-module-source-map',
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, './dist'), // 绝对路径，磁盘存放路径
		pathinfo: false, // 去掉路径信息
		filename: isEnvProd
			? '[name].[contenthash:8].bundle.js'
			: '[name].bundle.js', // 入口模块名
		chunkFilename: isEnvProd
			? 'async-[name]-[contenthash:8].bundle.js'
			: 'async-[name].bundle.js', // 非入口模块名
		clean: true // 相当于 clean-webpack-plugin 功能
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@utils': path.resolve(__dirname, './src/utils')
		},
		extensions: ['.ts', '.js', '.tsx', '.jsx']
		// symlinks: false, // 🚨🚨🚨 配置为true会导致transform-runtime无法按预期生效
	},
	module: {
		rules: [
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset', // url-loader
				parser: {
					dataUrlCondition: {
						maxSize: 4 * 1024
					}
				}
			},
			{
				test: /.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource' // file-loader
			},
			{
				test: /\.css$/i,
				use: [
					isEnvProd ? MiniCssExtractPlugin.loader : 'style-loader', // 仅生产环境抽离
					{
						loader: 'css-loader',
						options: {
							modules: false,
							importLoaders: 2
						}
					},
					'postcss-loader', // css后处理，添加浏览器前缀、转换浏览器兼容性 css 写法、css-modules 解决全局命名冲突问题
					{
						loader: 'thread-loader', // 耗时 loader 放入独立 worker 池运行
						options: {
							// the number of spawned workers, defaults to (number of cpus - 1) or
							// fallback to 1 when require('os').cpus() is undefined
							workers: 2,
							// number of jobs a worker processes in parallel
							// defaults to 20
							workerParallelJobs: 50
						}
					}
				]
			},
			{
				test: /\.s[ca]ss$/i,
				use: [
					isEnvProd ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader',
					'sass-loader'
				]
			},
			isBabel
				? {
						test: /\.[jt]s$/i,
						use: 'babel-loader',
						exclude: /node_modules/
					}
				: {
						test: /\.[jt]sx?$/,
						use: [
							{
								loader: 'esbuild-loader',
								options: {
									// loader: 'tsx',
									target: 'es2015'
								}
							}
						]
					}
		]
	},
	plugins: [
		// 生成html，自动引入bundle
		new HtmlWebpackPlugin({
			title: 'webpack-appdev-template',
			template: path.resolve(__dirname, './src/index.html'),
			// 压缩HTML
			minify: {
				removeComments: isEnvProd,
				collapseWhitespace: isEnvProd, // 删除空⽩符与换⾏符
				minifyCSS: isEnvProd // 压缩内联css
			}
		})
	],
	cache: {
		type: 'filesystem'
	}
}

export default config
