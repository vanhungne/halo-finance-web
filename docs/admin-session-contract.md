# Admin browser session coordination — 2026-10-16

Merge compatibility, 2026-10-20: the new login appearance still calls the existing
coordinator's `login`/`verifyTwoFactor` methods and uses its session-error catalog.
The provider and shared Axios instance retain one refresh owner. Admin role
validation, MFA challenges, stale-context fencing and legacy blog redirects are
preserved. No member-role or OAuth session policy is broadened in this merge.
Google sign-in is shown unavailable; legacy callback token parameters are cleared
without persistence. The public `/app` sample-data demo has no financial API
authority; its exit returns home and does not claim server logout. Current
verification and environment limits are in the [merge record](../README.md#merge-integration--2026-10-20).

Source implemented; selected qualification passes within the scope below. Full Admin and
production release remain ACTIVE/NO-GO. This extends the existing shared Axios
instance and AuthProvider; it does not create a second authentication authority,
backend token store or design system. Backend JWT/current-account/current-role,
step-up, tenant and financial controls remain authoritative.

## One browser session and one exchange path

`services/auth/sessionCoordinator.js` owns login, refresh and logout. Runtime
`session.js` supplies the actual bounded Axios auth exchange, browser storage,
Web Locks, clock and notifications. AuthProvider subscribes through
`useSyncExternalStore`; LoginPage no longer writes tokens or sets a free-form
authenticated user, and no UI context exposes the refresh credential. The shared
instance and generated Admin transport use this same coordinator.

`halo.auth.session.v1` is one atomic JSON record containing the access/refresh
pair, a login-context ID and a rotation revision. Pending/anonymous records contain
no tokens. Refresh changes revision, while the login context remains stable;
login/logout replace the context. Anonymous tombstones remain in storage. Legacy
`access_token`/`refresh_token` keys are discarded, never imported or rebound.
An old tab writing them later cannot resurrect a canonical session.

The origin-wide `halo.auth.exchange.v1` Web Lock serializes login, refresh and
logout exchanges between tabs. A separate short `halo.auth.state.v1` lock guards
state commits without holding logout behind a network response. Refresh callers
share one promise in the same tab; a queued tab rereads the atomic record and
uses an already-completed rotation instead of spending the old single-use token.
Storage events reread current storage, so delayed events cannot restore old data.
There is no storage-based spinlock or unsafe fallback when Web Locks is absent.

Logout clears local authority under the state lock before waiting for the server.
In-flight login/refresh is aborted, and commit checks still reject an old response
if transport cancellation is ignored. Stale logout callbacks are pinned to the
rendered login context and cannot start revocation for a newer login. Server
logout uses the captured access token and never refreshes itself. Failure returns
`serverRevoked:false` and an explicit local-only logout message, rather than
pretending remote revocation succeeded. An already-dispatched logout retains the
backend's global account-epoch semantics; cross-device/unknown-commit ordering
is not made reversible by browser state fencing.

## Requests, commands and verification

Before dispatch the interceptor checks the configured API origin/path, strips
stale default Authorization and adds only the current access credential. Requests
carry their originating login context. Old-account HTTP200,401 or403 responses
are canceled before reaching UI/cache/authority-denial handling; an old command
cannot be resent under a newer login, even for the same user ID.

A401 can trigger one coordinated refresh. Automatic replay is limited to safe
read methods or Admin writes with an idempotency key. Legacy writes, network
failures,403/409/429/5xx and requests already carrying step-up proof are not
automatically replayed. Body, original key/version headers and cancellation signal
remain intact. This is not a substitute for backend idempotency or retirement of
unsafe legacy endpoints.

Admin step-up is bound to the JWT's session nonce as well as account epoch.
Refreshing the JWT cancels pending credential UI/exchange without clearing that
same actor's query cache or form. Verification and proof resend are pinned to the
credential revision that produced the challenge; they cannot migrate to a new
JWT. A login/logout boundary instead clears private queries, recovery hints,
pending proof UI and keyed route state. Same-user relogin gets a fresh query-client
lifetime; ordinary rotation preserves the current actor's cache.

Response shape, required Admin role hint, subject/epoch continuity and finite
expiry are checked before persistence. These decoded hints are **not signature
verification or authorization**. Only the backend can grant authority. Invalid
or unavailable storage removes local authority; credential errors expose bounded
codes, never raw Axios configs, passwords, Authorization or response payloads.
The login/refresh/logout console logging paths are removed. Vi/en error messages
use the existing Admin locale preference. The provider's timer reads current
coordinator state and avoids a zero-delay loop for short configured lifetimes.

## Compatibility and open gates

This is a browser session-format cutover: reload/retire old bundles and require
fresh login. A canonical browser tombstone does not revoke old JWTs on the server.
Coordinate with the [backend session rollout](../../halo-finance-backend/docs/admin-account-session-contract.md)
and a reviewed server session-invalidation procedure before release. Do not
backfill a current epoch into an old refresh credential. Missing Web Locks,
insecure context or blocked storage refuses sign-in with an explicit message;
public API reads can remain anonymous.

Bearer tokens are still readable by same-origin JavaScript in localStorage.
Cookie/BFF transport, XSS/CSRF and production browser/storage policy are separate
open gates. OAuth token-in-URL, complete secure Admin2FA UX, multi-device session
management and browser/production-role/load/restore acceptance remain open.
Require2FA never becomes an authenticated session here; the UI explicitly states
that this flow cannot complete it. The existing remember-me UI/policy is not
redesigned. No HaloSport tokens or production UI layout are changed.

## Evidence phases

- Initial forced-race suite26/26 passes. Early canonical web94/94, generated client,
  TypeScript and build pass; scoped lint exposes the context/component mixed-export
  rule. The context is separated without a lint suppression.
- First browser run fails to resolve AuthProvider: Windows resolves extensionless
  `AuthContext` to a newly named `authContext.js`. The context is renamed
  `AuthSessionContext.js`, provider imports are explicit and consumers/fixtures
  use the distinct module. This failed phase is retained.
- The next browser phase exposes a polling-driver callback typo; fixed in the
  driver without changing product assertions. The following six synthetic journeys
  pass using real React/Axios and two real Chrome tabs.
- Follow-up hardening adds stale-logout, corrupt-storage and JWT-revision proof
  fencing. Current canonical web104/104 and scoped lint pass; current generated/
  TypeScript passes. The eight-check synthetic browser report also passes, including
  an observed queued Web Lock, late old-account200, both kinds of proof cancellation,
  private-cache boundaries and two actual React timer rotation cycles.
- Final old-refresh refusal fencing adds a forced interceptor test: an old
  refresh401 cannot reach the new login's authority-denial handling. Current
  canonical suite107/107 passes, with generated/typecheck and final build PASS.
  Scoped lint initially targets a wrong dialog path, then finds a missing fixture
  component export; the correct path/export now passes without suppression.
- The first integrated execution is not run because automatic approval review
  fails workspace routing authentication401. After explicit user instruction to
  restore access, workspace/network permissions are regranted and the same
  operation passes normal elevated review. The actual Program/PostgreSQL cohort
  then passes18/18 in1.1676 minutes:17 account-session cases and one real Chrome
  journey, zero failed/skipped. The journey covers login, two tabs consuming one
  real refresh exchange, real Admin suspension closing both views, reactivation,
  acknowledged logout and fresh login/private read after actual Program restart.
  Supervisor changes use real step-up HTTP commands; DB assertions verify their
  operation/audit records and the final refresh epoch binding.

## Reproduction and retained evidence

Run `npm run test:admin`, `npm run admin:typecheck` and `npm run build` from the
web repository. Final build used an owned C-drive output because D-drive space
was constrained: `npm run build -- --outDir C:/Users/ACER/Documents/Codex/2026-10-14/new-chat/.build/admin-web-session-dist-r13`.
The existing large-chunk warning remains (index1171.21kB minified). No dependency
upgrade or full-repository lint/security-audit acceptance is inferred.

Scoped ESLint checks `src/services/auth`, shared instance, AuthProvider/context,
Admin step-up/query/layout, LoginPage, protectedRoute, NotFoundPage, the new Node
test/browser driver and session-review fixture. TypeScript checks the generated
Admin transport. The final fixture export is lint-only and preserves the tested
browser flow.

Build backend with .NET8 and `dotnet build ExpenseAssistant.Tests/ExpenseAssistant.Tests.csproj -c Release --no-restore --artifacts-path <owned-artifacts> -p:UseSharedCompilation=false -p:CollectCoverage=false --disable-build-servers -m:1`.
The final incremental build has0 errors/67 warnings; this is not a warning-free
solution qualification. Matching test assembly SHA256:
`A74D0445F348F3FA6732AA1D81C209561F1FF8F2193C0C143839A8A4A24DBB05`.
Execute `dotnet vstest <owned-artifacts>/bin/ExpenseAssistant.Tests/release/ExpenseAssistant.Tests.dll --TestCaseFilter:FullyQualifiedName~AdminBrowserSessionPostgresTests|FullyQualifiedName~AdminAccountSessionPostgresTests`
with the filter shell-quoted as one argument and a TRX logger. Required variables:

- `HALO_TEST_POSTGRES`: owned loopback test-fixture admin database;
  never a real database. The fixture creates/drops separate GUID databases.
- `ADMIN_BROWSER_SESSION_SCRIPT`: web `tests/adminRealSession.browser.mjs`;
  `ADMIN_BROWSER_PLAYWRIGHT_MODULE` and `ADMIN_BROWSER_CHROME`: installed runtime
  module/executable; no dependency installation is required.
- `ADMIN_BROWSER_UI_ORIGIN`: owned Vite HTTP127.0.0.1 origin (this run42576);
  start Vite with `VITE_APP_URL_API` pointing to that origin's `/api/`.
- `ADMIN_BROWSER_ARTIFACTS`: owned output directory. Fake account credentials
  are passed only to the owned child environment, never command lines/output.

The browser test has both `Category=Browser` and `Category=PostgreSQL`; it is
opt-in infrastructure, with a failed prerequisite if configuration is absent.
Ordinary PostgreSQL-only runs must explicitly use `Category=PostgreSQL&Category!=Browser`
unless browser infrastructure is configured. Do not count an excluded browser
case as passing. The owned PostgreSQL55462 cluster is stopped after this run.

Retained evidence in [evidence/admin-session-20261016](evidence/admin-session-20261016/):
[18-case TRX](evidence/admin-session-20261016/admin-web-session-real-r12.trx),
[real browser report](evidence/admin-session-20261016/admin-web-session-real-browser.json),
[synthetic report](evidence/admin-session-20261016/admin-web-session-browser-r7.json),
[105-case log](evidence/admin-session-20261016/admin-web-session-tests-r13.log),
generated/typecheck, scoped lint, build logs and screenshots. The browser report
checks no page errors or detected password/Bearer console output; it is not a
comprehensive production telemetry/DLP proof.
The exact historical synthetic driver is retained as
`synthetic-browser-driver.mjs` in that evidence directory; its local runtime,
Chrome, UI and output paths describe this machine. The reusable actual-server
driver is `tests/adminRealSession.browser.mjs` and uses the variables above.

The real-browser fixture transparently forwards all API bodies/status/headers to
the actual Program and only holds refresh response timing to force contention.
This qualifies local session behavior; its same-origin proxy does not qualify
deployment CORS, reverse proxies, TLS, production data or full Admin CRUD UX.
The prior backend382-case cohort remains380PASS/2timeouts despite its isolated
same-binary2/2 rerun; the new18/18 does not erase that stability finding.

Synthetic browser API responses are route-controlled fixtures; they are not
backend qualification. Chrome uses an owned temporary context with external
requests blocked. No real provider, account, financial operation or production
database is used. The normal CUA connector failed asset initialization, so the
browser checks use the bundled Playwright driver and owned Chrome headless.
