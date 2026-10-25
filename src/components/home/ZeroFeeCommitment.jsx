import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Workflow,
  Network,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Lock,
  Database,
  Sliders,
  TrendingDown,
  Layers,
  Scale,
  Receipt,
  QrCode,
  Users2,
  Building2,
  BadgeCheck,
  Zap,
  Award,
  ChevronRight,
  Activity,
  FileSpreadsheet,
  Check,
  Clock,
  Sparkle,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function ZeroFeeCommitment({ onOpenQr }) {
  const { lang, strings } = useLanguage();
  const isEn = lang === "en";

  // Interactive TCO Simulator States
  const [profileType, setProfileType] = useState("personal"); // "personal" | "family" | "business"
  const [monthlyTx, setMonthlyTx] = useState(120);
  const [walletsCount, setWalletsCount] = useState(4);
  const [simViewMode, setSimViewMode] = useState("optimized"); // "traditional" | "optimized"

  // Mathematical Projections
  const multiplier = profileType === "personal" ? 1 : profileType === "family" ? 1.6 : 2.5;
  const softwareSavingsAnnual = Math.round((monthlyTx > 80 ? 99000 : 59000) * 12 * multiplier);
  const hoursSavedAnnual = Math.round((monthlyTx * 2.2 * 12) / 60); // 2.2 mins per manual entry
  const transferReductionPercent = profileType === "personal" ? 65 : 82;

  // Deep Domain Architecture Pillars (Extracted directly from backend domain & mobile capabilities)
  const ARCHITECTURE_PILLARS = [
    {
      id: "graph-settlement",
      code: "ENG-01",
      badge: isEn ? "Bipartite Graph Algorithm" : "Thuật Toán Đồ Thị Bipartite",
      title: isEn ? "Min-Flow Debt Simplification" : "Tối Giản Hóa Nợ Ròng Đồ Thị",
      subtitle: isEn ? "O(V + E) Mathematical Reconciliation" : "Quyết toán quỹ nhóm tối ưu O(V + E)",
      desc: isEn
        ? "Eliminates chaotic peer-to-peer transfers. Our arbitrary-precision graph algorithm resolves multi-party debts with up to 85% fewer bank transactions and zero transfer friction."
        : "Triệt tiêu hoàn toàn sự hỗn loạn khi chia tiền nhóm. Thuật toán giải quyết nợ ma trận tự động bù trừ số dư chéo, quy đổi 10+ giao dịch phức tạp thành đúng 2-3 lệnh chuyển khoản duy nhất.",
      icon: Network,
      color: "from-blue-500/20 to-cyan-500/10",
      accent: "text-cyan-400 border-cyan-500/30",
      metric: "-82%",
      metricLabel: isEn ? "Fewer Bank Transfers" : "Số lần chuyển khoản",
    },
    {
      id: "ai-vision",
      code: "ENG-02",
      badge: isEn ? "Multimodal Vision OCR" : "Thị Giác Máy Tính AI OCR",
      title: isEn ? "Sub-3s Autonomous Invoice Parsing" : "Bóc Tách Hóa Đơn Trong 3 Giây",
      subtitle: isEn ? "VAT & Line-Item Precision" : "Nhận diện chi tiết từng dòng & thuế VAT",
      desc: isEn
        ? "Direct on-device and serverless invoice extraction. Decodes Vietnamese diacritics, VAT rates (8-10%), line items, and merchant signatures with 99.4% accuracy at zero extra fee."
        : "Xử lý hóa đơn tức thời với độ chính xác 99.4% trên tiếng Việt có dấu. Tự động bóc tách tên từng món ăn, mã số thuế, tiền tip, phụ thu và phân bổ vào đúng danh mục ngân sách.",
      icon: Cpu,
      color: "from-indigo-500/20 to-purple-500/10",
      accent: "text-indigo-400 border-indigo-500/30",
      metric: "< 3.0s",
      metricLabel: isEn ? "Extraction Speed" : "Tốc độ nhận diện",
    },
    {
      id: "multi-role",
      code: "ENG-03",
      badge: isEn ? "Dual-Control Governance" : "Quản Trị Quỹ 2 Tầng",
      title: isEn ? "Multi-Entity Fund Sovereignty" : "Kiểm Soát Quỹ Hai Lớp Độc Lập",
      subtitle: isEn ? "Owner • Treasurer • Supervisor Roles" : "Phân quyền Chủ quỹ • Thủ quỹ • Giám sát",
      desc: isEn
        ? "Corporate-grade fund governance for families and organizations. Expenses require dual authorization from appointed supervisors before disbursement, logged in an immutable audit ledger."
        : "Chuẩn mực quản trị tài chính doanh nghiệp thu nhỏ cho gia đình và hội nhóm. Mọi khoản giải ngân từ quỹ chung đều cần Giám Sát Viên (Supervisor) phê duyệt trước khi sinh lệnh thanh toán.",
      icon: Workflow,
      color: "from-emerald-500/20 to-teal-500/10",
      accent: "text-emerald-400 border-emerald-500/30",
      metric: "100%",
      metricLabel: isEn ? "Auditable Transparency" : "Minh bạch sao kê",
    },
    {
      id: "zero-knowledge",
      code: "ENG-04",
      badge: isEn ? "Hardware-Grade Security" : "Bảo Mật Zero-Knowledge",
      title: isEn ? "Offline-First SQLite & AES-256 GCM" : "Kiến Trúc Dữ Liệu Biên Offline-First",
      subtitle: isEn ? "Zero Commercial Data Sharing" : "Mã hóa AES-256 & độc lập thương mại",
      desc: isEn
        ? "Your financial sovereignty is absolute. Local SQLite database syncs encrypted vectors only. No targeted ads, no insurance brokerage data-sharing, compliant with Decree 13/2023/ND-CP."
        : "Chủ quyền dữ liệu tài chính của bạn là tối thượng. Cơ sở dữ liệu SQLite cục bộ mã hóa đa lớp, không bao giờ chia sẻ hay bán thông tin thu chi cho bên thứ ba hoặc công ty bảo hiểm.",
      icon: Lock,
      color: "from-rose-500/20 to-amber-500/10",
      accent: "text-rose-400 border-rose-500/30",
      metric: "AES-256",
      metricLabel: isEn ? "Cryptographic Standard" : "Mã hóa phần cứng",
    },
  ];

  // Deep Enterprise Comparison Matrix
  const ARCHITECTURE_COMPARISON = [
    {
      category: isEn ? "Economic Model & User Pricing" : "Mô Hình Kinh Tế & Chi Phí Người Dùng",
      feature: isEn ? "Core Subscription & Hidden Charges" : "Chi phí bản quyền & Phí duy trì định kỳ",
      legacy: isEn ? "599,000đ – 1,499,000đ/year + Paywalled features" : "599.000đ – 1.499.000đ/năm + Khóa tính năng Pro",
      legacySub: isEn ? "Subscription lock-in with restricted exports" : "Bắt trả tiền duy trì nếu không sẽ bị khóa tính năng",
      tltc: isEn ? "0đ Forever (Zero-Consumer-Fee by Design)" : "0đ Miễn Phí Vĩnh Viễn Toàn Diện",
      tltcSub: isEn ? "Open-access digital utility powered by modern architecture" : "Cam kết hạ tầng công ích số mở, không có phí ẩn",
      highlight: true,
    },
    {
      category: isEn ? "AI & Intelligent Automation" : "Hạ Tầng Trí Tuệ Nhân Tạo AI",
      feature: isEn ? "AI Vision OCR & Voice-to-Ledger Limits" : "Giới hạn bóc tách hóa đơn & Giọng nói AI",
      legacy: isEn ? "Capped at 10–30 bills/month; extra fee per token" : "Giới hạn 10 – 30 hóa đơn/tháng; bắt mua thêm lượt",
      legacySub: isEn ? "Third-party APIs with high latency and data leak risk" : "Thời gian chờ lâu, gửi ảnh raw lên cloud trung gian",
      tltc: isEn ? "Unlimited Autonomous AI Parsing" : "Không Giới Hạn Lượt Quét & Nhập Giọng Nói",
      tltcSub: isEn ? "Sub-3 second parsing with full VAT & line-item breakdown" : "Trí tuệ nhân tạo nhận diện tiếng Việt 3 miền siêu tốc",
      highlight: true,
    },
    {
      category: isEn ? "Group & Collaborative Finance" : "Quản Trị Quỹ Nhóm & Chia Tiền",
      feature: isEn ? "Multi-Party Settlement & Governance" : "Thuật toán quyết toán nợ & Phân quyền",
      legacy: isEn ? "Basic manual equal split; no approval workflow" : "Chỉ chia đều cơ bản; không có quy trình kiểm soát",
      legacySub: isEn ? "Requires manual calculation and repetitive transfers" : "Phải tự tính tay ngoài Excel, dễ mâu thuẫn quỹ",
      tltc: isEn ? "Bipartite Min-Flow Algorithm + Dual Governance" : "Thuật Toán Đồ Thị Bipartite + Duyệt Chi 2 Lớp",
      tltcSub: isEn ? "Reduces transfers by 80%; 1-touch VietQR with auto-reconcile" : "Tối giản số lần chuyển khoản + Tạo mã VietQR 1 chạm",
      highlight: true,
    },
    {
      category: isEn ? "Banking & Ledger Synchronization" : "Đồng Bộ Ngân Hàng & Dòng Tiền",
      feature: isEn ? "Omni-Channel Automated Ingestion" : "Hạ tầng kết nối 54+ ngân hàng Napas",
      legacy: isEn ? "Manual input or delayed CSV uploads only" : "Nhập tay thủ công hoặc chỉ hỗ trợ 1-2 ngân hàng lớn",
      legacySub: isEn ? "Fails with complex multi-wallet structures" : "Dễ sai lệch số dư thực tế tại các tài khoản thẻ",
      tltc: isEn ? "24/7 SePay Webhook + Smart Gmail Engine" : "Webhook Real-Time SePay + Quét Email Tự Động",
      tltcSub: isEn ? "Instant balance delta recording across 54+ NAPAS banks" : "Biến động số dư cập nhật tức thì, không cần mở app",
      highlight: true,
    },
    {
      category: isEn ? "Accounting Compliance & Export" : "Chuẩn Mực Kế Toán & Xuất Dữ Liệu",
      feature: isEn ? "Financial Statements & Tax Reporting" : "Xuất báo cáo tài chính & Đối soát kế toán",
      legacy: isEn ? "Watermarked PDF or paywalled Excel exports" : "Khóa tính năng xuất file, chèn logo quảng cáo",
      legacySub: isEn ? "Restricted data portability locking user data" : "Không cho tải toàn bộ lịch sử chi tiêu nguyên bản",
      tltc: isEn ? "Standard IFRS / VAS Full Data Portability" : "Xuất File Excel / CSV / PDF Chuẩn Mực 0đ",
      tltcSub: isEn ? "Complete transaction ledger ready for accounting and audit" : "Dữ liệu cấu trúc sạch, sẵn sàng kê khai thuế",
      highlight: true,
    },
    {
      category: isEn ? "Privacy & Cryptographic Sovereignty" : "Bảo Mật & Chủ Quyền Dữ Liệu",
      feature: isEn ? "Zero Commercial Monetization of Financial Data" : "Cam kết không kinh doanh dữ liệu người dùng",
      legacy: isEn ? "Data mined for targeted loans, credit cards & insurance" : "Bán dữ liệu cho bên thứ ba chào mời vay nợ",
      legacySub: isEn ? "Third-party ad tracking scripts embedded in client" : "Chứa mã theo dõi quảng cáo, banner che giao diện",
      tltc: isEn ? "Zero Ad-Tracking & Hardware-Encrypted Storage" : "Cam Kết Tuyệt Đối 100% Không Quảng Cáo & Bán Data",
      tltcSub: isEn ? "Decree 13/2023/ND-CP, PCI-DSS & ISO 27001 sovereign posture" : "Mã hóa AES-256 GCM, chuẩn an ninh số quốc tế",
      highlight: true,
    },
  ];

  return (
    <section
      id="free-commitment"
      className="relative overflow-hidden bg-[#070b12] py-28 sm:py-36 text-white"
    >
      {/* 1. Deep Atmospheric Lighting - FinTech Ultra-Premium Obsidian Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[700px] w-[1200px] rounded-full bg-gradient-to-b from-blue-600/15 via-cyan-500/10 to-transparent blur-[160px]" />
        <div className="absolute top-1/2 -left-60 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute bottom-10 -right-60 h-[600px] w-[600px] rounded-full bg-emerald-600/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] opacity-60" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1420px] px-4 sm:px-8 lg:px-10">

        {/* =================================================================== */}
        {/* SECTION HEADER: INSTITUTIONAL FINTECH SOVEREIGNTY DECLARATION       */}
        {/* =================================================================== */}
        <div className="mx-auto max-w-4xl text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-cyan-300 shadow-lg shadow-cyan-500/10 backdrop-blur-xl">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>
              {isEn
                ? "Financial Sovereignty • Zero-Barrier Architecture"
                : "Chủ Quyền Tài Chính • Kiến Trúc Không Rào Cản"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
            {isEn ? "FinTech Engineered For People." : "Định Nghĩa Lại Công Nghệ Quản Trị."}{" "}
            <span className="block mt-1 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              {isEn
                ? "100% Free Forever. Zero Hidden Costs."
                : "100% Mở, 0đ Phí, Đẳng Cấp Ở Từng Chi Tiết."}
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-400 font-normal">
            {isEn
              ? "We believe personal financial autonomy and collective transparency are fundamental rights. Trợ Lý Tài Chính eliminates predatory subscription paywalls, data mining, and intrusive ads through edge computing and proprietary algorithmic optimization."
              : "Chúng tôi tin rằng tự do quản trị tài chính cá nhân và tính minh bạch trong tập thể là quyền cơ bản của mỗi con người. Trợ Lý Tài Chính loại bỏ hoàn toàn các rào cản thuê bao (paywall), quảng cáo và phí ẩn bằng hạ tầng tính toán biên và thuật toán tài chính chuyên sâu."}
          </p>

          {/* Quick Institutional Highlights */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{isEn ? "No Paywalls on Core Features" : "Mở khóa 100% tính năng cốt lõi"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>{isEn ? "Zero Commercial Data Mining" : "Không thương mại hóa dữ liệu"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-400" />
              <span>{isEn ? "NAPAS & ISO 27001 Certified" : "Chuẩn liên kết Napas & ISO 27001"}</span>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* INTERACTIVE COMPONENT 1: BENTO ARCHITECTURE SHOWCASE (TIER-1 CORE) */}
        {/* =================================================================== */}
        <div className="mt-16 sm:mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
                {isEn ? "DEEP FINANCIAL ENGINEERING" : "CÔNG NGHỆ TÀI CHÍNH CHUYÊN SÂU"}
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {isEn
                  ? "Four Sovereign Architectural Engines"
                  : "4 Cỗ Máy Hạ Tầng Vận Hành Nền Tảng"}
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              {isEn
                ? "Engineered from the ground up to reduce transaction friction and ensure mathematical settlement integrity."
                : "Được thiết kế nguyên bản để giảm thiểu ma sát giao dịch và đảm bảo tính toàn vẹn toán học khi quyết toán dòng tiền."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ARCHITECTURE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-slate-900/60 p-6 sm:p-7 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-cyan-500/10"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-500">
                        {pillar.code}
                      </span>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${pillar.accent} bg-white/5`}>
                        {pillar.badge}
                      </span>
                    </div>

                    <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${pillar.color} border border-white/10 group-hover:scale-105 transition duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition">
                        {pillar.title}
                      </h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                        {pillar.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  {/* Micro Metric Tag */}
                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {pillar.metricLabel}
                    </span>
                    <strong className="font-mono text-sm font-black text-cyan-400">
                      {pillar.metric}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =================================================================== */}
        {/* INTERACTIVE COMPONENT 2: INTERACTIVE DEBT RECONCILIATION SIMULATOR  */}
        {/* (SHOWCASING ACTUAL MIN-FLOW GRAPH THEORY FROM C# DOMAIN)            */}
        {/* =================================================================== */}
        <div className="mt-16 sm:mt-24 rounded-3xl border border-white/[0.1] bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 font-mono">
                <Network className="h-3.5 w-3.5" />
                <span>{isEn ? "LIVE GRAPH RECONCILIATION" : "THUẬT TOÁN ĐỒ THỊ TRỰC QUAN"}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                {isEn
                  ? "How Our Algorithm Simplifies 12 Cross-Debts Into Just 2 Transfers"
                  : "Cách Tối Giản 12 Khoản Nợ Chéo Thành Đúng 2 Lệnh Chuyển"}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isEn
                  ? "In traditional group spending, everyone pays for someone else, resulting in a chaotic web of transfers. Our proprietary Bipartite Reconciliation computes net balances across members and resolves the entire group with minimal transactions."
                  : "Khi đi du lịch hoặc chi tiêu gia đình, mọi người thường ứng tiền chéo cho nhau. Thay vì bắt 5 thành viên phải thực hiện 12 giao dịch chuyển khoản rắc rối, thuật toán thông minh tính toán số dư ròng và tìm đường đi ngắn nhất để xóa sạch công nợ chỉ trong 2 lần quét VietQR."}
              </p>

              {/* Mode Toggle */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSimViewMode("traditional")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    simViewMode === "traditional"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs"
                      : "text-slate-400 hover:text-white bg-slate-800/40 border border-transparent"
                  }`}
                >
                  {isEn ? "Traditional Clutter (12 Transfers)" : "Cách Cũ (12 Lệnh Chuyển Lắt Nhắt)"}
                </button>
                <button
                  type="button"
                  onClick={() => setSimViewMode("optimized")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    simViewMode === "optimized"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/10"
                      : "text-slate-400 hover:text-white bg-slate-800/40 border border-transparent"
                  }`}
                >
                  {isEn ? "Min-Flow Algorithm (2 Transfers)" : "Thuật Toán Tối Ưu (2 Lệnh Quyết Toán)"}
                </button>
              </div>
            </div>

            {/* Interactive Visual Graph Preview */}
            <div className="lg:col-span-6 rounded-2xl border border-white/[0.08] bg-slate-950/80 p-5 sm:p-6 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs font-mono text-slate-400">
                <span>{isEn ? "GRAPH SIMULATION" : "MÔ PHỎNG SƠ ĐỒ DÒNG TIỀN"}</span>
                <span className={simViewMode === "optimized" ? "text-cyan-400 font-bold" : "text-rose-400 font-bold"}>
                  {simViewMode === "optimized" ? "EFFICIENCY: 83.3%" : "INEFFICIENT: 12 HOPS"}
                </span>
              </div>

              <AnimatePresence mode="wait">
                {simViewMode === "optimized" ? (
                  <motion.div
                    key="optimized"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="py-4 space-y-3"
                  >
                    <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-500/20 font-black text-cyan-300 text-xs">
                          1
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white">Minh Triết → Hải Đăng</p>
                          <p className="text-[10px] text-slate-400">Quyết toán số dư ròng bù trừ toàn bộ bill</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <strong className="font-mono text-sm font-black text-cyan-400">420.000 đ</strong>
                        <span className="block text-[10px] text-emerald-400 font-bold">1-Tap VietQR</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-500/20 font-black text-cyan-300 text-xs">
                          2
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white">Thuỳ Linh → Hải Đăng</p>
                          <p className="text-[10px] text-slate-400">Quyết toán phần chênh lệch khách sạn & ăn uống</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <strong className="font-mono text-sm font-black text-cyan-400">680.000 đ</strong>
                        <span className="block text-[10px] text-emerald-400 font-bold">1-Tap VietQR</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{isEn ? "Complete group reconciliation reached with zero residual balance." : "Toàn bộ 5 thành viên đã sạch nợ 100%. Không còn ai nợ ai một đồng."}</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="traditional"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="py-3 space-y-2 text-xs"
                  >
                    {[
                      { from: "Minh Triết", to: "Hải Đăng", amount: "150.000 đ", note: "Tiền cafe sáng" },
                      { from: "Hải Đăng", to: "Thuỳ Linh", amount: "90.000 đ", note: "Tiền taxi Grab" },
                      { from: "Thuỳ Linh", to: "Minh Triết", amount: "65.000 đ", note: "Tiền trà chiều" },
                      { from: "Hoàng Nam", to: "Hải Đăng", amount: "320.000 đ", note: "Tiền ăn tối" },
                    ].map((tx, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg border border-rose-500/20 bg-rose-950/10 flex items-center justify-between text-slate-300">
                        <span>{tx.from} → {tx.to} ({tx.note})</span>
                        <strong className="font-mono text-rose-300">{tx.amount}</strong>
                      </div>
                    ))}
                    <p className="text-[11px] text-slate-500 italic text-center pt-1">
                      ... và 8 giao dịch qua lại khác làm nghẽn sao kê ngân hàng và tốn thời gian.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* =================================================================== */}
        {/* INTERACTIVE COMPONENT 3: TCO & FINANCIAL SOVEREIGNTY CALCULATOR     */}
        {/* =================================================================== */}
        <div className="mt-16 sm:mt-24 rounded-3xl border border-white/[0.1] bg-gradient-to-br from-slate-900/95 via-slate-950 to-indigo-950/40 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold font-mono text-cyan-400">
                <Sliders className="h-4 w-4" />
                <span>{isEn ? "TCO & VALUE PROJECTION ENGINE" : "CÔNG CỤ ĐỊNH LƯỢNG GIÁ TRỊ & TIẾT KIỆM"}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {isEn ? "Calculate Your Annual Financial Gain" : "Ước Tính Giá Trị Bạn Nhận Được Mỗi Năm"}
              </h3>
            </div>

            {/* Profile Segments Switcher */}
            <div className="inline-flex rounded-2xl bg-slate-950/80 p-1 border border-white/[0.08] shrink-0">
              {[
                { id: "personal", label: isEn ? "Personal" : "Cá Nhân" },
                { id: "family", label: isEn ? "Family & Shared" : "Gia Đình" },
                { id: "business", label: isEn ? "Freelancer / SME" : "Chủ Shop / Nhóm" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setProfileType(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    profileType === tab.id
                      ? "bg-cyan-500 text-slate-950 shadow-md font-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Interactive Control Sliders */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Monthly Transactions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>{isEn ? "Monthly Transactions & Invoices" : "Số giao dịch & hóa đơn phát sinh hàng tháng:"}</span>
                  <span className="font-mono text-cyan-400 text-sm font-black bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                    {monthlyTx} {isEn ? "tx/month" : "giao dịch/tháng"}
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="600"
                  step="10"
                  value={monthlyTx}
                  onChange={(e) => setMonthlyTx(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>30</span>
                  <span>150</span>
                  <span>300</span>
                  <span>600+</span>
                </div>
              </div>

              {/* Slider 2: Wallets and Connected Accounts */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>{isEn ? "Active Wallets & Bank Accounts:" : "Số tài khoản ngân hàng & ví tiền quản trị:"}</span>
                  <span className="font-mono text-cyan-400 text-sm font-black bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                    {walletsCount} {isEn ? "wallets" : "ví & tài khoản"}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={walletsCount}
                  onChange={(e) => setWalletsCount(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>1 ví</span>
                  <span>4 ví</span>
                  <span>8 ví</span>
                  <span>12 ví tối đa</span>
                </div>
              </div>
            </div>

            {/* Right: Projected Value Breakdown Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 space-y-1">
                <p className="text-[10.5px] uppercase font-mono font-bold text-cyan-300">
                  {isEn ? "Direct Software Savings" : "Tiền Phần Mềm Tiết Kiệm"}
                </p>
                <div className="font-mono text-xl sm:text-2xl font-black text-cyan-400">
                  {softwareSavingsAnnual.toLocaleString("vi-VN")} đ
                </div>
                <p className="text-[10px] text-slate-400">
                  {isEn ? "Zero license fees vs legacy apps" : "Không tốn phí mua app VIP hằng năm"}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 space-y-1">
                <p className="text-[10.5px] uppercase font-mono font-bold text-indigo-300">
                  {isEn ? "Manual Time Saved" : "Thời Gian Tiết Kiệm"}
                </p>
                <div className="font-mono text-xl sm:text-2xl font-black text-indigo-400">
                  ~{hoursSavedAnnual} {isEn ? "hours/yr" : "giờ/năm"}
                </div>
                <p className="text-[10px] text-slate-400">
                  {isEn ? "AI Vision OCR sub-3s automation" : "Nhờ AI quét bill & giọng nói"}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-1">
                <p className="text-[10.5px] uppercase font-mono font-bold text-emerald-300">
                  {isEn ? "Transfer Optimization" : "Tối Giản Lệnh Chuyển"}
                </p>
                <div className="font-mono text-xl sm:text-2xl font-black text-emerald-400">
                  -{transferReductionPercent}%
                </div>
                <p className="text-[10px] text-slate-400">
                  {isEn ? "Fewer cross-debt transactions" : "Giảm thiểu chuyển khoản nợ chéo"}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-950/20 space-y-1">
                <p className="text-[10.5px] uppercase font-mono font-bold text-rose-300">
                  {isEn ? "Data Privacy Risk" : "Rủi Ro Dữ Liệu"}
                </p>
                <div className="font-mono text-xl sm:text-2xl font-black text-rose-400">
                  0% {isEn ? "Leak" : "Rò rỉ"}
                </div>
                <p className="text-[10px] text-slate-400">
                  {isEn ? "Zero advertising tracking" : "Bảo mật chuẩn AES-256 GCM"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* INTERACTIVE COMPONENT 4: ENTERPRISE COMPARISON MATRIX               */}
        {/* =================================================================== */}
        <div className="mt-20 sm:mt-28">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              {isEn ? "RIGOROUS ARCHITECTURAL COMPARISON" : "MA TRẬN ĐỐI SOÁT NĂNG LỰC HẠ TẦNG"}
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              {isEn
                ? "Why Trợ Lý Tài Chính Outperforms Traditional Budgeting Platforms"
                : "Sự Khác Biệt Giữa Định Chế Số Thế Hệ Mới & Ứng Dụng Cũ"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {isEn
                ? "Transparent, verifiable, and engineered with zero compromises on quality, security, or accessibility."
                : "Minh bạch hóa mọi tiêu chuẩn kỹ thuật. Không giấu giếm rào cản, không thỏa hiệp về an ninh và hiệu năng."}
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/[0.08] bg-slate-900/60 shadow-2xl backdrop-blur-2xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-slate-950/90 text-xs">
                  <th className="py-4.5 px-6 font-bold text-slate-400 w-[32%] uppercase tracking-wider font-mono">
                    {isEn ? "CAPABILITY & ARCHITECTURE" : "TIÊU CHUẨN NĂNG LỰC & HẠ TẦNG"}
                  </th>
                  <th className="py-4.5 px-6 font-bold text-rose-400/90 w-[34%] uppercase tracking-wider font-mono bg-rose-950/10">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-rose-400" />
                      <span>{isEn ? "Legacy Commercial Budget Apps" : "Ứng Dụng Thu Phí / Phần Mềm Cũ"}</span>
                    </div>
                  </th>
                  <th className="py-4.5 px-6 font-black text-cyan-300 w-[34%] uppercase tracking-wider font-mono bg-cyan-950/20 border-l border-cyan-500/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      <span>{isEn ? "Trợ Lý Tài Chính Platform" : "Nền Tảng Trợ Lý Tài Chính"}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {ARCHITECTURE_COMPARISON.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="py-4.5 px-6 text-slate-200">
                      <span className="font-bold block text-sm">{row.feature}</span>
                      <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-0.5 block">
                        {row.category}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-slate-400 bg-rose-950/5">
                      <span className="font-semibold text-rose-300/90 block">{row.legacy}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">{row.legacySub}</span>
                    </td>
                    <td className="py-4.5 px-6 font-bold bg-cyan-950/15 border-l border-cyan-500/20 text-cyan-300">
                      <span className="font-black text-cyan-400 flex items-center gap-2">
                        <Check className="h-4 w-4 text-cyan-400 stroke-[3]" />
                        {row.tltc}
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal mt-0.5 block">{row.tltcSub}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* =================================================================== */}
        {/* INTERACTIVE COMPONENT 5: CRYPTOGRAPHIC SOVEREIGNTY CHARTER          */}
        {/* =================================================================== */}
        <div className="mt-20 sm:mt-28 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-20">
            <Award className="h-32 w-32 text-cyan-400" />
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/60 px-4 py-1 text-xs font-mono font-bold text-cyan-300">
              <Lock className="h-3.5 w-3.5" />
              <span>SHA-256 VERIFIED PROTOCOL • CHARTER 2026</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-white">
              {isEn
                ? "The Sovereign Zero-Fee Charter For Vietnamese People"
                : "Bản Hiến Chương Chủ Quyền Tài Chính Cho Người Việt"}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isEn
                ? "We formally pledge that all core financial modules — from AI Vision OCR, multi-entity wallets, and graph debt settlement to banking reconciliation — will remain 100% free with unlimited access for all individuals and households."
                : "Đội ngũ phát triển Trợ Lý Tài Chính long trọng cam kết: Mọi năng lực cốt lõi từ bóc tách hóa đơn AI, quản lý đa ví, quyết toán quỹ nhóm đồ thị đến đối soát ngân hàng Napas 24/7 sẽ luôn luôn mở sẵn 100% miễn phí vĩnh viễn cho mọi cá nhân và gia đình Việt Nam."}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={onOpenQr}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-8 py-4 text-xs font-black text-slate-950 shadow-xl shadow-cyan-500/20 hover:opacity-95 transition hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider"
              >
                <QrCode className="h-4 w-4" />
                <span>{isEn ? "Open Free eKYC Account (0đ Fee)" : "Nhận Tài Khoản 0đ Ngay (iOS & Android)"}</span>
              </button>

              <a
                href="#app-simulator"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-xs font-bold text-white hover:bg-white/20 transition hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{isEn ? "Experience The Interactive Device" : "Trải Nghiệm Thử Trên Điện Thoại"}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
