import { createRoot } from "react-dom/client";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthContext } from "../../src/contexts/AuthSessionContext.js";
import { instance } from "../../src/services/instance";
import AdminV2Layout from "../../src/adminV2/AdminV2Layout";
import AdminV2ContentPage from "../../src/adminV2/AdminV2ContentPage";
import adminRoute from "../../src/routes/route/adminRoute";
import { adminNavigation } from "../../src/adminV2/adminNavigation";
import "../../src/index.css";

const actor = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const mode = new URLSearchParams(window.location.search).get("mode");
const html = mode === "unsafe" ? "<script>synthetic()</script>" : "<h2>Bản nháp kiểm thử 😀</h2><p>Đọc đầy đủ và rà soát trước khi xuất bản.</p>";
const json = JSON.stringify({ body: "Dữ liệu giả 😀" });
const blog = { id: actor, title: "Bản nháp kiểm thử 😀", version: "1", isPublished: false, thumbnailUrl: "https://example.test/image.png", category: { id: actor, name: "Kiểm thử", isActive: true }, lastUpdatedTime: "2026-10-13T00:00:00Z" };
instance.defaults.adapter = async (config) => {
  if (config.method !== "get") throw new Error("Synthetic fixture rejects all writes");
  let data;
  if (config.url === "/admin/capabilities") data = { actorUserId: actor, modules: adminNavigation.map((item) => ({ key: item.capability, actions: ["read"], risk: item.risk, availability: "V2_READ" })) };
  else if (config.url === "/admin/content/blogs") data = { items: [blog], totalItems: 1, totalPages: 1 };
  else if (config.url === `/admin/content/blogs/${actor}`) data = { blog, htmlLength: [...html].length, jsonLength: [...json].length, previewHtml: mode === "unsafe" ? null : html, previewIssue: mode === "unsafe" ? "ADMIN_BLOG_HTML_UNSAFE" : null };
  else if (config.url === `/admin/content/blogs/${actor}/content`) {
    if (mode === "stale") throw new Error("Synthetic stale version");
    const field = config.params.Field; const source = field === "html" ? html : json; const start = config.params.Offset; const end = Math.min(start + config.params.Limit, [...source].length);
    data = { blogId: actor, field, content: [...source].slice(start, end).join(""), offset: start, nextOffset: end < [...source].length ? end : null, contentLength: [...source].length, version: "1" };
  }
  else if (config.url === "/admin-statistic/blog") data = { totalBlogs: 0, publishedBlogs: 0, privateBlogs: 0 };
  else throw new Error("Unexpected synthetic route");
  return { status: 200, headers: {}, config, data };
};
const entries = { list: "/admin/blogs", create: "/admin/blogs/create", detail: "/admin/blogs/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" };
const selected = new URLSearchParams(window.location.search).get("entry") ?? "list";
export function Target() {
  const location = useLocation();
  return <><p role="status" className="admin-v2-freshness">Dữ liệu giả · {location.pathname} · Không gọi backend</p><AdminV2ContentPage /></>;
}
createRoot(document.getElementById("root")).render(<AuthContext.Provider value={{ auth: { userId: actor, roleName: "Admin", fullName: "Người quản trị kiểm thử" }, logout: async () => {} }}>
  <MemoryRouter initialEntries={[entries[selected] ?? entries.list]}><Routes>
    <Route path="/admin">{adminRoute.map((route) => <Route key={route.path} {...route} />)}</Route>
    <Route path="/admin-v2" element={<AdminV2Layout />}><Route path="content" element={<Target />} /></Route>
  </Routes></MemoryRouter>
</AuthContext.Provider>);
