export const RECEIPT_SCHEMA_VERSION = "2.0";

export const RECEIPT_DOCUMENT_TYPES = [
  "RETAIL_RECEIPT",
  "VAT_INVOICE",
  "RESTAURANT_RECEIPT",
  "ECOMMERCE_ORDER",
  "UTILITY_BILL",
  "FUEL_RECEIPT",
  "BANK_SLIP",
  "PARKING_TICKET",
  "HANDWRITTEN_RECEIPT",
  "NOT_A_RECEIPT",
];

export const RECEIPT_WARNING_CODES = {
  TOTAL_MISSING: "TOTAL_MISSING",
  CURRENCY_MISSING: "CURRENCY_MISSING",
  DATE_MISSING: "DATE_MISSING",
  DATE_IN_FUTURE: "DATE_IN_FUTURE",
  LOW_CONFIDENCE: "LOW_CONFIDENCE",
  TOTAL_MISMATCH: "TOTAL_MISMATCH",
  LINE_ITEMS_MISMATCH: "LINE_ITEMS_MISMATCH",
  IMAGE_TOO_DARK: "IMAGE_TOO_DARK",
  IMAGE_TOO_BRIGHT: "IMAGE_TOO_BRIGHT",
  IMAGE_LOW_CONTRAST: "IMAGE_LOW_CONTRAST",
  IMAGE_BLURRY: "IMAGE_BLURRY",
  IMAGE_CROPPED: "IMAGE_CROPPED",
  MULTIPLE_RECEIPTS: "MULTIPLE_RECEIPTS",
  POSSIBLE_TAMPERING: "POSSIBLE_TAMPERING",
  POSSIBLE_DUPLICATE: "POSSIBLE_DUPLICATE",
  INVALID_TAX_CODE: "INVALID_TAX_CODE",
  SUBMISSION_ANOMALY: "SUBMISSION_ANOMALY",
};

// Gemini structured-output schema. Fields that cannot be read are optional and
// must be omitted instead of being invented by the model.
export const RECEIPT_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    schemaVersion: { type: "string" },
    documentType: { type: "string", enum: RECEIPT_DOCUMENT_TYPES },
    isFinancialDocument: { type: "boolean" },
    merchant: {
      type: "object",
      properties: {
        name: { type: "string" },
        taxCode: { type: "string" },
        address: { type: "string" },
        phone: { type: "string" },
      },
    },
    document: {
      type: "object",
      properties: {
        number: { type: "string" },
        transactionDate: { type: "string", description: "ISO date YYYY-MM-DD" },
        transactionTime: { type: "string", description: "24-hour time HH:mm:ss" },
        dueDate: { type: "string", description: "ISO date YYYY-MM-DD" },
      },
    },
    money: {
      type: "object",
      properties: {
        currencyCode: { type: "string", description: "ISO 4217 code" },
        subtotal: { type: "number" },
        discountAmount: { type: "number" },
        serviceCharge: { type: "number" },
        taxAmount: { type: "number" },
        tipAmount: { type: "number" },
        totalAmount: { type: "number" },
        amountPaid: { type: "number" },
        changeAmount: { type: "number" },
      },
      required: ["totalAmount"],
    },
    payment: {
      type: "object",
      properties: {
        method: { type: "string" },
        bankName: { type: "string" },
        cardLast4: { type: "string" },
        transactionReference: { type: "string" },
      },
    },
    lineItems: {
      type: "array",
      items: {
        type: "object",
        properties: {
          description: { type: "string" },
          quantity: { type: "number" },
          unit: { type: "string" },
          unitPrice: { type: "number" },
          discountAmount: { type: "number" },
          taxRate: { type: "number" },
          lineTotal: { type: "number" },
        },
        required: ["description", "lineTotal"],
      },
    },
    category: {
      type: "object",
      properties: {
        name: { type: "string" },
        categoryId: { type: "string" },
        evidence: { type: "string" },
      },
    },
    confidence: {
      type: "object",
      properties: {
        overall: { type: "number" },
        merchant: { type: "number" },
        transactionDate: { type: "number" },
        totalAmount: { type: "number" },
        currency: { type: "number" },
        lineItems: { type: "number" },
        category: { type: "number" },
      },
      required: ["overall", "totalAmount"],
    },
    quality: {
      type: "object",
      properties: {
        rotationDegrees: { type: "number" },
        blurry: { type: "boolean" },
        tooDark: { type: "boolean" },
        tooBright: { type: "boolean" },
        lowContrast: { type: "boolean" },
        cropped: { type: "boolean" },
        glare: { type: "boolean" },
        handwriting: { type: "boolean" },
        multipleReceipts: { type: "boolean" },
      },
    },
    fraudAssessment: {
      type: "object",
      properties: {
        visualTamperingSuspected: { type: "boolean" },
        inconsistentFontsOrAlignment: { type: "boolean" },
        overwrittenAmountSuspected: { type: "boolean" },
        merchantIdentityMismatch: { type: "boolean" },
        suspiciousReason: { type: "string" },
      },
    },
    evidence: {
      type: "array",
      items: {
        type: "object",
        properties: {
          field: { type: "string" },
          rawText: { type: "string" },
          normalizedValue: { type: "string" },
        },
        required: ["field", "rawText"],
      },
    },
    warnings: { type: "array", items: { type: "string" } },
  },
  required: [
    "schemaVersion",
    "documentType",
    "isFinancialDocument",
    "merchant",
    "document",
    "money",
    "lineItems",
    "confidence",
    "quality",
    "fraudAssessment",
    "warnings",
  ],
};

const CATEGORY_NAMES = [
  "Ăn uống",
  "Mua sắm",
  "Đi lại",
  "Hóa đơn & Tiện ích",
  "Y tế & Sức khỏe",
  "Giải trí",
  "Giáo dục",
  "Công tác",
  "Khác",
];

export const buildReceiptSystemPrompt = (categories = []) => {
  const categoryList = categories.length
    ? categories.map((category) => `${category.id}: ${category.name}`).join("; ")
    : CATEGORY_NAMES.join(" | ");

  return `Bạn là Receipt Intelligence Engine chuyên phân tích chứng từ tài chính Việt Nam và quốc tế.

MỤC TIÊU
1. Phân loại chứng từ trước khi trích xuất. Nếu không phải chứng từ tài chính, đặt isFinancialDocument=false.
2. Trích xuất đúng nội dung nhìn thấy. Không suy đoán, không tự điền ngày hiện tại, không bịa mã số thuế, số hóa đơn hoặc dòng hàng.
3. Phân biệt rõ tạm tính, giảm giá, phí dịch vụ, thuế, tiền tip, tổng thanh toán, tiền khách đưa và tiền thừa.
4. Chuẩn hóa ngày thành YYYY-MM-DD, tiền tệ theo ISO 4217 và số tiền thành number không chứa ký hiệu phân cách.
5. Với hóa đơn VAT nhiều trang/cột, hóa đơn nhiệt mờ, bị xoay, nhăn, lóa, viết tay, ảnh chụp màn hình, phiếu thẻ hoặc nhiều hóa đơn trong một ảnh: vẫn trích xuất phần đọc chắc chắn và cảnh báo phần không chắc chắn.

CHỐNG GIAN LẬN TRÊN ẢNH
- Tìm dấu hiệu số tiền/ngày/tên cửa hàng bị chèn, đè, tẩy xóa; phông chữ, độ nét, màu nền, căn dòng hoặc phối cảnh không đồng nhất.
- Không kết luận gian lận chỉ vì ảnh mờ, hóa đơn viết tay hay bố cục lạ. Chỉ đánh dấu nghi ngờ và mô tả bằng chứng quan sát được.
- Không thể xác nhận ảnh trùng, lịch sử nhân viên hoặc mã hóa đơn đã tồn tại từ một ảnh đơn lẻ; các kiểm tra đó do backend thực hiện.

ĐỐI SOÁT
- Nếu có dòng hàng, kiểm tra tổng dòng hàng với subtotal.
- Kiểm tra công thức subtotal - discountAmount + serviceCharge + taxAmount + tipAmount = totalAmount.
- Mọi trường không nhìn rõ phải bỏ trống và giảm confidence tương ứng; tuyệt đối không thay bằng giá trị hợp lý tưởng tượng.
- evidence.rawText phải là đoạn chữ ngắn thực sự nhìn thấy hỗ trợ trường quan trọng.
- Confidence dùng thang 0..1.

DANH MỤC HỢP LỆ
${categoryList}

Chỉ trả về JSON đúng schema đã cung cấp, không Markdown, không giải thích ngoài JSON.`;
};

const read = (value, ...names) => names.reduce((found, name) => found ?? value?.[name], undefined);

const finiteNumber = (value, currencyCode = "") => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (value === null || value === undefined || value === "") return null;
  let text = String(value).trim().replace(/[^\d.,+-]/g, "");
  if (!text) return null;
  const currency = String(currencyCode || "").toUpperCase();
  const lastDot = text.lastIndexOf(".");
  const lastComma = text.lastIndexOf(",");
  if (currency === "VND") {
    text = text.replace(/[.,]/g, "");
  } else if (lastDot >= 0 && lastComma >= 0) {
    const decimalSeparator = lastDot > lastComma ? "." : ",";
    const groupingSeparator = decimalSeparator === "." ? /,/g : /\./g;
    text = text.replace(groupingSeparator, "").replace(decimalSeparator, ".");
  } else {
    const separator = lastDot >= 0 ? "." : lastComma >= 0 ? "," : null;
    if (separator) {
      const fractionLength = text.length - text.lastIndexOf(separator) - 1;
      text = fractionLength === 3
        ? text.replace(/[.,]/g, "")
        : text.replace(separator === "." ? /,/g : /\./g, "").replace(separator, ".");
    }
  }
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeConfidence = (value) => {
  const number = finiteNumber(value);
  if (number === null) return 0;
  if (number > 100) return Math.min(number / 10000, 1);
  if (number > 1) return Math.min(number / 100, 1);
  return Math.max(number, 0);
};

const normalizeDate = (value) => {
  if (!value) return null;
  const text = String(value).trim();
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);
  const local = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/.exec(text);
  const parts = iso
    ? [Number(iso[1]), Number(iso[2]), Number(iso[3])]
    : local
      ? [Number(local[3]), Number(local[2]), Number(local[1])]
      : null;
  if (!parts) return null;
  const [year, month, day] = parts;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const relativeDifference = (left, right) => {
  if (left === null || right === null) return null;
  return Math.abs(left - right) / Math.max(Math.abs(left), Math.abs(right), 1);
};

const isValidVietnamTaxCode = (value) => !value || /^\d{10}(?:-\d{3})?$/.test(String(value).replace(/\s/g, ""));

const addWarning = (warnings, code) => {
  if (code && !warnings.includes(code)) warnings.push(code);
};

export const assessReceiptFraud = (receipt, context = {}) => {
  const reasons = [];
  let score = 0;
  const flag = (condition, points, code, detail) => {
    if (!condition) return;
    score += points;
    reasons.push({ code, detail, points });
  };

  const visual = receipt.fraudAssessment || {};
  flag(visual.visualTamperingSuspected, 35, "VISUAL_TAMPERING", visual.suspiciousReason || "Vùng ảnh có dấu hiệu chỉnh sửa");
  flag(visual.overwrittenAmountSuspected, 30, "OVERWRITTEN_AMOUNT", "Số tiền có dấu hiệu bị ghi đè hoặc chèn");
  flag(visual.inconsistentFontsOrAlignment, 15, "INCONSISTENT_TYPOGRAPHY", "Phông chữ hoặc căn dòng không đồng nhất");
  flag(visual.merchantIdentityMismatch, 20, "MERCHANT_IDENTITY_MISMATCH", "Tên/nhận diện đơn vị bán không nhất quán");
  flag(context.duplicateDocument === true || Number(context.duplicateCount) > 0, 55, "DUPLICATE_DOCUMENT", "Ảnh hoặc định danh hóa đơn đã được nộp trước đó");
  flag(context.metadataMismatch === true, 20, "METADATA_MISMATCH", "Metadata ảnh không phù hợp với nội dung hóa đơn");
  flag(context.repeatedSubmission === true, 25, "REPEATED_SUBMISSION", "Tần suất nộp lặp bất thường từ cùng tài khoản/thiết bị");
  flag(context.amountAnomaly === true, 15, "AMOUNT_ANOMALY", "Số tiền lệch đáng kể so với lịch sử phù hợp để so sánh");
  flag(context.invoiceRegistryMismatch === true, 40, "REGISTRY_MISMATCH", "Thông tin không khớp nguồn xác minh hóa đơn điện tử");
  flag(receipt.reconciliation?.totalMatches === false, 18, "ARITHMETIC_MISMATCH", "Tổng thanh toán không khớp phép tính trên hóa đơn");
  flag(receipt.money?.currencyCode === "VND" && !isValidVietnamTaxCode(receipt.merchant?.taxCode), 12, "INVALID_TAX_CODE", "Mã số thuế Việt Nam sai định dạng");

  const boundedScore = Math.min(score, 100);
  const riskLevel = boundedScore >= 75 ? "CRITICAL" : boundedScore >= 50 ? "HIGH" : boundedScore >= 25 ? "MEDIUM" : "LOW";
  return {
    score: boundedScore,
    riskLevel,
    requiresManualReview: boundedScore >= 50,
    reasons,
    // A risk flag is an investigation lead, never a finding of employee guilt.
    decision: boundedScore >= 50 ? "HOLD_FOR_REVIEW" : boundedScore >= 25 ? "ALLOW_WITH_MONITORING" : "ALLOW",
  };
};

export const normalizeAndValidateReceipt = (raw = {}, context = {}) => {
  const merchantRaw = read(raw, "merchant", "Merchant");
  const documentRaw = read(raw, "document", "Document") || {};
  const moneyRaw = read(raw, "money", "Money") || {};
  const confidenceRaw = read(raw, "confidence", "Confidence");
  const qualityRaw = read(raw, "quality", "Quality") || {};
  const currencyCode = String(
    read(moneyRaw, "currencyCode", "CurrencyCode") ?? read(raw, "currency", "Currency") ?? "",
  ).trim().toUpperCase();
  const legacyMerchant = typeof merchantRaw === "string" ? merchantRaw : "";
  const merchant = {
    name: read(merchantRaw, "name", "Name") || legacyMerchant || "",
    taxCode: read(merchantRaw, "taxCode", "TaxCode") || "",
    address: read(merchantRaw, "address", "Address") || "",
    phone: read(merchantRaw, "phone", "Phone") || "",
  };
  const transactionDate = normalizeDate(
    read(documentRaw, "transactionDate", "TransactionDate") ?? read(raw, "transactionDate", "TransactionDate"),
  );
  const totalAmount = finiteNumber(
    read(moneyRaw, "totalAmount", "TotalAmount") ?? read(raw, "totalAmount", "TotalAmount") ?? read(raw, "amount", "Amount"),
    currencyCode,
  );
  const lineItemsRaw = read(raw, "lineItems", "LineItems") ?? read(raw, "items", "Items") ?? [];
  const lineItems = Array.isArray(lineItemsRaw)
    ? lineItemsRaw.map((item) => ({
      description: read(item, "description", "Description", "name", "Name") || "",
      quantity: finiteNumber(read(item, "quantity", "Quantity")) ?? 1,
      unit: read(item, "unit", "Unit") || "",
      unitPrice: finiteNumber(read(item, "unitPrice", "UnitPrice"), currencyCode),
      discountAmount: finiteNumber(read(item, "discountAmount", "DiscountAmount"), currencyCode) ?? 0,
      taxRate: finiteNumber(read(item, "taxRate", "TaxRate")),
      lineTotal: finiteNumber(read(item, "lineTotal", "LineTotal", "total", "Total"), currencyCode),
    })).filter((item) => item.description || item.lineTotal !== null)
    : [];

  const subtotal = finiteNumber(read(moneyRaw, "subtotal", "Subtotal"), currencyCode);
  const discountAmount = finiteNumber(read(moneyRaw, "discountAmount", "DiscountAmount"), currencyCode) ?? 0;
  const serviceCharge = finiteNumber(read(moneyRaw, "serviceCharge", "ServiceCharge"), currencyCode) ?? 0;
  const taxAmount = finiteNumber(read(moneyRaw, "taxAmount", "TaxAmount") ?? read(raw, "taxAmount", "TaxAmount"), currencyCode) ?? 0;
  const tipAmount = finiteNumber(read(moneyRaw, "tipAmount", "TipAmount"), currencyCode) ?? 0;
  const computedSubtotal = lineItems.length && lineItems.every((item) => item.lineTotal !== null)
    ? roundMoney(lineItems.reduce((sum, item) => sum + item.lineTotal, 0))
    : null;
  const basisSubtotal = subtotal ?? computedSubtotal;
  const computedTotal = basisSubtotal === null
    ? null
    : roundMoney(basisSubtotal - discountAmount + serviceCharge + taxAmount + tipAmount);
  const subtotalDifference = relativeDifference(subtotal, computedSubtotal);
  const totalDifference = relativeDifference(totalAmount, computedTotal);
  const tolerance = currencyCode === "VND" ? 1 / Math.max(Math.abs(totalAmount || 1), 1) : 0.01;
  const subtotalMatches = subtotalDifference === null ? null : subtotalDifference <= Math.max(tolerance, 0.01);
  const totalMatches = totalDifference === null ? null : totalDifference <= Math.max(tolerance, 0.01);

  const confidenceObject = typeof confidenceRaw === "object" && confidenceRaw !== null ? confidenceRaw : {};
  const confidence = {
    overall: normalizeConfidence(read(confidenceObject, "overall", "Overall") ?? confidenceRaw),
    merchant: normalizeConfidence(read(confidenceObject, "merchant", "Merchant")),
    transactionDate: normalizeConfidence(read(confidenceObject, "transactionDate", "TransactionDate", "date", "Date")),
    totalAmount: normalizeConfidence(read(confidenceObject, "totalAmount", "TotalAmount", "total", "Total")),
    currency: normalizeConfidence(read(confidenceObject, "currency", "Currency")),
    lineItems: normalizeConfidence(read(confidenceObject, "lineItems", "LineItems")),
    category: normalizeConfidence(read(confidenceObject, "category", "Category")),
  };
  const rawWarnings = read(raw, "warnings", "Warnings");
  const warnings = Array.isArray(rawWarnings) ? [...new Set(rawWarnings.map(String))] : [];
  if (totalAmount === null || totalAmount <= 0) addWarning(warnings, RECEIPT_WARNING_CODES.TOTAL_MISSING);
  if (!/^[A-Z]{3}$/.test(currencyCode)) addWarning(warnings, RECEIPT_WARNING_CODES.CURRENCY_MISSING);
  if (!transactionDate) addWarning(warnings, RECEIPT_WARNING_CODES.DATE_MISSING);
  if (transactionDate && new Date(`${transactionDate}T00:00:00Z`) > new Date(Date.now() + 24 * 60 * 60 * 1000)) {
    addWarning(warnings, RECEIPT_WARNING_CODES.DATE_IN_FUTURE);
  }
  if (confidence.overall < 0.75 || confidence.totalAmount < 0.75) addWarning(warnings, RECEIPT_WARNING_CODES.LOW_CONFIDENCE);
  if (subtotalMatches === false) addWarning(warnings, RECEIPT_WARNING_CODES.LINE_ITEMS_MISMATCH);
  if (totalMatches === false) addWarning(warnings, RECEIPT_WARNING_CODES.TOTAL_MISMATCH);
  if (qualityRaw.blurry) addWarning(warnings, RECEIPT_WARNING_CODES.IMAGE_BLURRY);
  if (qualityRaw.tooDark) addWarning(warnings, RECEIPT_WARNING_CODES.IMAGE_TOO_DARK);
  if (qualityRaw.tooBright) addWarning(warnings, RECEIPT_WARNING_CODES.IMAGE_TOO_BRIGHT);
  if (qualityRaw.lowContrast) addWarning(warnings, RECEIPT_WARNING_CODES.IMAGE_LOW_CONTRAST);
  if (qualityRaw.cropped) addWarning(warnings, RECEIPT_WARNING_CODES.IMAGE_CROPPED);
  if (qualityRaw.multipleReceipts) addWarning(warnings, RECEIPT_WARNING_CODES.MULTIPLE_RECEIPTS);

  const receipt = {
    schemaVersion: RECEIPT_SCHEMA_VERSION,
    documentType: RECEIPT_DOCUMENT_TYPES.includes(raw.documentType) ? raw.documentType : "RETAIL_RECEIPT",
    isFinancialDocument: raw.isFinancialDocument !== false,
    merchant,
    document: {
      number: read(documentRaw, "number", "Number") || "",
      transactionDate,
      transactionTime: read(documentRaw, "transactionTime", "TransactionTime") || "",
      dueDate: normalizeDate(read(documentRaw, "dueDate", "DueDate")),
    },
    money: {
      currencyCode,
      subtotal,
      discountAmount,
      serviceCharge,
      taxAmount,
      tipAmount,
      totalAmount,
      amountPaid: finiteNumber(read(moneyRaw, "amountPaid", "AmountPaid"), currencyCode),
      changeAmount: finiteNumber(read(moneyRaw, "changeAmount", "ChangeAmount"), currencyCode),
    },
    payment: read(raw, "payment", "Payment") || {
      method: read(raw, "paymentMethod", "PaymentMethod") || "",
    },
    lineItems,
    category: typeof raw.category === "string" ? { name: raw.category } : (raw.category || {}),
    confidence,
    quality: qualityRaw,
    fraudAssessment: read(raw, "fraudAssessment", "FraudAssessment") || {},
    evidence: read(raw, "evidence", "Evidence") || [],
    warnings,
    reconciliation: {
      computedSubtotal,
      computedTotal,
      subtotalMatches,
      totalMatches,
      difference: totalAmount !== null && computedTotal !== null ? roundMoney(totalAmount - computedTotal) : null,
    },
  };
  receipt.fraudRisk = assessReceiptFraud(receipt, context);
  if (receipt.fraudRisk.reasons.some((reason) => reason.code === "VISUAL_TAMPERING" || reason.code === "OVERWRITTEN_AMOUNT")) {
    addWarning(receipt.warnings, RECEIPT_WARNING_CODES.POSSIBLE_TAMPERING);
  }
  if (receipt.fraudRisk.reasons.some((reason) => reason.code === "DUPLICATE_DOCUMENT")) {
    addWarning(receipt.warnings, RECEIPT_WARNING_CODES.POSSIBLE_DUPLICATE);
  }
  if (receipt.money.currencyCode === "VND" && !isValidVietnamTaxCode(receipt.merchant.taxCode)) {
    addWarning(receipt.warnings, RECEIPT_WARNING_CODES.INVALID_TAX_CODE);
  }

  const blockingWarnings = new Set([
    RECEIPT_WARNING_CODES.TOTAL_MISSING,
    RECEIPT_WARNING_CODES.CURRENCY_MISSING,
    RECEIPT_WARNING_CODES.DATE_IN_FUTURE,
    RECEIPT_WARNING_CODES.TOTAL_MISMATCH,
    RECEIPT_WARNING_CODES.POSSIBLE_TAMPERING,
    RECEIPT_WARNING_CODES.POSSIBLE_DUPLICATE,
  ]);
  receipt.status = !receipt.isFinancialDocument
    ? "REJECTED"
    : receipt.fraudRisk.requiresManualReview || receipt.warnings.some((warning) => blockingWarnings.has(warning))
      ? "NEEDS_REVIEW"
      : "COMPLETED";
  receipt.requiresReview = receipt.status === "NEEDS_REVIEW";

  return receipt;
};

export const toLegacyReceiptResult = (receipt) => ({
  merchant: receipt.merchant.name,
  totalAmount: receipt.money.totalAmount,
  currency: receipt.money.currencyCode,
  transactionDate: receipt.document.transactionDate,
  category: receipt.category?.name || "",
  confidence: receipt.confidence.overall,
  taxAmount: receipt.money.taxAmount,
  paymentMethod: receipt.payment?.method || "",
  items: receipt.lineItems.map((item) => ({
    name: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    total: item.lineTotal,
  })),
});
