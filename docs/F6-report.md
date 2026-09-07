# RENTCAR CUSTOMER FRONTEND F6 REPORT

> Historical report. Its B1/B2 blockers and final readiness decision are superseded by [the F6-RERUN report](F6-rerun-report.md). The backend fixes were supplied subsequently by the user. Live environment limitations are separated from code findings in the rerun.

## 1. Executive Verdict

| Area | Verdict |
| --- | --- |
| End-to-end customer journey | PARTIAL |
| Production UI/UX | PARTIAL |
| Auth/session resilience | PARTIAL |
| Discovery | PASS |
| Availability | PASS |
| Trusted quote | PARTIAL |
| Booking | PARTIAL |
| Payment | FAIL |
| Post-booking | PARTIAL |
| Profile | PARTIAL |
| Addresses | PARTIAL |
| KYC | PARTIAL |
| Responsive | PARTIAL |
| Accessibility | PARTIAL |

| Gate | Result |
| --- | --- |
| Critical findings | 1 |
| High findings | 1 |
| Moderate findings | 2 |
| Low findings | 1 |
| Active mocks | 0 found in mounted critical journey |
| Active stale critical APIs | 0 found |
| Sensitive leaks | 0 found in audited customer source/configuration |
| Backend changed | NO |
| Build | PASS |
| Lint errors | 0 |
| Lint warnings | 33 |
| git diff --check | PASS |
| CUSTOMER FRONTEND F6 COMPLETE | NO |
| CUSTOMER FRONTEND PRODUCTION-READY | NO |

Findings counts are unresolved findings, including the two backend payment blockers. Frontend hardening was implemented, but financial recovery blockers and missing live validation prevent F6 completion. Source compatibility is not a substitute for authenticated/provider validation.

## 2. Contract Audit

All paths are relative to `/api/v1`; dynamic parameter names differ only in naming.

| Domain | Frontend endpoint | Backend endpoint | Match | Notes |
| --- | --- | --- | --- | --- |
| Auth | /auth/login, register, me, refresh, logout, forgot-password, reset-password, verify-otp, resend-verification | Same | YES | Cookie refresh; data.accessToken/data.user; exact OTP purpose |
| Locations | /locations/cities, /locations/branches | Same | YES | data array and meta |
| Cars | /cars/search, /cars/featured, /cars/:id | Same | YES | Public fields only; authoritative discovery pricing |
| Availability | POST /availability/search | Same | YES | seats and offset timestamps; no catalog fallback |
| Pricing | POST /pricing/quote | Same | YES | carId + interval only; quoteToken memory-only |
| Bookings | /bookings, /bookings/me, /bookings/:id, /bookings/:id/cancel | Same | YES | Stable Idempotency-Key; payment recovery DTO gap remains |
| Payments | /payments/orders, /payments/verify, /payments/:id | Same | YES | Operational recovery/order invariant blockers remain |
| Refunds | /bookings/:id/refunds | Same | YES | Read-only; pending/processing polling |
| Invoices | /bookings/:id/invoice | Same | YES | Structured data; 404 handled as not issued |
| Profile | /users/me, /profiles/me | Same | YES | GET/PATCH; separate identity/profile envelopes |
| Addresses | /addresses, /addresses/:id | Same | YES | GET/POST/PATCH/DELETE; editable allowlist |
| KYC | /kyc/status, /kyc/documents, /kyc/documents/:id/download, /kyc/documents/:id, /kyc/submit | Same | YES | Authenticated blobs; multipart boundary; required licence expiry |

The method/payload/normalization/status/consumer matrix is in [F6-contract-audit.md](F6-contract-audit.md). It was completed before broad UI changes against backend routes, validators, controllers and services.

## 3. End-to-End Journey

Home → locations/branch → catalog search → availability → car detail: real local reads validated. Filter changes preserve exact trip timestamps, including URL-supplied seconds and offset.

Car detail → quote: real error path validated. The sole available car has no active pricing; POST /pricing/quote returned 404 RESOURCE_NOT_FOUND. No fabricated price or quote was substituted.

Login/register → booking → Razorpay → reconciliation → post-booking → account: source audited; live authenticated journey NOT EXECUTED. No designated session/account location was supplied, and backend `.env` has no Razorpay key configured.

## 4. Auth / Session Hardening

- Refresh: existing single-flight implementation passed isolated concurrent and delayed-401 checks; terminal expiry emitted once.
- Restore: guest bootstrap and six protected-route redirects checked; authenticated hard refresh pending.
- Logout: shared guarded action added to account navigation and public navigation; clears token, query cache, quote, booking recovery and cancellation attempts.
- User switch: session-version rejection retained. Redux migration now discards legacy customer payloads and persists only safe UI preferences. Real A→B switching NOT EXECUTED.
- Network failure: isolated refresh failure retains token; late refresh cannot undo logout. Storage access is deferred inside try/catch so denied browser storage cannot crash module initialization.

## 5. Discovery / Availability

Locations: real branches/cities read successfully. Search: catalog and availability remain distinct. Availability: real POST returned one car; CORS preflight allowed Idempotency-Key. Filters: mobile sheet supports Apply, Clear and Close; exact interval preservation fixed. Pagination: source checked; multiple-page fixture unavailable. Timezone: existing Asia/Kolkata helpers retained. Car detail: real public data and missing-pricing recovery validated.

## 6. Quote / Booking

Quote authority: all financial values still originate from backend responses. Central formatting now retains fractional currency amounts. Quote expiry: existing clock invalidation and Get Fresh Quote path source checked; live expiry NOT EXECUTED because no priced fixture exists. Idempotency: stable attempt keys retained and checked in isolation. Hold: backend status/expiry remains authoritative. Recovery: same-tab booking recovery preserved; fresh-session operational payment recovery blocked by B2.

## 7. Payment

Order: added amount/currency equality check before opening Checkout; non-pending/non-normal returned payments are not reopened. Checkout: single reusable loader, timeout cleanup and retry retained. Verification: no acknowledgement is treated as booking confirmation. Webhook reconciliation: real provider NOT EXECUTED; B1/B2 documented. Polling: bounded at two minutes and stops for relevant terminal/error/review states. review_required: existing received/under-review/no-second-payment copy retained. late_payment_conflict: support-review wording does not claim a refund. PCI boundary: mounted flow uses Razorpay only; unused card/CVV form removed.

## 8. Post-Booking

My Bookings: status filtering, responsive cards/table, pagination and centralized money/time formatting source checked. Detail: unknown status copy made safe; route instances reset by booking ID. Cancellation: optional reason, confirmation and stable key retained; duplicate submission guard added. Backend exposes no eligibility flag: UI mirrors returned status/time rules; cancellation POST is final authority. Refund: empty list now says no refund is recorded, not that none is due; pending/processing copy and explicit refresh added. Invoice: structured data only; no PDF generation or invented GST. Live writes/reads NOT EXECUTED.

## 9. Account

Profile: F5 layout retained; identity and personal fields use their respective contracts. Addresses: existing optional fields, default-address handling and uncertain-write refresh retained. KYC: only Driving Licence is required, optional documents remain optional, private blob download retained, and non-atomic replacement recovery guidance retained. Account mutations now discard inactive mutation data immediately.

Profile/addresses/KYC persistence, upload/download/delete/replacement/submit: **NOT EXECUTED — AUTHENTICATED TEST SESSION UNAVAILABLE**.

## 10. Premium UI/UX Audit

- Global consistency: existing MUI theme retained; 44px button/icon/input targets, visible keyboard focus, compact phone dialogs and reduced-motion CSS added.
- Home: clear Find a car hierarchy and real featured fleet retained; no fabricated statistics.
- Search: mobile filters no longer dominate results; selected-trip summary and contextual skeletons added.
- Car detail: contextual loading and authoritative car data retained.
- Auth: resend timer restart fixed; forgot-password submission loading, password autocomplete and semantic headings improved.
- Quote: customer-facing price copy replaces backend jargon; restoring sessions cannot reserve; total precision fixed.
- Booking/payment: loading skeleton, retry recovery and pre-checkout financial checks added.
- My Bookings/booking detail: shared statuses, safe unknown labels and truthful refund copy.
- Profile/addresses/KYC: F5 account shell retained with a reachable sign-out action.

Authenticated visual states and complete hover/focus/disabled/error/success permutations remain unvalidated; no premium-production PASS is claimed for them.

## 11. Responsive Matrix

P = PASS for tested public/default/real error state. NE = NOT EXECUTED for authenticated content. All checks used headless Chrome 152.0.7977.76 responsive viewport emulation, not physical devices.

| Route | 320 | 375 | 768 | 1024 | 1440 | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Home | P | P | P | P | P | Real fleet/branch data |
| Search catalog | P | P | P | P | P | Mobile sheet; real card |
| Availability | P | P | P | P | P | Real returned car |
| Locations | P | P | P | P | P | Real cities |
| Car detail | P | P | P | P | P | With/without trip |
| Quote | NE | PARTIAL | NE | NE | NE | Real missing-pricing error only |
| Login/Register | P | P | P | P | P | Guest forms |
| Forgot/Reset password | P | P | P | P | P | Forms only; no emails sent |
| Not Found | P | P | P | P | P | Useful Home navigation |
| Booking/payment status | NE | NE | NE | NE | NE | Guest guard only checked |
| My Bookings/Booking detail | NE | NE | NE | NE | NE | Guest guard only checked |
| Profile/Addresses/KYC | NE | NE | NE | NE | NE | Guest guard only checked |

390, 480 and 1280px were also checked for the 11 public route variants: 88 total route/width samples, zero detected horizontal page overflows. This does not establish responsive correctness for unexecuted authenticated states. Edge, Safari and Firefox NOT EXECUTED.

## 12. Accessibility

Headings: all 88 public samples contained h1; relevant section headings improved. Labels: audited forms and password controls have names. Keyboard: mobile filters Apply/Clear/Escape and focus restoration checked. Focus: shared visible outlines added. Dialogs: filter sheet named; account dialogs retain existing labels. Errors: field association and account inline errors retained. Status semantics: textual labels accompany colors. Images: stable ratios, alt text and fallback retained. Screen-reader testing and full contrast/keyboard audit of authenticated states NOT EXECUTED.

## 13. Failure Recovery

Offline: useful normalized connection failure and session preservation. 401: single-flight refresh and single terminal expiry isolated checks pass. 409: booking/cancellation/order errors retain backend authority and refresh paths. 413: safe 10 MB upload message. 422: account field validation retained. 429: no blind query retry. 500: safe service-unavailable copy; only selected server/network query retries. Booking ambiguity: same-trip idempotency and My Bookings guidance retained. Payment ambiguity: re-read truth; no invented success. Provider dismissal/webhook delay: bounded reconciliation source audited, live NOT EXECUTED. Session expiry: token/cache/recovery cleanup retained.

## 14. Performance

Duplicate requests: shared query keys and refresh promise retained. Polling: two-minute bounds; no terminal-state permanent polling observed in source. Images: lazy loading and stable ratios retained; current car lacks a real photo. Lazy loading: route-level splitting retained. Bundle: production build passes; largest emitted chunk is MUI at approximately 365.03 kB (109.29 kB gzip), below Vite's warning threshold; no chunk-size warning. No new dependency or framework installed.

## 15. Security / Privacy

Secrets: no frontend secret variable names found; no secret values printed. Tokens: access token memory-only; refresh cookie flow retained. quoteToken: memory-only; absent from generated URLs. Idempotency-Key: headers and controlled session recovery only. Payment signature: memory-only verification payload, not persisted. KYC paths: authenticated blob response; storage filename is not displayed. Cross-user cache: clearCustomerSession and version checks retained; legacy Redux rehydration hardened. Card data: RentCar card-input placeholder removed. Real cross-user account testing remains pending.

## 16. Mock / Stale Cleanup

Active mocks: 0 found in mounted critical routes. Active stale APIs: 0 found. Unmounted legacy remaining: optional wallet/wishlist/reviews/support/marketing components and helpers remain outside the route tree; not expanded or mounted.

Removed: checkoutService mock, stale userService, obsolete Booking and Checkout pages/styles, unused PaymentCard form and export, unused historical car/payment endpoint definitions. Existing Payment redirect and account/profile/document redirects retained. Unknown optional routes intentionally resolve to Not Found. No customer pickup/return functionality added.

## 17. Live Manual Validation

| Area | Result | Evidence/limit |
| --- | --- | --- |
| Auth | PARTIAL | Guest bootstrap/protected redirects; real registration/login/OTP/session switching not executed |
| Discovery | PASS | Local cities, branch, featured car, catalog and detail |
| Quote | PARTIAL | Real 404 missing active pricing; success/expiry unavailable |
| Booking | NOT EXECUTED | No authenticated priced test fixture |
| Payment | NOT EXECUTED | No configured Razorpay key; no provider/webhook fabrication |
| Post-booking | NOT EXECUTED | No designated authenticated test session |
| Profile | NOT EXECUTED | AUTHENTICATED TEST SESSION UNAVAILABLE |
| Addresses | NOT EXECUTED | AUTHENTICATED TEST SESSION UNAVAILABLE |
| KYC | NOT EXECUTED | AUTHENTICATED TEST SESSION UNAVAILABLE |

Automated frontend test framework unavailable. Dependency-free [browser checks](../scripts/f6-browser-check.mjs) and [isolated session assertions](../scripts/f6-session-check.mjs) were used without installing a framework. Isolated Axios protocol fixtures are explicitly not live account/provider results. Browser artifacts are local ignored files under `.f6-check`.

## 18. Build / Lint / Git

Build: PASS. Lint errors: 0. Lint warnings: 33. git diff --check: PASS. Conflict markers: none found. Backend working tree remains unchanged. Formatting-only corrections were necessary in existing audit-related files to satisfy the current Prettier lint rules.

## 19. Findings

### Critical

**B1 — second-payment risk after captured review/conflict.** POST /payments/orders checks booking pending state but ignores succeeded review/conflict payment rows when selecting an active attempt. Reconciliation can leave that booking pending. Another order can be created while its hold remains valid. Minimal proposed fix: enforce the no-new-order invariant under the booking lock against all captured/unresolved payments. No backend patch made.

### High

**B2 — fresh-session operational payment recovery unavailable.** Booking DTO has no payment ID/operational summary; GET /payments/:id requires the lost ID. Minimal proposed fix: extend the existing ownership-checked booking read with a safe authoritative payment association/summary. No new API or backend change made.

Exact routes, source lines, impacts and proposed fixes: [F6-backend-blockers.md](F6-backend-blockers.md).

### Moderate

1. **Live validation gap:** no designated authenticated session; current car has no active pricing; backend `.env` lacks a Razorpay key. Account persistence and financial journey remain unexecuted.
2. **Deployment configuration:** committed production API URL is `https://example.invalid/api/v1`; deployment must supply the real API URL. No deployment was attempted.

### Low

1. Unmounted optional legacy code and 33 existing lint warnings remain. They do not represent mounted critical mocks or stale API calls.

Fixed frontend findings include fractional-money rounding, OTP resend cooldown, unsupported refund entitlement copy, mobile filter layout and interval precision, missing account logout, stale persisted-state restoration risk, denied-storage initialization, quote/session action state, payment-order checks and legacy card collection UI.

## 20. Backend Backlog

Location persistence: unchanged. Customer booking rich summary: unchanged. KYC expiry scheduler: unchanged. KYC replacement atomicity: unchanged; recovery guidance retained. Concurrent same-type KYC upload: unchanged; frontend recheck is not a concurrency guarantee. Pickup concurrency closure: Phase 6B real MySQL hard-closure remains pending; pickup remains Beta. These known items are separate from B1/B2.

## 21. Final Decision

CUSTOMER FRONTEND F6 COMPLETE: **NO**

CUSTOMER FRONTEND PRODUCTION-READY: **NO**

SAFE FOR CONTROLLED END-TO-END UAT: **NO** for the full financial journey until B1/B2 are resolved and safe fixtures are available.

RECOMMENDED NEXT: review the documented backend blockers, prepare a priced test car/designated customer session/Razorpay test configuration, then rerun the missing F6 gates. Full-system UAT was not started.
