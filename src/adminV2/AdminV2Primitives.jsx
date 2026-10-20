import { useId } from "react";
import { AlertTriangle, CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import { AdminV2State } from "./AdminV2State";
import AdminV2Modal from "./AdminV2Modal";
import { useAdminLocale } from "./AdminV2LocaleContext";

export { default as AdminV2Modal } from "./AdminV2Modal";

/** Shared Admin V2 presentation primitives. They intentionally contain no data fetching or domain policy. */
export function AdminV2Panel({ title, meta, children, className = "" }) {
  return <section className={`admin-v2-panel ${className}`.trim()}>
    {(title || meta) && <header className="admin-v2-panel-header"><h2>{title}</h2>{meta && <span className="admin-v2-freshness">{meta}</span>}</header>}
    <div className="admin-v2-panel-body">{children}</div>
  </section>;
}

export function AdminV2StatusBadge({ children, tone = "neutral", icon = null }) {
  return <span className="admin-v2-status" data-tone={tone}>{icon}{children}</span>;
}

export function AdminV2AsyncState({ state, loadingTitle, loadingMessage, errorTitle, errorMessage }) {
  const { t } = useAdminLocale();
  if (state?.status === "loading") return <AdminV2State title={loadingTitle ?? t("common.loading")}><LoaderCircle className="admin-v2-spin" size={15} aria-hidden="true" /> {loadingMessage ?? t("common.fetching")}</AdminV2State>;
  if (state?.status === "error") return <AdminV2State title={errorTitle ?? t("common.unavailable")} tone="danger"><XCircle size={15} aria-hidden="true" /> {errorMessage ?? t("common.projectionError")}</AdminV2State>;
  return null;
}

export function AdminV2CommandResult({ state, successTitle, errorTitle, children }) {
  const { t } = useAdminLocale();
  if (state?.status === "success") return <AdminV2State title={successTitle ?? t("common.committed")} tone="success"><CheckCircle2 size={15} aria-hidden="true" /> {children ?? t("common.commitMessage")}</AdminV2State>;
  if (state?.status === "error") return <AdminV2State title={errorTitle ?? t("common.rejected")} tone="danger"><AlertTriangle size={15} aria-hidden="true" /> {state.message || t("common.rejectMessage")}</AdminV2State>;
  return null;
}

export function AdminV2DangerConfirmation({ open, title, description, confirmLabel, cancelLabel, busy = false, onCancel, onConfirm }) {
  const { t } = useAdminLocale();
  const id = useId();
  return <AdminV2Modal open={open} busy={busy} onClose={onCancel} className="admin-v2-dialog" role="alertdialog" labelledBy={`${id}-title`} describedBy={`${id}-description`}>
      <h2 id={`${id}-title`}>{title}</h2>
      <div id={`${id}-description`} className="admin-v2-dialog-copy">{description}</div>
      <div className="admin-v2-dialog-actions">
        <button data-initial-focus className="admin-v2-text-button" type="button" onClick={onCancel} disabled={busy}>{cancelLabel ?? t("common.cancel")}</button>
        <button className="admin-v2-danger-button" type="button" onClick={onConfirm} disabled={busy}>{busy ? t("common.applying") : confirmLabel ?? t("common.confirm")}</button>
      </div>
  </AdminV2Modal>;
}

export function AdminV2Pagination({ page, totalPages, onPrevious, onNext, hasMore }) {
  const { t } = useAdminLocale();
  const canPrevious = Number(page) > 1;
  const canNext = totalPages ? Number(page) < Number(totalPages) : Boolean(hasMore);
  return <div className="admin-v2-pagination"><span className="admin-v2-freshness">{totalPages ? t("pagination.page", { page, total: totalPages }) : t("pagination.cursor")}</span><div className="admin-v2-pagination-actions"><button className="admin-v2-icon-button" type="button" disabled={!canPrevious} onClick={onPrevious} aria-label={t("pagination.previous")}>‹</button><button className="admin-v2-icon-button" type="button" disabled={!canNext} onClick={onNext} aria-label={t("pagination.next")}>›</button></div></div>;
}
