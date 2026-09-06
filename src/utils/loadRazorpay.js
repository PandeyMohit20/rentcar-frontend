let razorpayPromise = null

export const loadRazorpay = () => {
  if (window.Razorpay) return Promise.resolve(window.Razorpay)
  if (razorpayPromise) return razorpayPromise

  razorpayPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-rentcar-razorpay]')
    const script = existing || document.createElement('script')
    const loaded = () =>
      window.Razorpay
        ? resolve(window.Razorpay)
        : reject(new Error('Razorpay Checkout did not initialize.'))
    const failed = () => reject(new Error('Unable to load Razorpay Checkout.'))
    script.addEventListener('load', loaded, { once: true })
    script.addEventListener('error', failed, { once: true })
    if (!existing) {
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.dataset.rentcarRazorpay = 'true'
      document.head.appendChild(script)
    }
  }).catch((error) => {
    razorpayPromise = null
    throw error
  })
  return razorpayPromise
}

export default loadRazorpay
