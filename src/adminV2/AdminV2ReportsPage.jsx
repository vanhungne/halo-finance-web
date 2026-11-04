import { useEffect, useMemo, useRef, useState } from "react";
import { FileCheck2, FileWarning, Search } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getAdminReportListApi, getAdminReportStatisticApi, replyAdminReportApi } from "../services/admin";
import { AdminV2PageHeader, AdminV2State } from "./AdminV2State";
import { AdminV2DangerConfirmation, AdminV2Panel, AdminV2StatusBadge } from "./AdminV2Primitives";
import AdminV2ReportDossier from "./AdminV2ReportDossier";
import AdminV2ReportTypesPanel from "./AdminV2ReportTypesPanel";
import { adminCommandError, adminReceiptState } from "./adminCommandOutcome";
import { adminRecoveryJournal, resolveAdminRecovery } from "./adminRecoveryJournal";
import { useAdminCommandRecovery } from "./useAdminCommandRecovery";
import { useAdminV2Capabilities } from "./AdminV2CapabilitiesContext";
import { adminQueryKey, parseAdminLimit } from "./adminQueryClient";

const numberFormat = new Intl.NumberFormat("vi-VN");
const dateFormat = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: "Asia/Ho_Chi_Minh" });

export default function AdminV2ReportsPage() {
  const capabilities = useAdminV2Capabilities();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => ({
    Keyword: searchParams.get("keyword") ?? "",
    Status: searchParams.get("status") || undefined,
    HasReply: searchParams.get("reply") === "true" ? true : searchParams.get("reply") === "false" ? false : undefined,
    Cursor: searchParams.get("cursor") || undefined,
    Limit: parseAdminLimit(searchParams.get("size"), 20),
  }), [searchParams]);
  const [pendingReply, setPendingReply] = useState(null);
  const [replyState, setReplyState] = useState({ status: "idle", message: "", receipt: null });
  const [confirming, setConfirming] = useState(false);
  const [catalogBusy, setCatalogBusy] = useState(false);
  const attemptRef = useRef(null);
  const sendingRef = useRef(false);
  const selectedReportId = searchParams.get("reportId") || "";
  const actorId = capabilities?.data?.actorUserId;
  const recovery = useAdminCommandRecovery(actorId);
  const recoveryBlocked = recovery.blocked || Boolean(recovery.locator && recovery.locator.key !== attemptRef.current?.options.idempotencyKey);
  useEffect(() => {
    const resolved = recovery.resolution;
    if (!resolved || resolved.locator.key !== attemptRef.current?.options.idempotencyKey || resolved.locator.actor !== actorId) return;
    const status = adminReceiptState(resolved.receipt);
    attemptRef.current = null; setReplyState({ status, receipt: resolved.receipt, message: status === "success" ? "Phản hồi đã được lưu cùng lịch sử kiểm toán." : "Máy chủ đã từ chối phản hồi." });
    if (status === "success") setPendingReply(null);
  }, [recovery.resolution, actorId]);
  const readEnabled = capabilities?.status === "success" && capabilities.data?.modules?.some((module) => module.key === "admin.reports.read" && ["V2_READ", "LEGACY_CONTRACT"].includes(module.availability));
  const replyEnabled = capabilities?.status === "success" && capabilities.data?.modules?.some((module) => module.key === "admin.reports.reply" && module.availability === "V2_COMMAND" && module.actions?.includes("reply"));
  useEffect(() => {
    if (replyState.status !== "loading" && replyState.status !== "uncertain") return undefined;
    const preventLoss = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", preventLoss);
    return () => window.removeEventListener("beforeunload", preventLoss);
  }, [replyState.status]);
  const queryClient = useQueryClient();
  const listQuery = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "reports", query),
    queryFn: ({ signal }) => getAdminReportListApi(query, { signal }),
    enabled: Boolean(actorId && readEnabled),
  });
  const statsQuery = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "report-statistics"),
    queryFn: ({ signal }) => getAdminReportStatisticApi({ signal }),
    enabled: Boolean(actorId && readEnabled),
    staleTime: 60_000,
  });
  const listState = { status: listQuery.isPending ? "loading" : listQuery.isError ? "error" : "success", data: listQuery.data ?? null };
  const statsState = { status: statsQuery.isPending ? "loading" : statsQuery.isError ? "error" : "success", data: statsQuery.data ?? null };
  const page = listState.data;
  const reports = page?.items ?? [];
  const setQuery = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next);
  };
  const submitReply = async () => {
    if (!pendingReply || sendingRef.current || !replyEnabled || recoveryBlocked) return;
    if (!/^[1-9]\d*$/.test(pendingReply.report.version ?? "")) {
      setReplyState({ status: "error", message: "This report has no concurrency version. Refresh the queue before retrying.", receipt: null });
      return;
    }
    if (!attemptRef.current) attemptRef.current = {
      actorId, reportId: pendingReply.report.id, payload: { replyContent: pendingReply.replyContent, status: pendingReply.status },
      options: { idempotencyKey: crypto.randomUUID(), expectedVersion: pendingReply.report.version },
    };
    const attempt = attemptRef.current;
    if (attempt.actorId !== actorId) return;
    const locator = { actor: actorId, action: "REPORT_REPLY", targetId: attempt.reportId, key: attempt.options.idempotencyKey, version: attempt.options.expectedVersion };
    try { adminRecoveryJournal.reserve(locator); }
    catch { setReplyState({ status: "uncertain", message: "Chưa thể lưu metadata phục hồi. Phản hồi chưa được gửi; kiểm tra khả năng lưu trữ của phiên.", receipt: null }); return; }
    sendingRef.current = true;
    setConfirming(false);
    setReplyState({ status: "loading", message: "", receipt: null });
    try {
      const receipt = await replyAdminReportApi(attempt.reportId, attempt.payload, attempt.options);
      const status = resolveAdminRecovery(locator, receipt) ? adminReceiptState(receipt) : "uncertain";
      setReplyState({ status, message: status === "success" ? "Phản hồi đã được lưu cùng lịch sử kiểm toán." : status === "error" ? "Máy chủ đã từ chối phản hồi." : "Chưa xác nhận kết quả. Kiểm tra lại cùng thao tác.", receipt });
      if (status !== "uncertain") attemptRef.current = null;
      if (status !== "success") return;
      setPendingReply(null);
      await Promise.all(["reports", "report-detail", "report-content", "report-statistics"].map((name) => queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, name] })));
    } catch (error) {
      const receipt = error.response?.data?.details;
      const resolved = resolveAdminRecovery(locator, receipt);
      const result = adminCommandError(error);
      if (resolved) attemptRef.current = null;
      setReplyState({ status: resolved ? "error" : "uncertain", message: resolved ? result.message : "Chưa xác định kết quả. Tra cứu hoặc thử lại cùng thao tác; chưa gửi phản hồi mới.", receipt: resolved ? receipt : null });
    } finally { sendingRef.current = false; }
  };

  return <div className="admin-v2-content admin-v2-reports">
    <AdminV2PageHeader title="Reports & support" description="Báo cáo người dùng, hồ sơ chi tiết và phản hồi có kiểm tra phiên bản, quyền Admin và lịch sử kiểm toán." />
    {!readEnabled && <AdminV2State title="Reports projection is unavailable">The server has not enabled the reports read contract for this session.</AdminV2State>}
    {readEnabled && <>
    <div className="admin-v2-toolbar"><button type="button" className="admin-v2-text-button" aria-expanded={searchParams.get("catalog") === "types"} disabled={catalogBusy || replyState.status === "loading" || replyState.status === "uncertain"} onClick={() => setQuery({ catalog: searchParams.get("catalog") === "types" ? undefined : "types" })}>{searchParams.get("catalog") === "types" ? "Ẩn loại báo cáo" : "Quản lý loại báo cáo"}</button></div>
    {searchParams.get("catalog") === "types" && <AdminV2ReportTypesPanel onBusyChange={setCatalogBusy} />}
    {statsState.status === "success" && <div className="admin-v2-metric-grid">
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><FileWarning size={15} aria-hidden="true" /> Total reports</div><div className="admin-v2-metric-value">{numberFormat.format(statsState.data.totalReports ?? 0)}</div></div>
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><FileCheck2 size={15} aria-hidden="true" /> Resolved</div><div className="admin-v2-metric-value">{numberFormat.format(statsState.data.resolvedReports ?? 0)}</div></div>
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><FileWarning size={15} aria-hidden="true" /> Unresolved</div><div className="admin-v2-metric-value">{numberFormat.format(statsState.data.unresolvedReports ?? 0)}</div></div>
      <div className="admin-v2-metric"><div className="admin-v2-metric-label">Projection</div><div className="admin-v2-metric-value">Server</div></div>
    </div>}
    {statsState.status === "error" && <AdminV2State title="Report metrics unavailable">The report list remains separate from the failed statistic projection.</AdminV2State>}
    <AdminV2Panel title="Support queue" meta={page ? `${reports.length} shown` : "Awaiting projection"}>
        <form className="admin-v2-toolbar" onSubmit={(event) => { event.preventDefault(); setQuery({ cursor: undefined }); }}>
          <label className="admin-v2-search-label"><Search size={15} aria-hidden="true" /><span className="sr-only">Search reports</span><input className="admin-v2-search" maxLength={100} value={query.Keyword} onChange={(event) => setQuery({ keyword: event.target.value, cursor: undefined })} placeholder="Search report title" /></label>
          <select className="admin-v2-search" value={searchParams.get("status") ?? ""} onChange={(event) => setQuery({ status: event.target.value, cursor: undefined })} aria-label="Filter report status"><option value="">All statuses</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select>
        </form>
        {listState.status === "loading" && <AdminV2State title="Loading reports">Fetching the requested queue page…</AdminV2State>}
        {listState.status === "error" && <AdminV2State title="Reports unavailable" tone="danger">The server did not return the report projection. No empty state is shown for this failure.</AdminV2State>}
        {listState.status === "success" && reports.length === 0 && <AdminV2State title={query.Keyword || query.Status ? "No matching reports" : "No reports"}>{query.Keyword || query.Status ? "Try changing the filters." : "The report projection is empty."}</AdminV2State>}
        {listState.status === "success" && reports.length > 0 && <div className="admin-v2-table-wrap"><table className="admin-v2-table"><thead><tr><th>Title</th><th>Reporter</th><th>Type</th><th>Created</th><th>Status</th><th>Reply</th></tr></thead><tbody>
        {reports.map((report) => <tr key={report.id}><td data-label="Title"><button className="admin-v2-text-button" type="button" onClick={() => setQuery({ reportId: report.id })}>{report.title || "—"}</button></td><td data-label="Reporter">{report.reporterName || "—"}</td><td data-label="Type">{report.reportTypeName || "—"}</td><td data-label="Created" className="admin-v2-mono">{report.createdAt ? dateFormat.format(new Date(report.createdAt)) : "—"}</td><td data-label="Status"><AdminV2StatusBadge tone={report.status === "PENDING" ? "warning" : report.status === "REJECTED" ? "danger" : "success"}>{report.status || "Unknown"}</AdminV2StatusBadge></td><td data-label="Reply">{report.hasReply ? "Replied" : "Awaiting reply"}</td></tr>)}
        </tbody></table></div>}
        {listState.status === "success" && <div className="admin-v2-pagination"><span className="admin-v2-freshness">Danh sách theo trang</span><div className="admin-v2-pagination-actions"><button className="admin-v2-text-button" type="button" disabled={!query.Cursor} onClick={() => setQuery({ cursor: undefined })}>Trang đầu</button><button className="admin-v2-text-button" type="button" disabled={!page?.hasMore} onClick={() => setQuery({ cursor: page.nextCursor })}>Trang tiếp</button></div></div>}
    </AdminV2Panel>
    </>}
    {selectedReportId && readEnabled && <AdminV2ReportDossier key={selectedReportId} actorId={actorId} reportId={selectedReportId} enabled={readEnabled} replyEnabled={replyEnabled && !pendingReply && !recoveryBlocked} onClose={() => setQuery({ reportId: undefined })} onReply={(report) => { if (recoveryBlocked) return; setReplyState({ status: "idle", message: "", receipt: null }); setPendingReply({ report, replyContent: "", status: "APPROVED" }); }} />}
    {replyState.status === "success" && <AdminV2State title="Report reply committed" tone="success">{replyState.message} Operation <span className="admin-v2-mono">{replyState.receipt?.operationId ?? "—"}</span>; audit <span className="admin-v2-mono">{replyState.receipt?.auditId ?? "—"}</span>.</AdminV2State>}
    {replyState.status === "error" && <AdminV2State title="Report reply rejected" tone="danger">{replyState.message}</AdminV2State>}
    {!replyEnabled && <AdminV2State title="Reply command is not enabled">Reply actions remain closed until the server capability projection confirms the audited V2 command.</AdminV2State>}
    {pendingReply && <AdminV2Panel title={`Phản hồi: ${pendingReply.report.title}`} meta={`Phiên bản ${pendingReply.report.version}`}>
      <form onSubmit={(event) => { event.preventDefault(); if (replyState.status === "uncertain") void submitReply(); else setConfirming(true); }}>
        <fieldset className="admin-v2-editor-fields" disabled={replyState.status === "loading" || replyState.status === "uncertain"}>
          <div className="admin-v2-form-grid"><label className="admin-v2-search-label">Kết quả xử lý<select className="admin-v2-search" value={pendingReply.status} onChange={(event) => setPendingReply((value) => ({ ...value, status: event.target.value }))}><option value="APPROVED">Đã xử lý</option><option value="REJECTED">Từ chối</option></select></label><label className="admin-v2-search-label"><span id="admin-report-reply-label">Phản hồi</span><textarea aria-labelledby="admin-report-reply-label" className="admin-v2-search" rows={4} maxLength={500} required value={pendingReply.replyContent} onChange={(event) => setPendingReply((value) => ({ ...value, replyContent: event.target.value }))} /></label></div>
        </fieldset>
        {replyState.status === "uncertain" && <div aria-live="polite"><AdminV2State title="Cần kiểm tra kết quả">{replyState.message}</AdminV2State></div>}
        <div className="admin-v2-dialog-actions"><button className="admin-v2-text-button" type="button" onClick={() => setPendingReply(null)} disabled={replyState.status === "loading" || replyState.status === "uncertain"}>Hủy soạn</button><button className="admin-v2-primary-button" type="submit" disabled={replyState.status === "loading" || !pendingReply.replyContent.trim()}>{replyState.status === "loading" ? "Đang lưu…" : replyState.status === "uncertain" ? "Kiểm tra lại cùng thao tác" : "Kiểm tra và lưu phản hồi"}</button></div>
      </form>
    </AdminV2Panel>}
    <AdminV2DangerConfirmation open={confirming} title="Xác nhận phản hồi báo cáo" description={pendingReply ? <><strong>{pendingReply.report.title}</strong><br />{pendingReply.replyContent}<br />Kết quả: {pendingReply.status === "APPROVED" ? "Đã xử lý" : "Từ chối"}. Phản hồi được lưu cùng lịch sử kiểm toán; báo cáo không còn ở trạng thái chờ xử lý.</> : ""} confirmLabel="Lưu phản hồi" cancelLabel="Quay lại" busy={replyState.status === "loading"} onCancel={() => setConfirming(false)} onConfirm={() => void submitReply()} />
  </div>;
}
