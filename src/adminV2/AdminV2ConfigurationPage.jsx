import { useEffect, useMemo, useRef, useState } from "react";
import { EyeOff, Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { createAdminConfigurationApi, deleteAdminConfigurationApi, getAdminConfigurationApi, updateAdminConfigurationApi } from "../services/admin";
import { AdminV2PageHeader, AdminV2State } from "./AdminV2State";
import { AdminV2CommandResult, AdminV2Modal, AdminV2Panel, AdminV2Pagination, AdminV2StatusBadge } from "./AdminV2Primitives";
import { useAdminV2Capabilities } from "./AdminV2CapabilitiesContext";
import { adminQueryKey, parseAdminLimit } from "./adminQueryClient";
import { adminCommandError, adminReceiptState } from "./adminCommandOutcome";
import { adminRecoveryJournal, resolveAdminRecovery } from "./adminRecoveryJournal";
import { useAdminCommandRecovery } from "./useAdminCommandRecovery";
import { useAdminLocale } from "./AdminV2LocaleContext";

const dateFormat = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: "Asia/Ho_Chi_Minh" });

const emptyForm = () => ({ Key: "", Value: "", ValueType: "string", Category: "General", Description: "" });

const capabilityAllows = (projection, action) => projection?.status === "success"
  && projection.data?.modules?.some((module) => module.key === "admin.configuration.mutate"
    && module.availability === "V2_COMMAND"
    && module.actions?.includes(action));

export default function AdminV2ConfigurationPage() {
  const { t } = useAdminLocale();
  const capabilities = useAdminV2Capabilities();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editor, setEditor] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [commandState, setCommandState] = useState({ status: "idle", message: "", receipt: null });
  const commandAttemptRef = useRef(null);
  const query = useMemo(() => ({
    Keyword: searchParams.get("keyword") ?? "",
    PageIndex: Math.max(Number(searchParams.get("page") ?? 1), 1),
    PageSize: parseAdminLimit(searchParams.get("size"), 20),
  }), [searchParams]);
  const enabled = capabilities?.status === "success" && capabilities.data?.modules?.some((module) => module.key === "admin.configuration.read" && module.availability === "V2_READ");
  const createEnabled = capabilityAllows(capabilities, "create");
  const updateEnabled = capabilityAllows(capabilities, "update");
  const deleteEnabled = capabilityAllows(capabilities, "delete");
  const actorId = capabilities?.data?.actorUserId;
  const recovery = useAdminCommandRecovery(actorId);
  const recoveryBlocked = recovery.blocked || Boolean(recovery.locator);
  useEffect(() => {
    if (!recovery.locator && !recovery.blocked) commandAttemptRef.current = null;
  }, [recovery.locator, recovery.blocked]);
  const projectionQuery = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "configuration", query),
    queryFn: ({ signal }) => getAdminConfigurationApi(query, { signal }),
    enabled: Boolean(actorId && enabled),
  });
  const state = { status: projectionQuery.isPending ? "loading" : projectionQuery.isError ? "error" : "success", data: projectionQuery.data ?? null };

  const page = state.data;
  const configs = page?.items ?? [];
  const totalPages = page?.totalPages ?? (page?.totalItems ? Math.ceil(page.totalItems / query.PageSize) : 0);
  const setQuery = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next);
  };

  const openCreate = () => {
    if (recoveryBlocked) return;
    setCommandState({ status: "idle", message: "", receipt: null });
    setEditor({ mode: "create", config: null, form: emptyForm() });
  };

  const openEdit = (config) => {
    if (recoveryBlocked) return;
    setCommandState({ status: "idle", message: "", receipt: null });
    // The read contract deliberately withholds the stored value. An update is
    // therefore an explicit replacement entered by the operator.
    setEditor({ mode: "update", config, form: { Key: config.key ?? "", Value: "", ValueType: config.valueType ?? "string", Category: config.category ?? "General", Description: config.description ?? "" } });
  };

  const submitEditor = async (event) => {
    event.preventDefault();
    if (!editor || recoveryBlocked || !editor.form.Value.trim() || !actorId) return;
    const create = editor.mode === "create";
    if (!commandAttemptRef.current) {
      const targetId = create ? null : editor.config.id;
      const version = create ? "0" : String(editor.config.lastUpdatedTime ?? "");
      if (!create && (!targetId || !version)) {
        setCommandState({ status: "error", message: t("configuration.errorHelp"), receipt: null });
        return;
      }
      commandAttemptRef.current = {
        actorId,
        mode: editor.mode,
        locator: { actor: actorId, action: create ? "SYSTEM_CONFIG_CREATE" : "SYSTEM_CONFIG_UPDATE", targetId, key: crypto.randomUUID(), version },
      };
    }
    const attempt = commandAttemptRef.current;
    if (attempt.actorId !== actorId || attempt.mode !== editor.mode) return;
    const payload = create
      ? editor.form
      : { ...editor.form, ExpectedLastUpdatedAt: editor.config.lastUpdatedTime };
    setCommandState({ status: "loading", message: t("configuration.submit"), receipt: null });
    let sent = false;
    try {
      adminRecoveryJournal.reserve(attempt.locator);
      sent = true;
      const receipt = create
        ? await createAdminConfigurationApi(payload, { idempotencyKey: attempt.locator.key })
        : await updateAdminConfigurationApi(editor.config.id, payload, { idempotencyKey: attempt.locator.key, expectedVersion: attempt.locator.version });
      const status = adminReceiptState(receipt);
      setCommandState({ status, message: status === "success" ? t("configuration.success") : status === "error" ? t("configuration.reject") : t("recovery.noDecision"), receipt });
      if (status === "uncertain") { setEditor(null); return; }
      resolveAdminRecovery(attempt.locator, receipt);
      commandAttemptRef.current = null;
      setEditor(null);
      if (status === "success") await projectionQuery.refetch();
    } catch (error) {
      const result = sent ? adminCommandError(error) : { uncertain: false, message: t("recovery.cancelUnknown") };
      setCommandState({ status: result.uncertain ? "uncertain" : "error", message: result.message, receipt: null });
      if (result.uncertain) { setEditor(null); return; }
      try { const current = adminRecoveryJournal.read(actorId); if (current?.key === attempt.locator.key) adminRecoveryJournal.clear(); } catch { /* fail closed */ }
      commandAttemptRef.current = null;
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete || recoveryBlocked || !actorId) return;
    if (!commandAttemptRef.current) {
      commandAttemptRef.current = {
        actorId,
        mode: "delete",
        locator: { actor: actorId, action: "SYSTEM_CONFIG_DELETE", targetId: pendingDelete.config.id, key: crypto.randomUUID(), version: String(pendingDelete.config.lastUpdatedTime ?? "") },
      };
    }
    const attempt = commandAttemptRef.current;
    if (attempt.actorId !== actorId || attempt.mode !== "delete") return;
    setCommandState({ status: "loading", message: t("configuration.deleteSubmit"), receipt: null });
    let sent = false;
    try {
      adminRecoveryJournal.reserve(attempt.locator);
      sent = true;
      const receipt = await deleteAdminConfigurationApi(pendingDelete.config.id, { ExpectedLastUpdatedAt: pendingDelete.config.lastUpdatedTime, Reason: pendingDelete.reason }, { idempotencyKey: attempt.locator.key, expectedVersion: attempt.locator.version });
      const status = adminReceiptState(receipt);
      setCommandState({ status, message: status === "success" ? t("configuration.deleteSuccess") : status === "error" ? t("configuration.reject") : t("recovery.noDecision"), receipt });
      if (status === "uncertain") { setPendingDelete(null); return; }
      resolveAdminRecovery(attempt.locator, receipt);
      commandAttemptRef.current = null;
      setPendingDelete(null);
      if (status === "success") await projectionQuery.refetch();
    } catch (error) {
      const result = sent ? adminCommandError(error) : { uncertain: false, message: t("recovery.cancelUnknown") };
      setCommandState({ status: result.uncertain ? "uncertain" : "error", message: result.message, receipt: null });
      if (result.uncertain) { setPendingDelete(null); return; }
      try { const current = adminRecoveryJournal.read(actorId); if (current?.key === attempt.locator.key) adminRecoveryJournal.clear(); } catch { /* fail closed */ }
      commandAttemptRef.current = null;
    }
  };

  return <div className="admin-v2-content">
    <AdminV2PageHeader title={t("configuration.title")} description={t("configuration.description")} />
    {!enabled && <AdminV2State title={t("configuration.unavailable")}>{t("configuration.unavailableHelp")}</AdminV2State>}
    {enabled && <AdminV2Panel title={t("configuration.inventory")} meta={page ? `${page.totalItems ?? 0} total` : t("configuration.awaiting")}>
        <div className="admin-v2-toolbar"><span className="admin-v2-freshness">{t("configuration.withheldMeta")}</span>{createEnabled && <button className="admin-v2-primary-button" type="button" onClick={openCreate} disabled={recoveryBlocked}><Plus size={15} aria-hidden="true" /> {t("configuration.newEntry")}</button>}</div>
        <form className="admin-v2-toolbar" onSubmit={(event) => { event.preventDefault(); setQuery({ page: 1 }); }}>
          <label className="admin-v2-search-label"><Search size={15} aria-hidden="true" /><span className="sr-only">{t("configuration.searchLabel")}</span><input className="admin-v2-search" value={query.Keyword} onChange={(event) => setQuery({ keyword: event.target.value, page: 1 })} placeholder={t("configuration.searchPlaceholder")} /></label>
        </form>
        <AdminV2State title={t("configuration.valuesWithheld")}><EyeOff size={15} aria-hidden="true" /> {t("configuration.valuesWithheldHelp")}</AdminV2State>
        {state.status === "loading" && <AdminV2State title={t("configuration.loading")}>{t("configuration.loadingHelp")}</AdminV2State>}
        {state.status === "error" && <AdminV2State title={t("configuration.error")} tone="danger">{t("configuration.errorHelp")}</AdminV2State>}
        {state.status === "success" && configs.length === 0 && <AdminV2State title={t("configuration.empty")}>{t("configuration.emptyHelp")}</AdminV2State>}
        {state.status === "success" && configs.length > 0 && <div className="admin-v2-table-wrap"><table className="admin-v2-table"><thead><tr><th>{t("configuration.key")}</th><th>{t("configuration.category")}</th><th>{t("configuration.type")}</th><th>{t("configuration.descriptionLabel")}</th><th>{t("configuration.value")}</th><th>{t("configuration.updated")}</th><th>{t("configuration.actions")}</th></tr></thead><tbody>
          {configs.map((config) => <tr key={config.id}><td data-label={t("configuration.key")} className="admin-v2-mono">{config.key}</td><td data-label={t("configuration.category")}>{config.category || "—"}</td><td data-label={t("configuration.type")}>{config.valueType || "—"}</td><td data-label={t("configuration.descriptionLabel")}>{config.description || "—"}</td><td data-label={t("configuration.value")}><AdminV2StatusBadge tone="warning" icon={<EyeOff size={13} aria-hidden="true" />}>{t("configuration.withheldChars", { count: config.valueLength })}</AdminV2StatusBadge></td><td data-label={t("configuration.updated")} className="admin-v2-mono">{config.lastUpdatedTime ? dateFormat.format(new Date(config.lastUpdatedTime)) : "—"}</td><td data-label={t("configuration.actions")}><div className="admin-v2-row-actions">{updateEnabled && <button className="admin-v2-text-button" type="button" onClick={() => openEdit(config)} disabled={recoveryBlocked}><SquarePen size={14} aria-hidden="true" /> {t("configuration.replace")}</button>}{deleteEnabled && <button className="admin-v2-text-button admin-v2-text-button-danger" type="button" onClick={() => setPendingDelete({ config, reason: "" })} disabled={recoveryBlocked}><Trash2 size={14} aria-hidden="true" /> {t("configuration.delete")}</button>}</div></td></tr>)}
        </tbody></table></div>}
        {state.status === "success" && totalPages > 1 && <AdminV2Pagination page={query.PageIndex} totalPages={totalPages} onPrevious={() => setQuery({ page: query.PageIndex - 1 })} onNext={() => setQuery({ page: query.PageIndex + 1 })} />}
    </AdminV2Panel>}
    <AdminV2CommandResult state={commandState} successTitle={t("configuration.commandCommitted")} errorTitle={t("configuration.commandRejected")}>{commandState.message} Operation <span className="admin-v2-mono">{commandState.receipt?.operationId ?? "—"}</span>; audit <span className="admin-v2-mono">{commandState.receipt?.auditId ?? "—"}</span>.</AdminV2CommandResult>
    {!createEnabled && !updateEnabled && !deleteEnabled && enabled && <AdminV2State title={t("configuration.commandsUnavailable")}>{t("configuration.commandsUnavailableHelp")}</AdminV2State>}
    {editor && <AdminV2Modal open busy={commandState.status === "loading"} onClose={() => setEditor(null)} className="admin-v2-command-dialog" labelledBy="admin-configuration-editor-title"><div className="admin-v2-command-heading"><h2 id="admin-configuration-editor-title">{editor.mode === "create" ? t("configuration.create") : t("configuration.replaceTitle")}</h2><button className="admin-v2-text-button" type="button" onClick={() => setEditor(null)} disabled={commandState.status === "loading"}>{t("configuration.close")}</button></div><p className="admin-v2-freshness">{t("configuration.editorHelp")}</p><form className="admin-v2-form-grid" onSubmit={submitEditor}><label className="admin-v2-search-label"><span>{t("configuration.keyLabel")}</span><input className="admin-v2-search admin-v2-mono" maxLength="128" required disabled={editor.mode === "update"} value={editor.form.Key} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, Key: event.target.value } }))} /></label><label className="admin-v2-search-label"><span>{t("configuration.valueLabel")}</span><textarea className="admin-v2-search admin-v2-mono" rows="5" maxLength="16384" required value={editor.form.Value} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, Value: event.target.value } }))} /></label><label className="admin-v2-search-label"><span>{t("configuration.valueType")}</span><select className="admin-v2-search" value={editor.form.ValueType} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, ValueType: event.target.value } }))}><option value="string">string</option><option value="bool">bool</option><option value="int">int</option><option value="decimal">decimal</option><option value="datetime">datetime</option><option value="json">json</option></select></label><label className="admin-v2-search-label"><span>{t("configuration.categoryLabel")}</span><input className="admin-v2-search" maxLength="64" required value={editor.form.Category} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, Category: event.target.value } }))} /></label><label className="admin-v2-search-label"><span>{t("configuration.descriptionField")}</span><textarea className="admin-v2-search" rows="3" maxLength="1000" value={editor.form.Description} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, Description: event.target.value } }))} /></label>{commandState.status === "error" && <AdminV2State title={t("configuration.validationError")} tone="danger">{commandState.message}</AdminV2State>}<div className="admin-v2-dialog-actions"><button className="admin-v2-text-button" type="button" onClick={() => setEditor(null)} disabled={commandState.status === "loading"}>{t("common.cancel")}</button><button className="admin-v2-primary-button" type="submit" disabled={commandState.status === "loading" || !editor.form.Value.trim()}>{commandState.status === "loading" ? t("configuration.saving") : t("configuration.save")}</button></div></form></AdminV2Modal>}
    {pendingDelete && <AdminV2Modal open busy={commandState.status === "loading"} onClose={() => setPendingDelete(null)} className="admin-v2-dialog" labelledBy="admin-configuration-delete-title"><h2 id="admin-configuration-delete-title">{t("configuration.deleteTitle")}</h2><p>{t("configuration.deleteHelp", { key: pendingDelete.config.key })}</p><label className="admin-v2-search-label"><span>{t("configuration.reason")}</span><textarea className="admin-v2-search" rows="3" maxLength="500" required value={pendingDelete.reason} onChange={(event) => setPendingDelete((value) => ({ ...value, reason: event.target.value }))} /></label><div className="admin-v2-dialog-actions"><button className="admin-v2-text-button" type="button" onClick={() => setPendingDelete(null)} disabled={commandState.status === "loading"}>{t("common.cancel")}</button><button className="admin-v2-danger-button" type="button" onClick={confirmDelete} disabled={commandState.status === "loading" || !pendingDelete.reason.trim()}>{commandState.status === "loading" ? t("configuration.deleting") : t("configuration.deleteEntry")}</button></div></AdminV2Modal>}
  </div>;
}
