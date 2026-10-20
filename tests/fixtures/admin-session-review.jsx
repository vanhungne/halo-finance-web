import { useContext, useState } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthProvider } from "../../src/contexts/AuthContext.jsx";
import { AuthContext } from "../../src/contexts/AuthSessionContext.js";
import LoginPage from "../../src/pages/authenPage/LoginPage";
import ProtectedRoute from "../../src/routes/route/protectedRoute";
import AdminV2QueryProvider from "../../src/adminV2/AdminV2QueryProvider";
import AdminV2LocaleProvider from "../../src/adminV2/AdminV2LocaleProvider";
import { AdminV2Panel } from "../../src/adminV2/AdminV2Primitives";
import { instance } from "../../src/services/instance";
import { adminConfigurationCommandsCreatePOST } from "../../src/services/admin/generated/admin";
import "../../src/index.css";
import "../../src/adminV2/admin-design-tokens.css";
import "../../src/adminV2/admin-v2.css";

window.__sessionReviewResults = [];
export function SessionPanel() {
  const { auth, logout, refreshAccessToken } = useContext(AuthContext);
  const client = useQueryClient();
  const [status, setStatus] = useState("READY");
  const run = async (kind) => {
    try {
      if (kind === "refresh") await refreshAccessToken();
      if (kind === "read") await instance.get(new URLSearchParams(location.search).get("real") === "true" ? "/admin/accounts" : "/admin/session-fixture");
      if (kind === "command") await adminConfigurationCommandsCreatePOST({ key: "Fixture.Session", value: "true", valueType: "bool", category: "Fixture" },
        { headers: { "Idempotency-Key": "fixture-session-command" } });
      window.__sessionReviewResults.push({ kind, outcome: "ACCEPTED" }); setStatus(`${kind}:ACCEPTED`);
    } catch (error) {
      const outcome = axios.isCancel(error) ? "CANCELLED" : "REFUSED";
      window.__sessionReviewResults.push({ kind, outcome }); setStatus(`${kind}:${outcome}`);
    }
  };
  return <div className="admin-v2-root" data-admin-theme="light"><main className="admin-v2-content"><AdminV2Panel title="Synthetic Admin session review">
    <p data-testid="actor">{auth.userId}</p><p data-testid="cache-size">{client.getQueryCache().getAll().length}</p>
    <div className="admin-v2-dialog-actions">
      <button className="admin-v2-primary-button" onClick={() => { void run("refresh"); }}>Refresh session</button>
      <button className="admin-v2-text-button" onClick={() => { void run("read"); }}>Start private read</button>
      <button className="admin-v2-text-button" onClick={() => { void run("command"); }}>Start protected command</button>
      <button className="admin-v2-text-button" onClick={() => { client.setQueryData(["session-review-private"], { owner: auth.userId }); setStatus("CACHE_SEEDED"); }}>Seed private cache</button>
      <button className="admin-v2-text-button" onClick={() => { void logout(); }}>Sign out</button>
    </div><p role="status">{status}</p>
  </AdminV2Panel></main></div>;
}
createRoot(document.getElementById("root")).render(<AuthProvider><MemoryRouter initialEntries={["/login"]}><Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}><Route path="/admin" element={<AdminV2LocaleProvider>
    <AdminV2QueryProvider><SessionPanel /></AdminV2QueryProvider></AdminV2LocaleProvider>} /></Route>
</Routes></MemoryRouter></AuthProvider>);
