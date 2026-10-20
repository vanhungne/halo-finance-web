import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  TrendingUp,
  PiggyBank,
  Landmark,
  Scan,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  QrCode,
  DollarSign,
  Coins,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BankingQuickActionBar({ onOpenQr }) {
  const [activeTab, setActiveTab] = useState("ekyc"); // "ekyc" | "rates" | "savings" | "loan" | "scanner"
  const navigate = useNavigate();

  return (
    <section className="relative z-30 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 -mt-10 sm:-mt-16">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-2xl shadow-slate-300/50">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 sm:pb-4 border-b border-slate-100 no-scrollbar">
          {[
            { id: "ekyc", label: "Mở Tài Khoản eKYC", icon: CreditCard, badge: "0đ Phí" },
            { id: "rates", label: "Tỷ Giá & Vàng SJC", icon: Coins, badge: "Trực tiếp" },
            { id: "savings", label: "Tính Lãi Tiền Gửi", icon: PiggyBank, badge: "6.2%/năm" },
            { id: "loan", label: "Ước Tính Vay Vốn", icon: Landmark, badge: "Dư nợ giảm" },
            { id: "scanner", label: "Quét Hóa Đơn AI", icon: Scan, badge: "Gemini 2.0" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200/70"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Body */}
        <div className="mt-4 sm:mt-6">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: EKYC OPEN ACCOUNT */}
            {activeTab === "ekyc" && (
              <motion.div
                key="ekyc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                <div className="lg:col-span-8 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase">
                      Đặc quyền thế hệ mới
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Xác thực CCCD gắn chip / FaceID trong 60 giây</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Mở Tài Khoản Số Đẹp & Trải Nghiệm Ngân Hàng Không Giới Hạn
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-900">0đ Phí trọn đời</strong>
                        <span className="text-slate-500 text-[11px]">Không phí quản lý tài khoản</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-900">Chọn số tài khoản đẹp</strong>
                        <span className="text-slate-500 text-[11px]">Theo ngày sinh hoặc số điện thoại</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-900">Chuyển tiền 0đ NAPAS</strong>
                        <span className="text-slate-500 text-[11px]">Giao dịch 24/7 đến 54 ngân hàng</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                  <button
                    type="button"
                    onClick={onOpenQr}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm shadow-lg shadow-blue-500/25 hover:opacity-95 transition"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Mở Tài Khoản eKYC Ngay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/app")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 font-bold text-sm hover:bg-slate-100 transition"
                  >
                    <span>Đăng nhập Cổng Web</span>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 2: LIVE RATES & SJC GOLD */}
            {activeTab === "rates" && (
              <motion.div
                key="rates"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-extrabold uppercase text-slate-500">USD (Đô La Mỹ)</span>
                  <div className="mt-2 flex justify-between items-baseline">
                    <span className="text-xl font-black text-slate-900">25.480 đ</span>
                    <span className="text-xs font-bold text-emerald-600">+0.12%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Mua CK: 25.150 • Bán: 25.480</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <span className="text-[11px] font-extrabold uppercase text-amber-800">Vàng Miếng SJC</span>
                  <div className="mt-2 flex justify-between items-baseline">
                    <span className="text-xl font-black text-amber-700">86.50 Tr/L</span>
                    <span className="text-xs font-bold text-emerald-600">+500.000</span>
                  </div>
                  <p className="text-[11px] text-amber-700/80 mt-1">Mua vào: 84.50 • Bán ra: 86.50</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-extrabold uppercase text-slate-500">EUR (Đồng Euro)</span>
                  <div className="mt-2 flex justify-between items-baseline">
                    <span className="text-xl font-black text-slate-900">27.850 đ</span>
                    <span className="text-xs font-bold text-emerald-600">+0.25%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Mua CK: 27.240 • Bán: 27.850</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase text-blue-800">Lãi Suất Tiền Gửi</span>
                    <p className="text-xl font-black text-blue-700 mt-1">đến 6.2% / năm</p>
                  </div>
                  <a href="#rates" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mt-2">
                    Xem toàn bộ biểu tỷ giá <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            )}

            {/* TAB 3: SAVINGS QUICK JUMP */}
            {activeTab === "savings" && (
              <motion.div
                key="savings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200/80"
              >
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-blue-700 tracking-wider">Tiết kiệm sinh lời an toàn</span>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900">
                    Gửi 100 triệu kỳ hạn 12 tháng nhận lãi dự kiến ~5.800.000 đ
                  </h4>
                  <p className="text-xs text-slate-600">
                    Bảo toàn vốn tuyệt đối, lĩnh lãi linh hoạt hàng tháng hoặc cuối kỳ với biểu lãi suất cạnh tranh nhất thị trường.
                  </p>
                </div>
                <a
                  href="#calculators"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 hover:bg-blue-700 transition shrink-0"
                >
                  <span>Mở bảng tính lãi suất đầy đủ</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            )}

            {/* TAB 4: LOAN QUICK JUMP */}
            {activeTab === "loan" && (
              <motion.div
                key="loan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 border border-rose-200/80"
              >
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-rose-700 tracking-wider">Tín dụng & Vay vốn</span>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900">
                    Ước tính lịch trả góp dư nợ giảm dần chuẩn xác từng tháng
                  </h4>
                  <p className="text-xs text-slate-600">
                    Tối ưu kế hoạch vay mua nhà, mua xe hoặc vay tiêu dùng cá nhân mà không lo áp lực tài chính đè nặng.
                  </p>
                </div>
                <a
                  href="#calculators"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/25 hover:bg-rose-700 transition shrink-0"
                >
                  <span>Mở bảng khấu hao nợ vay</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            )}

            {/* TAB 5: SCANNER QUICK JUMP */}
            {activeTab === "scanner" && (
              <motion.div
                key="scanner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 rounded-2xl bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 border border-cyan-200/80"
              >
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-cyan-700 tracking-wider">Độc quyền AI Gemini 2.0</span>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900">
                    Bóc tách hóa đơn ăn uống, siêu thị trong 3 giây & Chia VietQR 1 chạm
                  </h4>
                  <p className="text-xs text-slate-600">
                    Chụp mọi loại bill mờ, nhăn, in nhiệt — AI tự nhận diện từng món ăn, chiết khấu và tính ai nợ ai chính xác 100%.
                  </p>
                </div>
                <a
                  href="#ai-scanner"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-500/25 hover:bg-cyan-700 transition shrink-0"
                >
                  <span>Trải nghiệm bóc tách trực tiếp</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
