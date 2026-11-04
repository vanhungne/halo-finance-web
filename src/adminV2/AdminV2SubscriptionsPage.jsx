import { useMemo, useState } from "react";
import { CheckCircle2, Package, Search, XCircle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getAdminSubscriptionListApi } from "../services/admin";
import { AdminV2PageHeader, AdminV2State } from "./AdminV2State";
import { AdminV2Panel, AdminV2Pagination, AdminV2StatusBadge } from "./AdminV2Primitives";
import { useAdminV2Capabilities } from "./AdminV2CapabilitiesContext";
import { useAdminLocale } from "./AdminV2LocaleContext";
import { adminQueryKey, parseAdminLimit } from "./adminQueryClient";
import AdminV2SubscriptionEditor from "./AdminV2SubscriptionEditor";
import { formatSubscriptionVnd } from "./subscriptionCatalog";

const numberFormat = new Intl.NumberFormat("vi-VN");
const dateFormat = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: "Asia/Ho_Chi_Minh" });

function positiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export default function AdminV2SubscriptionsPage() {
  const { t } = useAdminLocale();
  const capabilities = useAdminV2Capabilities();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => ({
    Keyword: searchParams.get("keyword") ?? "",
    IsActive: searchParams.get("active") === "true" ? true : searchParams.get("active") === "false" ? false : undefined,
    PageIndex: positiveInt(searchParams.get("page"), 1),
    PageSize: parseAdminLimit(searchParams.get("size"), 20),
  }), [searchParams]);
  const [selection, setSelection] = useState(null);
  const [editorBusy, setEditorBusy] = useState(false);
  const actorId = capabilities?.data?.actorUserId;
  const readEnabled = capabilities?.status === "success" && capabilities.data?.modules?.some((module) => module.key === "admin.subscriptions.read" && ["V2_READ", "LEGACY_CONTRACT"].includes(module.availability));
  const retireEnabled = capabilities?.status === "success" && capabilities.data?.modules?.some((module) => module.key === "admin.subscriptions.mutate" && module.availability === "V2_COMMAND" && module.actions?.includes("retire"));
  const detailEnabled = readEnabled && capabilities.data?.modules?.some((module) => module.key === "admin.subscriptions.read" && module.actions?.includes("detail"));
  const canCrud = (action) => capabilities?.status === "success" && capabilities.data?.modules?.some((module) => module.key === "admin.subscriptions.crud" && module.availability === "V2_COMMAND" && module.actions?.includes(action));
  const queryClient = useQueryClient();
  const listQuery = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "subscriptions", query),
    queryFn: ({ signal }) => getAdminSubscriptionListApi(query, { signal }),
    enabled: Boolean(actorId && readEnabled),
  });
  const listState = { status: listQuery.isPending ? "loading" : listQuery.isError ? "error" : "success", data: listQuery.data ?? null };
  const page = listState.data;
  const subscriptions = page?.items ?? [];
  const totalPages = page?.totalPages ?? (page?.totalItems ? Math.ceil(page.totalItems / query.PageSize) : 0);
  const activeCount = subscriptions.filter((subscription) => subscription.isActive).length;
  const setQuery = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next);
  };

  return <div className="admin-v2-content">
    <AdminV2PageHeader title={t("subscriptions.title")} description={t("subscriptions.description")} />
    {!readEnabled && <AdminV2State title={t("subscriptions.readUnavailable")}>{t("subscriptions.readUnavailableHelp")}</AdminV2State>}
    {readEnabled && <>
    {listState.status === "success" && <div className="admin-v2-metric-grid">
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><Package size={15} aria-hidden="true" /> {t("subscriptions.pageCount")}</div><div className="admin-v2-metric-value">{numberFormat.format(subscriptions.length)}</div></div>
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><CheckCircle2 size={15} aria-hidden="true" /> {t("subscriptions.activeOnPage")}</div><div className="admin-v2-metric-value">{numberFormat.format(activeCount)}</div></div>
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><XCircle size={15} aria-hidden="true" /> {t("subscriptions.inactiveOnPage")}</div><div className="admin-v2-metric-value">{numberFormat.format(subscriptions.length - activeCount)}</div></div>
      <div className="admin-v2-metric"><div className="admin-v2-metric-label">{t("subscriptions.totalResults")}</div><div className="admin-v2-metric-value">{page?.totalItems === undefined ? "—" : numberFormat.format(page.totalItems)}</div></div>
    </div>}
    {selection && <AdminV2SubscriptionEditor key={`${actorId}:${selection.mode}:${selection.id ?? "new"}`} selection={selection} onBusyChange={setEditorBusy} onClose={() => { if (!editorBusy) setSelection(null); }} onCommitted={() => { void queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "subscriptions"] }); }} />}
    <AdminV2Panel title={t("subscriptions.catalog")} className="admin-v2-subscription-catalog" meta={page?.totalItems !== undefined ? t("subscriptions.total", { count: page.totalItems }) : t("subscriptions.loadingTotal")}>
        <form className="admin-v2-toolbar" onSubmit={(event) => { event.preventDefault(); setQuery({ page: 1 }); }}>
          <label className="admin-v2-search-label"><Search size={15} aria-hidden="true" /><span className="sr-only">{t("subscriptions.searchLabel")}</span><input className="admin-v2-search" value={query.Keyword} onChange={(event) => setQuery({ keyword: event.target.value, page: 1 })} placeholder={t("subscriptions.searchPlaceholder")} /></label>
          <select className="admin-v2-search" value={searchParams.get("active") ?? ""} onChange={(event) => setQuery({ active: event.target.value, page: 1 })} aria-label={t("subscriptions.filterActive")}><option value="">{t("subscriptions.allStatus")}</option><option value="true">{t("subscriptions.active")}</option><option value="false">{t("subscriptions.inactive")}</option></select>
          {canCrud("create") && <button className="admin-v2-primary-button" type="button" disabled={editorBusy} onClick={() => setSelection({ mode: "create" })}>{t("subscriptions.create")}</button>}
        </form>
        {listState.status === "loading" && <AdminV2State title={t("subscriptions.loading")}>{t("subscriptions.loadingHelp")}</AdminV2State>}
        {listState.status === "error" && <AdminV2State title={t("subscriptions.error")} tone="danger" action={<button type="button" className="admin-v2-text-button" onClick={() => listQuery.refetch()}>{t("subscriptions.retry")}</button>}>{t("subscriptions.errorHelp")}</AdminV2State>}
        {listState.status === "success" && subscriptions.length === 0 && <AdminV2State title={query.Keyword || query.IsActive !== undefined ? t("subscriptions.noMatching") : t("subscriptions.noPlans")}>{query.Keyword || query.IsActive !== undefined ? t("subscriptions.noMatchingHelp") : t("subscriptions.noPlansHelp")}</AdminV2State>}
        {listState.status === "success" && subscriptions.length > 0 && <div className="admin-v2-table-wrap"><table className="admin-v2-table"><thead><tr><th>{t("subscriptions.package")}</th><th>{t("subscriptions.price")}</th><th>{t("subscriptions.duration")}</th><th>{t("subscriptions.featureLabels")}</th><th>{t("subscriptions.status")}</th><th>{t("subscriptions.updated")}</th></tr></thead><tbody>
          {subscriptions.map((subscription) => <tr key={subscription.id}><td data-label={t("subscriptions.package")}><strong>{subscription.name || "—"}</strong>{subscription.description && <div className="admin-v2-freshness">{subscription.description}</div>}<div className="admin-v2-row-actions">{detailEnabled && <button type="button" className="admin-v2-text-button" disabled={editorBusy} onClick={() => setSelection({ mode: "view", id: subscription.id })}>{t("subscriptions.detail")}</button>}{canCrud("update") && <button type="button" className="admin-v2-text-button" disabled={editorBusy} onClick={() => setSelection({ mode: "edit", id: subscription.id })}>{t("subscriptions.edit")}</button>}{canCrud("delete") && !subscription.isActive && <button type="button" className="admin-v2-text-button" disabled={editorBusy} onClick={() => setSelection({ mode: "delete", id: subscription.id })}>{t("subscriptions.delete")}</button>}</div></td><td data-label={t("subscriptions.price")} className="admin-v2-mono">{formatSubscriptionVnd(subscription.price)}</td><td data-label={t("subscriptions.duration")}>{numberFormat.format(subscription.durationInDays ?? 0)} {t("common.days")}</td><td data-label={t("subscriptions.featureLabels")}>{numberFormat.format(subscription.features?.length ?? 0)}</td><td data-label={t("subscriptions.status")}><AdminV2StatusBadge tone={subscription.isActive ? "success" : "neutral"}>{subscription.isActive ? t("subscriptions.active") : t("subscriptions.inactive")}</AdminV2StatusBadge>{retireEnabled && subscription.isActive && <div className="admin-v2-row-actions"><button className="admin-v2-text-button" type="button" disabled={editorBusy} onClick={() => setSelection({ mode: "status", id: subscription.id })}>{t("subscriptions.retire")}</button></div>}</td><td data-label={t("subscriptions.updated")} className="admin-v2-mono">{subscription.lastUpdatedTime ? dateFormat.format(new Date(subscription.lastUpdatedTime)) : "—"}</td></tr>)}
        </tbody></table></div>}
        {listState.status === "success" && totalPages > 1 && <AdminV2Pagination page={query.PageIndex} totalPages={totalPages} onPrevious={() => setQuery({ page: query.PageIndex - 1 })} onNext={() => setQuery({ page: query.PageIndex + 1 })} />}
    </AdminV2Panel>
    </>}
    {!canCrud("create") && <AdminV2State title={t("subscriptions.commandsPending")}>{t("subscriptions.commandsPendingHelp")}</AdminV2State>}
    {!retireEnabled && <AdminV2State title={t("subscriptions.retirePending")}>{t("subscriptions.retirePendingHelp")}</AdminV2State>}
  </div>;
}
