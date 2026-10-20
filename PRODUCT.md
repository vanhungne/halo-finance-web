# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Platform administrators operate Halo Finance through a privileged web console. They need reliable, scoped visibility into users, reports, content, subscriptions, transactions, receipt processing and platform configuration.

## Product Purpose

Halo Finance Admin is the operational control plane for the finance platform. It helps an authenticated platform administrator inspect authoritative data, resolve support and trust workflows, manage approved configuration, and verify the result of sensitive operations.

## Positioning

The console is an operations workspace rather than a marketing dashboard: source-of-truth data, scope, freshness, lifecycle and recovery state are visible before an operator acts.

## Operating Context

Administrators work from desktop browsers but must retain equivalent information and actions at small browser widths. They handle queues, investigate records, manage content and configuration, and need clear error, forbidden, stale and partial-data states.

## Capabilities and Constraints

- Backend authorization remains authoritative; client route guards are UX only.
- Admin V2 is introduced at `/admin-v2` beside the existing `/admin` surface during migration.
- The current backend exposes read and mutation contracts unevenly. UI must not invent missing commands.
- Financial values follow the backend response contract and are never recalculated with binary floating point in the browser.
- Vietnamese is the current operator language; English-ready message keys are part of the new foundation.

## Brand Commitments

Halo Finance keeps its existing brand identity while adopting the Halo Sport admin reference discipline: neutral-first surfaces, border-led hierarchy, restrained shadow, Lucide icons, compact operational density and strong semantic status treatment.

## Evidence on Hand

- Existing website admin routes and service modules under `src/pages/adminPage`, `src/routes` and `src/services`.
- Backend controllers under `halo-finance-backend/ExpenseAssistant.Presentation/Controllers`.
- [Halo Sport admin redesign constitution](../docs/halosport_admin_redesign/ADMIN_REDESIGN_CONSTITUTION.md).
- [Halo Sport reference study](../docs/halosport_admin_redesign/ADMIN_UI_REFERENCE_STUDY.md).

## Product Principles

1. Correctness and authorization precede convenience and visual polish.
2. Every operator action shows the target and current state before mutation.
3. A backend contract gap is visible and documented instead of being hidden behind a fake button.
4. Read surfaces remain useful during partial failure and never turn errors into empty data.

## Accessibility & Inclusion

Admin V2 targets keyboard operation, visible focus, reduced motion, semantic controls, 200% zoom and WCAG AA contrast for supported themes and locales.
