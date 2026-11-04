import { useState } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "../../src/contexts/AuthSessionContext.js";
import { instance } from "../../src/services/instance";
import AdminV2Layout from "../../src/adminV2/AdminV2Layout";
import { adminNavigation } from "../../src/adminV2/adminNavigation";
import { AdminV2DangerConfirmation, AdminV2Panel, AdminV2Pagination } from "../../src/adminV2/AdminV2Primitives";
import "../../src/index.css";

const actor = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
instance.defaults.adapter = async (config) => {
  if (config.url !== "/admin/capabilities") throw new Error("Unexpected synthetic route");
  return { status: 200, headers: {}, config, data: { actorUserId: actor, modules:
    adminNavigation.map((item) => ({ key: item.capability, actions: ["read"], risk: item.risk, availability: "V2_READ" })) } };
};
export function FixturePage() {
  const [open, setOpen] = useState(false);
  return <div className="admin-v2-content"><h1>Kiểm thử shell Admin</h1><AdminV2Panel title="Dữ liệu giả · Không gọi backend">
    <p>Kiểm tra điều hướng, ngôn ngữ và hộp thoại trên dữ liệu giả.</p>
    <button type="button" className="admin-v2-danger-button" onClick={() => setOpen(true)}>Mở xác nhận kiểm thử</button>
    <AdminV2Pagination page={2} totalPages={3} onPrevious={() => {}} onNext={() => {}} />
    <AdminV2DangerConfirmation open={open} title="Xác nhận kiểm thử" description="Chỉ đóng hộp thoại, không thay đổi dữ liệu." onCancel={() => setOpen(false)} onConfirm={() => setOpen(false)} />
  </AdminV2Panel></div>;
}
createRoot(document.getElementById("root")).render(<AuthContext.Provider value={{ auth: { userId: actor, roleName: "Admin", fullName: "Người quản trị kiểm thử" }, logout: async () => {} }}>
  <MemoryRouter initialEntries={["/admin-v2"]}><Routes><Route path="/admin-v2" element={<AdminV2Layout />}><Route index element={<FixturePage />} /><Route path="*" element={<FixturePage />} /></Route></Routes></MemoryRouter>
</AuthContext.Provider>);
