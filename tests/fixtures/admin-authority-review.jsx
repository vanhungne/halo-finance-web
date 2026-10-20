import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { instance } from "../../src/services/instance";
import { getAdminCapabilitiesApi } from "../../src/services/admin";
import { AuthContext } from "../../src/contexts/AuthSessionContext.js";
import AdminV2QueryProvider from "../../src/adminV2/AdminV2QueryProvider";
import { AdminV2Panel } from "../../src/adminV2/AdminV2Primitives";
import "../../src/index.css";
import "../../src/adminV2/admin-design-tokens.css";
import "../../src/adminV2/admin-v2.css";

const actor = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
instance.defaults.adapter = async (config) => {
  if (config.url !== "/admin/capabilities") throw new Error("Unexpected synthetic route");
  if (window.__denyAdmin) throw new AxiosError("Synthetic current-role denial", "ERR_BAD_RESPONSE", config, undefined,
    { data: { errorCode: "ADMIN_ACTOR_ROLE_REQUIRED" }, status: 403, statusText: "Forbidden", headers: {}, config });
  return { data: { actorUserId: actor, modules: [] }, status: 200, statusText: "OK", headers: {}, config };
};

function ProtectedView() {
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["admin-v2", actor, "capabilities"], queryFn: ({ signal }) => getAdminCapabilitiesApi({ signal }) });
  useEffect(() => {
    window.__oldAdminClient = client;
    client.setQueryData(["admin-v2", actor, "sensitive-fixture"], { text: "SYNTHETIC PRIVATE CACHE" });
  }, [client]);
  return <div className="admin-v2-root" data-admin-theme="light"><main className="admin-v2-content"><AdminV2Panel title="Dữ liệu Admin kiểm thử">
    {query.data && <p>SYNTHETIC PRIVATE METADATA</p>}
    <label className="admin-v2-search-label">Biểu mẫu đang soạn<textarea className="admin-v2-search" rows={3} /></label>
    <button type="button" className="admin-v2-primary-button" onClick={() => { window.__denyAdmin = true; void query.refetch(); }}>Giả lập máy chủ thu hồi quyền</button>
  </AdminV2Panel></main></div>;
}

// Keep the fixture component exportable so the Vite refresh lint rule can
// analyse it without treating this browser-only harness as an invalid module.
export { ProtectedView };

createRoot(document.getElementById("root")).render(<AuthContext.Provider value={{ auth: { userId: actor, roleName: "Admin" }, logout: () => { window.__fixtureLogout = true; window.dispatchEvent(new Event("auth:session-cleared")); } }}>
  <p>SYNTHETIC AUTHORITY FIXTURE · No backend calls</p><AdminV2QueryProvider><ProtectedView /></AdminV2QueryProvider>
</AuthContext.Provider>);
