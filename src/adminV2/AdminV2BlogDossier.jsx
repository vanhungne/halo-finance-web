import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAdminBlogContentApi, getAdminBlogDetailApi } from "../services/admin";
import { adminQueryKey } from "./adminQueryClient";
import { AdminV2Panel, AdminV2StatusBadge } from "./AdminV2Primitives";
import { AdminV2State } from "./AdminV2State";
import { useAdminLocale } from "./AdminV2LocaleContext";
import { adminBlogPreviewDocument } from "./adminBlogContent";

export default function AdminV2BlogDossier({ actorId, blogId, enabled, onClose }) {
  const { t } = useAdminLocale();
  const heading = useRef(null);
  const [field, setField] = useState("preview");
  const [tokens, setTokens] = useState({});
  const detail = useQuery({ queryKey: adminQueryKey(actorId, "blog-detail", { blogId }),
    queryFn: ({ signal }) => getAdminBlogDetailApi(blogId, { signal }), enabled: Boolean(enabled && blogId), retry: false });
  const blog = detail.isSuccess ? detail.data?.blog : null;
  const content = useInfiniteQuery({ queryKey: adminQueryKey(actorId, "blog-content", { blogId, version: blog?.version, field }),
    queryFn: ({ pageParam, signal }) => getAdminBlogContentApi(blogId, { Field: field, Offset: pageParam, Limit: 4000, ExpectedVersion: blog.version }, { signal }),
    enabled: Boolean(enabled && blog && field !== "preview"), initialPageParam: 0, getNextPageParam: (last) => last.nextOffset ?? undefined,
    refetchOnWindowFocus: false, refetchOnReconnect: false, retry: false });
  const reload = async () => {
    const result = await detail.refetch();
    if (!result.isError && result.data?.blog?.version === blog?.version && field !== "preview") void content.refetch();
  };
  useEffect(() => {
    const previous = document.activeElement; heading.current?.focus(); heading.current?.scrollIntoView({ block: "start" });
    return () => { if (previous instanceof HTMLElement && previous.isConnected) previous.focus(); };
  }, []);
  useEffect(() => {
    const update = () => {
      const style = getComputedStyle(document.documentElement);
      setTokens(Object.fromEntries(["surface", "text", "font-sans", "text-body", "space-3"].map((key) => [key, style.getPropertyValue(`--admin-${key}`)])));
    };
    update(); const observer = new MutationObserver(update); observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-admin-theme"] });
    return () => observer.disconnect();
  }, []);
  return <section aria-label={t("blog.dossier")} className="admin-v2-blog-dossier">
    <h2 className="admin-v2-editor-heading" ref={heading} tabIndex={-1}>{t("blog.dossier")}</h2>
    <AdminV2Panel title={blog?.title || t("blog.dossier")}>
      <div className="admin-v2-row-actions"><button type="button" className="admin-v2-text-button" onClick={onClose}>{t("blog.close")}</button><button type="button" className="admin-v2-text-button" onClick={() => void reload()} disabled={detail.isFetching}>{t("blog.reload")}</button></div>
      {detail.isPending && <AdminV2State title={t("common.loading")}>{t("blog.loading")}</AdminV2State>}
      {detail.isError && <AdminV2State title={t("blog.error")} tone="danger">{t("blog.errorHelp")}</AdminV2State>}
      {blog && <>
        <div className="admin-v2-toolbar"><AdminV2StatusBadge tone={blog.isPublished ? "success" : "warning"}>{t(blog.isPublished ? "blog.published" : "blog.private")}</AdminV2StatusBadge><span>{blog.category?.name}</span><span className="admin-v2-mono">{t("blog.version", { version: blog.version })}</span></div>
        <div className="admin-v2-row-actions" role="group" aria-label={t("blog.dossier")}>{["preview", "html", "json"].map((value) => <button key={value} type="button" className="admin-v2-text-button" aria-pressed={field === value} onClick={() => setField(value)}>{t(`blog.${value}`)}</button>)}</div>
        {field === "preview" && <><p>{t("blog.previewHelp")}</p>{detail.data.previewHtml == null ? <AdminV2State title={t("blog.review")} tone="warning" />
          : <iframe className="admin-v2-blog-preview" title={t("blog.preview")} sandbox="" referrerPolicy="no-referrer" srcDoc={adminBlogPreviewDocument(detail.data.previewHtml, tokens)} />}</>}
        {field !== "preview" && <>
          {content.isPending && <AdminV2State title={t("common.loading")}>{t("blog.loading")}</AdminV2State>}
          {content.isError && <AdminV2State title={t("blog.error")} tone="danger">{t("blog.errorHelp")}</AdminV2State>}
          {content.isSuccess && <><pre className="admin-v2-report-content">{content.data.pages.map((page) => page.content).join("")}</pre>{content.hasNextPage && <button type="button" className="admin-v2-text-button" disabled={content.isFetchingNextPage} onClick={() => void content.fetchNextPage()}>{t(content.isFetchingNextPage ? "common.fetching" : "blog.loadMore")}</button>}</>}
        </>}
      </>}
    </AdminV2Panel>
  </section>;
}
