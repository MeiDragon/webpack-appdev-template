export default async function sleep(time = 1000) {
  await new Promise((rs) => {
    setTimeout(() => {
      rs(true)
    }, time)
  })
  return
}