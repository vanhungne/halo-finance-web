import { createElement } from "react";
import { Activity, FileWarning, Megaphone, NotebookPen, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardStatisticApi } from "../services/admin";
import { AdminV2PageHeader, AdminV2State } from "./AdminV2State";
import { AdminV2Panel, AdminV2StatusBadge } from "./AdminV2Primitives";
import { useAdminV2Capabilities } from "./AdminV2CapabilitiesContext";
import { adminQueryKey } from "./adminQueryClient";
import { useAdminLocale } from "./AdminV2LocaleContext";

const numberFormat = new Intl.NumberFormat("vi-VN");
const moneyFormat = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const dateFormat = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: "Asia/Ho_Chi_Minh" });

function Metric({ label, value, icon: Icon, format = numberFormat }) {
  return <div className="admin-v2-metric">
    <div className="admin-v2-metric-label">{createElement(Icon, { size: 15, "aria-hidden": true })} {label}</div>
    <div className="admin-v2-metric-value">{format.format(value ?? 0)}</div>
  </div>;
}

export default function AdminV2OverviewPage() {
  const { t } = useAdminLocale();
  const capabilities = useAdminV2Capabilities();
  const actorId = capabilities?.data?.actorUserId;
  const enabled = capabilities?.status === "success" && capabilities.data?.modules?.some((module) => module.key === "admin.dashboard.read" && ["V2_READ", "LEGACY_CONTRACT"].includes(module.availability));
  const query = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "dashboard-statistics"),
    queryFn: ({ signal }) => getAdminDashboardStatisticApi({ signal }),
    enabled: Boolean(actorId && enabled),
    staleTime: 30_000,
  });
  const state = { status: query.isPending ? "loading" : query.isError ? "error" : "success", data: query.data ?? null };

  return <div className="admin-v2-content">
    <AdminV2PageHeader title={t("overview.title")} description={t("overview.description")} />
    {!enabled && <AdminV2State title={t("overview.unavailableProjection")}>{t("overview.unavailableProjectionHelp")}</AdminV2State>}
    {enabled && state.status === "loading" && <AdminV2State title={t("overview.loading")}>{t("overview.loadingHelp")}</AdminV2State>}
    {enabled && state.status === "error" && <AdminV2State title={t("overview.unavailable")} tone="danger">{t("overview.unavailableHelp")}</AdminV2State>}
    {enabled && state.status === "success" && <>
      <div className="admin-v2-metric-grid">
        <Metric label={t("overview.usersMonthly")} value={state.data.totalNewUsersInMonth} icon={Users} />
        <Metric label={t("overview.activeAds")} value={state.data.totalActiveAdvertise} icon={Megaphone} />
        <Metric label={t("overview.revenueMonthly")} value={state.data.totalRevenueInMonth} icon={Activity} format={moneyFormat} />
        <Metric label={t("overview.publishedPosts")} value={state.data.totalPublishedBlogs} icon={NotebookPen} />
      </div>
      <AdminV2Panel title={t("overview.recentReports")} meta={t("overview.serverProjection")}>
          {state.data.recentReports?.length ? <div className="admin-v2-table-wrap"><table className="admin-v2-table"><thead><tr><th>{t("overview.reportTitle")}</th><th>{t("overview.reporter")}</th><th>{t("overview.reportType")}</th><th>{t("overview.reportDate")}</th><th>{t("overview.reportStatus")}</th></tr></thead><tbody>
            {state.data.recentReports.map((report) => <tr key={report.id}><td data-label={t("overview.reportTitle")}>{report.title}</td><td data-label={t("overview.reporter")}>{report.fullName}</td><td data-label={t("overview.reportType")}>{report.reportType}</td><td data-label={t("overview.reportDate")} className="admin-v2-mono">{report.reportDate ? dateFormat.format(new Date(report.reportDate)) : "—"}</td><td data-label={t("overview.reportStatus")}><AdminV2StatusBadge tone={report.status === "Pending" ? "warning" : "success"}>{report.status || t("common.unknown")}</AdminV2StatusBadge></td></tr>)}
          </tbody></table></div> : <AdminV2State title={t("overview.noRecentReports")}><FileWarning size={15} aria-hidden="true" /> {t("overview.noRecentReportsHelp")}</AdminV2State>}
      </AdminV2Panel>
    </>}
  </div>;
}
