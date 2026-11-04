# Admin domain map

| Domain | Authoritative backend surface | Admin V2 first query | Mutation status |
|---|---|---|---|
| Command center | `AdminStatisticController` | dashboard/revenue/report projections | read contract exists; freshness metadata gap |
| Accounts | `AdminAccountDirectoryController`, `AdminStatisticController`, `AdminController` lifecycle/role commands and audit query | redacted cursor account list + user metrics + lifecycle/role receipts + safe audit outcomes | suspend/reactivate/delete and role command are enabled in V2 after local PostgreSQL/controller qualification; re-login/full-host/restore remain release gates; impersonation remains closed |
| Reports & support | `AdminReportsController`, `AdminReportTypesController`, dedicated services; legacy user ReportController remains separate | protected queue/dossier/versioned Unicode content and type catalog list/detail | type catalog CRUD and report reply use separate audited capabilities; report reply is `admin.reports.reply: V2_COMMAND` after real Program/HTTP step-up/replay/recovery/restart/role-fencing evidence. Legacy reply/type writes410; attachments/retention/full-host/global snapshot/restore/load/cutover remain open |
| Content | `AdminContentQueriesController`, `AdminContentController`; legacy reads published-only/writes410 | Protected inventory/dossier/version-bound Unicode source, inert preview and legacy GUID redirect; audited commands | Selected288/288 PG/Kestrel-JWT-step-up/MediatR/Swagger and web48/48 pass. Mutation stays gated: mobile render/media/category/duplicate-JSON/parser/full Program/browser/app-role/retention/restore/load/mixed binaries remain |
| Advertising | `AdvertiseController`, `AdminStatisticController`, `AdminAdvertisingController` | campaign list + delivery metrics + audited metadata commands | V2 read/status/create/update/delete enabled with versioned recovery; provider/media upload and delivery remain separate |
| Subscriptions | `SubscriptionController`, `AdminSubscriptionsController` | paginated legacy catalog plus verified V2 exact-string detail and catalog options | V2 inactive-create/descriptive-update/protected-delete CRUD is enabled with command-bound step-up, recovery and immutable commercial terms; availability remains separately gated for checkout overlap. Local backend 58/58 and web 7/7 evidence remains subject to full-host/restore gates |
| Receipt classification | `ReceiptClassificationAdminController`, `AdminReceiptClassificationCommandsController` | policy inventory | V2 read plus audited clone, draft metadata, rule and publication commands; all command capabilities are enabled after local PostgreSQL/Kestrel qualification, while full-host/restore remain release gates |
| Platform configuration | `AdminController`, `AdminConfigurationCommandsController` | metadata-only configuration inventory | V2 create/update/soft-delete commands enabled with typed validation, step-up, timestamp concurrency, cache invalidation and audit; raw values remain withheld |
| Operations | `AdminOperationsController`, `BackendReadinessProbe` | redacted readiness status | job detail, retry, replay and queue controls remain closed |

Admin V2 must not infer a command from the existence of an entity or a legacy button. Each missing mutation remains a contract gap until backend DTO, authorization, idempotency, audit and tests exist.

`GET /api/admin/capabilities` is the server-owned navigation and capability
catalog for the verified Admin role. It describes module availability but does
not authorize a mutation; each command still requires its own route policy,
handler authorization, idempotency, optimistic concurrency and durable audit
outcome. Generic command evidence is available through the redacted,
paginated `GET /api/admin/command-audit` projection.
