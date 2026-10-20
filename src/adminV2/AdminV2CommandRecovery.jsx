import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cancelUnseenAdminCommandApi, getAdminCommandRecoveryApi } from "../services/admin";
import { AdminV2DangerConfirmation, AdminV2Panel, AdminV2StatusBadge } from "./AdminV2Primitives";
import { useAdminCommandRecovery } from "./useAdminCommandRecovery";
import { adminRecoveryJournal, recoveryResponseMatches, unseenRecoveryCanBeCancelled } from "./adminRecoveryJournal";
import { useAdminV2Capabilities } from "./AdminV2CapabilitiesContext";
import { invalidateAdminRecoveredCommand } from "./adminQueryClient";
import { useAdminLocale } from "./AdminV2LocaleContext";

const labels = {
  REPORT_REPLY: "Phản hồi báo cáo",
  REPORT_TYPE_CREATE: "Thêm loại báo cáo",
  REPORT_TYPE_UPDATE: "Sửa loại báo cáo",
  REPORT_TYPE_DELETE: "Xóa loại báo cáo",
  SET_ACCOUNT_LIFECYCLE: "Thay đổi vòng đời tài khoản",
  ACCOUNT_SET_ROLE: "Thay đổi quyền tài khoản",
  ADVERTISE_CREATE: "Tạo quảng cáo",
  ADVERTISE_UPDATE: "Sửa quảng cáo",
  ADVERTISE_DELETE: "Xóa quảng cáo",
  ADVERTISE_SET_STATUS: "Thay đổi trạng thái quảng cáo",
  BLOG_CREATE: "Tạo bài viết",
  BLOG_UPDATE: "Sửa bài viết",
  BLOG_DELETE: "Xóa bài viết",
  BLOG_SET_PUBLICATION: "Thay đổi xuất bản bài viết",
  RECEIPT_POLICY_CLONE: "Nhân bản chính sách hóa đơn",
  RECEIPT_POLICY_UPDATE_DRAFT: "Sửa bản nháp chính sách hóa đơn",
  RECEIPT_POLICY_PUBLISH: "Xuất bản chính sách hóa đơn",
  RECEIPT_POLICY_RETIRE: "Ngừng chính sách hóa đơn",
  RECEIPT_RULE_ADD: "Thêm quy tắc phân loại",
  RECEIPT_RULE_UPDATE: "Sửa quy tắc phân loại",
  RECEIPT_RULE_DEACTIVATE: "Tắt quy tắc phân loại",
  SYSTEM_CONFIG_CREATE: "Tạo cấu hình hệ thống",
  SYSTEM_CONFIG_UPDATE: "Cập nhật cấu hình hệ thống",
  SYSTEM_CONFIG_DELETE: "Xóa cấu hình hệ thống",
  SUBSCRIPTION_CREATE: "Tạo gói dịch vụ",
  SUBSCRIPTION_UPDATE: "Cập nhật gói dịch vụ",
  SUBSCRIPTION_DELETE: "Xóa gói dịch vụ",
  SUBSCRIPTION_SET_STATUS: "Thay đổi trạng thái gói",
};

export default function AdminV2CommandRecovery({ actor, onDisposition }) {
  const { t } = useAdminLocale();
  const recovery = useAdminCommandRecovery(actor);
  const capabilities = useAdminV2Capabilities();
  const enabled = capabilities?.status === "success" && capabilities.data?.actorUserId === actor
    && capabilities.data.modules?.some((module) => module.key === "admin.commands.recovery" && module.availability === "V2_READ" && module.actions?.includes("lookup"));
  const [result, setResult] = useState(null); const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const client = useQueryClient();
  const locator = recovery.locator;
  const visibleResult = result?.actor === actor && (!locator || result.key === locator.key) ? result : null;
  const dispositionEnabled = enabled && capabilities.data.modules?.some((module) => module.key === "admin.commands.disposition"
    && module.availability === "V2_COMMAND" && module.actions?.includes("cancel-unseen"));
  const lookup = async () => {
    if (!locator || busy || !enabled) return;
    const showResult = (value) => setResult({ ...value, actor, key: locator.key });
    setBusy(true); setResult(null);
    try {
      const response = await getAdminCommandRecoveryApi(locator);
      if (recoveryResponseMatches(locator, response) && adminRecoveryJournal.resolve(locator, response.receipt)) {
        showResult({ terminal: true, receipt: response.receipt, message: response.state === "COMMITTED" ? "Thao tác đã được lưu cùng lịch sử kiểm toán." : "Thao tác đã bị từ chối; không có thay đổi từ lần gửi này." });
        await invalidateAdminRecoveredCommand(client, actor, locator.action);
      } else if (adminRecoveryJournal.resolveDisposition(locator, response)) {
        showResult({ terminal: true, disposition: response.disposition, message: t("recovery.cancelled") });
        onDisposition?.();
        await invalidateAdminRecoveredCommand(client, actor, locator.action);
      } else showResult({ canCancelUnseen: unseenRecoveryCanBeCancelled(locator, response), message: response?.state === "PENDING" ? "Máy chủ chưa hoàn tất thao tác. Kiểm tra lại sau." : "Chưa xác định kết quả. Giữ thao tác này để tra cứu; chưa gửi một thao tác thay thế." });
    } catch (error) {
      showResult({ message: [401, 403].includes(error.response?.status) ? "Phiên hoặc quyền Admin không còn hợp lệ. Kết quả cũ vẫn được giữ tại máy chủ." : "Chưa thể xác minh kết quả. Thử tra cứu lại khi kết nối ổn định." });
    } finally { setBusy(false); }
  };
  const cancelUnseen = async () => {
    setConfirming(null);
    if (!locator || !confirming || !["actor", "action", "targetId", "key", "version"].every((field) => confirming[field] === locator[field])
        || busy || !dispositionEnabled || !visibleResult?.canCancelUnseen) return;
    setBusy(true);
    try {
      const response = await cancelUnseenAdminCommandApi(locator);
      if (adminRecoveryJournal.resolveDisposition(locator, response)) {
        setResult({ actor, key: locator.key, terminal: true, disposition: response.disposition, message: t("recovery.cancelled") });
        onDisposition?.();
        await invalidateAdminRecoveredCommand(client, actor, locator.action);
      } else if (recoveryResponseMatches(locator, response) && adminRecoveryJournal.resolve(locator, response.receipt)) {
        setResult({ actor, key: locator.key, terminal: true, receipt: response.receipt, message: t("recovery.acceptedBeforeCancel") });
        await invalidateAdminRecoveredCommand(client, actor, locator.action);
        onDisposition?.();
      } else setResult({ actor, key: locator.key, message: t("recovery.noDecision") });
    } catch {
      setResult({ actor, key: locator.key, message: t("recovery.cancelUnknown") });
    } finally { setBusy(false); }
  };
  if (!locator && !recovery.blocked && !visibleResult) return null;
  return <div className="admin-v2-recovery"><AdminV2Panel title="Kết quả thao tác" meta={locator ? labels[locator.action] : undefined}>
    <div role="status" aria-live="polite">
      {recovery.blocked && <p>Chưa thể đọc metadata phục hồi trong phiên này. Các thao tác báo cáo được giữ lại để tránh gửi trùng.</p>}
      {locator && <p>Có thao tác cần xác minh. Tra cứu kết quả trước khi gửi thay đổi mới. Nội dung phản hồi và dữ liệu biểu mẫu không được lưu để phục hồi sau tải lại trang.</p>}
      {locator && !enabled && <p>Máy chủ chưa xác nhận khả năng tra cứu trong phiên này. Thay đổi mới tiếp tục được giữ lại.</p>}
      {visibleResult && <p>{visibleResult.message}</p>}
      {visibleResult?.receipt && <p className="admin-v2-recovery-receipt"><AdminV2StatusBadge tone={visibleResult.receipt.status === "COMMITTED" ? "success" : "danger"}>{visibleResult.receipt.status}</AdminV2StatusBadge><span>Mã thao tác: {visibleResult.receipt.operationId}</span><span>Mã kiểm toán: {visibleResult.receipt.auditId}</span></p>}
      {visibleResult?.disposition && <p className="admin-v2-recovery-receipt"><AdminV2StatusBadge>{t("recovery.cancelledBadge")}</AdminV2StatusBadge><span>{t("recovery.decisionId", { id: visibleResult.disposition.operationId })}</span><span>{t("recovery.auditId", { id: visibleResult.disposition.auditId })}</span></p>}
    </div>
    {locator && <button type="button" className="admin-v2-primary-button" disabled={busy || !enabled} onClick={lookup}>{busy ? "Đang tra cứu…" : "Tra cứu kết quả"}</button>}
    {locator && visibleResult?.canCancelUnseen && dispositionEnabled && <button type="button" className="admin-v2-text-button" disabled={busy} onClick={() => setConfirming(locator)}>{t("recovery.cancelTitle")}</button>}
    {!locator && visibleResult?.terminal && <button type="button" className="admin-v2-text-button" onClick={() => setResult(null)}>Đóng kết quả</button>}
    <AdminV2DangerConfirmation open={Boolean(confirming)} title={t("recovery.cancelTitle")} description={t("recovery.cancelDescription")} confirmLabel={t("recovery.cancelConfirm")} busy={busy} onCancel={() => setConfirming(null)} onConfirm={() => void cancelUnseen()} />
  </AdminV2Panel></div>;
}
