import { QueryClient } from "@tanstack/react-query";

export function createAdminQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, gcTime: 300_000, retry: false, refetchOnWindowFocus: true },
      mutations: { retry: false },
    },
  });
}

export function adminQueryKey(actorId, resource, filters = {}) {
  if (!actorId) throw new Error("Admin query keys require an actor.");
  return ["admin-v2", actorId, resource, filters];
}

export function parseAdminLimit(value, fallback = 25) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? Math.min(Math.max(parsed, 1), 100) : fallback;
}

export function hasAdminCapability(projection, actorId, key, availability) {
  return projection?.actorUserId === actorId && projection?.modules?.some((module) =>
    module.key === key && module.availability === availability) === true;
}

/** Refresh projections after a verified original receipt or audited key disposition. */
export function invalidateAdminRecoveredCommand(client, actorId, action) {
  if (!actorId) throw new Error("Admin recovery invalidation requires an actor.");
  const resources = new Set(["audit", "command-audit"]);
  if (action.startsWith("REPORT_TYPE_")) {
    ["report-types", "report-type", "reports", "report-detail"].forEach((name) => resources.add(name));
  } else if (action === "REPORT_REPLY") {
    ["reports", "report-detail", "report-content", "report-statistics", "dashboard-statistics"].forEach((name) => resources.add(name));
  } else if (action === "SET_ACCOUNT_LIFECYCLE" || action === "ACCOUNT_SET_ROLE") {
    ["accounts", "account-statistics", "account-role", "dashboard-statistics"].forEach((name) => resources.add(name));
  } else if (action.startsWith("ADVERTISE_")) {
    ["advertising", "advertising-statistics", "dashboard-statistics"].forEach((name) => resources.add(name));
  } else if (action.startsWith("BLOG_")) {
    ["content", "content-statistics", "dashboard-statistics"].forEach((name) => resources.add(name));
  } else if (action.startsWith("RECEIPT_")) {
    ["receipt-policies", "receipt-rules"].forEach((name) => resources.add(name));
  } else if (["SYSTEM_CONFIG_CREATE", "SYSTEM_CONFIG_UPDATE", "SYSTEM_CONFIG_DELETE"].includes(action)) {
    ["configuration", "maintenance"].forEach((name) => resources.add(name));
  } else if (action.startsWith("SUBSCRIPTION_")) {
    ["subscriptions", "subscription-detail", "subscription-options"].forEach((name) => resources.add(name));
  }
  return Promise.all([...resources].map((resource) => client.invalidateQueries({ queryKey: ["admin-v2", actorId, resource] })));
}
