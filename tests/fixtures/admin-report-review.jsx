import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { instance } from "../../src/services/instance";
import AdminV2ReportsPage from "../../src/adminV2/AdminV2ReportsPage";
import AdminV2CommandRecovery from "../../src/adminV2/AdminV2CommandRecovery";
import { AdminV2CapabilitiesContext } from "../../src/adminV2/AdminV2CapabilitiesContext";
import { createAdminQueryClient } from "../../src/adminV2/adminQueryClient";
import "../../src/index.css";
import "../../src/adminV2/admin-design-tokens.css";
import "../../src/adminV2/admin-v2.css";

const id = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const actor = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const now = "2026-10-12T03:00:00Z";
const text = "Nội dung Unicode 😀 Tiếng Việt. ".repeat(180) + "<script>window.__fixtureInjected = true</script>";
const characters = Array.from(text);
let sends = [];
let committed = false;
let contentFault = false;
let unseenMode = false;
let unseenCancelled = false;
let loseDispositionResponse = false;
const disposition = { operationId: "ffffffff-ffff-4fff-8fff-ffffffffffff", auditId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee", outcomeCode: "CANCELLED_BEFORE_ACCEPTANCE" };
const unusedType = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const createdType = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const types = new Map([[unusedType, { id: unusedType, name: "Loại chưa sử dụng", description: "Mô tả <script>window.__typeInjected=true</script>", version: "1", isDeleted: false, hasReports: false, createdAt: now, updatedAt: now }], [id, { id, name: "Loại đã có báo cáo", description: "Có tham chiếu", version: "1", isDeleted: false, hasReports: true, createdAt: now, updatedAt: now }]]);
const typeSends = [];
const report = () => ({ id, title: "Báo cáo kiểm thử an toàn", status: committed ? "APPROVED" : "PENDING", version: committed ? "2" : "1", reporterId: actor,
  reporterName: "Người dùng kiểm thử với tên rất dài trong hồ sơ hỗ trợ", reportTypeId: id, reportTypeName: "Hỗ trợ tài khoản", hasReply: committed, hasAttachment: true, createdAt: now, updatedAt: now });
instance.defaults.adapter = async (config) => {
  let data;
  if (config.method === "post" && config.url === "/admin/commands/recovery/cancel-unseen") {
    const payload = JSON.parse(config.data);
    unseenCancelled = true;
    data = { action: payload.action, scopeId: payload.targetId, expectedVersion: payload.expectedVersion, state: "CANCELLED", receipt: null, canCancelUnseen: false, disposition, asOf: now };
    if (loseDispositionResponse) { loseDispositionResponse = false; throw new AxiosError("Synthetic lost disposition response", "ECONNABORTED", config); }
  }
  else if (config.method === "get" && config.url === "/admin/commands/recovery") {
    const action = config.headers.get("Admin-Command-Action"); const version = config.headers.get("Admin-Expected-Version");
    const targetId = action === "REPORT_TYPE_CREATE" ? createdType : config.params?.targetId;
    const receipt = { status: "COMMITTED", outcomeCode: "APPLIED", operationId: createdType, auditId: actor, targetId, currentState: action === "REPORT_REPLY" ? "APPROVED" : action === "REPORT_TYPE_DELETE" ? "DELETED" : "ACTIVE", version: action === "REPORT_TYPE_CREATE" ? "1" : String(BigInt(version) + 1n), traceId: "synthetic" };
    const unknown = window.__recoveryUnknown || unseenMode && !committed;
    data = { action, scopeId: config.params?.targetId ?? "00000000-0000-0000-0000-000000000000", expectedVersion: version,
      state: unseenCancelled ? "CANCELLED" : unknown ? "UNKNOWN" : "COMMITTED", receipt: unseenCancelled || unknown ? null : receipt,
      canCancelUnseen: unknown && !unseenCancelled, disposition: unseenCancelled ? disposition : null, asOf: now };
    window.__recoveryEvidence = { headerKey: config.headers.get("Idempotency-Key"), query: config.params, url: config.url, action };
  }
  else if (config.method === "get" && config.url === "/admin/report-types") data = { items: [...types.values()].filter((type) => config.params.IncludeDeleted || !type.isDeleted), hasMore: false, nextCursor: null, asOf: now };
  else if (config.method === "get" && config.url.startsWith("/admin/report-types/")) data = types.get(config.url.split("/").at(-1));
  else if (config.method === "post" && config.url === "/admin/report-types") {
    typeSends.push({ key: config.headers.get("Idempotency-Key"), body: config.data });
    const payload = JSON.parse(config.data);
    types.set(createdType, { id: createdType, ...payload, version: "1", isDeleted: false, hasReports: false, createdAt: now, updatedAt: now });
    window.__typeEvidence = { sends: typeSends.length, sameKey: typeSends.length === 2 && typeSends[0].key === typeSends[1].key, sameBody: typeSends.length === 2 && typeSends[0].body === typeSends[1].body };
    if (typeSends.length === 1) throw new AxiosError("Synthetic lost catalog reply", "ECONNABORTED", config);
    data = { status: "COMMITTED", outcomeCode: "APPLIED", operationId: createdType, auditId: actor, targetId: createdType, currentState: "ACTIVE", version: "1", traceId: "synthetic" };
  } else if (["patch", "delete"].includes(config.method) && config.url.startsWith("/admin/report-types/")) {
    const typeId = config.url.split("/").at(-1); const type = types.get(typeId);
    if (config.method === "patch") Object.assign(type, JSON.parse(config.data), { version: "2" });
    else Object.assign(type, { isDeleted: true, version: "3" });
    data = { status: "COMMITTED", outcomeCode: "APPLIED", operationId: typeId, auditId: actor, targetId: typeId, currentState: type.isDeleted ? "DELETED" : "ACTIVE", version: type.version, traceId: "synthetic" };
  } else if (config.method === "get" && config.url === "/admin/reports") data = { items: [report()], hasMore: false, nextCursor: null, asOf: now };
  else if (config.method === "get" && config.url === `/admin/reports/${id}`) data = { report: report(), contentLength: characters.length, reply: committed ? "Đã kiểm tra" : null, replyAt: committed ? now : null, asOf: now };
  else if (config.method === "get" && config.url === `/admin/reports/${id}/content`) {
    const offset = config.params.Offset;
    const end = Math.min(offset + config.params.Limit, characters.length);
    data = { reportId: id, content: characters.slice(offset, end).join(""), offset, nextOffset: end < characters.length ? end : null, contentLength: characters.length, version: report().version, asOf: now };
    if (contentFault && offset > 0) data.content = "";
  } else if (config.method === "get" && config.url === "/admin-statistic/report") data = { totalReports: 1, resolvedReports: committed ? 1 : 0, unresolvedReports: committed ? 0 : 1 };
  else if (config.method === "patch" && config.url === `/admin/reports/${id}/reply`) {
    sends.push({ key: config.headers.get("Idempotency-Key"), version: config.headers.get("If-Match"), body: config.data });
    if (unseenMode) throw new AxiosError("Synthetic unaccepted request", "ECONNABORTED", config);
    committed = true;
    window.__reportEvidence = { sends: sends.length, sameKey: sends.length === 2 && sends[0].key === sends[1].key, sameBody: sends.length === 2 && sends[0].body === sends[1].body, sameVersion: sends.length === 2 && sends[0].version === sends[1].version };
    if (sends.length === 1) throw new AxiosError("Synthetic lost reply", "ECONNABORTED", config);
    data = { status: "COMMITTED", outcomeCode: "APPLIED", operationId: id, auditId: actor, targetId: id, currentState: "APPROVED", version: "2", traceId: "synthetic" };
  } else throw new Error("Unexpected synthetic request " + config.method + " " + config.url);
  return { data, status: 200, statusText: "OK", headers: {}, config };
};
const projection = { status: "success", data: { actorUserId: actor, modules: [{ key: "admin.commands.recovery", availability: "V2_READ", actions: ["lookup"] }, { key: "admin.commands.disposition", availability: "V2_COMMAND", actions: ["cancel-unseen"] }, { key: "admin.reports.read", availability: "V2_READ", actions: ["read", "detail", "content"] }, { key: "admin.reports.reply", availability: "V2_COMMAND", actions: ["reply"] }, { key: "admin.report-types.read", availability: "V2_READ", actions: ["read", "detail"] }, { key: "admin.report-types.crud", availability: "V2_COMMAND", actions: ["create", "update", "delete"] }] } };
const client = createAdminQueryClient();
export function Fixture() {
  const [theme, setTheme] = useState("light");
  const [showReports, setShowReports] = useState(true);
  const [recoveryRevision, setRecoveryRevision] = useState(0);
  const simulateContent = (fault) => {
    contentFault = fault;
    void client.refetchQueries({ queryKey: ["admin-v2", actor, "report-content"] });
  };
  return <QueryClientProvider client={client}><MemoryRouter><AdminV2CapabilitiesContext.Provider value={projection}>
    <div className="admin-v2-root" data-admin-theme={theme}><div className="admin-v2-content"><p>SYNTHETIC UI FIXTURE · No backend calls</p><button className="admin-v2-text-button" onClick={() => { const next = theme === "light" ? "dark" : "light"; document.documentElement.dataset.adminTheme = next; setTheme(next); }}>Chế độ tối</button><button className="admin-v2-text-button" onClick={() => setShowReports((value) => !value)}>Đổi trang kiểm thử</button><button className="admin-v2-text-button" onClick={() => simulateContent(true)}>Mô phỏng trang nội dung thiếu</button><button className="admin-v2-text-button" onClick={() => simulateContent(false)}>Khôi phục trang nội dung</button><button className="admin-v2-text-button" onClick={() => { unseenMode = true; }}>Mô phỏng chưa nhận lệnh</button><button className="admin-v2-text-button" onClick={() => { loseDispositionResponse = true; }}>Mô phỏng mất phản hồi quyết định chặn</button></div><AdminV2CommandRecovery actor={actor} onDisposition={() => setRecoveryRevision(value => value + 1)} />{showReports ? <AdminV2ReportsPage key={recoveryRevision} /> : <div className="admin-v2-content">Trang khác trong Admin · fixture</div>}</div>
  </AdminV2CapabilitiesContext.Provider></MemoryRouter></QueryClientProvider>;
}
createRoot(document.getElementById("root")).render(<Fixture />);
