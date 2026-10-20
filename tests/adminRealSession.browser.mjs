import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { createInterface } from "node:readline";

const { chromium } = await import(process.env.ADMIN_BROWSER_PLAYWRIGHT_MODULE);
const ui = new URL(process.env.ADMIN_BROWSER_UI_ORIGIN), actor = process.env.ADMIN_BROWSER_ACTOR;
let api = new URL(process.env.ADMIN_BROWSER_API_ORIGIN);
const artifacts = process.env.ADMIN_BROWSER_ARTIFACTS;
const validateApi = () => assert.ok(api.protocol === "http:" && api.hostname === "127.0.0.1" && api.pathname === "/", "Only the owned loopback API is accepted");
validateApi();
const lines = [], waiting = [];
const input = createInterface({ input: process.stdin });
input.on("line", (line) => { const consumer = waiting.shift(); if (consumer) consumer(line); else lines.push(line); });
const nextLine = () => lines.length ? Promise.resolve(lines.shift()) : new Promise((resolve) => waiting.push(resolve));
const phase = (name) => process.stdout.write(`${name}\n`);
const deferred = () => { let resolve; const promise = new Promise((yes) => { resolve = yes; }); return { promise, resolve }; };
const poll = async (read) => {
  const until = Date.now() + 15_000;
  while (Date.now() < until) { if (await read()) return; await new Promise((yes) => setTimeout(yes, 25)); }
  throw new Error("BROWSER_CONDITION_TIMEOUT");
};
let browser, holdRefresh, refreshArrived, refreshCalls = 0, credentialLog = false, proxyFailure = false, privacyFailure = false;
const errors = [], checks = [];
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.ADMIN_BROWSER_CHROME });
  const context = await browser.newContext();
  context.on("page", (page) => {
    page.on("pageerror", (error) => errors.push(error.name));
    page.on("console", (message) => { if (message.text().includes(process.env.ADMIN_BROWSER_PASSWORD) || /Bearer /.test(message.text())) credentialLog = true; });
  });
  // Transparent same-origin test proxy: every API status/header/body comes from
  // the real Program. Only response timing is controlled for the rotation race.
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== ui.origin) return route.abort();
    if (!url.pathname.startsWith("/api/")) return route.continue();
    let response;
    try { response = await route.fetch({ url: new URL(url.pathname + url.search, api).href, maxRedirects: 0 }); }
    catch {
      proxyFailure = true;
      try { await route.fulfill({ status: 502, contentType: "application/json", body: '{"errorCode":"BROWSER_PROXY_FAILURE"}' }); } catch { /* Closed old request. */ }
      return;
    }
    if (!/private.*no-store/.test(response.headers()["cache-control"] ?? "")) privacyFailure = true;
    if (url.pathname === "/api/auth/refresh-token") {
      refreshCalls++; refreshArrived?.resolve(); if (holdRefresh) await holdRefresh.promise;
    }
    try { await route.fulfill({ response }); } catch { /* A session boundary can intentionally abort an old browser request. */ }
  });
  const a = await context.newPage(), b = await context.newPage();
  const fixture = new URL("/tests/fixtures/admin-session-review.html?real=true", ui).href;
  const login = async (page) => {
    await page.locator('input[name="email"]').fill(process.env.ADMIN_BROWSER_EMAIL);
    await page.locator('input[name="password"]').fill(process.env.ADMIN_BROWSER_PASSWORD);
    await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
    await page.getByTestId("actor").filter({ hasText: actor }).waitFor();
  };
  await a.goto(fixture); await login(a); await b.goto(fixture); await b.getByTestId("actor").filter({ hasText: actor }).waitFor();
  holdRefresh = deferred(); refreshArrived = deferred();
  await a.getByRole("button", { name: "Refresh session", exact: true }).click(); await refreshArrived.promise;
  await b.getByRole("button", { name: "Refresh session", exact: true }).click();
  await poll(() => b.evaluate(async () => (await navigator.locks.query()).pending.some((lock) => lock.name === "halo.auth.exchange.v1")));
  assert.equal(refreshCalls, 1); holdRefresh.resolve(); holdRefresh = null;
  await poll(async () => (await a.getByRole("status").textContent()) === "refresh:ACCEPTED" && (await b.getByRole("status").textContent()) === "refresh:ACCEPTED");
  checks.push("real login and two-tab rotation with one real refresh exchange"); phase("AUTHENTICATED");
  assert.equal(await nextLine(), "SUSPENDED");
  await a.getByRole("button", { name: "Start private read", exact: true }).click();
  await a.locator('input[name="email"]').waitFor(); await b.locator('input[name="email"]').waitFor();
  checks.push("real Admin suspension rejects access/refresh and closes both private views"); phase("REVOKED");
  assert.equal(await nextLine(), "REACTIVATED");
  await login(a); await b.getByTestId("actor").filter({ hasText: actor }).waitFor();
  const loggedOut = a.waitForResponse((response) => new URL(response.url()).pathname === "/api/auth/logout" && response.status() === 200);
  await a.getByRole("button", { name: "Sign out", exact: true }).click(); await loggedOut;
  await a.locator('input[name="email"]').waitFor(); await b.locator('input[name="email"]').waitFor();
  checks.push("fresh credentials after reactivation and acknowledged real logout"); phase("LOGGED_OUT");
  const restart = await nextLine(); assert.ok(restart.startsWith("RESTARTED ")); api = new URL(restart.slice(10)); validateApi();
  await login(a); await b.getByTestId("actor").filter({ hasText: actor }).waitFor();
  await a.getByRole("button", { name: "Start private read", exact: true }).click();
  await poll(async () => (await a.getByRole("status").textContent()) === "read:ACCEPTED");
  checks.push("real Program restart, fresh login and authorized private read");
  assert.equal(credentialLog, false); assert.deepEqual(errors, []); assert.equal(proxyFailure || privacyFailure, false);
  await writeFile(new URL("admin-web-session-real-browser.json", `file:///${artifacts.replaceAll("\\", "/")}/`), JSON.stringify({
    realBackendQualified: true, qualificationScope: "owned loopback Program/PostgreSQL synthetic-account session journey only",
    checks, credentialLog, pageErrors: errors, twoTabRealRefreshExchanges: 1,
  }, null, 2));
  await a.screenshot({ path: `${artifacts}/admin-web-session-real-browser.png`, fullPage: true });
  phase("DONE");
} catch (error) {
  await writeFile(`${artifacts}/admin-web-session-real-browser-failure.json`, JSON.stringify({ failure: error.name, completedChecks: checks }));
  phase("BROWSER_FAILURE"); process.exitCode = 1;
} finally { input.close(); if (browser) await browser.close(); }
