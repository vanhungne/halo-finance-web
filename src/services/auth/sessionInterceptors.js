import axios from "axios";
import { AuthSessionError } from "./sessionState.js";

const canceled = () => new axios.CanceledError("The authentication context changed.");
const bearer = (config) => axios.AxiosHeaders.from(config.headers).get("Authorization");

export function installSessionInterceptors(client, session, { origin = globalThis.location?.origin ?? "http://localhost" } = {}) {
  const base = new URL(client.defaults.baseURL ?? "/api/", origin);
  const prefix = base.pathname.replace(/\/?$/, "/");
  const assertContext = (config) => {
    const current = session.sync();
    if (config.signal?.aborted || config._authContextId !== current.contextId) throw canceled();
    return current;
  };
  const requestId = client.interceptors.request.use(async (config) => {
    await session.initialize().catch(() => {});
    const target = new URL(client.getUri(config), origin);
    if (target.origin !== base.origin || !target.pathname.startsWith(prefix) || target.username || target.password || target.hash)
      throw new AuthSessionError("AUTH_API_ORIGIN_DENIED");
    const current = session.sync();
    if (config.signal?.aborted || "_authContextId" in config && config._authContextId !== current.contextId) throw canceled();
    if (config._authExpectedRevision !== undefined && config._authExpectedRevision !== current.revision) throw canceled();
    config._authContextId = current.contextId;
    config._authRequestRevision = current.revision;
    config.headers = axios.AxiosHeaders.from(config.headers);
    config.headers.delete("Authorization");
    if (current.kind === "authenticated") config.headers.set("Authorization", `Bearer ${current.accessToken}`);
    return config;
  });
  const responseId = client.interceptors.response.use((response) => {
    assertContext(response.config);
    return response;
  }, async (error) => {
    const config = error.config;
    if (!config) throw error;
    const current = assertContext(config);
    const sent = bearer(config);
    if (error.response?.status !== 401 || !sent || current.kind !== "authenticated") throw error;
    if (config._authRetried) {
      if (sent !== `Bearer ${current.accessToken}`) throw canceled();
      await session.invalidate({ contextId: current.contextId, accessToken: current.accessToken });
      assertContext(config);
      throw error;
    }
    config._authRetried = true;
    try { await session.refresh({ contextId: current.contextId, accessToken: sent.slice("Bearer ".length) }); }
    catch (failure) {
      // A terminal refresh can clear its own session or lose to another login.
      // Never let its401 be broadcast as authority denial for that newer view.
      assertContext(config);
      if (failure.code === "AUTH_SESSION_CHANGED") throw canceled();
      throw failure;
    }
    assertContext(config);
    const method = (config.method ?? "get").toLowerCase();
    const path = new URL(client.getUri(config), origin).pathname;
    const safeRead = ["get", "head", "options"].includes(method);
    const durableAdmin = path.startsWith(`${prefix}admin/`) && !!axios.AxiosHeaders.from(config.headers).get("Idempotency-Key");
    if ((!safeRead && !durableAdmin) || axios.AxiosHeaders.from(config.headers).has("Admin-Step-Up") || config._authExpectedRevision !== undefined) throw error;
    // Preserve durable command identity/body/signal. Legacy writes and proofs
    // are never automatically replayed with a different access credential.
    return client(config);
  });
  return () => { client.interceptors.request.eject(requestId); client.interceptors.response.eject(responseId); };
}
