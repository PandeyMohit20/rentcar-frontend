// Local component rendering only. No backend calls or live UAT claims.
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
const harness = new URL('../.gst-browser.html', import.meta.url)
await fs.writeFile(
  harness,
  `<html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div><script type="module">
import React from 'react';import {createRoot} from 'react-dom/client';import {ThemeProvider,createTheme,CssBaseline} from '@mui/material';
import Quote from '/src/components/booking/QuotePriceBreakdown.jsx';import Invoice from '/src/features/invoice/InvoicePreview.jsx';
const root=createRoot(document.getElementById('root'));
window.draw=(registration)=>{const unregistered=registration==='UNREGISTERED';const f={gstRegistrationStatus:registration,policyStatus:'confirmed',rentalSubtotal:100,securityDeposit:500,additionalCharges:0,taxableAmount:unregistered?null:100,grandTotal:unregistered?600:618,currency:'INR',tax:unregistered?{type:'NOT_COLLECTED',totalTax:0}:{type:'CGST_SGST',cgst:9,sgst:9,cgstRate:9,sgstRate:9,totalTax:18}};
const quote={currencyCode:'INR',pricing:{rentalSubtotal:100,securityDeposit:500,payableAmount:f.grandTotal},financialSnapshot:f};
const invoice={invoiceNumber:'LOCAL-TEST',invoiceDate:'2030-01-01T00:00:00Z',subtotal:100,tax:unregistered?0:18,total:f.grandTotal,currencyCode:'INR',pdfBlocker:'TEST_ONLY',snapshot:{financial:f,seller:{documentTitle:'Local Test Receipt'}}};
root.render(React.createElement(ThemeProvider,{theme:createTheme()},React.createElement(CssBaseline),React.createElement(Quote,{quote}),React.createElement(Invoice,{invoice})));};window.draw('UNREGISTERED');
</script></body></html>`
)
const target = await fetch('http://localhost:9225/json/new?about:blank', { method: 'PUT' }).then(
  (r) => r.json()
)
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }))
let id = 0
const pending = new Map()
socket.addEventListener('message', (e) => {
  const r = JSON.parse(e.data)
  if (pending.has(r.id)) {
    const p = pending.get(r.id)
    pending.delete(r.id)
    r.error ? p.reject(new Error(r.error.message)) : p.resolve(r.result)
  }
})
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const key = ++id
    pending.set(key, { resolve, reject })
    socket.send(JSON.stringify({ id: key, method, params }))
  })
const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text)
  return r.result.value
}
const pause = (ms) => new Promise((r) => setTimeout(r, ms))
const wait = async (expression) => {
  for (let i = 0; i < 80; i++) {
    if (await evaluate(expression)) return
    await pause(200)
  }
  throw new Error('UI wait timed out')
}
try {
  await send('Page.enable')
  await send('Page.navigate', { url: 'http://localhost:5173/.gst-browser.html' })
  await wait("document.body.innerText.includes('GST is not charged by the seller.')")
  for (const mode of ['UNREGISTERED', 'REGISTERED']) {
    await evaluate(`window.draw('${mode}')`)
    await pause(200)
    for (const width of [390, 768, 1024, 1440]) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      })
      await pause(200)
      assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
      const text = await evaluate('document.body.innerText')
      if (mode === 'UNREGISTERED') {
        assert.ok(text.includes('GST is not charged by the seller.'))
        assert.ok(!/CGST|SGST|IGST|Total tax|TEST_ONLY/.test(text))
        assert.ok(text.includes('600'))
      } else {
        assert.ok(text.includes('CGST'))
        assert.ok(text.includes('SGST'))
        assert.ok(text.includes('618'))
      }
      console.log(
        `LOCAL UI PASS ${mode} ${width}px quote and invoice, trusted totals and tax display`
      )
    }
  }
} finally {
  socket.close()
  await fetch(`http://localhost:9225/json/close/${target.id}`)
  await fs.unlink(harness)
}
