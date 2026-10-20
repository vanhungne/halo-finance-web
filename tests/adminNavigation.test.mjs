import test from "node:test";
import assert from "node:assert/strict";
import { adminNavigationByPath, validateAdminNavigationRegistry } from "../src/adminV2/adminNavigation.js";

test("Admin V2 navigation registry is complete and resolves nested routes to their hub", () => {
  assert.equal(validateAdminNavigationRegistry(), true);
  assert.equal(adminNavigationByPath("/admin-v2/users/123").id, "accounts");
  assert.equal(adminNavigationByPath("/admin-v2/reports/123").id, "reports");
});
