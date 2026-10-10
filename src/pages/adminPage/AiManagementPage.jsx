import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Bot,
  Sparkles,
  Cpu,
  Database,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  Edit3,
  Download,
  Copy,
  Check,
  Play,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  FileText,
  Clock,
  Zap,
  HelpCircle,
  Plus,
  Trash2,
  Sliders,
} from "lucide-react";
import {
  aiManagementService,
  DEFAULT_AI_CONFIG,
} from "../../services/aiManagementService";

export default function AiManagementPage() {
  const [activeTab, setActiveTab] = useState("annotation"); // annotation | dataset | playground | config
  const [config, setConfig] = useState(DEFAULT_AI_CONFIG);
  const [samples, setSamples] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);
  
  // Selected sample for Review / Annotation Modal
  const [selectedSample, setSelectedSample] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  // Playground state
  const [testImageFile, setTestImageFile] = useState(null);
  const [testImagePreview, setTestImagePreview] = useState(null);
  const [testImageBase64, setTestImageBase64] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testError, setTestError] = useState(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  useEffect(() => {
    const loadedConfig = aiManagementService.getConfig();
    setConfig(loadedConfig);
    const loadedSamples = aiManagementService.getSamples();
    setSamples(loadedSamples);
    setCheckingHealth(true);
    aiManagementService.checkGatewayHealth(loadedConfig)
      .then(setHealthStatus)
      .finally(() => setCheckingHealth(false));
  }, []);

  const runHealthCheck = async (cfgToTest = null) => {
    setCheckingHealth(true);
    const res = await aiManagementService.checkGatewayHealth(cfgToTest || config);
    setHealthStatus(res);
    setCheckingHealth(false);
  };

  const handleSaveConfig = () => {
    aiManagementService.saveConfig(config);
    runHealthCheck(config);
    alert("Đã lưu cấu hình Aggeee AI Gateway thành công!");
  };

  const handleOpenReview = (sample) => {
    setSelectedSample(sample);
    setEditFormData(
      sample.groundTruth
        ? JSON.parse(JSON.stringify(sample.groundTruth))
        : JSON.parse(JSON.stringify(sample.aiResult))
    );
    setIsReviewOpen(true);
  };

  const handleSaveGroundTruth = () => {
    if (!selectedSample || !editFormData) return;
    const updated = {
      ...selectedSample,
      status: "verified",
      groundTruth: editFormData,
      notes: "Đã được Admin xác thực và chuẩn hóa làm Ground Truth cho AI.",
    };
    const nextSamples = aiManagementService.saveSample(updated);
    setSamples(nextSamples);
    setIsReviewOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setTestImageFile(file);
    setTestResult(null);
    setTestError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setTestImagePreview(reader.result);
      const b64 = reader.result.split(",")[1];
      setTestImageBase64(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleRunPlayground = async () => {
    if (!testImageBase64) return;
    setIsAnalyzing(true);
    setTestError(null);
    setTestResult(null);

    try {
      const res = await aiManagementService.testAnalyzeReceipt({
        imageBase64: testImageBase64,
        mimeType: testImageFile?.type || "image/jpeg",
        customPrompt: config.systemPrompt,
      });
      setTestResult(res);
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.detail ||
        (err?.response?.status === 503
          ? "Lỗi 503: Tài khoản Gemini trên Gateway tạm thời hết cookie hoạt động. Hãy đồng bộ cookie tài khoản trên trang Aggeee Admin."
          : err.message || "Lỗi khi gọi Gateway.");
      setTestError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportJSONL = () => {
    const jsonlContent = aiManagementService.exportToFineTuningJSONL(samples);
    const blob = new Blob([jsonlContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gemini_receipt_dataset_${Date.now()}.jsonl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyFewShot = () => {
    const text = aiManagementService.exportToFewShotPrompt(samples);
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const filteredSamples = samples.filter((s) => {
    if (statusFilter === "all") return true;
    return s.status === statusFilter;
  });

  const verifiedCount = samples.filter((s) => s.status === "verified" || s.status === "corrected").length;
  const datasetMetrics = aiManagementService.evaluateDataset(samples);
  const fieldAccuracyValues = Object.values(datasetMetrics.fieldAccuracy || {});
  const averageFieldAccuracy = fieldAccuracyValues.length
    ? fieldAccuracyValues.reduce((sum, value) => sum + value, 0) / fieldAccuracyValues.length
    : null;

  return (
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-white via-sky-50 to-cyan-50 text-slate-900 p-6 rounded-[1.5rem] shadow-[0_18px_50px_-32px_rgba(14,165,233,0.4)] border border-sky-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-sky-100 border border-sky-200 rounded-xl text-sky-600">
              <Bot size={26} />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Trung Tâm Quản Trị & Huấn Luyện AI</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Aggeee SaaS Engine
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            Tích hợp nền tảng <strong>https://aggeee.io.vn/</strong> — Trích xuất hóa đơn Multimodal AI, gán nhãn Ground Truth và xuất tập dữ liệu Train AI.
          </p>
        </div>

        {/* Quick Health Status Indicator */}
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-right">
            <div className="text-xs text-slate-500">Gateway Status</div>
            <div className="text-sm font-semibold flex items-center justify-end gap-1.5">
              {checkingHealth ? (
                <span className="flex items-center gap-1 text-amber-400">
                  <RefreshCw size={13} className="animate-spin" /> Kiểm tra...
                </span>
              ) : healthStatus?.healthy ? (
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Hoạt động ({healthStatus.latencyMs}ms)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-600">
                  <AlertTriangle size={13} /> Lỗi kết nối / Cookie
                </span>
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="bg-white border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700"
            onClick={() => runHealthCheck()}
            disabled={checkingHealth}
          >
            <RefreshCw size={14} className={checkingHealth ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {/* Health Warning Banner if 503 */}
      {healthStatus && !healthStatus.healthy && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 text-amber-700 dark:text-amber-300">
          <AlertTriangle className="shrink-0 mt-0.5 text-amber-500" size={20} />
          <div className="text-sm space-y-1">
            <p className="font-semibold">Cảnh báo trạng thái Aggeee Gateway: {healthStatus.message}</p>
            <p className="text-xs opacity-90">
              * Gợi ý: Hãy đăng nhập trang quản trị tài khoản tại <a href="https://aggeee.io.vn" target="_blank" rel="noreferrer" className="underline font-bold inline-flex items-center gap-0.5">aggeee.io.vn <ExternalLink size={12} /></a> để đồng bộ lại Session Cookie của tài khoản Google Gemini.
            </p>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-1">
        <button
          onClick={() => setActiveTab("annotation")}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all border-b-2 ${
            activeTab === "annotation"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Layers size={16} />
          Quản lý Hóa Đơn & Gán Nhãn
          <span className="ml-1 px-2 py-0.2 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {samples.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("dataset")}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all border-b-2 ${
            activeTab === "dataset"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Database size={16} />
          Bộ Dữ Liệu Train AI (Dataset)
          <span className="ml-1 px-2 py-0.2 rounded-full text-xs bg-emerald-100 text-emerald-700">
            {verifiedCount} Chuẩn
          </span>
        </button>

        <button
          onClick={() => setActiveTab("playground")}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all border-b-2 ${
            activeTab === "playground"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Sparkles size={16} />
          AI Playground (Thử Nghiệm Trực Tiếp)
        </button>

        <button
          onClick={() => setActiveTab("config")}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all border-b-2 ${
            activeTab === "config"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Sliders size={16} />
          Cấu Hình Aggeee Gateway
        </button>
      </div>

      {/* TAB 1: ANNOTATION / GROUND TRUTH REVIEW */}
      {activeTab === "annotation" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold">Nhật ký quét & Đối chiếu dữ liệu Ground Truth</h2>
              <p className="text-xs text-slate-500">
                Kiểm tra kết quả AI bóc tách từ ảnh người dùng tải lên, hiệu chỉnh số liệu sai và lưu thành dữ liệu mẫu chuẩn (Ground Truth).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Lọc trạng thái:</span>
              <select
                className="text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả ({samples.length})</option>
                <option value="verified">Đã xác thực (Verified)</option>
                <option value="corrected">Đã sửa tay (Corrected)</option>
                <option value="pending">Chờ duyệt (Pending)</option>
              </select>
            </div>
          </div>

          <Card className="shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead className="w-20">Ảnh</TableHead>
                  <TableHead>Mã lượt quét / Người gửi</TableHead>
                  <TableHead>Tên cửa hàng (AI)</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Danh mục gợi ý</TableHead>
                  <TableHead>Độ tin cậy</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSamples.map((sample) => (
                  <TableRow key={sample.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <TableCell>
                      <img
                        src={sample.imageUrl}
                        alt="Receipt"
                        className="w-12 h-14 object-cover rounded-md border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => handleOpenReview(sample)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-xs text-indigo-600 dark:text-indigo-400 font-mono">
                        {sample.id}
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300">{sample.userEmail}</div>
                      <div className="text-[10px] text-slate-400">{sample.uploadedAt}</div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {sample.groundTruth?.merchant || sample.aiResult?.merchant || "—"}
                    </TableCell>
                    <TableCell className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                      {(sample.groundTruth?.totalAmount || sample.aiResult?.totalAmount || 0).toLocaleString("vi-VN")} đ
                    </TableCell>
                    <TableCell>
                      <span className="inline-block px-2 py-0.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                        {sample.groundTruth?.category || sample.aiResult?.category || "Khác"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              (sample.aiResult?.confidence || 0) >= 0.9
                                ? "bg-emerald-500"
                                : (sample.aiResult?.confidence || 0) >= 0.7
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${(sample.aiResult?.confidence || 0) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 font-mono">
                          {Math.round((sample.aiResult?.confidence || 0) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {sample.status === "verified" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 size={12} /> Đã chuẩn hóa
                        </span>
                      ) : sample.status === "corrected" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                          <Edit3 size={12} /> Đã sửa tay
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                          <Clock size={12} /> Chờ duyệt
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                        onClick={() => handleOpenReview(sample)}
                      >
                        <Eye size={13} />
                        Đối chiếu & Gán nhãn
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* TAB 2: DATASET & FINE-TUNING */}
      {activeTab === "dataset" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800 border-indigo-100 dark:border-indigo-900/50">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Mẫu Đã Chuẩn Hóa (Ground Truth)</CardDescription>
                <CardTitle className="text-3xl font-bold text-indigo-600">{verifiedCount} mẫu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500">
                  Sẵn sàng trích xuất thành tập dữ liệu huấn luyện Supervised Fine-Tuning (SFT).
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-slate-900 dark:to-slate-800 border-emerald-100 dark:border-emerald-900/50">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Độ Chính Xác Trung Bình AI</CardDescription>
                <CardTitle className="text-3xl font-bold text-emerald-600">
                  {averageFieldAccuracy === null ? "Chưa đủ mẫu" : `${(averageFieldAccuracy * 100).toFixed(1)}%`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500">
                  Dựa trên đối chiếu giữa AI Prediction và Ground Truth của Admin.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-slate-900 dark:to-slate-800 border-purple-100 dark:border-purple-900/50">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Định Dạng Xuất Dataset</CardDescription>
                <CardTitle className="text-2xl font-bold text-purple-600">JSONL & Few-Shot</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500">
                  Tương thích 100% với Google Vertex AI, Gemini Fine-Tuning & OpenAI SFT.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="text-indigo-600" size={20} />
                Xuất Dữ Liệu Huấn Luyện (Dataset Export)
              </CardTitle>
              <CardDescription className="text-xs">
                Sử dụng các mẫu hóa đơn đã được Admin kiểm duyệt và gán nhãn chuẩn để huấn luyện hoặc làm ví dụ mồi (Few-Shot) cho Gemini Vision.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Download size={16} className="text-indigo-600" />
                      Xuất File JSONL (Fine-Tuning SFT)
                    </h3>
                    <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700">Gemini SFT Format</Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    Mỗi dòng là một đối tượng JSON gồm `system prompt`, `image input` và `ground truth json output` chuẩn hóa. Nạp trực tiếp vào pipeline huấn luyện mô hình.
                  </p>
                  <Button
                    onClick={handleExportJSONL}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5"
                    disabled={verifiedCount === 0}
                  >
                    <Download size={14} /> Tải file dataset ({verifiedCount} mẫu)
                  </Button>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Copy size={16} className="text-emerald-600" />
                      Xuất Few-Shot Examples
                    </h3>
                    <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700">Prompt In-Context</Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    Tự động tạo ra chuỗi ví dụ mẫu thực tế (WinMart, Highlands, Xăng dầu) để gắn trực tiếp vào System Prompt mà không cần tốn chi phí train lại mô hình.
                  </p>
                  <Button
                    onClick={handleCopyFewShot}
                    variant="outline"
                    className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs gap-1.5"
                    disabled={verifiedCount === 0}
                  >
                    {copiedPrompt ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    {copiedPrompt ? "Đã sao chép vào bộ nhớ đệm!" : "Sao chép Few-Shot Prompt"}
                  </Button>
                </div>
              </div>

              {/* Preview JSONL Box */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span className="font-semibold">Bản xem trước mẫu dữ liệu huấn luyện (JSONL Entry Preview):</span>
                  <span>1 trong {verifiedCount} mẫu</span>
                </div>
                <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto max-h-60 border border-slate-800">
                  {samples.length > 0 && samples[0].groundTruth
                    ? JSON.stringify(
                        {
                          messages: [
                            { role: "system", content: "Financial Receipt Extractor" },
                            { role: "user", content: [{ type: "image_url", url: samples[0].imageUrl }] },
                            { role: "assistant", content: JSON.stringify(samples[0].groundTruth) },
                          ],
                        },
                        null,
                        2
                      )
                    : "// Chưa có mẫu nào được xác nhận"}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: AI PLAYGROUND */}
      {activeTab === "playground" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Image upload & trigger */}
          <Card className="border-slate-200 dark:border-slate-800 space-y-4 p-6">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="text-indigo-600" size={20} />
                Thử nghiệm phân tích hóa đơn trực tiếp
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tải lên bất kỳ ảnh hóa đơn nào từ máy tính để kiểm tra khả năng bóc tách thực tế của Gateway Aggeee.
              </p>
            </div>

            {/* Upload Dropzone */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-indigo-500 transition-colors bg-slate-50/50 dark:bg-slate-900/50">
              {testImagePreview ? (
                <div className="space-y-3">
                  <img
                    src={testImagePreview}
                    alt="Upload Preview"
                    className="max-h-64 mx-auto rounded-lg shadow-md border border-slate-200 dark:border-slate-700 object-contain"
                  />
                  <div className="flex justify-center gap-2">
                    <label className="cursor-pointer text-xs bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 px-3 py-1.5 rounded-lg font-medium">
                      Đổi ảnh khác
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer space-y-2 block">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto">
                    <UploadCloud size={24} />
                  </div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Bấm để chọn ảnh hóa đơn hoặc kéo thả vào đây
                  </div>
                  <p className="text-xs text-slate-400">Hỗ trợ JPG, PNG, WEBP tối đa 10MB</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-500">
                Model đang dùng: <span className="font-semibold text-indigo-600">{config.model}</span>
              </div>
              <Button
                onClick={handleRunPlayground}
                disabled={!testImageBase64 || isAnalyzing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-medium text-xs px-5 py-2.5"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Đang bóc tách bằng AI...
                  </>
                ) : (
                  <>
                    <Play size={14} /> Chạy thử nghiệm ngay
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Right Column: AI Output */}
          <Card className="border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-semibold text-sm">Kết quả AI bóc tách (Structured JSON)</h3>
                {testResult?.latencyMs && (
                  <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 font-mono">
                    <Zap size={11} className="mr-1" /> {testResult.latencyMs} ms
                  </Badge>
                )}
              </div>

              {testError ? (
                <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs space-y-2">
                  <div className="font-semibold flex items-center gap-1.5 text-sm">
                    <AlertTriangle size={16} /> Lỗi phân tích
                  </div>
                  <p>{testError}</p>
                </div>
              ) : testResult ? (
                <div className="mt-4 space-y-4">
                  {testResult.parsed && (
                    <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Tên cửa hàng:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                          {testResult.parsed.merchant || "Không xác định"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Tổng số tiền:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">
                          {testResult.parsed.totalAmount?.toLocaleString("vi-VN") || 0} đ
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Ngày giao dịch:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {testResult.parsed.transactionDate || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Danh mục gán:</span>
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">
                          {testResult.parsed.category || "—"}
                        </span>
                      </div>
                    </div>
                  )}

                  {testResult.analysis && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-semibold text-slate-800">
                          <ShieldCheck size={16} className="text-cyan-600" />
                          Kiểm định & chống gian lận
                        </div>
                        <div className="flex gap-2">
                          <Badge className={testResult.analysis.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}>
                            {testResult.analysis.status}
                          </Badge>
                          <Badge className={testResult.analysis.fraudRisk?.riskLevel === "LOW" ? "bg-cyan-50 text-cyan-700" : "bg-rose-50 text-rose-700"}>
                            Risk {testResult.analysis.fraudRisk?.score ?? 0}/100
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-slate-600">
                        <span>Đối soát tổng tiền</span>
                        <strong className={testResult.analysis.reconciliation?.totalMatches === false ? "text-rose-600" : "text-emerald-600"}>
                          {testResult.analysis.reconciliation?.totalMatches === false ? "Không khớp" : "Hợp lệ / chưa đủ dữ liệu"}
                        </strong>
                        <span>Confidence tổng tiền</span>
                        <strong className="text-slate-800">
                          {Math.round((testResult.analysis.confidence?.totalAmount || 0) * 100)}%
                        </strong>
                      </div>
                      {testResult.analysis.warnings?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {testResult.analysis.warnings.map((warning) => (
                            <span key={warning} className="rounded-md bg-amber-50 px-2 py-1 font-medium text-amber-800">
                              {warning}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="mt-3 text-[11px] leading-4 text-slate-500">
                        Điểm rủi ro là tín hiệu cần xác minh, không phải kết luận nhân viên gian lận.
                      </p>
                    </div>
                  )}

                  <pre className="p-3 bg-slate-950 text-indigo-300 rounded-xl text-xs font-mono overflow-auto max-h-72 border border-slate-800">
                    {JSON.stringify(testResult.analysis || testResult.parsed, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
                  <FileText size={32} className="opacity-40" />
                  <p>Chọn ảnh hóa đơn và bấm "Chạy thử nghiệm ngay" để xem kết quả.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: CONFIGURATION */}
      {activeTab === "config" && (
        <Card className="border-slate-200 dark:border-slate-800 max-w-4xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sliders size={20} className="text-indigo-600" />
              Thiết lập Aggeee AI Gateway (https://aggeee.io.vn)
            </CardTitle>
            <CardDescription className="text-xs">
              Cấu hình endpoint, API Key và System Instruction chuẩn cho toàn bộ luồng bóc tách hóa đơn trong hệ thống.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Aggeee Gateway (nhà cung cấp duy nhất)</label>
                <Input
                  value={config.gatewayUrl}
                  readOnly
                  placeholder="https://aggeee.io.vn"
                  className="text-xs bg-slate-50 text-slate-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Model Gemini</label>
                <select
                  className="w-full text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
                  value={config.model}
                  onChange={(e) => setConfig({ ...config, model: e.target.value })}
                >
                  <option value="gemini-3.7-flash">gemini-3.7-flash (Khuyên dùng: Nhanh & Đọc ảnh chuẩn)</option>
                  <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Tốc độ cao nhất)</option>
                  <option value="gemini-3.1-pro">gemini-3.1-pro (Suy luận sâu)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                API Key (Bearer Token / x-goog-api-key)
              </label>
              <div className="relative">
                <Input
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="gemi-..."
                  className="text-xs pr-20 font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(config.apiKey);
                    setCopiedKey(true);
                    setTimeout(() => setCopiedKey(false), 2000);
                  }}
                  className="absolute right-2 top-2 text-xs text-slate-400 hover:text-slate-600 px-2 py-0.5"
                >
                  {copiedKey ? "Đã chép" : "Sao chép"}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                System Prompt (Quy tắc & Schema bóc tách hóa đơn)
              </label>
              <textarea
                rows={10}
                value={config.systemPrompt}
                onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                className="w-full text-xs font-mono rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setConfig(DEFAULT_AI_CONFIG)}
              >
                Khôi phục mặc định
              </Button>
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5"
                onClick={handleSaveConfig}
              >
                <Check size={14} /> Lưu cấu hình Gateway
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MODAL: SIDE-BY-SIDE REVIEW & GROUND TRUTH ANNOTATION */}
      {isReviewOpen && selectedSample && editFormData && (
        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg flex items-center gap-2">
                <Edit3 className="text-indigo-600" size={18} />
                Đối chiếu & Gán nhãn Ground Truth (ID: {selectedSample.id})
              </DialogTitle>
              <DialogDescription className="text-xs">
                So sánh ảnh gốc với dữ liệu AI bóc tách. Sửa các thông số chưa chuẩn để tạo bộ dữ liệu mẫu huấn luyện.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
              {/* Left Column: Image Preview */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-600">Ảnh hóa đơn người dùng:</div>
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-black/5 max-h-[460px] flex items-center justify-center p-2">
                  <img
                    src={selectedSample.imageUrl}
                    alt="Receipt Original"
                    className="max-h-[440px] w-auto object-contain rounded-lg shadow-sm"
                  />
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>Nguồn: {selectedSample.source}</span>
                  <span>Thời gian: {selectedSample.uploadedAt}</span>
                </div>
              </div>

              {/* Right Column: Editable Form */}
              <div className="space-y-3.5">
                <div className="text-xs font-semibold text-slate-600 flex justify-between items-center">
                  <span>Thông tin Ground Truth chuẩn hóa:</span>
                  <Badge variant="outline" className="text-[10px]">Editable</Badge>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-medium">Tên cửa hàng / Đơn vị cung cấp:</label>
                  <Input
                    className="text-xs font-medium"
                    value={editFormData.merchant || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, merchant: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">Tổng tiền (VND):</label>
                    <Input
                      type="number"
                      className="text-xs font-bold text-emerald-600"
                      value={editFormData.totalAmount || 0}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, totalAmount: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">Ngày giao dịch:</label>
                    <Input
                      type="date"
                      className="text-xs"
                      value={editFormData.transactionDate || ""}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, transactionDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-medium">Danh mục chi tiêu chuẩn:</label>
                  <select
                    className="w-full text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
                    value={editFormData.category || "Ăn uống"}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  >
                    <option value="Ăn uống">Ăn uống (Nhà hàng, Quán cafe, Bách hóa)</option>
                    <option value="Mua sắm">Mua sắm (Quần áo, Đồ gia dụng, Siêu thị)</option>
                    <option value="Đi lại">Đi lại (Xăng xe, Grab, Gửi xe, Taxi)</option>
                    <option value="Hóa đơn & Tiện ích">Hóa đơn & Tiện ích (Điện, Nước, Internet)</option>
                    <option value="Y tế & Sức khỏe">Y tế & Sức khỏe (Thuốc men, Bệnh viện)</option>
                    <option value="Giải trí">Giải trí (Xem phim, Du lịch, Thể thao)</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs text-slate-500 font-medium">Chi tiết các mặt hàng (Items):</label>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 border border-slate-200 dark:border-slate-800 rounded-lg p-2 bg-slate-50/50 dark:bg-slate-900/50">
                    {(editFormData.items || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs">
                        <Input
                          className="h-7 text-xs flex-1"
                          value={item.name}
                          onChange={(e) => {
                            const newItems = [...editFormData.items];
                            newItems[idx].name = e.target.value;
                            setEditFormData({ ...editFormData, items: newItems });
                          }}
                        />
                        <Input
                          type="number"
                          className="h-7 text-xs w-16"
                          placeholder="SL"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...editFormData.items];
                            newItems[idx].quantity = Number(e.target.value);
                            setEditFormData({ ...editFormData, items: newItems });
                          }}
                        />
                        <Input
                          type="number"
                          className="h-7 text-xs w-24 text-right"
                          placeholder="Giá"
                          value={item.total}
                          onChange={(e) => {
                            const newItems = [...editFormData.items];
                            newItems[idx].total = Number(e.target.value);
                            setEditFormData({ ...editFormData, items: newItems });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsReviewOpen(false)}>
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
                    onClick={handleSaveGroundTruth}
                  >
                    <CheckCircle2 size={14} /> Xác nhận Ground Truth
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
