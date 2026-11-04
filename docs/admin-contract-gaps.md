# Admin contract gaps

ADMIN-SESSION-002 16/10 — SELECTED QUALIFIED / TRANSPORT AND FULL GOAL OPEN.
The earlier duplicate refresh paths are replaced by one login/refresh/logout
coordinator, atomic pair storage, cross-tab Web Locks and stale-context fencing.
Old refresh failures cannot deny a new login; logout clears private state before
remote acknowledgement and reports uncertainty explicitly. Step-up is pinned to
its credential revision; only safe reads or idempotent Admin writes can replay.
Raw auth Axios console errors are removed. Web107/107 and eight synthetic Chrome
checks pass. A separate actual Program/PostgreSQL cohort18/18 passes, including
the real two-tab/revocation/logout/restart journey. This uses a controlled local
proxy and synthetic accounts; production CORS, storage/BFF, complete secure2FA,
OAuth and the previous backend batch timeout finding remain open. Legacy unbound
sessions require login and old browser bundles must be retired at cutover.
[Browser contract and evidence](admin-session-contract.md).
[Backend format and rollout](../../halo-finance-backend/docs/admin-account-session-contract.md).

Account MFA follow-up16/10 — SELECTED BACKEND QUALIFIED / CLIENT FLOW WIRED.
Login now presents the bounded SMS/authenticator challenge returned by the
password step, and `verifyTwoFactor` persists no authority until the challenge is
verified. Web107/107 passes, including the coordinator challenge boundary. The
Admin login page renders the challenge in the Halo Sport-derived Admin shell and
never stores an access/refresh token before verification. Backend
selected97/97 passes with restart/replay/atomic revocation coverage. Factor setup,
backup/lost-factor recovery, OAuth handoff, provider qualification and broader
production UI/accessibility acceptance remain open.
[MFA contract and exact scope](../../halo-finance-backend/docs/account-two-factor-contract.md).

Native lifecycle disposition16/10 — SELECTED QUALIFIED / FULL GOAL OPEN.
SET_ACCOUNT_LIFECYCLE uses the existing generated transport, opaque recovery
journal, confirmation and route reset. The server advertises cancellation only
for UNKNOWN with its installed native migration/proof triggers; older schemas
keep the form unresolved. Thirty generic identities plus this native identity
are supported in source, without an invented account state or original receipt.
Web68/68/generated-client/typecheck/scoped lint/build pass. Backend primary164/164
and supplemental121/121 cover285 unique selected cases on one isolated binary.
Native migration/HTTP/actual Program qualification and resource phases are
recorded in the recovery contract; this
does not close full Admin, unsupported stores or production gates.

Recovery disposition16/10 — PARTIAL across the full Admin surface. The enabled
`admin.commands.disposition` capability supports30 generic-store action identities
through a strict step-up/key-reservation/audit contract. UNKNOWN alone never
releases intent; verified CANCELLED has a distinct disposition and no original
receipt. Selected backend126/126, capability2/2, web67/67/generated/types/scoped
lint/build and synthetic lost-decision lookup/reset pass. Native lifecycle now
has its own extension above; BLOG_MEDIA_STAGE and hidden-target
maintenance cannot be cancelled by this store; broader writer families,
browser-to-real-server, retention/restore/load and full Admin cutover remain open.
[Exact scope/evidence](../../halo-finance-backend/docs/admin-command-recovery-contract.md).

Managed blog media193000/13/10 adds a strict `MANAGED_V1` token/manifest and
immutable per-version backend snapshots. Draft create/update/delete is qualified
2/2; publish with managed media remains closed until public delivery/revocation.
The additive DTO/delivery route changes the generated Admin OpenAPI snapshot to 69 paths/119
 schemas; private Admin delivery is now `GET /api/admin/content/media/{mediaId}` with
 no-store current-role/proof checks; Orval regeneration/typecheck and the 48-case
 Admin web suite pass. Do not
expose a provider URL or enable editor upload from the receipt; keep capability
gated until delivery is qualified.

The separate authenticated public resolver `GET /api/blog/media/{mediaId}` is
represented in backend contract/evidence but intentionally excluded from the Admin
OpenAPI client. It remains disabled by DB gate and feature flags; provider-backed
read verification is synthetic-only until production key-ring/provider/revocation
and cleanup gates pass.

Media worker190000/13/10 now has durable lease/fence/retry, full private-byte
verification and protected current READY metadata in backend internal services.
The original command receipt remains QUEUED/v1 acceptance. No upload/metadata/
delivery/link HTTP capability is supplied by this foundation; do not enable editor
media upload or infer a public URL from its receipt. Native tokens and safe preview
remain unchanged. [Exact backend scope/evidence/next contracts](../../halo-finance-backend/docs/admin-content-media-contract.md).

Staging13/10 now qualifies queued DB intake/quota/cipher/real step-up/recovery
and migration in157/157 combined cases. Default OFF, no upload HTTP/worker/READY/
provider/link/cleanup; do not wire a fake completed upload or open content writes.
Report-type create proof and actual subscription recovery version are repaired;
private HTTP/browser/full-host/retention/key-ring/restore/load/rollout remain.
[Exact DB/BE scope](../../halo-finance-backend/docs/admin-content-media-contract.md).

Media foundation13/10: internal backend image normalization/current-authority
adapter and neutral immutable primitive qualify58/58 plus6/6 separate Group
consumers. This is not an upload contract: legacy upload remains410 and there is
no new generated upload operation/capability. Complete durable stage/quota/key/
recovery/lease/private-provider/link/publication/cleanup before wiring the editor.
Keep HTTP/browser/mobile/Linux/retained-legacy/full-host/restore/load/rollout gates.
[DB/BE implementation contract](../../halo-finance-backend/docs/admin-content-media-contract.md).

Content follow-up13/10 qualifies selected177/177 backend cases: stored-content
publication/quarantine, structured create/update hash metadata, protected legacy
lookup, same-key race receipts, fresh authority after wrapped rollback, real
Kestrel/JWT/password step-up CRUD and Swagger preconditions/refusal/recovery.
The new actual Program/HTTP cohort1/1 adds create/replay, publication, update,
restart and audited soft-delete/version persistence, so
`admin.content.mutate: V2_COMMAND` is enabled for metadata/publication commands.
Provider media upload/delivery, retention, full browser/app-role/restore/load/
mixed replica and cutover gates remain open.
[Contract and phase evidence](../../halo-finance-backend/docs/admin-content-contract.md).

Shell/loading follow-up13/10: canonical web suite is now48/48 PASS after adding
vi/en registry/shared-message and safe-storage coverage. Native drawer/palette/
shared confirmation and12 lazy page modules have focused synthetic browser
evidence. This changes no backend API or capability status; all remaining
PostgreSQL/full-host/step-up/broad CRUD/retention/cutover gates below remain open.
[Exact scope](admin-shell-accessibility-contract.md). Earlier39-case counts and
bundle figures below are their own historical milestones.

Audit follow-up14/10: canonical Admin web coverage is now51/51 PASS. Audit
adds actor/target UUID filters with separate lifecycle/generic DTO mapping and
fail-closed client validation; Accounts and Audit use the shared vi/en registry.
This changes no backend capability or redacted audit payload contract.

The backend exporter now produces the current **79 paths/132 schemas** snapshot,
including both refund reads, the trial-balance report and the reconciliation projection. The
exporter `--check` passes against `contracts/admin.openapi.json`; backend
OpenAPI redaction assertions and the focused refund controller/boundary tests
pass. Orval's local `admin:check` and `admin:typecheck` now pass in approved host
execution; generated-client parity is verified against the 79/132 snapshot.

Subscription qualification follow-up15/10: the catalog CRUD/status command contract now has a fresh disposable PostgreSQL cohort **10/10 PASS** and a real HTTP/Kestrel/JWT cohort **7/7 PASS**, covering strict bodies, step-up/preconditions, replay, stale versions, soft-delete guards, session revocation and private denial responses. `admin.subscriptions.crud` is enabled for metadata CRUD; availability remains `CONTRACT_GAP` until billing-consumer overlap, restore/full-host and production qualification are complete.

Admin V2 recovery, command transport, navigation, cache and session tests pass 93/93 on18/10. Platform & Security renders the server capability registry as read-only metadata. Registry entries do not grant command authority; backend authorization and independent capability qualification remain mandatory.

Current generated contract18/10: the backend exporter and pinned Orval client agree on 53 paths/94 schemas. Generated parity, TypeScript, scoped ESLint and Vite build pass. The large-chunk warning and full production/cutover qualification remain open. See the shared platform reset report for the current retained scope and test artifact.

Recovery cache follow-up13/10: verified terminal recovery now invalidates the
affected actor's invitation, content and receipt-policy/rule projections as
well as audit/operation history. Domain-specific invalidation replaces the
incomplete broad resource list; all cached pages of the affected resource are
marked stale, while other actors and unrelated domains are retained. The
QueryClient regression runs against the actual TanStack cache; this is not a
real backend/browser or financial correctness qualification.

Step-up12/10: affected backend506/506PASS (0skip,coverage off), web21/21PASS,
generated parity/typecheck/build PASS in the historical qualification. Current direct
Admin tests remain21/21PASS and `tsc -p tsconfig.admin.json --noEmit` is clean;
Orval regeneration/parity currently returns `spawn EPERM` from esbuild. Real password/authenticator, generated endpoint,
in-memory dialog and frozen original-command retry exist for configuration CRUD/
maintenance; account-role and lifecycle commands now bind to the same proof when
the real service is registered; advertising status and receipt-policy clone are
also bound in production DI. Focused role/lifecycle/advertising/OpenAPI coverage is4/4 PASS;
receipt clone runtime remains blocked by the shared Business fixture migration
`P0001 CLAIM_POSTING_ADMISSION_REWRITE_PAYABLE_FAILED`.
Subscription availability status now binds to the same command-bound proof and
the production OpenAPI filter exposes its optional `Admin-Step-Up` header; the
new focused PostgreSQL proof case is blocked by the same fixture chain. Current
official exporter output is 64 paths/105 schemas. Orval regeneration is currently
environment-blocked by `spawn EPERM` from esbuild, while direct Admin TypeScript
typecheck remains clean.
Report reply now follows the same command-bound proof contract and is enabled
as `admin.reports.reply: V2_COMMAND` after the actual Program/HTTP journey
qualified step-up, replay, recovery, restart and current-role fencing. The
legacy writer remains closed; attachments, retention and production cutover
remain separate gates.
Report-type CRUD and receipt draft/rule/publication writers now follow the same
proof contract; their capabilities remain gated until their full PostgreSQL and
host qualification is rerun.
No new capability is enabled by this slice; existing lifecycle availability remains
independently governed. Other R3 domains, key-ring/replica/restore,
issuance audit, browser-to-real-server and historical legacy replay cleanup remain
OPEN. New configuration rows use versioned canonical fingerprints and the focused
PostgreSQL migration/replay tests pass. [Contract/evidence](../../halo-finance-backend/docs/admin-step-up-contract.md).

Program follow-up12/10 provides3 actual-entry-point cases for selected startup/
reads/report-type CRUD/recovery/restart/maintenance admission within489/489 local
union. Maintenance/security reads and bypass now require current DB Admin; auth
denial remains private for cache purge. Swagger63/102 unchanged; no UI/capability
enablement. This adds selected full-host evidence, not all domains/providers,
production roles/TLS/browser/step-up/UNKNOWN disposition/restore/load/cutover proof.
[Exact scope](../../halo-finance-backend/docs/admin-program-host-qualification.md).

Legacy configuration follow-up12/10: raw GET/system-config and direct legacy
read/create/update handlers are retired; missing-context maintenance/config writes
cannot bypass V2. Final457/457 local union includes real JWT/Kestrel, production
MediatR registration, no-effects/current-role metadata and Swagger denial proof;
exporter63paths/102schemas matches V2. Coverage is off, analyzers were disabled for
the build. Full Program/provider host, step-up, other domains/recovery/restore/load
and cutover remain; no capability is newly enabled.
[Contract/evidence](../../halo-finance-backend/docs/admin-legacy-configuration-retirement.md).

Writer authority follow-up12/10:26 existing commands now fence verified/current
persisted Admin through writes and fresh protected replay. Final425/425 local
backend union PASS (coverage off), unchanged Swagger63 paths/102 schemas; no UI
or capability enablement. Full-host/step-up/other paths/recovery/app-role/retention/
load/restore/broad parity remain open.
[Exact scope](../../halo-finance-backend/docs/admin-current-write-authority.md).

Current-authority read repair12/10 is source implemented at19 DB service methods/
20 surfaces, covering audit/configuration/operations and the approved directory/
subscription/receipt readers, including their protected history and
settlement history, plus capabilities authority.
Focused132/132 and final236/236 union now pass;19/19 helpers and synthetic denied-
frame/cache/draft/explicit-reset/logout/dark checks pass. Final union excludes
coverage instrumentation only after space failure, no assertions; earlier112/112
predates this repair. Full-host/browser-to-real-server/other writers/step-up/
load/restore/cutover remain open; source route/response shapes are unchanged.
[Gate and source scope](../../halo-finance-backend/docs/admin-current-read-authority.md).

Recovery follow-up12/10: private current-Admin lookup and tokenized global recovery
panel now cover support reply/catalog CRUD metadata after navigation/reload.
Final affected112/112 local DB/HTTP/Swagger/model regressions,18/18 web helpers,
generated check/typecheck/scoped lint/build and synthetic navigation/reload/dark
checks pass. This does not close full-host, preaccept/UNKNOWN disposition, closed-
tab/cross-device, other domains, step-up/app-role/retention/restore/cutover gates.
Write capabilities remain CONTRACT_GAP. Earlier snapshot-empty wording is history;
the model repair is separately locally qualified.
[Contract and exact limits](../../halo-finance-backend/docs/admin-command-recovery-contract.md).

Recovery safety follow-up13/10: the same recovery contract now covers account
lifecycle and account-role commands. Users page commands reserve only actor,
action, target, idempotency key and opaque concurrency version before sending;
timeouts and incomplete receipts leave the intent for the global recovery panel,
while terminal receipts release it and invalidate account projections. The server
verifies lifecycle rows through `AdminAccountLifecycleOperations` and role rows
through the generic Admin operation/audit store. Source build and web recovery
tests pass; fresh PostgreSQL/Kestrel/JWT qualification remains open, so no
account capability is newly enabled.

The status route now uses the regenerated Orval facade over shared
`adminTransport`; the official snapshot and client include its strict body and
command headers. PostgreSQL/host qualification remains required before enablement.

Advertising recovery follow-up13/10: the currently server-enabled status command
now reserves `ADVERTISE_SET_STATUS` in the same global recovery journal. The
decoder checks the two-part state/version reference, audit before/after version
and the writer's version increment even for `NO_CHANGE`. CRUD remains gated and
requires a separate recovery slice for create/update/delete. That slice now
validates the existing advertising CRUD operation/audit rows, including
empty-scope create version `0`, target-bound update/delete versions, committed
state transitions and stale rejection evidence. CRUD remains gated pending
PostgreSQL/Kestrel/JWT and provider/media qualification.

Content recovery follow-up13/10: blog create/update/delete/publication commands
now use the same actor-bound recovery journal. Blog create binds the opaque
locator to the actor scope because the blog id is generated server-side;
update/delete/publication bind to the blog id and numeric version. The backend
requires matching operation/audit evidence and distinguishes stale rejection
from committed content changes. Content mutation remains gated pending
PostgreSQL/Kestrel/JWT, stored HTML/media compatibility and full-host recovery.

Receipt-classification recovery follow-up13/10: policy clone, draft update,
publish/retire and rule add/update/deactivate now bind recovery to the policy
scope and expected version. Rule and clone receipts may have a generated target,
so the server validates the target and audit row from the operation reference
before releasing the actor's pending intent. The page blocks new policy/rule
writes while recovery is unresolved; all receipt mutation capabilities remain
gated pending full PostgreSQL/Kestrel/JWT and restore qualification.

Maintenance recovery follow-up13/10: the operations page now reserves a
`SYSTEM_CONFIG_UPDATE` locator without persisting the hidden configuration id.
The backend resolves the unique actor/action/idempotency record, canonicalizes
the timestamp version and verifies the three-part configuration receipt/audit.
Timeout and incomplete receipts remain in the global panel; maintenance stays
gated pending step-up, restore and full-host qualification.

Subscription recovery follow-up13/10: the subscription editor now reserves
`SUBSCRIPTION_CREATE`, `SUBSCRIPTION_UPDATE`, `SUBSCRIPTION_DELETE` or
`SUBSCRIPTION_SET_STATUS` before sending. The decoder handles create-without-
target, versioned catalog edits and the status writer's audited version shape;
catalog CRUD/status capabilities remain gated until billing overlap and runtime
qualification are complete.

Model alignment follow-up12/10: ADMIN-MIG-001 frozen snapshot/no-drift and mapped
schema now qualify locally, final93/93 with Admin regressions.23 missing indexes/
group FK are supplied by additive200000 and5 existing physical names mapped.
Earlier "empty snapshot" statements describe the pre-repair milestone. Full
SQL-artifact semantics/production roles/schema/locks/restore/full-host/recovery
and wider financial flows remain open; write capabilities stay CONTRACT_GAP.
[Exact proof boundary](../../halo-finance-backend/docs/admin-model-schema-alignment.md).

Catalog follow-up12/10: dedicated report-type reads and audited CRUD, version/
key/private contracts and real MediatR legacy-write retirement410 are wired.
Reference deletion race repaired with type locks/fresh READ COMMITTED reads and
DB isolation guard; final affected88/88 PASS covers both forced lock orders,
populated upgrade/Down, real HTTP/JWT/Swagger and support regressions. Synthetic
CRUD/text-only/used-delete/frozen-retry UI passes; generated62paths/101schemas,
typecheck/scoped lint/build and13/13 web helpers pass. ADM-022 remains PARTIAL
for full-host/reload/restore/load/app-role/mixed-writer and wider production
schema qualification; writes stay CONTRACT_GAP. Earlier counts below are milestones.
[Authoritative catalog contract](../../halo-finance-backend/docs/admin-report-type-contract.md).

Support milestone12/10: dedicated queue/dossier/versioned-content queries,
strict reply and persisted current Admin guard, legacy reply410 and user version
parity are implemented. Local final42/42 and synthetic desktop/mobile/dark/text-only/
same-key retry pass; production Swagger/generated snapshot is60 paths/98 schemas.
Earlier57/94 references below describe the prior milestone. ADM-004/007 remain
PARTIAL for full-host, attachment/type/retention, real browser/reload, restore/load
and cutover; [authoritative support contract](../../halo-finance-backend/docs/admin-report-contract.md).

12/10 role/member follow-up: strict account-role bodies/headers and rejected
replay 403/409 are implemented; persisted lockout/deleted-target checks are
enforced. Local 23/23 covers seven role PostgreSQL, two real role HTTP/JWT,
three business-member PostgreSQL, eight Swagger/JSON and three role controller
tests. Final rebuilt checked-migration/PROJECT-grant regression passed36/36,
including combined-grant read retention and no management revival on promotion;
the preceding34/2 run is historical failed evidence.
Role/business editors now freeze key/body/target/version on uncertain outcomes;
13/13 web helper/transport/catalog tests and scoped lint/typecheck/build pass.
These results add evidence to ADM-005/007/013/015, not close them. Full-host,
step-up/restore/route-reload/browser recovery and broader CRUD parity remain open.
[Account-role contract and TRX](../../halo-finance-backend/docs/admin-account-role-contract.md).

| ID | Gap | Required backend work before UI action | State |
|---|---|---|---|
| ADM-001 | Capability projection is now exposed at `GET /api/admin/capabilities`, but it is a server-owned static catalog and does not yet include durable tenant/scope posture or persisted feature flags | Add tenant/scope posture, audited feature availability and contract tests; keep route/handler authorization authoritative | PARTIAL |
| ADM-002 | User lifecycle command is now wired for suspend/reactivate/delete and has a safe paginated audit read; the command now bounds nested PostgreSQL serialization/deadlock races to a typed 409 conflict | Fresh local PostgreSQL qualification passes 3/3 for idempotent delete/replay with refresh-token revocation, durable stale-version rejection/audit, and concurrent lifecycle conflict bounding. The generated Admin contract covers this route; real Kestrel/JWT access-token policy, full-host and restore evidence remain before exposing the action | PARTIAL |
| ADM-003 | Safe configuration metadata read is now available; Admin V2 create/update/soft-delete now have typed validation, secret/credential rejection, timestamp concurrency, step-up, idempotency, durable audit and post-commit cache invalidation | Fresh qualification is green: the command cohort and the configuration HTTP cases in the 55-test Kestrel/JWT run cover replay/redaction, stale `If-Match`, invalid secret/type rejection, cache invalidation, concurrent create/update boundaries, private `no-store` responses and token revocation. Capability `admin.configuration.mutate` is enabled; full-host/rollback/restore and configuration-consumer compatibility remain release gates | PARTIAL |
| ADM-004 | Report queue/dossier/content and strict reply have dedicated private current-Admin boundaries, validated contiguous Unicode pages and durable audit/receipt; missing actor context or new-command step-up service fails closed | Current qualification phases are in the [support contract](../../halo-finance-backend/docs/admin-report-contract.md). Web64/64 and synthetic partial/malformed-page/recovery/frozen retry checks pass; legacy reply remains410 and reply capability stays gated. Attachment access, unresolved-intent disposition, retention, restore/load, browser-to-real-server and broader cutover remain required | PARTIAL |
| ADM-022 | Report-type catalog has protected list/detail, audited CRUD, version/key/reference guards and legacy MediatR write retirement410; metadata recovery covers create/update/delete | Current local qualification covers report-type PostgreSQL/HTTP CRUD, migration/reference guards and recovery; generated tokenized UI and synthetic CRUD/frozen retry/navigation/reload pass. Capability `admin.report-types.crud` is enabled; full-host/browser-to-real-server/UNKNOWN disposition/app-role/mixed writers/restore/load/cutover remain release gates | PARTIAL |
| ADM-011 | Protected inventory/dossier/version-bound Unicode source, inert policy/sandbox preview, legacy published-only reads/writer410 and GUID redirect; CRUD/publication/recovery/strict DTOs retained | Final288/288 PG/Kestrel-JWT-step-up/MediatR/Swagger PASS, official68/117/Orval/types/web48/48/scoped lint/build and synthetic deep-link/source/preview/mobile-dark/focus PASS. Media/mobile render/category/duplicate-JSON/parser/full-host/browser/app-role/retention/restore/load/mixed binaries remain; mutation CONTRACT_GAP, no full XSS/CRUD closure | PARTIAL |
| ADM-012 | Subscription availability has a dedicated strict Admin V2 command with explicit boolean, verified service actor, optimistic concurrency, idempotency and receipt/audit; catalog CRUD is separate and commercial changes remain closed | Status PostgreSQL 3/3 is included in the final subscription suite 58/58 PASS; Kestrel/JWT also checks invalid sessions and malformed status bodies. Generated contract/client checks pass; full-host/restore, checkout overlap and billing reconciliation remain before enabling availability; only retire is advertised | PARTIAL |
| ADM-013 | Account role assignment now has a dedicated Admin V2 read/command surface with an allow-list, optimistic concurrency, last-active-admin protection, refresh-token revocation, JWT authorization-version invalidation, real step-up and opaque recovery | Fresh disposable PostgreSQL/controller qualification passes 9/9 for actor denial, inactive/deleted actor denial, idempotent promotion and token revocation, stale persistence, failed-revocation rollback and concurrent winner/409 bounding. Capability `admin.accounts.roles` is enabled; re-login/access-token rollout, full-host and restore evidence remain release gates; generated contract coverage is present | PARTIAL |
| ADM-014 | Receipt policy clone now has a V2 command at `/api/admin/receipt-classification/v2/policies/clone` with expected source version, idempotency, durable receipt and audit | Local disposable PostgreSQL race/replay suite covers clone replay, unique version allocation and copied rules; capability `admin.receipt-classification.mutate` is enabled. Full-host/rollback/restore remain release gates; edit, rule and publication are now separately enabled after the same qualification cohort | PARTIAL |
| ADM-015 | Business company rename and PROJECT code/name update now have Admin V2 command routes with verified actor, If-Match/body version agreement, idempotency, serializable transaction, domain validation and audit receipt | Fresh disposable PostgreSQL/controller qualification passes 7/7 for idempotent company rename, durable stale rejection, project scope/version update and concurrent winner/409 bounding. Cursor-to-command refresh semantics, full-host/restore and capability review remain before exposing edit controls; generated contract coverage is present | PARTIAL |
| ADM-016 | Receipt policy draft metadata update now has `PATCH /api/admin/receipt-classification/v2/policies/{policyId}/draft` with bounded score validation, matching `If-Match`/body `ExpectedVersion`, expected `VersionToken`, idempotency, serializable transaction and generic operation/audit receipt; Admin V2 exposes the draft editor | Current disposable PostgreSQL/controller + HTTP qualification passes 23/23 across clone, draft, rule and publication boundaries, with receipt recovery 6/6; capability `admin.receipt-classification.draft-edit` is enabled. Full-host/rollback/restore remain release gates | PARTIAL |
| ADM-017 | Receipt policy rule create/update/deactivate now have V2 commands with normalized patterns, active expense-category checks, shared policy `VersionToken`, idempotency and generic operation/audit receipts; Admin V2 exposes the rule controls | Current disposable PostgreSQL/controller + HTTP qualification passes 23/23 across duplicate/category/replay/race and HTTP CRUD/preconditions, with receipt recovery 6/6; capability `admin.receipt-classification.rules` is enabled. Full-host/rollback/restore remain release gates | PARTIAL |
| ADM-018 | Receipt policy publish/retire now have V2 commands with publication serialization, stale-version checks, single-published enforcement, idempotency and generic operation/audit receipts; Admin V2 exposes publication controls | Current disposable PostgreSQL/controller + HTTP qualification passes 23/23 across concurrent same/different-key publication, replay, rollback and revoked-token denial, with receipt recovery 6/6; capability `admin.receipt-classification.publication` is enabled. Full-host/rollback/restore remain release gates | PARTIAL |
| ADM-006 | Legacy queries have no freshness/partial-data metadata | Add generated-at/source status and preserve per-widget errors | OPEN |
| ADM-007 | Generated client contract | Exporter and pinned Orval agree on 53 paths/94 schemas; `admin:check`, TypeScript and 93 web cases pass. Legacy compatibility facade, full-host load, provider/billing overlap and production cutover remain separate | PARTIAL |
| ADM-008 | Advertising and subscription reads are projected in Admin V2; advertising metadata CRUD and safe subscription catalog metadata CRUD are enabled after backend and HTTP qualification | Advertising CRUD passes PostgreSQL 3/3 plus Kestrel/JWT 7/7; provider upload/delivery remains separate. Subscription CRUD/status/read/controller suite passes 58/58 and web data suite 7/7; generated OpenAPI/client checks pass, while billing/consumer compatibility, navigation recovery and full-host/restore gates remain. Existing commercial-term changes and availability need separate reviewed contracts | PARTIAL |
| ADM-009 | Operations readiness read is now available through a redacted aggregate probe; job controls and detailed operational projections remain closed | Add durable job/queue read models and explicit replay/retry commands with audit before exposing controls | PARTIAL |
| ADM-019 | Platform maintenance now has a redacted read projection and a versioned/idempotent command reusing the configuration audit boundary; a real Program/Kestrel/PostgreSQL cohort is **1/1 PASS** for step-up, replay, restart and stale-version rejection; the unaudited legacy write path is disabled at runtime | Add rollback/restore proof, full-host qualification and operator incident runbook before enabling `admin.operations.maintenance` | PARTIAL |
| ADM-020 | Platform & security now has a metadata-only policy projection at `GET /api/admin/platform/security`, bound to the verified JWT subject and Admin role; Admin V2 displays it under `admin.platform.read` | Qualify no-store/redaction/denied-actor HTTP behavior and full-host evidence; define separate step-up and audited mutation contracts before adding platform controls | PARTIAL |
| ADM-021 | Subscription catalog CRUD has inactive create, descriptive update and protected soft-delete with immutable commercial terms, strict DTOs, serializable operation/audit, complete fingerprints and rejected-replay 409; verified detail/options and recovery-aware inline editor are wired | Final focused backend qualification 58/58 PASS, web data 7/7 PASS, generated OpenAPI/client check, scoped lint/build and synthetic responsive/dark/same-key lost-reply checks pass. Capability `admin.subscriptions.crud` is enabled for metadata CRUD. Checkout overlap, consumer compatibility, route/reload recovery, full-host and restore remain release gates; existing-plan commercial changes need a separate reviewed revision/payment-snapshot contract | PARTIAL |
| ADM-010 | Generic Admin V2 command receipt/audit contract is now present for the first status slice; broader commands still lack migrated evidence | Keep `GET /api/admin/command-audit` redacted and paginated, then migrate one vertical slice at a time under `docs/admin-command-contract.md`; capabilities remain closed until evidence passes | PARTIAL |

The current Admin OpenAPI preserves strict request bodies, required command headers, bounded catalog inputs and error status descriptions. The generated facade is checked against the exporter; source and exact validation are recorded in the platform reset report. Legacy compatibility reads, billing/consumer overlap, full-host load and production restore gates remain separate.

Dependency follow-up: after pinning the generator, `npm audit --omit=dev
--audit-level=high` reports 12 high and 1 critical production findings (plus 4
moderate). This remains a separate release gate; no audit fix or forced upgrade
was applied while generating the contract.
