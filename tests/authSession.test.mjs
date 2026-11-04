import test from "node:test";
import assert from "node:assert/strict";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createSessionCoordinator } from "../src/services/auth/sessionCoordinator.js";
import { SESSION_STORAGE_KEY } from "../src/services/auth/sessionState.js";
import { installSessionInterceptors } from "../src/services/auth/sessionInterceptors.js";
import { authSessionMessage } from "../src/services/auth/sessionMessages.js";

const now = () => 1_792_123_200_000;
let serial = 0;
const nonce = () => `synthetic-session-${++serial}`;
const jwt = (claims) => `${Buffer.from('{"alg":"none"}').toString("base64url")}.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.fixture`;
const pair = (user = "admin-a", epoch = "epoch-a", role = "Admin", suffix = nonce()) => ({
  accessToken: jwt({ sub: user, role, auth_version: epoch, exp: now() / 1000 + 900, jti: suffix }), refreshToken: `synthetic-refresh-${suffix}`,
});
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const observe = (promise) => promise.then((value) => ({ value }), (error) => ({ error }));
const memory = () => {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
};
// Models only the platform mutex contract; browser Web Locks are qualified separately.
const mutexes = () => {
  const tails = new Map();
  return { request(name, work) { const result = (tails.get(name) ?? Promise.resolve()).then(work); tails.set(name, result.then(() => {}, () => {})); return result; } };
};
function harness(request, shared = {}) {
  const storage = shared.storage ?? memory(); const locks = shared.locks ?? mutexes(); const boundaries = [];
  const session = createSessionCoordinator({ storage, locks, request, decode: jwtDecode, nonce, now, onBoundary: () => boundaries.push(true) });
  const client = axios.create({ baseURL: "https://api.example.invalid/api/" });
  installSessionInterceptors(client, session, { origin: "https://web.example.invalid" });
  return { session, client, storage, locks, boundaries };
}
const login = (session) => session.login({ email: "synthetic@example.invalid", password: "synthetic-password", rememberMe: true });
const reply = (config, status = 200, data = {}) => ({ config, status, data, statusText: "fixture", headers: {} });
const deny = (config, status = 401) => Promise.reject(new axios.AxiosError("Synthetic denial", "ERR_BAD_REQUEST", config, undefined, reply(config, status)));

test("proactive rotation and simultaneous401 commands share one exchange and retain command identity", { timeout: 4000 }, async () => {
  const old = pair(), next = pair(); const entered = deferred(), release = deferred(), requestsReady = deferred(), deliver401 = deferred();
  let rotations = 0, oldRequests = 0, effects = 0;
  const { session, client } = harness(async ({ kind }) => {
    if (kind === "login") return old;
    rotations++; entered.resolve(); await release.promise; return next;
  });
  await login(session);
  client.defaults.adapter = async (config) => {
    if (config.headers.get("Authorization") === `Bearer ${old.accessToken}`) {
      if (++oldRequests === 3) requestsReady.resolve(); await deliver401.promise; return deny(config);
    }
    assert.ok(config.headers.get("Authorization") === `Bearer ${next.accessToken}`, "Only current access may retry");
    if (config.method === "patch") {
      assert.equal(config.headers.get("Idempotency-Key"), "fixture-intent"); assert.equal(config.headers.get("If-Match"), "4");
      assert.equal(config.data, '{"desiredState":"SUSPENDED"}'); effects++;
    }
    return reply(config);
  };
  const commands = [client.get("/admin/accounts"), client.get("/admin/audit"), client.patch("/admin/accounts/fixture/lifecycle",
    { desiredState: "SUSPENDED" }, { headers: { "Idempotency-Key": "fixture-intent", "If-Match": "4" } })];
  await requestsReady.promise;
  const proactive = session.refresh(); await entered.promise;
  deliver401.resolve(); release.resolve(); await Promise.all([...commands, proactive]);
  assert.equal(rotations, 1); assert.equal(effects, 1);
  assert.ok(session.getSnapshot().refreshToken === next.refreshToken, "Atomic pair must be the rotated pair");
});

test("logout fences a late successful refresh even when the transport ignores abort", { timeout: 3000 }, async () => {
  const entered = deferred(), release = deferred(); const old = pair();
  const { session, storage } = harness(async ({ kind }) => { if (kind === "login") return old; entered.resolve(); return release.promise; });
  await login(session); const pending = observe(session.refresh()); await entered.promise;
  await session.logout(false);
  const stored = JSON.parse(storage.getItem(SESSION_STORAGE_KEY)); assert.equal(stored.kind, "anonymous"); assert.equal(stored.accessToken, undefined);
  release.resolve(pair()); const result = await pending;
  assert.equal(result.error.code, "AUTH_SESSION_CHANGED"); assert.equal(session.getSnapshot().auth, null);
});

test("old refresh refusal cannot erase a newer login intent or account", { timeout: 3000 }, async () => {
  const entered = deferred(), release = deferred(); let logins = 0;
  const { session } = harness(async ({ kind }) => {
    if (kind === "login") return ++logins === 1 ? pair() : pair("admin-b", "epoch-b");
    entered.resolve(); return release.promise;
  });
  await login(session); const rotating = observe(session.refresh()); await entered.promise;
  const nextLogin = login(session); await new Promise(setImmediate);
  release.reject({ response: { status: 401 }, config: { password: "must-not-escape" } });
  await rotating; await nextLogin; assert.equal(session.getSnapshot().auth.userId, "admin-b");
});

test("two tabs rotate a shared credential once, including delayed storage notifications", { timeout: 3000 }, async () => {
  const storage = memory(), locks = mutexes(); const entered = deferred(), release = deferred(); let calls = 0;
  const request = async ({ kind }) => { if (kind === "login") return pair(); calls++; entered.resolve(); return release.promise; };
  const a = harness(request, { storage, locks }).session, b = harness(request, { storage, locks }).session;
  await login(a); await b.initialize(); const first = a.refresh(); await entered.promise; const second = b.refresh();
  release.resolve(pair()); const results = await Promise.all([first, second]);
  assert.ok(results[0] === results[1], "Queued tab uses the committed rotation"); assert.equal(calls, 1);
});

test("cross-tab logout wins over a pending rotation without waiting on its network mutex", { timeout: 3000 }, async () => {
  const storage = memory(), locks = mutexes(); const entered = deferred(), release = deferred();
  const request = async ({ kind }) => { if (kind === "login") return pair(); entered.resolve(); return release.promise; };
  const a = harness(request, { storage, locks }).session, b = harness(request, { storage, locks }).session;
  await login(a); await b.initialize(); const pending = observe(a.refresh()); await entered.promise;
  await b.logout(false); a.sync(); release.resolve(pair()); await pending;
  assert.equal(a.sync().auth, null); assert.equal(b.sync().auth, null);
});

for (const status of [200, 401, 403]) test(`old account HTTP${status} cannot project data, refresh or close a newer account`, async () => {
  const arrived = deferred(), release = deferred(); let logins = 0, rotations = 0;
  const { session, client } = harness(async ({ kind }) => { if (kind === "login") return pair(++logins === 1 ? "admin-a" : "admin-b"); rotations++; return pair(); });
  await login(session);
  client.defaults.adapter = async (config) => { arrived.resolve(); await release.promise; return status === 200 ? reply(config, 200, { private: "old-account" }) : deny(config, status); };
  const pending = observe(client.get("/admin/reports")); await arrived.promise; await login(session); release.resolve();
  const result = await pending; assert.ok(axios.isCancel(result.error)); assert.equal(rotations, 0); assert.equal(session.getSnapshot().auth.userId, "admin-b");
});

test("a repeated401 gets one replay and then closes the current session", async () => {
  let rotations = 0, attempts = 0;
  const { session, client } = harness(async ({ kind }) => { if (kind === "refresh") rotations++; return pair(); });
  await login(session); client.defaults.adapter = (config) => { attempts++; return deny(config); };
  const result = await observe(client.get("/admin/accounts")); assert.ok(axios.isCancel(result.error));
  assert.equal(attempts, 2); assert.equal(rotations, 1); assert.equal(session.getSnapshot().auth, null);
});

for (const status of [403, 409, 429, 500, 503]) test(`HTTP${status} never automatically replays a command`, async () => {
  let rotations = 0, attempts = 0;
  const { session, client } = harness(async ({ kind }) => { if (kind === "refresh") rotations++; return pair(); });
  await login(session); client.defaults.adapter = (config) => { attempts++; return deny(config, status); };
  await observe(client.patch("/admin/configuration/v2/fixture", {})); assert.equal(attempts, 1); assert.equal(rotations, 0);
});

test("origin fencing and anonymous requests cannot leak a stale default Authorization header", async () => {
  let calls = 0; const { session, client } = harness(async () => pair()); await session.initialize();
  client.defaults.headers.common.Authorization = "Bearer synthetic-stale";
  client.defaults.adapter = async (config) => { calls++; assert.equal(config.headers.get("Authorization"), undefined); return reply(config); };
  await client.get("/blog");
  for (const url of ["https://outside.example.invalid/api/admin", "/../outside", "//outside.example.invalid/api/admin"])
    assert.equal((await observe(client.get(url))).error.code, "AUTH_API_ORIGIN_DENIED");
  assert.equal(calls, 1);
});

test("legacy pairs are discarded once and never rebound after an anonymous tombstone", async () => {
  const storage = memory(); storage.setItem("access_token", "synthetic-legacy"); storage.setItem("refresh_token", "synthetic-legacy");
  const first = harness(async () => pair(), { storage }).session; await first.initialize();
  assert.equal(first.getSnapshot().auth, null); assert.equal(storage.getItem("refresh_token"), null);
  storage.setItem("access_token", "synthetic-late-old-bundle"); storage.setItem("refresh_token", "synthetic-late-old-bundle");
  const second = harness(async () => pair(), { storage }).session; await second.initialize(); assert.equal(second.getSnapshot().auth, null);
});

test("unsupported cross-tab coordination fails sign-in closed with a bounded error", async () => {
  let calls = 0; const { session } = harness(async () => { calls++; return pair(); }, { locks: {} });
  const result = await observe(login(session)); assert.equal(result.error.code, "AUTH_COORDINATION_UNAVAILABLE"); assert.equal(calls, 0);
});

test("storage failure clears local authority and still attempts captured-token server logout", async () => {
  const storage = memory(); let fail = false, revocations = 0;
  const realSet = storage.setItem; storage.setItem = (key, value) => { if (fail) throw new Error("Synthetic storage refusal"); return realSet(key, value); };
  const { session } = harness(async ({ kind, accessToken }) => { if (kind === "logout") { revocations++; assert.ok(!!accessToken); return {}; } return pair(); }, { storage });
  await login(session); fail = true; const result = await session.logout();
  assert.equal(session.getSnapshot().auth, null); assert.equal(session.getSnapshot().errorCode, "AUTH_STORAGE_UNAVAILABLE");
  assert.equal(revocations, 1); assert.equal(result.serverRevoked, true);
});

test("uncertain logout is explicit and its late response cannot clear a new login", async () => {
  const entered = deferred(), release = deferred(); let logins = 0;
  const { session } = harness(async ({ kind }) => { if (kind === "logout") { entered.resolve(); return release.promise; } return pair(++logins === 1 ? "admin-a" : "admin-b"); });
  await login(session); const leaving = session.logout(); await entered.promise;
  assert.equal(session.getSnapshot().auth, null); const entering = login(session); await new Promise(setImmediate);
  release.reject({ config: { headers: { Authorization: "must-not-escape" } } });
  assert.equal((await leaving).serverRevoked, false); await entering;
  assert.equal(session.getSnapshot().auth.userId, "admin-b"); assert.equal(session.getSnapshot().errorCode, undefined);
});

for (const variant of ["other-user", "other-epoch", "expired", "missing"]) test(`invalid refresh response ${variant} cannot become current authority`, async () => {
  const bad = variant === "other-user" ? pair("other-admin") : variant === "other-epoch" ? pair("admin-a", "other-epoch")
    : variant === "expired" ? { ...pair(), accessToken: jwt({ sub: "admin-a", role: "Admin", auth_version: "epoch-a", exp: 1 }) } : {};
  const { session } = harness(async ({ kind }) => kind === "login" ? pair() : bad);
  await login(session); const result = await observe(session.refresh()); assert.equal(result.error.code, "AUTH_INVALID_SESSION_RESPONSE");
  assert.equal(session.getSnapshot().auth, null);
});

for (const variant of ["member", "two-factor", "network"]) test(`login refusal ${variant} never persists credentials or exposes raw errors`, async () => {
  const secret = "must-not-escape";
  const { session, storage } = harness(async () => {
    if (variant === "member") return pair("member", "epoch", "Member");
    if (variant === "two-factor") return { require2FA: true };
    throw { config: { password: secret, headers: { Authorization: secret } }, message: secret };
  });
  const result = await observe(login(session)); assert.equal(session.getSnapshot().auth, null);
  assert.equal(JSON.parse(storage.getItem(SESSION_STORAGE_KEY)).accessToken, undefined);
  assert.ok(!JSON.stringify(result.error).includes(secret)); assert.ok(!result.error.message.includes(secret));
  for (const locale of ["vi", "en"]) assert.ok(typeof authSessionMessage(result.error.code, locale) === "string");
});

test("password login leaves no authority until the bounded two-factor challenge is verified", async () => {
  const challenge = "protected-challenge-fixture"; let verified = 0;
  const { session, storage } = harness(async ({ kind, data }) => {
    if (kind === "login") return { require2FA: true, challenge, challengeExpiresAt: new Date(now() + 300_000).toISOString(), twoFactorMethod: "authenticator" };
    assert.equal(kind, "verify-2fa"); assert.deepEqual(data, { challenge, otpCode: "123456" }); verified++;
    return pair("admin-2fa", "epoch-2fa");
  });
  const loginResult = await observe(login(session));
  assert.equal(loginResult.error.code, "AUTH_TWO_FACTOR_REQUIRED"); assert.equal(loginResult.error.details.challenge, challenge);
  assert.equal(session.getSnapshot().auth, null); assert.equal(JSON.parse(storage.getItem(SESSION_STORAGE_KEY)).accessToken, undefined);
  await session.verifyTwoFactor({ challenge: loginResult.error.details.challenge, otpCode: "123456" });
  assert.equal(verified, 1); assert.equal(session.getSnapshot().auth.userId, "admin-2fa");
});

test("two-factor refusal remains a bounded MFA error and never persists a pair", async () => {
  const { session, storage } = harness(async ({ kind }) => {
    if (kind === "login") return { require2FA: true, challenge: "protected-challenge-fixture", twoFactorMethod: "sms" };
    throw { response: { status: 401 }, message: "must-not-escape" };
  });
  const pending = await observe(login(session));
  const result = await observe(session.verifyTwoFactor({ challenge: pending.error.details.challenge, otpCode: "123456" }));
  assert.equal(result.error.code, "AUTH_TWO_FACTOR_INVALID");
  assert.equal(JSON.parse(storage.getItem(SESSION_STORAGE_KEY)).accessToken, undefined);
});

test("aborting one request during rotation does not abort shared refresh or replay that request", { timeout: 3000 }, async () => {
  const old = pair(), fresh = pair(); const entered = deferred(), release = deferred(); let attempts = 0;
  const { session, client } = harness(async ({ kind }) => { if (kind === "login") return old; entered.resolve(); return release.promise; });
  await login(session);
  client.defaults.adapter = (config) => { attempts++; return config.headers.get("Authorization") === `Bearer ${old.accessToken}` ? deny(config) : Promise.resolve(reply(config)); };
  const controller = new AbortController(); const canceledRequest = observe(client.get("/admin/accounts", { signal: controller.signal }));
  await entered.promise; const other = client.get("/admin/audit"); controller.abort(); release.resolve(fresh);
  assert.ok(axios.isCancel((await canceledRequest).error)); await other;
  assert.equal(attempts, 3); assert.equal(session.getSnapshot().kind, "authenticated");
});

test("a pinned command from a previous sign-in cannot be resent even for the same account", async () => {
  let sends = 0; const { session, client } = harness(async () => pair()); await login(session);
  const originalContext = session.getSnapshot().contextId;
  await login(session); client.defaults.adapter = async (config) => { sends++; return reply(config); };
  const result = await observe(client.patch("/admin/configuration/v2/fixture", { privateDraft: "old" }, { _authContextId: originalContext }));
  assert.ok(axios.isCancel(result.error)); assert.equal(sends, 0);
});

test("message lookup never renders inherited object keys or arbitrary exception content", () => {
  for (const key of ["__proto__", "constructor", "toString", "unknown"]) for (const locale of ["vi", "en"])
    assert.equal(typeof authSessionMessage(key, locale), "string");
});

for (const actor of ["admin-a", "admin-b"]) test(`a stale logout callback cannot revoke a later ${actor} sign-in`, async () => {
  const storage = memory(), locks = mutexes(); let calls = 0, logins = 0;
  const request = async ({ kind }) => { if (kind === "logout") { calls++; return {}; } return pair(++logins === 1 ? "admin-a" : actor); };
  const a = harness(request, { storage, locks }).session, b = harness(request, { storage, locks }).session;
  await login(a); const oldContext = a.getSnapshot().contextId; await b.initialize(); await login(b);
  const result = await a.logout(true, oldContext);
  assert.equal(result.superseded, true); assert.equal(calls, 0); assert.equal(b.sync().auth.userId, actor);
});

test("corrupt storage during an existing session removes cached authority before a new action", async () => {
  const { session, storage } = harness(async () => pair()); await login(session);
  storage.setItem(SESSION_STORAGE_KEY, "{malformed"); const result = await observe(login(session));
  assert.equal(result.error.code, "AUTH_INVALID_SESSION_RESPONSE"); assert.equal(session.getSnapshot().auth, null);
});

test("refresh401 is presented as session expiry rather than a new password failure", async () => {
  const { session } = harness(async ({ kind }) => { if (kind === "login") return pair(); throw { response: { status: 401 } }; });
  await login(session); const result = await observe(session.refresh());
  assert.equal(result.error.code, "AUTH_SESSION_EXPIRED"); assert.equal(session.getSnapshot().errorCode, "AUTH_SESSION_EXPIRED");
});

for (const variant of ["legacy-write", "proof-write"]) test(`${variant}401 cannot replay a mutation after rotating its credential`, async () => {
  const old = pair(), fresh = pair(); let attempts = 0, rotations = 0;
  const { session, client } = harness(async ({ kind }) => { if (kind === "refresh") { rotations++; return fresh; } return old; });
  await login(session); client.defaults.adapter = (config) => { attempts++; return deny(config); };
  const headers = variant === "proof-write" ? { "Idempotency-Key": "fixture-key", "Admin-Step-Up": "fixture-proof" } : {};
  await observe(client.post(variant === "proof-write" ? "/admin/configuration/v2" : "/transaction", {}, { headers }));
  assert.equal(attempts, 1); assert.equal(rotations, 1);
});

test("a rotated credential cannot submit verification or resend its old proof", async () => {
  let calls = 0; const { session, client } = harness(async () => pair()); await login(session);
  const expected = session.getSnapshot().revision; const context = session.getSnapshot().contextId; await session.refresh();
  client.defaults.adapter = async (config) => { calls++; return reply(config); };
  const result = await observe(client.post("/admin/step-up", { challenge: "fixture" }, { _authExpectedRevision: expected, _authContextId: context }));
  assert.ok(axios.isCancel(result.error)); assert.equal(calls, 0); assert.equal(session.getSnapshot().contextId, context);
});

test("a refresh refusal from an old request cannot broadcast401 authority denial to a new login", { timeout: 3000 }, async () => {
  const entered = deferred(), release = deferred(); let logins = 0;
  const { session, client } = harness(async ({ kind }) => {
    if (kind === "login") return pair(++logins === 1 ? "admin-a" : "admin-b");
    entered.resolve(); return release.promise;
  });
  await login(session); client.defaults.adapter = (config) => deny(config);
  const oldRequest = observe(client.get("/admin/accounts")); await entered.promise;
  const nextLogin = login(session); await new Promise(setImmediate);
  release.reject({ response: { status: 401 } }); await nextLogin;
  const result = await oldRequest;
  assert.ok(axios.isCancel(result.error)); assert.equal(result.error.response, undefined);
  assert.equal(session.getSnapshot().auth.userId, "admin-b");
});
