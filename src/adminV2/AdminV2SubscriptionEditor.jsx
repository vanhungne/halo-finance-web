import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { createAdminSubscriptionApi, deleteAdminSubscriptionApi, getAdminSubscriptionApi, getAdminSubscriptionCatalogOptionsApi, setAdminSubscriptionStatusApi, updateAdminSubscriptionApi } from "../services/admin";
import { useAdminV2Capabilities } from "./AdminV2CapabilitiesContext";
import { adminQueryKey } from "./adminQueryClient";
import { AdminV2DangerConfirmation, AdminV2Panel, AdminV2StatusBadge } from "./AdminV2Primitives";
import { AdminV2State } from "./AdminV2State";
import { buildSubscriptionPayload, formatSubscriptionVnd, subscriptionCommandError } from "./subscriptionCatalog";
import { adminReceiptState } from "./adminCommandOutcome";
import { adminRecoveryJournal, resolveAdminRecovery } from "./adminRecoveryJournal";

const featureLabels = {
  ManualExpenseTracking: "Ghi chi tiêu thủ công", BasicAnalysis: "Phân tích cơ bản", CsvImportExport: "Nhập và xuất CSV", MultiCurrency: "Nhiều loại tiền", BlogAccess: "Đọc bài viết", LightTheme: "Giao diện sáng",
  ReceiptScan: "Quét hóa đơn", VoiceInput: "Nhập bằng giọng nói", ChatInput: "Nhập qua hội thoại", BudgetLimit: "Ngân sách", SavingsGoalLimit: "Mục tiêu tiết kiệm", CategoryLimit: "Danh mục", PushNotifications: "Thông báo", BudgetAlerts: "Cảnh báo ngân sách", BasicForecast: "Dự báo cơ bản", DarkTheme: "Giao diện tối",
  UnlimitedReceiptScan: "Quét hóa đơn không giới hạn", PersonalizedAdvice: "Tư vấn cá nhân", UnlimitedBudget: "Ngân sách không giới hạn", UnlimitedSavingsGoal: "Mục tiêu tiết kiệm không giới hạn",
};
const titleForMode = { view: "Chi tiết gói dịch vụ", create: "Tạo gói dịch vụ", edit: "Chỉnh sửa thông tin gói", delete: "Xóa gói chưa sử dụng", status: "Thay đổi trạng thái bán" };

export default function AdminV2SubscriptionEditor({ selection, onClose, onCommitted, onBusyChange }) {
  const capabilities = useAdminV2Capabilities();
  const actorId = capabilities?.data?.actorUserId;
  const readEnabled = capabilities?.status === "success" && capabilities.data?.modules?.some((module) => module.key === "admin.subscriptions.read" && module.availability === "V2_READ");
  const optionsQuery = useQuery({ queryKey: adminQueryKey(actorId ?? "anonymous", "subscription-options"), queryFn: ({ signal }) => getAdminSubscriptionCatalogOptionsApi({ signal }), enabled: Boolean(actorId && readEnabled && selection.mode === "create"), refetchOnWindowFocus: false, refetchOnReconnect: false });
  const detailQuery = useQuery({ queryKey: adminQueryKey(actorId ?? "anonymous", "subscription-detail", { id: selection.id }), queryFn: ({ signal }) => getAdminSubscriptionApi(selection.id, { signal }), enabled: Boolean(actorId && readEnabled && selection.mode !== "create"), staleTime: 0, refetchOnWindowFocus: false, refetchOnReconnect: false });
  const source = selection.mode === "create" ? optionsQuery : detailQuery;
  return <AdminV2Panel title={titleForMode[selection.mode]} className="admin-v2-subscription-editor-panel">
    {!readEnabled ? <AdminV2State title="Chưa có quyền đọc danh mục" tone="danger">Quyền đọc gói dịch vụ chưa được máy chủ xác nhận.</AdminV2State>
      : source.isPending || source.isFetching ? <AdminV2State title="Đang tải dữ liệu">Đang lấy thông tin mới nhất từ máy chủ…</AdminV2State>
        : source.isError ? <AdminV2State title="Không tải được gói dịch vụ" tone="danger" action={<button type="button" className="admin-v2-text-button" onClick={() => source.refetch()}>Thử tải lại</button>}>Gói có thể đã bị xóa hoặc phiên đăng nhập không còn quyền truy cập.</AdminV2State>
          : <SubscriptionForm key={`${actorId}:${selection.mode}:${selection.id ?? "new"}`} actorId={actorId} selection={selection} plan={detailQuery.data} options={optionsQuery.data} onClose={onClose} onCommitted={onCommitted} onBusyChange={onBusyChange} />}
    {(source.isPending || source.isError || !readEnabled) && <button type="button" className="admin-v2-text-button" onClick={onClose}>Đóng</button>}
  </AdminV2Panel>;
}

function SubscriptionForm({ actorId, selection, plan, options, onClose, onCommitted, onBusyChange }) {
  const { mode } = selection;
  const capabilities = useAdminV2Capabilities();
  const action = mode === "edit" ? "update" : mode === "status" ? (plan?.isActive ? "retire" : "activate") : mode;
  const capabilityKey = mode === "status" ? "admin.subscriptions.mutate" : "admin.subscriptions.crud";
  const commandEnabled = capabilities?.status === "success" && capabilities.data?.actorUserId === actorId && capabilities.data.modules?.some((module) => module.key === capabilityKey && module.availability === "V2_COMMAND" && module.actions?.includes(action));
  const [form, setForm] = useState(() => ({ name: plan?.name ?? "", description: plan?.description ?? "", features: plan?.features?.join("\n") ?? "", price: plan?.price ?? "", durationInDays: String(plan?.durationInDays ?? 30), featurePermissions: [], reason: "", isActive: !plan?.isActive }));
  const [state, setState] = useState({ status: "idle", message: "", receipt: null });
  const [confirming, setConfirming] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const attemptRef = useRef(null);
  const sendingRef = useRef(false);
  const mountedRef = useRef(true);
  const headingRef = useRef(null);
  const locked = state.status === "loading" || state.status === "uncertain" || state.status === "success";
  const availableFeatures = options?.featureTypes?.filter((type) => !form.featurePermissions.some((permission) => permission.featureType === type)) ?? [];
  useEffect(() => { mountedRef.current = true; headingRef.current?.focus(); return () => { mountedRef.current = false; }; }, []);
  useEffect(() => { onBusyChange(state.status === "loading" || state.status === "uncertain"); }, [onBusyChange, state.status]);
  useEffect(() => {
    if (state.status !== "loading" && state.status !== "uncertain") return undefined;
    const preventLoss = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", preventLoss);
    return () => window.removeEventListener("beforeunload", preventLoss);
  }, [state.status]);
  const setField = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const updatePermission = (type, changes) => setForm((current) => ({ ...current, featurePermissions: current.featurePermissions.map((permission) => permission.featureType === type ? { ...permission, ...changes } : permission) }));
  const submit = async () => {
    if (sendingRef.current || !commandEnabled || mode === "view") return;
    let attempt = attemptRef.current;
    if (!attempt) {
      try {
        if (mode !== "create" && !/^\d+$/.test(plan?.version ?? "")) throw new Error("Gói chưa có phiên bản hợp lệ. Hãy tải lại dữ liệu.");
        const idempotencyKey = crypto.randomUUID();
        const expectedVersion = mode === "create" ? "0" : String(plan?.version ?? "");
        const actionName = mode === "create" ? "SUBSCRIPTION_CREATE" : mode === "edit" ? "SUBSCRIPTION_UPDATE" : mode === "delete" ? "SUBSCRIPTION_DELETE" : "SUBSCRIPTION_SET_STATUS";
        attempt = {
          payload: buildSubscriptionPayload(mode, form, options), idempotencyKey, expectedVersion,
          locator: { actor: actorId, action: actionName, targetId: mode === "create" ? null : plan?.id, key: idempotencyKey, version: expectedVersion },
        };
        attemptRef.current = attempt;
      } catch (error) { setState({ status: "error", message: error.message, receipt: null }); return; }
    }
    sendingRef.current = true;
    onBusyChange(true);
    setConfirming(false);
    setState({ status: "loading", message: "Đang gửi thao tác…", receipt: null });
    let sent = false;
    try {
      adminRecoveryJournal.reserve(attempt.locator);
      sent = true;
      const receipt = mode === "create" ? await createAdminSubscriptionApi(attempt.payload, attempt)
        : mode === "edit" ? await updateAdminSubscriptionApi(plan.id, attempt.payload, attempt)
          : mode === "delete" ? await deleteAdminSubscriptionApi(plan.id, attempt.payload, attempt)
            : await setAdminSubscriptionStatusApi(plan.id, attempt.payload, attempt);
      if (!mountedRef.current) return;
      const outcome = adminReceiptState(receipt);
      if (outcome === "uncertain") {
        setState({ status: "uncertain", message: "Máy chủ chưa xác nhận hoàn tất. Kiểm tra lại cùng thao tác.", receipt: null });
        return;
      }
      resolveAdminRecovery(attempt.locator, receipt);
      attemptRef.current = null;
      setState({ status: outcome, message: outcome === "success" ? "Thao tác đã được ghi nhận." : "Máy chủ đã từ chối thao tác.", receipt });
      if (outcome === "success") onCommitted(receipt);
    } catch (error) {
      if (!mountedRef.current) return;
      const result = sent ? subscriptionCommandError(error) : { uncertain: false, message: "Không thể lưu metadata phục hồi. Thao tác chưa được gửi; hãy xử lý lệnh đang chờ trước." };
      if (!result.uncertain) {
        try {
          const current = adminRecoveryJournal.read(actorId);
          if (current && current.key === attempt.locator.key && current.action === attempt.locator.action) adminRecoveryJournal.clear();
        } catch { /* Storage failure remains fail-closed. */ }
        attemptRef.current = null;
      }
      setState({ status: result.uncertain ? "uncertain" : "error", message: result.message, receipt: null });
    } finally { sendingRef.current = false; }
  };
  const requestSubmit = (event) => { event.preventDefault(); if (mode === "delete" || mode === "status") setConfirming(true); else void submit(); };
  const readOnly = mode !== "create" && mode !== "edit";
  return <div className="admin-v2-subscription-editor">
    <h3 className="admin-v2-editor-heading" ref={headingRef} tabIndex={-1}>{mode === "create" ? "Thông tin và quyền của gói mới" : plan?.name}</h3>
    {mode !== "create" && <div className="admin-v2-subscription-summary"><span className="admin-v2-mono">{formatSubscriptionVnd(plan?.price)}</span><span>{plan?.durationInDays} ngày</span><AdminV2StatusBadge tone={plan?.isActive ? "success" : "neutral"}>{plan?.isActive ? "Đang bán" : "Ngừng bán"}</AdminV2StatusBadge><span className="admin-v2-freshness">Phiên bản {plan?.version}</span></div>}
    {mode === "edit" && <p className="admin-v2-editor-help">Giá, thời hạn và quyền tính năng được giữ nguyên để bảo vệ người đã đăng ký. Tạo gói mới khi cần thay đổi điều kiện dịch vụ.</p>}
    {mode === "delete" && <p className="admin-v2-editor-help">Chỉ xóa gói mới chưa từng được bán và chưa có lịch sử đăng ký. Các gói đã sử dụng cần được ngừng bán và giữ lại.</p>}
    {mode === "create" && <p className="admin-v2-editor-help">Gói mới được tạo ở trạng thái ngừng bán. Nhãn mô tả và quyền tính năng là hai phần riêng.</p>}
    <form onSubmit={requestSubmit}>
      {!readOnly && <fieldset disabled={locked || !commandEnabled} className="admin-v2-editor-fields">
        <div className="admin-v2-form-grid"><label className="admin-v2-search-label">Tên gói<input className="admin-v2-search" required maxLength={255} value={form.name} onChange={(event) => setField("name", event.target.value)} /></label>
          {mode === "create" && <>
            <label className="admin-v2-search-label"><span id="admin-subscription-price-label">Giá (VND)</span><input className="admin-v2-search admin-v2-mono" inputMode="numeric" pattern="[0-9]+" required value={form.price} onChange={(event) => setField("price", event.target.value)} aria-labelledby="admin-subscription-price-label" aria-describedby="admin-subscription-price-help" /><small id="admin-subscription-price-help">Số nguyên, tối đa {formatSubscriptionVnd(options?.maximumPrice)}.</small></label>
            <label className="admin-v2-search-label"><span id="admin-subscription-duration-label">Thời hạn (ngày)</span><input className="admin-v2-search" inputMode="numeric" pattern="[0-9]+" required value={form.durationInDays} onChange={(event) => setField("durationInDays", event.target.value)} aria-labelledby="admin-subscription-duration-label" aria-describedby="admin-subscription-duration-help" /><small id="admin-subscription-duration-help">{options?.minimumDurationInDays}–{options?.maximumDurationInDays} ngày.</small></label>
          </>}
        </div>
        <div className="admin-v2-form-grid"><label className="admin-v2-search-label">Mô tả<textarea className="admin-v2-search" rows={3} maxLength={500} value={form.description} onChange={(event) => setField("description", event.target.value)} /></label><label className="admin-v2-search-label">Nhãn tính năng<textarea className="admin-v2-search" rows={3} value={form.features} onChange={(event) => setField("features", event.target.value)} /><small>Mỗi dòng một nhãn. Nhãn không tự cấp quyền tính năng.</small></label></div>
        {mode === "create" && <><h3 className="admin-v2-editor-heading">Quyền tính năng</h3><div className="admin-v2-toolbar"><label className="admin-v2-search-label"><span id="admin-subscription-feature-label">Thêm quyền</span><select className="admin-v2-search" aria-labelledby="admin-subscription-feature-label" value={newFeature} onChange={(event) => setNewFeature(event.target.value)}><option value="">Chọn tính năng</option>{availableFeatures.map((type) => <option key={type} value={type}>{featureLabels[type] ?? type}</option>)}</select></label><button className="admin-v2-text-button" type="button" disabled={!newFeature || !availableFeatures.includes(newFeature)} onClick={() => { setField("featurePermissions", [...form.featurePermissions, { featureType: newFeature, isEnabled: true, maxLimit: "" }]); setNewFeature(""); }}><Plus size={15} aria-hidden="true" /> Thêm</button></div>
          {form.featurePermissions.length === 0 ? <p className="admin-v2-editor-help">Chưa chọn quyền tính năng cho gói này.</p> : <div className="admin-v2-subscription-grants">{form.featurePermissions.map((permission) => <div className="admin-v2-subscription-grant" key={permission.featureType}><label className="admin-v2-subscription-toggle"><input type="checkbox" checked={permission.isEnabled} onChange={(event) => updatePermission(permission.featureType, { isEnabled: event.target.checked })} />{featureLabels[permission.featureType] ?? permission.featureType}</label><label className="admin-v2-search-label">Giới hạn<input className="admin-v2-search" inputMode="numeric" pattern="[0-9]*" placeholder="Không đặt giới hạn" value={permission.maxLimit} onChange={(event) => updatePermission(permission.featureType, { maxLimit: event.target.value })} /></label><button type="button" className="admin-v2-icon-button" aria-label={`Bỏ quyền ${featureLabels[permission.featureType] ?? permission.featureType}`} onClick={() => setField("featurePermissions", form.featurePermissions.filter((item) => item.featureType !== permission.featureType))}><Trash2 size={15} aria-hidden="true" /></button></div>)}</div>}
        </>}
      </fieldset>}
      {mode === "view" && <><p className="admin-v2-editor-help">{plan?.description || "Gói chưa có mô tả."}</p><h3 className="admin-v2-editor-heading">Nhãn hiển thị</h3>{plan?.features?.length ? <ul className="admin-v2-subscription-labels">{plan.features.map((feature, index) => <li key={`${index}:${feature}`}>{feature}</li>)}</ul> : <p className="admin-v2-editor-help">Chưa có nhãn.</p>}</>}
      {mode !== "create" && <><h3 className="admin-v2-editor-heading">Quyền tính năng hiện tại</h3>{plan?.featurePermissions?.length ? <div className="admin-v2-table-wrap"><table className="admin-v2-table"><thead><tr><th>Tính năng</th><th>Quyền</th><th>Giới hạn</th></tr></thead><tbody>{plan.featurePermissions.map((permission) => <tr key={permission.featureType}><td data-label="Tính năng">{featureLabels[permission.featureType] ?? permission.featureType}</td><td data-label="Quyền">{permission.isEnabled ? "Được cấp" : "Không cấp"}</td><td data-label="Giới hạn" className="admin-v2-mono">{permission.maxLimit ?? "Không đặt giới hạn"}</td></tr>)}</tbody></table></div> : <p className="admin-v2-editor-help">Chưa có quyền tính năng.</p>}</>}
      {mode !== "view" && mode !== "create" && <div className="admin-v2-form-grid"><label className="admin-v2-search-label">Lý do (không bắt buộc)<textarea className="admin-v2-search" rows={2} maxLength={500} value={form.reason} disabled={locked || !commandEnabled} onChange={(event) => setField("reason", event.target.value)} /></label></div>}
      {state.status !== "idle" && <div aria-live="polite"><AdminV2State title={state.status === "success" ? "Đã hoàn tất" : state.status === "loading" ? "Đang xử lý" : state.status === "uncertain" ? "Cần kiểm tra kết quả" : "Chưa thực hiện được"} tone={state.status === "success" ? "success" : state.status === "error" ? "danger" : "neutral"}>{state.message}{state.receipt && <div className="admin-v2-freshness">Mã thao tác <span className="admin-v2-mono">{state.receipt.operationId}</span> · Audit <span className="admin-v2-mono">{state.receipt.auditId}</span></div>}</AdminV2State></div>}
      {mode !== "view" && !commandEnabled && <AdminV2State title="Thao tác chưa được mở">Máy chủ chưa xác nhận khả năng thực hiện thao tác này.</AdminV2State>}
      <div className="admin-v2-dialog-actions"><button className="admin-v2-text-button" type="button" onClick={onClose} disabled={state.status === "loading" || state.status === "uncertain"}>Đóng</button>{mode !== "view" && commandEnabled && state.status !== "success" && <button className={mode === "delete" ? "admin-v2-danger-button" : "admin-v2-primary-button"} type="submit" disabled={state.status === "loading"}>{state.status === "loading" ? "Đang xử lý…" : state.status === "uncertain" ? "Kiểm tra lại cùng thao tác" : mode === "create" ? "Tạo gói" : mode === "edit" ? "Lưu thông tin" : mode === "delete" ? "Xóa gói" : plan?.isActive ? "Ngừng bán" : "Mở bán"}</button>}</div>
    </form>
    <AdminV2DangerConfirmation open={confirming} title={mode === "delete" ? "Xóa gói dịch vụ?" : plan?.isActive ? "Ngừng bán gói?" : "Mở bán gói?"} description={`${plan?.name}. Máy chủ sẽ kiểm phiên bản và các điều kiện bảo vệ lịch sử trước khi thực hiện.`} confirmLabel={mode === "delete" ? "Xóa gói" : "Xác nhận"} cancelLabel="Quay lại" onCancel={() => setConfirming(false)} onConfirm={() => void submit()} />
  </div>;
}
