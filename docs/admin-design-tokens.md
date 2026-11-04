# Admin V2 design tokens

13/10 shell follow-up keeps native dialog surfaces in the Admin token context,
uses the opaque `--admin-focus` for visible focus and inherited light/dark
`color-scheme` for native controls/scrollbars. Mobile icon buttons use the existing
44px control scale; no page-specific palette was added. Synthetic1280px/390px
light/dark and320px overflow checks cover the changed shell, not every domain,
contrast combination or WCAG criterion. [Scope](admin-shell-accessibility-contract.md).

`src/adminV2/admin-design-tokens.css` is the single semantic token source for the Admin V2 operator console. Pages and primitives must consume `--admin-*` variables; page-level hex colors, arbitrary radii, custom focus rings, and one-off shadows are not allowed.

The foundation follows the Halo Sport reference: neutral-first surfaces, border-first panels, one blue primary, explicit success/warning/danger/info semantics, a 4px spacing base, semantic typography, monospace technical metadata, and separate light/dark values under `[data-admin-theme="dark"]`.

| Token family | Contract | Examples |
|---|---|---|
| Typography | semantic sizes and two approved font stacks | `--admin-text-body`, `--admin-text-title`, `--admin-font-mono` |
| Spacing and geometry | 4px base, shared controls, panels and dialogs | `--admin-space-2`, `--admin-size-icon-button`, `--admin-radius-panel` |
| Semantic color | neutral surfaces plus primary/status roles | `--admin-surface`, `--admin-primary`, `--admin-danger` |
| Elevation and overlay | restrained panel shadow and theme-aware dialog overlay | `--admin-shadow`, `--admin-shadow-dialog`, `--admin-overlay` |

Changing a token is a visual-system change. Validate light/dark contrast, keyboard focus, reduced motion, and small viewport behavior before changing individual pages.

2026-10-11 subscription review repaired the missing `--admin-on-primary` consumed by the shared primary button: white in light mode and the dark background color in dark mode. Hover uses the existing stronger primary. This supplies the intended foreground role without page-level colors; local browser verification covers the subscription editor/catalog at 1440px and 390px, including focus and dark detail. Wider Admin V2 theme/accessibility qualification remains part of cutover.

Audit 2026-10-13: the Admin V2 presentation tree contains no page-level hex/rgb
palette, one-off shadow, or un-tokenized component radius outside the token file.
The session status dot keeps its intentional circular shape. Legacy
`/admin` remains a separate compatibility surface and is intentionally excluded
from this token audit until the documented cutover gates are complete.
