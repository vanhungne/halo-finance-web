import { useMemo } from "react";
import { ClipboardCheck, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getAdminAuditApi, getAdminCommandAuditApi } from "../services/admin";
import { AdminV2PageHeader, AdminV2State } from "./AdminV2State";
import { AdminV2Panel, AdminV2Pagination, AdminV2StatusBadge } from "./AdminV2Primitives";
import { useAdminV2Capabilities } from "./AdminV2CapabilitiesContext";
import { adminQueryKey } from "./adminQueryClient";
import { useAdminLocale } from "./AdminV2LocaleContext";
import { buildAdminAuditFilters } from "./adminAuditFilters";

const dateFormat = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });

export default function AdminV2AuditPage() {
  const { t } = useAdminLocale();
  const capabilities = useAdminV2Capabilities();
  const [searchParams, setSearchParams] = useSearchParams();
  const auditFilters = useMemo(() => buildAdminAuditFilters(searchParams), [searchParams]);
  const query = auditFilters.lifecycle;
  const enabled = capabilities?.status === "success" && capabilities.data?.modules?.some((module) => module.key === "admin.audit.read" && module.availability === "V2_READ");
  const actorId = capabilities?.data?.actorUserId;
  const auditQuery = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "audit", query),
    queryFn: ({ signal }) => getAdminAuditApi(query, { signal }),
    enabled: Boolean(actorId && enabled && auditFilters.valid),
  });
  const commandQuery = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "command-audit", auditFilters.commands),
    queryFn: ({ signal }) => getAdminCommandAuditApi(auditFilters.commands, { signal }),
    enabled: Boolean(actorId && enabled && auditFilters.valid),
  });
  const state = { status: auditQuery.isPending ? "loading" : auditQuery.isError ? "error" : "success", data: auditQuery.data ?? null };
  const commandState = { status: commandQuery.isPending ? "loading" : commandQuery.isError ? "error" : "success", data: commandQuery.data ?? null };

  const page = state.data;
  const entries = page?.items ?? [];
  const totalPages = page?.totalPages ?? (page?.totalItems ? Math.ceil(page.totalItems / query.PageSize) : 0);
  const setQuery = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next);
  };

  return <div className="admin-v2-content">
    <AdminV2PageHeader title={t("audit.title")} description={t("audit.description")} />
    {!enabled && <AdminV2State title={t("audit.unavailable")}>{t("audit.unavailableHelp")}</AdminV2State>}
    {enabled && !auditFilters.valid && <AdminV2State title={t("audit.invalidFilters")} tone="danger">{t("audit.invalidFiltersHelp")}</AdminV2State>}
    {enabled && auditFilters.valid && <AdminV2Panel title={<><ClipboardCheck size={17} aria-hidden="true" /> {t("audit.commandOutcomes")}</>} meta={page ? t("audit.total", { count: page.totalItems ?? 0 }) : t("audit.awaitingProjection")}>
        <form className="admin-v2-toolbar" onSubmit={(event) => { event.preventDefault(); setQuery({ page: 1 }); }}>
          <label className="admin-v2-search-label"><Search size={15} aria-hidden="true" /><span className="sr-only">{t("audit.actionLabel")}</span><input className="admin-v2-search" value={auditFilters.fields.action} onChange={(event) => setQuery({ action: event.target.value, page: 1 })} placeholder={t("audit.actionPlaceholder")} /></label>
          <input className="admin-v2-search" value={auditFilters.fields.actor} onChange={(event) => setQuery({ actor: event.target.value, page: 1 })} aria-label={t("audit.actorLabel")} placeholder={t("audit.actorPlaceholder")} />
          <input className="admin-v2-search" value={auditFilters.fields.target} onChange={(event) => setQuery({ target: event.target.value, page: 1 })} aria-label={t("audit.targetLabel")} placeholder={t("audit.targetPlaceholder")} />
          <select className="admin-v2-search" value={auditFilters.fields.outcome} onChange={(event) => setQuery({ outcome: event.target.value, page: 1 })} aria-label={t("audit.outcomeLabel")}><option value="">{t("audit.allOutcomes")}</option><option value="APPLIED">{t("audit.applied")}</option><option value="NO_CHANGE">{t("audit.noChange")}</option><option value="STALE_VERSION">{t("audit.staleVersion")}</option><option value="SELF_TARGET_FORBIDDEN">{t("audit.selfTarget")}</option></select>
        </form>
        {state.status === "loading" && <AdminV2State title={t("audit.loading")}>{t("audit.loadingHelp")}</AdminV2State>}
        {state.status === "error" && <AdminV2State title={t("audit.error")} tone="danger">{t("audit.errorHelp")}</AdminV2State>}
        {state.status === "success" && entries.length === 0 && <AdminV2State title={t("audit.noEntries")}>{t("audit.noEntriesHelp")}</AdminV2State>}
        {state.status === "success" && entries.length > 0 && <div className="admin-v2-table-wrap"><table className="admin-v2-table"><thead><tr><th>{t("audit.recorded")}</th><th>{t("audit.action")}</th><th>{t("audit.outcome")}</th><th>{t("audit.from")}</th><th>{t("audit.to")}</th><th>{t("audit.target")}</th></tr></thead><tbody>
          {entries.map((entry) => <tr key={entry.id}><td data-label={t("audit.recorded")} className="admin-v2-mono">{entry.recordedAt ? dateFormat.format(new Date(entry.recordedAt)) : "—"}</td><td data-label={t("audit.action")} className="admin-v2-mono">{entry.action}</td><td data-label={t("audit.outcome")}><AdminV2StatusBadge tone={entry.outcomeCode === "APPLIED" || entry.outcomeCode === "NO_CHANGE" ? "success" : "warning"}>{entry.outcomeCode}</AdminV2StatusBadge></td><td data-label={t("audit.from")}>{entry.fromState}</td><td data-label={t("audit.to")}>{entry.toState}</td><td data-label={t("audit.target")} className="admin-v2-mono">{entry.targetUserId}</td></tr>)}
        </tbody></table></div>}
        {state.status === "success" && totalPages > 1 && <AdminV2Pagination page={query.PageIndex} totalPages={totalPages} onPrevious={() => setQuery({ page: query.PageIndex - 1 })} onNext={() => setQuery({ page: query.PageIndex + 1 })} />}
    </AdminV2Panel>}
    {enabled && auditFilters.valid && <AdminV2Panel title={<><ClipboardCheck size={17} aria-hidden="true" /> {t("audit.receipts")}</>} meta={commandState.data ? t("audit.total", { count: commandState.data.totalItems ?? 0 }) : t("audit.awaitingProjection")}>
        {commandState.status === "loading" && <AdminV2State title={t("audit.loadingReceipts")}>{t("audit.loadingReceiptsHelp")}</AdminV2State>}
        {commandState.status === "error" && <AdminV2State title={t("audit.receiptsError")} tone="danger">{t("audit.receiptsErrorHelp")}</AdminV2State>}
        {commandState.status === "success" && (commandState.data?.items ?? []).length === 0 && <AdminV2State title={t("audit.noReceipts")}>{t("audit.noReceiptsHelp")}</AdminV2State>}
        {commandState.status === "success" && (commandState.data?.items ?? []).length > 0 && <div className="admin-v2-table-wrap"><table className="admin-v2-table"><thead><tr><th>{t("audit.recorded")}</th><th>{t("audit.action")}</th><th>{t("audit.target")}</th><th>{t("audit.outcome")}</th><th>{t("audit.version")}</th><th>{t("audit.operation")}</th></tr></thead><tbody>
          {(commandState.data.items ?? []).map((entry) => <tr key={entry.id}><td data-label={t("audit.recorded")} className="admin-v2-mono">{entry.recordedAt ? dateFormat.format(new Date(entry.recordedAt)) : "—"}</td><td data-label={t("audit.action")} className="admin-v2-mono">{entry.action}</td><td data-label={t("audit.target")} className="admin-v2-mono">{entry.targetType}:{entry.targetId ?? "—"}</td><td data-label={t("audit.outcome")}><AdminV2StatusBadge tone={entry.resultCode === "APPLIED" || entry.resultCode === "NO_CHANGE" ? "success" : "warning"}>{entry.resultCode}</AdminV2StatusBadge></td><td data-label={t("audit.version")} className="admin-v2-mono">{entry.beforeVersion ?? "—"} → {entry.afterVersion ?? "—"}</td><td data-label={t("audit.operation")} className="admin-v2-mono">{entry.operationId}</td></tr>)}
        </tbody></table></div>}
    </AdminV2Panel>}
  </div>;
}
