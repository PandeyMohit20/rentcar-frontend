let razorpayPromise = null
export const loadRazorpay = () => {
  if (window.Razorpay) return Promise.resolve(window.Razorpay)
  if (razorpayPromise) return razorpayPromise
  razorpayPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const finish = (error) => {
      window.clearTimeout(timer)
      script.onload = null
      script.onerror = null
      if (error) {
        script.remove()
        reject(error)
      } else resolve(window.Razorpay)
    }
    const timer = window.setTimeout(
      () => finish(new Error('Payment checkout took too long to load. Please try again.')),
      20000
    )
    script.onload = () =>
      finish(
        window.Razorpay ? null : new Error('Payment checkout could not start. Please try again.')
      )
    script.onerror = () =>
      finish(new Error('Unable to load payment checkout. Check your connection and retry.'))
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.dataset.rentcarRazorpay = 'true'
    document.head.appendChild(script)
  }).catch((error) => {
    razorpayPromise = null
    throw error
  })
  return razorpayPromise
}
export default loadRazorpay
