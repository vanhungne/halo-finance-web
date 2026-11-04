import { TOOL_CATALOG } from './toolsCatalog.mjs';
const events = new Set(['tools_hub_view', 'tool_open', 'tool_calculate_success', 'tool_api_error', 'tool_copy_result', 'tool_related_click', 'tool_app_cta_click']);
export function trackTool(name, id, details = {}) {
  if (!events.has(name) || id !== 'hub' && !TOOL_CATALOG.some(t => t.id === id)) return;
  const safe = { tool_id: id };
  if (TOOL_CATALOG.some(t => t.id === details.to_tool_id)) safe.to_tool_id = details.to_tool_id;
  if (['fx', 'gold', 'banks', 'sentiment', 'inflation'].includes(details.provider)) safe.provider = details.provider;
  if (/^(?:HTTP_\d{3}|SCHEMA|NETWORK|TIMEOUT|ABORTED)$/.test(details.safe_error_code ?? '')) safe.safe_error_code = details.safe_error_code;
  // Do not initialize tracking. Respect the site's existing analytics/consent setup, if configured.
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, safe);
}
