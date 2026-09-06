let quote = null

export const quoteSession = {
  get: () => quote,
  set: (value) => {
    quote = value || null
  },
  clear: () => {
    quote = null
  },
}
export default quoteSession
