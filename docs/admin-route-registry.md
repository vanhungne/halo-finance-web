# Admin V2 route registry

Shell follow-up13/10 resolves existing registry title/group keys through the
shared vi/en locale context, retains named icon-rail links and uses native modal
drawer/palette focus behavior. All12 route page modules use dynamic imports with
localized loading/per-route failure boundaries; shell/session/recovery stay
mounted. [Evidence and limits](admin-shell-accessibility-contract.md). Registry
and browser checks do not grant a backend command or certify broad page parity.

`src/adminV2/adminNavigation.js` is the runtime source for Admin V2 navigation metadata. Router entries are derived from the same registry so sidebar, command palette, breadcrumb selection, legacy mapping and telemetry names cannot silently drift.

Each entry carries:

- stable route id and path;
- navigation group, icon and search aliases;
- server capability key and risk class;
- availability hint and legacy route mapping where known;
- title/breadcrumb keys and telemetry name;
- a path builder used by nested routes.

`validateAdminNavigationRegistry()` runs at module load and rejects duplicate ids/paths or incomplete security metadata. Backend capability projection remains authoritative: the registry never grants a command and the route handler still enforces access.

The registry intentionally contains read and contract-gap entries for discoverability in source, while the shell only renders entries whose server capability is `V2_READ` or `LEGACY_CONTRACT`. Detail routes can be added to the registry without taking sidebar space when a domain contract is ready.

The shell marks the current hub active for nested routes and exposes
`aria-current="page"`. Collapsed icon-rail links retain an accessible name and
native title tooltip even when their visual text is hidden. Navigation registry
unit coverage verifies nested report/business paths; keyboard/browser visual
qualification remains a separate gate.

Admin V2 data projections use the shared TanStack Query provider. Query keys include the verified session actor id and bounded filter/cursor values; requests receive an abort signal, cache persistence is disabled, and logout/session changes clear the cache. This is a client consistency boundary only: authorization, ownership, redaction and mutation safety remain backend responsibilities.

The current read slices using this boundary are command center, accounts, reports, content, advertising, subscriptions, business directory, receipt policies, audit, operations and configuration. Content now uses protected inventory/dossier/source and a blogId locator; valid legacy detail GUIDs redirect to that dossier. Mutation controls remain individually capability-gated; a visible read route never implies CRUD authority.
