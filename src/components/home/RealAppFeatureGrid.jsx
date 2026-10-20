import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanLine,
  Mic,
  Mail,
  Users2,
  PiggyBank,
  PieChart,
  HandCoins,
  TrendingUp,
  Wallet,
  CalendarClock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  QrCode,
  FileSpreadsheet,
  CheckCircle2,
  HeartHandshake,
  Bot,
  Layers,
  Coins,
  Building2,
  BadgeCheck,
} from "lucide-react";

export const APP_FEATURES = [
  // CATEGORY 1: AI & AUTOMATION
  {
    id: "ai-scanner",
    category: "ai",
    categoryName: "Trí Tuệ Nhân Tạo AI",
    title: "AI Bóc Tách Hóa Đơn 3 Giây",
    subtitle: "Camera OCR Đa Tầng AI",
    badge: "Độc Quyền AI",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    icon: ScanLine,
    iconBg: "from-cyan-500 to-blue-600",
    desc: "Chụp ảnh hóa đơn nhà hàng, siêu thị, bill tiền điện hay hóa đơn điện tử VAT. Trí Tuệ Nhân Tạo AI tự động bóc tách từng món, thuế VAT 8-10% và phân loại danh mục chính xác 99.4%.",
    appScreenRef: "src/screens/camera/CameraScreen.jsx",
    metric: "3 giây bóc tách",
  },
  {
    id: "ai-voice",
    category: "ai",
    categoryName: "Trí Tuệ Nhân Tạo AI",
    title: "Ghi Thu Chi Bằng Giọng Nói",
    subtitle: "Nhận diện giọng nói Tiếng Việt",
    badge: "Tiện Ích 1 Chạm",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Mic,
    iconBg: "from-indigo-500 to-violet-600",
    desc: "Chỉ cần nhấn và nói: 'Hôm nay ăn phở Thìn 65k và cà phê Highlands 35k'. Hệ thống tự động tách thành 2 giao dịch riêng biệt, gán đúng ví tiền và danh mục trong nháy mắt.",
    appScreenRef: "src/screens/chat/ChatScreen.jsx",
    metric: "Không cần gõ phím",
  },
  {
    id: "gmail-sync",
    category: "ai",
    categoryName: "Trí Tuệ Nhân Tạo AI",
    title: "Tự Động Đọc Email Ngân Hàng",
    subtitle: "Gmail Auto-Sync Engine",
    badge: "Tự Động Hóa",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    icon: Mail,
    iconBg: "from-rose-500 to-pink-600",
    desc: "Tự động kết nối an toàn với hòm thư Gmail, quét email biến động số dư từ Vietcombank, Techcombank, MB, ACB, VPBank... và ghi nhận tức thì mà không cần bạn mở ứng dụng.",
    appScreenRef: "src/screens/gmail/GmailMessagesScreen.jsx",
    metric: "Tương thích 100% ngân hàng",
  },
  {
    id: "ai-coach",
    category: "ai",
    categoryName: "Trí Tuệ Nhân Tạo AI",
    title: "Trợ Lý Tài Chính Thấu Cảm",
    subtitle: "Emotion AI Personal Coach",
    badge: "Cá Nhân Hóa",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Bot,
    iconBg: "from-amber-500 to-orange-600",
    desc: "Trợ lý AI thấu cảm (Emotion AI) đồng hành 24/7, phân tích xu hướng chi tiêu bất thường, cảnh báo khi cảm xúc mua sắm quá đà và đưa ra lời khuyên tài chính khéo léo.",
    appScreenRef: "src/screens/chat/ChatScreen.jsx",
    metric: "Cố vấn 24/7",
  },

  // CATEGORY 2: GROUP & SOCIAL FINANCE
  {
    id: "group-split",
    category: "group",
    categoryName: "Chi Tiêu Nhóm & Quỹ",
    title: "Chia Tiền Nhóm & Split Bill",
    subtitle: "Tối ưu hóa số lần chuyển khoản",
    badge: "Được Yêu Thích",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Users2,
    iconBg: "from-blue-600 to-indigo-600",
    desc: "Chia tiền đi ăn, du lịch, thuê nhà công bằng: chia đều, chia theo %, theo món ăn hoặc theo số phần. Thuật toán thông minh tối ưu ma trận nợ giúp cả nhóm quyết toán ít lần nhất.",
    appScreenRef: "src/screens/group/GroupExpenseFormScreen.jsx",
    metric: "Ít lần chuyển nhất",
  },
  {
    id: "group-fund",
    category: "group",
    categoryName: "Chi Tiêu Nhóm & Quỹ",
    title: "Quỹ Nhóm Chung & Duyệt Chi Kép",
    subtitle: "Quỹ công ty, lớp học, du lịch",
    badge: "Minh Bạch Tuyệt Đối",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: HeartHandshake,
    iconBg: "from-emerald-500 to-teal-600",
    desc: "Quản lý quỹ nhóm tập thể với cơ chế đóng quỹ qua VietQR tự động. Tính năng Người Giám Sát (Supervisor) duyệt chi độc lập, ngăn ngừa thất thoát quỹ và xuất sao kê PDF/Excel trong 1 chạm.",
    appScreenRef: "src/screens/group-fund/GroupFundDetailScreen.jsx",
    metric: "Duyệt chi 2 lớp",
  },
  {
    id: "vietqr-share",
    category: "group",
    categoryName: "Chi Tiêu Nhóm & Quỹ",
    title: "Tạo Mã VietQR Thanh Toán 1 Chạm",
    subtitle: "Chuẩn thanh toán quốc gia",
    badge: "NAPAS 24/7",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    icon: QrCode,
    iconBg: "from-sky-500 to-blue-600",
    desc: "Tự động sinh mã VietQR chuẩn ngân hàng với đúng số tài khoản, số tiền lẻ đến từng đồng và nội dung chuyển khoản rõ ràng. Bạn bè chỉ cần quét là tiền về tài khoản ngay lập tức.",
    appScreenRef: "src/screens/group/GroupExpenseShareScreen.jsx",
    metric: "Quét app ngân hàng trả ngay",
  },
  {
    id: "recurring-bills",
    category: "group",
    categoryName: "Chi Tiêu Nhóm & Quỹ",
    title: "Hóa Đơn Định Kỳ Nhóm",
    subtitle: "Tiền nhà, điện nước, internet",
    badge: "Tự Động Nhắc",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    icon: CalendarClock,
    iconBg: "from-purple-500 to-indigo-600",
    desc: "Lên lịch tự động cho các khoản chi cố định hàng tháng của nhóm như tiền nhà, điện nước, phí dịch vụ chung cư. Tự động chia tiền và gửi thông báo nhắc nhở thành viên đúng hẹn.",
    appScreenRef: "src/screens/group/GroupRecurringScreen.jsx",
    metric: "Đúng hạn mỗi tháng",
  },

  // CATEGORY 3: PERSONAL & BUDGET
  {
    id: "multi-wallets",
    category: "personal",
    categoryName: "Quản Lý Cá Nhân & Ví",
    title: "Hệ Thống Đa Ví Linh Hoạt",
    subtitle: "Tiền mặt, Ngân hàng, Thẻ tín dụng",
    badge: "Quản Trị 360°",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Wallet,
    iconBg: "from-emerald-500 to-green-600",
    desc: "Tạo không giới hạn ví tiền mặt, tài khoản ngân hàng, ví MoMo, ZaloPay, sổ tiết kiệm và thẻ tín dụng. Theo dõi biến động số dư và luân chuyển dòng tiền giữa các ví chuẩn xác.",
    appScreenRef: "src/screens/wallet/WalletListScreen.jsx",
    metric: "Không giới hạn số ví",
  },
  {
    id: "smart-budget",
    category: "personal",
    categoryName: "Quản Lý Cá Nhân & Ví",
    title: "Ngân Sách 6 Lọ & 50/30/20",
    subtitle: "Cảnh báo vượt hạn mức",
    badge: "Khoa Học",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: PieChart,
    iconBg: "from-amber-500 to-yellow-600",
    desc: "Thiết lập hạn mức chi tiêu theo từng danh mục (Ăn uống, Giải trí, Mua sắm). Nhận thông báo cảnh báo thông minh khi chi tiêu chạm ngưỡng 80% hoặc 100% ngân sách tháng.",
    appScreenRef: "src/screens/budget/BudgetSetupScreen.jsx",
    metric: "Cảnh báo bội chi tức thì",
  },
  {
    id: "saving-goals",
    category: "personal",
    categoryName: "Quản Lý Cá Nhân & Ví",
    title: "Hũ Tích Lũy & Mục Tiêu Tiết Kiệm",
    subtitle: "Mua nhà, mua xe, quỹ khẩn cấp",
    badge: "Động Lực Tích Lũy",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    icon: PiggyBank,
    iconBg: "from-teal-500 to-cyan-600",
    desc: "Đặt mục tiêu tài chính rõ ràng: Quỹ khẩn cấp 6 tháng, Mua xe mới, Du lịch nước ngoài. Hệ thống tính toán chính xác số tiền cần tích lũy mỗi ngày và biểu thị thanh tiến độ sinh động.",
    appScreenRef: "src/screens/saving/SavingGoalSetupScreen.jsx",
    metric: "Thanh tiến độ thời gian thực",
  },
  {
    id: "excel-export",
    category: "personal",
    categoryName: "Quản Lý Cá Nhân & Ví",
    title: "Xuất Báo Cáo Excel & PDF",
    subtitle: "Sao kê chi tiết chuẩn kế toán",
    badge: "Dữ Liệu Thuộc Về Bạn",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: FileSpreadsheet,
    iconBg: "from-blue-500 to-indigo-600",
    desc: "Toàn bộ lịch sử thu chi, sổ nợ, quỹ nhóm có thể xuất ra file Excel hoặc PDF chi tiết bất cứ lúc nào để lưu trữ, phục vụ khai thuế hoặc đối soát tài chính gia đình.",
    appScreenRef: "src/screens/chart/ChartScreen.jsx",
    metric: "Xuất dữ liệu 1 chạm",
  },

  // CATEGORY 4: ASSETS & DEBTS
  {
    id: "smart-debt",
    category: "assets",
    categoryName: "Tài Sản & Sổ Nợ",
    title: "Sổ Nợ & Tính Lãi Vay Dư Nợ",
    subtitle: "Cho vay, đi vay, trả nợ từng đợt",
    badge: "Không Lo Quên Nợ",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    icon: HandCoins,
    iconBg: "from-rose-500 to-red-600",
    desc: "Ghi nhận rõ ràng ai nợ mình, mình nợ ai. Hỗ trợ tính lãi suất theo ngày/tháng, ghi nhận lịch sử trả nợ theo đợt và tự động tạo mã VietQR kèm lời nhắn nhắc nợ tinh tế.",
    appScreenRef: "src/screens/debt/DebtScreen.jsx",
    metric: "Tính lãi dư nợ giảm dần",
  },
  {
    id: "asset-hub",
    category: "assets",
    categoryName: "Tài Sản & Sổ Nợ",
    title: "Danh Mục Tài Sản Ròng (Net Worth)",
    subtitle: "Vàng SJC, Cổ phiếu, Bất động sản",
    badge: "Đầu Tư Chuyên Nghiệp",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: TrendingUp,
    iconBg: "from-amber-600 to-yellow-600",
    desc: "Theo dõi tổng tài sản ròng từ Vàng miếng SJC, DOJI, Cổ phiếu, Trái phiếu đến Bất động sản và Xe cộ. Cập nhật biến động giá trị tài sản thị trường theo từng ngày.",
    appScreenRef: "src/screens/asset/AssetHubScreen.jsx",
    metric: "Định giá theo thị trường",
  },
  {
    id: "asset-valuation",
    category: "assets",
    categoryName: "Tài Sản & Sổ Nợ",
    title: "Tái Định Giá & Khấu Hao Tài Sản",
    subtitle: "Tính lãi/lỗ vốn khi thanh lý",
    badge: "Chuẩn Tài Chính",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
    icon: Layers,
    iconBg: "from-slate-700 to-slate-900",
    desc: "Tính toán mức khấu hao thiết bị, xe cộ theo thời gian hoặc ghi nhận tăng giá vốn bất động sản. Khi thanh lý tài sản, hệ thống tự động hạch toán khoản lãi/lỗ vốn vào dòng tiền.",
    appScreenRef: "src/screens/asset/AssetValuationScreen.jsx",
    metric: "Hạch toán Capital Gains",
  },
  {
    id: "bank-open",
    category: "assets",
    categoryName: "Tài Sản & Sổ Nợ",
    title: "Liên Kết SePay & Cổng VietQR Pro",
    subtitle: "Đồng bộ giao dịch tự động",
    badge: "Open Banking",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Building2,
    iconBg: "from-emerald-600 to-teal-700",
    desc: "Kết nối an toàn với hạ tầng SePay Open Banking qua OAuth 2.0. Không cần mật khẩu ngân hàng, hệ thống tự động gạch nợ và đối soát số dư thời gian thực với độ trễ dưới 120ms.",
    appScreenRef: "src/screens/bank/BankListScreen.jsx",
    metric: "Bảo mật OAuth 2.0",
  },
];

const CATEGORIES = [
  { id: "all", label: "Tất Cả 16 Siêu Tính Năng" },
  { id: "ai", label: "Trí Tuệ Nhân Tạo AI" },
  { id: "group", label: "Chi Tiêu Nhóm & Quỹ" },
  { id: "personal", label: "Cá Nhân & Ngân Sách" },
  { id: "assets", label: "Tài Sản & Sổ Nợ" },
];

export default function RealAppFeatureGrid({ onOpenQr }) {
  const [selectedCat, setSelectedCat] = useState("all");

  const filtered =
    selectedCat === "all"
      ? APP_FEATURES
      : APP_FEATURES.filter((f) => f.category === selectedCat);

  return (
    <section id="features" className="relative overflow-hidden bg-white py-24 sm:py-32 text-slate-900 border-t border-slate-200/80">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 h-[600px] w-[600px] rounded-full bg-blue-50/80 blur-[140px]" />
        <div className="absolute bottom-10 left-10 h-[450px] w-[450px] rounded-full bg-cyan-50/70 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-blue-700 shadow-2xs">
            <BadgeCheck className="h-4 w-4 text-blue-600" />
            <span>Rà Soát Toàn Diện 16+ Chức Năng Ứng Dụng Thực Tế</span>
          </div>

          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl text-slate-900">
            Mọi bài toán tài chính.{" "}
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Đều có lời giải hoàn hảo.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
            Được thiết kế từ thực tế tài chính người Việt — từ việc bóc tách hóa đơn ăn uống, tự động đọc email ngân hàng, đến chia tiền nhóm VietQR và quản lý quỹ lớp, quỹ gia đình.
          </p>

          {/* Category Filter Tabs */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCat === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCat(cat.id)}
                  className={`rounded-full px-5 py-2.5 text-xs font-black transition-all ${
                    active
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-105"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Cards Grid (4 Columns on large screen) */}
        <motion.div
          layout
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch"
        >
          <AnimatePresence>
            {filtered.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-blue-400 hover:shadow-xl transition-all"
                >
                  <div>
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-center justify-between gap-3">
                      <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${item.iconBg} text-white shadow-md`}>
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="mt-5 text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      {item.subtitle}
                    </p>

                    {/* Description */}
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 font-medium">
                      {item.desc}
                    </p>
                  </div>

                  {/* Card Bottom: Metric & Try CTA */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {item.metric}
                    </span>

                    <button
                      type="button"
                      onClick={onOpenQr}
                      className="text-slate-400 hover:text-blue-600 font-extrabold flex items-center gap-1 transition-colors text-[11px]"
                    >
                      <span>Trải nghiệm</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Banner: App Store & Full Ecosystem Guarantee */}
        <div className="mt-14 rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-7 sm:p-10 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Đã Kiểm Định & Sẵn Sàng Trên Cả 2 Hệ Điều Hành</span>
            </div>
            <h4 className="text-2xl sm:text-3xl font-black text-white">
              Tải Trợ Lý Tài Chính & Khám Phá Toàn Bộ Tính Năng
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Tất cả 16 tính năng trên đều đã được phát triển hoàn thiện trong ứng dụng di động (React Native / Expo) và hệ thống Backend (.NET Clean Architecture), sẵn sàng phục vụ bạn mỗi ngày.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenQr}
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-sky-400 px-6 py-3.5 text-xs font-black text-slate-950 shadow-lg shadow-sky-400/20 transition hover:opacity-95"
            >
              <QrCode className="h-4 w-4" />
              <span>Quét Mã Tải App 0đ</span>
            </button>
            <button
              type="button"
              onClick={onOpenQr}
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-xs font-bold text-white hover:bg-white/20 transition backdrop-blur-md cursor-pointer"
            >
              <span>Trải Nghiệm 100% Miễn Phí</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
