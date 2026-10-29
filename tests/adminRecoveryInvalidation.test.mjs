import test from "node:test";
import assert from "node:assert/strict";
import { createAdminQueryClient, adminQueryKey, invalidateAdminRecoveredCommand } from "../src/adminV2/adminQueryClient.js";

test("verified account and content recovery invalidates only the recovering actor and affected domain", async () => {
  const client = createAdminQueryClient();
  const actor = "admin-a";
  const other = "admin-b";
  const pages = ["content", "content-statistics", "audit", "command-audit", "subscriptions", "accounts", "account-statistics", "account-role", "dashboard-statistics"];
  try {
    for (const action of ["BLOG_SET_PUBLICATION", "SET_ACCOUNT_LIFECYCLE"]) {
      for (const owner of [actor, other]) for (const page of pages) for (const cursor of ["first", "next"]) {
        client.setQueryData(adminQueryKey(owner, page, { cursor }), { data: "synthetic" });
      }
      await invalidateAdminRecoveredCommand(client, actor, action);
      const affected = action === "BLOG_SET_PUBLICATION" ? ["content", "content-statistics"] : ["accounts", "account-statistics", "account-role", "dashboard-statistics"];
      for (const page of affected) for (const cursor of ["first", "next"]) {
        assert.equal(client.getQueryState(adminQueryKey(actor, page, { cursor })).isInvalidated, true);
      }
      for (const page of pages) assert.equal(client.getQueryState(adminQueryKey(other, page, { cursor: "first" })).isInvalidated, false);
      assert.equal(client.getQueryState(adminQueryKey(actor, "subscriptions", { cursor: "first" })).isInvalidated, false);
      for (const page of ["audit", "command-audit"]) assert.equal(client.getQueryState(adminQueryKey(actor, page, { cursor: "first" })).isInvalidated, true);
    }
  } finally { client.clear(); }
});
