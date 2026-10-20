import test from "node:test";
import assert from "node:assert/strict";
import { inspectAdminReportContent, verifyAdminReportContentPage } from "../src/adminV2/adminReportContent.js";

const reportId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const source = "😀".repeat(4000) + "Tiếng Việt";
const characters = [...source];
const first = { reportId, version: "2", offset: 0, contentLength: characters.length, content: characters.slice(0, 4000).join(""), nextOffset: 4000 };
const last = { ...first, offset: 4000, content: characters.slice(4000).join(""), nextOffset: null };
const inspect = (pages) => inspectAdminReportContent(pages, reportId, "2", characters.length);

test("report review requires contiguous Unicode pages from one dossier identity/version/length", () => {
  assert.deepEqual(inspect([]), { content: "", complete: false });
  assert.equal(inspect([first]).complete, false);
  assert.deepEqual(inspect([first, last]), { content: source, complete: true });
});

for (const [defect, change] of [
  ["identity", { reportId: "another-report" }], ["version", { version: "3" }],
  ["offset", { offset: 0 }], ["length", { contentLength: characters.length + 1 }],
  ["truncation", { content: "" }], ["continuation", { nextOffset: 4000 }],
]) test(`report review refuses ${defect} drift without returning combined text`, () => {
  assert.throws(() => inspect([first, { ...last, ...change }]));
});

test("report review rejects skipped, duplicate and trailing pages or premature termination", () => {
  assert.throws(() => inspect([last]));
  assert.throws(() => inspect([first, first]));
  assert.throws(() => inspect([first, last, last]));
  assert.throws(() => inspect([{ ...first, nextOffset: null }]));
});

test("empty report is complete only after a verified empty terminal page", () => {
  assert.deepEqual(inspectAdminReportContent([{ reportId, version: "2", offset: 0, contentLength: 0, content: "", nextOffset: null }], reportId, "2", 0), { content: "", complete: true });
  assert.throws(() => verifyAdminReportContentPage(first, reportId, "2", -1, 0));
  assert.throws(() => verifyAdminReportContentPage(first, reportId, 2, characters.length, 0));
});
