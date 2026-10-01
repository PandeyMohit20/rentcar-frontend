let accessToken = null
let version = 0
export const authSession = {
  getAccessToken: () => accessToken,
  getVersion: () => version,
  setAccessToken(token) {
    version += 1
    accessToken = token || null
    try {
      sessionStorage.removeItem('rentcar_signed_out')
    } catch {
      /* No storage. */
    }
  },
  replaceAccessToken(token, expectedVersion) {
    if (version !== expectedVersion) return false
    accessToken = token
    return true
  },
  markSignedOut() {
    try {
      sessionStorage.setItem('rentcar_signed_out', 'true')
    } catch {
      /* No storage. */
    }
  },
  isSignedOut() {
    try {
      return sessionStorage.getItem('rentcar_signed_out') === 'true'
    } catch {
      return false
    }
  },
  clear() {
    version += 1
    accessToken = null
  },
}
export default authSession
