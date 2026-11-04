import test from "node:test";
import assert from "node:assert/strict";
import { adminRequestConfig } from "../src/services/admin/adminRequestConfig.js";
import { isAdminAuthorityDenied } from "../src/services/admin/adminAuthorityError.js";

test("current-role or capability denial closes Admin views; unrelated conflicts do not masquerade as revoke", () => {
  assert.equal(isAdminAuthorityDenied({ response: { status: 403, data: { errorCode: "ADMIN_ACTOR_ROLE_REQUIRED" } } }, "/admin/audit"), true);
  assert.equal(isAdminAuthorityDenied({ response: { status: 403 } }, "/admin/capabilities"), true);
  assert.equal(isAdminAuthorityDenied({ response: { status: 401 } }, "/admin/audit"), true);
  for (const status of [400, 409, 422, 429, 500, 503]) assert.equal(isAdminAuthorityDenied({ response: { status } }, "/admin/capabilities"), false);
  assert.equal(isAdminAuthorityDenied({ response: { status: 403, data: { errorCode: "ADMIN_STEP_UP_REQUIRED" } } }, "/admin/accounts"), false);
});

test("generated transport preserves operation/body/query and merges command headers/cancellation", () => {
  const data = { name: "Gói kiểm thử" };
  const params = { Limit: 25 };
  const signal = new AbortController().signal;
  const request = adminRequestConfig({ url: "/api/admin/subscriptions", method: "POST", data, params, headers: { "Content-Type": "application/json" } },
    { url: "https://invalid.example", method: "DELETE", data: {}, params: {}, signal, headers: { "Idempotency-Key": "fixture-key", "If-Match": "4" } });
  assert.equal(request.url, "/admin/subscriptions");
  assert.equal(request.method, "POST");
  assert.equal(request.data, data);
  assert.equal(request.params, params);
  assert.equal(request.signal, signal);
  assert.equal(request.timeout, 20_000);
  assert.deepEqual(request.headers, { "Content-Type": "application/json", "Idempotency-Key": "fixture-key", "If-Match": "4" });
});

test("generated transport avoids double API prefixes and keeps delete bodies intact", () => {
  const data = { reason: "fixture" };
  const request = adminRequestConfig({ url: "/api/admin/subscriptions/fixture-id", method: "DELETE", data }, { timeout: 10_000 });
  assert.equal(request.url, "/admin/subscriptions/fixture-id");
  assert.equal(request.data, data);
  assert.equal(request.timeout, 10_000);
});

test("Swagger JSON formatter wildcard is sent as a concrete supported MIME without losing command data", () => {
  const data = { ExpectedVersion: 4, Reason: "Synthetic transport fixture" };
  const request = adminRequestConfig({ url: "/api/admin/subscriptions/fixture", method: "DELETE", data,
    headers: { "Content-Type": "application/*+json" } }, { headers: { "Idempotency-Key": "fixture-key", "If-Match": "4" } });
  assert.equal(request.headers["Content-Type"], "application/json");
  assert.equal(request.headers["If-Match"], "4");
  assert.equal(request.data, data);
});

test("generated transport rejects external, traversal and query/hash-injected paths", () => {
  for (const url of ["https://invalid.example/api/admin", "//invalid.example/api/admin", "/admin/accounts", "/api/admin/../operations", "/api/admin/%2e%2e/operations", "/api/admin/.%2e/operations", "/api/admin/id?token=fixture", "/api/admin/id#fragment", "/api/admin\\accounts"])
    assert.throws(() => adminRequestConfig({ url, method: "GET" }));
});
