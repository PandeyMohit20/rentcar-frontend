let accessToken = null

export const authSession = {
  getAccessToken: () => accessToken,
  setAccessToken: (token) => {
    accessToken = token || null
  },
  clear: () => {
    accessToken = null
  },
}

export default authSession
