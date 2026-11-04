import { Activity, CheckCircle2, XCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminMaintenanceApi, getAdminOperationsReadinessApi, setAdminMaintenanceApi } from "../services/admin";
import { AdminV2PageHeader, AdminV2State } from "./AdminV2State";
import { AdminV2CommandResult, AdminV2Modal, AdminV2Panel, AdminV2StatusBadge } from "./AdminV2Primitives";
import { useAdminV2Capabilities } from "./AdminV2CapabilitiesContext";
import { adminQueryKey } from "./adminQueryClient";
import { adminCommandError, adminReceiptState } from "./adminCommandOutcome";
import { adminRecoveryJournal, resolveAdminRecovery } from "./adminRecoveryJournal";
import { useAdminLocale } from "./AdminV2LocaleContext";

const dateFormat = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });

export default function AdminV2OperationsPage() {
  const { t } = useAdminLocale();
  const capabilities = useAdminV2Capabilities();
  const enabled = capabilities?.status === "success" && capabilities.data?.modules?.some((module) => module.key === "admin.operations.read" && module.availability === "V2_READ");
  const actorId = capabilities?.data?.actorUserId;
  const query = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "operations-readiness"),
    queryFn: ({ signal }) => getAdminOperationsReadinessApi({ signal }),
    enabled: Boolean(actorId && enabled),
    refetchInterval: 60_000,
  });
  const state = { status: query.isPending ? "loading" : query.isError ? "error" : "success", data: query.data ?? null };

  const ready = state.data?.status === "READY";
  const maintenanceReadEnabled = capabilities?.status === "success" && capabilities.data?.modules?.some((module) => module.key === "admin.operations.maintenance.read" && module.availability === "V2_READ");
  const maintenanceCommandEnabled = capabilities?.status === "success" && capabilities.data?.modules?.some((module) => module.key === "admin.operations.maintenance" && module.availability === "V2_COMMAND" && module.actions?.includes("set"));
  const maintenanceQuery = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "maintenance"),
    queryFn: ({ signal }) => getAdminMaintenanceApi({ signal }),
    enabled: Boolean(actorId && maintenanceReadEnabled),
  });
  const [pendingMaintenance, setPendingMaintenance] = useState(null);
  const [maintenanceState, setMaintenanceState] = useState({ status: "idle", message: "", receipt: null });
  const maintenanceAttemptRef = useRef(null);
  const queryClient = useQueryClient();
  const maintenance = maintenanceQuery.data ?? null;
  const submitMaintenance = async () => {
    if (!pendingMaintenance) return;
    if (!maintenanceAttemptRef.current) {
      const key = crypto.randomUUID();
      const version = String(pendingMaintenance.version);
      maintenanceAttemptRef.current = {
        actorId, payload: { Enabled: pendingMaintenance.enabled, ExpectedLastUpdatedAt: pendingMaintenance.version, Reason: pendingMaintenance.reason },
        options: { idempotencyKey: key, expectedVersion: pendingMaintenance.version },
        locator: { actor: actorId, action: "SYSTEM_CONFIG_UPDATE", targetId: null, key, version },
      };
    }
    const attempt = maintenanceAttemptRef.current;
    if (attempt.actorId !== actorId) return;
    setMaintenanceState({ status: "loading", message: t("operations.applying"), receipt: null });
    let sent = false;
    try {
      adminRecoveryJournal.reserve(attempt.locator);
      sent = true;
      const receipt = await setAdminMaintenanceApi(attempt.payload, attempt.options);
      const status = adminReceiptState(receipt);
      setMaintenanceState({ status, message: status === "success" ? t("operations.committed") : status === "error" ? t("operations.rejected") : "Chưa xác nhận hoàn tất. Tra cứu kết quả trước khi gửi thao tác khác.", receipt });
      if (status === "uncertain") { setPendingMaintenance(null); return; }
      resolveAdminRecovery(attempt.locator, receipt);
      maintenanceAttemptRef.current = null;
      setPendingMaintenance(null);
      if (status !== "success") return;
      await queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "maintenance"] });
    } catch (error) {
      const result = sent ? adminCommandError(error) : { uncertain: false, message: "Không thể lưu metadata phục hồi. Thao tác chưa được gửi; hãy xử lý lệnh đang chờ trước." };
      setMaintenanceState({ status: result.uncertain ? "uncertain" : "error", message: result.message, receipt: null });
      if (result.uncertain) { setPendingMaintenance(null); return; }
      try {
        const current = adminRecoveryJournal.read(actorId);
        if (current && current.action === attempt.locator.action && current.key === attempt.locator.key) adminRecoveryJournal.clear();
      } catch { /* Storage failure remains fail-closed. */ }
      maintenanceAttemptRef.current = null;
    }
  };
  return <div className="admin-v2-content">
    <AdminV2PageHeader title={t("operations.title")} description={t("operations.description")} />
    {!enabled && <AdminV2State title={t("operations.unavailableProjection")}>{t("operations.unavailableProjectionHelp")}</AdminV2State>}
    {enabled && state.status === "loading" && <AdminV2State title={t("operations.checking")}>{t("operations.checkingHelp")}</AdminV2State>}
    {enabled && state.status === "error" && <AdminV2State title={t("operations.unavailable")} tone="danger">{t("operations.unavailableHelp")}</AdminV2State>}
    {enabled && state.status === "success" && <div className="admin-v2-metric-grid">
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><Activity size={15} aria-hidden="true" /> {t("operations.dependencies")}</div><div className="admin-v2-metric-value"><AdminV2StatusBadge tone={ready ? "success" : "danger"} icon={ready ? <CheckCircle2 size={15} aria-hidden="true" /> : <XCircle size={15} aria-hidden="true" />}>{state.data.status}</AdminV2StatusBadge></div></div>
      <div className="admin-v2-metric"><div className="admin-v2-metric-label">{t("operations.checkedAt")}</div><div className="admin-v2-metric-value admin-v2-mono">{state.data.checkedAt ? dateFormat.format(new Date(state.data.checkedAt)) : "—"}</div></div>
    </div>}
    {enabled && state.status === "success" && !ready && <AdminV2State title={t("operations.notReady")} tone="danger">{t("operations.notReadyHelp")}</AdminV2State>}
    {maintenanceReadEnabled && <AdminV2Panel title={t("operations.maintenance")} meta={maintenance ? t("operations.updated", { date: dateFormat.format(new Date(maintenance.lastUpdatedAt)) }) : t("operations.awaitingProjection")}>
      {maintenanceQuery.isPending && <AdminV2State title={t("operations.maintenanceLoading")}>{t("operations.maintenanceLoadingHelp")}</AdminV2State>}
      {maintenanceQuery.isError && <AdminV2State title={t("operations.maintenanceUnavailable")} tone="danger">{t("operations.maintenanceUnavailableHelp")}</AdminV2State>}
      {maintenance && <div className="admin-v2-toolbar"><AdminV2StatusBadge tone={maintenance.enabled ? "danger" : "success"}>{maintenance.enabled ? t("operations.maintenanceEnabled") : t("operations.liveTraffic")}</AdminV2StatusBadge>{maintenanceCommandEnabled && <button className={maintenance.enabled ? "admin-v2-primary-button" : "admin-v2-danger-button"} type="button" onClick={() => setPendingMaintenance({ enabled: !maintenance.enabled, version: maintenance.lastUpdatedAt, reason: "" })}>{maintenance.enabled ? t("operations.resumeTraffic") : t("operations.enableMaintenance")}</button>}</div>}
      {!maintenanceCommandEnabled && <AdminV2State title={t("operations.commandUnavailable")}>{t("operations.commandUnavailableHelp")}</AdminV2State>}
    </AdminV2Panel>}
    <AdminV2CommandResult state={maintenanceState} successTitle={t("operations.committed")} errorTitle={t("operations.rejected")}>{maintenanceState.message} Operation <span className="admin-v2-mono">{maintenanceState.receipt?.operationId ?? "—"}</span>; audit <span className="admin-v2-mono">{maintenanceState.receipt?.auditId ?? "—"}</span>.</AdminV2CommandResult>
    {pendingMaintenance && <AdminV2Modal open busy={maintenanceState.status === "loading"} onClose={() => setPendingMaintenance(null)} className="admin-v2-dialog" labelledBy="admin-maintenance-title"><h2 id="admin-maintenance-title">{pendingMaintenance.enabled ? t("operations.enableTitle") : t("operations.resumeTitle")}</h2><p>{t("operations.commandDescription")}</p><label className="admin-v2-search-label"><span>{t("operations.reason")}</span><textarea data-initial-focus className="admin-v2-search" rows="3" maxLength="500" required value={pendingMaintenance.reason} onChange={(event) => setPendingMaintenance((value) => ({ ...value, reason: event.target.value }))} /></label><div className="admin-v2-dialog-actions"><button className="admin-v2-text-button" type="button" onClick={() => setPendingMaintenance(null)} disabled={maintenanceState.status === "loading"}>{t("common.cancel")}</button><button className={pendingMaintenance.enabled ? "admin-v2-danger-button" : "admin-v2-primary-button"} type="button" onClick={submitMaintenance} disabled={maintenanceState.status === "loading" || !pendingMaintenance.reason.trim()}>{maintenanceState.status === "loading" ? t("operations.applying") : t("operations.confirm")}</button></div></AdminV2Modal>}
  </div>;
}
