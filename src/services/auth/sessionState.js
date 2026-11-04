export const SESSION_STORAGE_KEY = "halo.auth.session.v1";
export const SESSION_STATE_LOCK = "halo.auth.state.v1";
export const SESSION_EXCHANGE_LOCK = "halo.auth.exchange.v1";
export const EMPTY_SESSION = Object.freeze({ v: 1, kind: "anonymous", contextId: null, revision: null });

export class AuthSessionError extends Error {
  constructor(code, status, details) {
    super(code);
    this.name = "AuthSessionError";
    this.code = code;
    if (status) this.response = { status, data: { errorCode: code } };
    if (details && typeof details === "object") this.details = details;
  }
}

export function sessionFailure(error, fallback = "AUTH_EXCHANGE_UNCERTAIN") {
  if (error instanceof AuthSessionError) return error;
  const status = error?.response?.status;
  return new AuthSessionError(status === 429 ? "AUTH_RATE_LIMITED" : status === 403 ? "AUTH_ACCOUNT_UNAVAILABLE"
    : status === 401 || status === 404 ? fallback === "AUTH_SESSION_EXPIRED" ? fallback : "AUTH_CREDENTIALS_REJECTED" : fallback,
  status >= 400 && status < 500 ? status : undefined);
}

export function inspectPair(pair, decode, { now, allowExpired = true } = {}) {
  if (typeof pair?.accessToken !== "string" || pair.accessToken.length > 32768 || typeof pair.refreshToken !== "string"
    || !pair.refreshToken || pair.refreshToken.length > 512) throw new AuthSessionError("AUTH_INVALID_SESSION_RESPONSE", 401);
  let claims;
  try { claims = decode(pair.accessToken); } catch { throw new AuthSessionError("AUTH_INVALID_SESSION_RESPONSE", 401); }
  if (!claims || typeof claims !== "object" || Array.isArray(claims)) throw new AuthSessionError("AUTH_INVALID_SESSION_RESPONSE", 401);
  const userId = claims.sub ?? claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  const roles = claims.role ?? claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  if (typeof userId !== "string" || !userId || typeof claims.auth_version !== "string" || !claims.auth_version
    || !Number.isFinite(claims.exp) || claims.exp <= 0 || !Number.isFinite(claims.exp * 1000)
    || !allowExpired && claims.exp * 1000 <= now()) throw new AuthSessionError("AUTH_INVALID_SESSION_RESPONSE", 401);
  if (!(Array.isArray(roles) ? roles : [roles]).includes("Admin")) throw new AuthSessionError("AUTH_ADMIN_REQUIRED", 403);
  return { userId, epoch: claims.auth_version, expiresAt: claims.exp * 1000, auth: Object.freeze({
    isLoggedIn: true, userId, roleName: "Admin",
    email: claims.email ?? claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
    fullName: claims.name ?? claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"], avatar: claims.avatar,
  }) };
}

export function parseSession(raw, decode, now) {
  if (raw === null) return EMPTY_SESSION;
  try {
    const value = JSON.parse(raw);
    if (value.v !== 1 || !["anonymous", "pending", "authenticated"].includes(value.kind)
      || typeof value.contextId !== "string" || !value.contextId || value.contextId.length > 128
      || typeof value.revision !== "string" || !value.revision || value.revision.length > 128) throw new Error();
    if (value.kind === "authenticated") inspectPair(value, decode, { now });
    else if (value.accessToken || value.refreshToken) throw new Error();
    return value;
  } catch { throw new AuthSessionError("AUTH_INVALID_SESSION_RESPONSE", 401); }
}
