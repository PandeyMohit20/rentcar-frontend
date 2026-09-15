// LIVE UAT: real API traffic only. No interception, mocking or fixture responses.
// Start an isolated headless Chromium with --remote-debugging-port=9225 first.
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'

const origin = 'http://localhost:5173'
const target = await fetch('http://localhost:9225/json/new?about:blank', { method: 'PUT' }).then(
  (r) => r.json()
)
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }))
let sequence = 0
const pending = new Map()
socket.addEventListener('message', (event) => {
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
    const timer = setTimeout(() => {
      pending.delete(id)
      reject(new Error(method + ' timed out'))
    }, 15000)
    pending.set(id, { resolve, reject, timer })
    socket.send(JSON.stringify({ id, method, params }))
  })
}
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const evaluate = async (expression) => {
  const response = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  })
  if (response.exceptionDetails)
    throw new Error(
      response.exceptionDetails.exception?.description?.split('\n')[0] ||
        response.exceptionDetails.text
    )
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

const api = 'http://localhost:5000/api/v1'
const evidence = {
  startedAt: new Date().toISOString(),
  api,
  origin,
  mode: 'LIVE; no interception or fixtures',
  network: [],
  checks: [],
  bookingsCreated: [],
  paymentsAttempted: false,
}
const save = () =>
  fs.writeFile('docs/LIVE-CARONRENT-NETWORK.json', JSON.stringify(evidence, null, 2))
const pass = (scenario, details) => {
  evidence.checks.push({ scenario, result: 'PASS', details })
  console.log('PASS ' + scenario)
}
const pendingRequests = new Map()
const bodyJobs = []
socket.addEventListener('message', (event) => {
  const value = JSON.parse(event.data)
  if (value.method === 'Network.requestWillBeSent') {
    const { request, requestId } = value.params
    if (!request.url.startsWith(api)) return
    const endpoint = new URL(request.url).pathname
    const item = {
      method: request.method,
      endpoint,
      status: null,
      purpose: endpoint.includes('quote')
        ? 'Create real trip quote'
        : endpoint.includes('availability')
          ? 'Search actual availability'
          : endpoint.includes('auth')
            ? 'Restore guest session'
            : 'Read live catalog/location data',
    }
    if (
      request.postData &&
      ['/api/v1/pricing/quote', '/api/v1/availability/search'].includes(endpoint)
    )
      item.request = JSON.parse(request.postData)
    pendingRequests.set(requestId, item)
    evidence.network.push(item)
  }
  if (value.method === 'Network.responseReceived') {
    const item = pendingRequests.get(value.params.requestId)
    if (item) item.status = value.params.response.status
  }
  if (value.method === 'Network.loadingFinished') {
    const item = pendingRequests.get(value.params.requestId)
    if (!item) return
    bodyJobs.push(
      send('Network.getResponseBody', { requestId: value.params.requestId })
        .then(({ body }) => {
          let data
          try {
            data = JSON.parse(body)
          } catch {
            return
          }
          item.result = item.status < 400 ? 'Success' : String(data.message || 'Request rejected')
          item.hasInternalStack = Boolean(data.stack || data.error?.stack)
          item.errorCode = data.error?.code || undefined
          if (item.endpoint.endsWith('/pricing/quote') && item.status < 400) {
            const q = data.data
            evidence.quote = {
              carId: q.carId,
              pickupDateTime: q.pickupDateTime,
              returnDateTime: q.returnDateTime,
              currencyCode: q.currencyCode,
              pricing: q.pricing,
              financialSnapshot: q.financialSnapshot,
              expiresAt: q.expiresAt,
            }
          }
        })
        .catch(() => {})
    )
  }
})
await send('Network.enable')
const read = async (endpoint) => {
  const response = await fetch(api + endpoint)
  const body = await response.json()
  evidence.network.push({
    method: 'GET',
    endpoint: '/api/v1' + endpoint,
    status: response.status,
    purpose: 'Connectivity and live data selection',
    result: response.ok ? 'Success' : String(body.message || 'Rejected'),
  })
  assert.ok(response.ok)
  return body.data
}
const click = (label) =>
  evaluate(
    `[...document.querySelectorAll('button')].find(b=>b.innerText===${JSON.stringify(label)})?.click()`
  )
const fit = async (label) => {
  const d = await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})`)
  assert.ok(d.scrollWidth <= d.width, JSON.stringify(d))
  pass(label, d)
}
try {
  await read('/health')
  await read('/health/database')
  pass('Backend and database health', 'HTTP 200')
  const branches = await read('/locations/branches')
  assert.ok(branches.length)
  const branch = branches[0]
  evidence.branchId = branch.id
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 950,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await send('Page.navigate', { url: origin })
  await waitFor(
    `document.querySelector('[role="combobox"]') && document.body.innerText.includes('View Details')`
  )
  const runtimeApi = await evaluate(
    `import('/src/services/api/axiosInstance.js').then(m=>m.default.defaults.baseURL)`
  )
  assert.equal(runtimeApi, api)
  evidence.runtimeApi = runtimeApi
  pass(
    'Home loads live fleet and branches',
    'Runtime Axios base URL verified; HTTP 200 catalog and branches'
  )
  const date = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
  const end = new Date(Date.now() + 8 * 86400000).toISOString().slice(0, 10)
  await evaluate(
    `document.querySelector('[role="combobox"]').dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0}))`
  )
  await waitFor(`Boolean(document.querySelector('[role="listbox"]'))`)
  await evaluate(
    `[...document.querySelectorAll('[role="option"]')].find(x=>x.textContent.includes(${JSON.stringify(branch.name)})).click()`
  )
  await evaluate(
    `(()=>{const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;const dates=document.querySelectorAll('input[type=date]');const times=document.querySelectorAll('input[type=time]');for(const [el,value] of [[dates[0],${JSON.stringify(date)}],[dates[1],${JSON.stringify(end)}],[times[0],'10:00'],[times[1],'10:00']]){set.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}})()`
  )
  await click('Search Cars')
  await waitFor(`location.pathname==='/search' && document.body.innerText.includes('View Details')`)
  const trip = await evaluate('location.search')
  evidence.trip = Object.fromEntries(new URLSearchParams(trip))
  assert.equal(evidence.trip.branchId, branch.id)
  assert.equal(evidence.trip.pickup, `${date}T10:00:00+05:30`)
  assert.equal(evidence.trip.return, `${end}T10:00:00+05:30`)
  pass(
    'Home to availability search',
    'Actual form selection; branch and exact IST timestamps preserved in URL'
  )
  await send('Page.reload')
  await pause(700)
  await waitFor(`document.body.innerText.includes('View Details')`)
  assert.equal(await evaluate('location.search'), trip)
  pass('Search refresh persistence', 'Same branch/pickup/return')
  const detail = await evaluate(
    `[...document.querySelectorAll('a')].find(a=>a.innerText.includes('View Details')).getAttribute('href')`
  )
  evidence.carId = detail.split('/cars/')[1].split('?')[0]
  await evaluate(
    `[...document.querySelectorAll('a')].find(a=>a.innerText.includes('View Details')).click()`
  )
  await waitFor(`document.body.innerText.includes('Get Quote')`)
  assert.equal(await evaluate('location.search'), trip)
  await evaluate('history.back()')
  await waitFor(`location.pathname==='/search' && document.body.innerText.includes('View Details')`)
  assert.equal(await evaluate('location.search'), trip)
  await evaluate('history.forward()')
  await waitFor(
    `location.pathname.startsWith('/cars/') && document.body.innerText.includes('Get Quote')`
  )
  assert.equal(await evaluate('location.search'), trip)
  pass('Browser back/forward and car context', 'Live vehicle details; original query unchanged')
  for (const width of [390, 768, 1024, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 950,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await send('Page.navigate', { url: origin })
    await pause(400)
    await waitFor(
      `document.querySelector('[role="combobox"]') && document.body.innerText.includes('View Details')`
    )
    await fit('Live Home search form ' + width)
    await send('Page.navigate', { url: origin + '/search' + trip })
    await waitFor(`document.body.innerText.includes('View Details')`)
    await pause(300)
    await fit('Live results ' + width)
    if (width < 900) {
      await click('Trip and filters')
      await waitFor(`Boolean(document.querySelector('[aria-labelledby="search-filter-title"]'))`)
      await fit('Live filter drawer ' + width)
      await evaluate(`document.querySelector('[aria-label="Close filters"]').click()`)
      await pause(300)
      assert.equal(await evaluate('location.search'), trip)
    }
    await send('Page.navigate', { url: origin + detail })
    await waitFor(`document.body.innerText.includes('Get Quote')`)
    await pause(300)
    await fit('Live car details ' + width)
    if (width === 390) {
      assert.ok(
        await evaluate(
          `[...document.querySelectorAll('button')].filter(b=>b.innerText==='Get Quote').length>=2`
        )
      )
      pass('MobileBookingCTA with live car', 'Quote action visible; no reservation yet')
    }
  }
  await waitFor(
    `[...document.querySelectorAll('img')].some(i=>i.src.includes('/uploads/cars/') && i.complete && i.naturalWidth>0)`
  )
  assert.equal(
    await evaluate(`getComputedStyle(document.getElementById('booking-summary')).position`),
    'sticky'
  )
  pass('Desktop sticky booking card', 'Live vehicle quote card uses sticky positioning')
  await click('View photos')
  await waitFor(`Boolean(document.querySelector('[role="dialog"]'))`)
  await click('Zoom in')
  assert.ok(await evaluate(`document.body.innerText.includes('Fit photo')`))
  await evaluate(`document.querySelector('[aria-label="Close gallery"]').click()`)
  await pause(300)
  pass('Live gallery', 'Actual vehicle image URLs; fullscreen and zoom controls')
  await click('Get Quote')
  await waitFor(
    `document.body.innerText.includes('Total payable') || [...document.querySelectorAll('[role="alert"]')].some(a=>/CONFIRMATION|REQUIRED|not available|Unable/.test(a.innerText))`
  )
  await pause(500)
  await Promise.all(bodyJobs)
  const quoteRequest = evidence.network
    .filter((n) => n.method === 'POST' && n.endpoint.endsWith('/pricing/quote'))
    .at(-1)
  evidence.quoteRequest = quoteRequest
  const alert = await evaluate(
    `[...document.querySelectorAll('[role="alert"]')].map(a=>a.innerText).join(' | ')`
  )
  evidence.quoteUiMessage = alert
  if (!(quoteRequest?.status >= 200 && quoteRequest.status < 300)) {
    evidence.boundary = {
      scenario: 'Real pricing quote',
      result: 'FAIL',
      endpoint: quoteRequest?.endpoint,
      status: quoteRequest?.status,
      message: quoteRequest?.result,
      uiMessage: alert,
    }
    console.log(JSON.stringify(evidence.boundary))
    process.exitCode = 1
  } else {
    pass('Real quote generated', { ...evidence.quote })
  }
  await save()
} catch (error) {
  evidence.failure = error.message
  console.error(error.message)
  await save()
  process.exitCode = 1
} finally {
  await Promise.all(bodyJobs)
  await save()
  await send('Page.close').catch(() => {})
  socket.close()
}
