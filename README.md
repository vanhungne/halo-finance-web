# Vinance website

Backend session follow-up16/10 keeps token response shapes but binds refresh to
the persisted account epoch. Legacy unbound sessions require login; logout and
real Admin lifecycle/role changes revoke access/refresh. Current backend matching
qualification is tracked in the [session contract](../halo-finance-backend/docs/admin-account-session-contract.md).
Browser follow-up now uses one coordinator for login, proactive/401 refresh and
logout, with atomic pair storage, cross-tab Web Locks, stale-response fencing and
credential-bound step-up. Web107/107, generated/typecheck, scoped lint and build
pass. Eight synthetic Chrome checks and a separate actual Program/PostgreSQL
cohort18/18 pass, including two-tab rotation, Admin revocation and Program restart.
Existing localStorage token transport, secure2FA and production remain separate
open gates. [Browser contract and exact evidence](docs/admin-session-contract.md).
No HaloSport design tokens change in this slice.

Native account recovery16/10 reuses the existing generated cancellation transport
and tokenized confirmation. Only server-ready UNKNOWN permits native lifecycle
disposition; verified cancellation clears the hint/reset form without changing
account state. Recovery now refreshes audit and affected caches after verified
disposition as well as an original receipt, using the existing query helper.
Web68/68/generated/typecheck/scoped lint/build and the synthetic lost-response
lookup/reset review pass; no independent token system is introduced. The UI
review uses an adapter, not a real authenticated browser-to-server journey.
[Native backend qualification and remaining gates](../halo-finance-backend/docs/admin-command-recovery-contract.md).

Admin recovery16/10 adds generated, confirmed cancellation of unaccepted generic
keys with a distinct audited decision. Lost responses preserve the journal; a
verified lookup resets the pending route form without claiming a domain write.
New copy supports vi/en using shared native modal/tokens. Web67/67, generated
check/typecheck, scoped lint/build and synthetic UNKNOWN/lost-decision/recovery
checks pass. [Supported identities and backend qualification](../halo-finance-backend/docs/admin-command-recovery-contract.md).

Admin report review16/10 validates contiguous Unicode pages against the dossier
identity/version/length, hides stale text after content failure and keeps reply
disabled until review is complete. The shared modal export is restored. Web64/64,
generated-client/typecheck, scoped lint and production build pass; synthetic
malformed-page/recovery/lost-response checks pass. Reply remains capability-gated;
this is not a real authenticated browser-to-backend or production certificate.
[Current backend/source evidence](../halo-finance-backend/docs/admin-report-contract.md).

Admin dossier13/10: protected inventory/detail/source paging, inert sandbox
preview/escaped HTML-JSON, vi/en/focus restoration and legacy detail GUID redirect.
Backend288/288, web48/48/export68-117/Orval/types/scoped lint/build and synthetic
desktop/mobile checks PASS; media/full-host/mobile/production gates remain.
[Contract](../halo-finance-backend/docs/admin-content-contract.md).

Admin content13/10: legacy blog list/detail/create routes now replace navigation
with `/admin-v2/content`; old forms/raw HTML are not mounted. Backend legacy
writes/upload deny410; no automatic unsafe replay. Protected dossier/deep-link,
media and real authenticated journeys remain required; mutations stay gated.
[Contract and selected qualification](../halo-finance-backend/docs/admin-content-contract.md).

React web client for the Vinance personal-finance platform. It serves the public
landing/email-result pages and the administrative console. The primary
authenticated consumer experience lives in Mobile. Website consumes
`vinance-backend-api`.

## Requirements

- Node.js compatible with Vite 7 (use Node 20 LTS or newer)
- npm
- A running backend API

## Local development

The application currently reads its API base URL from `VITE_APP_URL_API`.
Remember that every `VITE_*` value is embedded in the browser bundle and must
never contain a secret.

```powershell
npm ci
npm run dev
```

Useful checks:

```powershell
npm run lint
npm run build
npm run preview
npm audit --omit=dev
```

## Structure

- `src/pages`: route-level user and admin screens
- `src/components`: reusable UI and feature components
- `src/services`: backend API clients
- `src/contexts`: shared React state
- `src/routes`: routing and guards
- `src/layout`: common page layouts
- `src/adminV2`: parallel Halo Sport token-based admin control-plane foundation; legacy `/admin` remains available during parity work
- `docs/admin-*.md`: legacy inventory, route registry, domain/capability map, backend contract gaps, risk register and cutover gates

## Current engineering baseline

As revalidated on 2026-09-01, the production build succeeds; ESLint fails with
25 errors and 16 warnings, no automated tests are configured, 13 production
dependency advisories remain (1 critical, 10 high, 2 moderate), and the main JavaScript bundle is about 1,438 kB
minified/~437 kB gzip. Treat these as tracked production-readiness work, not as
an accepted quality bar.

Follow-up on 2026-10-11: Admin V2 scoped ESLint and the production build pass;
full lint still has the baseline 24-error/16-warning legacy failures. The
current `npm audit --omit=dev --audit-level=high` reports 12 high and 1 critical
production findings (plus 4 moderate); adding the pinned Orval generator did not
make this a release-ready dependency set. Remediation is a separate security
workstream and the platform remains NO-GO.

For cross-repository architecture, security findings, contracts, and release
gates, start with the workspace [documentation index](../docs/README.md) and
[feature health matrix](../docs/FEATURE_HEALTH_ASSESSMENT.md). Agent contributors
must also read [AGENTS.md](AGENTS.md) and the workspace-level `../AGENTS.md`.

2026-10-11 subscription catalog qualification: `node --test tests/adminSubscriptionCatalog.test.mjs`
passes 7/7; scoped ESLint for `AdminV2SubscriptionEditor.jsx`,
`AdminV2SubscriptionsPage.jsx`, `subscriptionCatalog.js` and `services/admin/index.js`
passes. `npm run build` now succeeds with the large-chunk warning; the earlier
EPERM attempt remains historical evidence. Full lint still reports 24 errors/16
warnings. Inline detail/create/edit/delete consume the verified V2 catalog
contracts and remain capability-gated; exact retry after a lost reply and
responsive/dark component checks passed in a synthetic local browser fixture.
Generated-client, billing/consumer, navigation recovery and full-host/restore
qualification remain open. See [capability matrix](docs/admin-capability-matrix.md)
and [backend contract](../halo-finance-backend/docs/admin-subscription-contract.md).

The Admin client contract is generated from `contracts/admin.openapi.json` by
`scripts/admin-client.mjs`; `npm run admin:check` fails on normalized generated
source drift and `npm run admin:typecheck` also runs the scoped TypeScript check.
The snapshot is produced by the backend `tools/AdminContractExporter` from the
current Swagger registrations without starting Kestrel, a database, or a
provider. `src/services/admin/index.js` is a compatibility facade over generated
operations; modules not yet migrated retain their existing service boundary until
their contract and behavior are qualified.

Admin contract update18/10: the official Swagger exporter and generated client include
53 paths/94 schemas. `npm run test:admin` includes navigation, recovery
cache and generated-function regressions; the current combined suite is93/93 PASS
using Node `--test-isolation=none` in the Windows sandbox. `admin:typecheck`, scoped
Admin ESLint and production build pass with approved esbuild execution outside the
sandbox. Full lint, large bundle, real PostgreSQL/full-host, accessibility/i18n and
cutover remain separate gates; no mutation capability is opened by these checks.

## Admin shell and route loading follow-up — 2026-10-13

Admin V2 now has vi/en shell/shared messages, native mobile drawer/palette/danger
confirmation with focus containment/restoration and safe Cancel focus, plus12
lazy page modules with localized loading/failure states. Shell/session/recovery
remain mounted across page load failure. Canonical Admin fixture coverage is
51/51 with the direct in-process Node runner,
scoped ESLint and generated parity/typecheck pass; full lint remains red at24
errors/16 warnings in legacy/public source. [Contract, synthetic fixtures and
remaining gates](docs/admin-shell-accessibility-contract.md). This is partial
Admin qualification, not full CRUD, accessibility/i18n, host or production approval.

Final `npm run build -- --manifest` PASS:12 dynamic page entries with12 entry
references and0 static page references; main JS1545.31kB/gzip468.05,
CSS111.72kB/gzip17.38. Main JS before splitting was1743.27kB/gzip506.57;
the total/legacy bundle gate and500kB warning remain. Final affected locale/
broker4/4 and scoped lint pass after the HTTP429 message correction; this is
not a45-case distinct suite or real-server step-up qualification.

## Admin token and command navigation follow-up — 2026-10-14

Admin V2 now follows the Halo Sport geometry more closely: 48px icon rail,
36px desktop controls, 44px touch controls on small browser widths, 24px
desktop content gutter, and the existing semantic color/radius/focus tokens
remain the only page styling contract. The route command palette supports
pointer selection, Up/Down/Home/End navigation and Enter activation while
preserving React Router navigation and capability-filtered results. The shell
also exposes a keyboard-safe session menu for the current operator and logout.
This is a visual/accessibility foundation change; it does not grant a Backend
capability or bypass command qualification.

All Admin V2 command dialogs use the shared native modal primitive with focus containment and
return-focus behavior; the server capability projection still controls
whether any command is shown.

The Command Center now uses the shared Vietnamese/English message registry for
its title, metrics, table labels and loading/error/empty states. Server status
values remain authoritative and are not rewritten by the locale layer.
