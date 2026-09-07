// Isolated protocol assertions, not a real authenticated account/provider test.
// Uses the existing Axios dependency and Node assertions; no test framework.
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import axios from 'axios'
import authSession from '../src/services/api/authSession.js'

const storage = new Map()
globalThis.sessionStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) }
globalThis.window = new EventTarget()
window.sessionStorage = globalThis.sessionStorage
let expired = 0
window.addEventListener('rentcar:session-expired', () => { expired++ })
const moduleUrl = file => pathToFileURL(path.resolve(file)).href
const source = (await fs.readFile('src/services/api/axiosInstance.js', 'utf8'))
  .replace("from 'axios'", `from '${moduleUrl('node_modules/axios/index.js')}'`)
  .replace("from './authSession'", `from '${moduleUrl('src/services/api/authSession.js')}'`)
  .replaceAll('import.meta.env.VITE_API_BASE_URL', "'http://isolated.invalid'")
  .replaceAll('import.meta.env.VITE_API_TIMEOUT', '1000')
let refreshes = 0
let refreshMode = 'success'
const token = suffix => `header.${Buffer.from(JSON.stringify({ sub: 'isolated-subject' })).toString('base64url')}.${suffix}`
const oldToken = token('old')
const newToken = token('new')
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
const failure = (config, status) => Object.assign(new Error('Isolated rejection'), { config, ...(status ? { response: { status, data: {}, config } } : { code: 'ERR_NETWORK' }) })
axios.defaults.adapter = async config => {
  if (config.url.endsWith('/auth/refresh')) {
    refreshes++
    await pause(30)
    if (refreshMode === 'offline') throw failure(config)
    if (refreshMode === 'expired') throw failure(config, 401)
    return { status: 200, data: { data: { accessToken: newToken } }, config, headers: {} }
  }
  if (config.headers.Authorization !== `Bearer ${newToken}`) {
    if (config.url === '/delayed') await pause(70)
    throw failure(config, 401)
  }
  return { status: 200, data: { ok: true }, config, headers: {} }
}
const { default: client } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
authSession.setAccessToken(oldToken)
await Promise.all(['/one', '/two', '/delayed'].map(url => client.get(url)))
assert.equal(refreshes, 1, 'Concurrent and delayed 401s share refresh')
assert.equal(expired, 0)

authSession.setAccessToken(oldToken)
refreshMode = 'offline'
await assert.rejects(client.get('/offline'), error => error.isNetworkError)
assert.equal(authSession.getAccessToken(), oldToken, 'Offline refresh preserves session')
assert.equal(expired, 0)

refreshMode = 'expired'
await Promise.allSettled([client.get('/one'), client.get('/two')])
assert.equal(expired, 1, 'Simultaneous terminal failures emit one expiry')
assert.equal(authSession.getAccessToken(), null)

authSession.setAccessToken(oldToken)
refreshMode = 'success'
const lateRefresh = client.get('/late')
await pause(10)
authSession.clear()
await assert.rejects(lateRefresh, error => error.sessionChanged)
assert.equal(authSession.getAccessToken(), null, 'Late refresh cannot undo logout')

const { default: attempt } = await import('../src/services/api/bookingAttemptSession.js')
const key = attempt.getOrCreateKey('isolated-user|trip')
assert.equal(attempt.getOrCreateKey('isolated-user|trip'), key)
assert.notEqual(attempt.getOrCreateKey('isolated-user|other-trip'), key)
attempt.clearAll()
assert.equal(storage.has('rentcar_booking_attempt'), false)

const currencySource = (await fs.readFile('src/utils/formatters.js', 'utf8')).replace(/^export \{.*\} from '\.\/date'\r?\n/m, '')
const { formatCurrency } = await import(`data:text/javascript;base64,${Buffer.from(currencySource).toString('base64')}`)
assert.match(formatCurrency('1234.56', 'INR'), /1,234\.56/)
assert.match(formatCurrency('1234.56', 'USD'), /1,234\.56/)
assert.equal(formatCurrency(null), '—')
assert.equal(formatCurrency(Infinity), '—')
console.log('PASS: isolated single-flight/delayed-401, offline preservation, expiry deduplication, logout race, attempt stability/cleanup, and fractional currency assertions. No real auth/payment result simulated as live PASS.')
