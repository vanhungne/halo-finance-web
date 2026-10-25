import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Wallet,
  Building,
  Receipt,
  PiggyBank,
  FileSpreadsheet,
  Coins,
  ShieldCheck,
} from "lucide-react";

const solutions = [
  {
    id: "personal",
    title: "Cá Nhân & Gia Đình",
    badge: "Phổ Biến Nhất",
    target: "Dành cho người đi làm, các bạn trẻ và gia đình muốn chi tiêu có kế hoạch",
    description:
      "Chấm dứt hoàn toàn tình trạng 'chưa hết tháng đã hết tiền'. Gom tất cả tài khoản ngân hàng, ví điện tử vào một nơi duy nhất và xây dựng quỹ tiết kiệm vững chắc.",
    icon: Users,
    color: "from-sky-500 to-blue-600",
    features: [
      { title: "Quản lý Đa Ví Thông Minh", desc: "Tập trung tiền mặt, tài khoản Vietcombank, Techcombank, MB, ví MoMo." },
      { title: "Quỹ Gia Đình Chung", desc: "Vợ chồng cùng ghi nhận chi phí sinh hoạt, đối soát thu chi minh bạch." },
      { title: "Sổ Tiết Kiệm & Mục Tiêu 52 Tuần", desc: "Đặt mục tiêu mua nhà, mua xe hay quỹ khẩn cấp 6 tháng có lộ trình." },
      { title: "AI Quét Hóa Đơn Tức Thì", desc: "Chụp ảnh hóa đơn siêu thị, ăn uống — AI tự bóc tách và phân loại." },
    ],
    highlightQuote: "Giúp hơn 1.8 triệu gia đình Việt Nam tiết kiệm thêm 20-30% thu nhập mỗi tháng.",
  },
  {
    id: "business",
    title: "Hộ Kinh Doanh & Bán Hàng",
    badge: "Tối Ưu Vận Hành",
    target: "Dành cho chủ shop online, hộ kinh doanh cá thể, freelancer nhận nhiều dự án",
    description:
      "Tách bạch rạch ròi giữa tiền cá nhân và tiền kinh doanh. Quản lý công nợ khách hàng, kiểm soát chi phí nhập hàng và xuất báo cáo kế toán chỉ trong 1 nốt nhạc.",
    icon: Briefcase,
    color: "from-emerald-500 to-teal-600",
    features: [
      { title: "Tách Bạch 100% Dòng Tiền", desc: "Phân loại ví kinh doanh và ví sinh hoạt cá nhân, không lo thất thoát." },
      { title: "Sổ Quản Lý Công Nợ Khách Hàng", desc: "Ghi nhận công nợ nhà cung cấp, lịch nhắc thu tiền tự động qua Zalo." },
      { title: "Lưu Trữ Hóa Đơn Nhập Hàng VAT", desc: "Số hóa toàn bộ hóa đơn chứng từ đầu vào bằng camera AI, tìm kiếm dễ dàng." },
      { title: "Xuất Báo Cáo Doanh Thu Kế Toán", desc: "Xuất file Excel chuẩn chỉnh để đối soát lãi/lỗ và nộp báo cáo thuế định kỳ." },
    ],
    highlightQuote: "Hơn 250.000 chủ hộ kinh doanh tin cậy sử dụng để kiểm soát dòng tiền hàng ngày.",
  },
  {
    id: "investor",
    title: "Nhà Đầu Tư Cá Nhân",
    badge: "Quản Lý Tài Sản",
    target: "Dành cho người có dòng vốn nhàn rỗi, đầu tư chứng khoán, vàng và bất động sản",
    description:
      "Theo dõi sức khỏe tài chính toàn diện với chỉ số Net Worth. Quản lý tỷ trọng phân bổ danh mục tài sản sinh lời và lợi nhuận ròng thời gian thực.",
    icon: TrendingUp,
    color: "from-amber-500 to-orange-600",
    features: [
      { title: "Định Giá Danh Mục Tài Sản Ròng", desc: "Tổng hợp Vàng miếng SJC, Cổ phiếu, BĐS cho thuê, Sổ tiết kiệm kỳ hạn." },
      { title: "Tính Toán Tỷ Suất Sinh Lời (PnL)", desc: "Theo dõi giá vốn, giá thị trường hiện tại và tỷ lệ lãi/lỗ tức thời." },
      { title: "Cảnh Báo Tỷ Lệ An Toàn Dòng Tiền", desc: "Đảm bảo luôn duy trì tỷ lệ tiền mặt dự phòng khẩn cấp trước biến động." },
      { title: "Biểu Đồ Tăng Trưởng Tài Sản Đa Niên", desc: "Phân tích tốc độ gia tăng tài sản theo từng quý và năm dài hạn." },
    ],
    highlightQuote: "Mang chuẩn mực báo cáo tài sản gia đình chuyên nghiệp của các Family Office quốc tế.",
  },
];

export default function SolutionsSegment() {
  const [activeSegment, setActiveSegment] = useState("personal");

  const current = solutions.find((s) => s.id === activeSegment) || solutions[0];
  const Icon = current.icon;

  return (
    <section id="solutions" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-widest text-sky-700 mb-4">
            <Building className="w-3.5 h-3.5 text-sky-600" />
            Giải Pháp Tài Chính May Đo Cho Bạn
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Đáp Ứng Mọi Nhu Cầu Quản Lý Tài Chính
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Dù bạn muốn tối ưu chi tiêu gia đình, quản lý công nợ kinh doanh hay theo dõi danh mục đầu tư — Trợ Lý Tài Chính luôn có giải pháp hoàn hảo cho bạn.
          </p>
        </div>

        {/* 3 Audience Tab Buttons */}
        <div className="mt-12 flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 max-w-3xl w-full">
            {solutions.map((s) => {
              const TabIcon = s.icon;
              const isActive = activeSegment === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSegment(s.id)}
                  type="button"
                  className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-extrabold transition-all duration-300 ${
                    isActive
                      ? "bg-slate-950 text-white shadow-md scale-[1.02]"
                      : "text-slate-600 hover:text-slate-950 hover:bg-white/60"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Content Showcase Card */}
        <div className="mt-10 rounded-[2.5rem] border border-slate-200/90 bg-[#fbfbfa] p-8 sm:p-12 shadow-[0_25px_60px_-25px_rgba(15,23,42,0.12)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
            >
              {/* Left Column: Solution Detail & Audience description */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-black uppercase tracking-wider mb-3">
                    {current.badge}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                    {current.title}
                  </h3>
                  <p className="text-xs font-bold text-sky-700 mt-2 uppercase tracking-wide">
                    {current.target}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {current.description}
                </p>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-700 flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600 font-bold">
                    ✓
                  </div>
                  <span>{current.highlightQuote}</span>
                </div>

                <div>
                  <a
                    href="#download"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 transition"
                  >
                    <span>Trải nghiệm 0đ cho {current.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right Column: 4 Key Features Grid */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {current.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-sky-300 hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-sky-50 text-sky-600">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                        {feat.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
