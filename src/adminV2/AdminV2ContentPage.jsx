import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, Globe, GlobeLock, Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getAdminBlogContentApi, getAdminBlogDetailApi, getAdminBlogListApi, getAdminBlogStatisticApi } from "../services/admin";
import { createAdminBlogApi, deleteAdminBlogApi, setAdminBlogPublicationApi, updateAdminBlogApi } from "../services/admin";
import { getDefaultCategoryApi } from "../services/category";
import { AdminV2PageHeader, AdminV2State } from "./AdminV2State";
import { AdminV2Modal, AdminV2Panel, AdminV2Pagination, AdminV2StatusBadge } from "./AdminV2Primitives";
import { useAdminV2Capabilities } from "./AdminV2CapabilitiesContext";
import { adminQueryKey, parseAdminLimit } from "./adminQueryClient";
import { adminCommandError, adminReceiptState } from "./adminCommandOutcome";
import { adminRecoveryJournal, resolveAdminRecovery } from "./adminRecoveryJournal";
import { useAdminCommandRecovery } from "./useAdminCommandRecovery";
import AdminV2BlogDossier from "./AdminV2BlogDossier";
import { collectAdminBlogSource } from "./adminBlogContent";
import { useAdminLocale } from "./AdminV2LocaleContext";

const numberFormat = new Intl.NumberFormat("vi-VN");
const dateFormat = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: "Asia/Ho_Chi_Minh" });

const emptyBlogForm = () => ({
  Title: "",
  ContentHtml: "",
  ContentJson: "{}",
  IsPublished: false,
  ThumbnailUrl: "",
  CategoryId: "",
  Reason: "",
});

const toBlogForm = (blog) => ({
  Title: blog?.title ?? "",
  ContentHtml: blog?.contentHtml ?? "",
  ContentJson: typeof blog?.contentJson === "string" ? blog.contentJson : JSON.stringify(blog?.contentJson ?? {}, null, 2),
  IsPublished: Boolean(blog?.isPublished),
  ThumbnailUrl: blog?.thumbnailUrl ?? "",
  CategoryId: blog?.category?.id ?? blog?.categoryId ?? "",
  Reason: "",
});

const capabilityAllows = (projection, action) => projection?.status === "success"
  && projection.data?.modules?.some((module) => module.key === "admin.content.mutate"
    && module.availability === "V2_COMMAND"
    && module.actions?.includes(action));

export default function AdminV2ContentPage() {
  const { t } = useAdminLocale();
  const capabilities = useAdminV2Capabilities();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => ({
    Search: searchParams.get("keyword") ?? "",
    Status: searchParams.get("status") || "All",
    IsAscending: false,
    PageIndex: /^[1-9]\d*$/.test(searchParams.get("page") ?? "1") ? Math.min(Number(searchParams.get("page") ?? 1), 1000) : 1,
    PageSize: parseAdminLimit(searchParams.get("size"), 20),
  }), [searchParams]);
  const [pendingPublication, setPendingPublication] = useState(null);
  const selectedBlogId = searchParams.get("blogId") || "";
  const [editor, setEditor] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [editorState, setEditorState] = useState({ status: "idle", message: "", receipt: null });
  const [publicationState, setPublicationState] = useState({ status: "idle", message: "", receipt: null });
  const commandAttemptRef = useRef(null);
  const actorId = capabilities?.data?.actorUserId;
  const recovery = useAdminCommandRecovery(actorId);
  const recoveryBlocked = recovery.blocked || Boolean(recovery.locator);
  useEffect(() => {
    if (!recovery.locator && !recovery.blocked) commandAttemptRef.current = null;
  }, [recovery.locator, recovery.blocked]);
  const readEnabled = capabilities?.status === "success" && capabilities.data?.modules?.some((module) => module.key === "admin.content.read" && ["V2_READ", "LEGACY_CONTRACT"].includes(module.availability));
  const publicationEnabled = capabilityAllows(capabilities, "publish");
  const createEnabled = capabilityAllows(capabilities, "create");
  const updateEnabled = capabilityAllows(capabilities, "update");
  const deleteEnabled = capabilityAllows(capabilities, "delete");
  const queryClient = useQueryClient();
  const listQuery = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "content", query),
    queryFn: ({ signal }) => getAdminBlogListApi(query, { signal }),
    enabled: Boolean(actorId && readEnabled),
  });
  const statsQuery = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "content-statistics"),
    queryFn: ({ signal }) => getAdminBlogStatisticApi({ signal }),
    enabled: Boolean(actorId && readEnabled),
    staleTime: 60_000,
  });
  const categoriesQuery = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "content-categories"),
    queryFn: ({ signal }) => getDefaultCategoryApi({ signal }),
    enabled: Boolean(actorId && (createEnabled || updateEnabled)),
    staleTime: 300_000,
  });
  const availableCategories = categoriesQuery.data?.items ?? [];
  const listState = { status: listQuery.isPending ? "loading" : listQuery.isError ? "error" : "success", data: listQuery.data ?? null };
  const statsState = { status: statsQuery.isPending ? "loading" : statsQuery.isError ? "error" : "success", data: statsQuery.data ?? null };
  const page = listState.data;
  const blogs = page?.items ?? [];
  const totalPages = page?.totalPages ?? (page?.totalItems ? Math.ceil(page.totalItems / query.PageSize) : 0);
  const openCreate = () => {
    if (recoveryBlocked) return;
    setEditor({ mode: "create", blog: null, form: emptyBlogForm() });
    setEditorState({ status: "idle", message: "", receipt: null });
  };
  const openEdit = async (blog) => {
    if (recoveryBlocked) return;
    setEditorState({ status: "loading", message: "Loading the authoritative post content…", receipt: null });
    try {
      const detail = await getAdminBlogDetailApi(blog.id);
      const [contentHtml, contentJson] = await Promise.all([
        collectAdminBlogSource(blog.id, detail.blog.version, "html", detail.htmlLength, getAdminBlogContentApi),
        collectAdminBlogSource(blog.id, detail.blog.version, "json", detail.jsonLength, getAdminBlogContentApi),
      ]);
      const authoritative = { ...detail.blog, contentHtml, contentJson };
      setEditor({ mode: "update", blog: authoritative, form: toBlogForm(authoritative) });
      setEditorState({ status: "idle", message: "", receipt: null });
    } catch (error) {
      setEditorState({ status: "error", message: error.response?.data?.message || "The post could not be loaded for editing.", receipt: null });
    }
  };
  const closeEditor = () => {
    if (editorState.status !== "loading") setEditor(null);
  };
  const submitEditor = async (event) => {
    event.preventDefault();
    if (!editor || recoveryBlocked) return;
    let contentJson;
    try {
      contentJson = JSON.parse(editor.form.ContentJson || "{}");
    } catch {
      setEditorState({ status: "error", message: "Content JSON must be valid JSON.", receipt: null });
      return;
    }
    const payload = { ...editor.form, ContentJson: contentJson };
    if (!commandAttemptRef.current) {
      const create = editor.mode === "create";
      const targetId = create ? actorId : editor.blog.id;
      const version = create ? "0" : String(editor.blog.version ?? "");
      if (!create && !/^[1-9]\d*$/.test(version)) {
        setEditorState({ status: "error", message: "This post has no concurrency version. Refresh the inventory before retrying.", receipt: null });
        return;
      }
      commandAttemptRef.current = { actorId, kind: "editor", locator: { actor: actorId, action: create ? "BLOG_CREATE" : "BLOG_UPDATE", targetId, key: crypto.randomUUID(), version } };
    }
    const attempt = commandAttemptRef.current;
    if (attempt.actorId !== actorId || attempt.kind !== "editor") return;
    setEditorState({ status: "loading", message: "Submitting the audited content command…", receipt: null });
    let sent = false;
    try {
      adminRecoveryJournal.reserve(attempt.locator);
      sent = true;
      const receipt = editor.mode === "create"
        ? await createAdminBlogApi(payload, { idempotencyKey: attempt.locator.key, expectedVersion: attempt.locator.version })
        : await updateAdminBlogApi(editor.blog.id, payload, { idempotencyKey: attempt.locator.key, expectedVersion: attempt.locator.version });
      const status = adminReceiptState(receipt);
      setEditorState({ status, message: status === "success" ? "Content command committed and recorded in the audit trail." : status === "error" ? "The content command was durably rejected." : "Chưa xác nhận hoàn tất. Tra cứu kết quả trước khi gửi thao tác khác.", receipt });
      if (status === "uncertain") { setEditor(null); return; }
      resolveAdminRecovery(attempt.locator, receipt);
      commandAttemptRef.current = null;
      setEditor(null);
      if (status !== "success") return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "content"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "content-statistics"] }),
      ]);
    } catch (error) {
      const result = sent ? adminCommandError(error) : { uncertain: false, message: "Không thể lưu metadata phục hồi. Thao tác chưa được gửi; hãy xử lý lệnh đang chờ trước." };
      setEditorState({ status: result.uncertain ? "uncertain" : "error", message: result.message, receipt: null });
      if (result.uncertain) { setEditor(null); return; }
      try { const current = adminRecoveryJournal.read(actorId); if (current?.key === attempt.locator.key) adminRecoveryJournal.clear(); } catch { /* fail closed */ }
      commandAttemptRef.current = null;
    }
  };
  const confirmDelete = async () => {
    if (!pendingDelete || recoveryBlocked) return;
    if (!commandAttemptRef.current) {
      const version = String(pendingDelete.blog.version ?? "");
      if (!/^[1-9]\d*$/.test(version)) {
        setEditorState({ status: "error", message: "This post has no concurrency version. Refresh the inventory before retrying.", receipt: null });
        return;
      }
      commandAttemptRef.current = { actorId, kind: "delete", locator: { actor: actorId, action: "BLOG_DELETE", targetId: pendingDelete.blog.id, key: crypto.randomUUID(), version } };
    }
    const attempt = commandAttemptRef.current;
    setEditorState({ status: "loading", message: "Submitting the audited delete command…", receipt: null });
    let sent = false;
    try {
      adminRecoveryJournal.reserve(attempt.locator);
      sent = true;
      const receipt = await deleteAdminBlogApi(pendingDelete.blog.id, { reason: pendingDelete.reason }, { idempotencyKey: attempt.locator.key, expectedVersion: attempt.locator.version });
      const status = adminReceiptState(receipt);
      setEditorState({ status, message: status === "success" ? "The post was soft-deleted and recorded in the audit trail." : status === "error" ? "The delete command was durably rejected." : "Chưa xác nhận hoàn tất. Tra cứu kết quả trước khi gửi thao tác khác.", receipt });
      if (status === "uncertain") { setPendingDelete(null); return; }
      resolveAdminRecovery(attempt.locator, receipt);
      commandAttemptRef.current = null;
      setPendingDelete(null);
      if (status !== "success") return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "content"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "content-statistics"] }),
      ]);
    } catch (error) {
      const result = sent ? adminCommandError(error) : { uncertain: false, message: "Không thể lưu metadata phục hồi. Thao tác chưa được gửi; hãy xử lý lệnh đang chờ trước." };
      setEditorState({ status: result.uncertain ? "uncertain" : "error", message: result.message, receipt: null });
      if (result.uncertain) { setPendingDelete(null); return; }
      try { const current = adminRecoveryJournal.read(actorId); if (current?.key === attempt.locator.key) adminRecoveryJournal.clear(); } catch { /* fail closed */ }
      commandAttemptRef.current = null;
    }
  };
  const setQuery = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined || (key === "status" && value === "All")) next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next);
  };
  const submitPublication = async () => {
    if (!pendingPublication || recoveryBlocked) return;
    if (!pendingPublication.blog.version) {
      setPublicationState({ status: "error", message: "This post has no concurrency version. Refresh the inventory before retrying.", receipt: null });
      setPendingPublication(null);
      return;
    }
    if (!commandAttemptRef.current) commandAttemptRef.current = { actorId, kind: "publication", locator: { actor: actorId, action: "BLOG_SET_PUBLICATION", targetId: pendingPublication.blog.id, key: crypto.randomUUID(), version: String(pendingPublication.blog.version) } };
    const attempt = commandAttemptRef.current;
    if (attempt.actorId !== actorId || attempt.kind !== "publication") return;
    setPublicationState({ status: "loading", message: "", receipt: null });
    let sent = false;
    try {
      adminRecoveryJournal.reserve(attempt.locator);
      sent = true;
      const receipt = await setAdminBlogPublicationApi(pendingPublication.blog.id, { isPublished: pendingPublication.isPublished, reason: pendingPublication.reason }, { idempotencyKey: attempt.locator.key, expectedVersion: attempt.locator.version });
      const status = adminReceiptState(receipt);
      setPublicationState({ status, message: status === "success" ? "Publication state committed and recorded in the audit trail." : status === "error" ? "The publication command was durably rejected." : "Chưa xác nhận hoàn tất. Tra cứu kết quả trước khi gửi thao tác khác.", receipt });
      if (status === "uncertain") { setPendingPublication(null); return; }
      resolveAdminRecovery(attempt.locator, receipt);
      commandAttemptRef.current = null;
      setPendingPublication(null);
      if (status !== "success") return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "content"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "content-statistics"] }),
      ]);
    } catch (error) {
      const result = sent ? adminCommandError(error) : { uncertain: false, message: "Không thể lưu metadata phục hồi. Thao tác chưa được gửi; hãy xử lý lệnh đang chờ trước." };
      setPublicationState({ status: result.uncertain ? "uncertain" : "error", message: result.message, receipt: null });
      if (result.uncertain) { setPendingPublication(null); return; }
      try { const current = adminRecoveryJournal.read(actorId); if (current?.key === attempt.locator.key) adminRecoveryJournal.clear(); } catch { /* fail closed */ }
      commandAttemptRef.current = null;
      setPendingPublication(null);
    }
  };

  return <div className="admin-v2-content">
    <AdminV2PageHeader title="Content" description="Blog inventory with an audited publication command." />
    {!readEnabled && <AdminV2State title="Content projection is unavailable">The server has not enabled the content read contract for this session.</AdminV2State>}
    {readEnabled && <>
    {selectedBlogId && <AdminV2BlogDossier key={`${actorId}:${selectedBlogId}`} actorId={actorId} blogId={selectedBlogId} enabled={readEnabled} onClose={() => setQuery({ blogId: null })} />}
    <div className="admin-v2-toolbar">
      <span className="admin-v2-freshness">Content writes are server-gated and audited.</span>
      {createEnabled && <button className="admin-v2-primary-button" type="button" onClick={openCreate} disabled={recoveryBlocked}><Plus size={15} aria-hidden="true" /> New post</button>}
    </div>
    {statsState.status === "success" && <div className="admin-v2-metric-grid">
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><FileText size={15} aria-hidden="true" /> Total posts</div><div className="admin-v2-metric-value">{numberFormat.format(statsState.data.totalBlogs ?? 0)}</div></div>
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><Globe size={15} aria-hidden="true" /> Published</div><div className="admin-v2-metric-value">{numberFormat.format(statsState.data.publishedBlogs ?? 0)}</div></div>
      <div className="admin-v2-metric"><div className="admin-v2-metric-label"><GlobeLock size={15} aria-hidden="true" /> Private</div><div className="admin-v2-metric-value">{numberFormat.format(statsState.data.privateBlogs ?? 0)}</div></div>
      <div className="admin-v2-metric"><div className="admin-v2-metric-label">Projection</div><div className="admin-v2-metric-value">Server</div></div>
    </div>}
    {statsState.status === "error" && <AdminV2State title="Content metrics unavailable">The content list remains separate from the failed statistic projection.</AdminV2State>}
    <AdminV2Panel title="Blog inventory" meta={page ? `${page.totalItems ?? 0} total` : "Awaiting projection"}>
        <form className="admin-v2-toolbar" onSubmit={(event) => { event.preventDefault(); setQuery({ page: 1 }); }}>
          <label className="admin-v2-search-label"><Search size={15} aria-hidden="true" /><span className="sr-only">Search posts</span><input className="admin-v2-search" value={query.Search} onChange={(event) => setQuery({ keyword: event.target.value, page: 1 })} placeholder="Search post title" /></label>
          <select className="admin-v2-search" value={query.Status} onChange={(event) => setQuery({ status: event.target.value, page: 1 })} aria-label="Filter publication status"><option value="All">All statuses</option><option value="Published">Published</option><option value="Private">Private</option></select>
        </form>
        {listState.status === "loading" && <AdminV2State title="Loading posts">Fetching the requested content page…</AdminV2State>}
        {listState.status === "error" && <AdminV2State title="Content unavailable" tone="danger">The server did not return the content projection. No empty state is shown for this failure.</AdminV2State>}
        {listState.status === "success" && blogs.length === 0 && <AdminV2State title={query.Search || query.Status !== "All" ? "No matching posts" : "No posts"}>{query.Search || query.Status !== "All" ? "Try changing the filters." : "The content projection is empty."}</AdminV2State>}
        {listState.status === "success" && blogs.length > 0 && <div className="admin-v2-table-wrap"><table className="admin-v2-table"><thead><tr><th>Title</th><th>Category</th><th>Publication</th><th>Updated</th></tr></thead><tbody>
          {blogs.map((blog) => <tr key={blog.id}><td data-label="Title"><button type="button" className="admin-v2-text-button" onClick={() => setQuery({ blogId: blog.id })} aria-label={`${t("blog.inspect")}: ${blog.title}`}>{blog.title || "—"}</button></td><td data-label="Category">{blog.category?.name || "—"}</td><td data-label="Publication"><AdminV2StatusBadge tone={blog.isPublished ? "success" : "warning"}>{blog.isPublished ? "Published" : "Private"}</AdminV2StatusBadge><div className="admin-v2-row-actions">{publicationEnabled && <button className="admin-v2-text-button" type="button" onClick={() => setPendingPublication({ blog, isPublished: !blog.isPublished, reason: "" })} disabled={recoveryBlocked}>{blog.isPublished ? "Unpublish" : "Publish"}</button>}{updateEnabled && <button className="admin-v2-text-button" type="button" onClick={() => openEdit(blog)} disabled={recoveryBlocked}><SquarePen size={14} aria-hidden="true" /> Edit</button>}{deleteEnabled && <button className="admin-v2-text-button admin-v2-text-button-danger" type="button" onClick={() => setPendingDelete({ blog, reason: "" })} disabled={recoveryBlocked}><Trash2 size={14} aria-hidden="true" /> Delete</button>}</div></td><td data-label="Updated" className="admin-v2-mono">{blog.lastUpdatedTime ? dateFormat.format(new Date(blog.lastUpdatedTime)) : "—"}</td></tr>)}
        </tbody></table></div>}
        {listState.status === "success" && totalPages > 1 && <AdminV2Pagination page={query.PageIndex} totalPages={totalPages} onPrevious={() => setQuery({ page: query.PageIndex - 1 })} onNext={() => setQuery({ page: query.PageIndex + 1 })} />}
    </AdminV2Panel>
    </>}
    {publicationState.status === "success" && <AdminV2State title="Publication command committed" tone="success">{publicationState.message} Operation <span className="admin-v2-mono">{publicationState.receipt?.operationId ?? "—"}</span>; audit <span className="admin-v2-mono">{publicationState.receipt?.auditId ?? "—"}</span>.</AdminV2State>}
    {publicationState.status === "error" && <AdminV2State title="Publication command rejected" tone="danger">{publicationState.message}</AdminV2State>}
    {recoveryBlocked && <AdminV2State title="Resolve the pending content command">The previous content command is still awaiting a durable result. Use the recovery panel before sending another change.</AdminV2State>}
    {editorState.status === "success" && <AdminV2State title="Content command committed" tone="success">{editorState.message} Operation <span className="admin-v2-mono">{editorState.receipt?.operationId ?? "—"}</span>; audit <span className="admin-v2-mono">{editorState.receipt?.auditId ?? "—"}</span>.</AdminV2State>}
    {editorState.status === "error" && !editor && <AdminV2State title="Content command rejected" tone="danger">{editorState.message}</AdminV2State>}
    {!publicationEnabled && <AdminV2State title="Publication command is not enabled">Publish and unpublish remain closed until the server capability projection confirms the audited V2 command.</AdminV2State>}
    {editor && <AdminV2Modal open busy={editorState.status === "loading"} onClose={closeEditor} className="admin-v2-command-dialog" labelledBy="admin-blog-editor-title"><div className="admin-v2-command-heading"><h2 id="admin-blog-editor-title">{editor.mode === "create" ? "Create post" : "Edit post"}</h2><button className="admin-v2-text-button" type="button" onClick={closeEditor} disabled={editorState.status === "loading"}>Close</button></div><form className="admin-v2-form-grid" onSubmit={submitEditor}><label className="admin-v2-search-label"><span>Title</span><input className="admin-v2-search" maxLength="255" required value={editor.form.Title} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, Title: event.target.value } }))} /></label><label className="admin-v2-search-label"><span>Category</span><select className="admin-v2-search" required value={editor.form.CategoryId} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, CategoryId: event.target.value } }))}><option value="">Select category</option>{availableCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="admin-v2-search-label"><span>Thumbnail HTTPS URL</span><input className="admin-v2-search" type="url" required value={editor.form.ThumbnailUrl} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, ThumbnailUrl: event.target.value } }))} /></label><label className="admin-v2-search-label"><span>HTML content</span><textarea className="admin-v2-search" rows="7" required value={editor.form.ContentHtml} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, ContentHtml: event.target.value } }))} /></label><label className="admin-v2-search-label"><span>Content JSON</span><textarea className="admin-v2-search admin-v2-mono" rows="7" required value={editor.form.ContentJson} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, ContentJson: event.target.value } }))} /></label><label className="admin-v2-search-label"><span>Reason (optional)</span><textarea className="admin-v2-search" rows="3" maxLength="500" value={editor.form.Reason} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, Reason: event.target.value } }))} /></label><label className="admin-v2-search-label"><span><input type="checkbox" checked={editor.form.IsPublished} onChange={(event) => setEditor((value) => ({ ...value, form: { ...value.form, IsPublished: event.target.checked } }))} /> Publish after save</span></label>{editorState.status === "error" && <AdminV2State title="Validation or command error" tone="danger">{editorState.message}</AdminV2State>}<div className="admin-v2-dialog-actions"><button className="admin-v2-text-button" type="button" onClick={closeEditor} disabled={editorState.status === "loading"}>Cancel</button><button className="admin-v2-primary-button" type="submit" disabled={editorState.status === "loading"}>{editorState.status === "loading" ? "Saving…" : "Save post"}</button></div></form></AdminV2Modal>}
    {pendingDelete && <AdminV2Modal open busy={editorState.status === "loading"} onClose={() => setPendingDelete(null)} className="admin-v2-dialog" labelledBy="admin-blog-delete-title"><h2 id="admin-blog-delete-title">Delete post</h2><p>This soft-deletes “{pendingDelete.blog.title || pendingDelete.blog.id}” and records the reason. The server still requires the current version.</p><label className="admin-v2-search-label"><span>Reason</span><textarea className="admin-v2-search" rows="3" maxLength="500" required value={pendingDelete.reason} onChange={(event) => setPendingDelete((value) => ({ ...value, reason: event.target.value }))} /></label><div className="admin-v2-dialog-actions"><button className="admin-v2-text-button" type="button" onClick={() => setPendingDelete(null)} disabled={editorState.status === "loading"}>Cancel</button><button className="admin-v2-danger-button" type="button" onClick={confirmDelete} disabled={editorState.status === "loading" || !pendingDelete.reason.trim()}>{editorState.status === "loading" ? "Deleting…" : "Delete post"}</button></div></AdminV2Modal>}
    {pendingPublication && <AdminV2Modal open busy={publicationState.status === "loading"} onClose={() => setPendingPublication(null)} className="admin-v2-dialog" labelledBy="admin-blog-publication-title"><h2 id="admin-blog-publication-title">{pendingPublication.isPublished ? "Publish post" : "Unpublish post"}</h2><p>{pendingPublication.blog.title || pendingPublication.blog.id}</p><label className="admin-v2-search-label"><span>Reason (optional)</span><textarea className="admin-v2-search" rows="3" maxLength="500" value={pendingPublication.reason} onChange={(event) => setPendingPublication((value) => ({ ...value, reason: event.target.value }))} /></label><div className="admin-v2-dialog-actions"><button className="admin-v2-text-button" type="button" onClick={() => setPendingPublication(null)} disabled={publicationState.status === "loading"}>Cancel</button><button className="admin-v2-danger-button" type="button" onClick={submitPublication} disabled={publicationState.status === "loading"}>{publicationState.status === "loading" ? "Applying…" : "Confirm"}</button></div></AdminV2Modal>}
  </div>;
}
