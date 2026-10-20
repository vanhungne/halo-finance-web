export function adminRequestConfig(config, options = {}) {
  const route = config.url;
  if (typeof route !== "string" || !route.startsWith("/api/") || /[?#\\]/.test(route) || [...route].some((character) => character.charCodeAt(0) <= 32)
      || route.split("/").some((segment) => /^(?:\.|%2e){1,2}$/i.test(segment)))
    throw new Error("Generated API route must be a canonical /api path.");
  // Generated method/body/query/route stay authoritative. Callers can supply
  // cancellation, timeout and idempotency headers, not replace the operation.
  const headers = { ...config.headers, ...options.headers };
  // Swagger exposes a JSON formatter range. A request must send a concrete
  // MIME that this same operation supports, not a wildcard Content-Type.
  if (headers["Content-Type"] === "application/*+json") headers["Content-Type"] = "application/json";
  return { ...options, ...config, url: route.slice(4), timeout: options.timeout ?? 20_000,
    headers };
}
