import { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Gift,
  Lock,
  Zap,
  ArrowRight,
  QrCode,
  DollarSign,
  Clock,
  HeartHandshake,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function ZeroFeeCommitment({ onOpenQr }) {
  const { lang, strings } = useLanguage();
  const isEn = lang === "en";

  // Calculator State
  const [monthlyTx, setMonthlyTx] = useState(80);

  // Estimations
  const annualSavings = Math.round((monthlyTx > 50 ? 89000 : 49000) * 12);
  const hoursSavedAnnual = Math.round((monthlyTx * 2 * 12) / 60);

  const COMMITMENT_POINTS = [
    {
      icon: Gift,
      title: isEn ? "100% Free Lifetime" : "100% Miễn Phí Trọn Đời",
      desc: isEn
        ? "All features including AI OCR Receipt Scanning and Group Funds are completely free with zero hidden paywalls."
        : "Toàn bộ tính năng cao cấp từ Bóc tách hóa đơn AI, Quỹ nhóm VietQR đến Báo cáo tài chính đều mở khóa sẵn 0đ trọn đời.",
      badge: isEn ? "Zero Cost" : "0đ Bản Quyền",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      icon: Zap,
      title: isEn ? "Zero Distracting Ads" : "Tuyệt Đối Không Quảng Cáo",
      desc: isEn
        ? "Clean, elegant and distraction-free user experience. No popups, no banners, and no video interruptions."
        : "Giao diện sạch sẽ, tinh tế. Nói KHÔNG với banner quảng cáo che khuất màn hình hay video bắt xem phiền phức.",
      badge: isEn ? "Ad-Free" : "0đ Quảng Cáo",
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      icon: Lock,
      title: isEn ? "Zero Data Selling" : "Cam Kết Không Bán Dữ Liệu",
      desc: isEn
        ? "Your financial data is encrypted end-to-end with AES-256. We never sell or share data with insurance or marketing brokers."
        : "Dữ liệu thu chi được mã hóa đầu cuối với chuẩn AES-256. Cam kết không chia sẻ hay bán thông tin cho đơn vị quảng cáo hay bảo hiểm.",
      badge: isEn ? "100% Privacy" : "Bảo Mật Tuyệt Đối",
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
  ];

  return (
    <section id="free-commitment" className="relative overflow-hidden bg-white py-20 sm:py-28 text-slate-900 border-t border-slate-200/80">
      {/* Background soft ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 h-[400px] w-[600px] rounded-full bg-emerald-100/35 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 shadow-2xs">
            <HeartHandshake className="h-4 w-4 text-emerald-600" />
            <span>{isEn ? "Community Commitment" : "Cam Kết Minh Bạch Vì Cộng Đồng"}</span>
          </div>

          <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-4xl text-slate-900">
            {isEn ? "100% Free For Life. " : "100% Miễn Phí Trọn Đời. "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              {isEn ? "No Paywalls, No Hidden Fees." : "Không Bán Gói, Không Phí Ẩn."}
            </span>
          </h2>

          <p className="mt-3 text-sm text-slate-600 sm:text-base leading-relaxed">
            {isEn
              ? "Democratizing personal finance for everyone in Vietnam. All power tools unlocked at 0₫."
              : "Sứ mệnh của Trợ Lý Tài Chính là bình dân hóa công nghệ tài chính, giúp mọi người Việt làm chủ dòng tiền thông minh mà không phải lo trả phí duy trì hàng tháng."}
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {COMMITMENT_POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="relative rounded-3xl border border-slate-200/90 bg-slate-50/60 p-7 hover:bg-white hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${point.color} shadow-2xs transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200/80 shadow-2xs">
                    {point.badge}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2">
                  {point.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {point.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Interactive Annual Savings Calculator */}
        <div className="mt-12 rounded-[2.5rem] border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-blue-50/60 p-6 sm:p-10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Slider Column */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                {isEn ? "Cost Savings Estimator" : "Ước tính số tiền bạn tiết kiệm được"}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isEn ? "How many transactions & receipts do you log per month?" : "Bạn có khoảng bao nhiêu khoản chi tiêu & hóa đơn mỗi tháng?"}
              </h3>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-600">{isEn ? "Transactions/month:" : "Giao dịch / tháng:"}</span>
                  <span className="text-xl font-black text-blue-600">{monthlyTx} giao dịch</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="10"
                  value={monthlyTx}
                  onChange={(e) => setMonthlyTx(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>20 giao dịch</span>
                  <span>150 giao dịch</span>
                  <span>300+ giao dịch</span>
                </div>
              </div>
            </div>

            {/* Savings Result Card */}
            <div className="lg:col-span-5 rounded-2xl bg-white p-6 shadow-md border border-emerald-200/80 space-y-4 text-center lg:text-left">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {isEn ? "Estimated Annual Savings" : "Tiết kiệm ước tính mỗi năm"}
                </span>
                <p className="text-3xl sm:text-4xl font-black text-emerald-600 mt-1 font-sans">
                  {annualSavings.toLocaleString("vi-VN")} đ
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {isEn ? `Compared to paid subscriptions (~${annualSavings.toLocaleString()}₫/yr)` : `So với việc phải mua gói VIP ở các app thu phí (~${annualSavings.toLocaleString("vi-VN")} đ/năm)`}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Tiết kiệm thời gian ghi chép:</span>
                </span>
                <strong className="text-slate-900">{hoursSavedAnnual} giờ / năm</strong>
              </div>

              <button
                type="button"
                onClick={onOpenQr}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 text-sm shadow-md transition hover:-translate-y-0.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>{isEn ? "Get Free App Now" : "Tải Ứng Dụng Miễn Phí (0đ)"}</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
