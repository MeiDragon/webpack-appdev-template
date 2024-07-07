export default async function sleep(time = 1000) {
	await new Promise((rs) => {
		setTimeout(() => {
			rs(true)
		}, time)
	})
	console.log([3, [4], 5].flat(1))
	return
}
