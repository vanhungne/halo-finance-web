import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanLine,
  BarChart3,
  Users2,
  TrendingUp,
  HandCoins,
  PiggyBank,
  PieChart,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  CreditCard,
  Building,
  Coins,
  Receipt,
  FileText,
} from "lucide-react";

export const SHOWCASE_FEATURES = [
  {
    id: "ai-scanner",
    title: "AI Quét Hóa Đơn Siêu Tốc",
    subtitle: "Receipt Intelligence v2",
    description: "Chụp ảnh bill hoặc hóa đơn điện tử — AI tự động bóc tách từng món, giá tiền, VAT và kiểm tra chống gian lận.",
    icon: ScanLine,
    badge: "Độc quyền AI",
    color: "from-cyan-500 to-blue-600",
    textColor: "text-cyan-500",
    bgLight: "bg-cyan-50 text-cyan-700 border-cyan-200",
    phoneScreen: {
      headerTitle: "Bóc tách Hóa đơn AI",
      status: "Thành công 99.8%",
      merchant: "Highlands Coffee - Vincom",
      date: "Hôm nay, 14:32",
      items: [
        { name: "Phin Sữa Đá (L)", qty: "x2", price: "78.000 đ" },
        { name: "Trà Sen Vàng (M)", qty: "x1", price: "55.000 đ" },
        { name: "Bánh Mì Thịt Nướng", qty: "x1", price: "39.000 đ" },
      ],
      subtotal: "172.000 đ",
      vat: "13.760 đ (VAT 8%)",
      total: "185.760 đ",
      tag: "Ăn uống • Cà phê",
      note: "Hóa đơn hợp lệ • Đã đối soát",
    },
  },
  {
    id: "cashflow-report",
    title: "Báo Cáo & Dòng Tiền 360°",
    subtitle: "Thống kê trực quan",
    description: "Hiểu rõ tiền đi đâu từng ngày, từng danh mục với biểu đồ phân tích xu hướng chi tiêu sâu sắc.",
    icon: BarChart3,
    badge: "Trực quan",
    color: "from-blue-500 to-indigo-600",
    textColor: "text-blue-500",
    bgLight: "bg-blue-50 text-blue-700 border-blue-200",
    phoneScreen: {
      headerTitle: "Báo Cáo Tháng 10",
      status: "Dư thừa ngân sách 32%",
      income: "+ 45.200.000 đ",
      expense: "- 18.650.000 đ",
      net: "+ 26.550.000 đ",
      categories: [
        { name: "Nhà ở & Tiện ích", percent: 38, color: "bg-blue-500" },
        { name: "Ăn uống & Tiệc", percent: 27, color: "bg-emerald-500" },
        { name: "Mua sắm & Giải trí", percent: 18, color: "bg-amber-500" },
        { name: "Di chuyển & Xăng xe", percent: 17, color: "bg-purple-500" },
      ],
    },
  },
  {
    id: "group-fund",
    title: "Quỹ Nhóm & Chia Tiền Gia Đình",
    subtitle: "Minh bạch tuyệt đối",
    description: "Quản lý quỹ chung gia đình, quỹ phòng trọ hay nhóm du lịch. Tự động chia đều hóa đơn và đối soát tức thì.",
    icon: Users2,
    badge: "Được yêu thích",
    color: "from-emerald-500 to-teal-600",
    textColor: "text-emerald-500",
    bgLight: "bg-emerald-50 text-emerald-700 border-emerald-200",
    phoneScreen: {
      headerTitle: "Quỹ Gia Đình Nhỏ 2026",
      status: "3 Thành viên",
      fundBalance: "32.850.000 đ",
      members: [
        { name: "Hùng (Trưởng nhóm)", paid: "18.500.000 đ", status: "Đã nộp" },
        { name: "Lan Phương", paid: "15.000.000 đ", status: "Đã nộp" },
        { name: "Tiền điện nước T10", paid: "- 1.650.000 đ", status: "Đã chi" },
      ],
      splitRule: "Chia đều 50/50 • Tự động nhắc qua Zalo",
    },
  },
  {
    id: "investments",
    title: "Quản Lý Tài Sản Đầu Tư",
    subtitle: "Vàng, Cổ phiếu & BĐS",
    description: "Theo dõi toàn bộ danh mục tài sản sinh lời: Vàng SJC, danh mục cổ phiếu, sổ tiết kiệm và bất động sản.",
    icon: TrendingUp,
    badge: "Chuyên sâu",
    color: "from-amber-500 to-orange-600",
    textColor: "text-amber-500",
    bgLight: "bg-amber-50 text-amber-700 border-amber-200",
    phoneScreen: {
      headerTitle: "Tổng Tài Sản Đầu Tư",
      status: "PnL: +14.2%",
      totalAsset: "1.420.000.000 đ",
      assets: [
        { name: "Vàng SJC (3 lượng)", value: "258.000.000 đ", change: "+12.4%" },
        { name: "Cổ phiếu FPT, HPG", value: "342.000.000 đ", change: "+18.6%" },
        { name: "Tiết kiệm BIDV 12T", value: "320.000.000 đ", change: "+5.6%" },
        { name: "BĐS Căn hộ cho thuê", value: "500.000.000 đ", change: "+8.0%" },
      ],
    },
  },
  {
    id: "debt-tracker",
    title: "Sổ Quản Lý Vay & Cho Vay",
    subtitle: "Ghi chép nợ thông minh",
    description: "Theo dõi chặt chẽ ai nợ mình, mình nợ ai, lịch trả nợ từng đợt, tính lãi tự động và nhắc nợ văn minh.",
    icon: HandCoins,
    badge: "Tiện ích cao",
    color: "from-rose-500 to-red-600",
    textColor: "text-rose-500",
    bgLight: "bg-rose-50 text-rose-700 border-rose-200",
    phoneScreen: {
      headerTitle: "Sổ Vay & Cho Vay",
      status: "2 Khoản cần thu hồi",
      lentAmount: "45.000.000 đ",
      borrowAmount: "12.000.000 đ",
      records: [
        { person: "Anh Tuấn (Vay cá nhân)", amount: "25.000.000 đ", due: "Đến hạn 25/10", type: "collect" },
        { person: "Bạn Minh (Chia tiền phòng)", amount: "2.500.000 đ", due: "Đã nhắc hôm qua", type: "collect" },
        { person: "Trả góp Thẻ tín dụng", amount: "6.000.000 đ", due: "Kỳ 3/6", type: "pay" },
      ],
    },
  },
  {
    id: "savings-goals",
    title: "Sổ Tiết Kiệm & Mục Tiêu Tài Chính",
    subtitle: "Lộ trình rõ ràng",
    description: "Thiết lập mục tiêu mua nhà, mua xe hay quỹ khẩn cấp. Theo dõi tiến độ tích lũy tự động từng ngày.",
    icon: PiggyBank,
    badge: "Thói quen tốt",
    color: "from-violet-500 to-purple-600",
    textColor: "text-violet-500",
    bgLight: "bg-violet-50 text-violet-700 border-violet-200",
    phoneScreen: {
      headerTitle: "Mục Tiêu Tích Lũy",
      status: "Đạt 68% kế hoạch",
      goalTitle: "Quỹ Khẩn Cấp 6 Tháng",
      current: "81.600.000 đ",
      target: "120.000.000 đ",
      progress: 68,
      milestones: [
        { label: "Mỗi tháng trích tự động", val: "5.000.000 đ" },
        { label: "Dự kiến về đích", val: "Tháng 04/2027" },
        { label: "Lãi suất tiền gửi", val: "5.8% / năm" },
      ],
    },
  },
  {
    id: "smart-budget",
    title: "Lập Hạn Mức Chi Tiêu Thông Minh",
    subtitle: "Không lo thâm hụt",
    description: "Cài đặt hạn mức cho từng nhóm chi tiêu (ăn uống, giải trí). Nhận cảnh báo thông minh khi sắp chạm ngưỡng.",
    icon: PieChart,
    badge: "An toàn tài chính",
    color: "from-sky-500 to-cyan-600",
    textColor: "text-sky-500",
    bgLight: "bg-sky-50 text-sky-700 border-sky-200",
    phoneScreen: {
      headerTitle: "Hạn Mức Tháng 10",
      status: "Còn lại 8.350.000 đ",
      budgets: [
        { name: "Ăn uống hàng ngày", spent: "6.200.000 đ", limit: "8.000.000 đ", percent: 77, alert: false },
        { name: "Mua sắm & Quần áo", spent: "3.400.000 đ", limit: "3.500.000 đ", percent: 97, alert: true },
        { name: "Cà phê & Hẹn hò", spent: "1.250.000 đ", limit: "2.000.000 đ", percent: 62, alert: false },
      ],
    },
  },
  {
    id: "excel-export",
    title: "Xuất Báo Cáo Kế Toán Excel & PDF",
    subtitle: "Trích xuất 1 chạm",
    description: "Xuất dữ liệu thu chi ra file Excel hoặc PDF định dạng chuẩn kế toán, sẵn sàng cho khai thuế và phân tích dài hạn.",
    icon: FileSpreadsheet,
    badge: "Chuẩn kế toán",
    color: "from-teal-500 to-emerald-600",
    textColor: "text-teal-500",
    bgLight: "bg-teal-50 text-teal-700 border-teal-200",
    phoneScreen: {
      headerTitle: "Xuất Báo Cáo Dữ Liệu",
      status: "Sẵn sàng tải về",
      fileType: "Excel (.xlsx) & PDF Chữ Ký Số",
      period: "Từ 01/01/2026 đến 31/10/2026",
      recordsCount: "1.248 giao dịch",
      options: [
        "Bảng kê chi tiết thu chi từng ngày",
        "Báo cáo dòng tiền theo danh mục",
        "Bảng cân đối tài sản ròng Net Worth",
      ],
    },
  },
];

export default function InteractiveShowcase() {
  const [activeTab, setActiveTab] = useState(SHOWCASE_FEATURES[0].id);
  const [isHovered, setIsHovered] = useState(false);

  // Auto rotate every 6 seconds when not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = SHOWCASE_FEATURES.findIndex((f) => f.id === prev);
        const nextIndex = (currentIndex + 1) % SHOWCASE_FEATURES.length;
        return SHOWCASE_FEATURES[nextIndex].id;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const activeFeature =
    SHOWCASE_FEATURES.find((f) => f.id === activeTab) || SHOWCASE_FEATURES[0];

  const leftFeatures = SHOWCASE_FEATURES.slice(0, 4);
  const rightFeatures = SHOWCASE_FEATURES.slice(4, 8);

  return (
    <section
      id="features"
      className="relative overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-[#f8f8f5] via-white to-[#f8f8f5]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-widest text-sky-700 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
            Hệ sinh thái tính năng toàn diện
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Mọi Công Cụ Bạn Cần Để Làm Chủ Tài Chính Cá Nhân
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Từ quét hóa đơn bằng AI đến quản lý quỹ nhóm và tài sản đầu tư — trải nghiệm mượt mà, đầy đủ hơn bất kỳ ứng dụng nào trên thị trường.
          </p>
        </div>

        {/* Interactive Layout */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column Features (Desktop) */}
          <div className="lg:col-span-4 space-y-4">
            {leftFeatures.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  type="button"
                  className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border relative ${
                    isActive
                      ? "bg-white shadow-[0_20px_40px_-15px_rgba(15,23,42,0.12)] border-sky-300 ring-2 ring-sky-500/20 scale-[1.02]"
                      : "bg-white/60 hover:bg-white border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-sky-600">
                          {item.badge}
                        </span>
                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping" />
                        )}
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base mt-0.5 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Central Mockup Phone */}
          <div className="lg:col-span-4 flex justify-center order-first lg:order-none">
            <div className="relative w-[320px] sm:w-[350px] aspect-[9/18.5] rounded-[3rem] border-[10px] border-slate-900 bg-slate-950 p-3 shadow-[0_45px_100px_-25px_rgba(15,23,42,0.45)] ring-1 ring-white/20">
              {/* Phone Dynamic Island / Speaker */}
              <div className="absolute left-1/2 top-4 -translate-x-1/2 h-5 w-24 rounded-full bg-slate-900 z-30 flex items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full bg-black/60 mr-2" />
                <div className="h-1.5 w-8 rounded-full bg-slate-800" />
              </div>

              {/* Screen Inner Frame */}
              <div className="relative h-full w-full rounded-[2.25rem] bg-slate-900 overflow-hidden text-white flex flex-col pt-8 pb-4 px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="flex-1 flex flex-col"
                  >
                    {/* App Bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div>
                        <p className="text-[0.65rem] uppercase font-bold text-sky-400">
                          {activeFeature.subtitle}
                        </p>
                        <h4 className="text-sm font-extrabold text-white">
                          {activeFeature.phoneScreen.headerTitle}
                        </h4>
                      </div>
                      <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {activeFeature.phoneScreen.status}
                      </span>
                    </div>

                    {/* Dynamic Screen Content */}
                    <div className="flex-1 py-3 overflow-y-auto space-y-3 text-xs">
                      {/* 1. AI SCANNER VIEW */}
                      {activeFeature.id === "ai-scanner" && (
                        <div className="space-y-3">
                          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                            <div className="flex justify-between items-center text-slate-300 text-[0.7rem]">
                              <span className="font-bold text-white flex items-center gap-1.5">
                                <Receipt className="w-3.5 h-3.5 text-cyan-400" />
                                {activeFeature.phoneScreen.merchant}
                              </span>
                              <span className="text-slate-400">{activeFeature.phoneScreen.date}</span>
                            </div>
                            <div className="mt-2.5 divide-y divide-white/5 space-y-1.5 pt-1">
                              {activeFeature.phoneScreen.items.map((it, i) => (
                                <div key={i} className="flex justify-between pt-1.5 text-slate-200">
                                  <span>{it.name} <span className="text-slate-400 text-[0.65rem]">{it.qty}</span></span>
                                  <span className="font-bold">{it.price}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-2 border-t border-cyan-500/30 flex justify-between font-extrabold text-white text-sm">
                              <span>Tổng cộng:</span>
                              <span className="text-cyan-400">{activeFeature.phoneScreen.total}</span>
                            </div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[0.7rem]">
                            <span className="text-slate-400">Danh mục gán:</span>
                            <span className="font-bold text-emerald-400">{activeFeature.phoneScreen.tag}</span>
                          </div>
                          <button
                            type="button"
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-center shadow-lg shadow-cyan-500/30"
                          >
                            Xác nhận ghi chép
                          </button>
                        </div>
                      )}

                      {/* 2. CASHFLOW VIEW */}
                      {activeFeature.id === "cashflow-report" && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                              <p className="text-[0.65rem] text-slate-400">Thu nhập</p>
                              <p className="text-xs font-black text-emerald-400 mt-1">{activeFeature.phoneScreen.income}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30">
                              <p className="text-[0.65rem] text-slate-400">Chi tiêu</p>
                              <p className="text-xs font-black text-rose-400 mt-1">{activeFeature.phoneScreen.expense}</p>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                            <p className="text-[0.7rem] font-bold text-slate-300">Cơ cấu chi tiêu</p>
                            {activeFeature.phoneScreen.categories.map((c, i) => (
                              <div key={i} className="space-y-1">
                                <div className="flex justify-between text-[0.68rem] text-slate-300">
                                  <span>{c.name}</span>
                                  <span className="font-bold">{c.percent}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                  <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.percent}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. GROUP FUND VIEW */}
                      {activeFeature.id === "group-fund" && (
                        <div className="space-y-3">
                          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center">
                            <p className="text-[0.65rem] text-slate-400 uppercase font-semibold">Số dư quỹ hiện tại</p>
                            <p className="text-lg font-black text-emerald-400 mt-1">{activeFeature.phoneScreen.fundBalance}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[0.7rem] font-bold text-slate-300">Đóng góp thành viên</p>
                            {activeFeature.phoneScreen.members.map((m, i) => (
                              <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-white/5 border border-white/5">
                                <div>
                                  <p className="font-bold text-white text-[0.72rem]">{m.name}</p>
                                  <p className="text-[0.62rem] text-emerald-400">{m.status}</p>
                                </div>
                                <span className="font-bold text-slate-200">{m.paid}</span>
                              </div>
                            ))}
                          </div>
                          <div className="p-2 rounded-xl bg-white/5 text-[0.65rem] text-slate-400 text-center">
                            {activeFeature.phoneScreen.splitRule}
                          </div>
                        </div>
                      )}

                      {/* 4. INVESTMENTS VIEW */}
                      {activeFeature.id === "investments" && (
                        <div className="space-y-2.5">
                          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-center">
                            <p className="text-[0.65rem] text-slate-400 uppercase font-semibold">Tổng tài sản ròng</p>
                            <p className="text-lg font-black text-amber-300 mt-1">{activeFeature.phoneScreen.totalAsset}</p>
                          </div>
                          <div className="space-y-1.5">
                            {activeFeature.phoneScreen.assets.map((a, i) => (
                              <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-white/5 border border-white/5">
                                <span className="font-medium text-slate-200 text-[0.72rem]">{a.name}</span>
                                <div className="text-right">
                                  <p className="font-bold text-white text-[0.72rem]">{a.value}</p>
                                  <p className="text-[0.6rem] text-emerald-400 font-bold">{a.change}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 5. DEBT TRACKER VIEW */}
                      {activeFeature.id === "debt-tracker" && (
                        <div className="space-y-2.5">
                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                              <p className="text-[0.6rem] text-slate-400">Cần thu về</p>
                              <p className="text-xs font-black text-emerald-400 mt-0.5">{activeFeature.phoneScreen.lentAmount}</p>
                            </div>
                            <div className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/30">
                              <p className="text-[0.6rem] text-slate-400">Cần trả nợ</p>
                              <p className="text-xs font-black text-rose-400 mt-0.5">{activeFeature.phoneScreen.borrowAmount}</p>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            {activeFeature.phoneScreen.records.map((r, i) => (
                              <div key={i} className="p-2 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                                <div>
                                  <p className="font-bold text-white text-[0.72rem]">{r.person}</p>
                                  <p className="text-[0.6rem] text-amber-400">{r.due}</p>
                                </div>
                                <span className={`font-black ${r.type === "collect" ? "text-emerald-400" : "text-rose-400"}`}>
                                  {r.amount}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 6. SAVINGS GOALS VIEW */}
                      {activeFeature.id === "savings-goals" && (
                        <div className="space-y-3">
                          <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/30">
                            <p className="text-[0.65rem] text-violet-300 font-bold">{activeFeature.phoneScreen.goalTitle}</p>
                            <p className="text-base font-black text-white mt-1">{activeFeature.phoneScreen.current}</p>
                            <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-violet-500 rounded-full" style={{ width: `${activeFeature.phoneScreen.progress}%` }} />
                            </div>
                            <div className="flex justify-between text-[0.65rem] text-slate-400 mt-1">
                              <span>Mục tiêu: {activeFeature.phoneScreen.target}</span>
                              <span className="text-violet-400 font-bold">{activeFeature.phoneScreen.progress}%</span>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            {activeFeature.phoneScreen.milestones.map((m, i) => (
                              <div key={i} className="flex justify-between text-[0.68rem] p-2 rounded-lg bg-white/5">
                                <span className="text-slate-400">{m.label}</span>
                                <span className="font-bold text-white">{m.val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 7. SMART BUDGET VIEW */}
                      {activeFeature.id === "smart-budget" && (
                        <div className="space-y-2.5">
                          <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/30 text-center">
                            <p className="text-[0.65rem] text-slate-400">Ngân sách còn khả dụng</p>
                            <p className="text-lg font-black text-sky-400 mt-0.5">{activeFeature.phoneScreen.status}</p>
                          </div>
                          <div className="space-y-2">
                            {activeFeature.phoneScreen.budgets.map((b, i) => (
                              <div key={i} className="p-2 rounded-xl bg-white/5 border border-white/5 space-y-1">
                                <div className="flex justify-between text-[0.7rem]">
                                  <span className="font-bold text-white">{b.name}</span>
                                  <span className={b.alert ? "text-rose-400 font-bold" : "text-slate-300 font-medium"}>
                                    {b.spent} / {b.limit}
                                  </span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${b.alert ? "bg-rose-500" : "bg-sky-500"}`}
                                    style={{ width: `${b.percent}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 8. EXCEL EXPORT VIEW */}
                      {activeFeature.id === "excel-export" && (
                        <div className="space-y-3">
                          <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/30 text-center">
                            <FileSpreadsheet className="w-8 h-8 text-teal-400 mx-auto mb-1" />
                            <p className="font-bold text-white text-xs">{activeFeature.phoneScreen.fileType}</p>
                            <p className="text-[0.65rem] text-slate-400 mt-0.5">{activeFeature.phoneScreen.period}</p>
                          </div>
                          <div className="space-y-1.5">
                            {activeFeature.phoneScreen.options.map((opt, i) => (
                              <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-white/5 text-[0.68rem] text-slate-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-extrabold text-center shadow-lg shadow-teal-500/30"
                          >
                            Tải file Excel ngay
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column Features (Desktop) */}
          <div className="lg:col-span-4 space-y-4">
            {rightFeatures.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  type="button"
                  className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border relative ${
                    isActive
                      ? "bg-white shadow-[0_20px_40px_-15px_rgba(15,23,42,0.12)] border-sky-300 ring-2 ring-sky-500/20 scale-[1.02]"
                      : "bg-white/60 hover:bg-white border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-sky-600">
                          {item.badge}
                        </span>
                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping" />
                        )}
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base mt-0.5 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
