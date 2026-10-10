# Website agent guide

This file applies to the entire `trolytaichinh-frontend-website` repository. Read the
workspace-level `../AGENTS.md` and the shared documents under `../docs/` first.
Before adding a page, component, service or shared helper, read
`../docs/SOURCE_STRUCTURE_AND_REUSE.md`. Before handoff, apply
`../docs/DOCUMENTATION_MAINTENANCE.md` and update matching
`../docs/KNOWN_ISSUES.md` entries with evidence.

## Purpose and stack

This repository is the React 19/Vite 7 public landing site and administrative
console. The primary authenticated consumer personal-finance experience is in
Mobile, not this Website. Source code is plain JavaScript/JSX under `src/`.

## Source map

- `src/pages/`: route-level screens; `pages/adminPage/` contains privileged UI.
- `src/components/`: reusable presentation and feature components.
- `src/services/`: API calls. Keep HTTP details here, not in UI components.
- `src/contexts/`: cross-cutting React state, including authentication.
- `src/routes/`: route definitions and route guards.
- `src/layout/`: shared page shells.
- `src/utils/` and `src/extensions/`: narrowly scoped helpers.

## Non-negotiable rules

- The backend remains the authorization boundary. A hidden button or protected
  route is not an access-control decision.
- Never render server-provided HTML without an explicit sanitization policy.
- Never log tokens, credentials, personal financial data, or raw provider
  payloads.
- Use the shared Axios/service layer and preserve the existing API response
  semantics until a coordinated contract migration is made.
- Currency values must not be derived with floating-point arithmetic in the UI.
- Date/time conversion must state whether the input is UTC, local time, or a
  date-only business value.
- New server-state behavior needs loading, empty, error, retry, and unauthorized
  states. Do not silently swallow failures.
- Avoid adding new credentials to `VITE_*`: every Vite environment value is
  public in the browser bundle.

## Change workflow

1. Trace the route, page, component, service call, backend endpoint, and DTO.
2. Confirm role and ownership behavior at the backend before changing admin UI.
3. Keep request/response changes backward compatible, or update web, mobile,
   backend, and the contract documentation in one coordinated change.
4. Add tests for changed behavior once the test harness is introduced. Until
   then, record a deterministic manual verification matrix in the pull request.
5. Run the repository checks below and report pre-existing failures separately.
6. Update shared behavior/contract/security/issue documentation in the same change.

## Verification

```powershell
npm ci
npm run lint
npm run build
npm audit --omit=dev
```

Current audited baseline on 2026-07-22: production build succeeds; lint does not
pass; there is no automated test script; the production bundle is large. These
are known gaps, not permission to add more lint errors or skip verification.

## Definition of done

- No new lint error and the production build succeeds.
- Changed API calls are checked against the actual controller and DTO.
- Access-denied and expired-session behavior is verified.
- Sensitive output is absent from logs, URLs, analytics, and browser storage
  where avoidable.
- Accessibility and responsive behavior are checked for changed screens.
- Shared documentation is updated when a route, role, payload, or invariant
  changes.
