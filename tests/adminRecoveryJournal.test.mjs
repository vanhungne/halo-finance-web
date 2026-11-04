import test from "node:test";
import assert from "node:assert/strict";
import { ADMIN_RECOVERY_STORAGE_KEY, createAdminRecoveryJournal, validRecoveryLocator, recoveryResponseMatches, cancelledRecoveryResponseMatches, unseenRecoveryCanBeCancelled } from "../src/adminV2/adminRecoveryJournal.js";

const actor = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const target = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const key = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const locator = { actor, targetId: target, action: "REPORT_REPLY", key, version: "1" };
const receipt = { status: "COMMITTED", targetId: target, operationId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", auditId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee" };
function memoryStorage() { const data = new Map(); return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: (k) => data.delete(k) }; }

test("only an identity-bound UNKNOWN permits offering cancellation; it cannot itself clear intent", () => {
  const response = { action: locator.action, scopeId: target, expectedVersion: "1", state: "UNKNOWN", receipt: null, canCancelUnseen: true, disposition: null };
  assert.equal(unseenRecoveryCanBeCancelled(locator, response), true);
  const storage = memoryStorage(); const journal = createAdminRecoveryJournal(() => storage); journal.reserve(locator);
  assert.equal(journal.resolveDisposition(locator, response), false);
  for (const changes of [{ action: "REPORT_TYPE_DELETE" }, { expectedVersion: "2" }, { scopeId: key }, { state: "PENDING" }, { canCancelUnseen: false }, { receipt }])
    assert.equal(unseenRecoveryCanBeCancelled(locator, { ...response, ...changes }), false);
});

test("an audited key disposition releases only the matching intent without inventing a business receipt", () => {
  const storage = memoryStorage(); const journal = createAdminRecoveryJournal(() => storage); const events = []; journal.subscribe(e => events.push(e)); journal.reserve(locator);
  const response = { action: locator.action, scopeId: target, expectedVersion: "1", state: "CANCELLED", receipt: null, canCancelUnseen: false,
    disposition: { operationId: receipt.operationId, auditId: receipt.auditId, outcomeCode: "CANCELLED_BEFORE_ACCEPTANCE" } };
  assert.equal(cancelledRecoveryResponseMatches(locator, response), true);
  for (const changes of [{ state: "UNKNOWN" }, { receipt }, { expectedVersion: "2" }, { scopeId: key }, { disposition: { ...response.disposition, auditId: null } }, { disposition: { ...response.disposition, outcomeCode: "APPLIED" } }]) {
    assert.equal(journal.resolveDisposition(locator, { ...response, ...changes }), false); assert.deepEqual(journal.read(actor), locator);
  }
  assert.equal(journal.resolveDisposition({ ...locator, key: actor }, response), false);
  assert.equal(journal.resolveDisposition(locator, response), true); assert.equal(journal.read(actor), null);
  assert.equal(events.at(-1).type, "disposed"); assert.equal(events.at(-1).receipt, undefined);
});

test("native account lifecycle disposition preserves its opaque stamp and remains distinct from account state", () => {
  const value = { ...locator, action: "SET_ACCOUNT_LIFECYCLE", version: "opaque-stamp_0123" };
  const storage = memoryStorage(); const journal = createAdminRecoveryJournal(() => storage); journal.reserve(value);
  const response = { action: value.action, scopeId: value.targetId, expectedVersion: value.version, state: "CANCELLED", receipt: null,
    canCancelUnseen: false, disposition: { operationId: receipt.operationId, auditId: receipt.auditId, outcomeCode: "CANCELLED_BEFORE_ACCEPTANCE" } };
  assert.equal(cancelledRecoveryResponseMatches(value, response), true);
  assert.equal(cancelledRecoveryResponseMatches(value, { ...response, expectedVersion: "another-stamp" }), false);
  assert.equal(journal.resolveDisposition(value, response), true);
  assert.equal(journal.read(actor), null); assert.equal(response.receipt, null);
});

test("reload retains only opaque locator; identical retry reserves the same intent and other commands stay blocked", () => {
  const storage = memoryStorage(); const first = createAdminRecoveryJournal(() => storage); first.reserve(locator);
  const restarted = createAdminRecoveryJournal(() => storage); assert.deepEqual(restarted.read(actor), locator); restarted.reserve({ ...locator });
  assert.throws(() => restarted.reserve({ ...locator, key: target })); assert.throws(() => restarted.reserve({ ...locator, version: "2" }));
  assert.equal(storage.getItem(ADMIN_RECOVERY_STORAGE_KEY), JSON.stringify(locator));
});

test("only matching audited terminal evidence releases the locator and notifies subscribers", () => {
  const journal = createAdminRecoveryJournal(() => memory); const memory = memoryStorage(); const events = []; journal.subscribe((event) => events.push(event)); journal.reserve(locator);
  assert.equal(journal.resolve(locator, { ...receipt, auditId: "00000000-0000-0000-0000-000000000000" }), false);
  assert.equal(journal.resolve(locator, { ...receipt, targetId: key }), false);
  assert.equal(journal.resolve({ ...locator, key: target }, receipt), false);
  assert.equal(journal.resolve(locator, { ...receipt, status: "PREPARED" }), false);
  assert.deepEqual(journal.read(actor), locator); assert.equal(journal.resolve(locator, receipt), true);
  assert.equal(journal.read(actor), null); assert.equal(events.at(-1).type, "resolved");
});

test("malformed metadata and unavailable storage block before any request; body and fingerprint cannot enter persisted locator", () => {
  const storage = memoryStorage(); const journal = createAdminRecoveryJournal(() => storage);
  for (const extra of [{ payload: "Private reply" }, { fingerprint: "guessable hash" }, { token: "TOKEN" }]) {
    assert.equal(validRecoveryLocator({ ...locator, ...extra }), false); assert.throws(() => journal.reserve({ ...locator, ...extra }));
  }
  storage.setItem(ADMIN_RECOVERY_STORAGE_KEY, "{}"); assert.throws(() => journal.read(actor)); assert.throws(() => journal.reserve(locator));
  const unavailable = createAdminRecoveryJournal(() => { throw new Error("Storage denied"); }); assert.throws(() => unavailable.reserve(locator));
});

test("another actor cannot read a locator; session binding and explicit logout cleanup purge local hints", () => {
  const storage = memoryStorage(); const journal = createAdminRecoveryJournal(() => storage); journal.reserve(locator);
  assert.throws(() => journal.read(target)); journal.bindActor(target); assert.equal(journal.read(target), null);
  journal.reserve(locator); journal.clear(); assert.equal(storage.getItem(ADMIN_RECOVERY_STORAGE_KEY), null);
});

test("recovery response is bound to action scope and original expected version; UNKNOWN cannot resolve", () => {
  const response = { action: locator.action, scopeId: target, expectedVersion: "1", state: "COMMITTED", receipt };
  assert.equal(recoveryResponseMatches(locator, response), true);
  for (const changes of [{ action: "REPORT_TYPE_UPDATE" }, { scopeId: key }, { expectedVersion: "2" }, { state: "UNKNOWN", receipt: null }]) assert.equal(recoveryResponseMatches(locator, { ...response, ...changes }), false);
  assert.equal(validRecoveryLocator({ ...locator, version: "9223372036854775808" }), false);
  assert.equal(validRecoveryLocator({ ...locator, action: "REPORT_TYPE_CREATE", targetId: null, version: "0" }), true);
});

test("account lifecycle and role recovery accept opaque concurrency stamps without persisting command data", () => {
  const opaqueVersion = "a1b2c3d4e5f6";
  for (const action of ["SET_ACCOUNT_LIFECYCLE", "ACCOUNT_SET_ROLE"]) {
    const value = { ...locator, action, version: opaqueVersion };
    assert.equal(validRecoveryLocator(value), true);
    assert.equal(validRecoveryLocator({ ...value, version: "stamp.with.dot" }), false);
    assert.equal(validRecoveryLocator({ ...value, payload: "private" }), false);
  }
});

test("advertising status recovery accepts only a positive numeric version", () => {
  assert.equal(validRecoveryLocator({ ...locator, action: "ADVERTISE_SET_STATUS", version: "7" }), true);
  assert.equal(validRecoveryLocator({ ...locator, action: "ADVERTISE_SET_STATUS", version: "0" }), false);
});

test("advertising CRUD recovery binds create to an empty scope and edits/deletes to a version", () => {
  assert.equal(validRecoveryLocator({ ...locator, action: "ADVERTISE_CREATE", targetId: null, version: "0" }), true);
  assert.equal(validRecoveryLocator({ ...locator, action: "ADVERTISE_UPDATE", version: "3" }), true);
  assert.equal(validRecoveryLocator({ ...locator, action: "ADVERTISE_DELETE", version: "0" }), false);
  assert.equal(validRecoveryLocator({ ...locator, action: "ADVERTISE_DELETE", version: "3" }), true);
});

test("blog create recovery binds its actor scope while update/delete/publication remain target-bound", () => {
  assert.equal(validRecoveryLocator({ ...locator, action: "BLOG_CREATE", targetId: actor, version: "0" }), true);
  assert.equal(validRecoveryLocator({ ...locator, action: "BLOG_UPDATE", version: "2" }), true);
  assert.equal(validRecoveryLocator({ ...locator, action: "BLOG_DELETE", version: "2" }), true);
  assert.equal(validRecoveryLocator({ ...locator, action: "BLOG_SET_PUBLICATION", version: "2" }), true);
  assert.equal(validRecoveryLocator({ ...locator, action: "BLOG_CREATE", targetId: null, version: "0" }), false);
  assert.equal(validRecoveryLocator({ ...locator, action: "BLOG_DELETE", version: "0" }), false);
});

test("maintenance recovery keeps a timestamp version while withholding the configuration target", () => {
  const maintenance = { ...locator, action: "SYSTEM_CONFIG_UPDATE", targetId: null, version: "2026-10-13T12:34:56.1234567+00:00" };
  assert.equal(validRecoveryLocator(maintenance), true);
  assert.equal(validRecoveryLocator({ ...maintenance, version: "not-a-timestamp" }), false);
});

test("configuration CRUD recovery binds create, update and delete to timestamp identity", () => {
  assert.equal(validRecoveryLocator({ ...locator, action: "SYSTEM_CONFIG_CREATE", targetId: null, version: "0" }), true);
  assert.equal(validRecoveryLocator({ ...locator, action: "SYSTEM_CONFIG_UPDATE", targetId: target, version: "2026-10-16T00:00:00.0000000Z" }), true);
  assert.equal(validRecoveryLocator({ ...locator, action: "SYSTEM_CONFIG_DELETE", targetId: target, version: "2026-10-16T00:00:00.0000000Z" }), true);
  assert.equal(validRecoveryLocator({ ...locator, action: "SYSTEM_CONFIG_DELETE", targetId: null, version: "2026-10-16T00:00:00.0000000Z" }), false);
});

test("subscription create may recover without a target while edits remain target and version bound", () => {
  assert.equal(validRecoveryLocator({ ...locator, action: "SUBSCRIPTION_CREATE", targetId: null, version: "0" }), true);
  assert.equal(validRecoveryLocator({ ...locator, action: "SUBSCRIPTION_UPDATE", version: "2" }), true);
  assert.equal(validRecoveryLocator({ ...locator, action: "SUBSCRIPTION_DELETE", version: "0" }), false);
});
