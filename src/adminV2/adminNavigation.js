import {
  Activity,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  Package,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";

export const ADMIN_V2_BASE = "/admin-v2";

const route = (definition) => Object.freeze({
  ...definition,
  titleKey: definition.titleKey ?? `admin.routes.${definition.id}.title`,
  breadcrumbKey: definition.breadcrumbKey ?? `admin.routes.${definition.id}.breadcrumb`,
  telemetryName: definition.telemetryName ?? `admin.route.${definition.id}`,
  requiredCapability: definition.requiredCapability ?? definition.capability,
  pathBuilder: definition.pathBuilder ?? (() => definition.path),
});

export const adminNavigation = Object.freeze([
  route({
    id: "command-center",
    label: "Command center",
    group: "Command center",
    icon: LayoutDashboard,
    path: ADMIN_V2_BASE,
    capability: "admin.dashboard.read",
    risk: "R0",
    aliases: ["dashboard", "overview", "tổng quan"],
    legacyRoute: "/admin",
  }),
  route({
    id: "accounts",
    label: "Accounts",
    group: "Accounts & trust",
    icon: Users,
    path: `${ADMIN_V2_BASE}/users`,
    capability: "admin.accounts.read",
    risk: "R0",
    aliases: ["users", "người dùng", "account"],
    legacyRoute: "/admin/users",
  }),
  route({
    id: "reports",
    label: "Reports & support",
    group: "Trust & content",
    icon: FileText,
    path: `${ADMIN_V2_BASE}/reports`,
    capability: "admin.reports.read",
    risk: "R1",
    aliases: ["report", "support", "báo cáo"],
    legacyRoute: "/admin/reports",
  }),
  route({
    id: "content",
    label: "Content",
    group: "Trust & content",
    icon: Newspaper,
    path: `${ADMIN_V2_BASE}/content`,
    capability: "admin.content.read",
    risk: "R1",
    aliases: ["blog", "posts", "nội dung"],
    availability: "LEGACY_CONTRACT",
    legacyRoute: "/admin/blogs",
  }),
  route({
    id: "audit",
    label: "Audit trail",
    group: "Trust & content",
    icon: ClipboardCheck,
    path: `${ADMIN_V2_BASE}/audit`,
    capability: "admin.audit.read",
    risk: "R2",
    aliases: ["audit", "history", "lịch sử"],
  }),
  route({
    id: "advertising",
    label: "Advertising",
    group: "Growth & monetization",
    icon: Megaphone,
    path: `${ADMIN_V2_BASE}/advertising`,
    capability: "admin.advertising.read",
    risk: "R0",
    aliases: ["campaigns", "ads", "quảng cáo"],
    availability: "V2_READ",
    legacyRoute: "/admin/ads",
  }),
  route({
    id: "subscriptions",
    label: "Subscriptions",
    group: "Growth & monetization",
    icon: Package,
    path: `${ADMIN_V2_BASE}/subscriptions`,
    capability: "admin.subscriptions.read",
    risk: "R0",
    aliases: ["plans", "membership", "gói dịch vụ"],
    availability: "V2_READ",
    legacyRoute: "/admin/packages",
  }),
  route({
    id: "operations",
    label: "Operations",
    group: "Operations",
    icon: Activity,
    path: `${ADMIN_V2_BASE}/operations`,
    capability: "admin.operations.read",
    risk: "R0",
    aliases: ["jobs", "health", "queue"],
    availability: "CONTRACT_GAP",
  }),
  route({
    id: "platform",
    label: "Platform & security",
    group: "Platform & security",
    icon: ShieldCheck,
    path: `${ADMIN_V2_BASE}/platform`,
    capability: "admin.platform.read",
    risk: "R3",
    aliases: ["config", "security", "settings"],
    availability: "V2_READ",
  }),
  route({
    id: "configuration",
    label: "Configuration",
    group: "Platform & security",
    icon: Settings2,
    path: `${ADMIN_V2_BASE}/configuration`,
    capability: "admin.configuration.read",
    risk: "R0",
    aliases: ["system config", "cấu hình"],
  }),
]);

export const adminNavigationById = Object.freeze(Object.fromEntries(adminNavigation.map((item) => [item.id, item])));

export function adminRoutePath(id, params = {}) {
  const item = adminNavigationById[id];
  if (!item) throw new Error(`Unknown Admin V2 route: ${id}`);
  return item.pathBuilder(params);
}

export function adminRouteSegment(id) {
  const path = adminRoutePath(id);
  return path === ADMIN_V2_BASE ? undefined : path.slice(`${ADMIN_V2_BASE}/`.length);
}

export function validateAdminNavigationRegistry() {
  const ids = new Set();
  const paths = new Set();
  for (const item of adminNavigation) {
    if (ids.has(item.id)) throw new Error(`Duplicate Admin V2 route id: ${item.id}`);
    if (paths.has(item.path)) throw new Error(`Duplicate Admin V2 route path: ${item.path}`);
    if (!item.capability || !item.requiredCapability || !item.risk || !item.group || !item.telemetryName) {
      throw new Error(`Incomplete Admin V2 route metadata: ${item.id}`);
    }
    ids.add(item.id);
    paths.add(item.path);
  }
  return true;
}

validateAdminNavigationRegistry();

export const adminNavigationByPath = (pathname) =>
  adminNavigation
    .filter((item) => pathname === item.path || (item.path !== ADMIN_V2_BASE && pathname.startsWith(`${item.path}/`)))
    .sort((left, right) => right.path.length - left.path.length)[0] ?? adminNavigation[0];

export const adminNavigationGroups = () =>
  adminNavigation.reduce((groups, item) => {
    groups[item.group] ??= [];
    groups[item.group].push(item);
    return groups;
  }, {});
