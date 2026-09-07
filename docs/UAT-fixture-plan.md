# Controlled full-system UAT fixture plan — 2026-09-07

All writes use normal application APIs. No DB bootstrap, schema change, migration execution or seed reset is planned.

| Fixture | Planned use | Cleanup |
| --- | --- | --- |
| UAT Customer A / B, unique `@example.test` addresses | Register, local OTP, login, profile, address, KYC, isolation | Logout all sessions; retain clearly labelled accounts if customer deletion is unsupported |
| Local OTP receiver, loopback only | Capture only this run's synthetic recipients; never forward email | Stop receiver and temporary API process; discard OTP/password/token memory |
| Temporary backend process on 5001 | Same source/DB, development mode, local SMTP only, no Razorpay configuration | Stop at end; existing backend 5000 remains untouched |
| UAT Vendor + VendorMember | Admin-authorized creation only if designated admin available | Delete only unused disposable resources through supported APIs |
| UAT Branch/location | Create through authorized admin APIs only if required | Remove only unused fixtures |
| UAT Car + feature + images/documents | Create through admin API/UI if admin session available | Remove temporary files/subresources; retain financial history |
| UAT active pricing | Legitimate pricing API, trip interval covered | Remove temporary price only if no historical dependency |
| UAT availability block | Prove overlapping interval disappears then returns | Delete temporary block and restore car status |
| UAT Address | Create/read/update/delete, cross-customer ownership | Delete and confirm absent |
| UAT KYC document | Synthetic PDF labelled TEST DOCUMENT / NOT A REAL ID | Delete while pending; submit only with a safe review/retention plan |
| UAT bookings | Priced fixture required; unpaid cancel/replay; paid path TEST only | Retain booking/status/accounting history; never direct-delete |

Payment/provider work requires verified Razorpay TEST mode. Admin/vendor/fleet writes require a usable designated admin login. No real personal documents or production fleet changes. Exact created IDs and cleanup outcomes will be recorded in `docs/UAT-fixture-ledger.json` (no credentials/tokens).
