import fs from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const dotenv = require('../../rentcar-backend/node_modules/dotenv')
for (const repo of ['rentcar-frontend', 'rentcar-admin', 'rentcar-backend']) {
  const env = {}
  for (const name of ['.env', '.env.local', '.env.development', '.env.development.local']) {
    const path = '../' + repo + '/' + name
    if (fs.existsSync(path)) Object.assign(env, dotenv.parse(fs.readFileSync(path)))
  }
  console.log(
    JSON.stringify({
      repo,
      api: env.VITE_API_BASE_URL || env.VITE_API_URL,
      mode: env.NODE_ENV,
      origins: env.CORS_ORIGIN,
      razorpayMode: !env.RAZORPAY_KEY_ID
        ? 'MISSING'
        : env.RAZORPAY_KEY_ID.startsWith('rzp_test_')
          ? 'TEST'
          : 'NON_TEST',
      providerSecret: !!env.RAZORPAY_KEY_SECRET,
      webhookSecret: !!env.RAZORPAY_WEBHOOK_SECRET,
      adminCredentials: !!(env.SEED_ADMIN_EMAIL && env.SEED_ADMIN_PASSWORD),
      smtpConfigured: !!(env.SMTP_HOST && env.SMTP_USER),
    })
  )
}
