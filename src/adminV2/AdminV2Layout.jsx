import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Command, Menu, Moon, Search, Sun, UserCircle, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../contexts/AuthSessionContext.js";
import { getAdminCapabilitiesApi } from "../services/admin";
import { adminNavigation, adminNavigationGroups, adminNavigationByPath } from "./adminNavigation";
import { AdminV2CapabilitiesContext } from "./AdminV2CapabilitiesContext";
import { AdminV2State } from "./AdminV2State";
import AdminV2QueryProvider from "./AdminV2QueryProvider";
import { adminQueryKey } from "./adminQueryClient";
import AdminV2CommandRecovery from "./AdminV2CommandRecovery";
import AdminV2Modal from "./AdminV2Modal";
import AdminV2LocaleProvider from "./AdminV2LocaleProvider";
import { useAdminLocale } from "./AdminV2LocaleContext";
import "./admin-design-tokens.css";
import "./admin-v2.css";

function readPreference(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

function AdminV2Sidebar({ open, onClose, capabilityProjection, collapsed, onToggle, smallViewport }) {
  const { t } = useAdminLocale();
  const location = useLocation();
  const groups = useMemo(() => adminNavigationGroups(), []);
  const capabilityByKey = useMemo(() => new Map((capabilityProjection?.data?.modules ?? []).map((module) => [module.key, module])), [capabilityProjection]);
  const navigationReady = capabilityProjection?.status === "success";
  const visibleGroups = useMemo(() => {
    if (!navigationReady) return {};
    return Object.fromEntries(Object.entries(groups).map(([group, items]) => [
      group,
      items.filter((item) => {
        const serverCapability = capabilityByKey.get(item.capability);
        return serverCapability && ["V2_READ", "LEGACY_CONTRACT"].includes(serverCapability.availability);
      }),
    ]).filter(([, items]) => items.length > 0));
  }, [capabilityByKey, groups, navigationReady]);
  const sidebar = (
      <aside className="admin-v2-sidebar" data-open={open} data-collapsed={collapsed} aria-label={t("shell.navigation")}>
        <div className="admin-v2-brand">
          <span className="admin-v2-brand-mark" aria-hidden="true">H</span>
          <div className="admin-v2-brand-copy"><strong>Halo Finance</strong><span>{t("shell.controlPlane")}</span></div>
          <button data-initial-focus className="admin-v2-icon-button admin-v2-navigation-close" onClick={onClose} aria-label={t("shell.closeNavigation")}><X size={16} /></button>
          <button className="admin-v2-icon-button admin-v2-collapse-button" onClick={onToggle} aria-label={t(collapsed ? "shell.expandNavigation" : "shell.collapseNavigation")} title={t(collapsed ? "shell.expandNavigation" : "shell.collapseNavigation")}>{collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}</button>
        </div>
        <nav className="admin-v2-nav">
          {Object.entries(visibleGroups).map(([group, items]) => (
            <div className="admin-v2-nav-group" key={group}>
              <div className="admin-v2-nav-label">{t(`groups.${group}`)}</div>
              {items.map((item) => {
                const Icon = item.icon;
                const active = adminNavigationByPath(location.pathname).id === item.id;
                const serverCapability = capabilityByKey.get(item.capability);
                const availability = serverCapability?.availability ?? item.availability ?? "UNKNOWN";
                return <Link key={item.id} to={item.path} className="admin-v2-nav-item" data-active={active} aria-current={active ? "page" : undefined} aria-label={collapsed ? t(item.titleKey) : undefined} title={collapsed ? t(item.titleKey) : undefined} onClick={onClose}>
                  <Icon size={17} aria-hidden="true" /><span>{t(item.titleKey)}</span><span className="admin-v2-nav-risk" title={availability}>{serverCapability?.risk ?? item.risk}</span>
                </Link>;
              })}
            </div>
          ))}
        </nav>
        <div className="admin-v2-sidebar-footer"><div className="admin-v2-session"><span className="admin-v2-session-dot" data-state={capabilityProjection?.status} aria-hidden="true" />{t(capabilityProjection?.status === "success" ? "shell.capabilitiesLoaded" : capabilityProjection?.status === "error" ? "shell.capabilitiesError" : "shell.capabilitiesLoading")}</div>{capabilityProjection?.status === "error" && <p className="admin-v2-sidebar-note">{t("shell.navigationUnavailable")}</p>}</div>
      </aside>
  );
  return smallViewport ? <AdminV2Modal open={open} onClose={onClose} className="admin-v2-navigation-modal" label={t("shell.navigation")}>{sidebar}</AdminV2Modal> : sidebar;
}

function AdminV2Shell() {
  const { t, locale, setLocale } = useAdminLocale();
  const { auth, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => readPreference("halo-admin-sidebar", "expanded") === "collapsed");
  const [theme, setTheme] = useState(() => readPreference("halo-admin-theme", "light") === "dark" ? "dark" : "light");
  const [smallViewport, setSmallViewport] = useState(() => window.matchMedia("(max-width: 900px)").matches);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [commandActiveIndex, setCommandActiveIndex] = useState(0);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [recoveryRevision, setRecoveryRevision] = useState(0);
  const sessionMenuRef = useRef(null);
  const capabilityQuery = useQuery({
    queryKey: adminQueryKey(auth?.userId ?? "anonymous", "capabilities"),
    queryFn: ({ signal }) => getAdminCapabilitiesApi({ signal }),
    enabled: Boolean(auth?.userId),
    refetchInterval: 60_000,
  });
  const capabilityProjection = useMemo(() => ({
    status: capabilityQuery.isError ? "error" : capabilityQuery.isSuccess && capabilityQuery.data?.actorUserId === auth?.userId ? "success" : "loading",
    data: capabilityQuery.isError || capabilityQuery.data?.actorUserId !== auth?.userId ? null : capabilityQuery.data,
  }), [auth?.userId, capabilityQuery.isError, capabilityQuery.isSuccess, capabilityQuery.data]);
  const route = adminNavigationByPath(location.pathname);
  const availableNavigation = useMemo(() => {
    const modules = capabilityProjection?.data?.modules ?? [];
    const moduleByKey = new Map(modules.map((module) => [module.key, module]));
    return adminNavigation.filter((item) => {
      const module = moduleByKey.get(item.capability);
      return module && ["V2_READ", "LEGACY_CONTRACT"].includes(module.availability);
    });
  }, [capabilityProjection]);
  const commandResults = useMemo(() => {
    const query = commandQuery.trim().toLowerCase();
    if (!query) return availableNavigation;
    return availableNavigation.filter((item) => [t(item.titleKey), t(`groups.${item.group}`), item.label, item.group, ...(item.aliases ?? [])].join(" ").toLowerCase().includes(query));
  }, [availableNavigation, commandQuery, t]);
  const openCommand = () => {
    setCommandQuery("");
    setCommandActiveIndex(0);
    setCommandOpen(true);
  };

  const closeCommand = () => {
    setCommandOpen(false);
    setCommandQuery("");
    setCommandActiveIndex(0);
  };

  const selectCommandResult = (item) => {
    if (!item) return;
    closeCommand();
    navigate(item.path);
  };

  useEffect(() => {
    document.documentElement.dataset.adminTheme = theme === "dark" ? "dark" : "light";
    try { localStorage.setItem("halo-admin-theme", theme); } catch { /* Theme remains usable in memory. */ }
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem("halo-admin-sidebar", sidebarCollapsed ? "collapsed" : "expanded"); } catch { /* Navigation remains usable in memory. */ }
  }, [sidebarCollapsed]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const changed = () => { setSmallViewport(media.matches); setSidebarOpen(false); };
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, []);

  useEffect(() => {
    setCommandActiveIndex((index) => commandResults.length === 0 ? 0 : Math.min(index, commandResults.length - 1));
  }, [commandResults.length]);

  useEffect(() => {
    if (!sessionOpen) return undefined;
    const onPointerDown = (event) => { if (!sessionMenuRef.current?.contains(event.target)) setSessionOpen(false); };
    const onKeyDown = (event) => { if (event.key === "Escape") setSessionOpen(false); };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("pointerdown", onPointerDown); window.removeEventListener("keydown", onKeyDown); };
  }, [sessionOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        if (document.querySelector("dialog[open]")) return;
        event.preventDefault();
        openCommand();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return <AdminV2CapabilitiesContext.Provider value={capabilityProjection}>
    <div className="admin-v2-root" data-admin-theme={theme} lang={locale}>
    <a href="#admin-v2-main-content" className="admin-v2-skip-link">{t("shell.skip")}</a>
    <div className="admin-v2-shell">
      <AdminV2Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} capabilityProjection={capabilityProjection} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((value) => !value)} smallViewport={smallViewport} />
      <div className="admin-v2-main">
        <header className="admin-v2-header">
          <div className="admin-v2-header-left">
            <button className="admin-v2-menu-button" onClick={() => setSidebarOpen(true)} aria-label={t("shell.openNavigation")} aria-expanded={sidebarOpen}><Menu size={18} /></button>
            <div className="admin-v2-breadcrumb"><span>Admin V2</span><ChevronRight size={14} aria-hidden="true" /><strong>{t(route.titleKey)}</strong></div>
          </div>
          <div className="admin-v2-header-actions">
            <button className="admin-v2-command-trigger" onClick={openCommand} aria-label={t("shell.openSearch")} title={t("shell.openSearch")}><Command size={16} /><span>{t("shell.search")}</span><kbd>Ctrl/⌘K</kbd></button>
            <select className="admin-v2-language" value={locale} onChange={(event) => setLocale(event.target.value)} aria-label={t("shell.language")}><option value="vi">Tiếng Việt</option><option value="en">English</option></select>
            <button className="admin-v2-icon-button" onClick={() => setTheme((value) => value === "dark" ? "light" : "dark")} aria-label={t(theme === "dark" ? "shell.lightTheme" : "shell.darkTheme")}>
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <div className="admin-v2-session-menu" ref={sessionMenuRef}>
              <button className="admin-v2-session-trigger" type="button" aria-expanded={sessionOpen} aria-haspopup="menu" onClick={() => setSessionOpen((value) => !value)}>
                <UserCircle size={17} aria-hidden="true" /><span className="admin-v2-operator" title={auth?.fullName ?? t("shell.operator")}>{auth?.fullName ?? t("shell.operator")}</span><ChevronDown size={15} aria-hidden="true" />
              </button>
              {sessionOpen && <div className="admin-v2-session-menu-popover" role="menu">
                <div className="admin-v2-session-details"><strong>{auth?.fullName ?? t("shell.operator")}</strong>{auth?.email && <span>{auth.email}</span>}</div>
                <button type="button" role="menuitem" className="admin-v2-session-menu-item" onClick={() => { setSessionOpen(false); void logout(); }}>{t("shell.signOut")}</button>
              </div>}
            </div>
          </div>
        </header>
        <main id="admin-v2-main-content" tabIndex={-1}><AdminV2CommandRecovery actor={auth?.userId} onDisposition={() => setRecoveryRevision((value) => value + 1)} /><Outlet key={recoveryRevision} /></main>
    </div>
    </div>
    <AdminV2Modal open={commandOpen} onClose={closeCommand} className="admin-v2-command-dialog" labelledBy="admin-command-title">
      <div className="admin-v2-command-heading"><h2 id="admin-command-title">{t("shell.navigate")}</h2><button className="admin-v2-icon-button" onClick={closeCommand} aria-label={t("shell.closeSearch")}><X size={16} /></button></div>
      <label className="admin-v2-command-input"><Search size={16} aria-hidden="true" /><span className="sr-only">{t("shell.searchLabel")}</span><input data-initial-focus value={commandQuery} onChange={(event) => { setCommandQuery(event.target.value); setCommandActiveIndex(0); }} onKeyDown={(event) => {
        if (!commandResults.length) return;
        if (event.key === "ArrowDown") { event.preventDefault(); setCommandActiveIndex((index) => (index + 1) % commandResults.length); }
        if (event.key === "ArrowUp") { event.preventDefault(); setCommandActiveIndex((index) => (index - 1 + commandResults.length) % commandResults.length); }
        if (event.key === "Home") { event.preventDefault(); setCommandActiveIndex(0); }
        if (event.key === "End") { event.preventDefault(); setCommandActiveIndex(commandResults.length - 1); }
        if (event.key === "Enter") { event.preventDefault(); selectCommandResult(commandResults[commandActiveIndex]); }
      }} aria-controls="admin-command-results" aria-activedescendant={commandResults[commandActiveIndex] ? `admin-command-result-${commandResults[commandActiveIndex].id}` : undefined} placeholder={t("shell.searchPlaceholder")} /></label>
      <div id="admin-command-results" className="admin-v2-command-results" role="listbox" aria-label={t("shell.searchLabel")}>{commandResults.length === 0 && <AdminV2State title={t("shell.noMatches")}>{t("shell.tryAnother")}</AdminV2State>}{commandResults.map((item, index) => { const Icon = item.icon; const active = index === commandActiveIndex; return <Link id={`admin-command-result-${item.id}`} key={item.id} to={item.path} role="option" aria-selected={active} onMouseEnter={() => setCommandActiveIndex(index)} onClick={(event) => { event.preventDefault(); selectCommandResult(item); }} className="admin-v2-command-result" data-active={active}><Icon size={17} aria-hidden="true" /><span><strong>{t(item.titleKey)}</strong><small>{t(`groups.${item.group}`)}</small></span><ChevronRight size={15} aria-hidden="true" /></Link>; })}</div>
    </AdminV2Modal>
    </div>
  </AdminV2CapabilitiesContext.Provider>;
}

export default function AdminV2Layout() {
  return <AdminV2LocaleProvider><AdminV2QueryProvider><AdminV2Shell /></AdminV2QueryProvider></AdminV2LocaleProvider>;
}
