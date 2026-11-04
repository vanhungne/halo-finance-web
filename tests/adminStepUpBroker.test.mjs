import test from "node:test";
import assert from "node:assert/strict";
import { registerAdminStepUp, requestAdminStepUp, cancelAdminStepUp } from "../src/adminV2/adminStepUpBroker.js";

test("proof is transient, one confirmation at a time, and cancellation cannot clear a later intent", async () => {
  let shown; const unregister = registerAdminStepUp((value) => { shown = value; });
  try {
    const first = requestAdminStepUp({ challenge: "opaque", authenticatorRequired: true });
    const old = shown;
    await assert.rejects(requestAdminStepUp({ challenge: "another", authenticatorRequired: false }), /ADMIN_STEP_UP_BUSY/);
    const rejected = assert.rejects(first, /ADMIN_STEP_UP_CANCELLED/); cancelAdminStepUp(); await rejected;
    const next = requestAdminStepUp({ challenge: "next", authenticatorRequired: false });
    const current = shown; old.complete("late-proof"); assert.equal(shown, current);
    current.complete("valid-proof"); assert.equal(await next, "valid-proof"); assert.equal(shown, null);
  } finally { unregister(); }
});
test("abort and provider teardown reject a pending confirmation without keeping proof", async () => {
  const unregister = registerAdminStepUp(() => {}); const controller = new AbortController();
  const promise = requestAdminStepUp({ challenge: "opaque", authenticatorRequired: false }, controller.signal);
  const rejected = assert.rejects(promise, /ADMIN_STEP_UP_CANCELLED/); controller.abort(); await rejected;
  unregister(); await assert.rejects(requestAdminStepUp({ challenge: "opaque", authenticatorRequired: false }), /ADMIN_STEP_UP_UI_UNAVAILABLE/);
});
