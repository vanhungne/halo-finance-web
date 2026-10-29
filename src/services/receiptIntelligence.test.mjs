import test from "node:test";
import assert from "node:assert/strict";
import { normalizeAndValidateReceipt } from "./receiptIntelligence.js";

test("normalizes Vietnamese money and completes a reconciled receipt", () => {
  const result = normalizeAndValidateReceipt({
    schemaVersion: "2.0",
    documentType: "RETAIL_RECEIPT",
    isFinancialDocument: true,
    merchant: { name: "Cửa hàng A", taxCode: "0312345678" },
    document: { transactionDate: "09/10/2026" },
    money: { currencyCode: "VND", subtotal: "100.000", taxAmount: "8.000", totalAmount: "108.000" },
    lineItems: [{ description: "Mặt hàng", lineTotal: "100.000" }],
    confidence: { overall: 0.96, totalAmount: 0.99 },
    quality: {},
    fraudAssessment: {},
    warnings: [],
  });

  assert.equal(result.money.totalAmount, 108000);
  assert.equal(result.document.transactionDate, "2026-10-09");
  assert.equal(result.reconciliation.totalMatches, true);
  assert.equal(result.status, "COMPLETED");
});

test("holds an edited and arithmetically inconsistent receipt", () => {
  const result = normalizeAndValidateReceipt({
    schemaVersion: "2.0",
    documentType: "VAT_INVOICE",
    isFinancialDocument: true,
    merchant: { name: "Nhà hàng A", taxCode: "0312345678" },
    document: { transactionDate: "2026-10-09" },
    money: { currencyCode: "VND", subtotal: 100000, taxAmount: 8000, totalAmount: 150000 },
    lineItems: [{ description: "Bữa trưa", lineTotal: 100000 }],
    confidence: { overall: 0.96, totalAmount: 0.98 },
    quality: {},
    fraudAssessment: {
      visualTamperingSuspected: true,
      overwrittenAmountSuspected: true,
      suspiciousReason: "Vùng tổng tiền có nền và phông chữ khác",
    },
    warnings: [],
  });

  assert.equal(result.status, "NEEDS_REVIEW");
  assert.equal(result.fraudRisk.riskLevel, "CRITICAL");
  assert.equal(result.fraudRisk.decision, "HOLD_FOR_REVIEW");
  assert.ok(result.warnings.includes("POSSIBLE_TAMPERING"));
  assert.ok(result.warnings.includes("TOTAL_MISMATCH"));
});

test("historical duplicate is a backend-context risk, not an AI guess", () => {
  const result = normalizeAndValidateReceipt({
    documentType: "RETAIL_RECEIPT",
    isFinancialDocument: true,
    merchant: { name: "Cửa hàng A" },
    document: { transactionDate: "2026-10-09" },
    money: { currencyCode: "VND", totalAmount: 100000 },
    lineItems: [],
    confidence: { overall: 0.95, totalAmount: 0.98 },
    quality: {},
    fraudAssessment: {},
    warnings: [],
  }, { duplicateDocument: true, duplicateCount: 1 });

  assert.equal(result.fraudRisk.requiresManualReview, true);
  assert.ok(result.warnings.includes("POSSIBLE_DUPLICATE"));
});
