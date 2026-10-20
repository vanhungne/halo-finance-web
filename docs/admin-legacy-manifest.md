# Admin legacy manifest

Configuration retirement12/10: GET/POST/PUT `/api/admin/system-config` and direct
legacy handler dispatch now deny410; missing verified context denies401, including
the old controller constructor's maintenance path. Raw values are not a compatible
legacy read. Use redacted `/api/admin/configuration` and typed/audited V2 commands;
keep410 visible as a migration error rather than empty/success. No write capability
is newly enabled. [Boundary/evidence](../../halo-finance-backend/docs/admin-legacy-configuration-retirement.md).

| Route | Current page | Current contract | Migration status |
|---|---|---|---|
| `/admin` | DashboardPage | `GET /api/admin-statistic/dashboard` | V2 read-only replacement started |
| `/admin/users` | UserPage | `GET /api/account`, `GET /api/admin-statistic/user` | V2 read-only replacement started |
| `/admin/revenue` | RevenuePage | `GET /api/admin-statistic/revenue` | Legacy retained |
| `/admin/transaction` | TransactionPage | transaction service | Legacy retained; contract audit required |
| `/admin/reports` | ReportPage | legacy user report/type reads; runtime reply410, type POST/PUT/DELETE410 through real MediatR | Legacy reads retained; V2 has protected queue/dossier/content plus dedicated catalog reads/audited CRUD. Commands gated pending global snapshot/full-host/recovery/restore/load/cutover; attachments/retention remain open |
| `/admin/blogs` | Navigate → Content V2 | V2 inventory, writes capability-gated; legacy POST/PUT/DELETE deny410 | Redirect with replace; old form/render no longer mounted |
| `/admin/blogs/:id` | Navigate → Content V2 with blogId | Protected dossier preserves valid GUID, versioned Unicode source and inert preview | Synthetic/local DB+HTTP qualified; real host/consumer/cutover still required |
| `/admin/blogs/create` | Navigate → Content V2 | V2 inventory; legacy upload denies410 | Protected media replacement required before full editor parity |
| `/admin/ads` | AdvertisePage | advertise CRUD/status services | Legacy retained |
| `/admin/packages` | PackagePage | subscription list service | Legacy retained |
| `/admin/config` | ConfigurationPage | system config read/update | Legacy retained; R3 hardening required |
| `/admin/receipt-classification` | ReceiptClassificationPage | receipt classification services | Legacy retained for reads and compatibility; Admin V2 exposes separately routed, audited clone/draft/rule/publication commands, all capability-gated pending PostgreSQL qualification |

Legacy shell: `src/layout/adminLayout.jsx` and `src/components/sidebar/AdminSidebar.jsx`.

Legacy visual risk: pages use mixed utility classes, hard-coded semantic palettes, large gradients and page-local async handling. Do not import these presentation modules into Admin V2.
