import { Configuration, HotModuleReplacementPlugin } from 'webpack'
import path from 'path'
import { merge } from 'webpack-merge'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import commonWebpackConfig from './webpack.common.ts'
const smp = new SpeedMeasurePlugin()
const isNeedSpeed = true

const config: Configuration = merge(commonWebpackConfig, {
	devServer: {
		static: path.resolve(__dirname, './dist'), // 静态文件目录
		hot: true,
		port: 8080,
		client: {
			progress: true, // 浏览器显示编译进度
			overlay: {
				errors: true,
				warnings: false
			} // 浏览器全屏显示错误
		},
		compress: true // 静态资源 gzip 压缩
	},
	plugins: [new HotModuleReplacementPlugin()]
})
// @ts-expect-error
export default isNeedSpeed ? smp.wrap(config) : config
