// Dependency-free, read-only responsive smoke check against the local application.
// Start an isolated headless Chromium with --remote-debugging-port=9223 first.
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'

const origin = 'http://localhost:5173'
const target = await fetch('http://localhost:9223/json/new?about:blank', { method: 'PUT' }).then(r => r.json())
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }))
let sequence = 0
const pending = new Map()
socket.addEventListener('message', event => {
  const value = JSON.parse(event.data)
  if (value.id && pending.has(value.id)) {
    const { resolve, reject, timer } = pending.get(value.id)
    clearTimeout(timer)
    pending.delete(value.id)
    if (value.error) reject(new Error(value.error.message))
    else resolve(value.result)
  }
})
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(method + ' timed out')) }, 15000)
    pending.set(id, { resolve, reject, timer })
    socket.send(JSON.stringify({ id, method, params }))
  })
}
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
const evaluate = async expression => {
  const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text)
  return response.result.value
}
async function waitFor(expression) {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (await evaluate(expression)) return
    await pause(250)
  }
  throw new Error('Browser condition timed out: ' + expression)
}
await send('Page.enable')
await send('Runtime.enable')
const cars = await fetch('http://localhost:5000/api/v1/cars/featured').then(r => r.json())
const car = cars.data?.[0]
const pickup = new Date(Date.now() + 7 * 86400000).toISOString()
const dropoff = new Date(Date.now() + 8 * 86400000).toISOString()
const trip = new URLSearchParams({ pickup, return: dropoff, ...(car?.branch?.id ? { branchId: car.branch.id } : {}) })
const routes = ['/', '/search', `/search?${trip}`, '/locations', '/login', '/register', '/forgot-password', '/reset-password', '/f6-not-found', ...(car ? [`/cars/${car.id}`, `/cars/${car.id}?${trip}`] : [])]
const results = []
await fs.mkdir('.f6-check', { recursive: true })
try {
  for (const width of process.argv.includes('--actions-only') ? [] : [320, 375, 390, 480, 768, 1024, 1280, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false })
    for (const route of routes) {
      await send('Page.navigate', { url: origin + route })
      // Do not count a lazy-route loading surface as a completed route check.
      for (let attempt = 0; attempt < 40; attempt++) {
        await pause(250)
        const ready = await send('Runtime.evaluate', { expression: `Boolean(document.querySelector('h1')) && !document.body.innerText.includes('Loading…')`, returnByValue: true })
        if (ready.result.value) break
      }
      await pause(500)
      const { result } = await send('Runtime.evaluate', { expression: `JSON.stringify({path:location.pathname, width:innerWidth, scrollWidth:document.documentElement.scrollWidth, heading:document.querySelector('h1')?.innerText, text:document.body.innerText.slice(0,220), unnamedButtons:[...document.querySelectorAll('button')].filter(b=>!b.innerText.trim()&&!b.getAttribute('aria-label')&&!b.getAttribute('title')).length})`, returnByValue: true })
      results.push({ route, ...JSON.parse(result.value) })
      if (width === 375 && ['/', '/search', '/login'].includes(route)) {
        const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
        await fs.writeFile(`.f6-check/${route.replaceAll('/', '') || 'home'}-375.png`, Buffer.from(shot.data, 'base64'))
      }
    }
    console.log(`Checked ${routes.length} real public routes at ${width}px`)
  }
  if (results.length) await fs.writeFile('.f6-check/responsive.json', JSON.stringify(results, null, 2))
  console.log(JSON.stringify({ checks: results.length, overflow: results.filter(r => r.scrollWidth > r.width), missingHeadings: results.filter(r => !r.heading), unnamedButtons: results.filter(r => r.unnamedButtons) }, null, 2))
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 900, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url: `${origin}/search?${trip}&brand=Toyota` })
  await waitFor(`document.querySelector('h1')?.innerText === 'Search Cars'`)
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.innerText === 'Trip and filters').click()`)
  await waitFor(`Boolean(document.querySelector('[aria-labelledby="search-filter-title"]'))`)
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.innerText === 'Clear filters').click()`)
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.innerText === 'Apply').click()`)
  await waitFor(`!new URLSearchParams(location.search).has('brand')`)
  await waitFor(`!document.querySelector('[aria-labelledby="search-filter-title"]')`)
  await pause(500)
  assert.equal(await evaluate(`new URLSearchParams(location.search).get('pickup')`), pickup)
  assert.equal(await evaluate(`new URLSearchParams(location.search).get('return')`), dropoff)
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.innerText === 'Trip and filters').focus();document.activeElement.click()`)
  await waitFor(`Boolean(document.querySelector('[aria-labelledby="search-filter-title"]'))`)
  await pause(400)
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await pause(500)
  assert.equal(await evaluate(`document.activeElement?.innerText`), 'Trip and filters')
  if (car) {
    await send('Page.navigate', { url: `${origin}/cars/${car.id}?${trip}` })
    await waitFor(`[...document.querySelectorAll('button')].some(b=>b.innerText==='Get Quote')`)
    await evaluate(`[...document.querySelectorAll('button')].find(b=>b.innerText==='Get Quote').click()`)
    await waitFor(`document.body.innerText.includes('No active pricing record') || document.body.innerText.includes('Total payable')`)
    console.log('Quote UI: ' + await evaluate(`document.body.innerText.includes('No active pricing record') ? 'real missing-pricing error; no successful quote fixture' : 'real quote rendered'`))
  }
  for (const route of ['/account/bookings', '/account/profile', '/account/addresses', '/account/kyc', '/account/bookings/00000000-0000-4000-8000-000000000001', '/booking/status/00000000-0000-4000-8000-000000000001']) {
    await send('Page.navigate', { url: origin + route })
    await waitFor(`location.pathname === '/login' && document.querySelector('h1')?.innerText === 'Sign In'`)
  }
  await evaluate(`import('/src/services/modules/carService.js').then(m=>{window.f6Cars=m.default})`)
  await send('Network.enable')
  await send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 })
  await evaluate(`window.dispatchEvent(new Event('offline')); window.f6Cars.searchCars({}).then(()=>{window.f6Offline=false},e=>{window.f6Offline=e.isNetworkError && !e.data})`)
  assert.equal(await evaluate('window.f6Offline'), true)
  await send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 })
  await evaluate(`window.dispatchEvent(new Event('online'))`)
  console.log('PASS: 375px filter Apply/Clear preserves trip; Escape restores focus; real quote response UI; six protected-route guest redirects; real browser offline request normalization. Authenticated pages remain NOT EXECUTED.')
} finally {
  await send('Page.close').catch(() => {})
  socket.close()
}
