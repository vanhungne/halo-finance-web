import { useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Search, ShieldCheck, ShieldOff, XCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { getAdminAccountRoleApi, getAdminAccountsApi, getAdminUserStatisticApi, setAccountLifecycleApi, setAdminAccountRoleApi } from "../services/admin";
import { AdminV2PageHeader, AdminV2State } from "./AdminV2State";
import { AdminV2CommandResult, AdminV2Modal, AdminV2Pagination, AdminV2Panel, AdminV2StatusBadge } from "./AdminV2Primitives";
import { useAdminV2Capabilities } from "./AdminV2CapabilitiesContext";
import { adminQueryKey, parseAdminLimit } from "./adminQueryClient";
import { adminCommandError, adminReceiptState } from "./adminCommandOutcome";
import { adminRecoveryJournal, resolveAdminRecovery } from "./adminRecoveryJournal";
import { useAdminLocale } from "./AdminV2LocaleContext";

const numberFormat = new Intl.NumberFormat("vi-VN");
const dateFormat = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: "Asia/Ho_Chi_Minh" });

function boolParam(value) { return value === "true" ? true : value === "false" ? false : null; }

export default function AdminV2UsersPage() {
  const { t } = useAdminLocale();
  const capabilityProjection = useAdminV2Capabilities();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => ({
    keyword: searchParams.get("keyword") ?? "",
    isActive: boolParam(searchParams.get("active")),
    limit: parseAdminLimit(searchParams.get("size"), 20),
    cursor: searchParams.get("cursor") || undefined,
  }), [searchParams]);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingRole, setPendingRole] = useState(null);
  const [operationState, setOperationState] = useState({ status: "idle", data: null, message: "" });
  const [roleState, setRoleState] = useState({ status: "idle", data: null, message: "" });
  const lifecycleAttemptRef = useRef(null);
  const roleAttemptRef = useRef(null);
  const roleSendingRef = useRef(false);
  const actorId = capabilityProjection?.data?.actorUserId;
  const readEnabled = capabilityProjection?.status === "success" && capabilityProjection.data?.modules?.some((module) => module.key === "admin.accounts.read" && ["V2_READ", "LEGACY_CONTRACT"].includes(module.availability));
  const queryClient = useQueryClient();
  const accountsQuery = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "accounts", query),
    queryFn: ({ signal }) => getAdminAccountsApi(query, { signal }),
    enabled: Boolean(actorId && readEnabled),
  });
  const statsQuery = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "account-statistics"),
    queryFn: ({ signal }) => getAdminUserStatisticApi({ signal }),
    enabled: Boolean(actorId && readEnabled),
    staleTime: 60_000,
  });
  const listState = { status: accountsQuery.isPending ? "loading" : accountsQuery.isError ? "error" : "success", data: accountsQuery.data ?? null };
  const statsState = { status: statsQuery.isPending ? "loading" : statsQuery.isError ? "error" : "success", data: statsQuery.data ?? null };
  const lifecycleEnabled = capabilityProjection?.status === "success" && capabilityProjection.data?.modules?.some((module) => module.key === "admin.accounts.lifecycle" && module.availability === "V2_COMMAND");
  const roleEnabled = capabilityProjection?.status === "success" && capabilityProjection.data?.modules?.some((module) => module.key === "admin.accounts.roles" && module.availability === "V2_COMMAND" && module.actions?.includes("set-role"));

  const page = listState.data;
  const users = page?.items ?? [];
  const setQuery = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next);
  };
  const clearRecoveryIfSame = (locator) => {
    try {
      const current = adminRecoveryJournal.read(actorId);
      if (current && ["actor", "action", "targetId", "key", "version"].every((field) => current[field] === locator[field])) adminRecoveryJournal.clear();
    } catch { /* Recovery UI remains fail-closed if session storage is unavailable. */ }
  };
  const requestLifecycle = async () => {
    if (!pendingAction) return;
    const { user, desiredState } = pendingAction;
    if (!pendingAction.reason?.trim()) {
      setOperationState({ status: "error", data: null, message: t("users.reasonRequired") });
      return;
    }
    if (!user.version) {
      setOperationState({ status: "error", data: null, message: "This account has no concurrency version. Refresh the list before retrying." });
      setPendingAction(null);
      return;
    }
    if (!lifecycleAttemptRef.current) {
      const key = crypto.randomUUID();
      const version = String(user.version);
      lifecycleAttemptRef.current = {
        actorId,
        targetId: user.id,
        payload: { desiredState, reason: pendingAction.reason.trim() },
        options: { idempotencyKey: key, expectedVersion: version },
        locator: { actor: actorId, action: "SET_ACCOUNT_LIFECYCLE", targetId: user.id, key, version },
      };
    }
    const attempt = lifecycleAttemptRef.current;
    if (attempt.actorId !== actorId || attempt.targetId !== user.id) return;
    setOperationState({ status: "loading", data: null, message: "" });
    let sent = false;
    try {
      adminRecoveryJournal.reserve(attempt.locator);
      sent = true;
      const receipt = await setAccountLifecycleApi(attempt.targetId, attempt.payload, attempt.options);
      const status = adminReceiptState(receipt);
      setOperationState({ status, data: receipt, message: status === "success" ? t("users.commandCommittedHelp") : status === "error" ? t("users.commandRejected") : t("users.checkResult") });
      if (status === "uncertain") { setPendingAction(null); return; }
      resolveAdminRecovery(attempt.locator, receipt);
      lifecycleAttemptRef.current = null;
      setPendingAction(null);
      if (status !== "success") return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "accounts"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "account-statistics"] }),
      ]);
    } catch (error) {
      const result = sent ? adminCommandError(error) : { uncertain: false, message: "Không thể lưu metadata phục hồi. Thao tác chưa được gửi; hãy xử lý lệnh đang chờ trước." };
      setOperationState({ status: result.uncertain ? "uncertain" : "error", data: null, message: result.message });
      if (result.uncertain) { setPendingAction(null); return; }
      clearRecoveryIfSame(attempt.locator);
      lifecycleAttemptRef.current = null;
      setPendingAction(null);
    }
  };

  const openRoleEditor = async (user) => {
    if (roleSendingRef.current || roleAttemptRef.current) return;
    setRoleState({ status: "loading", data: null, message: t("users.loadingRoleHelp") });
    try {
      const role = await getAdminAccountRoleApi(user.id);
      setPendingRole({ user, role: role.role === "ADMIN" ? "ADMIN" : "MEMBER", currentRole: role.role, version: role.version, reason: "" });
      setRoleState({ status: "idle", data: null, message: "" });
    } catch (error) {
      const response = error.response?.data;
      setRoleState({ status: "error", data: null, message: response?.message || response?.errorCode || t("users.roleRejected") });
    }
  };

  const submitRole = async () => {
    if (!pendingRole || roleSendingRef.current || !roleEnabled) return;
    if (!pendingRole.version) {
      setRoleState({ status: "error", data: null, message: "This account has no concurrency version. Refresh the role projection before retrying." });
      return;
    }
    if (!roleAttemptRef.current) {
      const key = crypto.randomUUID();
      const version = String(pendingRole.version);
      roleAttemptRef.current = {
        actorId, targetId: pendingRole.user.id, payload: { Role: pendingRole.role, Reason: pendingRole.reason },
        options: { idempotencyKey: key, expectedVersion: version },
        locator: { actor: actorId, action: "ACCOUNT_SET_ROLE", targetId: pendingRole.user.id, key, version },
      };
    }
    const attempt = roleAttemptRef.current;
    if (attempt.actorId !== actorId) return;
    roleSendingRef.current = true;
    setRoleState({ status: "loading", data: null, message: t("users.applying") });
    let sent = false;
    try {
      adminRecoveryJournal.reserve(attempt.locator);
      sent = true;
      const receipt = await setAdminAccountRoleApi(attempt.targetId, attempt.payload, attempt.options);
      const status = adminReceiptState(receipt);
      setRoleState({ status, data: receipt, message: status === "success" ? t("users.commandCommittedHelp") : status === "error" ? t("users.roleRejected") : t("users.checkResult") });
      if (status === "uncertain") { setPendingRole(null); return; }
      resolveAdminRecovery(attempt.locator, receipt);
      roleAttemptRef.current = null;
      if (status !== "success") { setPendingRole(null); return; }
      setPendingRole(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "accounts"] });
    } catch (error) {
      const result = sent ? adminCommandError(error) : { uncertain: false, message: "Không thể lưu metadata phục hồi. Thao tác chưa được gửi; hãy xử lý lệnh đang chờ trước." };
      setRoleState({ status: result.uncertain ? "uncertain" : "error", data: null, message: result.message });
      if (result.uncertain) { setPendingRole(null); return; }
      clearRecoveryIfSame(attempt.locator);
      roleAttemptRef.current = null;
    } finally { roleSendingRef.current = false; }
  };

  return <div className="admin-v2-content">
    <AdminV2PageHeader title={t("users.title")} description={t("users.description")} />
    {!readEnabled && <AdminV2State title={t("users.unavailableProjection")}>{t("users.unavailableProjectionHelp")}</AdminV2State>}
    {readEnabled && <>
    {statsState.status === "success" && <div className="admin-v2-metric-grid">
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><ShieldCheck size={15} aria-hidden="true" /> {t("users.total")}</div><div className="admin-v2-metric-value">{numberFormat.format(statsState.data.totalUsers ?? 0)}</div></div>
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><CheckCircle2 size={15} aria-hidden="true" /> {t("users.active")}</div><div className="admin-v2-metric-value">{numberFormat.format(statsState.data.activeUsers ?? 0)}</div></div>
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><XCircle size={15} aria-hidden="true" /> {t("users.inactive")}</div><div className="admin-v2-metric-value">{numberFormat.format(statsState.data.inactiveUsers ?? 0)}</div></div>
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><ShieldCheck size={15} aria-hidden="true" /> {t("users.twoFactor")}</div><div className="admin-v2-metric-value">{numberFormat.format(statsState.data.enabled2FAUsers ?? 0)}</div></div>
    </div>}
    {statsState.status === "error" && <AdminV2State title={t("users.metricsUnavailable")}>{t("users.metricsUnavailableHelp")}</AdminV2State>}
    <AdminV2Panel title={t("users.inventory")} meta={page ? t("users.shown", { count: page.items?.length ?? 0 }) : t("users.awaitingProjection")}>
        <form className="admin-v2-toolbar" onSubmit={(event) => { event.preventDefault(); setQuery({ cursor: undefined }); }}>
          <label className="admin-v2-search-label"><Search size={15} aria-hidden="true" /><span className="sr-only">{t("users.searchLabel")}</span><input className="admin-v2-search" value={query.keyword} onChange={(event) => setQuery({ keyword: event.target.value, cursor: undefined })} placeholder={t("users.search")} /></label>
          <select className="admin-v2-search" value={searchParams.get("active") ?? ""} onChange={(event) => setQuery({ active: event.target.value, cursor: undefined })} aria-label={t("users.filterStatus")}><option value="">{t("users.allStatuses")}</option><option value="true">{t("users.active")}</option><option value="false">{t("users.inactive")}</option></select>
        </form>
        {listState.status === "loading" && <AdminV2State title={t("users.loading")}>{t("users.loadingHelp")}</AdminV2State>}
        {listState.status === "error" && <AdminV2State title={t("users.error")} tone="danger">{t("users.errorHelp")}</AdminV2State>}
        {listState.status === "success" && users.length === 0 && <AdminV2State title={query.keyword || query.isActive !== null ? t("users.noMatches") : t("users.noAccounts")}>{query.keyword || query.isActive !== null ? t("users.noMatchesHelp") : t("users.noAccountsHelp")}</AdminV2State>}
        {listState.status === "success" && users.length > 0 && <div className="admin-v2-table-wrap"><table className="admin-v2-table"><thead><tr><th>{t("users.name")}</th><th>{t("users.email")}</th><th>{t("users.status")}</th><th>{t("users.security")}</th><th>{t("users.created")}</th><th>{t("users.actions")}</th></tr></thead><tbody>
          {users.map((user) => <tr key={user.id}><td data-label={t("users.name")}>{user.fullName || "—"}</td><td data-label={t("users.email")}>{user.email || "—"}</td><td data-label={t("users.status")}><AdminV2StatusBadge tone={user.lifecycleState === "ACTIVE" ? "success" : user.lifecycleState === "DELETED" ? "danger" : "warning"}>{user.lifecycleState || (user.isActive ? "ACTIVE" : "SUSPENDED")}</AdminV2StatusBadge></td><td data-label={t("users.security")}>{user.twoFactorEnabled ? <AdminV2StatusBadge tone="success" icon={<ShieldCheck size={13} aria-hidden="true" />}>2FA</AdminV2StatusBadge> : <AdminV2StatusBadge tone="warning" icon={<ShieldOff size={13} aria-hidden="true" />}>{t("users.noTwoFactor")}</AdminV2StatusBadge>}</td><td data-label={t("users.created")} className="admin-v2-mono">{user.createdAt ? dateFormat.format(new Date(user.createdAt)) : "—"}</td><td data-label={t("users.actions")}><div className="admin-v2-row-actions">{lifecycleEnabled && user.lifecycleState !== "DELETED" && <><button className="admin-v2-text-button" type="button" onClick={() => setPendingAction({ user, desiredState: user.lifecycleState === "ACTIVE" ? "SUSPENDED" : "ACTIVE", label: user.lifecycleState === "ACTIVE" ? t("users.suspend") : t("users.reactivate"), reason: "" })}>{user.lifecycleState === "ACTIVE" ? t("users.suspend") : t("users.reactivate")}</button><button className="admin-v2-text-button admin-v2-text-button-danger" type="button" onClick={() => setPendingAction({ user, desiredState: "DELETED", label: t("users.delete"), reason: "" })}>{t("users.delete")}</button></>}{roleEnabled && <button className="admin-v2-text-button" type="button" onClick={() => openRoleEditor(user)}>{t("users.manageRole")}</button>}{!lifecycleEnabled && !roleEnabled && "—"}</div></td></tr>)}
        </tbody></table></div>}
        {listState.status === "success" && <AdminV2Pagination page={1} hasMore={page?.hasMore} onPrevious={() => setQuery({ cursor: undefined })} onNext={() => setQuery({ cursor: page?.nextCursor })} />}
    </AdminV2Panel>
    <AdminV2CommandResult state={operationState} successTitle={t("users.commandCommitted")} errorTitle={t("users.commandRejected")}>Operation {operationState.data?.operationId} recorded with outcome {operationState.data?.outcomeCode}.</AdminV2CommandResult>
    {!lifecycleEnabled && <AdminV2State title={t("users.lifecycleUnavailable")}>{t("users.lifecycleUnavailableHelp")}</AdminV2State>}
    {roleState.status === "loading" && !pendingRole && <AdminV2State title={t("users.loadingRole")}>{t("users.loadingRoleHelp")}</AdminV2State>}
    {roleState.status === "success" && <AdminV2State title={t("users.roleCommitted")} tone="success">{roleState.message} Operation <span className="admin-v2-mono">{roleState.data?.operationId ?? "—"}</span>; audit <span className="admin-v2-mono">{roleState.data?.auditId ?? "—"}</span>.</AdminV2State>}
    {roleState.status === "error" && <AdminV2State title={t("users.roleRejected")} tone="danger">{roleState.message}</AdminV2State>}
    {!roleEnabled && <AdminV2State title={t("users.roleUnavailable")}>{t("users.roleUnavailableHelp")}</AdminV2State>}
    {pendingAction && <AdminV2Modal open busy={operationState.status === "loading"} onClose={() => setPendingAction(null)} className="admin-v2-dialog" labelledBy="admin-lifecycle-title"><h2 id="admin-lifecycle-title">{t("users.confirm", { action: pendingAction.label })}</h2><p>{t("users.confirmHelp", { account: pendingAction.user.fullName || pendingAction.user.email, state: pendingAction.desiredState })}</p><label className="admin-v2-search-label"><span>{t("users.reason")}</span><textarea data-initial-focus className="admin-v2-search" rows="3" maxLength="500" required value={pendingAction.reason} onChange={(event) => setPendingAction((value) => ({ ...value, reason: event.target.value }))} /></label><div className="admin-v2-dialog-actions"><button className="admin-v2-text-button" type="button" onClick={() => setPendingAction(null)} disabled={operationState.status === "loading"}>{t("users.cancel")}</button><button className="admin-v2-danger-button" type="button" onClick={requestLifecycle} disabled={operationState.status === "loading" || !pendingAction.reason.trim()}>{operationState.status === "loading" ? t("users.applying") : t("users.confirmAction")}</button></div></AdminV2Modal>}
    {pendingRole && <AdminV2Modal open busy={roleState.status === "loading"} onClose={() => setPendingRole(null)} className="admin-v2-dialog" labelledBy="admin-role-title">
      <h2 id="admin-role-title">{t("users.roleTitle")}</h2><p><strong>{pendingRole.user.fullName || pendingRole.user.email}</strong> · {t("users.currentRole")} {pendingRole.currentRole}</p>
      <fieldset className="admin-v2-editor-fields" disabled={roleState.status === "loading" || roleState.status === "uncertain"}>
        <label className="admin-v2-search-label">{t("users.actions")}<select data-initial-focus className="admin-v2-search" value={pendingRole.role} onChange={(event) => setPendingRole((value) => ({ ...value, role: event.target.value }))}><option value="ADMIN">{t("users.roleAdmin")}</option><option value="MEMBER">{t("users.roleMember")}</option></select></label>
        <label className="admin-v2-search-label">{t("users.reason")}<textarea className="admin-v2-search" rows={3} maxLength={500} required value={pendingRole.reason} onChange={(event) => setPendingRole((value) => ({ ...value, reason: event.target.value }))} /></label>
      </fieldset>
      <p className="admin-v2-freshness">{t("users.roleHelp")}</p>
      {roleState.status === "uncertain" && <div aria-live="polite"><AdminV2State title={t("users.checkResult")}>{roleState.message}</AdminV2State></div>}
      <div className="admin-v2-dialog-actions"><button className="admin-v2-text-button" type="button" onClick={() => setPendingRole(null)} disabled={roleState.status === "loading" || roleState.status === "uncertain"}>{t("users.cancel")}</button><button className="admin-v2-primary-button" type="button" onClick={submitRole} disabled={roleState.status === "loading" || !pendingRole.reason.trim()}>{roleState.status === "loading" ? t("users.applying") : roleState.status === "uncertain" ? t("users.checkResult") : t("users.confirmRole")}</button></div>
    </AdminV2Modal>}
    </>}
  </div>;
}
