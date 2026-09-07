import fs from 'node:fs'
const api = 'http://localhost:5000/api/v1'
const evidence = { scope: 'LIVE public APIs; no fabricated pricing', checks: [] }
async function read(path, body, origin) {
  const r = await fetch(api + path, {
    method: body ? 'POST' : 'GET',
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(origin ? { Origin: origin } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return {
    status: r.status,
    body: await r.json(),
    cors: r.headers.get('access-control-allow-origin'),
  }
}
evidence.health = await fetch('http://localhost:5000/api/v1/health').then(async (r) => ({
  status: r.status,
  body: await r.json(),
}))
const branches = await read('/locations/branches?limit=100')
evidence.branches = { status: branches.status, ids: branches.body.data.map((b) => b.id) }
const cars = await read('/cars/search?limit=100')
evidence.cars = { status: cars.status, ids: cars.body.data.map((c) => c.id) }
const pickupDateTime = new Date(Date.now() + 3 * 86400000).toISOString(),
  returnDateTime = new Date(Date.now() + 4 * 86400000).toISOString()
evidence.interval = { pickupDateTime, returnDateTime }
const availability = await read('/availability/search', {
  pickupDateTime,
  returnDateTime,
  branchId: evidence.branches.ids[0],
  limit: 100,
})
evidence.availability = {
  status: availability.status,
  ids: (availability.body.data?.cars || availability.body.data || []).map((c) => c.id),
}
evidence.quotes = []
for (const carId of evidence.cars.ids) {
  const detail = await read('/cars/' + carId)
  const quote = await read('/pricing/quote', { carId, pickupDateTime, returnDateTime })
  evidence.quotes.push({
    carId,
    detailStatus: detail.status,
    quoteStatus: quote.status,
    message: quote.body.message,
    hasQuoteToken: !!quote.body.data?.quoteToken,
  })
}
evidence.cors = []
for (const origin of ['http://localhost:5173', 'http://localhost:5174']) {
  const result = await read('/locations/branches', undefined, origin)
  evidence.cors.push({ origin, status: result.status, allowedOrigin: result.cors })
}
fs.writeFileSync('docs/UAT-public-evidence.json', JSON.stringify(evidence, null, 2))
console.log(JSON.stringify(evidence))
