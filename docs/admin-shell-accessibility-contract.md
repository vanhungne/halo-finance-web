# Admin V2 shell, shared dialogs and route loading

Local evidence: 2026-10-13. This implements part of the Halo Sport admin
constitution's keyboard, responsive, i18n and route/domain splitting requirements.
It does not qualify the entire Admin console or enable a backend capability.

## Runtime behavior

- `AdminV2LocaleProvider` supplies Vietnamese/English messages for the shell,
  registry route/group titles, shared pagination/confirmation/async outcomes,
  the current-authority denial frame, step-up and page loading/failure.
  `halo-admin-locale` persists only the normalized `vi`/`en` preference; denied
  storage falls back to Vietnamese and preferences remain usable in memory.
  Domain page content and custom editors still need their own translation work.
  Step-up HTTP429 reports a temporary limit rather than claiming every429 locks
  the account: the real service also uses429 for pending-confirmation capacity.
- Desktop uses a collapsible sidebar with a 48px icon rail, named links and
  `aria-current="page"`. The mobile drawer, command palette and shared danger
  confirmation use `AdminV2Modal`, a native top-layer dialog. Opening contains
  focus and makes the underlying document inert; Escape/backdrop dismissal
  returns focus to the connected trigger. Busy confirmation blocks dismissal.
  Danger confirmation initially focuses Cancel, not the destructive action.
- The skip link targets the focusable main content. Ctrl/Cmd+K does not open
  another palette over an existing native dialog. Route search recognizes
  translated titles as well as the registry's existing titles and aliases;
  Up/Down/Home/End and Enter operate the filtered result list without leaving
  the dialog. The header session menu exposes the current operator and logout,
  closes on Escape or outside pointer input, and never exposes credentials.
  Advertising create/edit/delete and Operations maintenance confirmations now
  use the same native top-layer modal primitive instead of page-local backdrop
  dialogs, so their focus containment, dismissal and return-focus behavior are
  consistent with the shared shell. All Admin V2 modal surfaces are native top-layer
  dialogs.
- Command Center titles, metrics, table labels and async/empty/error states
  now consume the same Vietnamese/English message registry as the shell;
  server status values remain authoritative data and are not translated into
  a different lifecycle.
- Operations readiness, durable journal and maintenance command copy now use
  the same locale registry, including table labels and maintenance confirmation
  states.
- Platform & Security policy posture, legacy route metadata and the complete
  capability registry now use the same locale registry while keeping backend
  capability keys, risks and availability values unchanged.
- Accounts now uses the same Vietnamese/English registry for inventory labels,
  lifecycle state, role editor and loading/error/empty/modal states; lifecycle
  and role values from the backend remain authoritative data.
- Audit now uses the same registry and exposes actor/target UUID filters mapped
  to the backend's separate lifecycle and generic command-audit query DTOs;
  malformed identifiers fail closed before either read is sent.
- Advertising status commands now require an explicit operator reason in the
  confirmation modal; the reason is sent through the existing audited command
  contract rather than being synthesized by the browser. The backend also
  enforces the trimmed, nonblank value (maximum 500 characters) with
  `ADMIN_REASON_REQUIRED`.
- Account lifecycle commands now require an explicit reason in their modal as
  well; the browser no longer synthesizes a generic lifecycle reason, and the
  backend applies the same invariant for non-browser callers.
- Controls consume the existing `--admin-*` tokens. Focus uses the opaque
  semantic focus token; native controls/scrollbars inherit light/dark
  `color-scheme`. Desktop controls target36px while small viewport touch
  controls are44px. Desktop no longer
  shows the mobile drawer close button.
- All12 Admin V2 page modules are dynamically imported. `AdminV2RouteView`
  supplies localized Suspense loading and a per-route error boundary while
  the shell, actor query provider and command recovery remain mounted.
  Navigating to another route resets the failed page boundary. Reload is an
  explicit operator action: it can lose unsent drafts, and uncertain commands
  must be checked through existing recovery rather than sent as new commands.
  No command is executed/retried by the loading or error boundary.

## Evidence and repeatable checks

The synthetic fixtures install a strict Axios adapter accepting only
`/admin/capabilities`, a synthetic actor and read capabilities. They do not
contact the backend, use real credentials or execute financial/Admin writes.

| Check | Observed result |
|---|---|
| `tests/fixtures/admin-shell-review.html`, desktop1280×720 | Mobile close button hidden; collapse gives48px rail with named links; skip link moves focus to main; palette input initially focused; Vietnamese project search returns the business route; Escape restores search trigger |
| Shared danger confirmation | Cancel initially focused, next Tab stays in dialog, native modal excludes background from AX tree, Escape closes |
| Same fixture,390×844 dark and320×720 |390px drawer256px wide/full viewport height, close initially focused, Escape restores menu trigger; no document overflow at390/320 and no header overflow at320 |
| Vietnamese/English and reload | Shell/route labels, search/empty state and pagination change locale; English/light selection remains visible after reload |
| `tests/fixtures/admin-route-loading-review.html` | Manually completed lazy promise shows `role=status`/`aria-busy=true` then content; rejected lazy promise reaches the alert/reload state; switching to a good route restores content while shell remains available |
| `npm run test:admin` (`--test-isolation=none`) |51/51 PASS,0 failed/skipped in the current Windows sandbox; the isolation flag avoids Node's Windows child-process spawn limitation |
| `npx eslint src/adminV2 src/services/admin src/routes/route/adminV2Route.jsx tests` | PASS after correcting the JSX component prop binding; no suppression added |
| `tsc -p tsconfig.admin.json --noEmit` plus scoped ESLint | TypeScript and Admin V2 ESLint PASS; generated-client parity is unchanged by this shell-only work |
| `npm run lint` | Still red:24 errors/16 warnings in legacy/public components/pages; log `.tmp/admin-shell-full-lint-20261013.log` |
| `npm run build -- --manifest` | Final source PASS,3178 modules;12 dynamic Admin page entries and12 main-entry dynamic references,0 static page references; main JS1545.31kB/gzip468.05, CSS111.72kB/gzip17.38;500kB warning remains |

The opaque-focus/theme shell build before page splitting was1743.27kB main JS
(gzip506.57). The final main entry is smaller, but this does not mean total
JavaScript or all-page download cost has fallen by the same amount. Legacy/public
eager dependencies remain. After the final step-up429 wording correction,
affected locale/broker tests4/4 and scoped lint passed again; the current suite
has48 cases. No production build or real browser claim is made in the current
sandbox.

The current sandbox Vite/build/Orval wrappers still return `spawn EPERM` when
they need esbuild child processes. The Admin test wrapper now uses Node's
`--test-isolation=none` mode and passes51 cases; this is recorded as
environment-bounded evidence, not a substitute for a production build or real
browser qualification.

Captures are local synthetic artifacts under
`.tmp/admin-shell-review-20261013/`: `desktop-light.jpg`, `mobile-dark.jpg`
and `route-error.jpg`. The checked-in fixtures provide the repeatable source;
temporary captures are not a deployed-host qualification.

## Remaining qualification

Keep the full [cutover gates](admin-cutover-checklist.md) open. Remaining work
includes translations and keyboard/focus behavior of domain custom dialogs,
screen-reader/axe/200% zoom/reduced-motion and full-theme contrast qualification,
real-server revoked-role/step-up/CRUD journeys, mixed-deployment chunk failures,
load/restore/retention and complete platform parity. The initial legacy/public
bundle remains large despite the new page chunks. No production readiness,
backend authorization, financial integrity or full Admin completion is inferred
from these client/synthetic checks.
