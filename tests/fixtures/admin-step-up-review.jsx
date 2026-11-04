import { useState } from "react";
import { createRoot } from "react-dom/client";
import { AxiosError } from "axios";
import { instance } from "../../src/services/instance";
import { adminConfigurationCommandsCreatePOST } from "../../src/services/admin/generated/admin";
import { AuthContext } from "../../src/contexts/AuthSessionContext.js";
import AdminV2QueryProvider from "../../src/adminV2/AdminV2QueryProvider";
import { AdminV2Panel } from "../../src/adminV2/AdminV2Primitives";
import "../../src/index.css";
import "../../src/adminV2/admin-design-tokens.css";
import "../../src/adminV2/admin-v2.css";

const actor = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const denied = (config, code, details = undefined) => { throw new AxiosError("Synthetic refusal", "ERR_BAD_RESPONSE", config, undefined,
  { data: { errorCode: code, details }, status: 403, statusText: "Forbidden", headers: {}, config }); };
instance.defaults.adapter = async (config) => {
  const body = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
  if (config.url === "/admin/step-up") {
    if (body.password !== "fixture-only" || body.authenticatorCode !== "123456") denied(config, "ADMIN_STEP_UP_FAILED");
    return { data: { proof: "synthetic-proof", expiresAt: new Date(Date.now() + 300000).toISOString() }, status: 200, headers: {}, config };
  }
  if (config.url === "/admin/configuration/v2") {
    if (config.headers.get("Admin-Step-Up") !== "synthetic-proof") {
      window.__originalCommand = JSON.stringify(body);
      denied(config, "ADMIN_STEP_UP_REQUIRED", { challenge: "synthetic-opaque-challenge", expiresAt: new Date(Date.now() + 300000).toISOString(), authenticatorRequired: true });
    }
    window.__commandFrozen = window.__originalCommand === JSON.stringify(body);
    return { data: { status: "COMMITTED", operationId: "synthetic-operation" }, status: 200, headers: {}, config };
  }
  throw new Error("Unexpected synthetic route");
};
export function Fixture() {
  const [result, setResult] = useState("");
  const run = async () => {
    try { const value = await adminConfigurationCommandsCreatePOST({ key: "Fixture.Ui", value: "true", valueType: "bool", category: "Fixture" }, { headers: { "Idempotency-Key": "fixture-key" } }); setResult(value.status); }
    catch { setResult("CANCELLED"); }
  };
  return <div className="admin-v2-root" data-admin-theme={new URLSearchParams(location.search).get("theme") ?? "light"}>
    <main className="admin-v2-content"><AdminV2Panel title="Cấu hình nền tảng"><p>Kiểm thử giao diện trên dữ liệu giả.</p>
      <button className="admin-v2-primary-button" onClick={run}>Thực hiện lệnh kiểm thử</button><p role="status">{result}</p></AdminV2Panel></main></div>;
}
createRoot(document.getElementById("root")).render(<AuthContext.Provider value={{ auth: { userId: actor, roleName: "Admin" }, logout: async () => {} }}>
  <AdminV2QueryProvider><Fixture /></AdminV2QueryProvider></AuthContext.Provider>);
