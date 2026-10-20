import { useQuery } from "@tanstack/react-query";
import { LockKeyhole, ShieldCheck, TimerReset } from "lucide-react";
import { getAdminPlatformSecurityApi } from "../services/admin";
import { AdminV2PageHeader, AdminV2State } from "./AdminV2State";
import { AdminV2Panel, AdminV2StatusBadge } from "./AdminV2Primitives";
import { useAdminV2Capabilities } from "./AdminV2CapabilitiesContext";
import { adminQueryKey } from "./adminQueryClient";
import { useAdminLocale } from "./AdminV2LocaleContext";

const dateFormat = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });

export default function AdminV2PlatformPage() {
  const { t } = useAdminLocale();
  const capabilities = useAdminV2Capabilities();
  const actorId = capabilities?.data?.actorUserId;
  const enabled = capabilities?.status === "success" && capabilities.data?.modules?.some((module) => module.key === "admin.platform.read" && module.availability === "V2_READ");
  const query = useQuery({
    queryKey: adminQueryKey(actorId ?? "anonymous", "platform-security"),
    queryFn: ({ signal }) => getAdminPlatformSecurityApi({ signal }),
    enabled: Boolean(actorId && enabled),
  });
  const state = query.isPending ? "loading" : query.isError ? "error" : "success";
  const posture = query.data;
  const modules = capabilities?.data?.modules ?? [];

  const availabilityTone = (availability) => {
    if (availability === "V2_COMMAND" || availability === "V2_READ" || availability === "LEGACY_CONTRACT") return "success";
    if (availability === "CONTRACT_GAP") return "warning";
    return "danger";
  };

  return <div className="admin-v2-content">
    <AdminV2PageHeader title={t("platform.title")} description={t("platform.description")} freshness={posture?.asOf ? t("platform.asOf", { date: dateFormat.format(new Date(posture.asOf)) }) : undefined} />
    {!enabled && <AdminV2State title={t("platform.unavailableProjection")}>{t("platform.unavailableProjectionHelp")}</AdminV2State>}
    {enabled && state === "loading" && <AdminV2State title={t("platform.loading")}>{t("platform.loadingHelp")}</AdminV2State>}
    {enabled && state === "error" && <AdminV2State title={t("platform.unavailable")} tone="danger">{t("platform.unavailableHelp")}</AdminV2State>}
    {enabled && posture && <>
      <div className="admin-v2-metric-grid">
        <div className="admin-v2-metric"><div className="admin-v2-metric-label"><ShieldCheck size={15} aria-hidden="true" /> {t("platform.actorBoundary")}</div><div className="admin-v2-metric-value">{t("platform.verified")}</div></div>
        <div className="admin-v2-metric"><div className="admin-v2-metric-label"><LockKeyhole size={15} aria-hidden="true" /> {t("platform.secrets")}</div><div className="admin-v2-metric-value">{t("platform.redacted")}</div></div>
        <div className="admin-v2-metric"><div className="admin-v2-metric-label"><TimerReset size={15} aria-hidden="true" /> {t("platform.stepUp")}</div><div className="admin-v2-metric-value">{t("platform.gated")}</div></div>
      </div>
      <AdminV2Panel title={t("platform.policy")} meta={posture.capabilityContractVersion}>
        <div className="admin-v2-table-wrap"><table className="admin-v2-table"><tbody>
          <tr><th>{t("platform.actor")}</th><td className="admin-v2-mono">{posture.actorUserId}</td><td><AdminV2StatusBadge tone="success">{posture.authorizationBoundary}</AdminV2StatusBadge></td></tr>
          <tr><th>{t("platform.mutationIdempotency")}</th><td colSpan="2"><AdminV2StatusBadge tone={posture.idempotencyRequiredForMutations ? "success" : "danger"}>{posture.idempotencyRequiredForMutations ? t("platform.required") : t("platform.missing")}</AdminV2StatusBadge></td></tr>
          <tr><th>{t("platform.mutableVersion")}</th><td colSpan="2"><AdminV2StatusBadge tone={posture.versionRequiredForMutableResources ? "success" : "danger"}>{posture.versionRequiredForMutableResources ? t("platform.required") : t("platform.missing")}</AdminV2StatusBadge></td></tr>
          <tr><th>{t("platform.configurationValues")}</th><td colSpan="2"><AdminV2StatusBadge tone={posture.secretValuesRedacted ? "success" : "danger"}>{posture.secretValuesRedacted ? t("platform.redacted") : t("platform.exposed")}</AdminV2StatusBadge></td></tr>
        </tbody></table></div>
      </AdminV2Panel>
      <AdminV2Panel title={t("platform.legacy")} meta={t("platform.compatibility")}>
        <div className="admin-v2-table-wrap"><table className="admin-v2-table"><tbody><tr><th>{t("platform.configurationMutation")}</th><td className="admin-v2-mono">{posture.legacyConfigurationMutationRoute}</td></tr><tr><th>{t("platform.maintenanceMutation")}</th><td className="admin-v2-mono">{posture.legacyMaintenanceMutationRoute}</td></tr><tr><th>{t("platform.stepUpStatus")}</th><td className="admin-v2-mono">{posture.stepUpStatus}</td></tr></tbody></table></div>
      </AdminV2Panel>
      <AdminV2Panel title={t("platform.registry")} meta={`${modules.length} ${t("platform.registryMeta")}`}>
        <p className="admin-v2-muted">{t("platform.registryHelp")}</p>
        {modules.length === 0
          ? <AdminV2State title={t("platform.noMetadata")} tone="danger">{t("platform.noMetadataHelp")}</AdminV2State>
          : <div className="admin-v2-table-wrap"><table className="admin-v2-table"><thead><tr><th>{t("platform.module")}</th><th>{t("platform.actions")}</th><th>{t("platform.risk")}</th><th>{t("platform.availability")}</th></tr></thead><tbody>
            {modules.map((module) => <tr key={module.key}><td data-label={t("platform.module")} className="admin-v2-mono">{module.key}</td><td data-label={t("platform.actions")}>{(module.actions ?? []).join(", ") || "—"}</td><td data-label={t("platform.risk")}><AdminV2StatusBadge tone={module.risk === "R3" ? "danger" : module.risk === "R2" ? "warning" : "neutral"}>{module.risk}</AdminV2StatusBadge></td><td data-label={t("platform.availability")}><AdminV2StatusBadge tone={availabilityTone(module.availability)}>{module.availability ?? "UNKNOWN"}</AdminV2StatusBadge></td></tr>)}
          </tbody></table></div>}
      </AdminV2Panel>
    </>}
  </div>;
}
