// Live admin guest surface only. No privileged login or API result is fabricated.
import fs from 'node:fs'
const target = await fetch('http://localhost:9223/json/new?about:blank', { method: 'PUT' }).then(
  (r) => r.json()
)
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }))
let seq = 0
const waiting = new Map(),
  exceptions = []
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++seq
    waiting.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
socket.addEventListener('message', (event) => {
  const r = JSON.parse(event.data)
  if (waiting.has(r.id)) {
    const p = waiting.get(r.id)
    waiting.delete(r.id)
    r.error ? p.reject(new Error(r.error.message)) : p.resolve(r.result)
  }
  if (r.method === 'Runtime.exceptionThrown') exceptions.push(r.params.exceptionDetails.text)
})
const evaluate = async (expression) =>
  (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value
try {
  await send('Page.enable')
  await send('Runtime.enable')
  const samples = []
  for (const width of [375, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await send('Page.navigate', { url: 'http://localhost:5174/login' })
    for (let i = 0; i < 80; i++) {
      await new Promise((r) => setTimeout(r, 200))
      if (await evaluate(`!!document.querySelector('input[type="password"]')`)) break
    }
    samples.push(
      await evaluate(
        `({path:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,passwordControl:!!document.querySelector('input[type="password"]')})`
      )
    )
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
    })
    fs.writeFileSync(
      '.f6-check/uat-admin-login-' + width + '.png',
      Buffer.from(shot.data, 'base64')
    )
  }
  const result = {
    scope: 'LIVE ADMIN GUEST ONLY; authenticated admin UAT unavailable',
    samples,
    exceptions,
  }
  fs.writeFileSync('docs/UAT-admin-guest-evidence.json', JSON.stringify(result, null, 2))
  console.log(JSON.stringify(result))
} finally {
  await send('Page.close').catch(() => {})
  socket.close()
}
