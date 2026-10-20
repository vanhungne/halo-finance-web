import * as adminApi from "./generated/admin";

const commandOptions = ({ idempotencyKey, expectedVersion } = {}) => ({
  headers: { "Idempotency-Key": idempotencyKey, ...(expectedVersion === undefined ? {} : { "If-Match": expectedVersion }) },
});

// Keep page-facing names stable; routes, bodies and wire types come from OpenAPI.
// The server capability/handler remains authoritative for every command.
export const getAdminCapabilitiesApi = adminApi.adminGetCapabilitiesGET;
export const getAdminCommandRecoveryApi = ({ action, targetId, key, version }, options = {}) => adminApi.adminCommandRecoveryLookupGET(
  { targetId: targetId ?? undefined }, { ...options, headers: { ...options.headers, "Admin-Command-Action": action, "Idempotency-Key": key, "Admin-Expected-Version": version } });
export const cancelUnseenAdminCommandApi = ({ action, targetId, key, version }, options = {}) => adminApi.adminCommandRecoveryCancelUnseenPOST(
  { action, targetId, expectedVersion: version }, { ...options, headers: { ...options.headers, "Idempotency-Key": key } });
export const getAdminAccountsApi = ({ limit = 25, cursor, keyword, isActive, emailConfirmed, twoFactorEnabled } = {}, options = {}) =>
  adminApi.adminAccountDirectoryListGET({ Limit: limit, Cursor: cursor, Keyword: keyword, IsActive: isActive, EmailConfirmed: emailConfirmed, TwoFactorEnabled: twoFactorEnabled }, options);
export const setAccountLifecycleApi = (userId, payload, options) => adminApi.adminSetAccountLifecyclePATCH(userId, payload, commandOptions(options));
export const getAdminAccountRoleApi = adminApi.adminAccountRolesGetRoleGET;
export const setAdminAccountRoleApi = (userId, payload, options) => adminApi.adminAccountRolesSetRolePATCH(userId, payload, commandOptions(options));

export const setAdvertiseStatusApi = (advertiseId, payload, options) => adminApi.adminAdvertisingSetStatusPATCH(advertiseId, payload, commandOptions(options));
export const createAdminAdvertiseApi = (payload, options) => adminApi.adminAdvertisingCreatePOST(payload, commandOptions(options));
export const updateAdminAdvertiseApi = (advertiseId, payload, options) => adminApi.adminAdvertisingUpdatePATCH(advertiseId, payload, commandOptions(options));
export const deleteAdminAdvertiseApi = (advertiseId, payload, options) => adminApi.adminAdvertisingDeleteDELETE(advertiseId, payload, commandOptions(options));
export const replyAdminReportApi = (reportId, payload, options) => adminApi.adminReportsReplyPATCH(reportId, payload, commandOptions(options));

export const setAdminBlogPublicationApi = (blogId, payload, options) => adminApi.adminContentSetPublicationPATCH(blogId, payload, commandOptions(options));
export const createAdminBlogApi = (payload, options) => adminApi.adminContentCreateBlogPOST(payload, commandOptions(options));
export const updateAdminBlogApi = (blogId, payload, options) => adminApi.adminContentUpdateBlogPATCH(blogId, payload, commandOptions(options));
export const deleteAdminBlogApi = (blogId, payload, options) => adminApi.adminContentDeleteBlogDELETE(blogId, payload, commandOptions(options));

export const setAdminSubscriptionStatusApi = (subscriptionId, payload, options) => adminApi.adminSubscriptionsSetStatusPATCH(subscriptionId, payload, commandOptions(options));
export const getAdminSubscriptionApi = adminApi.adminSubscriptionsGetGET;
export const getAdminSubscriptionCatalogOptionsApi = adminApi.adminSubscriptionsGetOptionsGET;
export const createAdminSubscriptionApi = (payload, options) => adminApi.adminSubscriptionsCreatePOST(payload, commandOptions(options));
export const updateAdminSubscriptionApi = (subscriptionId, payload, options) => adminApi.adminSubscriptionsUpdatePATCH(subscriptionId, payload, commandOptions(options));
export const deleteAdminSubscriptionApi = (subscriptionId, payload, options) => adminApi.adminSubscriptionsDeleteDELETE(subscriptionId, payload, commandOptions(options));

export const getAdminAuditApi = adminApi.adminGetAuditGET;
export const getAdminCommandAuditApi = adminApi.adminGetCommandAuditGET;
export const getAdminConfigurationApi = adminApi.adminGetConfigurationGET;
export const createAdminConfigurationApi = (payload, options) => adminApi.adminConfigurationCommandsCreatePOST(payload, commandOptions(options));
export const updateAdminConfigurationApi = (configurationId, payload, options) => adminApi.adminConfigurationCommandsUpdatePATCH(configurationId, payload, commandOptions(options));
export const deleteAdminConfigurationApi = (configurationId, payload, options) => adminApi.adminConfigurationCommandsDeleteDELETE(configurationId, payload, commandOptions(options));

export const getAdminOperationsReadinessApi = adminApi.adminOperationsGetReadinessGET;
export const getAdminMaintenanceApi = adminApi.adminOperationsGetMaintenanceGET;
export const setAdminMaintenanceApi = (payload, options) => adminApi.adminOperationsSetMaintenancePATCH(payload, commandOptions(options));
export const getAdminPlatformSecurityApi = adminApi.adminPlatformGetSecurityGET;


// Admin V2 read surfaces use generated legacy-compatible contracts while their
// dedicated response/freshness upgrades remain separate gaps.
export const getAdminAdvertiseListApi = (params, options) => adminApi.advertiseGetAdvertiseListGET(params, options);
export const getAdminBlogListApi = (params, options) => adminApi.adminContentQueriesListGET(params, options);
export const getAdminBlogDetailApi = (id, options) => adminApi.adminContentQueriesGetGET(id, options);
export const getAdminBlogContentApi = (id, params, options) => adminApi.adminContentQueriesContentGET(id, params, options);
export const getAdminReportListApi = (params, options) => adminApi.adminReportsListGET(params, options);
export const getAdminReportDetailApi = adminApi.adminReportsGetGET;
export const getAdminReportContentApi = (reportId, params, options) => adminApi.adminReportsContentGET(reportId, params, options);
export const getAdminReportTypesApi = adminApi.adminReportTypesListGET;
export const getAdminReportTypeApi = adminApi.adminReportTypesGetGET;
export const createAdminReportTypeApi = (payload, options) => adminApi.adminReportTypesCreatePOST(payload, commandOptions(options));
export const updateAdminReportTypeApi = (id, payload, options) => adminApi.adminReportTypesUpdatePATCH(id, payload, commandOptions(options));
export const deleteAdminReportTypeApi = (id, options) => adminApi.adminReportTypesDeleteDELETE(id, commandOptions(options));
export const getAdminSubscriptionListApi = (params, options) => adminApi.subscriptionGetSubscriptionsGET(params, options);

// Receipt classification V2 pages now use the same generated contract facade.
export const getAdminReceiptPoliciesApi = (options = {}) => adminApi.receiptClassificationAdminPoliciesGET(options);
export const getAdminReceiptRulesApi = (policyId, options = {}) => adminApi.receiptClassificationAdminRulesGET(policyId, options);
export const cloneAdminReceiptPolicyApi = (payload, options) => adminApi.adminReceiptClassificationCommandsClonePOST(payload, commandOptions(options));
export const updateAdminReceiptPolicyDraftApi = (policyId, payload, options) => adminApi.adminReceiptClassificationCommandsUpdateDraftPATCH(policyId, payload, commandOptions(options));
export const publishAdminReceiptPolicyApi = (policyId, payload, options) => adminApi.adminReceiptClassificationCommandsPublishPOST(policyId, payload, commandOptions(options));
export const retireAdminReceiptPolicyApi = (policyId, payload, options) => adminApi.adminReceiptClassificationCommandsRetirePOST(policyId, payload, commandOptions(options));
export const addAdminReceiptRuleApi = (policyId, payload, options) => adminApi.adminReceiptClassificationCommandsAddRulePOST(policyId, payload, commandOptions(options));
export const deactivateAdminReceiptRuleApi = (policyId, ruleId, payload, options) => adminApi.adminReceiptClassificationCommandsDeactivateRuleDELETE(policyId, ruleId, payload, commandOptions(options));
export const updateAdminReceiptRuleApi = (policyId, ruleId, payload, options) => adminApi.adminReceiptClassificationCommandsUpdateRulePATCH(policyId, ruleId, payload, commandOptions(options));

// Statistics are read-only Admin projections and share the same generated
// transport, cancellation and `/api` route contract as the command surfaces.
export const getAdminAdvertiseStatisticApi = (options = {}) => adminApi.adminStatisticGetAdvertiseStatisticGET(options);
export const getAdminBlogStatisticApi = (options = {}) => adminApi.adminStatisticGetBlogStatisticGET(options);
export const getAdminDashboardStatisticApi = (options = {}) => adminApi.adminStatisticGetDashboardStatisticGET(options);
export const getAdminMembershipStatisticApi = (params, options = {}) => adminApi.adminStatisticGetMembershipStatisticGET(params, options);
export const getAdminReportStatisticApi = (options = {}) => adminApi.adminStatisticGetReportStatisticGET(options);
export const getAdminRevenueStatisticApi = (params, options = {}) => adminApi.adminStatisticGetRevenueStatisticGET(params, options);
export const getAdminUserStatisticApi = (options = {}) => adminApi.adminStatisticGetUserStatisticGET(options);
