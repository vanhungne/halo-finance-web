import assert from "node:assert/strict";
import test from "node:test";
import { buildSubscriptionPayload, formatSubscriptionVnd, subscriptionCommandError } from "../src/adminV2/subscriptionCatalog.js";

const options = { currency: "VND", maximumPrice: "1000000000", minimumDurationInDays: 1, maximumDurationInDays: 3650, featureTypes: ["ReceiptScan"] };
const input = () => ({ name: " Gói kiểm thử ", description: "", features: "Quét hóa đơn", price: "1000000000", durationInDays: "30", featurePermissions: [{ featureType: "ReceiptScan", isEnabled: true, maxLimit: "0" }], reason: "" });

test("detail money preserves exact digits and legacy fraction; missing price is not zero", () => {
  assert.equal(formatSubscriptionVnd("9007199254740993"), "9.007.199.254.740.993 ₫");
  assert.equal(formatSubscriptionVnd("100.50"), "100,50 ₫");
  assert.equal(formatSubscriptionVnd(undefined), "Chưa có giá hợp lệ");
  assert.equal(formatSubscriptionVnd(Number("9007199254740993")), "Xem giá ở chi tiết");
  assert.equal(formatSubscriptionVnd(100.5), "Xem giá ở chi tiết");
});

test("metadata updates cannot carry immutable price, duration or executable grants", () => {
  assert.deepEqual(buildSubscriptionPayload("edit", input(), options), { name: "Gói kiểm thử", description: null, features: ["Quét hóa đơn"], reason: null });
});

test("create uses the exact numeric contract at its largest allowed VND integer", () => {
  const result = buildSubscriptionPayload("create", input(), options);
  assert.equal(result.price, 1000000000);
  assert.deepEqual(result.featurePermissions, [{ featureType: "ReceiptScan", isEnabled: true, maxLimit: 0 }]);
  const noQuota = input();
  noQuota.featurePermissions[0].maxLimit = "";
  assert.equal(buildSubscriptionPayload("create", noQuota, options).featurePermissions[0].maxLimit, null);
});

test("fractional, excessive and unsafe prices cannot be converted to a rounded payload", () => {
  for (const price of ["0.5", "1000000001", "9007199254740993", "1e3", "-1"])
    assert.throws(() => buildSubscriptionPayload("create", { ...input(), price }, options));
});

test("server feature names and integer quota bounds constrain executable grants", () => {
  for (const permission of [{ featureType: "999", maxLimit: "1" }, { featureType: "ReceiptScan", maxLimit: "2147483648" }])
    assert.throws(() => buildSubscriptionPayload("create", { ...input(), featurePermissions: [permission] }, options));
  const duplicate = input();
  duplicate.featurePermissions.push({ ...duplicate.featurePermissions[0] });
  assert.throws(() => buildSubscriptionPayload("create", duplicate, options));
});

test("lost reply, server failure, pending and database race preserve uncertain intent", () => {
  for (const error of [{}, { response: { status: 500 } }, { response: { status: 409, data: { errorCode: "ADMIN_SUBSCRIPTION_COMMAND_PENDING" } } }, { response: { status: 409, data: { errorCode: "ADMIN_SUBSCRIPTION_CREATE_RACE" } } }])
    assert.equal(subscriptionCommandError(error).uncertain, true);
});

test("known stale/protected rejection and revoked authorization are terminal", () => {
  for (const code of ["ADMIN_STALE_SUBSCRIPTION_VERSION", "ADMIN_SUBSCRIPTION_MEMBERSHIPS_EXIST", "ADMIN_SUBSCRIPTION_PUBLISHED_PLAN"])
    assert.equal(subscriptionCommandError({ response: { status: 409, data: { errorCode: code } } }).uncertain, false);
  assert.equal(subscriptionCommandError({ response: { status: 403 } }).uncertain, false);
});
