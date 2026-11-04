import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getAdminReportTypesApi, getAdminReportTypeApi, createAdminReportTypeApi, updateAdminReportTypeApi, deleteAdminReportTypeApi } from "../services/admin";
import { AdminV2Panel, AdminV2StatusBadge, AdminV2DangerConfirmation } from "./AdminV2Primitives";
import { AdminV2State } from "./AdminV2State";
import { useAdminV2Capabilities } from "./AdminV2CapabilitiesContext";
import { adminQueryKey } from "./adminQueryClient";
import { adminCommandError, adminReceiptState } from "./adminCommandOutcome";
import { adminRecoveryJournal, resolveAdminRecovery } from "./adminRecoveryJournal";
import { useAdminCommandRecovery } from "./useAdminCommandRecovery";

export default function AdminV2ReportTypesPanel({ onBusyChange }) {
  const capabilities = useAdminV2Capabilities();
  const actor = capabilities?.data?.actorUserId;
  const modules = capabilities?.data?.modules ?? [];
  const readEnabled = modules.some((m) => m.key === "admin.report-types.read" && m.availability === "V2_READ");
  const commandsEnabled = modules.some((m) => m.key === "admin.report-types.crud" && m.availability === "V2_COMMAND" && ["create", "update", "delete"].every((action) => m.actions?.includes(action)));
  const [params, setParams] = useSearchParams();
  const filters = { Keyword: params.get("typeKeyword") || undefined, IncludeDeleted: params.get("typeArchived") === "true", Cursor: params.get("typeCursor") || undefined, Limit: 25 };
  const selected = params.get("typeId") || "";
  const client = useQueryClient();
  const [draft, setDraft] = useState(null);
  const [result, setResult] = useState({ status: "idle" });
  const [confirming, setConfirming] = useState(false);
  const intent = useRef(null); const sending = useRef(false); const editor = useRef(null);
  const recovery = useAdminCommandRecovery(actor);
  const recoveryBlocked = recovery.blocked || Boolean(recovery.locator && recovery.locator.key !== intent.current?.options.idempotencyKey);
  const frozen = result.status === "loading" || result.status === "uncertain" || recoveryBlocked;
  useEffect(() => {
    const resolved = recovery.resolution;
    if (!resolved || resolved.locator.key !== intent.current?.options.idempotencyKey || resolved.locator.actor !== actor) return;
    const status = adminReceiptState(resolved.receipt);
    intent.current = null; setResult({ status, receipt: resolved.receipt, message: status === "success" ? "Thay đổi đã được lưu cùng lịch sử kiểm toán." : "Máy chủ đã từ chối thao tác." });
    if (status === "success") setDraft(null);
  }, [recovery.resolution, actor]);
  const list = useQuery({ queryKey: adminQueryKey(actor, "report-types", filters), queryFn: ({ signal }) => getAdminReportTypesApi(filters, { signal }), enabled: Boolean(actor && readEnabled) });
  const detail = useQuery({ queryKey: adminQueryKey(actor, "report-type", selected), queryFn: ({ signal }) => getAdminReportTypeApi(selected, { signal }), enabled: Boolean(actor && readEnabled && selected) });
  useEffect(() => { onBusyChange?.(frozen || Boolean(draft)); return () => onBusyChange?.(false); }, [frozen, draft, onBusyChange]);
  useEffect(() => {
    if (!frozen) return undefined;
    const preventLoss = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", preventLoss); return () => window.removeEventListener("beforeunload", preventLoss);
  }, [frozen]);
  const draftMode = draft?.mode;
  const draftTarget = draft?.target?.id;
  useEffect(() => { if (draftMode) editor.current?.focus(); }, [draftTarget, draftMode]);
  const change = (values) => {
    const next = new URLSearchParams(params);
    Object.entries(values).forEach(([key, value]) => { if (value === undefined || value === "") next.delete(key); else next.set(key, String(value)); });
    setParams(next);
  };
  const start = (mode, target = null) => { if (recoveryBlocked) return; intent.current = null; setResult({ status: "idle" }); setDraft({ mode, target, name: target?.name ?? "", description: target?.description ?? "" }); };
  const submit = async () => {
    if (!draft || sending.current || !commandsEnabled || recoveryBlocked) return;
    if (!intent.current) intent.current = { actor, mode: draft.mode, id: draft.target?.id,
      payload: { name: draft.name.trim(), description: draft.description.trim() || null },
      options: { idempotencyKey: crypto.randomUUID(), expectedVersion: draft.target?.version } };
    const attempt = intent.current;
    if (attempt.actor !== actor) return;
    const locator = { actor, action: `REPORT_TYPE_${attempt.mode.toUpperCase()}`, targetId: attempt.id ?? null, key: attempt.options.idempotencyKey, version: attempt.options.expectedVersion ?? "0" };
    try { adminRecoveryJournal.reserve(locator); }
    catch { setResult({ status: "uncertain", message: "Chưa thể lưu metadata phục hồi. Thao tác chưa được gửi; kiểm tra khả năng lưu trữ của phiên." }); return; }
    sending.current = true; setConfirming(false); setResult({ status: "loading" });
    try {
      const receipt = attempt.mode === "create" ? await createAdminReportTypeApi(attempt.payload, attempt.options)
        : attempt.mode === "update" ? await updateAdminReportTypeApi(attempt.id, attempt.payload, attempt.options) : await deleteAdminReportTypeApi(attempt.id, attempt.options);
      const status = resolveAdminRecovery(locator, receipt) ? adminReceiptState(receipt) : "uncertain";
      setResult({ status, receipt, message: status === "success" ? "Thay đổi đã được lưu cùng lịch sử kiểm toán." : "Chưa xác nhận được kết quả thay đổi." });
      if (status !== "uncertain") intent.current = null;
      if (status === "success") {
        setDraft(null);
        await Promise.all(["report-types", "report-type", "reports", "report-detail"].map((name) => client.invalidateQueries({ queryKey: ["admin-v2", actor, name] })));
      }
    } catch (error) {
      const receipt = error.response?.data?.details;
      const resolved = resolveAdminRecovery(locator, receipt);
      const outcome = adminCommandError(error);
      if (resolved) intent.current = null;
      setResult({ status: resolved ? "error" : "uncertain", receipt: resolved ? receipt : null, message: resolved ? outcome.message : "Chưa xác định kết quả. Tra cứu hoặc thử lại cùng thao tác; chưa gửi thay đổi mới." });
    } finally { sending.current = false; }
  };
  if (!readEnabled) return <AdminV2State title="Danh mục chưa khả dụng">Không thể tải loại báo cáo trong phiên hiện tại.</AdminV2State>;
  const current = detail.data;
  return <div className="admin-v2-report-types">
    <AdminV2Panel title="Loại báo cáo" meta={list.data ? `${list.data.items.length} loại trên trang` : "Đang tải"}>
      <div className="admin-v2-toolbar">
        <label className="admin-v2-search-label"><span id="admin-type-search-label">Tìm theo tên</span><input aria-labelledby="admin-type-search-label" className="admin-v2-search" maxLength={100} value={filters.Keyword ?? ""} onChange={(event) => change({ typeKeyword: event.target.value, typeCursor: undefined })} /></label>
        <label><input type="checkbox" checked={filters.IncludeDeleted} onChange={(event) => change({ typeArchived: event.target.checked ? "true" : undefined, typeCursor: undefined })} /> Gồm loại đã xóa</label>
        <button type="button" className="admin-v2-primary-button" disabled={!commandsEnabled || Boolean(draft) || recoveryBlocked} onClick={() => start("create")}>Thêm loại báo cáo</button>
      </div>
      {list.isPending && <AdminV2State title="Đang tải danh mục">Đang lấy loại báo cáo…</AdminV2State>}
      {list.isError && <AdminV2State title="Không tải được danh mục" tone="danger"><button className="admin-v2-text-button" type="button" onClick={() => void list.refetch()}>Tải lại</button></AdminV2State>}
      {list.isSuccess && !list.data.items.length && <AdminV2State title="Không có loại báo cáo">Thử đổi bộ lọc hoặc thêm loại khi có quyền.</AdminV2State>}
      {list.isSuccess && list.data.items.length > 0 && <div className="admin-v2-table-wrap"><table className="admin-v2-table"><thead><tr><th>Tên</th><th>Trạng thái</th><th>Đã sử dụng</th><th>Phiên bản</th></tr></thead><tbody>
        {list.data.items.map((type) => <tr key={type.id}><td data-label="Tên"><button type="button" className="admin-v2-text-button" onClick={() => change({ typeId: type.id })}>{type.name}</button></td><td data-label="Trạng thái"><AdminV2StatusBadge>{type.isDeleted ? "Đã xóa" : "Đang dùng"}</AdminV2StatusBadge></td><td data-label="Đã sử dụng">{type.hasReports ? "Có báo cáo" : "Chưa có báo cáo"}</td><td data-label="Phiên bản" className="admin-v2-mono">{type.version}</td></tr>)}
      </tbody></table></div>}
      {list.isSuccess && <div className="admin-v2-pagination"><span className="admin-v2-freshness">Danh sách theo trang</span><div className="admin-v2-pagination-actions"><button type="button" className="admin-v2-text-button" disabled={!filters.Cursor} onClick={() => change({ typeCursor: undefined })}>Trang đầu</button><button type="button" className="admin-v2-text-button" disabled={!list.data.hasMore} onClick={() => change({ typeCursor: list.data.nextCursor })}>Trang tiếp</button></div></div>}
    </AdminV2Panel>
    {selected && <AdminV2Panel title="Chi tiết loại báo cáo" meta={current ? `Phiên bản ${current.version}` : "Đang tải"}>
      {detail.isPending && <AdminV2State title="Đang tải chi tiết" />}
      {detail.isError && <AdminV2State title="Không tải được chi tiết" tone="danger"><button className="admin-v2-text-button" type="button" onClick={() => void detail.refetch()}>Tải lại</button></AdminV2State>}
      {current && <><h3>{current.name}</h3><AdminV2StatusBadge>{current.isDeleted ? "Đã xóa" : "Đang dùng"}</AdminV2StatusBadge><p className="admin-v2-report-content">{current.description || "Chưa có mô tả."}</p><p className="admin-v2-mono">{current.id}</p><p>{current.hasReports ? "Đã có báo cáo sử dụng loại này; không thể xóa." : "Chỉ xóa được loại chưa có báo cáo sử dụng."}</p><div className="admin-v2-dialog-actions"><button type="button" className="admin-v2-text-button" disabled={!commandsEnabled || current.isDeleted || Boolean(draft) || recoveryBlocked} onClick={() => start("update", current)}>Chỉnh sửa loại</button><button type="button" className="admin-v2-danger-button" disabled={!commandsEnabled || current.isDeleted || current.hasReports || Boolean(draft) || recoveryBlocked} onClick={() => start("delete", current)}>Xóa loại chưa sử dụng</button><button type="button" className="admin-v2-text-button" disabled={frozen} onClick={() => change({ typeId: undefined })}>Đóng chi tiết</button></div></>}
    </AdminV2Panel>}
    {!commandsEnabled && <AdminV2State title="Thay đổi danh mục chưa khả dụng">Bạn vẫn có thể xem danh mục và chi tiết loại báo cáo.</AdminV2State>}
    {result.status === "success" && <AdminV2State title="Đã lưu thay đổi" tone="success">{result.message} <span className="admin-v2-mono">{result.receipt.operationId}</span></AdminV2State>}
    {result.status === "error" && <AdminV2State title="Thay đổi bị từ chối" tone="danger">{result.message} Đóng biểu mẫu và tải lại dữ liệu trước khi sửa.</AdminV2State>}
    {draft && <AdminV2Panel title={draft.mode === "create" ? "Thêm loại báo cáo" : draft.mode === "update" ? "Chỉnh sửa loại báo cáo" : "Xóa loại chưa sử dụng"}>
      <form onSubmit={(event) => { event.preventDefault(); if (result.status === "uncertain") void submit(); else setConfirming(true); }}>
        <h3 ref={editor} tabIndex={-1}>{draft.target?.name || "Loại mới"}</h3>
        {draft.target && <p className="admin-v2-mono">{draft.target.id} · Phiên bản {draft.target.version}</p>}
        {draft.mode !== "delete" && <fieldset disabled={frozen} className="admin-v2-editor-fields"><div className="admin-v2-form-grid">
          <label className="admin-v2-search-label"><span id="admin-type-name-label">Tên loại</span><input aria-labelledby="admin-type-name-label" className="admin-v2-search" required maxLength={255} value={draft.name} onChange={(event) => setDraft((value) => ({ ...value, name: event.target.value }))} /></label>
          <label className="admin-v2-search-label"><span id="admin-type-description-label">Mô tả</span><textarea aria-labelledby="admin-type-description-label" className="admin-v2-search" rows={3} maxLength={500} value={draft.description} onChange={(event) => setDraft((value) => ({ ...value, description: event.target.value }))} /></label>
        </div></fieldset>}
        {draft.mode === "delete" && <p>Loại sẽ được đánh dấu đã xóa. Lịch sử được giữ lại; các báo cáo hiện hữu không bị xóa.</p>}
        {result.status === "uncertain" && <AdminV2State title="Cần kiểm tra kết quả">{result.message} Giữ nguyên thao tác để kiểm tra lại.</AdminV2State>}
        <div className="admin-v2-dialog-actions"><button type="button" className="admin-v2-text-button" disabled={frozen} onClick={() => setDraft(null)}>Đóng biểu mẫu</button><button type="submit" className={draft.mode === "delete" ? "admin-v2-danger-button" : "admin-v2-primary-button"} disabled={result.status === "loading" || !draft.name.trim()}>{result.status === "loading" ? "Đang lưu…" : result.status === "uncertain" ? "Kiểm tra lại cùng thao tác" : "Kiểm tra thay đổi"}</button></div>
      </form>
    </AdminV2Panel>}
    <AdminV2DangerConfirmation open={confirming} title="Xác nhận thay đổi loại báo cáo" description={draft ? <>{draft.mode === "delete" ? "Xóa loại chưa sử dụng: " : draft.mode === "create" ? "Tạo loại: " : "Cập nhật loại: "}<strong>{draft.name}</strong><br />{draft.target?.id || "Loại mới"}{draft.target ? ` · Phiên bản ${draft.target.version}` : ""}<br />{draft.mode !== "delete" && draft.description}</> : ""} confirmLabel={draft?.mode === "delete" ? "Xóa loại" : "Lưu thay đổi"} cancelLabel="Quay lại" busy={result.status === "loading"} onCancel={() => setConfirming(false)} onConfirm={() => void submit()} />
  </div>;
}
