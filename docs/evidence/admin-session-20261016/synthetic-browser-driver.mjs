import { chromium } from "file:///C:/Users/ACER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

const origin = "http://127.0.0.1:42576";
const artifactRoot = "C:/Users/ACER/Documents/Codex/2026-10-14/new-chat";
const actorA = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", actorB = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const gate = () => { let resolve; const promise = new Promise((yes) => { resolve = yes; }); return { promise, resolve }; };
const poll = async (read, description, timeout = 15_000) => {
  const end = Date.now() + timeout;
  while (Date.now() < end) { if (await read()) return; await new Promise((yes) => setTimeout(yes, 25)); }
  throw new Error(`Fixture condition not reached: ${description}`);
};
let sequence = 0, automaticCycles = null;
const pair = (actor) => ({ accessToken: `${Buffer.from('{"alg":"none"}').toString("base64url")}.${Buffer.from(JSON.stringify({
  sub: actor, role: "Admin", auth_version: `epoch-${actor}`, exp: Math.floor(Date.now() / 1000) + (automaticCycles !== null && automaticCycles < 2 ? 10 : 900), jti: `fixture-${++sequence}`,
})).toString("base64url")}.fixture`, refreshToken: `synthetic-refresh-${sequence}` });
const checks = [], pageErrors = [];
let credentialLogDetected = false, refreshCalls = 0, configurationCalls = 0;
let current, refreshGate, refreshEntered, readGate, readEntered, proofGate, proofEntered, logoutGate, logoutEntered, refuseRefresh = false;
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
try {
  const context = await browser.newContext();
  context.on("page", (page) => {
    page.on("pageerror", (error) => pageErrors.push(error.name));
    page.on("console", (message) => { if (/Bearer |synthetic-refresh-|fixture-only-password/.test(message.text())) credentialLogDetected = true; });
  });
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) return route.abort();
    if (!url.pathname.startsWith("/api/")) return route.continue();
    const body = route.request().postDataJSON();
    const send = async (status, data) => {
      try { await route.fulfill({ status, contentType: "application/json", headers: { "Cache-Control": "private, no-store" }, body: JSON.stringify(data) }); }
      catch { /* Deliberately aborted old-session reads/proof exchanges may already be closed. */ }
    };
    if (url.pathname === "/api/auth/login") {
      current = pair(body.email === "qa-a@example.invalid" ? actorA : actorB); return send(200, current);
    }
    if (url.pathname === "/api/auth/refresh-token") {
      refreshCalls++;
      if (refuseRefresh || body.refreshToken !== current?.refreshToken) return send(401, { errorCode: "AUTH_INVALID_REFRESH_SESSION" });
      if (automaticCycles !== null) automaticCycles++;
      const actor = JSON.parse(Buffer.from(current.accessToken.split(".")[1], "base64url")).sub;
      current = pair(actor); const accepted = current;
      refreshEntered?.resolve(); if (refreshGate) await refreshGate.promise; return send(200, accepted);
    }
    if (url.pathname === "/api/auth/logout") {
      logoutEntered?.resolve(); if (logoutGate) await logoutGate.promise; current = null; return send(200, {});
    }
    if (url.pathname === "/api/admin/session-fixture") {
      readEntered?.resolve(); if (readGate) await readGate.promise; return send(200, { private: "synthetic-old-account-data" });
    }
    if (url.pathname === "/api/admin/configuration/v2") {
      configurationCalls++;
      return send(403, { errorCode: "ADMIN_STEP_UP_REQUIRED", details: { challenge: "fixture-challenge", authenticatorRequired: false } });
    }
    if (url.pathname === "/api/admin/step-up") {
      proofEntered?.resolve(); if (proofGate) await proofGate.promise;
      return send(200, { proof: "fixture-proof", expiresAt: new Date(Date.now() + 300000).toISOString() });
    }
    return send(404, { errorCode: "FIXTURE_ROUTE_NOT_FOUND" });
  });
  const a = await context.newPage(), b = await context.newPage();
  const fixture = `${origin}/tests/fixtures/admin-session-review.html`;
  const signIn = async (page, actor) => {
    await page.locator('input[name="email"]').fill(actor === actorA ? "qa-a@example.invalid" : "qa-b@example.invalid");
    await page.locator('input[name="password"]').fill("fixture-only-password");
    await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
    await page.getByTestId("actor").filter({ hasText: actor }).waitFor();
  };
  await a.goto(fixture); await signIn(a, actorA); await b.goto(fixture);
  await b.getByTestId("actor").filter({ hasText: actorA }).waitFor();
  assert.equal(await a.evaluate(() => !!navigator.locks), true);
  checks.push("real React login and shared authenticated bootstrap");

  refreshGate = gate(); refreshEntered = gate();
  await a.getByRole("button", { name: "Refresh session", exact: true }).click(); await refreshEntered.promise;
  await b.getByRole("button", { name: "Refresh session", exact: true }).click();
  await poll(() => b.evaluate(async () => (await navigator.locks.query()).pending.some((lock) => lock.name === "halo.auth.exchange.v1")), "second tab queued on actual Web Lock");
  assert.equal(refreshCalls, 1); refreshGate.resolve();
  await poll(async () => (await a.getByRole("status").textContent()) === "refresh:ACCEPTED" && (await b.getByRole("status").textContent()) === "refresh:ACCEPTED", "both refresh callers complete");
  assert.equal(refreshCalls, 1); refreshGate = null; checks.push("two actual tabs share one rotation and observe a queued platform lock");

  await a.getByRole("button", { name: "Seed private cache", exact: true }).click();
  readGate = gate(); readEntered = gate(); logoutGate = gate(); logoutEntered = gate();
  await a.getByRole("button", { name: "Start private read", exact: true }).click(); await readEntered.promise;
  await b.getByRole("button", { name: "Sign out", exact: true }).click(); await logoutEntered.promise;
  await a.locator('input[name="email"]').waitFor(); await b.locator('input[name="email"]').waitFor();
  checks.push("cross-tab local logout clears private views before remote acknowledgement");
  const nextSignIn = signIn(b, actorB); logoutGate.resolve(); await nextSignIn; logoutGate = null;
  await a.getByTestId("actor").filter({ hasText: actorB }).waitFor();
  readGate.resolve(); readGate = null;
  await poll(() => a.evaluate(() => window.__sessionReviewResults.some((row) => row.kind === "read" && row.outcome === "CANCELLED")), "old-account HTTP200 discarded");
  assert.equal(await a.getByTestId("cache-size").textContent(), "0");
  checks.push("late old-account HTTP200 cannot return data or retain the prior query cache");

  proofGate = gate(); proofEntered = gate();
  await a.getByRole("button", { name: "Start protected command", exact: true }).click();
  const dialog = a.getByRole("dialog"); await dialog.waitFor();
  await dialog.locator('input[type="password"]').fill("fixture-only-password"); await dialog.locator('button[type="submit"]').click();
  await proofEntered.promise;
  await b.getByRole("button", { name: "Sign out", exact: true }).click(); await b.locator('input[name="email"]').waitFor();
  await signIn(b, actorA); await a.getByTestId("actor").filter({ hasText: actorA }).waitFor();
  proofGate.resolve(); proofGate = null;
  await poll(() => a.evaluate(() => window.__sessionReviewResults.some((row) => row.kind === "command" && row.outcome !== "ACCEPTED")), "old proof exchange canceled");
  assert.equal(configurationCalls, 1); assert.equal(await a.getByRole("dialog").count(), 0);
  checks.push("session boundary cancels actual step-up dialog and prevents old command resubmission");
  await a.getByRole("button", { name: "Seed private cache", exact: true }).click();
  proofGate = gate(); proofEntered = gate();
  await a.getByRole("button", { name: "Start protected command", exact: true }).click();
  await a.getByRole("dialog").waitFor();
  await a.getByRole("dialog").locator('input[type="password"]').fill("fixture-only-password");
  await a.getByRole("dialog").locator('button[type="submit"]').click(); await proofEntered.promise;
  await b.getByRole("button", { name: "Refresh session", exact: true }).click();
  await poll(() => a.getByRole("dialog").count().then((count) => count === 0), "credential rotation cancels proof dialog");
  proofGate.resolve(); proofGate = null;
  await poll(() => a.evaluate(() => window.__sessionReviewResults.filter((row) => row.kind === "command" && row.outcome !== "ACCEPTED").length === 2), "both stale proof attempts refused");
  assert.equal(configurationCalls, 2);
  assert.equal(await a.getByTestId("cache-size").textContent(), "1");
  checks.push("same-session credential rotation cancels proof while preserving that actor's cache");
  const persistence = await a.evaluate(() => {
    const stored = JSON.parse(localStorage.getItem("halo.auth.session.v1"));
    return { onePair: stored.kind === "authenticated" && !!stored.accessToken && !!stored.refreshToken,
      noLegacy: localStorage.getItem("access_token") === null && localStorage.getItem("refresh_token") === null };
  });
  assert.equal(persistence.onePair && persistence.noLegacy, true);
  await a.screenshot({ path: `${artifactRoot}/admin-web-session-browser-r7.png`, fullPage: true });
  refuseRefresh = true;
  await a.getByRole("button", { name: "Refresh session", exact: true }).click();
  await a.locator('input[name="email"]').waitFor(); await b.locator('input[name="email"]').waitFor();
  checks.push("server refresh refusal closes both tab views");
  refuseRefresh = false; automaticCycles = 0;
  await signIn(a, actorA); await b.getByTestId("actor").filter({ hasText: actorA }).waitFor();
  await poll(() => automaticCycles === 2, "two automatic timer rotations", 30_000);
  await a.getByTestId("actor").filter({ hasText: actorA }).waitFor();
  await b.getByTestId("actor").filter({ hasText: actorA }).waitFor();
  checks.push("two real React timer cycles use current refresh credentials across both tabs");
  assert.equal(credentialLogDetected, false); assert.deepEqual(pageErrors, []);
  const report = { fixtureApi: true, realBackendQualified: false, browser: "Chrome headless, owned context", checks,
    simultaneousRefreshExchanges: 1, protectedCommandRequests: configurationCalls, automaticTimerCycles: automaticCycles, credentialLogDetected, pageErrors };
  await writeFile(`${artifactRoot}/admin-web-session-browser-r7.json`, JSON.stringify(report, null, 2));
  process.stdout.write(`${JSON.stringify(report)}\n`);
} finally { await browser.close(); }
