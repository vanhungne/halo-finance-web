import { useContext, useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "../contexts/AuthSessionContext.js";
import { createAdminQueryClient } from "./adminQueryClient";
import { adminRecoveryJournal } from "./adminRecoveryJournal";
import { AdminV2State } from "./AdminV2State";
import AdminStepUpDialog from "./AdminStepUpDialog";
import { useAdminLocale } from "./AdminV2LocaleContext";

function SessionQueries({ children, actor, onLogout }) {
  const { t, locale } = useAdminLocale();
  const [client, setClient] = useState(createAdminQueryClient);
  const [denied, setDenied] = useState(false);
  useEffect(() => {
    try { adminRecoveryJournal.bindActor(actor); } catch { /* Recovery surfaces block commands when metadata cannot be read. */ }
    const clear = () => {
      // Cancel first so consumed Axios abort signals stop old session requests.
      void client.cancelQueries();
      client.clear();
    };
    window.addEventListener("auth:logout", clear);
    window.addEventListener("auth:session-cleared", clear);
    const authorityDenied = () => {
      clear();
      try { adminRecoveryJournal.clear(); } catch { /* Storage failure remains fail-closed on the next session. */ }
      setDenied(true);
    };
    window.addEventListener("admin:authority-denied", authorityDenied);
    return () => {
      window.removeEventListener("auth:logout", clear);
      window.removeEventListener("auth:session-cleared", clear);
      window.removeEventListener("admin:authority-denied", authorityDenied);
      clear();
    };
  }, [client, actor]);
  if (denied) return <div className="admin-v2-root" lang={locale} data-admin-theme={typeof document !== "undefined" && document.documentElement.dataset.adminTheme === "dark" ? "dark" : "light"}><main className="admin-v2-content"><AdminV2State title={t("authority.title")} tone="danger"
    action={<div className="admin-v2-dialog-actions"><button type="button" className="admin-v2-primary-button" onClick={() => { setClient(createAdminQueryClient()); setDenied(false); }}>{t("authority.retry")}</button>{onLogout && <button type="button" className="admin-v2-text-button" onClick={() => { void onLogout(); }}>{t("authority.logout")}</button>}</div>}>
    {t("authority.message")}
  </AdminV2State></main></div>;
  return <QueryClientProvider client={client}>{children}<AdminStepUpDialog /></QueryClientProvider>;
}

export default function AdminV2QueryProvider({ children }) {
  const { auth, logout, sessionId } = useContext(AuthContext);
  // No token, email, financial value or persisted cache is used as an identity.
  return <SessionQueries actor={auth?.userId} onLogout={logout} key={`${sessionId ?? auth?.userId ?? "anonymous"}:${auth?.roleName ?? "none"}`}>{children}</SessionQueries>;
}
