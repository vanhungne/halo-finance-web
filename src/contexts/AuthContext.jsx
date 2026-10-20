import { useEffect, useState, useSyncExternalStore } from "react";
import { AuthContext } from "./AuthSessionContext.js";
import { authSession } from "../services/auth/session.js";
import FullPageLoader from "../components/common/FullPageLoader";

export function AuthProvider({ children }) {
  const session = useSyncExternalStore(authSession.subscribe, authSession.getSnapshot);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    void authSession.initialize().then(() => {
      const current = authSession.sync();
      if (current.kind === "authenticated" && current.expiresAt <= Date.now()) return authSession.refresh(current);
    }).catch(() => {}).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);
  useEffect(() => {
    if (session.kind !== "authenticated") return;
    const remaining = session.expiresAt - Date.now();
    const lead = Math.min(60_000, Math.max(1000, remaining / 5));
    const delay = Math.min(2_147_000_000, Math.max(0, remaining - lead));
    const timer = setTimeout(() => {
      void authSession.refresh({ contextId: session.contextId, accessToken: session.accessToken }).catch(() => {});
    }, delay);
    return () => clearTimeout(timer);
  }, [session.contextId, session.accessToken, session.expiresAt, session.kind]);

  return (
    <AuthContext.Provider
      value={{
        auth: session.auth,
        sessionId: session.kind === "authenticated" ? session.contextId : null,
        sessionError: session.errorCode,
        loading,
        login: authSession.login,
        verifyTwoFactor: authSession.verifyTwoFactor,
        logout: (callApi = true) => authSession.logout(callApi, session.contextId),
        refreshAccessToken: () => authSession.refresh(session),
      }}
    >
      {loading ? <FullPageLoader /> : children}
    </AuthContext.Provider>
  );
}
