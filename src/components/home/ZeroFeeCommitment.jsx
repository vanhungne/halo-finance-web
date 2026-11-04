import { useState } from "react";
import {
  Sparkles,
  Zap,
  Users2,
  Clock,
  QrCode,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function ZeroFeeCommitment({ onOpenQr }) {
  const { lang, strings } = useLanguage();
  const isEn = lang === "en";
  const copy = strings?.commitment || {};

  // Calculator State
  const [monthlyTx, setMonthlyTx] = useState(80);

  // Estimations
  const annualSavings = Math.round((monthlyTx > 50 ? 89000 : 49000) * 12);
  const hoursSavedAnnual = Math.round((monthlyTx * 2 * 12) / 60);

  const VALUE_PILLARS = [
    {
      icon: Zap,
      iconColor: "text-blue-600",
      title: isEn ? "Zero Setup Barrier" : "Khởi Đầu Không Rào Cản",
      desc: isEn
        ? "Install and start tracking instantly. No credit card required or initial deposit needed to start managing your cash flow."
        : "Cài đặt và bắt đầu quản lý tài chính ngay tức thì. Không cần khai báo thẻ tín dụng hay nạp tiền trước để kích hoạt.",
    },
    {
      icon: Sparkles,
      iconColor: "text-amber-500",
      title: isEn ? "Smart AI & Receipt Scanner" : "Trợ Lý AI & Quét Hóa Đơn",
      desc: isEn
        ? "Experience intelligent receipt extraction in under 3 seconds with auto-categorization for dining, shopping and bills."
        : "Tự do nhận diện, bóc tách hóa đơn ăn uống, mua sắm và tự động phân loại danh mục trong 3 giây với độ chính xác cao.",
    },
    {
      icon: Users2,
      iconColor: "text-emerald-600",
      title: isEn ? "Group Funds & VietQR" : "Quỹ Nhóm & VietQR 1 Chạm",
      desc: isEn
        ? "Create shared funds for family, trips and events with 1-tap VietQR payment and automated settlement."
        : "Quản lý quỹ gia đình, hội nhóm minh bạch. Tự động tính toán bù trừ và tạo mã QR thanh toán 1 chạm tiện lợi.",
    },
  ];

  return (
    <section
      id="free-commitment"
      className="relative overflow-hidden bg-white py-16 sm:py-24 text-slate-900 border-t border-slate-200/80"
      aria-labelledby="free-section-title"
    >
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10">

        {/* Section Header - Clean, No Badge, High Typography */}
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="free-section-title"
            className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight text-slate-950 title-3d"
          >
            {copy.title || (isEn ? "Experience Full Features, Completely Free" : "Trải Nghiệm Toàn Diện, Hoàn Toàn Miễn Phí")}
          </h2>

          <p className="mt-3.5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {copy.subtitle ||
              (isEn
                ? "Start managing personal and group finances today with zero upfront cost. Everything from expense tracking, AI receipt scanning to VietQR group funds is ready for you."
                : "Bắt đầu quản lý tài chính cá nhân và nhóm ngay hôm nay mà không có rào cản chi phí ban đầu. Đầy đủ công cụ từ ghi chép, bóc tách hóa đơn AI đến chia tiền VietQR sẵn sàng phục vụ bạn.")}
          </p>
        </div>

        {/* 3 Value Pillars - Sharp Corners (rounded-none), Natural Icons, Lift on Hover */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {VALUE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative rounded-none border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-5 h-5 shrink-0 ${pillar.iconColor}`} strokeWidth={2.2} />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Value Estimator Panel - Sharp, Minimalist & Cohesive */}
        <div className="mt-8 sm:mt-10 rounded-none border border-slate-200/90 bg-slate-50/70 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Slider Column */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                {isEn ? "Value Estimator" : "Ước tính giá trị bạn nhận được"}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {copy.calcTitle ||
                  (isEn
                    ? "How many transactions & receipts do you log per month?"
                    : "Bạn có khoảng bao nhiêu khoản chi tiêu & hóa đơn mỗi tháng?")}
              </h3>

              <div className="pt-2 space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-600">
                    {isEn ? "Transactions / month:" : "Số lượng giao dịch / tháng:"}
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {monthlyTx} {isEn ? "items" : "khoản"}
                  </span>
                </div>

                <input
                  type="range"
                  min="20"
                  max="300"
                  step="10"
                  value={monthlyTx}
                  onChange={(e) => setMonthlyTx(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>20 {isEn ? "transactions" : "giao dịch"}</span>
                  <span>150 {isEn ? "transactions" : "giao dịch"}</span>
                  <span>300+ {isEn ? "transactions" : "giao dịch"}</span>
                </div>
              </div>
            </div>

            {/* Result Box */}
            <div className="lg:col-span-5 rounded-none bg-white p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-3.5 text-left">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {copy.savingsTitle || (isEn ? "Estimated Annual Savings" : "Tiết kiệm ước tính mỗi năm")}
                </span>
                <p className="text-3xl sm:text-4xl lg:text-[2.5rem] font-black tracking-tight text-emerald-600 my-1 font-sans leading-tight">
                  {annualSavings.toLocaleString("vi-VN")} đ
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isEn
                    ? `Compared to paid budgeting subscriptions (~${annualSavings.toLocaleString()}₫/yr)`
                    : `So với chi phí dùng các app thu phí khác trên thị trường (~${annualSavings.toLocaleString("vi-VN")} đ/năm)`}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{isEn ? "Time saved annually:" : "Tiết kiệm thời gian ghi chép:"}</span>
                </span>
                <strong className="text-slate-900 font-bold">~{hoursSavedAnnual} {isEn ? "hours" : "giờ"} / {isEn ? "yr" : "năm"}</strong>
              </div>

              <button
                type="button"
                onClick={onOpenQr}
                className="w-full inline-flex items-center justify-center gap-2 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>{copy.getAccountBtn || (isEn ? "Get Free App Now" : "Tải Ứng Dụng Miễn Phí")}</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
