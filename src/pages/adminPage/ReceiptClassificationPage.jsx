import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Copy, Loader2, Plus, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { getDefaultCategoryApi } from "../../services/category";
import { addReceiptRuleApi, cloneReceiptPolicyApi, deleteReceiptRuleApi, listReceiptPoliciesApi, listReceiptRulesApi, publishReceiptPolicyApi, updateReceiptPolicyApi } from "../../services/receiptClassification";

const emptyRule = { ruleType: "MERCHANT_TOKEN", matchMode: "TOKEN", pattern: "", defaultCategoryId: "", scoreDelta: 500, priority: 100, language: "vi" };
const get = (object, camel, pascal = camel) => object?.[camel] ?? object?.[pascal];

function ReceiptClassificationPage() {
  const [policies, setPolicies] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [rules, setRules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [draft, setDraft] = useState(null);
  const [ruleForm, setRuleForm] = useState(emptyRule);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const selectedPolicy = useMemo(() => policies.find((policy) => get(policy, "id") === selectedId), [policies, selectedId]);
  const isDraft = get(selectedPolicy, "status") === "DRAFT";

  const loadPolicies = useCallback(async (preferredId = "") => {
    setLoading(true); setError("");
    try {
      const [policyData, categoryData] = await Promise.all([listReceiptPoliciesApi(), getDefaultCategoryApi()]);
      const nextPolicies = Array.isArray(policyData) ? policyData : policyData?.items ?? [];
      setPolicies(nextPolicies);
      const allCategories = categoryData?.items ?? [];
      setCategories(allCategories.filter((category) => !category.type || String(category.type).toLowerCase() === "expense"));
      setSelectedId(nextPolicies.some((item) => get(item, "id") === preferredId) ? preferredId : get(nextPolicies[0], "id") ?? "");
    } catch (requestError) { setError(requestError.response?.data?.message || "Không tải được policy phân loại hóa đơn."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadPolicies(); }, [loadPolicies]);
  useEffect(() => {
    const policy = policies.find((item) => get(item, "id") === selectedId);
    setDraft(policy ? { exactMerchantWeight: get(policy, "exactMerchantWeight") ?? 0, tokenWeight: get(policy, "tokenWeight") ?? 0, similarityWeight: get(policy, "similarityWeight") ?? 0, threshold: get(policy, "threshold") ?? 0, minimumMargin: get(policy, "minimumMargin") ?? 0, changeReason: get(policy, "changeReason") ?? "" } : null);
    if (!selectedId) { setRules([]); return; }
    listReceiptRulesApi(selectedId).then(setRules).catch((requestError) => setError(requestError.response?.data?.message || "Không tải được rule của policy."));
  }, [selectedId, policies]);

  const runAction = async (action, successMessage) => {
    setSaving(true); setError(""); setNotice("");
    try { const result = await action(); const preferredId = get(result, "id") || selectedId; setNotice(successMessage); await loadPolicies(preferredId); if (preferredId) setRules(await listReceiptRulesApi(preferredId)); }
    catch (requestError) { setError(requestError.response?.data?.message || "Thao tác thất bại. Vui lòng tải lại và thử lại."); }
    finally { setSaving(false); }
  };
  const updateDraftField = (field, value) => setDraft((current) => ({ ...current, [field]: field === "changeReason" ? value : Number(value) }));
  const handleClone = () => runAction(() => cloneReceiptPolicyApi({ sourcePolicyId: selectedId || null, changeReason: "Tạo bản nháp từ admin" }), "Đã tạo policy nháp.");
  const handleSave = () => selectedPolicy && draft && isDraft && runAction(() => updateReceiptPolicyApi(selectedId, { ...draft, expectedVersionToken: get(selectedPolicy, "versionToken") ?? 0 }), "Đã lưu policy nháp.");
  const handlePublish = () => selectedPolicy && isDraft && runAction(() => publishReceiptPolicyApi(selectedId, get(selectedPolicy, "versionToken") ?? 0), "Đã publish policy. Các scan mới sẽ dùng phiên bản này.");
  const handleAddRule = async (event) => { event.preventDefault(); if (!isDraft || !ruleForm.pattern.trim() || !ruleForm.defaultCategoryId) return; await runAction(() => addReceiptRuleApi(selectedId, { ...ruleForm, pattern: ruleForm.pattern.trim() }), "Đã thêm rule."); setRuleForm(emptyRule); };
  const handleDeleteRule = (ruleId) => runAction(() => deleteReceiptRuleApi(selectedId, ruleId), "Đã vô hiệu hóa rule.");

  if (loading && policies.length === 0) return <div className="flex min-h-[50vh] items-center justify-center text-slate-500"><Loader2 className="mr-2 animate-spin" size={20} />Đang tải policy...</div>;
  return <div className="min-h-screen space-y-5 bg-slate-50 p-3 sm:p-5 lg:p-6">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h1 className="text-2xl font-semibold text-slate-900">Phân loại hóa đơn</h1><p className="mt-1 text-sm text-slate-500">Quản lý policy và rule deterministic. Không hiển thị ảnh hay dữ liệu giao dịch người dùng.</p></div><Button variant="outline" onClick={() => loadPolicies(selectedId)} disabled={saving}><RefreshCw size={16} className="mr-2" />Tải lại</Button></div>
    {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}{notice && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>}
    <Card><CardHeader><CardTitle className="text-lg">Phiên bản policy</CardTitle><CardDescription>Policy published là bất biến. Muốn thay đổi, clone thành bản nháp rồi kiểm tra trước khi publish.</CardDescription></CardHeader><CardContent><div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]"><select className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>{policies.map((policy) => <option key={get(policy, "id")} value={get(policy, "id")}>{`v${get(policy, "version")} · ${get(policy, "status")}${get(policy, "ruleCount") !== undefined ? ` · ${get(policy, "ruleCount")} rule` : ""}`}</option>)}</select><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={handleClone} disabled={!selectedId || saving}><Copy size={16} className="mr-2" />Clone nháp</Button><Button onClick={handlePublish} disabled={!isDraft || saving}><ShieldCheck size={16} className="mr-2" />Publish</Button></div></div></CardContent></Card>
    {selectedPolicy && draft && <div className="grid gap-5 xl:grid-cols-2"><Card><CardHeader><CardTitle className="text-lg">Trọng số & ngưỡng</CardTitle><CardDescription>Thang điểm 0–10.000. Thay đổi chỉ áp dụng sau khi publish.</CardDescription></CardHeader><CardContent className="space-y-4">{[["exactMerchantWeight", "Merchant exact"], ["tokenWeight", "Merchant/token"], ["similarityWeight", "Similarity"], ["threshold", "Ngưỡng tự chọn"], ["minimumMargin", "Khoảng cách tối thiểu"]].map(([field, label]) => <label key={field} className="block text-sm font-medium text-slate-700">{label}<Input className="mt-1" type="number" min="0" max="10000" value={draft[field]} disabled={!isDraft || saving} onChange={(event) => updateDraftField(field, event.target.value)} /></label>)}<label className="block text-sm font-medium text-slate-700">Lý do thay đổi<Input className="mt-1" value={draft.changeReason} disabled={!isDraft || saving} onChange={(event) => updateDraftField("changeReason", event.target.value)} placeholder="Ghi lý do khi thay đổi policy" /></label><Button variant="secondary" onClick={handleSave} disabled={!isDraft || saving}><Check size={16} className="mr-2" />Lưu nháp</Button></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-lg">Rules ({rules.length})</CardTitle><CardDescription>Chỉ exact/token/prefix; không dùng regex. Category phải thuộc catalog hệ thống.</CardDescription></CardHeader><CardContent className="space-y-4">{rules.length === 0 ? <p className="text-sm text-slate-500">Chưa có rule.</p> : <div className="space-y-2">{rules.map((rule) => <div key={get(rule, "id")} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm"><div className="min-w-0"><p className="truncate font-medium text-slate-800">{get(rule, "pattern")}</p><p className="text-xs text-slate-500">{get(rule, "ruleType")} · +{get(rule, "scoreDelta")} · ưu tiên {get(rule, "priority")}</p></div><Button variant="ghost" size="icon" disabled={!isDraft || saving} aria-label="Xóa rule" onClick={() => handleDeleteRule(get(rule, "id"))}><Trash2 size={16} className="text-red-600" /></Button></div>)}</div>}<form className="space-y-2 border-t border-slate-200 pt-4" onSubmit={handleAddRule}><p className="text-sm font-semibold text-slate-700">Thêm rule</p><div className="grid gap-2 sm:grid-cols-2"><Input placeholder="Pattern merchant/token" value={ruleForm.pattern} disabled={!isDraft || saving} onChange={(event) => setRuleForm((current) => ({ ...current, pattern: event.target.value }))} /><select className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm" value={ruleForm.defaultCategoryId} disabled={!isDraft || saving} onChange={(event) => setRuleForm((current) => ({ ...current, defaultCategoryId: event.target.value }))}><option value="">Chọn category hệ thống</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div><div className="grid gap-2 sm:grid-cols-3"><select className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm" value={ruleForm.ruleType} disabled={!isDraft || saving} onChange={(event) => setRuleForm((current) => ({ ...current, ruleType: event.target.value }))}><option value="MERCHANT_EXACT">Merchant exact</option><option value="MERCHANT_TOKEN">Merchant token</option><option value="RECEIPT_TEXT_TOKEN">Receipt text</option></select><Input type="number" placeholder="Điểm" value={ruleForm.scoreDelta} disabled={!isDraft || saving} onChange={(event) => setRuleForm((current) => ({ ...current, scoreDelta: Number(event.target.value) }))} /><Button type="submit" disabled={!isDraft || saving || !ruleForm.pattern.trim() || !ruleForm.defaultCategoryId}><Plus size={16} className="mr-2" />Thêm</Button></div></form></CardContent></Card></div>}
  </div>;
}

export default ReceiptClassificationPage;
