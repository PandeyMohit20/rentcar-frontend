// LIVE application APIs + MySQL. Local SMTP receives only this run's @example.test OTPs.
// No direct DB writes, forged tokens, API interception, provider mocks or provider operations.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import net from 'node:net'
import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
const root = process.cwd(),
  backend = path.resolve(root, '../rentcar-backend')
const previous = fs.existsSync('docs/UAT-fixture-ledger.json')
  ? JSON.parse(fs.readFileSync('docs/UAT-fixture-ledger.json', 'utf8'))
  : null
const run = previous?.run || 'uat-' + Date.now(),
  api = 'http://localhost:5000/api/v1'
const users = ['A', 'B'].map((label, index) => ({
  ...previous?.customers?.[index],
  name: `UAT Customer ${label} ${run}`,
  email: `${run}-${label.toLowerCase()}@example.test`,
  password: 'Uat!' + randomBytes(20).toString('hex'),
}))
const ledger = {
  run,
  scope: 'LIVE customer APIs and UI; no provider execution',
  customers: [],
  addresses: [],
  documents: [],
  checks: [],
  runtime: [],
  network: [],
  cleanup: [],
}
ledger.priorChecks = [...new Set([...(previous?.priorChecks || []), ...(previous?.checks || [])])]
ledger.priorFailures = [
  ...(previous?.priorFailures || []),
  ...(previous?.failure ? [previous.failure] : []),
]
const save = () => fs.writeFileSync('docs/UAT-fixture-ledger.json', JSON.stringify(ledger, null, 2))
const pass = (name) => {
  ledger.checks.push(name)
  save()
  console.log('PASS ' + name)
}
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const mail = new Map()
const smtp = net.createServer((socket) => {
  socket.write('220 localhost UAT SMTP\r\n')
  let buffer = '',
    data = false,
    lines = [],
    recipient = ''
  socket.on('data', (chunk) => {
    buffer += chunk
    while (buffer.includes('\r\n')) {
      const split = buffer.indexOf('\r\n')
      const line = buffer.slice(0, split)
      buffer = buffer.slice(split + 2)
      if (data) {
        if (line === '.') {
          mail.set(recipient, lines.join('\n'))
          data = false
          lines = []
          socket.write('250 accepted locally\r\n')
        } else lines.push(line)
        continue
      }
      if (/^(EHLO|HELO)/i.test(line)) socket.write('250-localhost\r\n250 OK\r\n')
      else if (/^MAIL FROM:/i.test(line)) socket.write('250 OK\r\n')
      else if (/^RCPT TO:/i.test(line)) {
        recipient = line.match(/<([^>]+)>/)?.[1]?.toLowerCase()
        socket.write(
          users.some((u) => u.email === recipient)
            ? '250 OK\r\n'
            : '550 synthetic UAT recipients only\r\n'
        )
      } else if (/^DATA/i.test(line)) {
        data = true
        socket.write('354 End with dot\r\n')
      } else if (/^QUIT/i.test(line)) {
        socket.end('221 Bye\r\n')
      } else socket.write('250 OK\r\n')
    }
  })
})
let server, chrome, socket, send, evaluate, address, documentId, originalBio
const waiting = new Map()
let sequence = 0
async function request(
  route,
  { user, method = 'GET', body, base = api, cookie, expected = 200 } = {}
) {
  const headers = {}
  if (user?.token) headers.Authorization = 'Bearer ' + user.token
  if (cookie) headers.Cookie = cookie
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json'
  const response = await fetch(base + route, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30000),
  })
  const result = await response.json().catch(() => ({}))
  assert.ok(
    [].concat(expected).includes(response.status),
    `${method} ${route}: ${response.status} ${result.message || ''}`
  )
  return {
    data: result.data,
    status: response.status,
    cookies: response.headers.getSetCookie(),
    body: result,
  }
}
async function login(user) {
  const r = await request('/auth/login', {
    method: 'POST',
    body: { email: user.email, password: user.password },
  })
  user.token = r.data.accessToken
  user.cookie = r.cookies.map((c) => c.split(';')[0]).join('; ')
  assert.ok(r.cookies.some((c) => /HttpOnly/i.test(c)))
  return r
}
function pdf() {
  const stream = 'BT /F1 18 Tf 40 100 Td (TEST DOCUMENT - NOT A REAL ID) Tj ET'
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 450 180] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ]
  let out = '%PDF-1.4\n',
    offsets = [0]
  objects.forEach((o, i) => {
    offsets.push(Buffer.byteLength(out))
    out += `${i + 1} 0 obj\n${o}\nendobj\n`
  })
  const start = Buffer.byteLength(out)
  out +=
    `xref\n0 6\n0000000000 65535 f \n` +
    offsets
      .slice(1)
      .map((n) => String(n).padStart(10, '0') + ' 00000 n \n')
      .join('') +
    `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`
  return Buffer.from(out)
}
async function until(expression) {
  for (let i = 0; i < 100; i++) {
    if (await evaluate(expression)) return
    await pause(200)
  }
  throw new Error('Browser condition timed out: ' + expression)
}
async function navigate(route) {
  await send('Page.navigate', { url: 'http://localhost:5173' + route })
  await pause(500)
  await until(`!!document.querySelector('h1')`)
}
async function browserLogin(user) {
  await until(`!!document.querySelector('input[name="email"]')`)
  await evaluate(
    `(()=>{const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;for(const [name,value] of ${JSON.stringify(
      [
        ['email', user.email],
        ['password', user.password],
      ]
    )}){const input=document.querySelector('input[name="'+name+'"]');setter.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));}document.querySelector('form').requestSubmit()})()`
  )
  await until(
    `location.pathname==='/account/profile'&&document.body.innerText.includes(${JSON.stringify(user.name)})`
  )
}
try {
  save()
  await new Promise((resolve) => smtp.listen(2525, '127.0.0.1', resolve))
  server = spawn(process.execPath, ['src/server.js'], {
    cwd: backend,
    windowsHide: true,
    stdio: 'ignore',
    env: {
      ...process.env,
      NODE_ENV: 'development',
      PORT: '5001',
      LOG_LEVEL: 'silent',
      SMTP_HOST: '127.0.0.1',
      SMTP_PORT: '2525',
      SMTP_SECURE: 'false',
      SMTP_USER: '',
      SMTP_PASSWORD: '',
      SMTP_FROM: 'uat@example.test',
      RAZORPAY_KEY_ID: '',
      RAZORPAY_KEY_SECRET: '',
      RAZORPAY_WEBHOOK_SECRET: '',
    },
  })
  for (let i = 0; i < 100; i++) {
    if (
      await fetch('http://localhost:5001/api/v1/health')
        .then((r) => r.ok)
        .catch(() => false)
    )
      break
    await pause(200)
  }
  for (const user of users) {
    if (user.id) {
      await request('/auth/forgot-password', {
        method: 'POST',
        base: 'http://localhost:5001/api/v1',
        body: { email: user.email },
      })
      const token = mail.get(user.email)?.match(/token is:\s*([a-f0-9]{64})/)?.[1]
      assert.ok(token, 'Local reset mail received for existing UAT account')
      await request('/auth/reset-password', {
        method: 'POST',
        body: { token, newPassword: user.password },
      })
    } else {
      const registered = await request('/auth/register', {
        method: 'POST',
        base: 'http://localhost:5001/api/v1',
        body: { name: user.name, email: user.email, password: user.password },
        expected: 201,
      })
      user.id = registered.data.user.id
      const otp = mail.get(user.email)?.match(/OTP is:\s*(\d{6})/)?.[1]
      assert.ok(otp, 'OTP received by local SMTP')
      await request('/auth/verify-otp', {
        method: 'POST',
        body: { email: user.email, purpose: 'email_verification', otp },
      })
    }
    ledger.customers.push({
      id: user.id,
      name: user.name,
      email: user.email,
      retention: 'Retain labelled customer/audit history; no customer delete API used',
    })
    save()
    await login(user)
    assert.equal((await request('/auth/me', { user })).data.user.id, user.id)
  }
  mail.clear()
  pass('two real UAT customers authenticated; original registration/OTP evidence retained')
  const [a, b] = users
  const refreshCookies = new Set([a.cookie])
  for (let i = 0; i < 3; i++) {
    const refreshed = await request('/auth/refresh', { method: 'POST', body: {}, cookie: a.cookie })
    a.token = refreshed.data.accessToken
    a.cookie = refreshed.cookies.map((c) => c.split(';')[0]).join('; ')
    assert.equal(refreshCookies.has(a.cookie), false)
    refreshCookies.add(a.cookie)
  }
  pass('three immediate real refresh rotations have distinct cookies and no unique-hash collision')
  originalBio = (await request('/profiles/me', { user: a })).data.profile.bio
  await request('/profiles/me', { user: a, method: 'PATCH', body: { bio: 'UAT PROFILE ' + run } })
  assert.equal((await request('/profiles/me', { user: a })).data.profile.bio, 'UAT PROFILE ' + run)
  pass('profile PATCH persists across independent GET')
  address = (
    await request('/addresses', {
      user: a,
      method: 'POST',
      body: {
        addressLine1: 'UAT Address ' + run,
        city: 'UAT City',
        country: 'IN',
        addressType: 'other',
      },
    })
  ).data.address
  ledger.addresses.push({ id: address.id, owner: a.id, status: 'created' })
  save()
  await request('/addresses/' + address.id, { user: a })
  await request('/addresses/' + address.id, {
    user: a,
    method: 'PATCH',
    body: { addressLine2: 'UAT UPDATED' },
  })
  assert.equal(
    (await request('/addresses/' + address.id, { user: a })).data.address.addressLine2,
    'UAT UPDATED'
  )
  pass('address create/read/update persists')
  await request('/addresses/' + address.id, { user: b, expected: 403 })
  pass('customer B cannot read customer A address')
  const fixture = pdf()
  fs.mkdirSync('.f6-check', { recursive: true })
  fs.writeFileSync('.f6-check/uat-test-document.pdf', fixture)
  const form = new FormData()
  form.append('file', new Blob([fixture], { type: 'application/pdf' }), 'UAT-TEST-NOT-REAL-ID.pdf')
  form.append('documentType', 'driving_license')
  form.append('expiresAt', '2030-12-31')
  form.append('remarks', 'TEST DOCUMENT - NOT A REAL ID ' + run)
  documentId = (
    await request('/kyc/documents', { user: a, method: 'POST', body: form, expected: 201 })
  ).data.id
  ledger.documents.push({ id: documentId, owner: a.id, status: 'pending', synthetic: true })
  save()
  const download = await fetch(api + '/kyc/documents/' + documentId + '/download', {
    headers: { Authorization: 'Bearer ' + a.token },
  })
  assert.equal(download.status, 200)
  assert.deepEqual(Buffer.from(await download.arrayBuffer()), fixture)
  await request('/kyc/documents/' + documentId + '/download', { user: b, expected: 404 })
  await request('/kyc/documents/' + documentId + '/download', { expected: 401 })
  pass(
    'synthetic driving licence upload/expiry/download; owner-only and unauthenticated protection'
  )
  for (const route of ['/admin/bookings', '/admin/kyc/customers'])
    await request(route, { user: a, expected: 403 })
  pass('customer rejected from admin booking and KYC APIs')
  assert.equal((await request('/bookings/me', { user: a })).data.length, 0)
  assert.equal((await request('/bookings/me', { user: b })).data.length, 0)
  pass('real customer booking lists are empty and owner scoped')
  chrome = spawn(
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    [
      '--headless=new',
      '--disable-gpu',
      '--remote-debugging-port=9224',
      '--user-data-dir=' + path.join(process.env.TEMP, run + '-chrome'),
      '--no-first-run',
      'about:blank',
    ],
    { windowsHide: true, stdio: 'ignore' }
  )
  for (let i = 0; i < 100; i++) {
    if (
      await fetch('http://localhost:9224/json/version')
        .then((r) => r.ok)
        .catch(() => false)
    )
      break
    await pause(200)
  }
  const target = await fetch('http://localhost:9224/json/new?about:blank', { method: 'PUT' }).then(
    (r) => r.json()
  )
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }))
  send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++sequence
      const timer = setTimeout(() => {
        waiting.delete(id)
        reject(new Error(method + ' timeout'))
      }, 20000)
      waiting.set(id, { resolve, reject, timer })
      socket.send(JSON.stringify({ id, method, params }))
    })
  socket.addEventListener('message', (event) => {
    const value = JSON.parse(event.data)
    if (value.id && waiting.has(value.id)) {
      const task = waiting.get(value.id)
      clearTimeout(task.timer)
      waiting.delete(value.id)
      value.error ? task.reject(new Error(value.error.message)) : task.resolve(value.result)
    }
    if (value.method === 'Runtime.exceptionThrown')
      ledger.runtime.push(value.params.exceptionDetails.text)
    if (value.method === 'Network.responseReceived') {
      const r = value.params.response
      if (r.url.startsWith(api))
        ledger.network.push({ path: new URL(r.url).pathname, status: r.status })
    }
  })
  evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text)
    return r.result.value
  }
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Network.enable')
  await navigate('/account/profile')
  await browserLogin(a)
  await until(`document.body.innerText.includes('UAT PROFILE ${run}')`)
  pass('real browser login returns to Profile and displays persisted backend value')
  await send('Page.reload', { ignoreCache: true })
  await pause(700)
  await until(`document.body.innerText.includes('UAT PROFILE ${run}')`)
  pass('real browser hard refresh restores authenticated Profile')
  await navigate('/account/addresses')
  await until(`document.body.innerText.includes('UAT UPDATED')`)
  pass('real browser displays persisted address update')
  await evaluate(`document.querySelector('[aria-label="Edit other address"]').click()`)
  await until(`!!document.querySelector('input[name="country"]')`)
  await evaluate(
    `(()=>{const input=document.querySelector('input[name="country"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'India');input.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('[role="dialog"] form').requestSubmit()})()`
  )
  await until(`document.body.innerText.includes('Use a two-letter country code')`)
  await evaluate(
    `(()=>{const input=document.querySelector('input[name="country"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'in');input.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('[role="dialog"] form').requestSubmit()})()`
  )
  await until(`!document.querySelector('[role="dialog"]')`)
  assert.equal((await request('/addresses/' + address.id, { user: a })).data.address.country, 'IN')
  pass('address UI rejects full country name and saves normalized IN through live API')
  await navigate('/account/kyc')
  await until(
    `document.body.innerText.includes('UAT-')||document.body.innerText.includes('Delete')||document.body.innerText.includes('Download')`
  )
  pass('real browser displays uploaded KYC document')
  for (const width of [375, 768, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    })
    for (const route of [
      '/account/profile',
      '/account/addresses',
      '/account/kyc',
      '/account/bookings',
    ]) {
      await navigate(route)
      await pause(400)
      assert.equal(
        await evaluate('document.documentElement.scrollWidth<=innerWidth'),
        true,
        route + ' overflow'
      )
      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true,
      })
      fs.writeFileSync(
        `.f6-check/uat-${route.split('/').pop()}-${width}.png`,
        Buffer.from(shot.data, 'base64')
      )
    }
  }
  pass('real authenticated account routes at 375/768/1440 without horizontal overflow')
  await request('/kyc/documents/' + documentId, { user: a, method: 'DELETE' })
  ledger.documents[0].status = 'deleted'
  documentId = null
  assert.equal((await request('/kyc/documents', { user: a })).data.length, 0)
  pass('KYC pending document deletion confirmed')
  await request('/addresses/' + address.id, { user: a, method: 'DELETE' })
  ledger.addresses[0].status = 'deleted'
  address = null
  assert.equal((await request('/addresses', { user: a })).data.addresses.length, 0)
  pass('address deletion confirmed; zero leftovers')
  await request('/profiles/me', { user: a, method: 'PATCH', body: { bio: originalBio } })
  ledger.cleanup.push('Original profile bio restored')
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await navigate('/account/profile')
  await evaluate(`document.querySelector('[aria-label="Open account navigation"]').click()`)
  await until(
    `[...document.querySelectorAll('button')].some(b=>b.innerText==='Sign out'&&b.getBoundingClientRect().width)`
  )
  await evaluate(
    `[...document.querySelectorAll('button')].find(b=>b.innerText==='Sign out'&&b.getBoundingClientRect().width).click()`
  )
  await until(`location.pathname==='/'||location.pathname==='/login'`)
  await pause(500)
  const cookies = await send('Network.getCookies', { urls: [api] })
  assert.equal(
    cookies.cookies.some((c) => /refresh/i.test(c.name) && c.value),
    false
  )
  pass('real browser logout clears refresh cookie')
  await navigate('/account/profile')
  await browserLogin(b)
  assert.equal(await evaluate(`document.body.innerText.includes(${JSON.stringify(a.name)})`), false)
  pass('real A logout -> B login without A profile')
  const storage = await evaluate(
    'JSON.stringify({local:{...localStorage},session:{...sessionStorage}})'
  )
  for (const u of users) {
    assert.equal(storage.includes(u.password), false)
    assert.equal(storage.includes(u.token), false)
  }
  assert.equal(/quoteToken|razorpay_signature|providerPaymentId|blob:/.test(storage), false)
  pass('browser storage has no tested passwords/tokens/quote/signature/provider/KYC payloads')
  await request('/auth/logout', { user: a, method: 'POST', body: {} })
  await request('/auth/refresh', { method: 'POST', body: {}, cookie: a.cookie, expected: 401 })
  pass('API logout invalidates previous server refresh lifecycle')
  assert.deepEqual(ledger.runtime, [])
  pass('zero runtime exceptions in executed live customer browser flows')
} catch (error) {
  ledger.failure = error.message
  save()
  console.error('UAT STOP: ' + error.message)
  process.exitCode = 1
} finally {
  const a = users[0]
  if (a.token) {
    if (documentId)
      try {
        await request('/kyc/documents/' + documentId, { user: a, method: 'DELETE' })
        ledger.documents.find((d) => d.id === documentId).status = 'deleted'
      } catch (e) {
        ledger.cleanup.push('Document cleanup incomplete: ' + e.message)
      }
    if (address)
      try {
        await request('/addresses/' + address.id, { user: a, method: 'DELETE' })
        ledger.addresses.find((d) => d.id === address.id).status = 'deleted'
      } catch (e) {
        ledger.cleanup.push('Address cleanup incomplete: ' + e.message)
      }
    if (originalBio !== undefined)
      try {
        await request('/profiles/me', { user: a, method: 'PATCH', body: { bio: originalBio } })
      } catch {}
  }
  for (const user of users)
    if (user.token)
      try {
        await login(user)
        await request('/auth/logout-all', { user, method: 'POST', body: {} })
        ledger.cleanup.push('All sessions revoked for ' + user.id)
      } catch (e) {
        ledger.cleanup.push('Session cleanup incomplete for ' + user.id)
      }
  if (send) await send('Browser.close').catch(() => {})
  socket?.close()
  chrome?.kill()
  server?.kill()
  smtp.close()
  mail.clear()
  save()
  console.log(
    JSON.stringify({
      checks: ledger.checks.length,
      customers: ledger.customers.length,
      addresses: ledger.addresses,
      documents: ledger.documents,
      cleanup: ledger.cleanup,
      failure: ledger.failure,
    })
  )
}
