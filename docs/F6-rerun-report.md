# RENTCAR CUSTOMER FRONTEND F6-RERUN REPORT

2026-09-07. Scope: missing F6 gates and additive B2 recovery only. Existing F6 changes were preserved. Backend files were read only. “Isolated” below means the actual frontend running in disposable Chrome with intercepted synthetic API responses, not backend persistence or provider execution.

## 1. Executive Verdict

| Gate | Result |
| --- | --- |
| B2 fresh-session payment recovery | PASS — isolated actual B2 DTO shape and source audit |
| Payment second-charge UX | PASS — isolated captured-state and order-409 checks |
| Authenticated booking | PARTIAL — read/recovery UI checked; live creation unavailable |
| Trusted quote | PARTIAL — live request returned missing-pricing 404; no success claimed |
| Razorpay TEST checkout | NOT EXECUTED |
| Payment verification | NOT EXECUTED live; source audited |
| Webhook reconciliation | NOT EXECUTED |
| My Bookings | PASS — isolated customer UI only |
| Booking detail | PASS — isolated customer UI only |
| Cancellation | NOT EXECUTED live; source audited |
| Refund | NOT EXECUTED live; source audited |
| Invoice | NOT EXECUTED live; source audited |
| Profile persistence | NOT EXECUTED |
| Address CRUD | NOT EXECUTED |
| KYC authenticated | PARTIAL — isolated status/upload controls and private-download source audit |
| Logout cleanup | PASS — controlled actual frontend cache/session cleanup |
| User switch | PASS — controlled A logout/B login with no A text flash |
| Authenticated responsive UX | PASS — six routes at five emulated widths |
| Authenticated accessibility | PARTIAL — basic headings/button names/dialog/Escape/focus checks |
| Critical / High / Moderate / Low findings | 0 / 0 / 0 / 1 |
| Active mocks / Active stale critical APIs / Sensitive leaks | 0 / 0 / 0 found in mounted audited journey |
| Backend changed | NO |
| Build | PASS |
| Lint errors / warnings | 0 / 33 |
| git diff --check | PASS |

Backend B1/B2 resolution is supported by current source and the supplied backend evidence: cancellation/capture race 100/100, B1 race 40/40, 46 suites/272 tests passing. Those backend tests were not rerun here. The cancelled-booking/capture deadlock is not active backlog.

## 2. B2 Payment Recovery

Booking response: existing service methods preserve the whole `data` object, including safe `payment: { id, status, operationalStatus, amount, currencyCode, createdAt, updatedAt }` or `null`.

Recovery flow: read the ownership-checked booking, select `booking.payment.id`, then GET that payment. Booking Status and account detail share `QUERY_KEYS.BOOKINGS.DETAILS(id)`. Payment reads use the existing payment detail key. Captured/review summary evidence cannot be downgraded by stale pending details, and mismatched payment/booking IDs cannot enable checkout.

Fresh session: no local payment ID is required. Stale local payment A is replaced by backend B without requesting A. Explicit null clears the stale local association. An eligible pending booking with null may offer payment; confirmed/cancelled/expired bookings do not. Missing association fields fail closed for payment eligibility.

Implementation: [Booking Status](../src/pages/BookingStatus/index.jsx), [recovery helpers](../src/features/payment/recovery.js). The rerun also fixes [GuestRoute](../src/components/authentication/GuestRoute.jsx) overriding the intended post-login destination with Home. The guard now preserves a validated internal return path. No endpoint or duplicate recovery cache was added.

## 3. Second-Charge UX

- Succeeded/normal: no payment CTA; booking state remains the confirmation authority.
- review_required: payment received, under review, do not pay again.
- late_payment_conflict: payment received, automatic confirmation failed, support review required; no invented refund.
- Payment-order 409: reconcile booking, then associated payment; no generic payment-failed/retry message.
- Pay Now visibility: only eligible pending/failed/null states after reads complete; processing, captured, review, expired and terminal states are blocked.

The isolated browser checks issue exactly one intentional order request, intercepted as 409. No automatic order/checkout on route load. Pending/processing use existing bounded polling with a 120-second stop and explicit refresh. Backend B1 remains the financial enforcement boundary.

## 4. Authenticated Journey

Login: controlled UI login and intended-route return checked; real designated account unavailable. Discovery: live local API returned one car and one branch. Quote: live POST returned 404, “No active pricing record is available for this car.” Booking: no live creation or durable replay; source still submits only `quoteToken` with a stable `Idempotency-Key`. Payment: isolated recovery only. Confirmation: isolated succeeded payment alone does not confirm a pending booking. My Bookings and Detail: actual customer views checked with isolated DTOs.

## 5. Razorpay Test Evidence

Mode: TEST configuration not available in the inspected backend `.env`. Order, Checkout, Verify and Webhook: NOT EXECUTED live. No payment, provider callback or webhook success was fabricated.

Source audit: order amount/currency checked against booking; provider script is shared; checkout requires an explicit action; dismissal reconciles; callback sends booking ID and exact Razorpay order/payment/signature fields; verification refetches authoritative state. No raw card form is mounted.

Provider limitation: no configured Razorpay key or webhook secret in the inspected setup, no separately supplied configuration location, and no authenticated priced test booking. Reachability therefore remains untested, not proven unreachable.

## 6. Post-Booking

Cancellation: live NOT EXECUTED. Existing stable cancellation key and booking/payment/refund/invoice invalidation preserved. Refund: live NOT EXECUTED; source reads backend records and does not initiate a refund from the read view. Invoice: live NOT EXECUTED; structured backend read retained, with no client GST calculation or fabricated PDF.

## 7. Account Persistence

Profile: live update/refresh/restore NOT EXECUTED. Addresses: live create/read/update/delete NOT EXECUTED. KYC: isolated status and upload-dialog controls checked; live upload/download/delete/submit NOT EXECUTED.

Synthetic test documents used: NO. Cleanup: no real profile changes, addresses, bookings or documents were created, so no server test records were left by this rerun. Disposable browser targets are closed.

## 8. Refresh / Fresh Session

Same-tab reload, initially fresh disposable tab, sessionStorage clearing, direct booking URL and login return to Booking Status: PASS with isolated authenticated responses. Review/captured state is recovered from backend-shaped booking/payment reads after refresh. These are frontend recovery checks, not evidence of a real refresh-cookie session or provider payment.

## 9. Logout / User Switch

Logout: actual shared logout code exercised. Cache clearing: no retained customer query data, access token, quote, booking attempt or payment recovery. Refund/invoice data were deliberately seeded into the app's actual query client for cleanup verification. Vite-resolved module URLs were used to avoid accidentally testing a separate HMR module instance.

User A → B: controlled logout/login with profile route return; no A name/bio in the resulting view or observed DOM mutations. Previous customer caches were cleared. Single-flight refresh, delayed 401, offline preservation, expiry deduplication and logout-response races also pass dependency-free isolated session checks.

## 10. Responsive / Accessibility

375, 768 and 1440: PASS; 320 and 1024 additionally checked. Booking Status, My Bookings, Booking Detail, Profile, Addresses and KYC: 30 route/width samples, no horizontal overflow or unnamed buttons. Mobile screenshots inspected.

Keyboard: Escape dismissal checked. Focus: address dialog restores focus to its trigger. Dialogs: accessible labels checked. Upload: labelled KYC dialog and PDF-capable file control checked, without submitting documents. Mobile navigation opens and exposes sign-out. Full keyboard traversal, screen-reader certification and physical-device testing were not performed.

## 11. Security / Privacy

Storage: auth/quote memory only; Redux persists UI preferences only, with legacy-state migration. Session storage retains minimal booking/internal-payment IDs and stable attempt metadata, not provider responses/signatures or KYC files.

URLs: no quote tokens, idempotency keys, payment signatures, KYC storage paths or auth tokens introduced into journey URLs. Logs: no sensitive mounted-journey logs found. Payment data: verification fields remain transient. KYC data: authenticated download endpoint, temporary blob URL revoked, backend storage filename not exposed. PCI boundary: card entry remains inside Razorpay Checkout; provider execution was not performed.

## 12. Static Audit

Active mocks: 0. Stale critical APIs: 0. Legacy mounted pages: 0 in the audited critical journey; optional unmounted modules remain. Sensitive mounted-journey logs: 0 found. Isolated response interception exists only in the development check script, outside production source/build.

## 13. Build / Lint / Git

`npm run build`: PASS. `npm run lint`: 0 errors, 33 existing warnings. `git diff --check`: PASS. Conflict markers: none found. Backend dirty-file set matches the pre-existing user changes; no backend file was written. No framework installed, commit, deployment or full-system UAT started.

Validation scripts: [B2/browser checks](../scripts/f6-rerun-browser-check.mjs), [session assertions](../scripts/f6-session-check.mjs). Final browser result: 21 checks, 30 responsive samples, exactly one deliberately rejected isolated order request, zero runtime exceptions. Browser checks need frontend 5173 and a disposable Chrome CDP endpoint 9223; API traffic to local port 5000 is intercepted for isolated checks. The script imports only the backend's pure payment-summary helper, with no DB/provider calls. Local artifacts are under ignored `.f6-check/`.

## 14. Findings

### Critical

0 open in rerun scope. B1 resolved by supplied backend change/evidence.

### High

0 open in rerun scope. B2 integrated and checked.

### Moderate

0 open code findings. The login-return guard race found in isolated browser validation was fixed. Missing environments are separated below.

### Low

1 existing maintenance item: optional unmounted legacy code and the unchanged 33 lint warnings. No new warning introduced.

## 15. Environment Limitations

Authenticated test account: availability was acknowledged, but no usable credentials/session location supplied or found. Priced fixture: UNAVAILABLE; sole discovered car lacks active pricing. Razorpay TEST: unconfigured in inspected setup. Webhook reachability: untested without configuration. Physical device: unavailable; browser emulation used. Other: deployment must replace `https://example.invalid/api/v1` with the deployed backend URL. These are environment/release prerequisites, not newly identified frontend code defects.

## 16. Remaining Backend Backlog

- Location persistence: REMAINS.
- Customer rich booking summary: REMAINS.
- KYC expiry scheduler: REMAINS.
- KYC replacement atomicity: REMAINS.
- Concurrent same-type KYC uploads: REMAINS.
- Pickup concurrency closure: REMAINS.

## 17. Final Decision

CUSTOMER FRONTEND F6-RERUN COMPLETE: YES under the requested environment-limited pass gate.

CUSTOMER FRONTEND CODE PRODUCTION-READY: YES for the audited scope, with deployment configuration and controlled UAT prerequisites above.

FULL LIVE FINANCIAL UAT COMPLETE: NO.

SAFE FOR CONTROLLED FULL-SYSTEM UAT: YES with a designated test account, priced fixture and Razorpay TEST environment.

RECOMMENDED NEXT: CONTROLLED FULL-SYSTEM UAT — CUSTOMER + ADMIN + BACKEND. Not started automatically.
