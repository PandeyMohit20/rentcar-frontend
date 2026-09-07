// Targeted actual-frontend check with isolated auth/KYC responses. No backend writes.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import path from 'node:path'
const before = process.argv.includes('--before')
const chrome = spawn(
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9227',
    '--user-data-dir=' + path.join(process.env.TEMP, 'rentcar-kyc-refresh-' + Date.now()),
    '--no-first-run',
    'about:blank',
  ],
  { windowsHide: true, stdio: 'ignore' }
)
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let socket, send
const origin = 'http://localhost:5173',
  user = {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    name: 'Isolated KYC Check',
    email: 'kyc-check@example.test',
  }
let status = 'pending',
  statusReads = 0,
  documentReads = 0,
  seq = 0
const pending = new Map(),
  failures = []
try {
  for (let i = 0; i < 100; i++) {
    if (
      await fetch('http://localhost:9227/json/version')
        .then((r) => r.ok)
        .catch(() => false)
    )
      break
    await pause(200)
  }
  const target = await fetch('http://localhost:9227/json/new?about:blank', { method: 'PUT' }).then(
    (r) => r.json()
  )
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }))
  send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++seq
      const timer = setTimeout(() => {
        pending.delete(id)
        reject(new Error(method + ' timeout'))
      }, 15000)
      pending.set(id, { resolve, reject, timer })
      socket.send(JSON.stringify({ id, method, params }))
    })
  socket.addEventListener('message', (event) => {
    const r = JSON.parse(event.data)
    if (pending.has(r.id)) {
      const p = pending.get(r.id)
      clearTimeout(p.timer)
      pending.delete(r.id)
      r.error ? p.reject(new Error(r.error.message)) : p.resolve(r.result)
    }
    if (r.method === 'Runtime.exceptionThrown') failures.push(r.params.exceptionDetails.text)
    if (r.method === 'Fetch.requestPaused')
      intercept(r.params).catch((e) => failures.push(e.message))
  })
  async function intercept({ requestId, request }) {
    const route = new URL(request.url).pathname.replace('/api/v1', '')
    let data = {}
    if (route === '/auth/me' || route === '/users/me') data = { user }
    else if (route === '/profiles/me')
      data = { profile: { bio: null, dateOfBirth: null, gender: null } }
    else if (route === '/kyc/status') {
      statusReads++
      data = {
        verificationStatus: status,
        submittedAt: '2026-09-07T17:05:01.460Z',
        verifiedAt: status === 'verified' ? '2026-09-07T17:06:15.256Z' : null,
        rejectionReason: null,
        documentCount: 0,
      }
    } else if (route === '/kyc/documents') {
      documentReads++
      data = []
    } else if (route === '/addresses') data = { addresses: [] }
    await send('Fetch.fulfillRequest', {
      requestId,
      responseCode: 200,
      responseHeaders: [
        { name: 'Content-Type', value: 'application/json' },
        { name: 'Access-Control-Allow-Origin', value: origin },
        { name: 'Access-Control-Allow-Credentials', value: 'true' },
      ],
      body: Buffer.from(
        JSON.stringify({ success: true, message: 'Request successful', data })
      ).toString('base64'),
    })
  }
  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text)
    return r.result.value
  }
  async function until(expression) {
    for (let i = 0; i < 100; i++) {
      if (await evaluate(expression)) return
      await pause(100)
    }
    throw new Error('Timed out: ' + expression)
  }
  const link = async (route) => {
    await evaluate(`document.querySelector('a[href="${route}"]').click()`)
    await until(`location.pathname==='${route}'`)
    await pause(500)
  }
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Fetch.enable', {
    patterns: [{ urlPattern: 'http://localhost:5000/api/v1/*', requestStage: 'Request' }],
  })
  await send('Page.navigate', { url: origin + '/account/profile' })
  await until(`document.body.innerText.includes('Under review')`)
  const initial = statusReads
  status = 'verified'
  await link('/account/kyc')
  await until(`document.querySelector('h1')?.innerText==='KYC Verification'`)
  if (before) {
    assert.equal(statusReads, initial)
    assert.equal(
      await evaluate(`document.body.innerText.includes('Identity verification complete.')`),
      false
    )
    console.log(
      'REPRODUCED: Profile -> KYC within staleTime reuses pending status; no new GET /kyc/status'
    )
  } else {
    await until(`document.body.innerText.includes('Identity verification complete.')`)
    assert.ok(statusReads > initial)
    assert.equal(
      await evaluate(
        `[...document.querySelectorAll('.MuiChip-label')].filter(e=>e.textContent==='Verified').length>=2`
      ),
      true
    )
    console.log(
      'PASS KYC entry fetches status; aggregate and layout badges update, even with no documents'
    )
  }
  const preReload = statusReads
  await send('Page.reload', { ignoreCache: true })
  await pause(500)
  await until(`document.body.innerText.includes('Identity verification complete.')`)
  assert.ok(statusReads > preReload)
  console.log('PASS authenticated hard reload issues GET /kyc/status and maps verified')
  if (!before) {
    await link('/account/addresses')
    status = 'pending'
    await link('/account/profile')
    await until(`document.body.innerText.includes('Under review')`)
    const preRevisit = statusReads,
      preDocs = documentReads
    status = 'verified'
    await link('/account/kyc')
    await until(`document.body.innerText.includes('Identity verification complete.')`)
    assert.ok(statusReads > preRevisit)
    assert.ok(documentReads > preDocs)
    console.log(
      'PASS cached KYC revisit refetches both endpoints; Profile shares authoritative status'
    )
    const settled = statusReads
    await pause(1800)
    assert.equal(statusReads, settled)
    console.log('PASS no interval polling while idle')
  }
  assert.deepEqual(failures, [])
} finally {
  if (send) await send('Browser.close').catch(() => {})
  socket?.close()
  chrome.kill()
}
