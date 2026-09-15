// Isolated UI regression checks. All API traffic in this test tab is intercepted.
// Fixtures are test-only and never used by the application or sent to a backend.
// Start an isolated headless Chromium with --remote-debugging-port=9223 first.
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'

const origin = process.env.UI_CHECK_ORIGIN || 'http://127.0.0.1:5173'
const target = await fetch('http://localhost:9223/json/new?about:blank', { method: 'PUT' }).then(
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

const carId = '00000000-0000-4000-8000-000000000101'
const bookingId = '00000000-0000-4000-8000-000000000102'
const branchId = '00000000-0000-4000-8000-000000000103'
const user = {
  id: '00000000-0000-4000-8000-000000000104',
  name: 'UI Test Customer',
  email: 'ui@example.test',
  phone: '+919876543210',
  role: 'customer',
}
const pickup = new Date(Date.now() + 7 * 86400000).toISOString()
const dropoff = new Date(Date.now() + 8 * 86400000).toISOString()
const trip = new URLSearchParams({ pickup, return: dropoff, branchId })
const car = {
  id: carId,
  brand: 'Test',
  model: 'Rental vehicle',
  manufacturingYear: 2025,
  transmission: 'automatic',
  fuelType: 'petrol',
  seatingCapacity: 5,
  pricing: { dailyPrice: 2200, currencyCode: 'INR' },
  images: [
    {
      id: 'one',
      imageUrl: `${origin}/placeholder-car.svg`,
      altText: 'Test vehicle front',
      isPrimary: true,
    },
    { id: 'two', imageUrl: `${origin}/placeholder-car.svg?second`, altText: 'Test vehicle side' },
  ],
  features: [{ id: 'ac', name: 'Air conditioning' }],
  branch: { id: branchId, name: 'Test pickup branch', address: 'Test pickup address' },
}
let signedIn = false
let confirmed = false
let quoteFailure = false
let expiredQuote = false
let total = 3200
const writes = []
const runtimeErrors = []
const booking = () => ({
  id: bookingId,
  bookingNumber: 'UI-TEST-102',
  carId,
  car: { brand: car.brand, model: car.model, primaryImage: car.images[0], branch: car.branch },
  startAt: pickup,
  endAt: dropoff,
  createdAt: new Date().toISOString(),
  totalAmount: total,
  subtotal: total - 1000,
  securityDeposit: 1000,
  currencyCode: 'INR',
  status: confirmed ? 'CONFIRMED' : 'PAYMENT_PENDING',
  paymentStatus: confirmed ? 'succeeded' : 'pending',
  holdExpiresAt: new Date(Date.now() + 600000).toISOString(),
  payment: null,
})
await send('Page.addScriptToEvaluateOnNewDocument', {
  source: "sessionStorage.setItem('rentcar_signed_out','true')",
})
await send('Fetch.enable', { patterns: [{ urlPattern: '*://*/api/v1/*' }] })
socket.addEventListener('message', async (event) => {
  const value = JSON.parse(event.data)
  if (value.method === 'Runtime.exceptionThrown')
    runtimeErrors.push(value.params.exceptionDetails.text)
  if (value.method !== 'Fetch.requestPaused') return
  const { requestId, request } = value.params
  const path = new URL(request.url).pathname.replace('/api/v1', '')
  let status = 200
  let data = null
  let body
  if (request.method === 'OPTIONS') body = {}
  else if (path === '/auth/login') {
    signedIn = true
    data = {
      accessToken: `test.${Buffer.from(JSON.stringify({ sub: user.id })).toString('base64url')}.test`,
      user,
    }
  } else if (path === '/auth/me' || path === '/users/me') {
    status = signedIn ? 200 : 401
    data = { user }
  } else if (path === '/locations/branches')
    data = [{ id: branchId, name: 'Test pickup branch', city: 'Test city' }]
  else if (path === '/locations/cities') data = [{ id: branchId, name: 'Test city' }]
  else if (path === '/cars/featured' || path === '/cars/search' || path === '/availability/search')
    data = [car]
  else if (path === `/cars/${carId}`) data = car
  else if (path === '/pricing/quote') {
    status = quoteFailure ? 409 : 200
    data = {
      quoteId: 'test-quote',
      quoteToken: 'test-token',
      carId,
      pickupDateTime: pickup,
      returnDateTime: dropoff,
      currencyCode: 'INR',
      duration: { breakdown: [{ count: 1, unit: 'day', amount: total - 1000 }] },
      pricing: { rentalSubtotal: total - 1000, securityDeposit: 1000, payableAmount: total },
      expiresAt: new Date(Date.now() + (expiredQuote ? -1000 : 300000)).toISOString(),
    }
  } else if (path === '/bookings' && request.method === 'POST') {
    writes.push(request)
    data = booking()
  } else if (path === '/bookings/me') data = [booking()]
  else if (path === `/bookings/${bookingId}`) data = booking()
  else if (path.endsWith('/refunds')) data = []
  else if (path.endsWith('/invoice')) status = 404
  else if (path === '/kyc/status') data = { verificationStatus: 'not_submitted' }
  else if (path === '/kyc/documents') data = []
  else status = 404
  body ??= {
    data,
    meta: { page: 1, limit: 12, total: 1, totalPages: 1 },
    ...(status >= 400
      ? {
          message:
            quoteFailure && path === '/pricing/quote'
              ? 'This vehicle is no longer available for your dates.'
              : 'Test resource unavailable',
        }
      : {}),
  }
  await send('Fetch.fulfillRequest', {
    requestId,
    responseCode: status,
    responseHeaders: [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'Access-Control-Allow-Origin', value: origin },
      { name: 'Access-Control-Allow-Credentials', value: 'true' },
      {
        name: 'Access-Control-Allow-Headers',
        value: 'Content-Type, Authorization, Idempotency-Key, Accept',
      },
      { name: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
    ],
    body: Buffer.from(JSON.stringify(body)).toString('base64'),
  })
})
const click = (label) =>
  evaluate(
    `[...document.querySelectorAll('button')].find(b => b.innerText === ${JSON.stringify(label)})?.click()`
  )
const dimensions = async (label) => {
  const result = await evaluate(
    `({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})`
  )
  assert.ok(result.scrollWidth <= result.width, `${label} overflow: ${JSON.stringify(result)}`)
}
const screenshot = async (name) => {
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
  await fs.writeFile(`.f6-check/${name}.png`, Buffer.from(shot.data, 'base64'))
}
await fs.mkdir('.f6-check', { recursive: true })
try {
  for (const width of [390, 768, 1024, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 950,
      deviceScaleFactor: 1,
      mobile: false,
    })
    for (const route of ['/', `/search?${trip}`, `/cars/${carId}?${trip}`]) {
      await send('Page.navigate', { url: origin + route })
      await waitFor(
        `Boolean(document.querySelector('h1')) && (document.body.innerText.includes('View Details') || document.body.innerText.includes('Get Quote'))`
      )
      await pause(400)
      await dimensions(route)
      await screenshot(
        `fixture-${route.startsWith('/cars') ? 'details' : route.startsWith('/search') ? 'search' : 'home'}-${width}`
      )
    }
    console.log('Fixture UI: Home, Search and Details fit ' + width + 'px')
  }
  await click('View photos')
  await waitFor(`Boolean(document.querySelector('[role="dialog"]'))`)
  await evaluate(`document.querySelector('[aria-label="Next photo"]').click()`)
  await send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'ArrowRight',
    code: 'ArrowRight',
    windowsVirtualKeyCode: 39,
  })
  assert.equal(
    await evaluate(
      `document.querySelector('[aria-label="View photo 1"]').getAttribute('aria-pressed')`
    ),
    'true'
  )
  await click('Zoom in')
  assert.equal(
    await evaluate(
      `[...document.querySelectorAll('button')].some(b=>b.innerText==='Fit photo' && b.getAttribute('aria-pressed')==='true')`
    ),
    true
  )
  await evaluate(`document.querySelector('[aria-label="Close gallery"]').click()`)
  await waitFor(`!document.querySelector('[role="dialog"]')`)
  expiredQuote = true
  await click('Get Quote')
  await waitFor(`document.body.innerText.includes('This quote has expired')`)
  assert.equal(await evaluate(`document.body.innerText.includes('Sign In to Continue')`), false)
  expiredQuote = false
  await click('Get Fresh Quote')
  await waitFor(`document.body.innerText.includes('Sign In to Continue')`)
  await waitFor(`document.body.innerText.includes('Total payable')`)
  total = 3400
  await click('Refresh Quote')
  await waitFor(`document.body.innerText.includes('Your trip price has changed')`)
  await click('Sign In to Continue')
  await waitFor(
    `location.pathname==='/login' && document.body.innerText.includes('Your trip is saved')`
  )
  assert.ok(await evaluate(`document.body.innerText.includes('Request a fresh quote')`))
  await evaluate(
    `(() => { const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; for(const [name,value] of [['email','ui@example.test'],['password','TestPassword123!']]) { const el=document.querySelector('input[name="'+name+'"]'); setter.call(el,value); el.dispatchEvent(new Event('input',{bubbles:true})); } })()`
  )
  await click('Sign In')
  await waitFor(
    `location.pathname==='/cars/${carId}' && document.body.innerText.includes('Get Quote')`
  )
  assert.equal(await evaluate(`new URLSearchParams(location.search).get('pickup')`), pickup)
  assert.equal(await evaluate(`document.body.innerText.includes('Total payable')`), false)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 950,
    deviceScaleFactor: 1,
    mobile: false,
  })
  quoteFailure = true
  await click('Get Quote')
  await waitFor(`document.body.innerText.includes('This vehicle is no longer available')`)
  quoteFailure = false
  await click('Get Quote')
  await waitFor(`document.body.innerText.includes('Reserve & Continue to Payment')`)
  await screenshot('fixture-quote-390')
  await click('Reserve Car')
  await waitFor(
    `location.pathname==='/booking/status/${bookingId}' && document.body.innerText.includes('Booking total')`
  )
  assert.equal(writes.length, 1)
  assert.deepEqual(JSON.parse(writes[0].postData), { quoteToken: 'test-token' })
  assert.ok(
    Object.entries(writes[0].headers).some(
      ([key, value]) => key.toLowerCase() === 'idempotency-key' && value
    )
  )
  for (const width of [390, 768, 1024, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 950,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await pause(250)
    await dimensions('Booking status')
    await screenshot(`fixture-payment-${width}`)
  }
  confirmed = true
  await click('Refresh Status')
  await waitFor(`document.body.innerText.includes('Your booking is confirmed')`)
  await waitFor(`document.body.innerText.includes('Your invoice has not been issued yet')`)
  await click('View Booking Details')
  await waitFor(`document.body.innerText.includes('Your trip at a glance')`)
  await dimensions('Booking details')
  await click('My Bookings')
  await waitFor(`document.body.innerText.includes('Booking history')`)
  for (const width of [390, 768, 1024, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 950,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await pause(300)
    await dimensions('My Bookings')
  }
  await send('Page.navigate', { url: origin + '/' })
  await waitFor(`document.body.innerText.includes('Where will your next journey take you?')`)
  await evaluate(`document.querySelector('[aria-label="toggle theme"]').click()`)
  for (const width of [390, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 950,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await pause(300)
    await dimensions('Dark Home')
    await screenshot(`fixture-dark-home-${width}`)
  }
  await evaluate(
    `[...document.querySelectorAll('a')].find(a=>a.innerText==='How it works').click()`
  )
  await waitFor(
    `Math.abs(document.getElementById('how-it-works').getBoundingClientRect().top) < 130`
  )
  assert.deepEqual(runtimeErrors, [])
  console.log(
    'PASS: gallery navigation/zoom; quote refresh/price change; login trip resume/fresh quote; inline unavailable error/retry; one reservation with quote token and idempotency header; payment/confirmation/invoice-pending; account navigation. No real payment attempted.'
  )
} catch (error) {
  console.error(await evaluate('document.body.innerText'))
  throw error
} finally {
  await send('Page.close').catch(() => {})
  socket.close()
}
