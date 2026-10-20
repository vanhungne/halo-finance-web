import test from "node:test";
import assert from "node:assert/strict";
import { adminBlogPreviewDocument, collectAdminBlogSource } from "../src/adminV2/adminBlogContent.js";

const id = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
test("editing collects every Unicode page under one identity/version", async () => {
  const source = "😀".repeat(10001); const calls = [];
  const result = await collectAdminBlogSource(id, "2", "html", 10001, async (blogId, request) => {
    calls.push(request.Offset); const end = Math.min(request.Offset + 10000, 10001);
    return { blogId, field: "html", version: "2", offset: request.Offset, contentLength: 10001, content: [...source].slice(request.Offset, end).join(""), nextOffset: end < 10001 ? end : null };
  });
  assert.equal(result, source); assert.deepEqual(calls, [0, 10000]);
});
for (const defect of ["version", "identity", "partial", "continuation"]) test(`editing refuses ${defect} drift instead of exposing a partial draft`, async () => {
  await assert.rejects(collectAdminBlogSource(id, "1", "html", 4, async () => ({ blogId: defect === "identity" ? "another" : id,
    field: "html", version: defect === "version" ? "2" : "1", offset: 0, contentLength: 4,
    content: defect === "partial" ? "a" : "safe", nextOffset: defect === "continuation" ? 0 : null })));
});
test("preview document denies remote resources, base URLs and forms", () => {
  const doc = adminBlogPreviewDocument("<p>Safe</p>", { surface: "white" });
  assert.ok(doc.includes("default-src 'none'")); assert.ok(doc.includes("form-action 'none'"));
  assert.ok(doc.includes("base-uri 'none'")); assert.ok(doc.includes('name="referrer" content="no-referrer"'));
});
