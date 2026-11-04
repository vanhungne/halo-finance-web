import { AuthSessionError, EMPTY_SESSION, SESSION_EXCHANGE_LOCK, SESSION_STATE_LOCK, SESSION_STORAGE_KEY,
  inspectPair, parseSession, sessionFailure } from "./sessionState.js";

// One atomic existing-browser session record. Web Locks serialize exchanges
// across tabs; the separate short state lock lets logout fence an in-flight
// response immediately without waiting for network completion.
export function createSessionCoordinator({ storage, locks, request, decode, nonce, now = Date.now, onBoundary = () => {}, onCredentialChange = () => {} }) {
  let snapshot = Object.freeze({ ...EMPTY_SESSION, auth: null });
  let initialization, fatal, activeExchange, rotation;
  const listeners = new Set();
  const changed = () => new AuthSessionError("AUTH_SESSION_CHANGED");
  const locked = (name, work) => {
    if (!locks?.request) return Promise.reject(new AuthSessionError("AUTH_COORDINATION_UNAVAILABLE"));
    try { return Promise.resolve(locks.request(name, work)); }
    catch { return Promise.reject(new AuthSessionError("AUTH_COORDINATION_UNAVAILABLE")); }
  };
  const read = () => parseSession(storage.getItem(SESSION_STORAGE_KEY), decode, now);
  const publish = (record, errorCode) => {
    const previous = snapshot;
    const info = record.kind === "authenticated" ? inspectPair(record, decode, { now }) : null;
    snapshot = Object.freeze({ ...record, auth: info?.auth ?? null, expiresAt: info?.expiresAt,
      errorCode: errorCode ?? record.errorCode });
    const boundary = previous.contextId !== snapshot.contextId
      && (previous.kind !== "anonymous" || snapshot.kind !== "anonymous");
    if (activeExchange?.cancelOnBoundary && activeExchange.contextId !== snapshot.contextId) activeExchange.controller.abort();
    if (boundary) onBoundary();
    if (!boundary && previous.kind === "authenticated" && snapshot.kind === "authenticated" && previous.accessToken !== snapshot.accessToken) onCredentialChange();
    for (const listener of listeners) listener();
    return snapshot;
  };
  const poison = (error) => {
    fatal = error instanceof AuthSessionError ? error : new AuthSessionError("AUTH_STORAGE_UNAVAILABLE");
    return publish(EMPTY_SESSION, fatal.code);
  };
  const write = (record) => {
    try { storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(record)); }
    catch { poison(new AuthSessionError("AUTH_STORAGE_UNAVAILABLE")); throw fatal; }
    return publish(record);
  };
  const anonymous = (errorCode) => ({ v: 1, kind: "anonymous", contextId: nonce(), revision: nonce(), ...(errorCode ? { errorCode } : {}) });
  const sync = () => {
    if (fatal) return snapshot;
    try {
      const record = read();
      if (record.revision !== snapshot.revision || record.contextId !== snapshot.contextId) publish(record);
      return snapshot;
    } catch (error) { return poison(error); }
  };
  const initialize = () => initialization ??= locked(SESSION_STATE_LOCK, () => {
    let record;
    try { record = read(); }
    catch (error) { if (error instanceof AuthSessionError) record = EMPTY_SESSION; else throw error; }
    // Never reimport credentials written by an older bundle after a tombstone.
    // This format cutover requires one fresh login; no duplicated token store.
    storage.removeItem("access_token"); storage.removeItem("refresh_token");
    if (!record.contextId) return write(anonymous());
    return publish(record);
  }).catch((error) => { poison(error); throw fatal; });
  const state = (work) => locked(SESSION_STATE_LOCK, () => {
    if (fatal) throw fatal;
    let current;
    try { current = read(); } catch (error) { poison(error); throw fatal; }
    try { return work(current); } catch (error) {
      if (!(error instanceof AuthSessionError)) { poison(error); throw fatal; }
      throw error;
    }
  });
  const exchange = async (kind, contextId, data, accessToken) => {
    const entry = { contextId, controller: new AbortController(), cancelOnBoundary: kind !== "logout" };
    activeExchange = entry;
    try { return await request({ kind, data, accessToken, signal: entry.controller.signal }); }
    finally { if (activeExchange === entry) activeExchange = null; }
  };
  const invalidate = ({ contextId, accessToken, revision }, code = "AUTH_SESSION_EXPIRED") => state((current) => {
    if (current.contextId !== contextId || accessToken && current.accessToken !== accessToken
      || revision && current.revision !== revision) return publish(current);
    return write(anonymous(code));
  });

  const login = async (credentials) => {
    await initialize();
    const pending = await state(() => write({ ...anonymous(), kind: "pending" }));
    const payload = { email: credentials.email, password: credentials.password, rememberMe: credentials.rememberMe === true };
    try {
      const result = await locked(SESSION_EXCHANGE_LOCK, () => {
        if (sync().contextId !== pending.contextId) throw changed();
        return exchange("login", pending.contextId, payload);
      });
      if (result?.require2FA) {
        if (typeof result.challenge !== "string" || result.challenge.length > 8192 ||
          !["sms", "authenticator"].includes(result.twoFactorMethod))
          throw new AuthSessionError("AUTH_TWO_FACTOR_REQUIRED", 401);
        throw new AuthSessionError("AUTH_TWO_FACTOR_REQUIRED", 401, {
          challenge: result.challenge, expiresAt: result.challengeExpiresAt, method: result.twoFactorMethod,
        });
      }
      inspectPair(result, decode, { now, allowExpired: false });
      const accepted = await state((current) => {
        if (current.contextId !== pending.contextId || current.kind !== "pending") throw changed();
        return write({ v: 1, kind: "authenticated", contextId: pending.contextId, revision: nonce(),
          accessToken: result.accessToken, refreshToken: result.refreshToken });
      });
      return accepted.auth;
    } catch (error) {
      const bounded = sessionFailure(error);
      await invalidate({ contextId: pending.contextId }, bounded.code);
      throw bounded;
    } finally { payload.password = ""; }
  };

  const verifyTwoFactor = async ({ challenge, otpCode }) => {
    await initialize();
    if (typeof challenge !== "string" || challenge.length > 8192 || typeof otpCode !== "string" || !/^\d{6}$/.test(otpCode))
      throw new AuthSessionError("AUTH_TWO_FACTOR_INVALID", 401);
    const pending = await state(() => write({ ...anonymous(), kind: "pending" }));
    try {
      const result = await locked(SESSION_EXCHANGE_LOCK, () => {
        if (sync().contextId !== pending.contextId) throw changed();
        return exchange("verify-2fa", pending.contextId, { challenge, otpCode });
      });
      inspectPair(result, decode, { now, allowExpired: false });
      const accepted = await state((current) => {
        if (current.contextId !== pending.contextId || current.kind !== "pending") throw changed();
        return write({ v: 1, kind: "authenticated", contextId: pending.contextId, revision: nonce(),
          accessToken: result.accessToken, refreshToken: result.refreshToken });
      });
      return accepted.auth;
    } catch (error) {
      const bounded = error instanceof AuthSessionError ? error
        : error?.response?.status === 429 ? new AuthSessionError("AUTH_TWO_FACTOR_LOCKED", 429)
          : error?.response?.status === 401 || error?.response?.status === 404
            ? new AuthSessionError("AUTH_TWO_FACTOR_INVALID", error.response.status)
            : sessionFailure(error, "AUTH_TWO_FACTOR_INVALID");
      await invalidate({ contextId: pending.contextId }, bounded.code);
      throw bounded;
    }
  };

  const refresh = (expected) => initialize().then(() => {
    const target = expected ?? sync();
    if (rotation?.contextId === target.contextId && rotation.accessToken === target.accessToken) return rotation.promise;
    const promise = locked(SESSION_EXCHANGE_LOCK, async () => {
      const before = sync();
      if (before.kind !== "authenticated" || before.contextId !== target.contextId) throw changed();
      if (before.accessToken !== target.accessToken && before.expiresAt > now()) return before.accessToken;
      try {
        const result = await exchange("refresh", before.contextId, { refreshToken: before.refreshToken });
        const prior = inspectPair(before, decode, { now });
        const next = inspectPair(result, decode, { now, allowExpired: false });
        if (prior.userId !== next.userId || prior.epoch !== next.epoch) throw new AuthSessionError("AUTH_INVALID_SESSION_RESPONSE", 401);
        const accepted = await state((current) => {
          if (current.contextId !== before.contextId || current.revision !== before.revision) throw changed();
          return write({ v: 1, kind: "authenticated", contextId: before.contextId, revision: nonce(),
            accessToken: result.accessToken, refreshToken: result.refreshToken });
        });
        return accepted.accessToken;
      } catch (error) {
        const bounded = sessionFailure(error, "AUTH_SESSION_EXPIRED");
        await invalidate(before, bounded.code);
        throw bounded;
      }
    });
    const entry = { contextId: target.contextId, accessToken: target.accessToken, promise };
    rotation = entry;
    const complete = () => { if (rotation === entry) rotation = null; };
    void promise.then(complete, complete);
    return promise;
  });

  const logout = async (callApi = true, expectedContextId = snapshot.contextId) => {
    const captured = sync();
    if (captured.contextId !== expectedContextId) return { serverRevoked: false, superseded: true };
    let cleared;
    try {
      await initialize(); cleared = await state((current) => {
        if (current.contextId !== captured.contextId) throw changed();
        return write(anonymous());
      });
    } catch (error) {
      if (error.code === "AUTH_SESSION_CHANGED") { sync(); return { serverRevoked: false, superseded: true }; }
      poison(error);
    }
    let serverRevoked = false;
    if (callApi && captured.accessToken) {
      try {
        await locked(SESSION_EXCHANGE_LOCK, () => exchange("logout", cleared?.contextId, undefined, captured.accessToken));
        serverRevoked = true;
      } catch { /* Return explicit uncertainty; never log a credential-bearing Axios error. */ }
    }
    if (callApi && captured.accessToken && !serverRevoked && cleared && !fatal)
      await state((current) => current.contextId === cleared.contextId ? write({ ...current, errorCode: "AUTH_LOGOUT_UNCONFIRMED" }) : publish(current));
    return { serverRevoked };
  };

  return { initialize, sync, login, verifyTwoFactor, refresh, logout, invalidate,
    getSnapshot: () => snapshot,
    subscribe: (listener) => { listeners.add(listener); return () => listeners.delete(listener); } };
}
