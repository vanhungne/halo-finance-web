import { instance } from "../instance";

const basePath = "/admin/receipt-classification";

export const listReceiptPoliciesApi = async ({ signal } = {}) => (await instance.get(`${basePath}/policies`, { signal, timeout: 20_000 })).data;
export const cloneReceiptPolicyApi = async (payload = {}) => (await instance.post(`${basePath}/policies/clone`, payload)).data;
export const cloneAdminReceiptPolicyApi = async (payload, { idempotencyKey }) => {
  const response = await instance.post(`${basePath}/v2/policies/clone`, payload, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
  return response.data;
};
export const updateAdminReceiptPolicyDraftApi = async (policyId, payload, { idempotencyKey }) => {
  const response = await instance.patch(`${basePath}/v2/policies/${policyId}/draft`, payload, {
    headers: { "Idempotency-Key": idempotencyKey, "If-Match": String(payload.ExpectedVersion) },
  });
  return response.data;
};
export const addAdminReceiptRuleApi = async (policyId, payload, { idempotencyKey }) => {
  const response = await instance.post(`${basePath}/v2/policies/${policyId}/rules`, payload, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
  return response.data;
};
export const updateAdminReceiptRuleApi = async (policyId, ruleId, payload, { idempotencyKey, expectedVersion }) => {
  const response = await instance.patch(`${basePath}/v2/policies/${policyId}/rules/${ruleId}`, payload, {
    headers: { "Idempotency-Key": idempotencyKey, "If-Match": String(expectedVersion) },
  });
  return response.data;
};
export const deactivateAdminReceiptRuleApi = async (policyId, ruleId, payload, { idempotencyKey, expectedVersion }) => {
  const response = await instance.delete(`${basePath}/v2/policies/${policyId}/rules/${ruleId}`, {
    headers: { "Idempotency-Key": idempotencyKey, "If-Match": String(expectedVersion) },
    data: payload,
  });
  return response.data;
};
export const publishAdminReceiptPolicyApi = async (policyId, payload, { idempotencyKey, expectedVersion }) => {
  const response = await instance.post(`${basePath}/v2/policies/${policyId}/publish`, payload, {
    headers: { "Idempotency-Key": idempotencyKey, "If-Match": String(expectedVersion) },
  });
  return response.data;
};
export const retireAdminReceiptPolicyApi = async (policyId, payload, { idempotencyKey, expectedVersion }) => {
  const response = await instance.post(`${basePath}/v2/policies/${policyId}/retire`, payload, {
    headers: { "Idempotency-Key": idempotencyKey, "If-Match": String(expectedVersion) },
  });
  return response.data;
};
export const updateReceiptPolicyApi = async (policyId, payload) => (await instance.patch(`${basePath}/policies/${policyId}`, payload)).data;
export const publishReceiptPolicyApi = async (policyId, expectedVersionToken) => (await instance.post(`${basePath}/policies/${policyId}/publish?expectedVersionToken=${encodeURIComponent(expectedVersionToken)}`)).data;
export const listReceiptRulesApi = async (policyId, { signal } = {}) => (await instance.get(`${basePath}/policies/${policyId}/rules`, { signal, timeout: 20_000 })).data;
export const addReceiptRuleApi = async (policyId, payload) => (await instance.post(`${basePath}/policies/${policyId}/rules`, payload)).data;
export const deleteReceiptRuleApi = async (policyId, ruleId) => { await instance.delete(`${basePath}/policies/${policyId}/rules/${ruleId}`); };
