# Admin command contract and rollout

Unseen disposition16/10: the generated `cancel-unseen` POST can reserve an
unaccepted generic command key with a real step-up and audit. Existing accepted
work retains its real outcome; no timeout becomes a false rejection. Capability
`admin.commands.disposition` is enabled only when the response confirms
CanCancelUnseen for the current locator. Typed CANCELLED evidence clears the
journal and remounts the route child; a lost decision response keeps it frozen
until lookup. Thirty generic identities are supported; separate operation stores
and the hidden maintenance alias remain lookup-only. Backend126/126, separate
capability2/2, web67/67/generated/types/scoped lint/build and synthetic lost-response
recovery pass. [Exact contract, rollout and limits](../../halo-finance-backend/docs/admin-command-recovery-contract.md).

Report-type follow-up12/10: dedicated catalog create/update/unused-only delete
reuse generic Admin operation/audit, verified/persisted Admin, strict version/key
contracts and reference-safe row locks. READ COMMITTED supplies a fresh reference
snapshot after waiting on legacy creators; DB refuses stale-snapshot deletion.
Real MediatR retires legacy type writes410. Final affected88/88 and synthetic
CRUD/same-key retry are local evidence; capability `admin.report-types.crud` is
enabled while full-host/reload/restore/load/app-role/global snapshot gates remain
release requirements.
[Catalog contract](../../halo-finance-backend/docs/admin-report-type-contract.md).

This document is the implementation boundary for Admin V2 mutations. A legacy endpoint may exist, but it must not be exposed as an Admin V2 action until it satisfies the command, authorization, concurrency, replay, audit and observability rules below.

## Invariants

1. The backend is the authorization boundary. Every command resolves the actor from the verified JWT subject, loads the current account, checks `Admin`, and evaluates the target scope in the handler. A client supplied actor, role, tenant, company or project is never trusted.
2. A command has one durable outcome. The state change, operation receipt and audit evidence are committed in one database transaction. Provider or queue work is represented by an outbox row in that same transaction.
3. Repeating the same request with the same idempotency key returns the original outcome. Reusing a key with a different canonical request fingerprint is rejected as a conflict. A process restart cannot lose the outcome.
4. Concurrent writes require an expected version (`If-Match`/row version). A stale command fails without overwriting a newer state. Do not use last-write-wins for privileged or financial data.
5. Receipts and audit records contain metadata and bounded references only. They must not persist access tokens, credentials, provider payloads, raw secrets or unbounded request bodies.
6. Every `/api/admin` response is `private, no-store`, including authentication failures, validation/conflict responses and command receipts. Admin data must not become a shared browser/proxy cache.

## Durable command record

The planned generic record is `AdminCommandOperation` (name can change during schema review, but the semantics are fixed):

| Field | Contract |
|---|---|
| `Id` | server generated UUID; public correlation/receipt identifier |
| `ActorUserId` | verified JWT subject copied after account lookup |
| `Action` | allow-listed command name, for example `advertise.create` |
| `TargetType`, `TargetId` | bounded target identity; nullable only for explicit collection commands |
| `ScopeType`, `ScopeId` | platform scope or approved resource scope |
| `IdempotencyKey` | unique within actor + action + scope; never accepted from a URL |
| `RequestFingerprint` | canonical hash of allowed input and target; no raw payload |
| `ExpectedVersion` | version supplied by the caller when the target is versioned |
| `Status` | `PREPARED`, `COMMITTED`, `REJECTED`; terminal status is immutable |
| `ResultCode`, `ResultReference` | bounded result and optional safe resource reference |
| `CreatedAt`, `CompletedAt` | UTC instants from the database/application clock contract |
| `CorrelationId` | request trace identifier, safe to log and return |

Recommended database constraints are a unique `(ActorUserId, Action, ScopeId, IdempotencyKey)`, a bounded action/result check, an index for target and actor history, and an immutable status transition rule. The operation table is not a replacement for the domain entity's own version/concurrency token.

## Audit record

`AdminCommandAudit` is append-only and references the operation. It stores actor, action, target, scope, result, reason code, before/after version and timestamps. It does not store secrets, full provider responses, raw HTML, or the full request. Reads use a redacted projection and cursor pagination. Audit insertion is part of the command transaction; an audit failure aborts the mutation.

## Handler and HTTP flow

1. Authenticate JWT and reject missing, inactive or deleted accounts.
2. Validate DTO, money/date/timezone and target identifiers before opening external work.
3. Resolve verified actor and authorization in the handler; re-check ownership/scope for every target.
4. Compute the canonical fingerprint and reserve/load the idempotency operation inside a serializable or equivalent database transaction.
5. If a prior terminal operation exists, return the stored safe receipt; if the fingerprint differs, return conflict.
6. Load the target with a concurrency token, apply the domain invariant, append outbox work if needed, append audit evidence, and mark the operation terminal.
7. Return the operation receipt with `Id`, status, result code, correlation id and current resource version. Never return provider credentials or unbounded payloads.

Required headers are `Idempotency-Key` for every mutation and `If-Match` for versioned targets. The API must document 401/403, 404, 409 stale/fingerprint conflict, 422 validation/domain rejection and 5xx retry guidance.

## Scope rules for current admin slices

- Account lifecycle already has a specialized operation/audit implementation and remains the reference slice. It accepts only `ACTIVE`, `SUSPENDED`, or terminal `DELETED`, requires a trimmed nonblank operator reason (maximum 500 characters), `Idempotency-Key` plus `If-Match` (`User.ConcurrencyStamp`), blocks self-suspension/self-delete, revokes refresh tokens on delete, and records the user transition and audit entry atomically. A fresh disposable PostgreSQL run passes 3/3 for delete replay/token revocation, durable stale-version rejection, and concurrent lifecycle conflict bounding. Nested unique/serialization/deadlock failures are converted to a bounded `ADMIN_LIFECYCLE_CONFLICT` 409 when no replay row is available. The generated Admin contract covers this route; real Kestrel/JWT access-token policy, full-host and restore gates remain open, so `admin.accounts.lifecycle` stays gated. Do not duplicate it in the generic table.
- Advertisement status is the first generic operation slice at `PATCH /api/admin/advertising/{advertiseId}/status`. It requires the same trimmed nonblank operator reason (maximum 500 characters), uses `Advertise.Version`, the generic operation/audit tables, and the same replay/conflict rules. Metadata create/update/delete are enabled under the same verified Admin/idempotency/version/audit boundary after PostgreSQL 3/3 and Kestrel/JWT 7/7 qualification; provider upload/delivery remains outside this contract.
- Advertisement metadata CRUD is implemented at `POST /api/admin/advertising`, `PATCH /api/admin/advertising/{advertiseId}`, and `DELETE /api/admin/advertising/{advertiseId}`. Create is idempotent; update/delete require `If-Match` with `Advertise.Version`; all three write a bounded operation and immutable audit in the same serializable transaction. Input validates explicit UTC `DateTimeOffset` ranges, HTTPS image references, HTTP(S) redirect references, bounded text, soft-delete semantics and nested PostgreSQL race handling. Media upload/provider IO is deliberately outside this command: the command accepts only an already-issued HTTPS reference and never stores provider credentials or payloads. Disposable PostgreSQL coverage passes 3/3 and the real Kestrel/JWT journey passes 7/7 for session denial, replay, stale version, status, soft-delete and private no-store responses. Capability `admin.advertising.crud` is enabled; provider upload/delivery, full-host and restore evidence remain separate release gates.
- Report queue/dossier/content use dedicated private queries and persisted active Admin checks. Every web page must match the dossier identity/version/Unicode length/offset/continuation before composing text; reply requires the complete valid sequence. Failed refetch hides prior text and reload retries content even with unchanged detail. Reply PATCH requires strict body, Idempotency-Key/If-Match, command-bound Admin step-up for a new write and current persisted Admin through a serializable transaction; missing verified context is denied and missing assurance service fails closed. Only PENDING→APPROVED/REJECTED, reply≤500, reply/version/operation/audit atomic. Protected identical replay needs no new proof; rejected replay stays409; runtime legacy reply returns410. Current source/test phases are recorded in the [support contract](../../halo-finance-backend/docs/admin-report-contract.md). Web64/64, generated check/typecheck, scoped lint/build and synthetic malformed-page/recovery/frozen retry checks pass. Reply is enabled as `admin.reports.reply: V2_COMMAND` after the actual Program/HTTP qualification; attachment/restore and broader release evidence remain separate gates.
- Blog Admin V2 commands are `POST /api/admin/content/blogs`, `PATCH /api/admin/content/blogs/{blogId}`, `DELETE /api/admin/content/blogs/{blogId}`, plus publication at `PATCH /api/admin/content/blogs/{blogId}/publication`. Create uses actor-scoped idempotency; update/delete/publication require `If-Match` and advance the optimistic `Blog.Version`; publication also accepts the optional command-bound Admin step-up proof. All writes create a durable operation and audit receipt in the same transaction. Content accepts only the bounded semantic HTML allowlist, HTTPS `href/src` and JSON without active markup/schemes; invalid category, thumbnail, markup or stale version fails before an economic/content write. `admin.content.mutate: V2_COMMAND` is enabled for this bounded metadata/publication surface after real Program/HTTP qualification; media/provider/retention and deployment evidence remain separate gates.
- Subscription availability is implemented at `PATCH /api/admin/subscriptions/{subscriptionId}/status` with `Subscription.Version`; it controls whether new checkout reads may select the plan, while in-flight provider payments and existing memberships require separate reconciliation contracts. A fresh disposable PostgreSQL/controller run passes 3/3 for replay/version advancement, durable stale rejection and concurrent winner/409 bounding. Kestrel/JWT, OpenAPI/full-host/restore and billing reconciliation evidence remain open, so `admin.subscriptions.mutate` stays gated.
- Receipt policy clone is implemented at `POST /api/admin/receipt-classification/v2/policies/clone`. It requires `SourcePolicyId`, the exact `ExpectedSourceVersion` (`ReceiptClassificationPolicy.VersionToken`), an idempotency key and an optional bounded reason. The transaction copies the source policy and rules into a new `DRAFT`, allocates the next policy version, records a generic operation and immutable audit, and returns the draft receipt. Draft metadata update is implemented at `PATCH /api/admin/receipt-classification/v2/policies/{policyId}/draft`; it requires all five bounded scoring values, matching `If-Match`/`ExpectedVersion`, idempotency and an optional reason, and increments `VersionToken` atomically. Rule create/update/deactivate are implemented at the V2 policy rule routes and use the policy `VersionToken` as the shared concurrency boundary; patterns are normalized, categories are checked against active expense defaults, and every rule edit increments the policy version with a generic operation/audit receipt. Publication is implemented at `POST /api/admin/receipt-classification/v2/policies/{policyId}/publish` and `/retire`; publication serializes on PostgreSQL, retires the previous published policy before promoting the draft, and both commands use stale-version, idempotency and audit semantics. The current disposable PostgreSQL/controller run passes 23/23, and the real Kestrel/JWT fixture contributes the 8 HTTP cases within that run for command boundaries, private no-store responses, preconditions, replay and revoked-token denial; recovery also validates policy/rule receipts through opaque policy-scope/version locators. Capabilities `admin.receipt-classification.draft-edit`, `.rules` and `.publication` are enabled in V2. Full-host/OpenAPI/restore/process-kill and production evidence remain release gates.
- Account role assignment has a read projection at `GET /api/admin/accounts/{userId}/role` and a command at `PATCH /api/admin/accounts/{userId}/role`; the command uses `User.ConcurrencyStamp` as the expected version. Only `ADMIN` and `MEMBER` are accepted; the application service verifies the actor is active, not deleted and has `ADMIN`, self-demotion and removal of the last active non-deleted Admin are rejected. A committed role change updates the security/concurrency stamps and revokes refresh tokens, so JWTs carrying the previous `auth_version` cannot pass token validation. A fresh disposable PostgreSQL/controller run passes 9/9 for actor denial, inactive/deleted actor denial, real step-up, replay/token revocation, stale persistence, failed-revocation rollback and concurrent winner/409 bounding. Recovery validates the command receipt with an opaque locator. Capability `admin.accounts.roles` is enabled in V2; re-login/access-token rollout, OpenAPI, full-host and restore evidence remain release gates.
- Account inventory is read through `GET /api/admin/accounts` with a protected actor/filter/limit cursor. The projection contains only identity needed for operations (name, email, lifecycle, security flags, created/last-access timestamps and concurrency version); phone, avatar, profile, balance and other personal/financial fields are excluded. Lifecycle commands consume the returned concurrency version and reauthorize at the command boundary.
- System configuration CRUD is implemented at `POST/PATCH/DELETE /api/admin/configuration/v2`. Create, update and soft-delete use one durable operation/audit transaction; update/delete require matching `If-Match` and body `ExpectedLastUpdatedAt`. Keys and values are bounded and typed (`string`, `bool`, `int`, `decimal`, `datetime`, `json`); key names containing secret/credential material are rejected so provider credentials remain in secret management. Cache invalidation occurs after commit. Step-up is command-bound for production DI. The command cohort and the current HTTP fixture are green, including replay/redaction, stale timestamps, invalid secret/type input, cache invalidation, concurrent create/update boundaries, private `no-store` responses and token revocation. Recovery now validates create/update/delete operation/audit receipts with opaque locators, including generated create targets and timestamp-bound edits/deletes. Capability `admin.configuration.mutate` is enabled; full-host, rollback/restore and consumer-compatibility remain release gates.
- Platform maintenance is now a typed control over the existing `SystemMaintenanceMode` configuration. Read is `GET /api/admin/operations/maintenance` and mutation is `PATCH /api/admin/operations/maintenance` with `Enabled`, a matching `If-Match`/`ExpectedLastUpdatedAt`, `Idempotency-Key` and bounded reason. It reuses the configuration command transaction so the switch, cache invalidation, durable receipt and audit share one boundary. A real Program/Kestrel/PostgreSQL cohort is **1/1 PASS** for step-up, replay, restart and stale-version rejection (`admin-maintenance-program-20261017.trx`). The legacy `POST /api/admin/maintenance` path is disabled for runtime requests to prevent an unaudited direct write; maintenance mutation remains `CONTRACT_GAP` until rollback/restore, full-host qualification and the operator incident runbook are complete. Account role and lifecycle writes use the same production step-up service when registered; role, lifecycle, advertising, configuration and receipt-policy capabilities are enabled independently through the server registry.
- System configuration and subscription catalog commands have durable receipt/audit/idempotency/version boundaries. Subscription catalog metadata CRUD is enabled in V2: create always starts inactive, metadata update cannot rewrite price/duration/executable grants, and delete protects membership/publication history and rejects unsafe plans. Verified detail/options and inline editors are wired, with focused backend 58/58 and web 7/7 plus synthetic same-key/body retry evidence. Commercial changes, billing and financial controls require separate contracts; billing/consumer overlap, navigation recovery and full-host/restore remain open. Availability/retire remains `CONTRACT_GAP` under `admin.subscriptions.mutate`. [Subscription contract](../../halo-finance-backend/docs/admin-subscription-contract.md). Receipt-policy clone, draft, rule and publication commands are enabled under their own V2 capability boundaries. Legacy system-config writes are closed at runtime with `410` rather than bypassing V2.
- Read endpoints may ship independently when they return redacted, paginated, freshness-aware projections and enforce actor authorization.

## Rollout gates

### Gate A — schema and compatibility

Add the operation/audit tables, constraints, indexes and model snapshot with a forward-compatible migration. Existing entities gain additive version/concurrency fields only where a command needs them. The migration must have a rollback/roll-forward plan and must not silently skip errors.

### Gate B — one vertical slice

Implement one low-risk non-financial command end to end (for example advertisement status) with handler authorization, idempotency race tests, stale-version tests, audit redaction tests, restart/replay tests and OpenAPI examples. Keep the capability `CONTRACT_GAP` until all gates pass.

### Gate C — side effects and operations

Move provider/job effects behind the transactional outbox, add recovery/readiness projections, and verify duplicate delivery is harmless. Expose replay/retry controls only as separately authorized, audited commands.

### Gate D — capability enablement

Only after the backend contract, tests, OpenAPI/generated client and production readiness checks pass may the capability change to `V2_COMMAND` and the UI action be enabled. A failed gate leaves the action hidden/disabled and records the reason in the capability projection.

## Review checklist per command

- verified subject, role and target scope checked in the handler;
- DTO, money, date and timezone validation explicit;
- idempotency reservation and fingerprint conflict behavior tested under race;
- transaction boundary includes domain write, receipt, audit and outbox;
- expected version/stale write behavior tested;
- bounded errors and safe receipt projection documented;
- no secret/provider payload in URL, logs, browser storage or audit;
- pagination/freshness metadata for reads;
- migration compatibility and rollback/roll-forward plan recorded;
- capability remains closed until all evidence is available.
