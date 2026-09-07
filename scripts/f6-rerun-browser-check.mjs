// Isolated B2 DTO/UI validation. API responses below are explicit test fixtures,
// intercepted only in a disposable Chrome target. NOT live auth/provider evidence.
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import { recoveredPayment, paymentEligible } from '../src/features/payment/recovery.js'
const require = createRequire(import.meta.url)
const { customerPaymentSummary } = require('../../rentcar-backend/src/modules/payments/recovery.js')
const root = 'http://localhost:5173'
// Match the app's Vite-resolved imports, including HMR timestamps. Importing a
// bare path after HMR would inspect a different module singleton/cache.
const sessionSource = await fetch(root + '/src/services/api/customerSession.js').then((r) =>
  r.text()
)
const sessionModules = [...sessionSource.matchAll(/from "([^"]+)"/g)].map((match) => match[1])
const sessionImport = (name) =>
  `import(${JSON.stringify(sessionModules.find((url) => url.includes('/' + name + '.js')))})`
const memoryImports = ['queryClient', 'quoteSession', 'bookingAttemptSession', 'authSession']
  .map(sessionImport)
  .join(',')
const id = '11111111-1111-4111-8111-111111111111'
const paymentId = '22222222-2222-4222-8222-222222222222'
const staleId = '33333333-3333-4333-8333-333333333333'
const userA = {
  id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  name: 'ISOLATED USER A',
  email: 'isolated-a@example.test',
  phone: null,
}
const userB = {
  id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  name: 'ISOLATED USER B',
  email: 'isolated-b@example.test',
  phone: null,
}
let user = userA
let signedIn = true
let state = 'review_required'
let orders = 0
let rejectOrder = false
let paymentReadError = false
const requests = []
const failures = []
const base = {
  id,
  bookingNumber: 'ISOLATED-BOOKING-A',
  carId: '44444444-4444-4444-8444-444444444444',
  status: 'PAYMENT_PENDING',
  paymentStatus: 'pending',
  totalAmount: '100.25',
  subtotal: '100.25',
  securityDeposit: '0.00',
  currencyCode: 'INR',
  startAt: new Date(Date.now() + 86400000).toISOString(),
  endAt: new Date(Date.now() + 2 * 86400000).toISOString(),
  holdExpiresAt: new Date(Date.now() + 3600000).toISOString(),
  createdAt: new Date().toISOString(),
}
function payment() {
  if (['null', 'cancelled-null', 'confirmed-null', 'expired-null'].includes(state)) return null
  const captured = [
    'normal',
    'unconfirmed-normal',
    'review_required',
    'late_payment_conflict',
  ].includes(state)
  return {
    id: paymentId,
    bookingId: id,
    status: captured ? 'succeeded' : state,
    operationalStatus: ['review_required', 'late_payment_conflict'].includes(state)
      ? state
      : 'normal',
    amount: '100.25',
    currencyCode: 'INR',
    createdAt: base.createdAt,
    updatedAt: base.createdAt,
  }
}
function booking() {
  const b = { ...base, payment: customerPaymentSummary(payment()) }
  if (['normal', 'confirmed-null'].includes(state)) {
    b.status = 'CONFIRMED'
    b.paymentStatus = 'succeeded'
  }
  if (state === 'cancelled-null') b.status = 'CANCELLED'
  if (state === 'expired-null') b.status = 'EXPIRED'
  return b
}
for (const value of [
  'normal',
  'unconfirmed-normal',
  'review_required',
  'late_payment_conflict',
  'processing',
  'pending',
  'failed',
  'null',
  'cancelled-null',
  'confirmed-null',
  'expired-null',
]) {
  state = value
  assert.equal(
    paymentEligible(booking(), recoveredPayment(booking(), payment()), Date.now()),
    ['pending', 'failed', 'null'].includes(value),
    value
  )
}
state = 'review_required'
assert.equal(
  recoveredPayment(booking(), { ...payment(), id: staleId, status: 'pending' }).status,
  'succeeded'
)
assert.equal(
  recoveredPayment(booking(), { ...payment(), status: 'pending', operationalStatus: 'normal' })
    .operationalStatus,
  'review_required'
)
const target = await fetch('http://localhost:9223/json/new?about:blank', { method: 'PUT' }).then(
  (r) => r.json()
)
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }))
let sequence = 0
const waiting = new Map()
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const requestId = ++sequence
    const timer = setTimeout(() => {
      waiting.delete(requestId)
      reject(new Error(method + ' timed out'))
    }, 20000)
    waiting.set(requestId, { resolve, reject, timer })
    socket.send(JSON.stringify({ id: requestId, method, params }))
  })
}
socket.addEventListener('message', (event) => {
  const value = JSON.parse(event.data)
  if (value.id && waiting.has(value.id)) {
    const task = waiting.get(value.id)
    clearTimeout(task.timer)
    waiting.delete(value.id)
    value.error ? task.reject(new Error(value.error.message)) : task.resolve(value.result)
  }
  if (value.method === 'Fetch.requestPaused')
    intercept(value.params).catch((error) => failures.push(error.message))
  if (value.method === 'Runtime.exceptionThrown') failures.push(value.params.exceptionDetails.text)
})
async function intercept({ requestId, request }) {
  const path = new URL(request.url).pathname.replace('/api/v1', '')
  requests.push({ path, method: request.method })
  let status = 200,
    data = {},
    meta,
    message = 'Isolated response'
  if (request.method === 'OPTIONS') status = 204
  else if (path === '/auth/logout') {
    signedIn = false
  } else if (path === '/auth/login') {
    signedIn = true
    data = {
      user,
      accessToken: `test.${Buffer.from(JSON.stringify({ sub: user.id })).toString('base64url')}.isolated`,
    }
  } else if (path.startsWith('/auth/')) {
    if (!signedIn) status = 401
    else data = { user }
  } else if (path === '/users/me') data = { user }
  else if (path === '/profiles/me')
    data = {
      profile: {
        dateOfBirth: null,
        gender: null,
        bio: user === userA ? 'ISOLATED A BIO' : 'ISOLATED B BIO',
      },
    }
  else if (path === '/kyc/status') data = { verificationStatus: 'unverified', documentCount: 0 }
  else if (path === '/kyc/documents') data = []
  else if (path === '/addresses') data = { addresses: [] }
  else if (path === '/bookings/me') {
    data = user === userA ? [booking()] : []
    meta = { page: 1, limit: 10, total: data.length, totalPages: data.length ? 1 : 0 }
  } else if (path === `/bookings/${id}`) data = booking()
  else if (path === `/bookings/${id}/refunds`) data = []
  else if (path === `/bookings/${id}/invoice`) {
    status = 404
    message = 'Invoice not issued'
  } else if (path === '/payments/orders') {
    orders++
    if (rejectOrder) {
      state = 'review_required'
      status = 409
      message = 'Payment has already been captured for this booking.'
    } else {
      status = 500
      message = 'Unexpected order attempt in isolated read check'
    }
  } else if (path === `/payments/${paymentId}`) {
    data = payment()
    if (paymentReadError) {
      status = 503
      message = 'Temporary test interruption'
    }
  } else if (path === `/payments/${staleId}`) {
    status = 404
    failures.push('Stale local payment was requested')
  } else if (path.startsWith('/cars/') || path.startsWith('/locations/')) data = []
  else {
    status = 404
    message = 'Isolated route unavailable'
  }
  await send('Fetch.fulfillRequest', {
    requestId,
    responseCode: status,
    responseHeaders: [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'Access-Control-Allow-Origin', value: root },
      { name: 'Access-Control-Allow-Credentials', value: 'true' },
      { name: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization,Idempotency-Key' },
    ],
    body: Buffer.from(JSON.stringify({ success: status < 400, data, meta, message })).toString(
      'base64'
    ),
  })
}
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
async function evaluate(expression) {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails)
    throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text)
  return r.result.value
}
async function until(expression) {
  for (let i = 0; i < 80; i++) {
    if (await evaluate(expression)) return
    await pause(200)
  }
  throw new Error('Timed out: ' + expression)
}
async function navigate(route) {
  await send('Page.navigate', { url: root + route })
  await until(
    `Boolean(document.querySelector('h1'))&&!document.body.innerText.includes('Loading…')`
  )
  await pause(500)
}
const body = () => evaluate('document.body.innerText')
const hasPay = () =>
  evaluate(
    `[...document.querySelectorAll('button')].some(b=>/Pay Now|Reopen Payment/.test(b.innerText))`
  )
const statusRoute = `/booking/status/${id}`
const checks = []
try {
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Fetch.enable', {
    patterns: [{ urlPattern: 'http://localhost:5000/api/v1/*', requestStage: 'Request' }],
  })
  await navigate(statusRoute)
  for (const scenario of [
    'review_required',
    'late_payment_conflict',
    'normal',
    'unconfirmed-normal',
    'processing',
    'failed',
    'pending',
    'null',
    'confirmed-null',
    'cancelled-null',
    'expired-null',
  ]) {
    state = scenario
    await evaluate('sessionStorage.clear()')
    await navigate(statusRoute)
    if (payment()) await until(`document.body.innerText.includes('Payment-order amount')`)
    if (['failed', 'pending', 'null'].includes(scenario))
      await until(
        `[...document.querySelectorAll('button')].some(b=>/Pay Now|Reopen Payment/.test(b.innerText))`
      )
    assert.equal(
      await hasPay(),
      ['failed', 'pending', 'null'].includes(scenario),
      scenario + ' CTA'
    )
    const copy = await body()
    if (scenario === 'review_required')
      assert.match(copy, /received and is under review.*Do not make another payment/s)
    if (scenario === 'late_payment_conflict')
      assert.match(copy, /received.*could not be confirmed automatically.*Support review/s)
    assert.equal(
      copy.includes('Your booking is confirmed.'),
      ['normal', 'confirmed-null'].includes(scenario),
      scenario + ' confirmation authority'
    )
    checks.push('isolated recovery ' + scenario)
  }
  state = 'review_required'
  await evaluate(
    `sessionStorage.setItem('rentcar_booking_recovery',JSON.stringify({bookingId:'${id}',userId:'${userA.id}',paymentId:'${staleId}'}))`
  )
  const since = requests.length
  await navigate(statusRoute)
  await until(
    `JSON.parse(sessionStorage.getItem('rentcar_booking_recovery')).paymentId==='${paymentId}'`
  )
  assert.equal(
    requests.slice(since).some((r) => r.path === `/payments/${staleId}`),
    false
  )
  checks.push('stale local A replaced by backend B without fetching A')
  state = 'null'
  await navigate(statusRoute)
  assert.equal(
    await evaluate(`JSON.parse(sessionStorage.getItem('rentcar_booking_recovery')).paymentId`),
    null
  )
  checks.push('explicit null removes stale local association')
  rejectOrder = true
  await evaluate(
    `[...document.querySelectorAll('button')].find(b=>b.innerText.includes('Pay Now')).click()`
  )
  await until(`document.body.innerText.includes('received and is under review')`)
  assert.equal(await hasPay(), false)
  assert.equal(orders, 1)
  assert.equal((await body()).includes('payment attempt failed'), false)
  rejectOrder = false
  checks.push('order 409 refetches B2/payment; no generic failure or second CTA')
  paymentReadError = true
  await navigate(statusRoute)
  assert.equal(await hasPay(), false)
  assert.match(await body(), /received and is under review/)
  paymentReadError = false
  checks.push('summary keeps captured guard through payment GET failure')
  const responsive = []
  await fs.mkdir('.f6-check', { recursive: true })
  const routes = [
    statusRoute,
    '/account/bookings',
    `/account/bookings/${id}`,
    '/account/profile',
    '/account/addresses',
    '/account/kyc',
  ]
  for (const width of [320, 375, 768, 1024, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    })
    for (const route of routes) {
      await navigate(route)
      const sample = await evaluate(
        `({scrollWidth:document.documentElement.scrollWidth,width:innerWidth,h1:!!document.querySelector('h1'),unnamed:[...document.querySelectorAll('button')].filter(b=>!b.innerText.trim()&&!b.getAttribute('aria-label')&&!b.getAttribute('title')).length})`
      )
      assert.ok(sample.scrollWidth <= sample.width, route + ' overflow ' + width)
      assert.equal(sample.unnamed, 0, route + ' button names')
      responsive.push({ route, width, ...sample })
      if (width === 375) {
        const shot = await send('Page.captureScreenshot', {
          format: 'png',
          captureBeyondViewport: true,
        })
        await fs.writeFile(
          `.f6-check/rerun-${route.split('/').slice(-1)[0]}-375.png`,
          Buffer.from(shot.data, 'base64')
        )
      }
    }
    console.log('Isolated account UI checked at ' + width + 'px')
  }
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await navigate('/account/addresses')
  await evaluate(
    `[...document.querySelectorAll('button')].find(b=>b.innerText==='Add address').focus();document.activeElement.click()`
  )
  await until(`!!document.querySelector('[role="dialog"]')`)
  assert.ok(await evaluate(`!!document.querySelector('[role="dialog"][aria-labelledby]')`))
  await send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27,
  })
  await send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27,
  })
  await pause(500)
  assert.equal(await evaluate('document.activeElement.innerText'), 'Add address')
  checks.push('address dialog label/Escape/focus restoration')
  await navigate('/account/kyc')
  await evaluate(
    `[...document.querySelectorAll('button')].find(b=>b.innerText.startsWith('Upload')).click()`
  )
  await until(`!!document.querySelector('input[type="file"]')`)
  assert.ok(
    await evaluate(
      `!!document.querySelector('[role="dialog"][aria-labelledby]')&&document.querySelector('input[type="file"]').accept.includes('pdf')`
    )
  )
  checks.push('KYC labelled upload dialog/file control; no document submitted')
  // Seed only isolated memory to exercise the real logout cleanup implementation.
  await navigate('/account/profile')
  await evaluate(
    `Promise.all([${memoryImports}]).then(([q,s,a])=>{q.queryClient.setQueryData(['refunds','isolated'],{owner:'ISOLATED USER A'});q.queryClient.setQueryData(['invoices','isolated'],{owner:'ISOLATED USER A'});s.default.set({quoteToken:'ISOLATED-NOT-A-REAL-QUOTE'});a.default.getOrCreateKey('isolated-a');})`
  )
  await evaluate(`document.querySelector('[aria-label="Open account navigation"]').click()`)
  await until(
    `[...document.querySelectorAll('button')].some(b=>b.innerText==='Sign out'&&b.getBoundingClientRect().width)`
  )
  await evaluate(
    `[...document.querySelectorAll('button')].find(b=>b.innerText==='Sign out'&&b.getBoundingClientRect().width).click()`
  )
  await until(`location.pathname==='/'||location.pathname==='/login'`)
  await until(`document.body.innerText.includes('Sign In')||location.pathname==='/'`)
  const cleanup = await evaluate(
    `Promise.all([${memoryImports}]).then(([q,s,a,t])=>({customerQueries:q.queryClient.getQueryCache().getAll().filter(x=>['profile','addresses','kyc','bookings','payments','refunds','invoices'].includes(x.queryKey[0])&&x.state.data!==undefined).length,quote:s.default.get(),recovery:a.default.getRecovery(),attempt:sessionStorage.getItem('rentcar_booking_attempt'),token:t.default.getAccessToken()}))`
  )
  assert.deepEqual(cleanup, {
    customerQueries: 0,
    quote: null,
    recovery: null,
    attempt: null,
    token: null,
  })
  checks.push('real logout code clears isolated customer caches/token/quote/recovery/attempt')
  await navigate('/account/profile')
  await until(`location.pathname==='/login'`)
  user = userB
  await evaluate(
    `window.isolatedStaleFlash=false;window.isolatedObserver=new MutationObserver(()=>{if(document.body.innerText.includes('ISOLATED USER A')||document.body.innerText.includes('ISOLATED A BIO'))window.isolatedStaleFlash=true});window.isolatedObserver.observe(document.body,{childList:true,subtree:true,characterData:true})`
  )
  await evaluate(
    `(()=>{const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;for(const [name,value] of [['email','isolated-b@example.test'],['password','Isolated-test-password']]){const input=document.querySelector('input[name="'+name+'"]');set.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));}document.querySelector('form').requestSubmit();})()`
  )
  await until(
    `location.pathname==='/account/profile'&&document.body.innerText.includes('ISOLATED USER B')`
  )
  assert.equal((await body()).includes('ISOLATED USER A'), false)
  assert.equal((await body()).includes('ISOLATED A BIO'), false)
  assert.equal(await evaluate('window.isolatedStaleFlash'), false)
  await evaluate('window.isolatedObserver.disconnect()')
  checks.push('controlled A logout -> B login; intended-route return; no A data')
  // Exercise the actual login return to the payment URL, with no local recovery.
  await evaluate(`document.querySelector('[aria-label="Open account navigation"]').click()`)
  await until(
    `[...document.querySelectorAll('button')].some(b=>b.innerText==='Sign out'&&b.getBoundingClientRect().width)`
  )
  await evaluate(
    `[...document.querySelectorAll('button')].find(b=>b.innerText==='Sign out'&&b.getBoundingClientRect().width).click()`
  )
  await until(`location.pathname==='/'||location.pathname==='/login'`)
  user = userA
  await navigate(statusRoute)
  await until(`location.pathname==='/login'&&!!document.querySelector('input[name="email"]')`)
  await evaluate(
    `(()=>{const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;for(const [name,value] of [['email','isolated-a@example.test'],['password','Isolated-test-password']]){const input=document.querySelector('input[name="'+name+'"]');set.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));}document.querySelector('form').requestSubmit();})()`
  )
  await until(
    `location.pathname==='${statusRoute}'&&document.body.innerText.includes('received and is under review')`
  )
  assert.equal(await hasPay(), false)
  checks.push('login returns directly to booking status and recovers review without local payment')
  await send('Page.reload', { ignoreCache: true })
  await until(`document.body.innerText.includes('received and is under review')`)
  assert.equal(await hasPay(), false)
  checks.push('browser reload preserves authoritative captured recovery')
  assert.equal(orders, 1, 'No automatic checkout/order on route load')
  assert.deepEqual(failures, [])
  await fs.writeFile(
    '.f6-check/rerun-isolated-results.json',
    JSON.stringify(
      {
        scope: 'ISOLATED DTO/UI ONLY; NOT LIVE AUTH/PROVIDER/PERSISTENCE',
        checks,
        responsive,
        orders,
        failures,
      },
      null,
      2
    )
  )
  console.log(
    JSON.stringify({
      scope: 'isolated DTO/UI only',
      checks: checks.length,
      responsive: responsive.length,
      orders,
      failures,
    })
  )
} catch (error) {
  console.log(
    JSON.stringify({
      location: await evaluate('location.pathname'),
      body: await body(),
      recent: requests.slice(-15),
      failures,
    })
  )
  throw error
} finally {
  await send('Page.close').catch(() => {})
  socket.close()
}
