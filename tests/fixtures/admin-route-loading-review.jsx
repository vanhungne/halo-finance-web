import { lazy, useState } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "../../src/contexts/AuthSessionContext.js";
import { instance } from "../../src/services/instance";
import AdminV2Layout from "../../src/adminV2/AdminV2Layout";
import AdminV2RouteView from "../../src/adminV2/AdminV2RouteView";
import { adminNavigation } from "../../src/adminV2/adminNavigation";
import "../../src/index.css";

const actor = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
instance.defaults.adapter = async (config) => {
  if (config.url !== "/admin/capabilities") throw new Error("Unexpected synthetic route");
  return { status: 200, headers: {}, config, data: { actorUserId: actor, modules:
    adminNavigation.map((item) => ({ key: item.capability, actions: ["read"], risk: item.risk, availability: "V2_READ" })) } };
};

export function ReadyPage() { return <div className="admin-v2-content"><p>Đã tải trang giả thành công.</p></div>; }
let completeLoad;
const SlowPage = lazy(() => new Promise((resolve) => { completeLoad = () => resolve({ default: ReadyPage }); }));
const FailedPage = lazy(() => Promise.reject(new Error("Synthetic chunk failure")));
const pages = { ready: ReadyPage, slow: SlowPage, failed: FailedPage };

export function ReviewControls() {
  const [selected, setSelected] = useState("ready");
  return <><div className="admin-v2-content"><h1>Kiểm thử tải route · Dữ liệu giả</h1><div className="admin-v2-dialog-actions">
    <button type="button" className="admin-v2-text-button" onClick={() => setSelected("slow")}>Mở trang tải chậm</button>
    <button type="button" className="admin-v2-text-button" onClick={() => completeLoad?.()}>Hoàn tất tải giả</button>
    <button type="button" className="admin-v2-text-button" onClick={() => setSelected("failed")}>Mở trang tải lỗi</button>
    <button type="button" className="admin-v2-text-button" onClick={() => setSelected("ready")}>Chuyển sang trang tốt</button>
  </div></div><AdminV2RouteView page={pages[selected]} routeId={selected} /></>;
}
createRoot(document.getElementById("root")).render(<AuthContext.Provider value={{ auth: { userId: actor, roleName: "Admin", fullName: "Người quản trị kiểm thử" }, logout: async () => {} }}>
  <MemoryRouter initialEntries={["/admin-v2"]}><Routes><Route path="/admin-v2" element={<AdminV2Layout />}><Route index element={<ReviewControls />} /></Route></Routes></MemoryRouter>
</AuthContext.Provider>);
