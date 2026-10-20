import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Copy, FileCog, Plus, Search, ShieldCheck, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDefaultCategoryApi } from "../services/category";
import { addAdminReceiptRuleApi, cloneAdminReceiptPolicyApi, deactivateAdminReceiptRuleApi, getAdminReceiptPoliciesApi, getAdminReceiptRulesApi, publishAdminReceiptPolicyApi, retireAdminReceiptPolicyApi, updateAdminReceiptPolicyDraftApi, updateAdminReceiptRuleApi } from "../services/admin";
import { AdminV2PageHeader, AdminV2State } from "./AdminV2State";
import { AdminV2CommandResult, AdminV2DangerConfirmation, AdminV2Panel, AdminV2StatusBadge } from "./AdminV2Primitives";
import { useAdminV2Capabilities } from "./AdminV2CapabilitiesContext";
import { adminQueryKey } from "./adminQueryClient";
import { adminCommandError, adminReceiptState } from "./adminCommandOutcome";
import { adminRecoveryJournal, resolveAdminRecovery } from "./adminRecoveryJournal";
import { useAdminCommandRecovery } from "./useAdminCommandRecovery";

const dateFormat = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: "Asia/Ho_Chi_Minh" });
const get = (object, camel, pascal = camel) => object?.[camel] ?? object?.[pascal];
const emptyRule = { RuleType: "MERCHANT_TOKEN", MatchMode: "TOKEN", Pattern: "", DefaultCategoryId: "", ScoreDelta: 500, Priority: 100, Language: "vi", Reason: "" };
const emptyDraft = { ExactMerchantWeight: 0, TokenWeight: 0, SimilarityWeight: 0, Threshold: 0, MinimumMargin: 0, Reason: "" };

function moduleEnabled(projection, key, action) {
  return projection?.status === "success" && projection.data?.modules?.some((module) => module.key === key && module.availability === "V2_COMMAND" && (!action || module.actions?.includes(action)));
}

export default function AdminV2ReceiptClassificationPage() {
  const capabilityProjection = useAdminV2Capabilities();
  const actorId = capabilityProjection?.data?.actorUserId;
  const readEnabled = capabilityProjection?.status === "success" && capabilityProjection.data?.modules?.some((module) => module.key === "admin.receipt-classification.read" && ["V2_READ", "LEGACY_CONTRACT"].includes(module.availability));
  const cloneEnabled = moduleEnabled(capabilityProjection, "admin.receipt-classification.mutate", "clone");
  const draftEditEnabled = moduleEnabled(capabilityProjection, "admin.receipt-classification.draft-edit", "update-draft");
  const rulesEnabled = moduleEnabled(capabilityProjection, "admin.receipt-classification.rules");
  const publicationEnabled = moduleEnabled(capabilityProjection, "admin.receipt-classification.publication");
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState("");
  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  const [draftForm, setDraftForm] = useState(emptyDraft);
  const [ruleForm, setRuleForm] = useState(emptyRule);
  const [editingRuleId, setEditingRuleId] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [commandState, setCommandState] = useState({ status: "idle", message: "", receipt: null });
  const commandAttemptRef = useRef(null);
  const recovery = useAdminCommandRecovery(actorId);
  const recoveryBlocked = recovery.blocked || Boolean(recovery.locator);
  useEffect(() => {
    if (!recovery.locator && !recovery.blocked) commandAttemptRef.current = null;
  }, [recovery.locator, recovery.blocked]);
  const policiesQuery = useQuery({ queryKey: adminQueryKey(actorId ?? "anonymous", "receipt-policies"), queryFn: ({ signal }) => getAdminReceiptPoliciesApi({ signal }), enabled: Boolean(actorId && readEnabled) });
  const policies = useMemo(() => (Array.isArray(policiesQuery.data) ? policiesQuery.data : policiesQuery.data?.items ?? []), [policiesQuery.data]);
  const selectedPolicy = useMemo(() => policies.find((policy) => get(policy, "id") === selectedPolicyId) ?? policies[0], [policies, selectedPolicyId]);
  const selectedId = get(selectedPolicy, "id") ?? "";
  const rulesQuery = useQuery({ queryKey: adminQueryKey(actorId ?? "anonymous", "receipt-rules", { policyId: selectedId }), queryFn: ({ signal }) => getAdminReceiptRulesApi(selectedId, { signal }), enabled: Boolean(actorId && readEnabled && selectedId) });
  const categoriesQuery = useQuery({ queryKey: adminQueryKey(actorId ?? "anonymous", "expense-categories"), queryFn: ({ signal }) => getDefaultCategoryApi({ signal }), enabled: Boolean(actorId && readEnabled), staleTime: 300_000 });
  const rules = Array.isArray(rulesQuery.data) ? rulesQuery.data : rulesQuery.data?.items ?? [];
  const categories = (categoriesQuery.data?.items ?? []).filter((category) => !category.type || String(category.type).toLowerCase() === "expense");
  const policyState = { status: policiesQuery.isPending ? "loading" : policiesQuery.isError ? "error" : "success" };
  const rulesState = { status: rulesQuery.isPending ? "loading" : rulesQuery.isError ? "error" : "success" };
  const filteredPolicies = policies.filter((policy) => `${get(policy, "status") ?? ""} ${get(policy, "normalizerVersion") ?? ""}`.toLowerCase().includes(keyword.trim().toLowerCase()));
  const isDraft = get(selectedPolicy, "status") === "DRAFT";

  useEffect(() => { if (selectedPolicy && !selectedPolicyId) setSelectedPolicyId(get(selectedPolicy, "id")); }, [selectedPolicy, selectedPolicyId]);
  useEffect(() => {
    if (!selectedPolicy) return;
    setDraftForm({ ExactMerchantWeight: get(selectedPolicy, "exactMerchantWeight") ?? 0, TokenWeight: get(selectedPolicy, "tokenWeight") ?? 0, SimilarityWeight: get(selectedPolicy, "similarityWeight") ?? 0, Threshold: get(selectedPolicy, "threshold") ?? 0, MinimumMargin: get(selectedPolicy, "minimumMargin") ?? 0, Reason: get(selectedPolicy, "changeReason") ?? "" });
    setEditingRuleId("");
    setRuleForm(emptyRule);
  }, [selectedPolicy]);

  const refreshPolicy = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "receipt-policies"] }),
      selectedId ? queryClient.invalidateQueries({ queryKey: ["admin-v2", actorId, "receipt-rules", { policyId: selectedId }] }) : Promise.resolve(),
    ]);
  };
  const runCommand = async (locator, action) => {
    if (recoveryBlocked || !locator) return null;
    setCommandState({ status: "loading", message: "", receipt: null });
    let sent = false;
    try {
      adminRecoveryJournal.reserve(locator);
      sent = true;
      const receipt = await action(locator);
      const status = adminReceiptState(receipt);
      setCommandState({ status, message: status === "success" ? "Command committed and recorded in the audit trail." : status === "error" ? "The policy command was durably rejected." : "Chưa xác nhận hoàn tất. Tra cứu kết quả trước khi gửi thao tác khác.", receipt });
      if (status === "uncertain") return null;
      resolveAdminRecovery(locator, receipt);
      commandAttemptRef.current = null;
      setPendingAction(null);
      if (status !== "success") return receipt;
      await refreshPolicy();
      return receipt;
    } catch (error) {
      const result = sent ? adminCommandError(error) : { uncertain: false, message: "Không thể lưu metadata phục hồi. Thao tác chưa được gửi; hãy xử lý lệnh đang chờ trước." };
      setCommandState({ status: result.uncertain ? "uncertain" : "error", message: result.message, receipt: null });
      if (!result.uncertain) {
        try { const current = adminRecoveryJournal.read(actorId); if (current?.key === locator.key) adminRecoveryJournal.clear(); } catch { /* fail closed */ }
        commandAttemptRef.current = null;
      }
      setPendingAction(null);
      return null;
    }
  };
  const requestClone = () => {
    if (recoveryBlocked) return;
    const sourceId = get(selectedPolicy, "id");
    const expected = get(selectedPolicy, "versionToken");
    if (!sourceId || !expected) return setCommandState({ status: "error", message: "The selected policy has no concurrency version. Refresh before retrying.", receipt: null });
    const locator = { actor: actorId, action: "RECEIPT_POLICY_CLONE", targetId: sourceId, key: crypto.randomUUID(), version: String(expected) };
    commandAttemptRef.current = { actorId, locator };
    void runCommand(locator, (attempt) => cloneAdminReceiptPolicyApi({ SourcePolicyId: sourceId, ExpectedSourceVersion: expected, Reason: "Admin V2 policy clone" }, { idempotencyKey: attempt.key }));
  };
  const saveDraft = () => {
    if (!selectedId || !isDraft || recoveryBlocked) return;
    const version = String(get(selectedPolicy, "versionToken") ?? "");
    const locator = { actor: actorId, action: "RECEIPT_POLICY_UPDATE_DRAFT", targetId: selectedId, key: crypto.randomUUID(), version };
    commandAttemptRef.current = { actorId, locator };
    void runCommand(locator, (attempt) => updateAdminReceiptPolicyDraftApi(selectedId, { ...draftForm, ExpectedVersion: version }, { idempotencyKey: attempt.key }));
  };
  const submitRule = (event) => {
    event.preventDefault();
    if (!selectedId || !isDraft || !ruleForm.Pattern.trim() || !ruleForm.DefaultCategoryId) return;
    const payload = { ...ruleForm, Pattern: ruleForm.Pattern.trim(), ExpectedPolicyVersion: get(selectedPolicy, "versionToken") };
    if (recoveryBlocked) return;
    const version = String(get(selectedPolicy, "versionToken") ?? "");
    const actionName = editingRuleId ? "RECEIPT_RULE_UPDATE" : "RECEIPT_RULE_ADD";
    const locator = { actor: actorId, action: actionName, targetId: selectedId, key: crypto.randomUUID(), version };
    commandAttemptRef.current = { actorId, locator };
    const action = (attempt) => editingRuleId
      ? updateAdminReceiptRuleApi(selectedId, editingRuleId, payload, { idempotencyKey: attempt.key, expectedVersion: version })
      : addAdminReceiptRuleApi(selectedId, payload, { idempotencyKey: attempt.key });
    void runCommand(locator, action).then((receipt) => { if (receipt) { setEditingRuleId(""); setRuleForm(emptyRule); } });
  };
  const confirmAction = () => {
    if (!pendingAction || !selectedId || recoveryBlocked) return;
    const version = get(selectedPolicy, "versionToken");
    const actionName = pendingAction.type === "publish" ? "RECEIPT_POLICY_PUBLISH" : pendingAction.type === "retire" ? "RECEIPT_POLICY_RETIRE" : "RECEIPT_RULE_DEACTIVATE";
    const locator = { actor: actorId, action: actionName, targetId: selectedId, key: crypto.randomUUID(), version: String(version) };
    commandAttemptRef.current = { actorId, locator };
    if (pendingAction.type === "publish") void runCommand(locator, (attempt) => publishAdminReceiptPolicyApi(selectedId, { ExpectedPolicyVersion: version, Reason: "Admin V2 publication" }, { idempotencyKey: attempt.key, expectedVersion: version }));
    if (pendingAction.type === "retire") void runCommand(locator, (attempt) => retireAdminReceiptPolicyApi(selectedId, { ExpectedPolicyVersion: version, Reason: "Admin V2 retirement" }, { idempotencyKey: attempt.key, expectedVersion: version }));
    if (pendingAction.type === "deactivate") void runCommand(locator, (attempt) => deactivateAdminReceiptRuleApi(selectedId, pendingAction.ruleId, { ExpectedPolicyVersion: version, Reason: "Admin V2 rule deactivation" }, { idempotencyKey: attempt.key, expectedVersion: version }));
  };

  return <div className="admin-v2-content">
    <AdminV2PageHeader title="Receipt classification" description="Policy, draft, rule and publication controls backed by durable Admin V2 commands." />
    {!readEnabled && <AdminV2State title="Receipt policy projection is unavailable">The server has not enabled the receipt-classification read contract for this session.</AdminV2State>}
    {readEnabled && <>
      <div className="admin-v2-metric-grid"><div className="admin-v2-metric"><div className="admin-v2-metric-label"><FileCog size={15} aria-hidden="true" /> Policies</div><div className="admin-v2-metric-value">{policyState.status === "success" ? filteredPolicies.length : "—"}</div></div><div className="admin-v2-metric"><div className="admin-v2-metric-label"><CheckCircle2 size={15} aria-hidden="true" /> Published</div><div className="admin-v2-metric-value">{policyState.status === "success" ? policies.filter((policy) => get(policy, "status") === "PUBLISHED").length : "—"}</div></div><div className="admin-v2-metric"><div className="admin-v2-metric-label"><ShieldCheck size={15} aria-hidden="true" /> Rules</div><div className="admin-v2-metric-value">{rulesState.status === "success" ? rules.length : "—"}</div></div></div>
      <AdminV2Panel title="Policy versions" meta={policyState.status === "success" ? `${filteredPolicies.length} shown` : "Awaiting projection"}>
        <label className="admin-v2-search-label"><Search size={15} aria-hidden="true" /><span className="sr-only">Search receipt policies</span><input className="admin-v2-search" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Search status or normalizer" /></label>
        {policyState.status === "loading" && <AdminV2State title="Loading policy inventory">Fetching authoritative policy versions…</AdminV2State>}
        {policyState.status === "error" && <AdminV2State title="Policy inventory unavailable" tone="danger">The server did not return policy data.</AdminV2State>}
        {policyState.status === "success" && filteredPolicies.length === 0 && <AdminV2State title={keyword ? "No matching policies" : "No policies"}>Try changing the filter or create a policy from an existing source.</AdminV2State>}
        {filteredPolicies.length > 0 && <div className="admin-v2-table-wrap"><table className="admin-v2-table"><thead><tr><th>Version</th><th>Status</th><th>Normalizer</th><th>Rules</th><th>Published</th><th>Actions</th></tr></thead><tbody>{filteredPolicies.map((policy) => { const id = get(policy, "id"); const selected = id === selectedId; return <tr key={id} data-active={selected}><td data-label="Version" className="admin-v2-mono"><button className="admin-v2-text-button" type="button" onClick={() => setSelectedPolicyId(id)}>v{get(policy, "version") ?? "—"}</button></td><td data-label="Status"><AdminV2StatusBadge tone={get(policy, "status") === "PUBLISHED" ? "success" : "warning"}>{get(policy, "status") ?? "Unknown"}</AdminV2StatusBadge></td><td data-label="Normalizer">{get(policy, "normalizerVersion") ?? "—"}</td><td data-label="Rules">{get(policy, "ruleCount") ?? "—"}</td><td data-label="Published" className="admin-v2-mono">{get(policy, "publishedAt") ? dateFormat.format(new Date(get(policy, "publishedAt"))) : "—"}</td><td data-label="Actions"><div className="admin-v2-row-actions">{cloneEnabled && selected && <button className="admin-v2-text-button" type="button" onClick={requestClone}><Copy size={14} aria-hidden="true" /> Clone</button>}{publicationEnabled && selected && get(policy, "status") === "DRAFT" && <button className="admin-v2-text-button" type="button" onClick={() => setPendingAction({ type: "publish" })}>Publish</button>}{publicationEnabled && selected && get(policy, "status") === "PUBLISHED" && <button className="admin-v2-text-button admin-v2-text-button-danger" type="button" onClick={() => setPendingAction({ type: "retire" })}>Retire</button>}</div></td></tr>; })}</tbody></table></div>}
      </AdminV2Panel>
      {selectedPolicy && <AdminV2Panel title={`Draft controls · v${get(selectedPolicy, "version") ?? "—"}`} meta={isDraft ? "DRAFT" : "Published policies are immutable"}><div className="admin-v2-form-grid">{Object.entries({ ExactMerchantWeight: "Merchant exact", TokenWeight: "Merchant/token", SimilarityWeight: "Similarity", Threshold: "Threshold", MinimumMargin: "Minimum margin" }).map(([field, label]) => <label key={field} className="admin-v2-search-label"><span>{label}</span><input className="admin-v2-search" type="number" min="0" max="10000" value={draftForm[field]} disabled={!isDraft || !draftEditEnabled || commandState.status === "loading"} onChange={(event) => setDraftForm((current) => ({ ...current, [field]: Number(event.target.value) }))} /></label>)}</div><label className="admin-v2-search-label"><span>Change reason</span><input className="admin-v2-search" value={draftForm.Reason} disabled={!isDraft || !draftEditEnabled || commandState.status === "loading"} onChange={(event) => setDraftForm((current) => ({ ...current, Reason: event.target.value }))} /></label>{draftEditEnabled && <button className="admin-v2-primary-button" type="button" onClick={saveDraft} disabled={!isDraft || commandState.status === "loading"}>Save draft</button>}{!draftEditEnabled && <AdminV2State title="Draft edit is not enabled">The server keeps draft editing closed until PostgreSQL race/replay qualification completes.</AdminV2State>}</AdminV2Panel>}
      {selectedPolicy && <AdminV2Panel title={`Rules · v${get(selectedPolicy, "version") ?? "—"}`} meta={rulesState.status === "success" ? `${rules.length} loaded` : "Awaiting projection"}>{rulesState.status === "loading" && <AdminV2State title="Loading rules">Fetching rules for the selected policy…</AdminV2State>}{rulesState.status === "error" && <AdminV2State title="Rules unavailable" tone="danger">The server did not return rules for this policy.</AdminV2State>}{rulesState.status === "success" && rules.length === 0 && <AdminV2State title="No rules">This policy has no visible classification rules.</AdminV2State>}{rules.length > 0 && <div className="admin-v2-table-wrap"><table className="admin-v2-table"><thead><tr><th>Pattern</th><th>Type</th><th>Score</th><th>Priority</th><th>State</th><th>Actions</th></tr></thead><tbody>{rules.map((rule) => <tr key={get(rule, "id")}><td data-label="Pattern" className="admin-v2-mono">{get(rule, "pattern")}</td><td data-label="Type">{get(rule, "ruleType")}</td><td data-label="Score">{get(rule, "scoreDelta")}</td><td data-label="Priority">{get(rule, "priority")}</td><td data-label="State"><AdminV2StatusBadge tone={get(rule, "isActive") === false ? "danger" : "success"}>{get(rule, "isActive") === false ? "Inactive" : "Active"}</AdminV2StatusBadge></td><td data-label="Actions"><div className="admin-v2-row-actions">{rulesEnabled && isDraft && <><button className="admin-v2-text-button" type="button" onClick={() => { setEditingRuleId(get(rule, "id")); setRuleForm({ RuleType: get(rule, "ruleType") ?? "MERCHANT_TOKEN", MatchMode: get(rule, "matchMode") ?? "TOKEN", Pattern: get(rule, "pattern") ?? "", DefaultCategoryId: get(rule, "defaultCategoryId") ?? "", ScoreDelta: get(rule, "scoreDelta") ?? 0, Priority: get(rule, "priority") ?? 0, Language: get(rule, "language") ?? "vi", Reason: "" }); }}>Edit</button><button className="admin-v2-text-button admin-v2-text-button-danger" type="button" onClick={() => setPendingAction({ type: "deactivate", ruleId: get(rule, "id") })}><Trash2 size={14} aria-hidden="true" /> Deactivate</button></>}</div></td></tr>)}</tbody></table></div>}{rulesEnabled && isDraft && <form className="admin-v2-form-grid" onSubmit={submitRule}><label className="admin-v2-search-label"><span>Pattern</span><input className="admin-v2-search" value={ruleForm.Pattern} onChange={(event) => setRuleForm((current) => ({ ...current, Pattern: event.target.value }))} required maxLength={255} /></label><label className="admin-v2-search-label"><span>Category</span><select className="admin-v2-search" value={ruleForm.DefaultCategoryId} onChange={(event) => setRuleForm((current) => ({ ...current, DefaultCategoryId: event.target.value }))} required><option value="">Select expense category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="admin-v2-search-label"><span>Rule type</span><select className="admin-v2-search" value={ruleForm.RuleType} onChange={(event) => setRuleForm((current) => ({ ...current, RuleType: event.target.value }))}><option value="MERCHANT_EXACT">Merchant exact</option><option value="MERCHANT_TOKEN">Merchant token</option><option value="RECEIPT_TEXT_TOKEN">Receipt text</option></select></label><label className="admin-v2-search-label"><span>Score delta</span><input className="admin-v2-search" type="number" min="-10000" max="10000" value={ruleForm.ScoreDelta} onChange={(event) => setRuleForm((current) => ({ ...current, ScoreDelta: Number(event.target.value) }))} /></label><button className="admin-v2-primary-button" type="submit" disabled={commandState.status === "loading" || !ruleForm.Pattern.trim() || !ruleForm.DefaultCategoryId}>{editingRuleId ? "Update rule" : <><Plus size={14} aria-hidden="true" /> Add rule</>}</button></form>}{!rulesEnabled && <AdminV2State title="Rule commands are not enabled">Rule create, update and deactivate remain closed until PostgreSQL qualification completes.</AdminV2State>}</AdminV2Panel>}
    </>}
    <AdminV2CommandResult state={commandState} successTitle="Receipt policy command committed" errorTitle="Receipt policy command rejected">{commandState.message} Operation <span className="admin-v2-mono">{commandState.receipt?.operationId ?? "—"}</span>; audit <span className="admin-v2-mono">{commandState.receipt?.auditId ?? "—"}</span>.</AdminV2CommandResult>
    {recoveryBlocked && <AdminV2State title="Resolve the pending receipt-policy command">The previous command is still awaiting a durable result. Use the recovery panel before sending another policy or rule change.</AdminV2State>}
    {pendingAction && <AdminV2DangerConfirmation open title={`Confirm ${pendingAction.type}`} description="The server will enforce the current policy version, idempotency key and durable audit boundary." busy={commandState.status === "loading"} onCancel={() => setPendingAction(null)} onConfirm={confirmAction} confirmLabel="Confirm command" />}
  </div>;
}
