import test from "node:test";
import assert from "node:assert/strict";
import { adminMessages, adminTranslate, readAdminLocale, ADMIN_LOCALE_STORAGE_KEY } from "../src/adminV2/adminMessages.js";
import { adminNavigation } from "../src/adminV2/adminNavigation.js";

test("Vietnamese and English cover every shell/navigation/shared key with identical interpolation contracts", () => {
  assert.deepEqual(Object.keys(adminMessages.vi).sort(), Object.keys(adminMessages.en).sort());
  for (const key of Object.keys(adminMessages.vi)) {
    assert.ok(adminMessages.vi[key].trim()); assert.ok(adminMessages.en[key].trim());
    assert.deepEqual(adminMessages.vi[key].match(/\{[a-zA-Z]+\}/g), adminMessages.en[key].match(/\{[a-zA-Z]+\}/g));
  }
  for (const route of adminNavigation) for (const locale of ["vi", "en"]) {
    assert.ok(adminTranslate(locale, route.titleKey));
    assert.ok(adminTranslate(locale, `groups.${route.group}`));
  }
  assert.equal(adminTranslate("en", "pagination.page", { page: 2, total: 3 }), "Page 2 of 3");
  assert.equal(adminTranslate("vi", "pagination.page", { page: 2, total: 3 }), "Trang 2 / 3");
  assert.throws(() => adminTranslate("en", "unknown.key"), /Missing Admin translation/);
});

test("language preference fails safely on denied storage or unsupported values without storing business data", () => {
  assert.equal(readAdminLocale(() => { throw new Error("Storage denied"); }), "vi");
  for (const value of [null, "fr", "EN", "<script>"]) assert.equal(readAdminLocale(() => ({ getItem: () => value })), "vi");
  assert.equal(readAdminLocale(() => ({ getItem: (key) => { assert.equal(key, ADMIN_LOCALE_STORAGE_KEY); return "en"; } })), "en");
});
