import { useEffect, useRef } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAdminReportContentApi, getAdminReportDetailApi } from "../services/admin";
import { adminQueryKey } from "./adminQueryClient";
import { AdminV2Panel, AdminV2StatusBadge } from "./AdminV2Primitives";
import { AdminV2State } from "./AdminV2State";
import { ADMIN_REPORT_PAGE_SIZE, inspectAdminReportContent, verifyAdminReportContentPage } from "./adminReportContent";

const dateFormat = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });

export default function AdminV2ReportDossier({ actorId, reportId, enabled, replyEnabled, onReply, onClose }) {
  const headingRef = useRef(null);
  const detail = useQuery({ queryKey: adminQueryKey(actorId, "report-detail", { reportId }),
    queryFn: ({ signal }) => getAdminReportDetailApi(reportId, { signal }), enabled: Boolean(enabled && reportId) });
  const report = detail.data?.report;
  const content = useInfiniteQuery({
    queryKey: adminQueryKey(actorId, "report-content", { reportId, version: report?.version, contentLength: detail.data?.contentLength }),
    queryFn: async ({ pageParam, signal }) => verifyAdminReportContentPage(
      await getAdminReportContentApi(reportId, { Offset: pageParam, Limit: ADMIN_REPORT_PAGE_SIZE, ExpectedVersion: report.version }, { signal }),
      reportId, report.version, detail.data.contentLength, pageParam),
    enabled: Boolean(enabled && report?.version), initialPageParam: 0,
    getNextPageParam: (last) => last.nextOffset ?? undefined,
    refetchOnWindowFocus: false, refetchOnReconnect: false, retry: false,
  });
  let inspected = { content: "", complete: false }; let invalidContent = false;
  if (content.data) {
    try { inspected = inspectAdminReportContent(content.data.pages, reportId, report?.version, detail.data?.contentLength); }
    catch { invalidContent = true; }
  }
  const reloadDossier = async () => {
    const refreshed = await detail.refetch();
    // A new version starts its own content query; an unchanged dossier must
    // also retry the failed pages instead of leaving the review stuck.
    if (!refreshed.isError && refreshed.data?.report?.version === report?.version
        && refreshed.data?.contentLength === detail.data?.contentLength) await content.refetch();
  };
  useEffect(() => {
    const previous = document.activeElement;
    headingRef.current?.focus(); headingRef.current?.scrollIntoView({ block: "start" });
    return () => { if (previous instanceof HTMLElement && previous.isConnected) previous.focus(); };
  }, []);
  return <section aria-label="Hồ sơ báo cáo">
    <h2 className="admin-v2-editor-heading" ref={headingRef} tabIndex={-1}>Hồ sơ báo cáo</h2>
    <AdminV2Panel title={report?.title || "Chi tiết báo cáo"} meta={detail.data?.asOf ? `Cập nhật ${dateFormat.format(new Date(detail.data.asOf))}` : undefined}>
      <div className="admin-v2-row-actions"><button className="admin-v2-text-button" type="button" onClick={onClose}>Đóng hồ sơ</button><button className="admin-v2-text-button" type="button" onClick={() => void reloadDossier()} disabled={detail.isFetching || content.isFetching}>Tải lại hồ sơ</button></div>
      {detail.isPending && <AdminV2State title="Đang tải báo cáo">Đang lấy hồ sơ được cấp quyền…</AdminV2State>}
      {detail.isError && <AdminV2State title="Không đọc được báo cáo" tone="danger">Báo cáo có thể đã bị xóa hoặc phiên đăng nhập không còn quyền đọc. Thử tải lại hồ sơ.</AdminV2State>}
      {detail.isSuccess && report && <>
        <div className="admin-v2-toolbar"><AdminV2StatusBadge tone={report.status === "PENDING" ? "warning" : report.status === "REJECTED" ? "danger" : "success"}>{report.status}</AdminV2StatusBadge><span>{report.reporterName} · {report.reportTypeName}</span><span className="admin-v2-freshness">Phiên bản {report.version}</span></div>
        <h3 className="admin-v2-editor-heading">Nội dung báo cáo</h3>
        {content.isPending && <AdminV2State title="Đang tải nội dung">Nội dung được tải theo từng phần…</AdminV2State>}
        {content.data && !invalidContent && !content.isError && <p className="admin-v2-report-content">{inspected.content || "Báo cáo không có nội dung."}</p>}
        {(content.isError || invalidContent) && <AdminV2State title="Chưa đọc hết nội dung" tone="danger">Báo cáo có thể đã thay đổi. Tải lại hồ sơ để đọc một phiên bản nhất quán.</AdminV2State>}
        {content.hasNextPage && !content.isError && !invalidContent && <button className="admin-v2-text-button" type="button" onClick={() => void content.fetchNextPage()} disabled={content.isFetchingNextPage}>{content.isFetchingNextPage ? "Đang tải…" : "Đọc phần tiếp theo"}</button>}
        {report.hasAttachment && <p className="admin-v2-editor-help">Báo cáo có tệp đính kèm. Chức năng xem tệp đang được hoàn thiện.</p>}
        {detail.data.reply && <><h3 className="admin-v2-editor-heading">Phản hồi đã lưu</h3><p className="admin-v2-report-content">{detail.data.reply}</p><p className="admin-v2-freshness">{detail.data.replyAt ? dateFormat.format(new Date(detail.data.replyAt)) : ""}</p></>}
        {replyEnabled && report.status === "PENDING" && <div className="admin-v2-dialog-actions"><button className="admin-v2-primary-button" type="button" onClick={() => onReply(report)} disabled={detail.isFetching || content.isFetching || content.isPending || content.isError || invalidContent || !inspected.complete}>Soạn phản hồi</button></div>}
      </>}
    </AdminV2Panel>
  </section>;
}
