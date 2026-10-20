import test from "node:test";
import assert from "node:assert/strict";
import { adminCommandError, adminReceiptState } from "../src/adminV2/adminCommandOutcome.js";

test("a timeout, unavailable response or incomplete receipt preserves uncertain intent", () => {
  for (const error of [{ code: "ECONNABORTED" }, { response: { status: 503 } }, { response: { status: 429 } }])
    assert.equal(adminCommandError(error).uncertain, true);
  for (const receipt of [null, { status: "PREPARED", operationId: "operation" }, { status: "COMMITTED", operationId: "operation" },
    { status: "COMMITTED", operationId: "operation", auditId: "00000000-0000-0000-0000-000000000000" }])
    assert.equal(adminReceiptState(receipt), "uncertain");
});

test("durable rejection and committed audited outcomes are distinct", () => {
  assert.equal(adminCommandError({ response: { status: 409, data: { errorCode: "ADMIN_STALE_ACCOUNT_VERSION" } } }).uncertain, false);
  assert.equal(adminCommandError({ response: { status: 503, data: { details: { status: "REJECTED" } } } }).uncertain, false);
  assert.equal(adminReceiptState({ status: "REJECTED", operationId: "operation", auditId: "audit" }), "error");
  assert.equal(adminReceiptState({ status: "COMMITTED", operationId: "operation", auditId: "audit" }), "success");
});

test("retained legacy content fingerprint requires lookup and cannot release uncertain intent as rejection", () => {
  const outcome = adminCommandError({ response: { status: 503, data: { errorCode: "ADMIN_BLOG_LEGACY_REPLAY_REQUIRES_RECOVERY" } } });
  assert.equal(outcome.uncertain, true);
  assert.equal(adminReceiptState({ status: "COMMITTED", operationId: "retained", auditId: "audit" }), "success");
});

