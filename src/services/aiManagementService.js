import axios from "axios";
import {
  RECEIPT_RESPONSE_SCHEMA,
  buildReceiptSystemPrompt,
  normalizeAndValidateReceipt,
  toLegacyReceiptResult,
} from "./receiptIntelligence";

const STORAGE_KEY_CONFIG = "aggeee_ai_config";
const STORAGE_KEY_SAMPLES = "aggeee_receipt_samples";

export const DEFAULT_AI_CONFIG = {
  provider: "aggeee",
  promptVersion: "receipt-intelligence-v2",
  gatewayUrl: "https://aggeee.io.vn",
  apiKey: "",
  model: "gemini-3.7-flash",
  temperature: 0.1,
  systemPrompt: buildReceiptSystemPrompt(),
};

export const INITIAL_RECEIPT_SAMPLES = [
  {
    id: "rcpt-001",
    imageUrl: "https://images.unsplash.com/photo-1554415707-9e44667ff618?w=800&auto=format&fit=crop&q=80",
    uploadedAt: "2026-10-10 14:32:00",
    userEmail: "hoangnam@gmail.com",
    status: "verified",
    source: "CAMERA",
    aiResult: {
      merchant: "Highlands Coffee - Landmark 81",
      totalAmount: 118000,
      currency: "VND",
      transactionDate: "2026-10-10",
      category: "Ăn uống",
      confidence: 0.98,
      paymentMethod: "Ví điện tử",
      items: [
        { name: "Phindi Hạnh Nhân (L)", quantity: 1, unitPrice: 59000, total: 59000 },
        { name: "Trà Sen Vàng (L)", quantity: 1, unitPrice: 59000, total: 59000 },
      ],
    },
    groundTruth: {
      merchant: "Highlands Coffee - Landmark 81",
      totalAmount: 118000,
      currency: "VND",
      transactionDate: "2026-10-10",
      category: "Ăn uống",
      items: [
        { name: "Phindi Hạnh Nhân (L)", quantity: 1, unitPrice: 59000, total: 59000 },
        { name: "Trà Sen Vàng (L)", quantity: 1, unitPrice: 59000, total: 59000 },
      ],
    },
    notes: "Mẫu rõ, tổng dòng hàng khớp tổng thanh toán.",
  },
  {
    id: "rcpt-002",
    imageUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80",
    uploadedAt: "2026-10-10 13:15:10",
    userEmail: "thuha.tran@company.vn",
    status: "corrected",
    source: "GALLERY",
    aiResult: {
      merchant: "Siêu thị WinMart+",
      totalAmount: 245000,
      currency: "VND",
      transactionDate: "2026-10-09",
      category: "Mua sắm",
      confidence: 0.85,
      paymentMethod: "Tiền mặt",
      items: [
        { name: "Sữa tươi TH True Milk 1L", quantity: 2, unitPrice: 38000, total: 76000 },
        { name: "Bánh mì sandwich", quantity: 1, unitPrice: 25000, total: 25000 },
        { name: "Táo Envy New Zealand", quantity: 1, unitPrice: 144000, total: 144000 },
      ],
    },
    groundTruth: {
      merchant: "WinMart+ Hoàng Cầu",
      totalAmount: 245000,
      currency: "VND",
      transactionDate: "2026-10-09",
      category: "Ăn uống",
      items: [
        { name: "Sữa tươi TH True Milk 1L", quantity: 2, unitPrice: 38000, total: 76000 },
        { name: "Bánh mì sandwich bơ tỏi", quantity: 1, unitPrice: 25000, total: 25000 },
        { name: "Táo Envy New Zealand (0.8kg)", quantity: 1, unitPrice: 144000, total: 144000 },
      ],
    },
    notes: "Đã sửa tên cửa hàng, mặt hàng và danh mục bằng Ground Truth.",
  },
  {
    id: "rcpt-003",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    uploadedAt: "2026-10-10 11:05:40",
    userEmail: "dung.nguyen@gmail.com",
    status: "pending",
    source: "CAMERA",
    aiResult: {
      merchant: "Petrolimex Cửa Hàng Xăng Dầu Số 12",
      totalAmount: 70000,
      currency: "VND",
      transactionDate: "2026-10-10",
      category: "Đi lại",
      confidence: 0.92,
      paymentMethod: "Chuyển khoản",
      items: [{ name: "Xăng RON 95-III", quantity: 3.2, unitPrice: 21875, total: 70000 }],
    },
    groundTruth: null,
    notes: "Chờ quản trị viên kiểm duyệt và gán nhãn.",
  },
];

const parseModelJson = (candidate) => {
  let cleanText = String(candidate || "").trim();
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/```json/gi, "").replace(/```/g, "").trim();
  }
  try {
    return JSON.parse(cleanText);
  } catch {
    const start = cleanText.indexOf("{");
    const end = cleanText.lastIndexOf("}");
    if (start < 0 || end <= start) throw new Error("AI không trả về JSON hợp lệ.");
    return JSON.parse(cleanText.substring(start, end + 1));
  }
};

const comparableText = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]/g, "");

export const aiManagementService = {
  getConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (raw) {
        const stored = JSON.parse(raw);
        return {
          ...DEFAULT_AI_CONFIG,
          ...stored,
          provider: "aggeee",
          gatewayUrl: DEFAULT_AI_CONFIG.gatewayUrl,
          promptVersion: DEFAULT_AI_CONFIG.promptVersion,
          systemPrompt: stored.promptVersion === DEFAULT_AI_CONFIG.promptVersion
            ? stored.systemPrompt
            : DEFAULT_AI_CONFIG.systemPrompt,
        };
      }
    } catch {
      // Ignore malformed local configuration and fall back to safe defaults.
    }
    return { ...DEFAULT_AI_CONFIG };
  },

  saveConfig(config) {
    const secured = {
      ...config,
      provider: "aggeee",
      gatewayUrl: DEFAULT_AI_CONFIG.gatewayUrl,
      promptVersion: DEFAULT_AI_CONFIG.promptVersion,
    };
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(secured));
    return secured;
  },

  getSamples() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SAMPLES);
      if (raw) return JSON.parse(raw);
    } catch {
      // Rebuild the demo dataset if local storage is corrupted.
    }
    localStorage.setItem(STORAGE_KEY_SAMPLES, JSON.stringify(INITIAL_RECEIPT_SAMPLES));
    return INITIAL_RECEIPT_SAMPLES;
  },

  saveSample(updated) {
    const samples = this.getSamples();
    const index = samples.findIndex((sample) => sample.id === updated.id);
    if (index >= 0) samples[index] = updated;
    else samples.unshift(updated);
    localStorage.setItem(STORAGE_KEY_SAMPLES, JSON.stringify(samples));
    return samples;
  },

  deleteSample(id) {
    const samples = this.getSamples().filter((sample) => sample.id !== id);
    localStorage.setItem(STORAGE_KEY_SAMPLES, JSON.stringify(samples));
    return samples;
  },

  async checkGatewayHealth(customConfig = null) {
    const config = customConfig || this.getConfig();
    const startTime = performance.now();
    if (!config.apiKey) {
      return {
        healthy: false,
        latencyMs: 0,
        model: config.model,
        gateway: config.gatewayUrl,
        message: "Chưa cấu hình API key cho AI Gateway.",
      };
    }

    try {
      const endpoint = `${config.gatewayUrl.replace(/\/+$/, "")}/v1beta/models/${config.model}:generateContent`;
      const response = await axios.post(
        endpoint,
        { contents: [{ parts: [{ text: "Trả về đúng chuỗi OK" }] }] },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": config.apiKey,
            Authorization: `Bearer ${config.apiKey}`,
          },
          timeout: 15000,
        },
      );
      return {
        healthy: true,
        latencyMs: Math.round(performance.now() - startTime),
        model: config.model,
        gateway: config.gatewayUrl,
        message: "Gateway kết nối thành công và phản hồi ổn định.",
        raw: response.data,
      };
    } catch (error) {
      const status = error?.response?.status;
      const errorData = error?.response?.data;
      let message = error?.message || "Không thể kết nối tới Gateway.";
      if (status === 503) message = "Gateway tạm thời không có phiên Gemini hoạt động. Hãy đồng bộ lại phiên ở Aggeee Admin.";
      else if (status === 401 || status === 403) message = "API key không hợp lệ hoặc không có quyền truy cập.";
      else if (errorData?.error?.message) message = errorData.error.message;
      return {
        healthy: false,
        status,
        latencyMs: Math.round(performance.now() - startTime),
        model: config.model,
        gateway: config.gatewayUrl,
        message,
      };
    }
  },

  async testAnalyzeReceipt({ imageBase64, mimeType = "image/jpeg", customPrompt = null, fraudContext = {} }) {
    const config = this.getConfig();
    if (!config.apiKey) throw new Error("Vui lòng cấu hình API key trước khi phân tích hóa đơn.");
    const startTime = performance.now();
    const prompt = customPrompt || config.systemPrompt || buildReceiptSystemPrompt();
    const endpoint = `${config.gatewayUrl.replace(/\/+$/, "")}/v1beta/models/${config.model}:generateContent`;
    const payload = {
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: imageBase64 } },
        ],
      }],
      generationConfig: {
        temperature: Math.min(Math.max(Number(config.temperature) || 0, 0), 0.3),
        responseMimeType: "application/json",
        responseSchema: RECEIPT_RESPONSE_SCHEMA,
      },
    };

    const response = await axios.post(endpoint, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": config.apiKey,
        Authorization: `Bearer ${config.apiKey}`,
      },
      timeout: 60000,
    });

    const candidate = response.data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || "")
      .join("") || "";
    const parsedJson = parseModelJson(candidate);
    const analysis = normalizeAndValidateReceipt(parsedJson, fraudContext);
    return {
      rawText: candidate,
      parsed: toLegacyReceiptResult(analysis),
      analysis,
      latencyMs: Math.round(performance.now() - startTime),
      usage: response.data?.usageMetadata,
    };
  },

  evaluateDataset(samples) {
    const evaluated = samples.filter((sample) => sample.groundTruth && sample.aiResult);
    if (!evaluated.length) return { sampleCount: 0, fieldAccuracy: {}, amountMae: null };
    const fields = ["merchant", "currency", "transactionDate", "category"];
    const correct = Object.fromEntries(fields.map((field) => [field, 0]));
    let amountError = 0;
    let amountCount = 0;
    evaluated.forEach((sample) => {
      fields.forEach((field) => {
        if (comparableText(sample.aiResult[field]) === comparableText(sample.groundTruth[field])) correct[field] += 1;
      });
      const predicted = Number(sample.aiResult.totalAmount);
      const expected = Number(sample.groundTruth.totalAmount);
      if (Number.isFinite(predicted) && Number.isFinite(expected)) {
        amountError += Math.abs(predicted - expected);
        amountCount += 1;
      }
    });
    return {
      sampleCount: evaluated.length,
      fieldAccuracy: Object.fromEntries(fields.map((field) => [field, correct[field] / evaluated.length])),
      amountMae: amountCount ? amountError / amountCount : null,
    };
  },

  exportToFineTuningJSONL(samples) {
    const config = this.getConfig();
    return samples
      .filter((sample) => sample.groundTruth && (sample.status === "verified" || sample.status === "corrected"))
      .map((sample) => JSON.stringify({
        messages: [
          { role: "system", content: config.systemPrompt || buildReceiptSystemPrompt() },
          {
            role: "user",
            content: [
              { type: "text", text: "Phân tích chứng từ và trả về JSON theo Receipt Intelligence schema v2." },
              { type: "image_url", image_url: { url: sample.imageUrl } },
            ],
          },
          { role: "assistant", content: JSON.stringify(sample.groundTruth) },
        ],
        metadata: { sampleId: sample.id, source: sample.source, reviewed: true },
      }))
      .join("\n");
  },

  exportToFewShotPrompt(samples) {
    const verified = samples.filter((sample) => sample.groundTruth && (sample.status === "verified" || sample.status === "corrected"));
    const examples = verified.map((sample, index) => (
      `### Ví dụ ${index + 1}\nKết quả Ground Truth:\n${JSON.stringify(sample.groundTruth, null, 2)}`
    )).join("\n\n");
    return `CÁC MẪU ĐÃ ĐƯỢC CON NGƯỜI KIỂM DUYỆT:\n\n${examples}`;
  },
};
