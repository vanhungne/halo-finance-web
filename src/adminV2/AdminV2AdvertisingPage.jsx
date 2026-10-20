import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, CalendarDays, Megaphone, MousePointerClick, Search } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { createAdminAdvertiseApi, deleteAdminAdvertiseApi, getAdminAdvertiseListApi, getAdminAdvertiseStatisticApi, setAdvertiseStatusApi, updateAdminAdvertiseApi } from "../services/admin";
import { AdminV2PageHeader, AdminV2State } from "./AdminV2State";
import { AdminV2DangerConfirmation, AdminV2Modal, AdminV2Panel, AdminV2Pagination, AdminV2StatusBadge } from "./AdminV2Primitives";
import { useAdminV2Capabilities } from "./AdminV2CapabilitiesContext";
import { adminQueryKey, parseAdminLimit } from "./adminQueryClient";
import { adminCommandError, adminReceiptState } from "./adminCommandOutcome";
import { adminRecoveryJournal, resolveAdminRecovery } from "./adminRecoveryJournal";
import { useAdminCommandRecovery } from "./useAdminCommandRecovery";

const numberFormat = new Intl.NumberFormat("vi-VN");
const dateFormat = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: "Asia/Ho_Chi_Minh" });

function positiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function toApiDate(value) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : undefined;
}

function statusTone(status) {
  if (status === "Active") return "success";
  if (status === "Stopped") return "danger";
  if (status === "Completed") return "success";
  return "warning";
}

function toDateTimeInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function toUtcIso(value) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "" : date.toISOString();
}

export default function AdminV2AdvertisingPage() {
  const capabilityProjection = useAdminV2Capabilities();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => ({
    Search: searchParams.get("keyword") ?? "",
    Status: searchParams.get("status") || undefined,
    StartDate: toApiDate(searchParams.get("start")),
    EndDate: toApiDate(searchParams.get("end")),
    SortBy: searchParams.get("sort") === "ClickCount" ? "ClickCount" : "CreatedTime",
    IsDescending: searchParams.get("direction") !== "asc",
    PageIndex: positiveInt(searchParams.get("page"), 1),
    PageSize: parseAdminLimit(searchParams.get("size"), 20),
  }), [searchParams]);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [editor, setEditor] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [commandState, setCommandState] = useState({ status: "idle", message: "", receipt: null });
  const statusAttemptRef = useRef(null);
  const crudAttemptRef = useRef(null);
  const actorId = capabilityProjection?.data?.actorUserId;
  const recovery = useAdminCommandRecovery(actorId);
  const recoveryBlocked = recovery.blocked || Boolean(recovery.locator);
  useEffect(() => {
    if (!recovery.locator && !recovery.blocked) {
      statusAttemptRef.current = null;
      crudAttemptRef.current = null;
    }
  }, [recovery.locator, recovery.blocked]);
  const readEnabled = capabilityProjection?.status === "success" && capabilityProjection.data?.modules?.some((module) => module.key === "admin.advertising.read" && ["V2_READ", "LEGACY_CONTRACT"].includes(module.availability));
  const statusCommandEnabled = capabilityProjection?.status === "success" && capabilityProjection.data?.modules?.some((module) => module.key === "admin.advertising.mutate" && module.availability === "V2_COMMAND" && module.actions?.includes("change-status"));
  const crudEnabled = capabilityProjection?.status === "success" && capabilityProjection.data?.modules?.some((module) => module.key === "admin.advertising.crud" && module.availability === "V2_COMMAND");
  const hasPartialDateRange = Boolean(searchParams.get("start")) !== Boolean(searchParams.get("end"));
  const hasInvalidDateRange = Boolean(searchParams.get("start") && searchParams.get("end") && searchParams.get("start") > searchParams.get("end"));
  const queryClient = useQueryClient();
  const listQuery = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "advertising", query),
    queryFn: ({ signal }) => getAdminAdvertiseListApi(query, { signal }),
    enabled: Boolean(actorId && readEnabled && !hasInvalidDateRange),
  });
  const statsQuery = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "advertising-statistics"),
    queryFn: ({ signal }) => getAdminAdvertiseStatisticApi({ signal }),
    enabled: Boolean(actorId && readEnabled),
    staleTime: 60_000,
  });
  const listState = { status: listQuery.isPending ? "loading" : listQuery.isError ? "error" : "success", data: listQuery.data ?? null };
  const statsState = { status: statsQuery.isPending ? "loading" : statsQuery.isError ? "error" : "success", data: statsQuery.data ?? null };
  const page = listState.data;
  const adverts = page?.items ?? [];
  const totalPages = page?.totalPages ?? (page?.totalItems ? Math.ceil(page.totalItems / query.PageSize) : 0);
  const setQuery = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined || (key === "status" && value === "All")) next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next);
  };
  const requestStatus = async () => {
    if (!pendingStatus || recoveryBlocked) return;
    const { advert, isActive } = pendingStatus;
    if (!pendingStatus.reason?.trim()) {
      setCommandState({ status: "error", message: "A reason is required for a campaign status change.", receipt: null });
      return;
    }
    if (!advert.version) {
      setCommandState({ status: "error", message: "This campaign has no concurrency version. Refresh the list before retrying.", receipt: null });
      setPendingStatus(null);
      return;
    }
    if (!statusAttemptRef.current) {
      const key = crypto.randomUUID();
      const version = String(advert.version);
      statusAttemptRef.current = {
        actorId, targetId: advert.id, payload: { isActive, reason: pendingStatus.reason.trim() },
        options: { idempotencyKey: key, expectedVersion: version },
        locator: { actor: actorId, action: "ADVERTISE_SET_STATUS", targetId: advert.id, key, version },
      };
    }
    const attempt = statusAttemptRef.current;
    if (attempt.actorId !== actorId || attempt.targetId !== advert.id) return;
    setCommandState({ status: "loading", message: "", receipt: null });
    let sent = false;
    try {
      adminRecoveryJournal.reserve(attempt.locator);
      sent = true;
      const receipt = await setAdvertiseStatusApi(attempt.targetId, attempt.payload, attempt.options);
      const status = adminReceiptState(receipt);
      setCommandState({ status, message: status === "success" ? "Campaign status updated and recorded in the audit trail." : status === "error" ? "The status command was durably rejected." : "Chưa xác nhận hoàn tất. Tra cứu kết quả trước khi gửi thao tác khác.", receipt });
      if (status === "uncertain") { setPendingStatus(null); return; }
      resolveAdminRecovery(attempt.locator, receipt);
      statusAttemptRef.current = null;
      setPendingStatus(null);
      if (status !== "success") return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "advertising"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "advertising-statistics"] }),
      ]);
    } catch (error) {
      const result = sent ? adminCommandError(error) : { uncertain: false, message: "Không thể lưu metadata phục hồi. Thao tác chưa được gửi; hãy xử lý lệnh đang chờ trước." };
      setCommandState({ status: result.uncertain ? "uncertain" : "error", message: result.message, receipt: null });
      if (result.uncertain) { setPendingStatus(null); return; }
      try {
        const current = adminRecoveryJournal.read(actorId);
        if (current && ["actor", "action", "targetId", "key", "version"].every((field) => current[field] === attempt.locator[field])) adminRecoveryJournal.clear();
      } catch { /* Storage failure remains fail-closed. */ }
      statusAttemptRef.current = null;
      setPendingStatus(null);
    }
  };

  const openCreate = () => {
    if (recoveryBlocked) return;
    setCommandState({ status: "idle", message: "", receipt: null });
    setEditor({ mode: "create", advert: null, form: { Title: "", Description: "", ImageUrl: "", RedirectUrl: "", StartDate: "", EndDate: "" } });
  };

  const openEdit = (advert) => {
    if (recoveryBlocked) return;
    setCommandState({ status: "idle", message: "", receipt: null });
    setEditor({ mode: "update", advert, form: { Title: advert.title ?? "", Description: advert.description ?? "", ImageUrl: advert.imageUrl ?? "", RedirectUrl: advert.redirectUrl ?? "", StartDate: toDateTimeInput(advert.startDate), EndDate: toDateTimeInput(advert.endDate), Reason: "" } });
  };

  const submitEditor = async () => {
    if (!editor || recoveryBlocked) return;
    const payload = { ...editor.form, StartDate: toUtcIso(editor.form.StartDate), EndDate: toUtcIso(editor.form.EndDate), ...(editor.mode === "update" ? { Reason: editor.form.Reason } : {}) };
    if (!payload.StartDate || !payload.EndDate) {
      setCommandState({ status: "error", message: "Start and end timestamps are required and must be valid.", receipt: null });
      return;
    }
    if (!crudAttemptRef.current) {
      const create = editor.mode === "create";
      const targetId = create ? null : editor.advert.id;
      const version = create ? "0" : String(editor.advert.version ?? "");
      if (!create && !/^([1-9]\d*)$/.test(version)) {
        setCommandState({ status: "error", message: "This campaign has no concurrency version. Refresh the list before retrying.", receipt: null });
        return;
      }
      const action = create ? "ADVERTISE_CREATE" : "ADVERTISE_UPDATE";
      crudAttemptRef.current = { actorId, mode: editor.mode, targetId, locator: { actor: actorId, action, targetId, key: crypto.randomUUID(), version } };
    }
    const attempt = crudAttemptRef.current;
    if (attempt.actorId !== actorId) return;
    setCommandState({ status: "loading", message: "Submitting the audited campaign command…", receipt: null });
    let sent = false;
    try {
      adminRecoveryJournal.reserve(attempt.locator);
      sent = true;
      const receipt = editor.mode === "create"
        ? await createAdminAdvertiseApi(payload, { idempotencyKey: attempt.locator.key, expectedVersion: attempt.locator.version })
        : await updateAdminAdvertiseApi(editor.advert.id, payload, { idempotencyKey: attempt.locator.key, expectedVersion: attempt.locator.version });
      const status = adminReceiptState(receipt);
      setCommandState({ status, message: status === "success" ? "Campaign metadata command committed and recorded in the audit trail." : status === "error" ? "The campaign metadata command was durably rejected." : "Chưa xác nhận hoàn tất. Tra cứu kết quả trước khi gửi thao tác khác.", receipt });
      if (status === "uncertain") { setEditor(null); return; }
      resolveAdminRecovery(attempt.locator, receipt);
      crudAttemptRef.current = null;
      setEditor(null);
      if (status !== "success") return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "advertising"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "advertising-statistics"] }),
      ]);
    } catch (error) {
      const result = sent ? adminCommandError(error) : { uncertain: false, message: "Không thể lưu metadata phục hồi. Thao tác chưa được gửi; hãy xử lý lệnh đang chờ trước." };
      setCommandState({ status: result.uncertain ? "uncertain" : "error", message: result.message, receipt: null });
      if (result.uncertain) { setEditor(null); return; }
      try { const current = adminRecoveryJournal.read(actorId); if (current?.key === attempt.locator.key) adminRecoveryJournal.clear(); } catch { /* fail closed */ }
      crudAttemptRef.current = null;
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete || recoveryBlocked) return;
    if (!crudAttemptRef.current) {
      const version = String(pendingDelete.advert.version ?? "");
      if (!/^([1-9]\d*)$/.test(version)) {
        setCommandState({ status: "error", message: "This campaign has no concurrency version. Refresh the list before retrying.", receipt: null });
        return;
      }
      crudAttemptRef.current = { actorId, mode: "delete", targetId: pendingDelete.advert.id, locator: { actor: actorId, action: "ADVERTISE_DELETE", targetId: pendingDelete.advert.id, key: crypto.randomUUID(), version } };
    }
    const attempt = crudAttemptRef.current;
    setCommandState({ status: "loading", message: "Submitting the audited campaign delete command…", receipt: null });
    let sent = false;
    try {
      adminRecoveryJournal.reserve(attempt.locator);
      sent = true;
      const receipt = await deleteAdminAdvertiseApi(pendingDelete.advert.id, { Reason: pendingDelete.reason }, { idempotencyKey: attempt.locator.key, expectedVersion: attempt.locator.version });
      const status = adminReceiptState(receipt);
      setCommandState({ status, message: status === "success" ? "Campaign deleted and recorded in the audit trail." : status === "error" ? "The campaign delete command was durably rejected." : "Chưa xác nhận hoàn tất. Tra cứu kết quả trước khi gửi thao tác khác.", receipt });
      if (status === "uncertain") { setPendingDelete(null); return; }
      resolveAdminRecovery(attempt.locator, receipt);
      crudAttemptRef.current = null;
      setPendingDelete(null);
      if (status !== "success") return;
      await queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "advertising"] });
    } catch (error) {
      const result = sent ? adminCommandError(error) : { uncertain: false, message: "Không thể lưu metadata phục hồi. Thao tác chưa được gửi; hãy xử lý lệnh đang chờ trước." };
      setCommandState({ status: result.uncertain ? "uncertain" : "error", message: result.message, receipt: null });
      if (result.uncertain) { setPendingDelete(null); return; }
      try { const current = adminRecoveryJournal.read(actorId); if (current?.key === attempt.locator.key) adminRecoveryJournal.clear(); } catch { /* fail closed */ }
      crudAttemptRef.current = null;
    }
  };

  return <div className="admin-v2-content">
    <AdminV2PageHeader title="Advertising" description="Campaign inventory, delivery metrics and audited metadata commands." />
    {!readEnabled && <AdminV2State title="Advertising projection is unavailable">The server has not enabled the advertising read contract for this session.</AdminV2State>}
    {readEnabled && <>
    {statsState.status === "success" && <div className="admin-v2-metric-grid">
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><Megaphone size={15} aria-hidden="true" /> Total campaigns</div><div className="admin-v2-metric-value">{numberFormat.format(statsState.data.totalAdvertises ?? 0)}</div></div>
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><CalendarDays size={15} aria-hidden="true" /> Not started</div><div className="admin-v2-metric-value">{numberFormat.format(statsState.data.notStartedAdvertises ?? 0)}</div></div>
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><BarChart3 size={15} aria-hidden="true" /> Active</div><div className="admin-v2-metric-value">{numberFormat.format(statsState.data.activeAdvertises ?? 0)}</div></div>
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><MousePointerClick size={15} aria-hidden="true" /> Completed</div><div className="admin-v2-metric-value">{numberFormat.format(statsState.data.completedAdvertises ?? 0)}</div></div>
    </div>}
    {statsState.status === "error" && <AdminV2State title="Advertising metrics unavailable">The campaign list remains separate from the failed statistic projection.</AdminV2State>}
    <AdminV2Panel title="Campaign inventory" meta={page ? `${page.totalItems ?? 0} total` : "Awaiting projection"}>
        {crudEnabled && <div className="admin-v2-toolbar"><button className="admin-v2-primary-button" type="button" onClick={openCreate} disabled={recoveryBlocked}>New campaign</button></div>}
        <form className="admin-v2-toolbar" onSubmit={(event) => { event.preventDefault(); setQuery({ page: 1 }); }}>
          <label className="admin-v2-search-label"><Search size={15} aria-hidden="true" /><span className="sr-only">Search campaigns</span><input className="admin-v2-search" value={query.Search} onChange={(event) => setQuery({ keyword: event.target.value, page: 1 })} placeholder="Search title or description" /></label>
          <select className="admin-v2-search" value={searchParams.get("status") ?? ""} onChange={(event) => setQuery({ status: event.target.value, page: 1 })} aria-label="Filter campaign status"><option value="">All statuses</option><option value="NotStarted">Not started</option><option value="Active">Active</option><option value="Stopped">Stopped</option><option value="Completed">Completed</option></select>
          <label className="admin-v2-search-label"><span>From</span><input className="admin-v2-search" type="date" value={searchParams.get("start") ?? ""} onChange={(event) => setQuery({ start: event.target.value, page: 1 })} /></label>
          <label className="admin-v2-search-label"><span>To</span><input className="admin-v2-search" type="date" value={searchParams.get("end") ?? ""} onChange={(event) => setQuery({ end: event.target.value, page: 1 })} /></label>
          <select className="admin-v2-search" value={query.SortBy} onChange={(event) => setQuery({ sort: event.target.value, page: 1 })} aria-label="Sort campaigns"><option value="CreatedTime">Newest</option><option value="ClickCount">Most clicks</option></select>
        </form>
        {hasPartialDateRange && <AdminV2State title="Complete date range required">The advertising API applies its date filter only when both From and To are selected.</AdminV2State>}
        {hasInvalidDateRange && <AdminV2State title="Date range is invalid" tone="danger">From must be on or before To. Adjust the dates before relying on this projection.</AdminV2State>}
        {listState.status === "loading" && <AdminV2State title="Loading campaigns">Fetching the requested campaign page…</AdminV2State>}
        {listState.status === "error" && <AdminV2State title="Advertising unavailable" tone="danger">The server did not return the campaign projection. No empty state is shown for this failure.</AdminV2State>}
        {listState.status === "success" && adverts.length === 0 && <AdminV2State title={query.Search || query.Status || query.StartDate || query.EndDate ? "No matching campaigns" : "No campaigns"}>{query.Search || query.Status || query.StartDate || query.EndDate ? "Try changing the filters." : "The campaign projection is empty."}</AdminV2State>}
        {listState.status === "success" && adverts.length > 0 && <div className="admin-v2-table-wrap"><table className="admin-v2-table"><thead><tr><th>Campaign</th><th>Status</th><th>Schedule</th><th>Clicks</th><th>Created</th><th>Actions</th></tr></thead><tbody>
          {adverts.map((advert) => <tr key={advert.id}><td data-label="Campaign"><strong>{advert.title || "—"}</strong><div className="admin-v2-freshness">{advert.description || "No description"}</div></td><td data-label="Status"><AdminV2StatusBadge tone={statusTone(advert.status)}>{advert.status || "Unknown"}</AdminV2StatusBadge></td><td data-label="Schedule" className="admin-v2-mono">{advert.startDate ? dateFormat.format(new Date(advert.startDate)) : "—"} → {advert.endDate ? dateFormat.format(new Date(advert.endDate)) : "—"}</td><td data-label="Clicks" className="admin-v2-mono">{numberFormat.format(advert.clickCount ?? 0)}</td><td data-label="Created" className="admin-v2-mono">{advert.createdTime ? dateFormat.format(new Date(advert.createdTime)) : "—"}</td><td data-label="Actions"><div className="admin-v2-row-actions">{statusCommandEnabled && <button className="admin-v2-text-button" type="button" onClick={() => setPendingStatus({ advert, isActive: advert.status !== "Active", reason: "" })} disabled={recoveryBlocked}>{advert.status === "Active" ? "Stop" : "Activate"}</button>}{crudEnabled && <><button className="admin-v2-text-button" type="button" onClick={() => openEdit(advert)} disabled={recoveryBlocked}>Edit</button><button className="admin-v2-text-button admin-v2-text-button-danger" type="button" onClick={() => setPendingDelete({ advert, reason: "" })} disabled={recoveryBlocked}>Delete</button></>}{!statusCommandEnabled && !crudEnabled && "—"}</div></td></tr>)}
        </tbody></table></div>}
        {listState.status === "success" && totalPages > 1 && <AdminV2Pagination page={query.PageIndex} totalPages={totalPages} onPrevious={() => setQuery({ page: query.PageIndex - 1 })} onNext={() => setQuery({ page: query.PageIndex + 1 })} />}
    </AdminV2Panel>
    </>}
    {commandState.status === "success" && <AdminV2State title="Campaign command committed" tone="success">{commandState.message} Operation <span className="admin-v2-mono">{commandState.receipt?.operationId ?? "—"}</span>; audit <span className="admin-v2-mono">{commandState.receipt?.auditId ?? "—"}</span>.</AdminV2State>}
    {commandState.status === "error" && <AdminV2State title="Campaign command rejected" tone="danger">{commandState.message}</AdminV2State>}
    {recoveryBlocked && <AdminV2State title="Resolve the pending campaign command">The previous campaign command is still awaiting a durable result. Use the recovery panel before sending another campaign change.</AdminV2State>}
    {!statusCommandEnabled && !crudEnabled && <AdminV2State title="Campaign commands are not enabled">Create, edit, delete and status changes remain closed until the server capability projection exposes the audited commands.</AdminV2State>}
    {crudEnabled && <AdminV2State title="Campaign metadata scope">CRUD accepts validated HTTPS media/redirect references and UTC timestamps. Provider upload and delivery remain outside this database command.</AdminV2State>}
    {pendingStatus && <AdminV2Modal open busy={commandState.status === "loading"} onClose={() => setPendingStatus(null)} className="admin-v2-dialog" labelledBy="admin-advertise-status-title">
      <h2 id="admin-advertise-status-title">Confirm campaign status</h2><p>Change <strong>{pendingStatus.advert.title || pendingStatus.advert.id}</strong> to <strong>{pendingStatus.isActive ? "ACTIVE" : "STOPPED"}</strong>. The server will enforce the campaign version and record an immutable operation audit.</p>
      <label className="admin-v2-search-label"><span>Reason</span><textarea data-initial-focus className="admin-v2-search" rows="3" maxLength="500" required value={pendingStatus.reason} onChange={(event) => setPendingStatus((value) => ({ ...value, reason: event.target.value }))} /></label>
      <div className="admin-v2-dialog-actions"><button className="admin-v2-text-button" type="button" onClick={() => setPendingStatus(null)} disabled={commandState.status === "loading"}>Cancel</button><button className="admin-v2-danger-button" type="button" onClick={requestStatus} disabled={commandState.status === "loading" || !pendingStatus.reason.trim()}>{commandState.status === "loading" ? "Applying…" : "Confirm"}</button></div>
    </AdminV2Modal>}
    {editor && <AdminV2Modal open busy={commandState.status === "loading"} onClose={() => setEditor(null)} className="admin-v2-command-dialog" labelledBy="admin-advertise-editor-title"><div className="admin-v2-command-heading"><h2 id="admin-advertise-editor-title">{editor.mode === "create" ? "Create campaign" : "Edit campaign"}</h2><button className="admin-v2-text-button" type="button" onClick={() => setEditor(null)} disabled={commandState.status === "loading"}>Close</button></div><p className="admin-v2-freshness">Enter absolute timestamps in your local browser; the command sends UTC and the server validates the range and version.</p><div className="admin-v2-form-grid"><label className="admin-v2-search-label"><span>Title</span><input data-initial-focus className="admin-v2-search" maxLength="200" required value={editor.form.Title} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, Title: event.target.value } }))} /></label><label className="admin-v2-search-label"><span>Description</span><textarea className="admin-v2-search" rows="3" maxLength="2000" required value={editor.form.Description} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, Description: event.target.value } }))} /></label><label className="admin-v2-search-label"><span>Image URL (HTTPS)</span><input className="admin-v2-search" type="url" required value={editor.form.ImageUrl} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, ImageUrl: event.target.value } }))} /></label><label className="admin-v2-search-label"><span>Redirect URL (HTTPS)</span><input className="admin-v2-search" type="url" required value={editor.form.RedirectUrl} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, RedirectUrl: event.target.value } }))} /></label><label className="admin-v2-search-label"><span>Starts</span><input className="admin-v2-search" type="datetime-local" required value={editor.form.StartDate} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, StartDate: event.target.value } }))} /></label><label className="admin-v2-search-label"><span>Ends</span><input className="admin-v2-search" type="datetime-local" required value={editor.form.EndDate} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, EndDate: event.target.value } }))} /></label>{editor.mode === "update" && <label className="admin-v2-search-label"><span>Reason</span><textarea className="admin-v2-search" rows="2" maxLength="500" required value={editor.form.Reason} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, Reason: event.target.value } }))} /></label>}<div className="admin-v2-dialog-actions"><button className="admin-v2-text-button" type="button" onClick={() => setEditor(null)} disabled={commandState.status === "loading"}>Cancel</button><button className="admin-v2-primary-button" type="button" onClick={submitEditor} disabled={commandState.status === "loading" || !editor.form.Title.trim() || !editor.form.Description.trim() || !editor.form.ImageUrl.trim() || !editor.form.RedirectUrl.trim() || !editor.form.StartDate || !editor.form.EndDate || (editor.mode === "update" && !editor.form.Reason.trim())}>{commandState.status === "loading" ? "Saving…" : "Confirm campaign"}</button></div></div></AdminV2Modal>}
    {pendingDelete && <AdminV2DangerConfirmation open busy={commandState.status === "loading"} title="Delete campaign" description={<><p>This soft-deletes <strong>{pendingDelete.advert.title || pendingDelete.advert.id}</strong> using the current campaign version.</p><label className="admin-v2-search-label"><span>Reason</span><textarea className="admin-v2-search" rows="3" maxLength="500" required value={pendingDelete.reason} onChange={(event) => setPendingDelete((value) => ({ ...value, reason: event.target.value }))} /></label></>} confirmLabel="Delete campaign" onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} />}
  </div>;
}
