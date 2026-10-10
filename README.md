# Trợ Lý Tài Chính website

React web client for the Trợ Lý Tài Chính personal-finance platform. It serves the public
landing/email-result pages and the administrative console. The primary
authenticated consumer experience lives in Mobile. Website consumes
`backend-api`.

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

## Current engineering baseline

As revalidated on 2026-07-28, the production build succeeds; ESLint fails with
25 errors and 16 warnings, no automated tests are configured, 12 production
dependency advisories remain, and the main JavaScript bundle is about 1,438 kB
minified/~437 kB gzip. Treat these as tracked production-readiness work, not as
an accepted quality bar.

For cross-repository architecture, security findings, contracts, and release
gates, start with the workspace [documentation index](../docs/README.md) and
[feature health matrix](../docs/FEATURE_HEALTH_ASSESSMENT.md). Agent contributors
must also read [AGENTS.md](AGENTS.md) and the workspace-level `../AGENTS.md`.
