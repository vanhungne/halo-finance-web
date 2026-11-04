import { motion as Motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Users,
  Briefcase,
  Wallet,
  ArrowRight,
  Receipt,
  PiggyBank,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  Coins,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const getSolutions = (en) => [
  {
    id: "personal",
    title: en ? "Personal" : "Cá nhân",
    headline: en ? "Quản lý tài chính cá nhân" : "Quản lý tài chính cá nhân",
    target: en
      ? "Dành cho người muốn chủ động kiểm soát chi tiêu và tích lũy"
      : "Dành cho người muốn chủ động kiểm soát chi tiêu và tích lũy",
    description: en
      ? "Keep income, expenses and savings goals together in one clean space. Review cash flow patterns to optimize daily spending and achieve financial milestones."
      : "Ghi chép thu nhập, chi tiêu và mục tiêu tiết kiệm tập trung. Nắm rõ dòng tiền vào ra mỗi ngày để tối ưu chi tiêu và đạt các mục tiêu tài chính dài hạn.",
    icon: Wallet,
    features: [
      {
        icon: Wallet,
        title: en ? "Income, expenses & wallets" : "Thu chi và đa ví",
        desc: en
          ? "Organize transactions by flexible wallets and custom categories."
          : "Phân loại chi tiết giao dịch theo từng ví và danh mục thu chi sinh hoạt.",
      },
      {
        icon: PiggyBank,
        title: en ? "Budgets & 6-Jars rule" : "Ngân sách & Quy tắc 6 lọ",
        desc: en
          ? "Set spending limits and monitor automated savings progress."
          : "Thiết lập hạn mức chi tiêu, theo dõi tiến độ tích lũy tự động theo tháng.",
      },
      {
        icon: Sparkles,
        title: en ? "AI Receipt & Voice entry" : "Quét hóa đơn AI & Giọng nói",
        desc: en
          ? "Extract receipts or log expenses via Vietnamese voice in 3 seconds."
          : "Bóc tách hóa đơn ăn uống, siêu thị và nhập liệu bằng giọng nói tiếng Việt.",
      },
      {
        icon: TrendingUp,
        title: en ? "Debts & Visual analytics" : "Sổ nợ & Báo cáo trực quan",
        desc: en
          ? "Track loans, repayments and comprehensive cash flow charts."
          : "Quản lý các khoản vay nợ, lịch hoàn trả và biểu đồ biến động dòng tiền.",
      },
    ],
    highlightQuote: en
      ? "Clear visibility into every transaction, from daily coffee to long-term goals."
      : "Minh bạch mọi dòng tiền, từ khoản chi nhỏ hằng ngày đến những mục tiêu lớn.",
  },
  {
    id: "group",
    title: en ? "Groups" : "Nhóm & Bạn bè",
    headline: en ? "Chia tiền nhóm & Quỹ chung" : "Chia tiền nhóm & Quỹ chung",
    target: en
      ? "Dành cho nhóm bạn đi du lịch, người ở chung phòng và gia đình"
      : "Dành cho nhóm bạn đi du lịch, người ở chung phòng và gia đình",
    description: en
      ? "Record who paid and let the system calculate optimal repayments. Instant 1-tap VietQR settlement without digging through messy chat messages."
      : "Ghi nhận rõ ràng ai đã trả tiền và tự động tính toán phần chia công bằng. Tạo mã thanh toán VietQR 1 chạm để hoàn tiền ngay mà không cần tính tay hay lục lại tin nhắn.",
    icon: Users,
    features: [
      {
        icon: Users,
        title: en ? "Flexible member groups" : "Tạo nhóm & Mời linh hoạt",
        desc: en
          ? "Create dedicated funds for trips, flatmates or office lunches."
          : "Tạo nhóm riêng cho chuyến du lịch, tiền phòng trọ hoặc ăn trưa văn phòng.",
      },
      {
        icon: Receipt,
        title: en ? "Smart splitting methods" : "Nhiều phương thức chia tiền",
        desc: en
          ? "Split equally, by exact amount, percentages or custom shares."
          : "Chia đều, chia theo số tiền chính xác, theo tỷ lệ % hoặc số phần.",
      },
      {
        icon: Coins,
        title: en ? "Automated net balance" : "Tự động cân bằng 'Ai nợ ai'",
        desc: en
          ? "Smart algorithm minimizes transfers, showing exact net balances."
          : "Thuật toán tối ưu rút gọn số giao dịch cần chuyển, biết chính xác ai nợ ai.",
      },
      {
        icon: ShieldCheck,
        title: en ? "VietQR 1-Tap settlement" : "Thanh toán 1 chạm VietQR",
        desc: en
          ? "Generate dynamic QR with exact amount and note for instant transfer."
          : "Tạo sẵn mã QR có sẵn số tiền và nội dung để thanh toán ngân hàng tức thì.",
      },
    ],
    highlightQuote: en
      ? "Every shared expense is transparent, accountable and settled in seconds."
      : "Mọi khoản chi chung đều minh bạch, công bằng và thanh toán nhanh chóng.",
  },
  {
    id: "business",
    title: en ? "Business" : "Hộ kinh doanh & Dự án",
    headline: en ? "Quản lý dòng tiền kinh doanh" : "Quản lý dòng tiền kinh doanh & Dự án",
    target: en
      ? "Dành cho chủ cửa hàng, người làm tự do, hộ kinh doanh và quản lý dự án"
      : "Dành cho chủ cửa hàng, người làm tự do, hộ kinh doanh và quản lý dự án",
    description: en
      ? "Separate multiple companies and projects. Distinguish recorded accruals from actual cash flow, review employee claims and export reports."
      : "Quản lý độc lập nhiều công ty và dự án. Tách bạch doanh thu ghi nhận với dòng tiền thực thu/chi, phê duyệt tạm ứng nhân viên và xuất báo cáo tài chính chuẩn xác.",
    icon: Briefcase,
    features: [
      {
        icon: Briefcase,
        title: en ? "Multi-Company & Projects" : "Đa công ty & Đa dự án",
        desc: en
          ? "Isolate financial databases per business entity and project."
          : "Dữ liệu thu chi được tách riêng theo từng công ty và từng dự án cụ thể.",
      },
      {
        icon: Coins,
        title: en ? "Cash flow & Accruals" : "Thực thu chi vs Ghi nhận",
        desc: en
          ? "Track collected, paid, outstanding and excess amounts per entry."
          : "Theo dõi sát sao số tiền đã thu, đã chi, còn thiếu hoặc vượt mức ngân sách.",
      },
      {
        icon: ShieldCheck,
        title: en ? "Advances & Approvals" : "Tạm ứng & Phê duyệt chi tiêu",
        desc: en
          ? "Review staff expense requests and manage reimbursement flows."
          : "Chủ doanh nghiệp duyệt yêu cầu của nhân viên, kiểm soát tạm ứng và hoàn ứng.",
      },
      {
        icon: FileSpreadsheet,
        title: en ? "Reports & Excel/PDF export" : "Báo cáo P&L & Xuất Excel/PDF",
        desc: en
          ? "Automated profit/loss, cash flow statements and professional exports."
          : "Tự động tổng hợp báo cáo lãi lỗ, dòng tiền và công nợ; hỗ trợ xuất file Excel/PDF.",
      },
    ],
    highlightQuote: en
      ? "Complete command over real cash flow, team expenses and project profitability."
      : "Kiểm soát toàn diện dòng tiền thực tế, công nợ và hiệu quả kinh doanh của dự án.",
  },
];

export default function SolutionsSegment({ activeSegment = "personal", onSelectSegment, onOpenQr }) {
  const { isEnglish } = useLanguage();
  const solutions = getSolutions(isEnglish);

  const current = solutions.find((s) => s.id === activeSegment) || solutions[0];

  return (
    <section id="solutions" className="py-20 sm:py-24 bg-white border-t border-slate-100">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-8 lg:px-12">
        {/* Header: Clean & authoritative without distracting tags */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black text-slate-950 tracking-tight title-3d">
            {isEnglish ? "Your finances, your way" : "Chọn cách quản lý phù hợp với bạn"}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {isEnglish
              ? "Personal spending, shared group bills, or business cash flow — choose what matters most to your workflow."
              : "Chi tiêu cá nhân, khoản chung của nhóm hay dòng tiền kinh doanh — bắt đầu từ đúng nhu cầu thực tế của bạn."}
          </p>
        </div>

        {/* Minimalist Segmented Tabs: Crisp 8px border radius, no heavy rounded pills */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200/80 shadow-2xs">
            {solutions.map((s) => {
              const TabIcon = s.icon;
              const isActive = activeSegment === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectSegment?.(s.id)}
                  aria-pressed={isActive}
                  type="button"
                  className={`flex items-center gap-2 py-2 px-4 sm:px-5 rounded-md text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <TabIcon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Content Showcase: Crisp 12px border radius, no heavy bubbly shadows */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-2xs">
          <AnimatePresence mode="wait">
            <Motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
            >
              {/* Left Column: Context, description & direct action */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-5">
                <div>
                  <h3 className="text-2xl sm:text-[1.75rem] font-extrabold text-slate-900 tracking-tight leading-snug">
                    {current.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
                    {current.target}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed mt-4">
                    {current.description}
                  </p>
                </div>

                {/* Editorial quote block with clean accent left border */}
                <div className="border-l-2 border-blue-600 bg-slate-50/70 py-2.5 px-3.5 rounded-r-md text-xs sm:text-sm text-slate-700 italic flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{current.highlightQuote}</span>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenQr) onOpenQr();
                      else {
                        const el = document.getElementById("home");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>{isEnglish ? "Get the app" : "Tải ứng dụng ngay"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: 4 Clean Capability Cards */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {current.features.map((feat, idx) => {
                  const FeatIcon = feat.icon;
                  return (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-200/90 bg-slate-50/40 p-4.5 hover:bg-white hover:border-slate-300 hover:shadow-2xs transition-all duration-150"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="grid h-7 w-7 place-items-center rounded-md bg-blue-50 text-blue-600 shrink-0">
                          <FeatIcon className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                          {feat.title}
                        </h4>
                      </div>
                      <p className="text-[12px] sm:text-xs text-slate-500 leading-relaxed font-normal">
                        {feat.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
