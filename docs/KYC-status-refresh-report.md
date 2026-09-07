# CUSTOMER KYC STATUS REFRESH REPORT

## Diagnosis

1. `src/pages/account/KYC/index.jsx` renders aggregate status in “Your verification” using `KycBadge`; Profile and DashboardLayout also use that badge.
2. All three consumers call `useKycStatus()` from `src/features/kyc/useKyc.js`.
3. Its query function is `kycService.getStatus()`: `httpClient.get('/kyc/status')`. The configured development API base is `http://localhost:5000/api/v1`.
4. Exact query key: `['kyc', 'status']`. Documents independently use `['kyc', 'documents']` and GET `/kyc/documents`.
5. No `enabled: false`, user-dependent enabled condition, `initialData`, or persisted KYC/query state. The protected route waits for auth restoration and redirects unauthenticated users; once mounted, both KYC hooks are unconditional. Conditional document readiness controls actions/progress, not whether status is fetched. Redux persists UI preferences only.
6. Aggregate status is not derived from document statuses. Documents determine upload/licence completeness and submission eligibility only.
7. Aggregate expects `data.verificationStatus`, with lowercase `verified` mapped by `KycBadge` to `Verified`. It does not expect `VERIFIED`, `Verified`, `status`, or `kycStatus` as the API field/value. `httpClient` unwraps Axios response body; `getStatus` unwraps its `data` envelope correctly.
8. A true authenticated hard reload creates a fresh in-memory query client and should fetch. This passed before and after the fix. Missing traffic after a true reload was not reproduced; the user's actual authenticated browser session was not accessed.
9. Before the fix, the hooks inherited a 60-second development staleTime (120 seconds in production configuration) and default stale-only refetch-on-mount behavior. DashboardLayout can populate the shared query before entering KYC. Revisit within that fresh window sends no status read, and admin changes do not invalidate the separate customer cache. Focus refetch was also freshness-dependent.

## Backend contract — read only

Authenticated `GET /api/v1/kyc/status` calls `KycService.status(req.user.sub)`. It reads the authenticated user's Profile aggregate fields and counts documents; no customer ID is supplied by the frontend.

HTTP 200 response:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {
    "verificationStatus": "verified",
    "submittedAt": "2026-09-07T17:05:01.460Z",
    "verifiedAt": "2026-09-07T17:06:15.256Z",
    "rejectionReason": null,
    "documentCount": 2
  }
}
```

The `data` values above were confirmed using the same backend service in a read-only lookup for customer `55456a5c-7a26-4dee-af1a-15364a96192b`. No token was forged or customer data changed. In the general contract, missing status falls back to `unverified`, dates can be null, and rejectionReason is exposed only when rejected.

## Minimal fix

Only the shared KYC query hook's production code changed: `staleTime: 0` and `refetchOnMount: 'always'` for status and document reads. Existing focus refetch is preserved. Profile/account badges share the same authoritative cache and get the same freshness policy. No polling, mock fallback, normalization rewrite or backend change.

## Validation

The targeted disposable-browser check uses isolated auth/KYC HTTP responses against the actual frontend, with no backend writes. Before patch: Profile → KYC within staleTime retained pending status without a new GET. After patch: entry/revisit issued status/document reads; lowercase verified updated KYC and shared account badges even with an empty document list. Authenticated hard reload issued a status request. No interval requests while idle; no runtime exceptions.

Script: `scripts/kyc-refresh-check.mjs`. The real customer's stored aggregate was checked separately read-only, not represented as a login/browser test.

Backend status authority: YES. Document status incorrectly used as aggregate: NO. Hard refresh refetch: PASS. KYC revisit refetch: PASS. Verified mapping: PASS. Backend changed for this issue: NO.
