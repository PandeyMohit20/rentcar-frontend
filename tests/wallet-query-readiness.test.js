import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { walletQueryEnabled } from '../src/features/wallet/walletQueryEnabled.js'

test('wallet query stays disabled while session restoration is in progress', () => {
  assert.equal(walletQueryEnabled({ isRestoring: true, isAuthenticated: false }), false)
  assert.equal(walletQueryEnabled({ isRestoring: true, isAuthenticated: true }), false)
})

test('wallet query runs after restoration for an authenticated user', () => {
  assert.equal(walletQueryEnabled({ isRestoring: false, isAuthenticated: true }), true)
})

test('wallet query stays disabled for a restored unauthenticated user', () => {
  assert.equal(walletQueryEnabled({ isRestoring: false, isAuthenticated: false }), false)
})

test('public navigation uses the shared wallet hook with auth readiness gating', async () => {
  const [navbar, topbar, hook] = await Promise.all([
    readFile(new URL('../src/components/navigation/Navbar.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/account/Topbar.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/features/wallet/useWallet.js', import.meta.url), 'utf8'),
  ])

  assert.match(navbar, /useWalletBalance/)
  assert.match(topbar, /useWalletBalance/)
  assert.match(hook, /enabled:\s*walletQueryEnabled\(/)
})

test('Axios retains 401 refresh, credentialed cookie, and retry handling', async () => {
  const axios = await readFile(
    new URL('../src/services/api/axiosInstance.js', import.meta.url),
    'utf8'
  )

  assert.match(axios, /withCredentials:\s*true/)
  assert.match(axios, /error\.response\?\.status === 401/)
  assert.match(axios, /await refreshAccessToken\(version\)/)
  assert.match(axios, /request\.headers\.Authorization = 'Bearer ' \+ token/)
  assert.match(axios, /return axiosInstance\(request\)/)
  assert.match(axios, /let refreshPromise = null/)
})
