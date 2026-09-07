// Read-only verification, run from the backend directory so its environment is loaded.
import fs from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { prisma } = require('../../rentcar-backend/src/config/database')
const ledger = JSON.parse(
  fs.readFileSync('../rentcar-frontend/docs/UAT-fixture-ledger.json', 'utf8')
)
try {
  const users = await prisma.user.findMany({
    where: { id: { in: ledger.customers.map((c) => c.id) } },
    select: {
      id: true,
      name: true,
      status: true,
      emailVerifiedAt: true,
      profile: { select: { bio: true, verificationStatus: true } },
      addresses: { select: { id: true } },
      userDocuments: { select: { id: true } },
    },
  })
  const result = { scope: 'READ ONLY MySQL verification of exact UAT customer IDs', users }
  fs.writeFileSync(
    '../rentcar-frontend/docs/UAT-database-evidence.json',
    JSON.stringify(result, null, 2)
  )
  console.log(JSON.stringify(result))
} finally {
  await prisma.$disconnect()
}
