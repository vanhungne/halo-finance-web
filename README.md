04/11 — [Đã xóa dashboard demo `/app`](../docs/WEB_DEMO_RETIRED_2026-11-04.md), các route con, layout và nút mở demo tại Login. URL cũ hiện trang không tồn tại; consumer demo trong các ghi chú cũ đã được retire.

04/11 — [Responsive web ngoài admin](../docs/WEB_MOBILE_RESPONSIVE_2026-11-04.md): landing/legal/tools/chia tiền nhóm và consumer demo được kiểm tra ở 320/390/768/1440px, thêm dialog landscape. Build/scoped lint/unit/browser local đạt. Full lint/dependency audit còn lỗi; `/app/*` và form xóa tài khoản vẫn demo, chưa phải production acceptance.

04/11 — [Chia tiền nhóm trên trình duyệt](../docs/group_split_web/GROUP_NEUTRAL_VIEW_2026-11-04.md#ngừng-chia-sẻ-nhóm-trên-web). Đã ngừng luồng chia sẻ nhóm qua link hoặc QR.

04/11 — [Chia sẻ nhóm web](../docs/group_split_web/GROUP_NEUTRAL_VIEW_2026-11-04.md#modal-chia-sẻ-và-tab-cài-đặt) tạo QR tại trình duyệt với qrcode 1.5.4. Cài đặt nằm sau Thống kê.

04/11 — [Thao tác Công cụ bằng icon](../docs/tools_hub/ICON_ACTIONS_2026-11-04.md): copy trong ô kết quả trước currency, refresh góc phải, download bên trái refresh. Không text/viền; aria/focus/44px/feedback giữ. Build/scoped lint/13unit/17browser PASS, chỉ local.

04/11 — [Quy đổi tiền tệ theo mẫu mới](../docs/tools_hub/CURRENCY_CONVERTER_REDESIGN_2026-11-04.md): hai field inline currency/swap giữa/rate trên, daily chart cùng cặp phía dưới. Exact amount/query/cache giữ; build/scoped lint/13unit/16browser PASS, chỉ local.

04/11 — [Cờ trong danh sách chọn tiền tệ](../docs/tools_hub/CURRENCY_PICKER_FLAGS_2026-11-04.md): thay native select bằng picker chung có cờ từng dòng, search không dấu, keyboard/focus, popup thích ứng. Áp dụng quy đổi/lịch sử. Build/scoped lint/13unit/15browser PASS; chỉ local.

04/11 — [Gỡ luồng Cẩm nang quản trị/Ebook](../docs/landing_reference/EBOOK_FLOW_RETIRED_2026-11-04.md): bỏ menu/footer, form/modal, state/callback trên home/legal/tools và component cũ. Resources còn So sánh/FAQ; QR tải app giữ. Build/scoped lint/13unit/14browser/7nhóm UI PASS; chỉ local.

04/11 — [Bỏ breadcrumb và trang Tất cả công cụ](../docs/tools_hub/DIRECTORY_REMOVED_2026-11-04.md): menu vào trực tiếp từng tool, bỏ link hub/footer và breadcrumb/schema, `/tools/` cũ về home. Build9chi tiết/8indexable, scoped lint/13unit/14browser/6nhóm alias UI PASS; không deploy.

04/11 — [Hình vàng/bạc và cờ tiền tệ](../docs/tools_hub/VISUAL_ASSETS_2026-11-04.md): shared menu/card/detail, Pair giữ native select có cờ cập nhật; local SVG/license, globe fallback. Build/scoped lint/13unit/16browser (14regression +2asset) PASS; chưa deploy.

04/11 — [Menu Công cụ theo nhóm](../docs/landing_reference/GROUPED_TOOLS_MENU_2026-11-04.md): sáu cụm có icon/mô tả, desktop hai cột/mobile cuộn; Tính năng đi thẳng #features kể cả từ trang tools. Scoped lint/build/13unit/14browser/4nhóm navigation PASS; chỉ local.

04/11 Tools UI copy: [ẩn thông tin API/provider](../docs/tools_hub/UI_SOURCE_DISCLOSURE_2026-11-04.md) trong menu/card/SEO/FAQ/status/CSV, giữ ngày cập nhật và minimal required credits theo xác nhận người dùng. Build13unit/14browser PASS; không đổi API contract/CI/CD hoặc deploy.

04/11 — Tools Hub LOCAL SCOPE COMPLETE: người dùng chốt code/UI/build/SEO/QA local, chưa phát hành production.13unit/14browser/native Nginx đạt;28source hashes khớp evidence. [Completion audit](../docs/tools_hub/IMPLEMENTATION_2026-11-03.md), [runbook cho release tương lai](../docs/tools_hub/OPERATIONS.md). Không push/deploy hoặc sửa CI/CD.

04/11 — [Tools Hub hosting](../docs/tools_hub/IMPLEMENTATION_2026-11-03.md#follow-up-hosting04112026): build thêm dist/tools-routes.nginx.conf (chỉ sinh, không apply), native local Nginx/301/404/assets +14browser và13unit đã đạt. [Runbook](../docs/tools_hub/OPERATIONS.md) có hướng dẫn include/review và tests/toolsHosting.mjs. Production vẫn SPA fallback; NO-GO/CI/CD giữ nguyên.

03/11 — [Công cụ tài chính API-first](../docs/tools_hub/README.md) đã có trong working copy: /tools/, header/footer menu,8tool + CPI widget, QR OFF, static SEO prerender. Build rồi npm run test:tools (12tests); [contract/evidence](../docs/tools_hub/IMPLEMENTATION_2026-11-03.md) và [browser/hosting/runbook](../docs/tools_hub/OPERATIONS.md). Chưa deploy/production acceptance, full lint còn lỗi legacy; không đổi landing sections hoặc CI/CD.

# Trợ Lý Tài Chính website

31/10 — **ĐÃ HOÀN TÁC theo yêu cầu người dùng:** trả nguyên dữ liệu và giao diện phần so sánh về snapshot trước sửa để người dùng tự biên tập. [Lịch sử, không phải bản triển khai hiện hành](../docs/landing_reference/WHY_CHOOSE_COPY_REVIEW_2026-10-31.md).

31/10 — [Menu mobile đồng bộ landing](../docs/landing_reference/MOBILE_NAVIGATION_REFRESH_2026-10-31.md): dialog sáng, 4 nhóm dùng chung dữ liệu desktop, đúng anchor/callback, focus/scroll cleanup và dock tải gọn; cell bảo mật có gradient nhẹ. Scoped lint/build/10 case browser + behavior PASS; full lint 58 errors/14 warnings ngoài scope, detector chưa khả dụng. Không thay backend hoặc release NO-GO.

31/10 — [Thiết kế lại phần bảo mật](../docs/landing_reference/SECURITY_SECTION_REDESIGN_2026-10-31.md): tiêu đề thân thiện, 6 khả năng thực tế trong khung trắng liền ô 1/2/3 cột, giữ nền/font/`#security` và `/privacy`. Scoped lint/build/10 case browser PASS; full lint 58 errors/14 warnings ngoài scope, detector chưa khả dụng. Chỉ presentation, production vẫn NO-GO.

31/10 — [Khảo sát tài chính hai phần](../docs/landing_reference/FINANCIAL_WELLBEING_SURVEY_2026-10-31.md):10câu, tra bảng CFPB theo tuổi/mode, đánh giá và gợi ý từ đáp án; chỉ React state.9/9unit,164giá trị lookup,8browser case/keyboard/privacy/build PASS. Bản dịch Việt ghi rõ chưa chuẩn hóa; không API mới.

31/10 — Reviews đổi phong cách, giữ6tên/chức vụ–địa điểm và nội dung mẫu, không avatar; bỏ số người dùng tin cậy và các dấu đánh giá/xác thực/thời gian, thêm notice minh họa. Build/scoped lint/8case browser PASS. [Checkpoint](../docs/landing_reference/USER_REVIEWS_RESTYLE_2026-10-31.md).

> **Audit ngoài landing31/10/2026:** [báo cáo](../docs/PLATFORM_DEEP_AUDIT_2026-10-31.md) · [gói Markdown cho GPT](../docs/platform_audit/2026-10-31/README.md). Bao gồm Admin legacy/V2, auth/session/capability/recovery, consumer demo/policies và88file UI catalogs;92/92Admin+3/3receipt+typesPASS,nonlanding lint27errors/16warnings. Không audit hoặc thay đổi landing trong nhiệm vụ này; các checkpoint UI bên dưới là lịch sử riêng.

31/10 — Landing đã sắp lại12section theo mạch nhu cầu→minh họa→chi tiết→tin cậy→tải app; Solutions3nhóm, business demo và anchor đã cập nhật. Màu nền/font và nguồn Đánh giá giữ nguyên. Build/scoped lint/8case browser PASS; full lint còn63errors/14warnings. [Checkpoint](../docs/landing_reference/LANDING_SECTION_ORDER_IMPLEMENTED_2026-10-31.md).

30/10 — Thêm section **Trước/Sau** sau danh sách tính năng,5cặp so sánh phù hợp Cá nhân/Nhóm/Kinh doanh, desktop hai cột/mobile từng cặp, Việt/Anh. Build/scoped lint/8case browser PASS; không thay background các phần cũ. [Checkpoint](../docs/landing_reference/BEFORE_AFTER_SECTION_2026-10-30.md).

30/10 follow-up — Màu nền các phần đã trả về bản gốc (Hero sáng, footer tối); giữ Be Vietnam Pro và hệ chữ mới. Build/đối chiếu background10section ở390/1440px PASS. [Checkpoint hiện hành](../docs/landing_reference/LANDING_STYLE_CONGCUNHANH_2026-10-30.md).

30/10 — **Style landing hiện hành**: Be Vietnam Pro self-host, hệ chữ/màu tham chiếu Công Cụ Nhanh; Hero xanh, header/footer sáng, menu thu gọn dưới1280px. CSS chỉ áp dụng `.landing-page`. Build và8case browser/isolation PASS; full lint còn71errors/14warnings cũ. [Design authority](DESIGN.md) · [checkpoint](../docs/landing_reference/LANDING_STYLE_CONGCUNHANH_2026-10-30.md).

30/10 — Riêng **danh sách tính năng** đã đổi thành ba nhóm Cá nhân/Nhóm/Kinh doanh theo mẫu directory, icon+tên+mô tả, responsive1/2/4cột. Scoped lint/build và8case browser PASS; full lint còn71errors/14warnings ngoài phần sửa. [Checkpoint hiện hành](../docs/landing_reference/FEATURE_DIRECTORY_2026-10-30.md). Các section khác giữ bản sau rollback bên dưới.

Landing follow-up30/10 **ROLLED BACK theo yêu cầu người dùng**: phần giữa Hero–FAQ đã khôi phục từ snapshot trước triển khai; Hero/header/FAQ/CTA/Footer không đổi. [Checkpoint đã hoàn tác](../docs/landing_reference/LANDING_MIDDLE_IMPLEMENTED_2026-10-30.md) giữ evidence lịch sử; không dùng kết quả của bản6section làm hiện trạng runtime.

> **Audit source/flows 29/10/2026:** [bản đồ toàn nền tảng](../docs/PLATFORM_DEEP_AUDIT_2026-10-29.md), [feature walkthrough/evidence](../docs/platform_audit/2026-10-29/README.md). Phân biệt implemented/demo/contract gap; không dùng counts/checkpoint cũ làm current proof. Runtime không đổi trong audit, production vẫn NO-GO.

Receipt replacement20/10 removes both old classification pages/routes and their
generated API/recovery clients. The incoming AI management UI remains at
`/admin/ai-management`. The OpenAPI input is regenerated from the new backend.
[Current backend contract and rollout](../halo-finance-backend/docs/receipt-gateway-replacement.md).
Current replacement checks: Admin92/92 and receipt3/3, generated/typecheck,
scoped lint and production build PASS. Prior full-lint/audit findings remain.

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

React web client for the Trợ Lý Tài Chính personal-finance platform. It serves the public
landing/email-result pages and the administrative console. The primary
authenticated consumer experience lives in Mobile. Website consumes
`backend-api`.

## Merge integration — 2026-10-20

Resolved the eight conflicts between local `3c19b0b` and fetched `9db5f715`.
The incoming landing page/domain, login appearance, customer demo and legacy AI
management route coexist with `/admin-v2` and receipt classification. Legacy blog
routes still redirect to the hardened V2 content screen. AdminHeader imports the
shared session context rather than the provider module.

Login retains the single Admin session coordinator, bounded errors and
password-bound SMS/authenticator challenge. It does not restore direct token
writes, duplicate refresh timers or non-Admin access to the console. Google
sign-in is explicitly unavailable here pending a safe OAuth handoff; legacy
token-bearing callback parameters are removed from the address and never imported.
`/app` and its child routes are public demonstrations with sample data and an
explicit demo notice, not authenticated customer finance operations. Leaving the
demo returns home without pretending to revoke an Admin session.

`package-lock.json` was regenerated by npm from the merged manifest, retaining
Admin Query/Orval dependencies and adding the incoming Three.js dependencies.
Verification on Node 24.14.0:

- `npm run test:admin`: 93/93 pass.
- `node --test --test-isolation=none tests/authSession.test.mjs src/services/receiptIntelligence.test.mjs`:
  42/42 pass (39 session cases already in the Admin suite, plus 3 receipt cases).
- `npm run admin:typecheck` and scoped ESLint for the eight edited source files:
  pass; `npm ls --depth=0` has no missing dependencies.
- `npm run build`: pass, 3,700 modules; main JS 1,448.35 kB/gzip 417.29 kB,
  shared 3D chunk 931.43 kB/gzip 251.10 kB. The 500 kB warning remains.
- Full `npm run lint`: 41 errors/14 warnings in existing/incoming source.
  `npm audit --omit=dev`: 17 advisories (4 moderate, 12 high, 1 critical).
  No automatic dependency upgrade was performed.
- Browser smoke verification was blocked before navigation: the browser tool
  could not initialize (`failed to write kernel assets`, OS error 3). No new
  authenticated browser-to-backend journey or production qualification is claimed.

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
