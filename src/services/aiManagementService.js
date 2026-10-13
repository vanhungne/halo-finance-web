import { buildReceiptSystemPrompt } from "./receiptIntelligence";
import { instance } from "./instance";

const STORAGE_KEY_CONFIG = "ai_gateway_config";
const STORAGE_KEY_SAMPLES = "ai_receipt_samples";

export const REASONING_LEVELS = [
  {
    id: "low",
    title: "Thấp",
    subtitle: "Nhanh chóng và hiệu quả",
    description: "Tối ưu hóa tốc độ phản hồi (~1-3s), lý tưởng cho quét hóa đơn, biên lai tức thì và bóc tách tự động.",
    model: "gemini-3.5-flash-lite",
    badge: "⚡ Siêu Tốc (Khuyên Dùng)",
    latency: "~2-3s",
  },
  {
    id: "medium",
    title: "Trung bình",
    subtitle: "Độ sâu cân bằng",
    description: "Cân bằng hoàn hảo giữa tốc độ và độ chính xác phân tích, phù hợp phân loại thu chi và tư vấn tài chính.",
    model: "gemini-3.7-flash",
    badge: "⚖️ Cân Bằng",
    latency: "~4-6s",
  },
  {
    id: "high",
    title: "Cao",
    subtitle: "Cực kỳ kỹ lưỡng",
    description: "Suy luận logic nhiều tầng, đối soát chuyên sâu báo cáo tài chính phức tạp và kiểm tra phát hiện sai số.",
    model: "gemini-3.1-pro",
    badge: "🧠 Suy Luận Sâu",
    latency: "~25s",
  },
];

export const DEFAULT_AI_CONFIG = {
  provider: "gateway",
  promptVersion: "receipt-intelligence-v2",
  gatewayUrl: "https://gemini.amz.io.vn",
  model: "gemini-3.5-flash-lite",
  reasoningLevel: "low",
  apiKey: "",
  temperature: 0.1,
  systemPrompt: buildReceiptSystemPrompt(),
};

export const INITIAL_RECEIPT_SAMPLES = [
  {
    id: "rcpt-001",
    imageUrl: "https://images.unsplash.com/photo-1554415707-9e4466bfe0b0?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-10-10T08:30:00Z",
    userEmail: "hungse17003@gmail.com",
    status: "verified",
    source: "CAMERA",
    aiResult: {
      merchant: "Highlands Coffee - Vincom Da Nang",
      totalAmount: 115000,
      currency: "VND",
      transactionDate: "2026-10-10",
      category: "Ăn uống",
      confidence: 0.98,
      paymentMethod: "Momo",
      items: [
        { name: "Phin Sữa Đá Cỡ Lớn", quantity: 2, unitPrice: 45000, total: 90000 },
        { name: "Bánh Mì Que Gà Phô Mai", quantity: 1, unitPrice: 25000, total: 25000 },
      ],
    },
    groundTruth: {
      merchant: "Highlands Coffee - Vincom Da Nang",
      totalAmount: 115000,
      currency: "VND",
      transactionDate: "2026-10-10",
      category: "Ăn uống",
      confidence: 1.0,
      paymentMethod: "Momo",
      items: [
        { name: "Phin Sữa Đá Cỡ Lớn", quantity: 2, unitPrice: 45000, total: 90000 },
        { name: "Bánh Mì Que Gà Phô Mai", quantity: 1, unitPrice: 25000, total: 25000 },
      ],
    },
    notes: "Độ chính xác cao, bóc tách đầy đủ danh sách món.",
  },
  {
    id: "rcpt-002",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-10-09T19:15:00Z",
    userEmail: "vietdung.dev@gmail.com",
    status: "pending",
    source: "CAMERA",
    aiResult: {
      merchant: "Cây xăng Petrolimex Số 15",
      totalAmount: 500000,
      currency: "VND",
      transactionDate: "2026-10-09",
      category: "Di chuyển",
      confidence: 0.92,
      paymentMethod: "Thẻ ATM",
      items: [
        { name: "Xăng RON 95-III", quantity: 21.8, unitPrice: 22930, total: 500000 },
      ],
    },
    groundTruth: null,
    notes: "Chờ Admin gắn nhãn và duyệt vào tập Train Dataset.",
  },
];

const comparableText = (value) => String(value || "").trim().toLowerCase();

export const aiManagementService = {
  // --- Backend Persistence Endpoints ---
  async fetchServerSettings() {
    try {
      const response = await instance.get("admin/receipt-ai/settings");
      return response.data;
    } catch (err) {
      console.warn("fetchServerSettings:", err?.message || err);
      return null;
    }
  },

  async saveServerSettings({ gatewayUrl, apiKey, receiptModel, reasoningLevel }) {
    const payload = {};
    if (gatewayUrl !== undefined) payload.gatewayUrl = gatewayUrl;
    if (apiKey !== undefined && apiKey !== "") payload.apiKey = apiKey;
    if (receiptModel !== undefined) payload.receiptModel = receiptModel;
    if (reasoningLevel !== undefined) payload.reasoningLevel = reasoningLevel;
    const response = await instance.put("admin/receipt-ai/settings", payload);
    return response.data;
  },

  async testServerConnection({ gatewayUrl, apiKey }) {
    const response = await instance.post("admin/receipt-ai/settings/test", {
      gatewayUrl: gatewayUrl || undefined,
      apiKey: apiKey || undefined,
    });
    return response.data;
  },

  // --- Local Settings Cache ---
  getConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (!raw) return DEFAULT_AI_CONFIG;
      const stored = JSON.parse(raw);
      return {
        ...DEFAULT_AI_CONFIG,
        ...stored,
        gatewayUrl: stored.gatewayUrl || DEFAULT_AI_CONFIG.gatewayUrl,
        provider: "gateway",
      };
    } catch {
      return DEFAULT_AI_CONFIG;
    }
  },

  saveConfig(nextConfig) {
    const current = this.getConfig();
    const toSave = {
      ...current,
      ...nextConfig,
      provider: "gateway",
    };
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(toSave));
    return toSave;
  },

  getSamples() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SAMPLES);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY_SAMPLES, JSON.stringify(INITIAL_RECEIPT_SAMPLES));
        return INITIAL_RECEIPT_SAMPLES;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_RECEIPT_SAMPLES;
    }
  },

  saveSample(updated) {
    const samples = this.getSamples();
    const index = samples.findIndex((sample) => sample.id === updated.id);
    const nextSamples = index >= 0
      ? samples.map((sample, i) => (i === index ? updated : sample))
      : [updated, ...samples];
    localStorage.setItem(STORAGE_KEY_SAMPLES, JSON.stringify(nextSamples));
    return nextSamples;
  },

  deleteSample(id) {
    const samples = this.getSamples().filter((sample) => sample.id !== id);
    localStorage.setItem(STORAGE_KEY_SAMPLES, JSON.stringify(samples));
    return samples;
  },

  async checkGatewayHealth(customConfig = null) {
    // 1. Try server-side health check first (same path mobile uses)
    try {
      const res = await instance.get("admin/receipt-ai/health");
      if (res.data) {
        return {
          healthy: res.data.healthy,
          latencyMs: res.data.latencyMs,
          gateway: res.data.gateway,
          model: res.data.model || "gemini-3.5-flash-lite",
          message: res.data.message,
          checkedAt: new Date().toISOString(),
        };
      }
    } catch (serverErr) {
      // Backend not yet reachable or not logged in; fallback to direct gateway check
    }

    // 2. Direct browser check
    const config = customConfig || this.getConfig();
    const startTime = performance.now();
    const cleanUrl = (config.gatewayUrl || DEFAULT_AI_CONFIG.gatewayUrl).replace(/\/+$/, "");

    try {
      await fetch(`${cleanUrl}/healthz`, {
        method: "GET",
        mode: "no-cors",
        cache: "no-cache",
      });

      const latencyMs = Math.max(1, Math.round(performance.now() - startTime));
      return {
        healthy: true,
        latencyMs,
        gateway: cleanUrl,
        model: config.model || "gemini-3.5-flash-lite",
        message: `AI Gateway trực tuyến (${latencyMs}ms) — Sẵn sàng phân tích`,
        checkedAt: new Date().toISOString(),
      };
    } catch (gatewayErr) {
      return {
        healthy: false,
        latencyMs: null,
        gateway: cleanUrl,
        model: config.model || "gemini-3.5-flash-lite",
        message: `Không thể kết nối đến máy chủ AI Gateway: ${gatewayErr.message}`,
        checkedAt: new Date().toISOString(),
      };
    }
  },

  async fetchAvailableModels(customGatewayUrl = null, customApiKey = null) {
    // 1. Try fetching models through backend admin endpoint
    try {
      const res = await instance.get("admin/receipt-ai/models");
      if (res.data?.models && Array.isArray(res.data.models) && res.data.models.length > 0) {
        return res.data.models.map((m) => {
          const id = m.name ? m.name.replace(/^models\//, "") : (m.id || m.baseModelId || m.displayName);
          return {
            id: id,
            name: m.displayName || id,
            description: m.description || "",
            supportedGenerationMethods: m.supportedGenerationMethods || [],
          };
        });
      }
    } catch (e) {
      // Fallback to direct gateway call
    }

    // 2. Direct gateway call from browser
    const config = this.getConfig();
    const gateway = (customGatewayUrl || config.gatewayUrl || DEFAULT_AI_CONFIG.gatewayUrl).replace(/\/+$/, "");
    const apiKey = customApiKey || config.apiKey || "";

    try {
      const headers = { Accept: "application/json" };
      if (apiKey) {
        headers["x-goog-api-key"] = apiKey;
        headers["Authorization"] = `Bearer ${apiKey}`;
      }

      const res = await fetch(`${gateway}/v1beta/models`, {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        throw new Error(`Gateway returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const list = data.models || data.data || [];
      return list.map((m) => {
        const id = m.name ? m.name.replace(/^models\//, "") : (m.baseModelId || m.displayName);
        return {
          id: id,
          name: m.displayName || id,
          description: m.description || "",
          supportedGenerationMethods: m.supportedGenerationMethods || [],
        };
      });
    } catch (err) {
      return [
        { id: "gemini-3.5-flash-lite", name: "Gemini 3.5 Flash Lite (Siêu Tốc)", description: "Tối ưu hóa phản hồi bóc tách biên lai tức thì" },
        { id: "gemini-3.7-flash", name: "Gemini 3.7 Flash (Trợ Giúp Toàn Diện)", description: "Cân bằng tốc độ và độ chuẩn xác" },
        { id: "gemini-3.1-pro", name: "Gemini 3.1 Pro (Suy Luận Đa Tầng)", description: "Chuyên sâu đối soát báo cáo tài chính phức tạp" },
        { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", description: "Bản sao lưu ổn định cao" },
      ];
    }
  },

  async testAnalyzeReceipt({ imageBase64, mimeType = "image/jpeg", customPrompt = null, config: inputConfig = null }) {
    const startTime = performance.now();
    const config = inputConfig || this.getConfig();

    const callDirectGateway = async (gatewayUrl) => {
      const apiKey = config.apiKey || "";
      const model = config.model || "gemini-3.5-flash-lite";
      const promptText = (customPrompt || config.systemPrompt || buildReceiptSystemPrompt()) +
        "\n\nHãy trích xuất thông tin hóa đơn sau và trả về DUY NHẤT một chuỗi JSON chuẩn RFC 8259.";

      const cleanGateway = (gatewayUrl || DEFAULT_AI_CONFIG.gatewayUrl).replace(/\/+$/, "");
      const endpoint = `${cleanGateway}/v1beta/models/${model}:generateContent`;

      const headers = { "Content-Type": "application/json" };
      if (apiKey) {
        headers["x-goog-api-key"] = apiKey;
        headers["Authorization"] = `Bearer ${apiKey}`;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: promptText },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: typeof config.temperature === "number" ? config.temperature : 0.1,
            responseMimeType: "application/json",
          },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        const errObj = new Error(`AI Gateway trả về mã HTTP ${res.status}: ${errorText.substring(0, 300)}`);
        errObj.status = res.status;
        throw errObj;
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error("Gateway không trả về nội dung text trong parts[0]");

      const latencyMs = Math.round(performance.now() - startTime);
      return { rawText, latencyMs, modelUsed: model, endpointUsed: endpoint };
    };

    try {
      const gatewayRes = await callDirectGateway(config.gatewayUrl);
      const parsed = this.safeParseReceiptJson(gatewayRes.rawText);

      return {
        success: true,
        data: parsed,
        rawJson: gatewayRes.rawText,
        latencyMs: gatewayRes.latencyMs,
        model: gatewayRes.modelUsed,
        endpoint: gatewayRes.endpointUsed,
      };
    } catch (err) {
      // Fallback through backend OCR endpoint if direct fails
      try {
        const form = new FormData();
        const blob = this.base64ToBlob(imageBase64, mimeType);
        form.append("invoice", blob, "receipt.jpg");

        const response = await instance.post("transaction/ocr", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const latencyMs = Math.round(performance.now() - startTime);
        return {
          success: true,
          data: response.data,
          rawJson: JSON.stringify(response.data, null, 2),
          latencyMs,
          model: "Backend-OCR-Pipeline",
          endpoint: "/api/transaction/ocr",
        };
      } catch (backendErr) {
        return {
          success: false,
          error: err?.message || backendErr?.response?.data?.message || "Lỗi khi gọi AI Gateway",
          latencyMs: Math.round(performance.now() - startTime),
        };
      }
    }
  },

  safeParseReceiptJson(text) {
    if (!text) throw new Error("Không có phản hồi từ mô hình AI");
    let cleaned = text.trim();
    if (cleaned.startsWith("```json")) cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
    else if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace >= 0 && lastBrace > firstBrace) {
        return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      }
      throw new Error("Không thể phân tích phản hồi JSON từ AI: " + err.message);
    }
  },

  base64ToBlob(base64Data, contentType = "image/jpeg") {
    const sliceSize = 512;
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  },

  computeMetrics(samples) {
    const verified = samples.filter((s) => s.status === "verified" && s.groundTruth && s.aiResult);
    if (!verified.length) {
      return { total: samples.length, verifiedCount: 0, fieldAccuracy: 0, avgConfidence: 0, ocrMatchRate: 0 };
    }

    let totalChecks = 0;
    let correctChecks = 0;
    let confidenceSum = 0;
    let amountMatch = 0;

    verified.forEach((s) => {
      const ai = s.aiResult || {};
      const gt = s.groundTruth || {};

      confidenceSum += Number(ai.confidence || 0);

      totalChecks += 1;
      if (comparableText(ai.merchant) === comparableText(gt.merchant)) correctChecks += 1;

      totalChecks += 1;
      if (Math.abs(Number(ai.totalAmount || 0) - Number(gt.totalAmount || 0)) <= 1) {
        correctChecks += 1;
        amountMatch += 1;
      }

      totalChecks += 1;
      if (comparableText(ai.transactionDate) === comparableText(gt.transactionDate)) correctChecks += 1;

      totalChecks += 1;
      if (comparableText(ai.category) === comparableText(gt.category)) correctChecks += 1;
    });

    return {
      total: samples.length,
      verifiedCount: verified.length,
      fieldAccuracy: Math.round((correctChecks / Math.max(1, totalChecks)) * 100),
      ocrMatchRate: Math.round((amountMatch / verified.length) * 100),
      avgConfidence: Math.round((confidenceSum / verified.length) * 100),
    };
  },

  exportDatasetJson(samples) {
    const exportable = samples
      .filter((s) => s.status === "verified" && s.groundTruth)
      .map((s) => ({
        id: s.id,
        imageUrl: s.imageUrl,
        source: s.source,
        groundTruth: s.groundTruth,
        verifiedAt: new Date().toISOString(),
      }));

    return JSON.stringify(exportable, null, 2);
  },
};
