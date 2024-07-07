import './styles/index.css'
import { print, sleep } from './utils'
console.log('webpack-appdev-template')

sleep(2 * 1000).then(() => {
	console.log('2 seconds later')
})
print('@babel/plugin-transform-runtime')
