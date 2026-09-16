# LIVE CaronRent integration UAT — 15 September 2026

## Recommendation

**Latest check, 2026-09-15 10:47:44 UTC: CARONRENT NOT PRODUCTION READY.** After the reported seller configuration, the real database still has no tax profile or explicit registration status for vendor `564ebf45-1cae-4ca1-a29e-d4794733b57c`. Quote Readiness returns **BLOCKED with 36 blockers**. No configuration was changed or quote attempted.

**Latest resume attempt: CARONRENT NOT PRODUCTION READY.** Quote Readiness still reports BLOCKED with 35 blockers in the configured backend database. The reported business approval is not reflected in this environment. See the latest resume check below; no downstream scenario was attempted.

**Do not declare CaronRent production-ready.** The real journey fails at quote creation. Authentication/resume, reservation, Razorpay, confirmation, invoices and refunds remain blocked and have not earned live PASS results.

The application correctly surfaces the quote rejection. Its cause is an intentional backend business-approval prerequisite, not an invalid frontend request. No tax policy, billing approval, database record, quote signature, payment status or business rule was changed to bypass this boundary.

## Environment and provenance

- Frontend: `http://localhost:5173`, development mode; runtime Axios base URL verified in the browser as `http://localhost:5000/api/v1`.
- Frontend `.env`, `.env.development` and `.env.example` specify that local API. No local override files were found. Production configuration remains `https://example.invalid/api/v1` and is not deployable without an actual API URL.
- Backend: local Express service and actual database; both health endpoints returned 200. Backend environment reports development, `TEST_DATABASE_MOCK=false`, quote TTL 10 minutes, hold TTL 15 minutes.
- Configured CORS origins include `http://localhost:5173` and `http://localhost:5174`. UAT used localhost, not 127.0.0.1.
- Razorpay configuration declares TEST mode; provider and webhook secrets are present. Their values were not logged. This is configuration evidence only, not a successful provider integration test.
- Frontend HEAD: `fe4c8159bfaecb85702c265d67faa84e0af92d8d`. The prior redesign was already uncommitted. No frontend application code changed during this UAT task.
- Backend HEAD: `7aa6263af5a8e85472a05332fff53f4ca599d010`. Uncommitted error-handling fix plus the approval-completion implementation described below.
- Browser: isolated headless Chrome profile, remote-debugging port 9225, real network requests. No API interception, mocked responses, injected auth state, generated customers or synthetic booking records were used.
- Existing catalog records were selected through real APIs. Some existing records have earlier UAT labels; this run did not create or substitute them.
- Evidence: [final live network/check ledger](LIVE-CARONRENT-NETWORK.json), [before-fix sanitized evidence](LIVE-CARONRENT-BEFORE-FIX.json), [repeatable live runner](../scripts/live-caronrent-uat.mjs).

## Exact failure boundary

| Item | Evidence |
| --- | --- |
| Endpoint | `POST /api/v1/pricing/quote` |
| HTTP status | **409** |
| Safe response message/code | `PARTIALLY_APPROVED_REQUIRES_RATE_AND_CESS_CONFIRMATION` |
| Selected vehicle | `080cbda9-d5fe-4e6d-bf04-a25e2755a9a7` |
| Selected branch | `d5f9c996-6a74-47d0-b2e3-2a75688486a9` |
| Pickup | `2026-09-22T10:00:00+05:30` |
| Return | `2026-09-23T10:00:00+05:30` |
| Browser outcome | Same rejection displayed inline; no quote token, successful quote or reservation produced |

The actual frontend request was:

```json
{
  "carId": "080cbda9-d5fe-4e6d-bf04-a25e2755a9a7",
  "pickupDateTime": "2026-09-22T10:00:00+05:30",
  "returnDateTime": "2026-09-23T10:00:00+05:30"
}
```

This matches the strict backend quote validator: UUID carId, offset date-times and return after pickup. Branch is carried in trip context; it is intentionally not an extra quote payload field.

Read-only database inspection found `billing.issuer.phase7b.pending` with status `PARTIALLY_APPROVED_REQUIRES_RATE_AND_CESS_CONFIRMATION`, `isActive=false`. The service explicitly blocks on this pending status independently of isActive. Backend `docs/phase7-tax-invoice-email.md` confirms this is intentional while vehicle/category GST and cess approvals remain outstanding. No rates or approvals can be inferred by UAT.

### Fix applied without bypassing the approval gate

The original 409 response contained `error.stack` because the backend error handler exposed stacks outside production. The frontend normalized it away, but it was still visible on the network. Raw stack contents were not retained in the evidence files.

Changed backend `src/errors/errorHandler.js` to omit stack traces from API responses in every environment. Existing server-side diagnostic logging and response status/message/code/details remain intact. Added a non-production regression test preserving the safe operational response envelope.

The running development backend picked up the change. Repeating the same live quote scenario returned **409 with the same business error and no internal stack**. The information-disclosure defect is fixed; quote creation is still blocked. The journey was not continued past that boundary.

## Scenario results

Only actual backend/browser behavior supports PASS below. Local automated tests are listed separately.

| Scenario | Result | Evidence | Notes |
| --- | --- | --- | --- |
| Backend/API/database connectivity | PASS | Real GET health and database health: 200 | Database mock mode disabled in inspected environment |
| Runtime API configuration | PASS | Browser Axios base equals local backend URL | Production placeholder separately unresolved |
| A: Home loads branches and fleet | PASS | Real branches/featured responses: 200 | No fixtures |
| A: Valid branch and pickup/return search | PASS | Actual Home form submission and availability response: 200 | Exact selected IST date-times asserted |
| A: Search persistence and refresh | PASS | URL comparison after reload | Branch, pickup and return unchanged |
| A: Browser back/forward | PASS | Search → details → back → forward | Original trip query retained |
| A: Desktop/mobile result layout | PASS | 390, 768, 1024, 1440 px | Live results; no horizontal overflow |
| A: Mobile filter drawer | PASS | Open/close at 390 and 768 px | Trip context retained; filter mutation combinations not exhaustively tested |
| B: Real quote request with correct vehicle/dates | PASS | Recorded POST body above | Response rejected for business approval, not payload shape |
| B: Successful pricing quote | FAIL | POST quote: 409 | Intentional pending approval gate |
| Pricing approval: live data diagnosis | PASS | Read-only actual database inspection | Global pending setting; vendor taxProfile null |
| Pricing approval: unauthenticated review/completion denied | PASS | Actual GET and POST new endpoints: 401 | No approval write occurred |
| Pricing approval: authorized completion and concurrent retry | BLOCKED | Approved policy and authorized live admin session unavailable | Local regression tests are separate |
| B: Correct INR total, taxes and fees | BLOCKED | No successful quote returned | Catalog daily rate does not establish final amount |
| B: Quote expiry and expired-quote recovery | BLOCKED | No quote issued | TTL configuration is not live expiry evidence |
| B: Price change handling | BLOCKED | No initial successful quote | No pricing records were changed to force a result |
| B: Unavailable-vehicle quote handling | BLOCKED | No separate controlled unavailable scenario reached | Not inferred from generic 409 |
| B: Backend error visible in UI | PASS | Inline approval error matches actual response | No silent fallback price or booking |
| B: No internal stack in API errors | PASS | Before fix: present; exact live retry after fix: absent | Fixed narrow backend disclosure defect |
| C: Guest reaches selected car/quote action | PASS | Real guest browser flow | Quote gate prevents booking continuation |
| C: Login and original destination/branch/date resume | BLOCKED | Journey stopped at quote | No dedicated customer credentials supplied during run |
| C: Old quote clearing and fresh authenticated quote | BLOCKED | No successful guest quote/login | Source behavior is not counted as live PASS |
| C: Authenticated refresh-token/session restoration | BLOCKED | No authenticated session established | Guest 401/refresh 401 is not restoration proof |
| D: Booking creation, owner, vehicle, dates and amount | BLOCKED | No quote token | No booking created |
| D: Idempotency, duplicate click and retry behavior | BLOCKED | No reservation attempted | Existing unit tests do not establish live behavior |
| D: Expired hold recovery | BLOCKED | No hold created | No timestamps or database state manipulated |
| E: Razorpay order and checkout opening | BLOCKED | No eligible booking | TEST configuration inspected only |
| E: Successful/failed/cancelled payment | BLOCKED | No checkout reached | No real-money or test-provider payment attempted |
| E: Verification/retry/duplicate callback safety | BLOCKED | No provider transaction | No forged callbacks or signatures |
| F: Pending/processing/confirmed/failed/cancelled status | BLOCKED | No new booking ID | Existing historical records not substituted for this journey |
| F: Refresh during payment processing | BLOCKED | No processing payment | No fabricated state transitions |
| G: New booking in My Bookings | BLOCKED | No reservation | Information/status/amount/date/vehicle checks blocked |
| G: Booking details navigation | BLOCKED | No authenticated booking | Not inferred from frontend route existence |
| H: Invoice availability and correct contents | BLOCKED | No successful payment | No historical invoice used to stand in for new booking |
| H: Invoice download/open | BLOCKED | No invoice from this journey | Local PDF tests are separate |
| I: Cancellation eligibility/request/status/refund | BLOCKED | No reservation/payment | No changes to existing customer bookings |
| I: Duplicate cancellation and refresh recovery | BLOCKED | Cancellation not attempted | No replay evidence |
| J: Home search form at all requested widths | PASS | Real branches/form at 390, 768, 1024, 1440 px | Rendering tested; actual initial submission was at 1440 px |
| J: Live gallery/details at all requested widths | PASS | Real details/image requests and layout checks | Actual image loaded; fullscreen and zoom exercised |
| J: Desktop sticky card | PASS | Live card computed position checked | Quote still rejected |
| J: MobileBookingCTA | PASS | Quote action visible with real selected vehicle at 390 px | Reservation/payment action remains blocked |
| J: Razorpay launch, confirmation, My Bookings responsive | BLOCKED | Downstream of failed quote | No mocked screenshots counted |

## API compatibility review

- Live branches, featured catalog, availability search and vehicle details return shapes consumed successfully by the current frontend. Availability accepts branchId, ISO offset times and pagination; the observed browser payload matches.
- Quote payload matches the current validator. The new business-approval gate is the live incompatibility with completing the requested journey in this environment.
- Booking source expects quoteToken plus Idempotency-Key, matching the frontend service. Payment source expects bookingId for orders and bookingId plus the three Razorpay verification fields, also matching the frontend service. These are source comparisons only; live writes were blocked.
- Further source-review concerns remain unvalidated: the quote normalizer omits top-level financialSnapshot used by tax presentation; after issuer approval, configured tax policies can require authenticated customer billing information before issuing a quote. Those paths need live follow-up after business configuration is resolved. No frontend business logic was changed speculatively.

## Network summary

The companion JSON records actual critical requests with method, endpoint, HTTP status, purpose and result. Request bodies are retained only for public availability and quote requests. Passwords, bearer tokens, cookies, provider secrets and customer profiles are not recorded.

| Method | Endpoint | HTTP status | Purpose | Result |
| --- | --- | --- | --- | --- |
| GET | /api/v1/health | 200 | Connectivity and live data selection | Success |
| GET | /api/v1/health/database | 200 | Connectivity and live data selection | Success |
| GET | /api/v1/locations/branches | 200 | Read live catalog/location data | Success |
| GET | /api/v1/auth/me | 401 | Restore guest session | Authentication required. Provide a Bearer token. |
| POST | /api/v1/auth/refresh | 401 | Restore guest session | Refresh token is required. |
| GET | /api/v1/cars/featured | 200 | Read live catalog/location data | Success |
| POST | /api/v1/availability/search | 200 | Search actual availability | Success |
| GET | /api/v1/cars/080cbda9-d5fe-4e6d-bf04-a25e2755a9a7 | 200 | Read live catalog/location data | Success |
| POST | /api/v1/pricing/quote | 409 | Create real trip quote | PARTIALLY_APPROVED_REQUIRES_RATE_AND_CESS_CONFIRMATION |

## Validation after the backend fix

| Check | Result | Evidence | Notes |
| --- | --- | --- | --- |
| Frontend lint | PASS | 0 errors, 33 existing warnings | No new frontend application changes |
| Frontend unit tests | PASS | 9/9 | Local tests, not live journey evidence |
| Frontend production build | PASS | Vite build completed | API URL still requires deployment configuration |
| Focused backend tests | PASS | 2 suites, 26 tests | Error handler plus tax snapshot/approval gate |
| Full backend tests | PASS | 51 suites, 315 tests | Suite uses its existing test database mock; not live UAT evidence |
| Exact live quote retry | FAIL | Same real POST: 409; stack absent | Approval gate remains intentional and unchanged |
| Backend/frontend whitespace checks | PASS | git diff --check | No whitespace errors |

No additional live booking/payment integration test was possible beyond the quote boundary. The backend suite's provider/database doubles do not count as live payment PASS results.

## Records, files and next requirements

- Bookings created: **none**.
- Payment orders/transactions/refunds created: **none**.
- Customer records, inventory, pricing and billing configuration changed: **none**.
- Backend files changed: `src/errors/errorHandler.js`, `tests/error-handler.test.js`.
- Frontend-repository files created: this report, `docs/LIVE-CARONRENT-NETWORK.json`, `docs/LIVE-CARONRENT-BEFORE-FIX.json`, `scripts/live-caronrent-uat.mjs`.
- Prior redesign files remain as they were at the start of this UAT task.

To resume: follow the approval workflow below with legitimately approved vehicle/category GST and CESS decisions. Then provide a dedicated customer account with the required billing prerequisites and retry the exact quote scenario before progressing to booking and configured Razorpay test checkout. No production-readiness claim is justified until all critical blocked scenarios have real evidence.

## Pricing Approval Investigation

### Root cause and execution path

The original request is valid. The rejection is an intentional global billing approval hold, combined with genuinely missing completion functionality. It is not a partially approved `CarPricing`, vehicle, branch, or vendor-verification status.

Backend path: `src/routes/index.js` mounts `/pricing` -> `src/modules/pricing/routes.js` POST `/quote` (optional authentication plus strict validator) -> `QuoteController.create` -> `createTrustedQuote` -> `checkCarAvailability` -> direct Prisma queries for `CarPricing`, `Vendor.taxProfile`, and `Setting`. There is no pricing repository abstraction. Prisma models map to `car_pricing`, `vendors`, and `settings`.

Exact condition in `src/modules/pricing/service.js`:

```js
const issuerConfig = await prisma.setting.findUnique({
  where: { key: 'billing.issuer.phase7b.pending' },
});
// Existing source throws the 409 when:
issuerConfig && JSON.parse(issuerConfig.value).status ===
  'PARTIALLY_APPROVED_REQUIRES_RATE_AND_CESS_CONFIRMATION'
```

`tax.blocked` creates the 409 AppError. Neither `isActive` nor vehicle/vendor/branch ownership limits this check. Setting `isActive=true` alone cannot fix it. This quote logic was not modified.

### Actual live data diagnosis

Read directly from the configured real database on 2026-09-15. IDs are operational identifiers; customer data, issuer address/GSTIN, tokens and secrets are excluded. “Absent” means no stored confirmation; active rental pricing is not evidence of tax approval.

| Entity | ID | Current Status | Rate | Rate Confirmed | CESS | CESS Confirmed | Tax Configuration | Effective From/To | Problem |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Car | `080cbda9-d5fe-4e6d-bf04-a25e2755a9a7` | available; not deleted | Via pricing below | No car-level field | Via vendor profile | No car-level field | Vendor below | N/A | No approved vendor policy |
| Vendor | `564ebf45-1cae-4ca1-a29e-d4794733b57c` | active | No GST rate | Absent | Absent | Absent | `taxProfile=null` | No tax validity fields | Policy not installed |
| Branch | `d5f9c996-6a74-47d0-b2e3-2a75688486a9` | active | N/A | N/A | N/A | N/A | Does not own gate | N/A | No branch defect found |
| CarPricing | `6e3f21b1-cb22-47a3-a596-48095607704f` | active | INR 210/hour; 2,100/day; 12,500/week; 42,000/month | No tax confirmation fields | N/A | N/A | Currency INR; deposit 3,500 | 2026-09-01 00:00 IST / unbounded | Rental price exists; not tax approval |
| Global billing Setting | `2b8410cb-c275-4bde-a426-afd7376b9af8` | PARTIALLY_APPROVED_REQUIRES_RATE_AND_CESS_CONFIRMATION; private; inactive | `tax.gstRateBps=null` | Absent | `tax.compensationCess=null` | Absent | `commercialStructureApproval=null`; SAC 997311; vehicle/category scope | No validity fields | Global approval incomplete |

The selected pricing also stores extra-hour INR 230 and extra-km INR 13. Selection uses active records effective at pickup, then latest effective-from/created-at/ID; it does not validate coverage through return. The same 24-hour trip yields a **calculated rental subtotal** of INR 2,100 from the stored rate, but no trusted quote exists and no tax, CESS or final total has earned live PASS.

The pending record explicitly records `self_drive_without_operator`, `igst_section_12_2`, refundable deposit not consideration, and missing commercial-structure approval. Invoice numbering and UAT recipient approval flags already exist; they do not approve GST or CESS and were not changed.

### Required state and confirmation mechanisms

- Existing `Vendor.taxProfile` must contain an approved identity/version plus `vehicleRates`: each vehicle or category selector, `approved=true`, integer `gstRateBps`, and explicit integer `cessRateBps`. Vehicle overrides take precedence; category assignments are in the profile JSON, not a `Car.categoryId` schema field.
- `selectVehiclePolicy` rejects absent confirmation and **all nonzero CESS** with `APPROVED_CESS_IMPLEMENTATION_REQUIRED`. Explicit zero is supported only when actually approved by the business; zero was not assumed here. A nonzero decision needs separately approved calculation basis and invoice implementation.
- Effective monetary pricing remains in `CarPricing`; no separate rate/cess confirmation columns or tax-effective-date fields exist. Tax policy version and approval flags are distinct from active rental pricing.
- The global setting may complete only after the reviewed policy scope is validated and an authorized administrator explicitly confirms rates, CESS, taxation, and global scope with approval references. This run did not perform that transition.

### Existing admin workflow and missing capability

Inspected backend routes, vendor validators, fleet pricing controller, Prisma schema, operator script, tax tests and admin sources. Admin `/pricing/approvals` mounts `src/pages/pricing/PricingApprovals.jsx`, but uses a permanently empty local versions array. Its handler suppresses API failures and displays a success toast; it does not provide billing approval. `pricingVersion.service.js` declares pricing-version endpoints without backend integration. No GST/CESS fields or global completion route existed there.

Fleet `/fleet/:carId/pricing` create/update requires `fleet.update` and manages rental rates/status/effective dates. Vendor verification manages vendor verification status, not `taxProfile`. The existing `scripts/configure-tax-policy.js` validates and installs an explicitly approved full vendor policy, but does not complete the pending global setting or provide an admin approval audit.

Implemented the missing **completion API**, reusing that existing policy-installation command and the authoritative tax validator. No replacement tax editor, pricing-version mechanism, or admin UI was added. Detailed operator instructions: [backend approval workflow](../../rentcar-backend/docs/billing-approval-workflow.md).

Exact sequence: obtain documented business approvals -> authorized operator installs complete vendor policies -> SUPER_ADMIN GET `/api/v1/admin/billing-approval` reviews actual configuration/prices and `reviewHash` -> resolve blockers -> POST `/api/v1/admin/billing-approval/complete` with that hash, UUID idempotency key, four explicit confirmation booleans, and rate/cess/commercial approval references. Because the existing gate is global, the completion checks all non-deleted cars, not just the UAT car. Actual scope is 15 cars, one vendor and 16 active pricing records.

The API uses existing DB-backed authentication, SUPER_ADMIN authorization, strict server validation, monetary/date checks, serializable transactions, optimistic review comparison, compare-and-swap update, and atomic audit. Identical actor/body/key retries return the same approval ID; conflicting retries and stale reviews fail. It preserves historical configuration and private/inactive flags. Human approval references do not themselves prove legal validity; the administrator must review the referenced decisions.

### Changes and validation

Current investigation changes:

- Backend created: `src/modules/billingApproval/service.js`, `src/modules/billingApproval/routes.js`, `tests/billing-approval.test.js`, `docs/billing-approval-workflow.md`.
- Backend modified: `src/routes/index.js` to mount the protected API before the generic admin placeholder. Previous error-handler/test fix remains uncommitted.
- Frontend repository: updated this report and `scripts/live-caronrent-uat.mjs` to accept the quote controller's actual 201/other 2xx success status; created `docs/LIVE-PRICING-APPROVAL-NETWORK.json`.
- UI components created/removed: none. Customer routes, quote service, authentication, reservation, idempotency and payment implementations: unchanged. Admin frontend and database schema: unchanged.
- Data changes, bookings, orders, payments, refunds: **none**. No policy installation or approval-completion mutation was attempted.

| Scenario | Result | Evidence | Notes |
| --- | --- | --- | --- |
| New backend module lint | PASS | ESLint on module and regression test | No errors |
| Focused backend regressions | PASS | 3 suites, 53 tests | Local fixtures only; not live UAT |
| Full backend regression suite | PASS | 52 suites, 342 tests | Includes 27 approval tests; mocked test database |
| Frontend lint | PASS | 0 errors, 33 existing warnings | Customer UI unchanged |
| Frontend tests | PASS | 9 tests | Local regression evidence only |
| Frontend production build | PASS | Vite completed | Deployment API still placeholder |
| Real backend and database | PASS | GET health and database: 200 | Actual configured environment |
| New API authentication boundary | PASS | GET review and POST complete without auth: 401 | Safe AUTH_UNAUTHORIZED, no stack |
| Real approval scope inspection | PASS | Read-only service against real DB | Missing profile correctly identified; no write |
| Authorized approval and real-DB concurrency/rollback | BLOCKED | No approved policies or authorized live admin session | Unit transaction doubles do not prove live locking |
| Exact original quote retry | FAIL | Actual POST: 409, same code, no stack | Business approval remains incomplete |
| Approved quote amount/tax/CESS/expiry | BLOCKED | No approved quote | No invented rates or successful result |
| Login/resume/reservation/payment/status/invoice/refund | BLOCKED | Stop at quote boundary | Earlier blocked matrix remains unchanged |

Retest evidence: [sanitized approval investigation network ledger](LIVE-PRICING-APPROVAL-NETWORK.json), captured 2026-09-15T06:33:26Z. The backend picked up the route addition; live requests reached the new authentication boundary. These were actual network calls, not intercepted responses.

### Unresolved blockers and next legitimate action

Supply documented vehicle/category GST and CESS decisions plus commercial-structure approval; install the approved full vendor profile and have a SUPER_ADMIN complete the reviewed global approval through the documented API. An approval-document path/reference was requested; none was supplied during this run. Neither repository code nor UAT can choose these business values.

Source inspection identifies a further prerequisite: after policy activation the exact **guest** request will hit `CUSTOMER_BILLING_REQUIRED`. The backend requires authenticated recipient billing before an approved quote. Preserve the exact car/trip and regenerate after legitimate login and recipient configuration; do not promise a guest 2xx or bypass that requirement. Live login/resume compatibility, approved quote presentation, and all downstream payment/invoice/refund scenarios remain unverified.

The new completion workflow also needs successful authenticated real-database UAT and concurrency/rollback verification in an appropriate approved test environment. No production-readiness declaration is justified.

## Business approval operational readiness

**READY FOR BUSINESS APPROVAL.** This section supersedes the earlier statement that no admin UI exists. The live approval itself remains pending; no business decisions were supplied or persisted.

Implemented admin `/pricing/approvals` using the existing completion API and shared authenticated client. It displays vendor/vehicle/branch context, stored policy and proposed complete replacement, commercial prices and effective dates, current/last review, structured Quote Readiness, and recent billing audit records. It provides an approved-policy JSON editor with explicit attestation and a save confirmation dialog; final completion requires three references, four unchecked-by-default confirmations, and a separate dialog summarizing the exact policies and prices. Controls prevent duplicate clicks; ambiguous completion retries preserve the operation key/body; stale reviews require refresh.

Backend additions within the existing approval module: guarded `PUT /admin/billing-approval/vendors/:vendorId/tax-profile` for the previously missing profile-save API; structured read-only readiness and recent audit results on the existing GET; approval scope hash for detecting stale completed reviews. Profile saving validates the authoritative schema, vendor ownership, full coverage, money/dates and supported CESS, then saves profile and audit together without completing the global gate. No duplicate completion API or customer quote changes were made.

Exact prerequisites, field names/types/allowed values/validation/format-only examples, business-versus-admin-versus-system ownership, and the deliberately unchecked operational checklist are in [Pricing Approval Operations](../../rentcar-admin/docs/PRICING-APPROVAL-OPERATIONS.md). Supported GST/CESS structures and missing tax-effective-date/applicability fields are documented rather than invented.

| Scenario | Result | Evidence | Notes |
| --- | --- | --- | --- |
| Backend full regression suite | PASS | 52 suites, 350 tests | Local test database; not live approval evidence |
| Unauthenticated / CUSTOMER / VENDOR / PLATFORM_ADMIN denial | PASS | Existing unauthorized checks plus DB-backed HTTP role tests | Local authorization evidence; SUPER_ADMIN permission also tested through router |
| Valid SUPER_ADMIN completion | PASS | HTTP request through actual router with isolated fixture data | Local test only; live approval was not performed |
| Admin lint | PASS | ESLint, no reported errors/warnings | New page/service/helpers |
| Admin tests | PASS | 7 tests | Includes explicit confirmation and payload safeguards |
| Admin production build | PASS | Vite build completed | Local artifact |
| Admin responsive review and confirmation dialog | PASS | 390, 768, 1024, 1440 px in Chrome | Isolated component fixture; no live API used; cancellation made zero writes |
| Frontend lint / tests / build | PASS | 0 errors, 33 existing warnings; 9 tests; Vite build | Customer application unchanged |
| Real read-only readiness inspection | PASS | Configured DB: BLOCKED, 15 cars, one vendor, zero profiles | Setting updatedAt still 2026-09-09T10:00:09.344Z |
| Authorized live approval / downstream journey | BLOCKED | Business decisions intentionally not entered by agent | All prior downstream live scenarios remain blocked |

Current live diagnostic codes: `MISSING_VENDOR_TAX_PROFILE`, `GST_DECISION_REQUIRED`, `CESS_DECISION_REQUIRED`, `RATE_CONFIRMATION_REQUIRED`, `CESS_CONFIRMATION_REQUIRED`, `TAX_CONFIRMATION_REQUIRED`, and `TAX_POLICY_CONFIGURATION_INVALID`.

Files changed in this operational-readiness increment:

- Admin: `src/pages/pricing/PricingApprovals.jsx`, new `src/services/billingApproval.service.js`, new `src/utils/billingApproval.js`, new `tests/billing-approval.test.mjs`, new `tests/approval-browser.mjs`, new `docs/PRICING-APPROVAL-OPERATIONS.md`.
- Admin live-access evidence: `docs/PRICING-APPROVAL-ACCESS-CHECK.json` records actual unauthenticated GET/PUT/POST rejection (401, no stacks); no approval mutation occurred.
- Backend: `src/modules/billingApproval/service.js`, `src/modules/billingApproval/routes.js`, `tests/billing-approval.test.js`, `docs/billing-approval-workflow.md`.
- Customer frontend repository: this report only. Prior redesign, live runner, and earlier fixes remain uncommitted and were preserved.
- Admin HEAD: `3401a4f96c40c532daacfb93b9600a6da68b3fb3`, with the above working-tree changes. Backend/frontend commits remain those recorded earlier.
- UI components removed: no shared components; the disconnected page implementation was replaced in place. Customer routes/API integrations unchanged. No database migration, live configuration update, booking, order, payment or refund.

Remaining operator action: supply approved policies and commercial/tax references, review and save through the SUPER_ADMIN UI, then explicitly complete global approval. Unsupported nonzero CESS must remain blocked. Successful live approval and real transaction concurrency/rollback still require authorized business configuration. Only after that may live customer UAT resume. **This is not a production-readiness declaration.**

## Latest resume check after reported business approval

Result: **CARONRENT NOT PRODUCTION READY**.

The authoritative `billingApproval.review` service was invoked read-only against the currently configured backend database, using the same service as GET `/api/v1/admin/billing-approval`. This was a direct service/database check, not an authenticated HTTP request; no HTTP status is claimed. No mocks or fixtures were used. Timestamp, environment and complete sanitized blocker list are in [resume readiness evidence](LIVE-READINESS-RESUME.json).

Observed state:

- Readiness: **BLOCKED**, 35 blockers (15 GST decisions, 15 CESS decisions, missing profile, three final confirmations, invalid tax configuration).
- Vendor `564ebf45-1cae-4ca1-a29e-d4794733b57c`: no configured tax profile; zero configured profiles across the one-vendor scope.
- Global setting `2b8410cb-c275-4bde-a426-afd7376b9af8`: `PARTIALLY_APPROVED_REQUIRES_RATE_AND_CESS_CONFIRMATION`; updatedAt remains `2026-09-09T10:00:09.344Z`.
- Exact previously selected car still has `GST_DECISION_REQUIRED` and `CESS_DECISION_REQUIRED`.
- Other distinct codes: `MISSING_VENDOR_TAX_PROFILE`, `RATE_CONFIRMATION_REQUIRED`, `CESS_CONFIRMATION_REQUIRED`, `TAX_CONFIRMATION_REQUIRED`, `TAX_POLICY_CONFIGURATION_INVALID`.

| Scenario | Result | Evidence | Notes |
| --- | --- | --- | --- |
| Quote Readiness prerequisite | BLOCKED | Real read-only service returns 35 blockers | Expected READY with zero blockers was not met |
| Exact quote retry and amount/tax/expiry verification | BLOCKED | Stopped before quote request | Explicit user stop boundary |
| Login/resume, booking, Razorpay TEST, status, bookings, invoice | BLOCKED | No requests attempted | No downstream PASS inferred |
| Expiry/unavailability/idempotency/payment recovery/cancellation/refund | BLOCKED | Prerequisite not met | No synthetic states or callbacks |
| Final live journey at four widths | BLOCKED | No eligible live journey | Earlier isolated UI tests are not substitute evidence |
| New backend/admin/frontend regression run | BLOCKED | Stopped at readiness as instructed | Prior validation remains historical; no application code changed this attempt |

Bookings created: none. Payments/orders/refunds created: none. Cleanup required: none. Live configuration changes: none. Only this report and the sanitized readiness evidence file changed in this attempt.

Required resolution: identify the backend environment where the authorized approval was completed and verify that this frontend/backend use that intended environment. If this is the intended database, the authorized operator must verify that the policy save and final completion actually persisted here. Do not re-enter guessed values or reset statuses. Resume only when this environment's readiness reports READY with zero blockers.

## GST registration implementation — code and tests only

**READY FOR GST REGISTRATION STATUS DECISION.** No live UAT, policy decision, issuer/GSTIN update, approval completion, booking, payment or refund was performed in this implementation task.

Added first-class conditional REGISTERED/UNREGISTERED seller policies, registration-aware readiness/audit, guarded renewed approval after policy changes, unregistered quote/document presentation, and safe customer pricing messages. Unregistered is represented as explicit noncollection, not registered GST at 0%. Existing registered calculations and historical invoice snapshots are retained. No SQL migration or automatic conversion of live data occurred.

The exact architecture, changed files, conditional fields, compatibility boundaries and remaining decisions are documented in [GST registration implementation](GST-REGISTRATION-IMPLEMENTATION.md) and the linked backend policy guide. The retired unaudited operator script no longer writes data; use the authenticated SUPER_ADMIN workflow.

| Scenario | Result | Evidence | Notes |
| --- | --- | --- | --- |
| Backend registered/unregistered regressions | PASS | 53 suites, 373 tests | Isolated test store/provider doubles; not live approval/payment evidence |
| Admin lint/tests/build | PASS | Clean lint; 9 tests; Vite build | Conditional status/GSTIN and confirmation checks |
| Customer lint/tests/build | PASS | 0 errors, 33 existing warnings; 12 tests; Vite build | Financial snapshot preserved and customer-safe errors |
| Registered/unregistered quote and invoice responsive presentation | PASS | Isolated browser checks at 390/768/1024/1440 px | No live APIs; no fake zero GST rows for unregistered |
| Admin status selection and confirmation dialog | PASS | Isolated browser checks at all four widths | No mutation on cancel; explicit status selection |
| Actual seller registration/issuer/document decision | BLOCKED | Intentionally left to authorized business approver | No status inferred from current GSTIN |
| Real quote/payment/invoice journey | BLOCKED | Not attempted during code-only task | Previous live blockers/results remain historical |

Remaining business input: actual legal seller and registration status, approved issuer details, supported GST/CESS or noncollection decisions, commercial values, unregistered document title/mandatory content where applicable, new policy version and approval references. This implementation does not establish production readiness.

## Resume after reported seller configuration — 2026-09-15 10:47:44 UTC

Read-only invocation of the authoritative `billingApproval.review` service against the configured development database (`TEST_DATABASE_MOCK=false`). This is a real database check, not a mocked response or an authenticated HTTP request. No HTTP status is claimed for this direct service invocation.

Observed vendor `564ebf45-1cae-4ca1-a29e-d4794733b57c`: `taxProfile=null`; registration status, approved policy version, and approved document title are absent. Absence of GSTIN does **not** establish UNREGISTERED status. The global approval is still `PARTIALLY_APPROVED_REQUIRES_RATE_AND_CESS_CONFIRMATION`, with unchanged updatedAt `2026-09-09T10:00:09.344Z`.

| Blocker code | Scope | Count |
| --- | --- | --- |
| MISSING_VENDOR_TAX_PROFILE | Selected vendor | 1 |
| GST_REGISTRATION_STATUS_REQUIRED | Selected vendor | 1 |
| GST_DECISION_REQUIRED | 15 vehicles, including Hyundai i20 `080cbda9-d5fe-4e6d-bf04-a25e2755a9a7` | 15 |
| CESS_DECISION_REQUIRED | Same 15 vehicles | 15 |
| RATE_CONFIRMATION_REQUIRED | Global approval | 1 |
| CESS_CONFIRMATION_REQUIRED | Global approval | 1 |
| TAX_CONFIRMATION_REQUIRED | Global approval | 1 |
| TAX_POLICY_CONFIGURATION_INVALID | Global configuration validation | 1 |

The GST/CESS decision diagnostics under unknown status do not instruct the operator to enter numeric rates for an UNREGISTERED seller. The explicit registration decision must first select the appropriate conditional policy model.

| Scenario | Result | Evidence | Notes |
| --- | --- | --- | --- |
| Current seller configuration and Quote Readiness | BLOCKED | No profile/status; 36 blockers | Reported completion is not reflected in the configured database |
| Exact Hyundai i20 quote and tax/document checks | BLOCKED | No request attempted | User required stop on any blocker |
| Reservation/login/payment/invoice/refund journey | BLOCKED | No requests attempted | No amounts or successful states inferred |
| New final regression run | BLOCKED | Stopped at readiness as instructed | Prior 373/9/12 test results remain historical; no code changed |

No live data updates, bookings, orders, payments or refunds; no cleanup needed. Only this report changed. The authorized operator must verify which environment received the configuration and that the approved vendor policy plus final approval persisted in the backend used here. Do not auto-correct or infer seller status. Resume only after READY with zero blockers.

## Local tax bypass implementation and live quote — 2026-09-15

**READY FOR BOOKING/PAYMENT UAT** (local Razorpay TEST only). Not production readiness. Stopped after the requested quote; no live booking, payment, refund or customer account was created/modified.

Environment: development; real MySQL localhost:3306/rentcar; API http://localhost:5000/api/v1; mock database disabled; configured Razorpay key is TEST. Backend restarted as a hidden node process with process-scoped BYPASS_TAX_APPROVAL_FOR_UAT=true. No .env or approved business configuration changed. Startup logged `WARNING: TAX APPROVAL UAT BYPASS ACTIVE` at 11:31:49 UTC.

| Scenario | Result | Evidence | Notes |
|---|---|---|---|
| Exact Hyundai i20 live quote | PASS | POST /api/v1/pricing/quote → 201 at 11:32:02 UTC; [redacted response](UAT-BYPASS-QUOTE.json) | Real database/commercial pricing |
| Tax bypass metadata and totals | PASS | taxMode UAT_BYPASS; GST 0; CESS 0; rental 2100 + deposit 3500 = INR 5600 | No GSTIN, registration or rate fabricated |
| Configuration preserved | PASS | Vendor profile remains null; global approval pending; zero policy-save audit records | Actual readiness is not relabeled READY |
| Backend automated regression | PASS | 54 suites / 381 tests | Isolated automated tests, not live payment evidence |
| Admin tests / lint / build | PASS | 9 tests; lint and production build pass | Approval UI preserved |
| Customer tests / lint / build | PASS | 13 tests; lint 0 errors / 33 existing warnings; build pass | Tax rows hidden for UAT snapshots |
| Live booking/payment journey | BLOCKED | Intentionally stopped at requested boundary | Requires subsequent authorized UAT; no downstream PASS claimed |

Exact request: vehicle 080cbda9-d5fe-4e6d-bf04-a25e2755a9a7; vendor 564ebf45-1cae-4ca1-a29e-d4794733b57c; pickup 2026-09-22T10:00:00+05:30; return 2026-09-23T10:00:00+05:30. Duration 1440 minutes / 24 hours. Pricing record 6e3f21b1-cb22-47a3-a596-48095607704f: one day at INR 2100; additional charges 0; deposit 3500; total 5600. Quote 88554667-d38e-44b9-a5d3-edf3bc357e54 expires 2026-09-15T11:42:01.976Z. Regenerate an authenticated fresh quote when continuing.

Changes in this task:
- Backend: src/config/env.js, new src/config/uatTax.js, src/server.js; pricing/service.js and tax.js; bookings/service.js; invoices/snapshot.js, pdf.js and service.js; payments/service.js; new tests/uat-tax-bypass.test.js and docs/uat-tax-bypass.md.
- Admin: src/pages/bookings/FinancialDocuments.jsx (identifies UAT document without fake tax lines).
- Customer: src/utils/pricingPresentation.js; src/features/invoice/TaxBreakdown.jsx and InvoicePreview.jsx; package.json; new tests/uat-tax-presentation.test.mjs; this ledger and UAT-BYPASS-QUOTE.json.
- No routes or existing GST tests removed. No approvals, commercial pricing, existing bookings/payments or database schema changed.

Production ignores the bypass flag. UAT quotes are rejected if disabled or in production. UAT payment order creation requires TEST credentials. UAT receipt generation is disabled in production and contains no legacy GSTIN. Existing approval controls/readiness continue reporting legitimate business blockers. Disable the process flag and restart to restore normal local approval gating.

## Live customer UAT continuation — 2026-09-16

Overall: **LIVE BOOKING/PAYMENT UAT BLOCKED** at authorized customer login.

Real customer browser at localhost:5173; admin localhost:5174; API localhost:5000/api/v1; development / real MySQL localhost:3306/rentcar, database mocks disabled. RAZORPAY MODE: TEST (backend configuration inspected without exposing keys). No checkout opened or provider order created.

The running backend had lost the process-scoped UAT flag after restart. The first real browser POST /pricing/quote returned 409 PARTIALLY_APPROVED_REQUIRES_RATE_AND_CESS_CONFIRMATION. Restarted only the local backend with the previously authorized flag; startup at 04:54:19 UTC explicitly logged WARNING: TAX APPROVAL UAT BYPASS ACTIVE. No code, .env, tax profile, approval or commercial-price changes.

[Sanitized actual browser/network evidence](LIVE-UAT-SEP16.json).

| Scenario | Result | Evidence | Notes |
|---|---|---|---|
| Fresh Quote | PASS | Browser POST /api/v1/pricing/quote → 201 | Fresh ID 186013b4-a27f-42bc-9ea4-a87d28cfbdfa; UAT_BYPASS |
| Guest Reserve navigation | PASS | Clicked Sign In to Continue in actual customer UI | Login state retains vehicle, branch and dates; displays Your trip is saved |
| Anonymous session handling | PASS | GET /auth/me 401; POST /auth/refresh 401; car details 200 | Guest browsing continued without redirect loop |
| Authentication | BLOCKED | No authorized TEST account/session supplied | No credentials created or authentication bypass attempted |
| Login Resume | BLOCKED | Return destination preserved up to login | Successful login/refresh/session restoration not tested |
| Booking Creation | BLOCKED | Login boundary | No hold created |
| Booking Idempotency | BLOCKED | No authenticated booking request | No duplicate reservation created |
| Razorpay TEST Mode | PASS | Backend key classification TEST | No secrets recorded |
| Payment Order | BLOCKED | No booking | |
| Payment Success | BLOCKED | No order | |
| Payment Verification | BLOCKED | No payment | |
| Booking Status | BLOCKED | No booking | |
| Confirmation | BLOCKED | No booking | |
| My Bookings | BLOCKED | No customer session | |
| Booking Details | BLOCKED | No booking | |
| UAT Receipt | BLOCKED | No paid booking | |
| Payment Refresh/Retry | BLOCKED | No payment | |
| Payment Failure/Cancel | BLOCKED | No checkout | |
| Quote Expiry | BLOCKED | Authenticated booking endpoint needed to prove rejection | No clock/expiry changes |
| Availability Recheck | BLOCKED | No authenticated reservation attempt | Fresh quote availability passed; final reservation recheck untested |
| Cancellation | BLOCKED | No booking | |
| Refund | BLOCKED | No payment | |
| Database Consistency | BLOCKED | Zero bookings for target car created since run start; profile remains null | Complete booking/payment/invoice/refund relationship check requires completed flow |

Fresh quote: car 080cbda9-d5fe-4e6d-bf04-a25e2755a9a7; vendor 564ebf45-1cae-4ca1-a29e-d4794733b57c; branch d5f9c996-6a74-47d0-b2e3-2a75688486a9 (verified with read-only database query). Pickup 2026-09-22T10:00:00+05:30; return 2026-09-23T10:00:00+05:30. 24 hours. INR 2100 rental + 0 additional charges + 3500 security deposit + 0 GST + 0 CESS = 5600, independently checked. Expires 2026-09-16T05:04:20.286Z; regenerate after login, do not reuse after expiry.

Bookings/payments/orders/receipts/refunds created during this live run: none. Cleanup: none required. The local backend remains running with the process-scoped bypass active. Files changed in this run: this report and LIVE-UAT-SEP16.json only. No production implementation changes.

Next action: supply a secure local credentials-file path for an authorized TEST customer or an accessible signed-in customer browser session. No downstream PASS is inferred from automated tests. Business tax approval remains pending; no production-readiness claim.

| Scenario | Result | Evidence | Notes |
|---|---|---|---|
| Regression | PASS | Backend 54 suites / 381 tests; admin 9 tests + lint + production build; frontend 13 tests + lint + production build | Automated validation only, not live booking/payment evidence. Frontend lint: 0 errors / 33 existing warnings. |

## Authenticated LIVE UAT — 2026-09-16 (supersedes earlier login blocker)

Overall: **LIVE BOOKING/PAYMENT UAT BLOCKED** at real payment reconciliation. No production-readiness claim.

Environment: customer localhost:5173; admin localhost:5174; backend localhost:5000/api/v1; development with UAT_BYPASS; real MySQL localhost:3306/rentcar, mocks disabled. RAZORPAY MODE: TEST, checked immediately before order creation. Approved policies, commercial pricing and UAT implementation were not changed.

Credentials were used only for the actual login form; no credentials/tokens/cookies/signatures are in this evidence. An operator-requested visible browser launch was rejected by automatic approval review (`blocked by policy`, no further reason); authentication then succeeded in the existing browser. No login code changes or fabricated sessions.

[Sanitized network and quote evidence](LIVE-UAT-AUTH-RESUME.json).

### Critical boundary and recovery

Razorpay confirms TEST capture `pay_TcdzDHHiltBtqa` on order `order_Tcdwp4drSeyyGv` for INR 560000 paise. Local payment remains `pending`, local booking `PAYMENT_PENDING`. No receipt exists.

Configured TEST webhook:
`https://prerequisite-bench-gotten-prisoner.trycloudflare.com/api/v1/payments/webhook/razorpay`

Read-only provider webhook configuration returned HTTP 200; webhook active with payment.captured enabled. DNS lookup through a real GET probe fails `ENOTFOUND` (no HTTP status: request cannot reach host). Local webhook event count for this payment: zero. A cloudflared process targets localhost:5000, but that does not establish that the configured old public hostname is valid.

Observed browser behavior: initial checkout attempt displayed payment failure; retry opened Razorpay's official TEST bank Success/Failure page. Selecting Success produced an actual provider capture. No local POST /payments/verify was observed after that completion. Missing checkout callback delivery is observed; its precise cause is not established. The dead webhook endpoint independently prevents the authoritative capture event reaching this backend. No signature was synthesized and no status was manually changed.

**Next action:** establish a reachable TEST webhook URL to this backend, update the TEST provider webhook configuration and redeliver the genuine captured event through provider facilities. Then verify booking/receipt and continue. Do not initiate another payment for this order while the captured payment is unreconciled. No further payment/cancellation/refund attempt was made after discovering this boundary.

The TEST bank mechanism follows [Razorpay's official integration testing documentation](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/). These are provider TEST transactions, not intercepted responses or fabricated local success events.

### Result matrix

| Scenario | Result | Evidence | Notes |
|---|---|---|---|
| Fresh Quote | PASS | Browser POST /pricing/quote 201; guest quote 8220409a-c1d8-4e47-8012-f9c19cf928f8 | UAT_BYPASS, correct arithmetic |
| Authentication | PASS | Real POST /auth/login 200; refreshed /auth/refresh 200 and /auth/me 200 | Expected initial anonymous /auth/me 401 |
| Login Resume | PASS | Returned to same car with branch/pickup/return query intact | Guest quote cleared; Get Quote shown |
| Authenticated Fresh Quote | PASS | POST /pricing/quote 201; 982e3215-91e0-4a07-8da3-8add312c6d71 | New trusted quote after login |
| Booking Creation | PASS | POST /bookings 201; database customer match verified read-only | INR 5600, PAYMENT_PENDING |
| Booking Idempotency | PASS | Same quote/key → 200; different valid trip with same key → 409 CONFLICT | Database has exactly one booking for key |
| Razorpay TEST Mode | PASS | Backend credential mode checked before payment | Keys never recorded |
| Payment Order | PASS | POST /payments/orders 201; provider GET order 200 | 560000 paise = quote/booking INR 5600 |
| Payment Success | PASS | Provider GET order payments 200; pay_TcdzDHHiltBtqa captured | Provider TEST capture only; local confirmation failed |
| Payment Verification | BLOCKED | No local verify request observed; zero local capture events | Checkout callback unobserved; webhook DNS ENOTFOUND |
| Booking Status | FAIL | GET /bookings/:id 200 still PAYMENT_PENDING after provider capture, including refresh | Capture not reconciled |
| Confirmation | BLOCKED | Local booking not confirmed | Webhook delivery boundary |
| My Bookings | BLOCKED | Confirmed-booking journey stopped | No downstream completion claimed |
| Booking Details | BLOCKED | Confirmed-booking journey stopped | Pending status page and API were checked; final paid details unverified |
| UAT Receipt | BLOCKED | Invoice count 0 | Local payment not reconciled |
| Payment Refresh/Retry | FAIL | Checkout retry captured TEST payment; page refresh still pending | No duplicate local payment/order, but recovery incomplete |
| Payment Failure/Cancel | SKIPPED | An initial error was observed; no deliberate Failure/Cancel scenario completed | Stopped after capture mismatch to avoid another payment |
| Quote Expiry | SKIPPED | No expiry logic altered or expired quote reused | Stopped at payment boundary |
| Availability Recheck | SKIPPED | Overlapping quote returned 409 after hold | Quote availability verified; separate final-reservation race not exercised |
| Cancellation | BLOCKED | Captured payment not reconciled locally | Preserve booking for genuine-event recovery |
| Refund | BLOCKED | No locally succeeded payment to refund | Do not bypass supported refund flow |
| Database Consistency | FAIL | One local booking/payment/order, zero invoices/refunds; provider captured vs local pending | No duplicates, but payment-state relationship incomplete |

### Amounts and records retained

Trip: Hyundai i20 080cbda9-d5fe-4e6d-bf04-a25e2755a9a7; vendor 564ebf45-1cae-4ca1-a29e-d4794733b57c; branch d5f9c996-6a74-47d0-b2e3-2a75688486a9. Pickup 2026-09-22T10:00:00+05:30; return 2026-09-23T10:00:00+05:30; 24 hours. Authenticated quote expires 2026-09-16T08:40:50.530Z.

INR 2100 rental + 0 additional charges + 3500 deposit + 0 GST + 0 CESS = 5600. Quote = booking = provider order = captured TEST payment. Receipt equality remains blocked. No GSTIN or invented approval.

| Record | Safe ID | Final observed state |
|---|---|---|
| Booking | 07cf7a07-ca7e-4a99-83aa-93486199e8de / BK-AA79986CAD974B36 | PAYMENT_PENDING; hold expires 2026-09-16T08:45:52.298Z |
| Local payment | c4c32fe0-9b8e-443d-b135-0de3d5daa662 | pending, INR 5600; providerPaymentId null |
| Provider order | order_Tcdwp4drSeyyGv | One order; actual TEST captured payment linked |
| First provider attempt | pay_TcdyNGK5uShD5a | created; not captured |
| Successful provider attempt | pay_TcdzDHHiltBtqa | captured; 560000 paise |
| Invoice / refund | None | 0 / 0 |

Cleanup: no deletion, manual state repair or refund performed. Retain these records for reconciliation; no new payment should be created for this captured order. Changes in this run: this report and sanitized JSON evidence only. No application code changes.

### Post-UAT regression

| Scenario | Result | Evidence | Notes |
|---|---|---|---|
| Regression | PASS | Backend 54 suites / 381 tests; admin 9 tests, lint and production build; customer 13 tests, lint and production build | Rerun after the payment boundary. Customer lint: 0 errors / 33 existing warnings. Automated tests are not substitutes for live webhook/confirmation/receipt evidence. |

## Existing captured payment recovery — 2026-09-16

**LIVE BOOKING/PAYMENT UAT BLOCKED** pending genuine provider event redelivery. Public TEST webhook reachability has been restored. No new booking/payment/refund created. No financial record or application logic changed.

[Sanitized recovery evidence](LIVE-UAT-WEBHOOK-RECOVERY.json).

### Architecture audit (completed before changes)

1. Route: POST /api/v1/payments/webhook/razorpay (`src/modules/payments/routes.js`, backend).
2. Public URL: HTTPS tunnel origin plus that exact route; forwards to localhost:5000. Razorpay TEST stores the public URL. There is no backend webhook URL environment variable.
3. Backend secret: RAZORPAY_WEBHOOK_SECRET, configured; value never printed or changed. Provider readback reports secret_exists=true. Equality with provider secret cannot be independently proven until a genuine signature verifies.
4. Raw bytes: app.js mounts express.raw(application/json, 1mb) before normal JSON parsing. Controller requires Buffer body, x-razorpay-signature and x-razorpay-event-id.
5. Verification: HMAC-SHA256 over exact body using webhook secret; constant-time comparison. Unsigned probes reject with 400 PAYMENT_SIGNATURE_INVALID and write no event.
6. Payment events: payment.authorized, payment.failed, payment.captured. Refund events route to refunds service. Current original subscriptions: those three payment events plus refund.processed and refund.failed.
7. Captures: exported processWebhookLocked maps entity.order_id to Payment.providerOrderId and payment.bookingId to Booking, acquires a car lock before transaction reads, and compares amount in paise, currency and existing provider payment identity.
8. Invalid amount/currency/identity produces review_required; cancelled/overlapping-booking cases produce late_payment_conflict. No force-confirmation is permitted.
9. Valid capture writes payment succeeded/providerPaymentId, booking CONFIRMED/paymentStatus succeeded, status history and invoice in one transaction.
10. Idempotency: unique (provider,providerEventId); unique providerOrderId and providerPaymentId; duplicate already-confirmed payment check; existing invoice lookup/unique booking constraint. Live duplicate redelivery remains untested.
11. POST /payments/verify authenticates the customer and checks checkout HMAC(orderId|paymentId). It intentionally does not mark the booking paid; response says it awaits the capture webhook.
12. Booking/payment GET endpoints read local state. No existing server-side provider-fetch recovery route/job was found. payments/recovery.js classifies stored payment state rather than fetching provider truth.

### Diagnosis and configuration repair

Old Razorpay URL: https://prerequisite-bench-gotten-prisoner.trycloudflare.com/api/v1/payments/webhook/razorpay.
Existing cloudflared advertised a different hostname: portion-portrait-trailers-convicted.trycloudflare.com. Both returned DNS NXDOMAIN from Cloudflare DNS and ENOTFOUND through the local resolver. This proves stale/unusable public hostnames and configuration mismatch; it does not establish why Cloudflare removed their DNS records. Port/path on the local backend are correct.

Replaced the existing unusable quick tunnel using the already installed cloudflared and original localhost:5000 target. New connected tunnel:

https://fioricet-loop-panel-budgets.trycloudflare.com/api/v1/payments/webhook/razorpay

A real HTTPS POST with `{}` and no signature returned the same 400 PAYMENT_SIGNATURE_INVALID as localhost. This is a safe rejected reachability probe, not a fabricated captured event or evidence of a valid signed delivery.

Updated only existing TEST webhook TZmsMPcge7csUG using TEST credentials. URL-only PUT unexpectedly cleared event subscriptions; readback detected it and a second PUT immediately restored the original five enabled events. Final independent readback: correct new URL, active=true, capture subscription enabled, secret_exists=true. No secret field was sent, no secret regenerated, no .env edits, no LIVE webhook changed.

The tunnel remains running (PID 37420). Quick-tunnel URLs are temporary; keep this process alive while recovering the existing event.

### Genuine redelivery boundary

Accessible Razorpay Dashboard browser redirected to accounts.razorpay.com/auth/. Operator confirmed no retry control/session is available. No genuine capture event has arrived locally; no unsigned event was accepted and no signature/payload was fabricated.

[Razorpay's FAQ](https://razorpay.com/docs/webhooks/faqs/) documents event replay through Dashboard → Help → Have a query? → Technical Support → Issue regarding Webhooks/API. Ask for the existing payment.captured event for pay_TcdzDHHiltBtqa / order_Tcdwp4drSeyyGv to the new TEST URL. The FAQ specifies eligibility including an event younger than 15 days and the original webhook enabled at event time; the original secret has been preserved. No support message was sent from this session.

Automatic retries may arrive under the provider's documented retry policy, but none was observed for this payment through the last read-only check at 2026-09-16T09:46:31Z. Do not infer reconciliation from reachability alone.

### Missing recovery path — recommendation only

**MISSING PAYMENT RECONCILIATION RECOVERY PATH**

Recommend a separately reviewed server-side recovery operation/job that fetches the known provider payment/order with server credentials, verifies captured status and exact stored order/amount/currency/account-mode relationships, and enters the same transaction/locking/idempotency logic used by webhook capture. Include audit provenance, conflict handling and tests for duplicates, concurrent delivery, cancellations and late capture. Do not trust frontend values or synthesize webhook signatures. No such feature was implemented during this UAT.

### Results

| Scenario | Result | Evidence / exact boundary |
|---|---|---|
| Webhook DNS / Reachability | PASS | New HTTPS URL resolves and reaches signature-protected backend route; unsigned POST rejected 400 |
| Webhook Signature Verification | BLOCKED | Invalid unsigned request rejection verified; no genuine signed redelivery available |
| Existing Capture Redelivery | BLOCKED | No signed-in provider dashboard/replay facility available; no automatic event observed |
| Payment Reconciliation | BLOCKED | Provider captured, local pending; awaiting genuine capture |
| Webhook Idempotency | BLOCKED | First genuine delivery has not occurred |
| Database Consistency | FAIL | One booking/payment/order but provider captured vs local pending; zero receipts/refunds |
| Booking Status | BLOCKED | Cannot validate recovery until capture is processed |
| Confirmation | BLOCKED | Local booking remains PAYMENT_PENDING |
| My Bookings | BLOCKED | Confirmed journey depends on reconciliation |
| Booking Details | BLOCKED | Final paid details depend on reconciliation |
| UAT Receipt | BLOCKED | No reconciled paid booking; invoice count zero |
| Payment Refresh/Retry | BLOCKED | Refresh only reads pending local state; no provider-fetch recovery path |
| Payment Failure/Cancel | SKIPPED | No new payment allowed; preserve existing captured transaction |
| Quote Expiry | SKIPPED | Unrelated to existing-payment recovery; no new booking attempted |
| Availability Recheck | SKIPPED | No new booking permitted; no inventory mutation |
| Cancellation | SKIPPED | Preserve retained transaction pending reconciliation |
| Refund | SKIPPED | Explicitly prohibited for this phase |
| Regression | PASS | Backend 54 suites/381 tests; admin 9 tests + lint/build; customer 13 tests + lint/build; customer lint 33 existing warnings, zero errors |

Retained records: booking 07cf7a07-ca7e-4a99-83aa-93486199e8de; local payment c4c32fe0-9b8e-443d-b135-0de3d5daa662; order order_Tcdwp4drSeyyGv; provider payment pay_TcdzDHHiltBtqa captured 560000 INR paise. Local amount 5600 INR, PAYMENT_PENDING/pending, providerPaymentId unset. No cleanup/refund/manual repair performed.

Files changed this phase: docs/LIVE-CARONRENT-UAT.md and docs/LIVE-UAT-WEBHOOK-RECOVERY.json. Operational changes: replaced local quick-tunnel process and updated existing TEST webhook URL; preserved original event subscriptions and secret. Production readiness is not established.

## Provider-authoritative reconciliation implemented and LIVE verified — 2026-09-16

**LIVE PAYMENT RECONCILIATION PASSED** for the existing captured TEST transaction. This supersedes the missing-recovery-path blocker above. It does not establish production readiness or business GST approval.

### Implementation

- Added authenticated `POST /api/v1/payments/:bookingId/reconcile`, accepting an internal booking UUID and an empty JSON body. Customer ownership is checked before provider access; frontend financial/provider assertions are rejected.
- Reads the stored local order, fetches the Razorpay order and bounded payment collection, independently fetches the uniquely captured payment, and verifies identity, integer-paise amount, currency and booking/customer relationships. Multiple captured/competing attempts or local orders require review. A single captured payment with an earlier created/failed attempt is explicitly supported.
- Verified webhook captures and reconciliation share `finalizeCapturedPayment`. Both acquire the same car row lock as the first transaction operation, reread local state, and atomically update payment, booking, history and receipt. Unique constraints and existing conflict handling remain. Removed the confirmed-unused older webhook function to avoid maintaining duplicate settlement implementations.
- Reconciliation rejects/audits mismatches without financial changes. Existing signed-webhook mismatch handling remains review-required. Late authorization/failure events cannot downgrade captured/refunded money.
- Database-backed AuditLog claim limits provider checks to one per booking per 30 seconds across processes. Provider reads have 10-second timeouts; errors are sanitized. Already-settled requests use trusted stored status without another provider call.
- Booking Status now offers `Check payment with provider`: read normal status first, request server recovery if still unpaid, refetch authoritative booking/payment/receipt state. No client-side success mutation or aggressive provider polling.
- Existing worker infrastructure is email-specific. No scheduler framework was added; bounded scheduled recovery is documented as a future enhancement.

Architecture details: backend `docs/payment-reconciliation.md`. No database migration, secret rotation, GST policy change or UAT bypass change.

### Real recovery evidence

[Sanitized browser/network/database evidence](LIVE-PAYMENT-RECONCILIATION.json).

Used the existing authenticated customer session and actual `Check payment with provider` button. Network order: GET existing booking 200 → POST reconcile 200 → GET booking/payment/invoice 200. No new order, payment, booking or refund request occurred.

- Booking: 07cf7a07-ca7e-4a99-83aa-93486199e8de / BK-AA79986CAD974B36.
- Local payment: c4c32fe0-9b8e-443d-b135-0de3d5daa662.
- Stored/provider order: order_Tcdwp4drSeyyGv.
- Independently fetched captured TEST payment: pay_TcdzDHHiltBtqa.
- Amount chain: trusted authenticated quote INR 5600 = booking INR 5600 = provider order/payment 560000 paise = receipt INR 5600.
- Booking transitioned PAYMENT_PENDING → CONFIRMED; payment pending → succeeded, operationalStatus normal, exact providerPaymentId persisted.
- Audit: 33c8c409-c9f5-4ff3-be66-56ff0983c843, source provider_reconciliation, previous pending, provider captured, result reconciled. Timestamp 2026-09-16T09:58:39.299Z.
- Receipt: 3bf31feb-b6bd-4a25-a995-ee0b441a166d / INV-3bf31feb-b6bd-4a25-a995-ee0b441a166d, title UAT Receipt.

Two simultaneous authenticated replay requests each returned 200/already_settled. Final read-only database check: one booking, one local payment, one provider-payment association, one confirmation transition, one receipt, zero refunds. No manual DB repair or fabricated webhook was used.

### Frontend/document UAT

Direct Booking Status refresh restored the customer session and confirmed state. Confirmation displays the correct booking reference and INR 5600. My Bookings displays the reference exactly once; its View details action opens the correct booking. Details show Hyundai i20, confirmed state and UAT Receipt without fabricated GST fields.

Actual Download Invoice PDF button issued HTTP 200. Independently read the returned PDF bytes in memory and checked UAT Receipt title, booking/invoice/provider-payment references, INR 2100 rental, INR 3500 deposit and INR 5600 total. No GSTIN/CGST/SGST/IGST/CESS/GST 0% collection line or TAX INVOICE heading. No customer identity details or PDF contents were retained in evidence.

Live paid-details checks at 390, 768, 1024 and 1440px show the receipt/reference and no horizontal page overflow.

### Final matrix

| Scenario | Result | Evidence / limitation |
|---|---|---|
| Provider Fetch | PASS | Actual backend Razorpay reads; audited captured payment from stored order |
| Amount/Currency Validation | PASS | INR 560000 provider paise matches INR 5600 stored booking/payment |
| Payment Reconciliation | PASS | Actual customer endpoint 200; audit result reconciled |
| Booking Transition | PASS | CONFIRMED / succeeded persisted |
| Reconciliation Idempotency | PASS | Two concurrent live replays → already_settled; counts unchanged |
| Webhook-after-Reconciliation Safety | SKIPPED | No genuine provider replay available; automated ordering, duplicate and concurrency tests passed. No synthetic live webhook sent |
| Database Consistency | PASS | Exactly one logical payment/booking/confirmation/receipt, no refunds |
| Booking Status | PASS | Authoritative GET and direct refresh show confirmed |
| Confirmation | PASS | Correct booking/vehicle/amount visible |
| My Bookings | PASS | Existing booking appears once; details action works |
| Booking Details | PASS | Correct confirmed booking and UAT document displayed |
| UAT Receipt | PASS | Actual PDF HTTP 200; correct references/totals and no fabricated tax lines |
| Regression | PASS | Backend 56 suites / 424 tests; targeted backend lint; admin 9 tests + lint/build; customer 13 tests + lint/build |

Frontend lint retains 33 existing warnings and zero errors. Automated tests use isolated stores/provider doubles and are not represented as live payment evidence. The simulated concurrent-settlement test models MySQL row-lock serialization; the actual live concurrent repeat requests validate post-settlement idempotency. A genuine late provider webhook remains unobserved and is not claimed as live-tested.

Existing TEST webhook TZmsMPcge7csUG remains active with payment.captured enabled at https://fioricet-loop-panel-budgets.trycloudflare.com/api/v1/payments/webhook/razorpay. Secret retained. No actual webhook event was needed or fabricated for recovery. Keep the quick tunnel running for later provider delivery.

### Files changed / retained state

Backend: src/modules/payments/service.js, routes.js, providers/razorpay.js; new reconciliation.js; new tests/payment-reconciliation.test.js and tests/razorpay-reconciliation-provider.test.js; new docs/payment-reconciliation.md.

Customer: src/pages/BookingStatus/index.jsx, src/services/modules/paymentService.js; this report and LIVE-PAYMENT-RECONCILIATION.json. Admin: no code changes.

No new booking/payment/refund was created. One UAT receipt was generated by the normal trusted settlement transaction. The existing TEST booking remains CONFIRMED and its captured payment remains succeeded; no cancellation or refund performed. Local UAT bypass remains enabled; production still fails closed.

## Edge-case booking/payment and transactional email UAT — 2026-09-16

**EDGE-CASE BOOKING/PAYMENT UAT PARTIALLY PASSED**

### Environment and evidence limits

- Customer `http://localhost:5173`; admin `http://localhost:5174`; real backend `http://localhost:5000/api/v1`; development MySQL `localhost/rentcar`.
- Razorpay TEST keys verified before provider requests. Existing local `UAT_BYPASS` retained. No seller, commercial price, GST or approval configuration changed. No financial status was repaired through SQL.
- Commits: customer `83057ba`, backend `bb7ef75`, admin `867cf6f`; customer/backend contain pre-existing reconciliation work plus changes noted below.
- Browser used the real customer session, actual services and Razorpay's official TEST bank Success/Failure controls. No intercepted responses or fixture results count as live PASS.
- SMTP delivery used the existing durable `projectBooking` / `deliver` workflow, scoped to the two authorized paid bookings and the new cancellation/refund. Existing recipient allowlist matched. SMTP mode was explicitly selected for these scoped executions; `.env` was not changed.
- **Unattended email dispatch remains BLOCKED:** configured transactional mode is `disabled`, `TRANSACTIONAL_EMAIL_SINCE` is unset, and no continuous worker was enabled. Scoped real SMTP acceptance proves delivery capability, not an automatically running deployment.
- Inbox access was unavailable. SMTP `accepted` is not proof of inbox receipt.

### Scenario matrix

| Scenario | Result | Evidence | Notes |
|---|---|---|---|
| Payment Checkout Cancel | PASS | Official checkout Close → Yes, exit; booking/payment stayed pending; no receipt | UI showed closed-checkout message and retry |
| Payment Failure | PASS | Genuine TEST bank Failure; provider GET reports failed attempts; local payment failed | Booking stayed PAYMENT_PENDING; no receipt |
| Payment Retry | PASS | Same booking, new order, genuine TEST Success; captured webhook settled it | One authoritative successful payment; earlier failed attempt retained |
| Quote Expiry | PASS | Quote `fcba9262-3241-4e03-a011-28ca22651842` expired 10:27:10.792Z; booking request 10:27:31Z returned 422 | Fresh quote created a separate booking, subsequently cancelled; automatic frontend expiry-message UX not independently exercised |
| Booking Hold Expiry | PASS | After 10:31:22.141Z expiry, order creation returned 409; same trip became reservable | Both old and replacement unpaid bookings cancelled through API |
| Availability Race | PASS | Two overlapping quote-backed requests: 201 and 409 | Same vehicle/trip; car-row lock admitted only one booking |
| Cancellation Authorization | BLOCKED | Anonymous cancellation 401; injected refund amount/status 422 | Second controlled customer session unavailable for live ownership boundary |
| Customer Cancellation | PASS | Supported customer cancel API 200; CANCELLED persisted on read/replay | Original successful booking preserved |
| Cancellation Calculation | PASS | Existing policy refunds full captured payment before pickup: INR 5,600 | No cancellation fee or partial-refund policy exists in this flow; none invented |
| Razorpay TEST Refund | PASS | Provider refund `rfnd_TcfqI4ldGYL4y7` processed, 560000 paise; payment refunded | Correct payment/order/booking; amount equals captured amount |
| Refund Idempotency | PASS | Same cancellation key replayed; same refund ID; provider list has one refund | One cancellation history entry, no doubled refund |
| Refund Pending/Failure | SKIPPED | Actual refund completed immediately | No genuine controlled pending/failure facility established; no fake event sent |
| Webhook/Reconciliation Race | SKIPPED | Genuine capture webhook observed; concurrent arrival not controlled | Automated ordering/concurrency tests PASS separately; no live-race claim |
| Cross-Customer Security | BLOCKED | Anonymous operations 401; authority-field injection 422 | A second controlled customer session is still required |
| Database Consistency | PASS | Scoped final read-only audit in `LIVE-EDGE-CASE-UAT.json` | Failed attempts are retained history, not duplicate successful payments |
| Regression | PASS | Backend 56 suites / 427 tests; admin 9 tests + lint/build; customer 13 tests + lint/build | Customer lint: 0 errors, 33 existing warnings |
| Booking Confirmation Email | BLOCKED | Both paid bookings have one SMTP-accepted confirmation | Actual automatic worker operation is not configured; scoped dispatch PASS |
| Email Recipient Validation | PASS | Both notification recipients equal trusted booking customer email and existing allowlist | No frontend recipient input |
| PDF Attachment | PASS | Real SMTP messages carried generated PDF buffers; `%PDF-` validated | Both accepted records have invoiceAttached=true |
| PDF Amount/Reference Validation | PASS | Customer, vehicle, trip dates, rental, deposit, additional charges, total, booking/payment/document references matched | UAT Receipt; no fabricated GSTIN/CGST/SGST/IGST/CESS/tax-invoice lines |
| Email Dispatch | PASS | Two confirmation emails plus cancellation and refund email accepted by SMTP | One attempt each; no delivery error |
| Inbox Delivery | BLOCKED | No accessible mailbox / confirmation supplied | Do not infer from SMTP acceptance |
| Email Idempotency | PASS | Repeated projection/delivery after settlement and refresh retained same notification IDs, accepted status and attempts=1 | Automated webhook/reconciliation ordering projects one logical confirmation |
| Receipt/Invoice Idempotency | PASS | Exactly one persistent document per paid booking | Repeated reads, notification delivery and cancellation reuse it |
| Email Failure Safety | SKIPPED | No genuine SMTP failure induced | Automated rejection test preserves booking/payment/refund state |
| Email Retry | SKIPPED | Both actual confirmation deliveries succeeded first attempt | Existing retry path tested automatically; no fabricated live failure/retry claim |
| Cancellation/Refund Email | PASS | Both SMTP-accepted after actual cancellation/provider-processed refund | Trusted amount/status/reference; no premature completed-refund claim |

### Transactions and cleanup

| Purpose | Booking | Final state / cleanup |
|---|---|---|
| Preserved successful transaction | `07cf7a07-ca7e-4a99-83aa-93486199e8de` | CONFIRMED / succeeded; original `pay_TcdzDHHiltBtqa`, one original receipt; no cancellation/refund. First confirmation email delivered as authorized. |
| Natural unpaid hold expiry | `8608f292-f50e-4afa-af2e-984eeddf843f` | See final hold observation below. No payment captured. |
| Race winner; checkout cancel → failure → retry → cancellation/refund | `165cc3f6-b0d0-477d-ae58-97690ff9da78` | CANCELLED / refunded; one receipt, one cancellation, one processed full refund. |
| Fresh quote after expired-quote rejection | `ed9b97dd-045e-4896-bf7e-c60f752f746c` | CANCELLED through customer API; no order/payment/receipt/refund. |

New retry scenario provider records:

- Failed order `order_Tcfk2BddTzLE2c`; provider attempts `pay_TcfltXwOn6yDzy`, `pay_TcfmOG7Ui8n68a`, `pay_TcfmaHPhlsTPah` all failed. Initial bank-launch attempts did not complete; official Failure was then exercised. None captured money.
- Retry order `order_TcfnbiAy3jQ6Ng`; payment `pay_TcfnvtOAjitABw`: captured 560000 paise, subsequently fully refunded 560000 paise.
- Refund `rfnd_TcfqI4ldGYL4y7`; local refund `ab78340e-d6f5-4eba-b2bc-17e3ff57f2c7`: processed/succeeded.
- Original receipt `3bf31feb-b6bd-4a25-a995-ee0b441a166d`; new receipt `0461feab-84f3-4ce8-9df3-bdb3da651b5a`.
- Confirmation notifications `99ae484a-d26d-4ca7-8014-a72994b93228` and `090a7f1a-1426-448b-8d32-33edfd512687`; cancellation `a90a67db-028c-40a6-b39d-d759c6250184`; refund `f2872e2a-6ee0-4f6a-951c-011bc98eefdc`.

### Actual critical network evidence

`B` = new paid/refunded booking `165cc3f6-b0d0-477d-ae58-97690ff9da78`. OPTIONS preflight responses are excluded.

| Method | Endpoint | HTTP status | Result |
|---|---|---|---|
| POST | `/api/v1/auth/refresh` | 200 | Existing session refreshed during initial quote request |
| POST | `/api/v1/pricing/quote` | 201 | Real UAT quotes created |
| POST | `/api/v1/bookings` (overlapping concurrent attempts) | 201 / 409 | One booking; other rejected as unavailable |
| POST | `/api/v1/payments/orders` | 201 | Real TEST orders created/reused by customer flow |
| GET | `/api/v1/bookings/B` | 200 | Pending after checkout close/failure; settled after genuine capture; refunded after cancellation |
| GET | Razorpay `/v1/orders/order_Tcfk2BddTzLE2c/payments` | 200 | Three failed provider attempts |
| GET | Razorpay `/v1/orders/order_TcfnbiAy3jQ6Ng/payments` | 200 | One captured payment, 560000 paise INR before refund |
| POST | `/api/v1/payments/B/reconcile` | 409 | `A unique stored payment order is required for recovery.` |
| POST | `/api/v1/payments/B/reconcile` with arbitrary provider/status fields | 422 | Strict request validation rejects injected authority |
| POST | `/api/v1/bookings/B/cancel` with refund amount/status fields | 422 | Frontend cannot override trusted refund |
| POST | `/api/v1/bookings/B/cancel` | 200 | Cancellation and provider refund; same-key replay reuses result |
| GET | Razorpay `/v1/refunds/rfnd_TcfqI4ldGYL4y7` | 200 | Processed; correct payment; 560000 paise |
| GET | Razorpay `/v1/payments/pay_TcfnvtOAjitABw/refunds` | 200 | Exactly one refund |
| POST | `/api/v1/bookings` with naturally expired quote | 422 | `Invalid or expired quote token.` |
| POST | `/api/v1/bookings` with fresh quote | 201 | Recovery booking created |
| POST/GET | Anonymous reconciliation, cancellation, refund read and receipt download | 401 | Protected operations reject missing session |

### Fixes made in this phase

Backend only; no financial settlement, pricing, cancellation or refund policy changes:

- `src/services/email/transactional.js`: CaronRent branding; trusted pickup location/status/charge/payment-reference/support details; suppress artificial zero-tax lines in UAT/unregistered email; pass trusted lifecycle/payment reference to attached PDF; include refund status/reference; project a provider-API-verified processed refund even when its webhook is absent.
- `tests/transactional-email.test.js`: UAT-safe content, no confirmation for pending/failed payments, API-verified refund projection/deduplication.
- `tests/payment-reconciliation.test.js`: each single-settlement assertion also verifies repeated committed-state projection produces exactly one confirmation across webhook/reconciliation ordering cases.
- Customer documentation: this report and `docs/LIVE-EDGE-CASE-UAT.json`. No customer/admin UI changes in this phase. Earlier reconciliation edits remain intact.

### Remaining limitations / next actions

1. Configure and operate the existing transactional email worker with an approved start boundary/recipient scope. Scoped delivery tests did not enable unattended sending or change `.env`.
2. Obtain a second controlled customer session and execute live cross-customer reconcile/cancel/refund/document/email-read denials.
3. Confirm inbox receipt and attachments independently.
4. Genuine concurrent webhook/reconciliation delivery, SMTP failure/retry, and pending/failed refund remain unexercised live; automated coverage is reported separately.
5. Existing reconciliation rejects multiple stored orders even after a successful retry is already settled. Real webhook settlement passed, but recovery for a missed capture on a later retry is a known conservative limitation; do not remove the ambiguity guard merely for UAT.
6. No explicit transactional resend endpoint exists; ambiguous SMTP outcomes are quarantined rather than blindly resent. Definitive rejection retries use existing bounded exponential backoff (five attempts).
7. Production readiness is not claimed. UAT_BYPASS must be disabled and real seller/GST/business approval completed before production validation.

Provider reference: [Razorpay TEST Success/Failure facility](https://razorpay.com/docs/payments/payments/faqs/) and [refund state definitions](https://razorpay.com/docs/api/refunds/create-normal/). These document facilities/states; actual results above came from real TEST transactions.


### Final hold, responsive and cleanup observations

- At 10:31:36Z, hold `8608f292-f50e-4afa-af2e-984eeddf843f` still had the stored PAYMENT_PENDING label, but `POST /api/v1/payments/orders` returned **409**, `Booking hold has expired.` Expiry is evaluated dynamically; no scheduler rewrites the label to EXPIRED.
- Real quote (201) and replacement booking (201) for the same vehicle/trip succeeded after expiry. Replacement `4a681a0b-2952-48b5-8c0e-5c12ddbf2e70` and old hold were then cancelled (200 each) using the customer API. Neither has a receipt/refund/capture.
- Old hold's local payment `d85280a2-7a55-49bd-b2a1-5b993265f5d5` / provider order `order_TcfvQOeptqsTpR` remain unpaid historical records. Provider GET order payments returned 200 with an empty list. They were not deleted or manually marked paid/failed.
- Existing late-capture policy: a genuinely captured payment can settle an expired unpaid hold if there is no conflicting booking/cancellation; otherwise it is flagged for financial review. We did not manufacture a late capture or change that policy. The live result proves expiry rejects new orders and releases availability, not that provider capture is technically impossible forever.
- Refunded booking after page refresh: CANCELLED/refunded displayed, no enabled Pay Now CTA, no horizontal overflow at **390 / 768 / 1024 / 1440px**. Evidence: `docs/LIVE-EDGE-CASE-RESPONSIVE.json`. These checks cover the final cancelled screen, not every earlier screen at all widths in this phase.
- Final audit: preserved original remains CONFIRMED/succeeded with one receipt and zero refunds; new paid booking has one authoritative captured-then-refunded payment, one receipt, one cancellation and one refund; all other new bookings are cancelled and unpaid. No duplicate authoritative successful payments/documents/refunds found in this scoped audit.
- Repeated email projection/delivery after refresh retained one accepted confirmation and one attempt for each paid booking. Obsolete booking-created/payment-failed notifications produced by historical projection remain unsent pending records; a global worker was intentionally not started to send stale notices during this scoped UAT. Deployment catch-up policy must review that backlog.
- Temporary browser quote/idempotency test state was removed. Financial/provider/audit history is retained; all newly created reservations are cleaned up through cancellation. No real-money transaction occurred.
