import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanLine,
  Users2,
  HandCoins,
  Building2,
  TrendingUp,
  Sparkles,
  QrCode,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Receipt,
  Bell,
  Smartphone,
  Check,
  Zap,
  Mic,
  HeartHandshake,
  Mail,
  FileSpreadsheet,
} from "lucide-react";

const SIMULATOR_SCREENS = [
  {
    id: "ai-scanner",
    tabTitle: "Quét Hóa Đơn AI",
    tabSubtitle: "Thị Giác Máy Tính AI OCR",
    icon: ScanLine,
    badge: "Độc quyền AI",
    tagline: "Chụp ảnh bill — AI bóc tách từng món và tự động ghi sổ trong 3 giây",
    description:
      "Không còn phải ngồi gõ từng dòng chi tiêu thủ công. Công nghệ Trí Tuệ Nhân Tạo AI phân tích chi tiết hóa đơn nhà hàng, siêu thị, hóa đơn tiền điện: đọc rõ tên món, số lượng, thuế VAT 8% và tự động phân loại đúng danh mục.",
    highlights: [
      "Bóc tách chính xác 99.8% tiếng Việt có dấu",
      "Tự động tính thuế VAT và giảm giá voucher",
      "Phát hiện và cảnh báo hóa đơn trùng lặp",
    ],
    screenType: "scanner",
  },
  {
    id: "group-vietqr",
    tabTitle: "Chia Tiền VietQR",
    tabSubtitle: "Quyết toán 1 chạm",
    icon: Users2,
    badge: "Tính năng Hot",
    tagline: "Đi ăn, du lịch cùng bạn bè — tự động tính ai nợ ai và tạo mã VietQR",
    description:
      "Tạm biệt những bảng tính Excel phức tạp khi đi chơi nhóm. Trợ Lý Tài Chính tối ưu số lần chuyển khoản giữa các thành viên, tự sinh mã VietQR với đúng số tiền và nội dung để thanh toán tức thì.",
    highlights: [
      "Tối ưu thuật toán chia tiền ít lần chuyển nhất",
      "Tạo mã VietQR quét app ngân hàng trả ngay",
      "Quản lý quỹ nhóm và quỹ gia đình minh bạch",
    ],
    screenType: "group",
  },
  {
    id: "debt-interest",
    tabTitle: "Sổ Nợ & Tính Lãi Vay",
    tabSubtitle: "Không lo quên nợ",
    icon: HandCoins,
    badge: "Tiện ích tài chính",
    tagline: "Quản lý ai nợ mình, mình nợ ai kèm công cụ tính lãi suất chính xác",
    description:
      "Ghi nhận các khoản vay mượn người thân, bạn bè hoặc trả góp. Hỗ trợ tự động tính lãi theo ngày hoặc theo tháng, ghi nhận lịch sử trả nợ nhiều đợt và soạn sẵn tin nhắn nhắc nợ lịch sự.",
    highlights: [
      "Tính lãi suất dư nợ giảm dần hoặc lãi phẳng",
      "Lịch sử trả nợ theo từng kỳ chi tiết",
      "Nhắc hẹn thanh toán qua thông báo điện thoại",
    ],
    screenType: "debt",
  },
  {
    id: "bank-sync",
    tabTitle: "Đồng Bộ Ngân Hàng",
    tabSubtitle: "SePay & Quét Email",
    icon: Building2,
    badge: "Tự động hóa",
    tagline: "Biến động số dư tài khoản tự động được ghi nhận mà không cần nhập tay",
    description:
      "Kết nối an toàn với SePay Webhook và quét email thông báo giao dịch ngân hàng (Vietcombank, MB, Techcombank...). Mỗi khi bạn quẹt thẻ hay chuyển khoản, hệ thống tự động ghi nhận ngay lập tức.",
    highlights: [
      "Tương thích tất cả ngân hàng lớn tại Việt Nam",
      "Không yêu cầu mật khẩu đăng nhập ngân hàng",
      "Phân loại thu/chi tự động qua machine learning",
    ],
    screenType: "bank",
  },
  {
    id: "asset-gold",
    tabTitle: "Tài Sản & Vàng SJC",
    tabSubtitle: "Định giá thời gian thực",
    icon: TrendingUp,
    badge: "Đầu tư cá nhân",
    tagline: "Theo dõi giá trị ròng từ Vàng SJC, Cổ phiếu, Tiết kiệm và Bất động sản",
    description:
      "Không chỉ quản lý tiền mặt trong ví, Trợ Lý Tài Chính giúp bạn quản lý toàn bộ danh mục tài sản sinh lời: cập nhật giá vàng trong nước mỗi ngày, theo dõi lãi kép tiền gửi và danh mục đầu tư chứng khoán.",
    highlights: [
      "Cập nhật tỷ giá vàng SJC và DOJI hàng ngày",
      "Báo cáo phân bổ tài sản trực quan",
      "Tính toán tổng giá trị tài sản ròng (Net Worth)",
    ],
    screenType: "asset",
  },
  {
    id: "voice-ai",
    tabTitle: "AI Giọng Nói",
    tabSubtitle: "Emotion AI Tiếng Việt",
    icon: Mic,
    badge: "Độc Quyền AI",
    tagline: "Chỉ cần nhấn và nói — AI tự bóc tách nhiều khoản thu chi cùng lúc",
    description:
      "Không cần mở từng danh mục để gõ. Trợ lý AI nhận diện giọng nói tự nhiên của người Việt, phân tách các món ăn uống, mua sắm và ghi nhận chính xác 100% kèm lời khuyên tài chính cá nhân hóa.",
    highlights: [
      "Nhận diện giọng nói chuẩn Bắc - Trung - Nam",
      "Tự động phân tách đa khoản chi tiêu cùng lúc",
      "Trợ lý Emotion AI cố vấn tài chính thấu cảm",
    ],
    screenType: "voice",
  },
  {
    id: "group-fund",
    tabTitle: "Quỹ Nhóm Chung",
    tabSubtitle: "Duyệt chi 2 lớp minh bạch",
    icon: HeartHandshake,
    badge: "Chống Thất Thoát",
    tagline: "Quản lý quỹ lớp, quỹ công ty, du lịch — Thủ quỹ ghi, Người giám sát duyệt",
    description:
      "Giải quyết triệt để vấn đề mất lòng vì tiền bạc trong tập thể. Thành viên đóng quỹ qua VietQR tự động gạch nợ. Mọi khoản chi từ quỹ đều cần Người Giám Sát (Supervisor) phê duyệt trước khi giải ngân.",
    highlights: [
      "Đóng quỹ bằng mã VietQR tự động gạch nợ",
      "Phân quyền Thủ quỹ & Người giám sát duyệt chi",
      "Xuất sao kê PDF / Excel công khai minh bạch",
    ],
    screenType: "fund",
  },
];

export default function AppInteractiveSimulator({ onOpenQr }) {
  const [activeTab, setActiveTab] = useState(0);
  const activeFeature = SIMULATOR_SCREENS[activeTab];

  return (
    <section
      id="app-simulator"
      className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 py-24 sm:py-32"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full bg-sky-100/40 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700">
            <Smartphone className="h-4 w-4 text-blue-600" />
            <span>Trải nghiệm tính năng thực tế</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[2.75rem]">
            Trực quan. Thông minh. <span className="text-blue-600">Được đo ni đóng giày</span> cho người Việt.
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Nhấp chuột vào từng tính năng bên dưới để xem trực tiếp cách Trợ Lý Tài Chính xử lý bài toán dòng tiền của bạn:
          </p>
        </div>

        {/* Feature Selector Tabs (Balanced Flex Layout on Desktop, Horizontal Snap Carousel on Mobile) */}
        <div className="mt-10 flex overflow-x-auto sm:flex-wrap items-stretch justify-start sm:justify-center gap-2.5 sm:gap-3.5 max-w-5xl mx-auto pb-2 sm:pb-0 no-scrollbar snap-x px-1">
          {SIMULATOR_SCREENS.map((screen, idx) => {
            const Icon = screen.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={screen.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`relative flex flex-1 min-w-[125px] sm:min-w-[140px] max-w-[190px] shrink-0 sm:shrink snap-center flex-col items-center justify-center rounded-2xl p-3 sm:p-4 text-center transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? "border-blue-600 bg-white text-blue-700 shadow-lg shadow-blue-500/15 -translate-y-0.5 sm:-translate-y-1 ring-2 ring-blue-600/10"
                    : "border-slate-200/90 bg-white/80 text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-xs"
                }`}
              >

                <div
                  className={`grid h-10 w-10 place-items-center rounded-xl mb-2 transition-colors ${
                    isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-extrabold sm:text-sm whitespace-nowrap">{screen.tabTitle}</span>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
                  {screen.tabSubtitle}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-1 h-1 w-8 rounded-full bg-blue-600"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Interactive Stage: Left Details + Right iPhone 16 Pro Mockup */}
        <div className="mt-12 grid items-center gap-10 rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-10 lg:grid-cols-12 lg:gap-14">
          
          {/* ================================================================= */}
          {/* LEFT COLUMN: Feature In-depth Explanations & Key Advantages        */}
          {/* ================================================================= */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>{activeFeature.badge}</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 sm:text-4xl leading-tight">
              {activeFeature.tagline}
            </h3>

            <p className="text-base text-slate-600 leading-relaxed">
              {activeFeature.description}
            </p>

            <div className="space-y-3 pt-2">
              {activeFeature.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{highlight}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                type="button"
                onClick={onOpenQr}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
              >
                <QrCode className="h-4 w-4" />
                <span>Trải nghiệm trên điện thoại</span>
              </button>
              <a
                href="#features"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                <span>Xem tất cả tính năng</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: Realistic iPhone 16 Pro Device Mockup               */}
          {/* ================================================================= */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-[310px] sm:w-[350px] rounded-[3.25rem] border-[10px] border-slate-900 bg-slate-950 p-2 shadow-[0_30px_90px_-15px_rgba(15,23,42,0.4)]">
              {/* Dynamic Island */}
              <div className="absolute left-1/2 top-4 z-30 h-6 w-28 -translate-x-1/2 rounded-full bg-slate-950 flex items-center justify-between px-2.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-900 border border-slate-700" />
              </div>

              {/* Speaker & Sensor */}
              <div className="relative overflow-hidden rounded-[2.6rem] bg-slate-50 min-h-[580px] sm:min-h-[620px] text-slate-900 flex flex-col justify-between">
                
                {/* Status Bar */}
                <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-bold text-slate-800">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px]">5G</span>
                    <div className="h-2.5 w-5 rounded-xs border border-slate-800 p-0.5 flex items-center">
                      <div className="h-full w-full bg-slate-900 rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* Simulated Screen Body with AnimatePresence */}
                <div className="flex-1 p-4 pt-5 overflow-hidden flex flex-col justify-start">
                  <AnimatePresence mode="wait">
                    {/* Screen 1: AI Scanner */}
                    {activeFeature.screenType === "scanner" && (
                      <motion.div
                        key="scanner"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">Camera AI Scanner</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Sẵn sàng
                          </span>
                        </div>

                        {/* Simulated Viewfinder & Laser Scan */}
                        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-blue-400 bg-slate-900 p-3 text-white">
                          <div className="absolute inset-0 bg-blue-900/10" />
                          <motion.div
                            animate={{ y: [0, 90, 0] }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                            className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8]"
                          />

                          <div className="relative z-10 space-y-1.5 text-center py-2">
                            <p className="text-[11px] font-bold text-cyan-300">HIGHLANDS COFFEE - VINCOM</p>
                            <p className="text-[10px] text-slate-400">Hóa đơn điện tử • 14:32:05</p>
                            <div className="mt-2 rounded-lg bg-white/10 p-2 text-left text-[11px] space-y-1 font-mono">
                              <div className="flex justify-between">
                                <span>Phin Sữa Đá (L) x2</span>
                                <span>78.000 đ</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Trà Sen Vàng (M)</span>
                                <span>55.000 đ</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Bánh Mì Thịt Nướng</span>
                                <span>39.000 đ</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AI Extraction Result Card */}
                        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-500">Tổng thanh toán:</span>
                            <span className="text-base text-rose-600 font-extrabold">185.760 đ</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-1.5">
                            <span>Bao gồm VAT 8%:</span>
                            <span className="font-semibold text-slate-700">13.760 đ</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-blue-700 font-bold">
                              Ăn uống • Cà phê
                            </span>
                            <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Đã lưu vào ví
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Screen 2: Group Expense with VietQR */}
                    {activeFeature.screenType === "group" && (
                      <motion.div
                        key="group"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">Chi Tiêu Nhóm</span>
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                            4 thành viên
                          </span>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-3.5 text-white shadow-sm">
                          <p className="text-[11px] text-blue-100 font-medium">Du Lịch Phú Quốc 2026</p>
                          <p className="text-xl font-black mt-1">9.600.000 đ</p>
                          <p className="text-[10px] text-blue-200 mt-0.5">Bình quân: 2.400.000 đ / người</p>
                        </div>

                        {/* Settlement breakdown */}
                        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 text-xs">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Quyết toán tối ưu
                          </p>
                          <div className="flex items-center justify-between py-1 border-b border-slate-100">
                            <div>
                              <p className="font-bold text-slate-800">Minh ➔ Nam</p>
                              <p className="text-[10px] text-slate-500">Tiền khách sạn</p>
                            </div>
                            <span className="font-extrabold text-blue-600">1.200.000 đ</span>
                          </div>
                          <div className="flex items-center justify-between py-1">
                            <div>
                              <p className="font-bold text-slate-800">Lan ➔ Nam</p>
                              <p className="text-[10px] text-slate-500">Tiền ăn hải sản</p>
                            </div>
                            <span className="font-extrabold text-blue-600">800.000 đ</span>
                          </div>
                        </div>

                        {/* VietQR Quick Action */}
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-2.5 flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-lg bg-white border border-emerald-300 text-emerald-700 shrink-0">
                            <QrCode className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[11px] font-bold text-emerald-900">Mã VietQR 1 chạm</p>
                            <p className="text-[10px] text-emerald-700">Quét app ngân hàng trả ngay</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Screen 3: Debt & Loan Tracker */}
                    {activeFeature.screenType === "debt" && (
                      <motion.div
                        key="debt"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">Sổ Vay & Cho Vay</span>
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                            Đang theo dõi
                          </span>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">Cho bạn Duy vay</span>
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                              Lãi 1.2% / tháng
                            </span>
                          </div>
                          <p className="text-2xl font-black text-slate-900">50.000.000 đ</p>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[60%]" />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                            <span>Đã trả 3 kỳ: 30 triệu</span>
                            <span className="text-rose-600">Còn lại: 20 triệu</span>
                          </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5 text-xs">
                          <div className="flex justify-between text-slate-600">
                            <span>Kỳ tiếp theo:</span>
                            <span className="font-bold text-slate-900">25/10/2026</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Tiền lãi kỳ này:</span>
                            <span className="font-bold text-emerald-600">240.000 đ</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Số ngày vay:</span>
                            <span className="font-bold text-slate-900">90 ngày</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800"
                        >
                          <Bell className="h-3.5 w-3.5" />
                          <span>Gửi tin nhắn nhắc nợ lịch sự</span>
                        </button>
                      </motion.div>
                    )}

                    {/* Screen 4: Banking Sync */}
                    {activeFeature.screenType === "bank" && (
                      <motion.div
                        key="bank"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">Đồng Bộ Ngân Hàng</span>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            Đã kết nối SePay
                          </span>
                        </div>

                        {/* Live Push Notification Simulation */}
                        <div className="rounded-2xl border border-blue-200 bg-blue-50/90 p-3 shadow-xs space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-900">
                            <Building2 className="h-4 w-4 text-blue-600" />
                            <span>Vietcombank Digibank</span>
                            <span className="ml-auto text-[10px] text-blue-500">Vừa xong</span>
                          </div>
                          <p className="text-xs text-slate-800 font-semibold">
                            Biến động số dư: <strong className="text-emerald-600 font-bold">+15.000.000 VND</strong>
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Nội dung: CONG TY CO PHAN CONG NGHE TRA LUONG T10/2026
                          </p>
                        </div>

                        {/* Auto-categorized card */}
                        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 text-xs">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            AI Tự động ghi chép
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Phân loại:</span>
                            <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800 text-[11px]">
                              Lương & Thu nhập chính
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Ví thụ hưởng:</span>
                            <span className="font-bold text-slate-800">Ví Chính VCB</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Trạng thái:</span>
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Đã cập nhật số dư
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Screen 5: Asset & Gold Portfolio */}
                    {activeFeature.screenType === "asset" && (
                      <motion.div
                        key="asset"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">Danh Mục Tài Sản</span>
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            PnL: +18.4%
                          </span>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-3.5 text-white shadow-sm">
                          <p className="text-[11px] text-slate-400 font-medium">Tổng Giá Trị Tài Sản Ròng</p>
                          <p className="text-2xl font-black mt-1 text-amber-400">1.250.000.000 đ</p>
                          <p className="text-[10px] text-emerald-400 mt-0.5">▲ +194.500.000 đ (12 tháng qua)</p>
                        </div>

                        {/* Asset list */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5">
                            <div>
                              <p className="font-bold text-slate-800">Vàng Miếng SJC (3 lượng)</p>
                              <p className="text-[10px] text-slate-500">Giá mua: 78.5Tr • Hiện tại: 86.2Tr</p>
                            </div>
                            <span className="font-extrabold text-amber-600">258.600.000 đ</span>
                          </div>

                          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5">
                            <div>
                              <p className="font-bold text-slate-800">Tiết Kiệm BIDV 12T (5.8%)</p>
                              <p className="text-[10px] text-slate-500">Đáo hạn: 15/03/2027</p>
                            </div>
                            <span className="font-extrabold text-blue-600">320.000.000 đ</span>
                          </div>

                          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5">
                            <div>
                              <p className="font-bold text-slate-800">Cổ Phiếu FPT & HPG</p>
                              <p className="text-[10px] text-emerald-600 font-medium">Tỷ suất sinh lời: +24.6%</p>
                            </div>
                            <span className="font-extrabold text-purple-600">415.000.000 đ</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Screen 6: Voice AI & Emotion AI */}
                    {activeFeature.screenType === "voice" && (
                      <motion.div
                        key="voice"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">Trợ Lý Giọng Nói AI</span>
                          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" /> Đang lắng nghe
                          </span>
                        </div>

                        {/* Speech Waveform Simulation */}
                        <div className="rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 p-3.5 text-white shadow-sm space-y-2">
                          <div className="flex items-center justify-center gap-1 py-1">
                            {[12, 28, 18, 36, 24, 40, 16, 32, 20, 10].map((h, i) => (
                              <motion.div
                                key={i}
                                animate={{ height: [h * 0.4, h, h * 0.4] }}
                                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.08 }}
                                className="w-1 rounded-full bg-indigo-400"
                              />
                            ))}
                          </div>
                          <p className="text-center text-[11px] font-medium text-indigo-200 italic">
                            “Hôm nay ăn phở Thìn 65k và cà phê Highlands 35k”
                          </p>
                        </div>

                        {/* Emotion AI Response Card */}
                        <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 space-y-2 text-xs">
                          <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <span>AI đã tự động bóc tách (2 khoản):</span>
                          </div>
                          <div className="space-y-1 text-[11px] border-t border-indigo-100 pt-1.5">
                            <div className="flex justify-between font-semibold text-slate-800">
                              <span>1. Phở Thìn (Ăn sáng)</span>
                              <span className="text-rose-600 font-bold">-65.000 đ</span>
                            </div>
                            <div className="flex justify-between font-semibold text-slate-800">
                              <span>2. Cà phê Highlands (Ăn uống)</span>
                              <span className="text-rose-600 font-bold">-35.000 đ</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-indigo-800 bg-white/80 p-2 rounded-lg border border-indigo-100 mt-1 leading-relaxed">
                            💡 <em>Cố vấn AI:</em> Bạn đang kiểm soát ngân sách tuần rất tốt (còn 62% ngân sách ăn uống an toàn).
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Screen 7: Group Fund & Supervisor Approval */}
                    {activeFeature.screenType === "fund" && (
                      <motion.div
                        key="fund"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">Quỹ Nhóm Chung</span>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            12 thành viên
                          </span>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-3.5 text-white shadow-sm">
                          <p className="text-[11px] text-emerald-100 font-medium">Quỹ Lớp 12A1 / Du Lịch</p>
                          <p className="text-2xl font-black mt-1">14.850.000 đ</p>
                          <p className="text-[10px] text-emerald-200 mt-0.5">100% đã đóng quỹ qua VietQR</p>
                        </div>

                        {/* Supervisor Approval Required Card */}
                        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 space-y-2 text-xs">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-amber-900 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Chờ Giám Sát Duyệt
                            </span>
                            <span className="text-amber-700 font-extrabold">-2.400.000 đ</span>
                          </div>
                          <p className="text-[11px] text-slate-700 font-medium">
                            Thủ quỹ (Lan): Đặt cọc tiệc BBQ bãi biển
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="rounded-lg bg-emerald-600 text-white font-bold text-[10px] px-3 py-1 text-center w-full shadow-xs">
                              ✓ Người Giám Sát Phê Duyệt
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Home Indicator Bar */}
                <div className="mx-auto mb-2 h-1 w-32 rounded-full bg-slate-400" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
