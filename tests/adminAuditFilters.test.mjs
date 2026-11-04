import test from "node:test";
import assert from "node:assert/strict";
import { buildAdminAuditFilters, parseAuditPage } from "../src/adminV2/adminAuditFilters.js";

test("audit filters keep lifecycle and generic DTOs separate and canonicalize identifiers", () => {
  const params = new URLSearchParams({
    actor: "A1234567-89AB-4CDE-8FAB-0123456789AB",
    target: "B1234567-89AB-4CDE-8FAB-0123456789AB",
    action: " set_account_lifecycle ",
    outcome: " applied ",
    page: "3",
    commandPage: "4",
    size: "50",
  });
  const result = buildAdminAuditFilters(params);
  assert.equal(result.valid, true);
  assert.deepEqual(result.lifecycle, {
    ActorUserId: "a1234567-89ab-4cde-8fab-0123456789ab",
    TargetUserId: "b1234567-89ab-4cde-8fab-0123456789ab",
    Action: "SET_ACCOUNT_LIFECYCLE",
    OutcomeCode: "APPLIED",
    PageIndex: 3,
    PageSize: 50,
  });
  assert.deepEqual(result.commands, {
    ActorUserId: "a1234567-89ab-4cde-8fab-0123456789ab",
    TargetId: "b1234567-89ab-4cde-8fab-0123456789ab",
    Action: "SET_ACCOUNT_LIFECYCLE",
    ResultCode: "APPLIED",
    PageIndex: 4,
    PageSize: 50,
  });
});

test("audit filters fail closed for malformed ids and control characters", () => {
  const params = new URLSearchParams({ actor: "not-a-uuid", action: "SET\u0001ROLE" });
  const result = buildAdminAuditFilters(params);
  assert.equal(result.valid, false);
  assert.equal(parseAuditPage("0"), 1);
  assert.equal(parseAuditPage("999999999999999999999"), 1);
});
