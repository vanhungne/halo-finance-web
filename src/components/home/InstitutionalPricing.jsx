import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building2,
  Zap,
  Star,
  Users2,
  FileCheck2,
  HelpCircle,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function InstitutionalPricing({ onOpenQr }) {
  const [billingCycle, setBillingCycle] = useState("annual"); // "monthly" | "annual"

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.65 },
        colors: ["#2563eb", "#0284c7", "#f59e0b", "#10b981"],
      });
    } catch (e) {
      // fallback
    }
  };

  const handleSelectPlan = () => {
    triggerConfetti();
    if (onOpenQr) onOpenQr();
  };

  return (
    <section id="pricing" className="relative overflow-hidden bg-slate-50 py-24 sm:py-32 text-slate-900 border-t border-slate-200/80">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-blue-100/50 blur-[130px]" />
        <div className="absolute bottom-0 right-10 h-[350px] w-[350px] rounded-full bg-amber-100/40 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-blue-700 shadow-2xs">
            <Award className="h-4 w-4 text-blue-600" />
            <span>Minh Bạch Tuyệt Đối • 0đ Phí Ẩn</span>
          </div>

          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl text-slate-900">
            Gói dịch vụ định chế.{" "}
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Linh hoạt cho mọi quy mô.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
            Từ tài khoản cá nhân thông minh không phí trọn đời đến đặc quyền kim loại VIP và giải pháp thanh toán tự động cho doanh nghiệp.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-5 py-2 text-xs font-black transition-all ${
                billingCycle === "monthly"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Thanh toán hàng tháng
            </button>
            <button
              type="button"
              onClick={() => {
                setBillingCycle("annual");
                triggerConfetti();
              }}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-black transition-all ${
                billingCycle === "annual"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Thanh toán năm</span>
              <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-slate-950 uppercase">
                Tiết kiệm 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Tier Cards Grid */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3 items-stretch">
          
          {/* TIER 1: HALO STANDARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between rounded-[2.25rem] border border-slate-200/90 bg-white p-8 shadow-md shadow-slate-100 hover:shadow-xl transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-700">
                  Cá Nhân & Gia Đình
                </span>
                <span className="text-xs font-extrabold text-slate-400">eKYC 60 Giây</span>
              </div>

              <h3 className="mt-6 text-2xl font-black text-slate-900">Halo Standard</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Tài khoản thanh toán số đẹp và quản trị dòng tiền thông minh, hoàn toàn không mất phí duy trì.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tight text-slate-900">0đ</span>
                <span className="text-xs font-bold text-slate-400">/ Trọn đời</span>
              </div>

              <div className="my-7 h-px bg-slate-100" />

              <ul className="space-y-3.5 text-xs font-semibold text-slate-700">
                {[
                  "Mở số tài khoản đẹp phong thủy miễn phí",
                  "Miễn 100% phí chuyển khoản NAPAS 24/7",
                  "Thẻ ảo Virtual Contactless kích hoạt ngay",
                  "Bóc tách hóa đơn AI Gemini OCR (50 bill/tháng)",
                  "Phân chia bill ăn uống VietQR 1 chạm",
                  "Báo cáo dòng tiền & quản lý 5 ví ngân sách",
                  "Bảo mật sinh trắc học CCCD gắn chip (QĐ 2345)",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={handleSelectPlan}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white py-4 text-xs font-black text-slate-800 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
            >
              <span>Mở Tài Khoản Miễn Phí</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          {/* TIER 2: HALO TITANIUM VIP (FEATURED / MOST POPULAR) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative flex flex-col justify-between rounded-[2.25rem] border-2 border-blue-600 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 p-8 text-white shadow-2xl shadow-blue-500/20 lg:-translate-y-3"
          >
            {/* Top Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-md">
              ★ ĐƯỢC CHỌN NHIỀU NHẤT
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-sky-300 border border-blue-400/30">
                  Priority & Đầu Tư
                </span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Thẻ Kim Loại Metal
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-black text-white">Halo Titanium VIP</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Đặc quyền định chế VIP, thẻ kim loại nguyên khối, hoàn tiền 3.5% và chuyên viên tài chính phục vụ riêng 24/7.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tight text-white">
                  {billingCycle === "annual" ? "79.000đ" : "99.000đ"}
                </span>
                <span className="text-xs font-bold text-slate-400">/ tháng</span>
              </div>
              <p className="text-[11px] text-amber-300 font-bold mt-1">
                * Miễn phí hoàn toàn khi duy trì số dư bình quân &gt; 20 triệu đ
              </p>

              <div className="my-7 h-px bg-white/15" />

              <ul className="space-y-3.5 text-xs font-semibold text-slate-200">
                {[
                  "Bao gồm toàn bộ tính năng của gói Standard",
                  "Thẻ vật lý Kim Loại Titanium khắc laser nguyên khối",
                  "Hoàn tiền 3.5% mọi chi tiêu (ẩm thực, mua sắm, du lịch)",
                  "Quét hóa đơn AI Gemini 2.0 OCR KHÔNG GIỚI HẠN",
                  "Sinh lời tích lũy qua đêm lãi suất 6.2%/năm",
                  "Đặc quyền Phòng chờ Sân bay Quốc tế DragonPass VIP",
                  "Hạn mức tín dụng thấu chi phê duyệt tự động đến 500 triệu đ",
                  "Chuyên viên Priority Banker chăm sóc riêng 24/7",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={handleSelectPlan}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 py-4 text-xs font-black text-slate-950 shadow-lg shadow-amber-400/20 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              <span>Nâng Cấp Thẻ Titanium VIP</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          {/* TIER 3: HALO ENTERPRISE / BUSINESS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-between rounded-[2.25rem] border border-slate-200/90 bg-white p-8 shadow-md shadow-slate-100 hover:shadow-xl transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-700">
                  Doanh Nghiệp & Hộ KD
                </span>
                <span className="text-xs font-extrabold text-blue-600">SLA 99.999%</span>
              </div>

              <h3 className="mt-6 text-2xl font-black text-slate-900">Halo Business Core</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Giải pháp tài chính số toàn diện cho công ty SME, hộ kinh doanh và nền tảng thương mại điện tử.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tight text-slate-900">
                  {billingCycle === "annual" ? "239.000đ" : "299.000đ"}
                </span>
                <span className="text-xs font-bold text-slate-400">/ tháng</span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold mt-1">
                * Có xuất hóa đơn GTGT (VAT) điện tử hợp lệ khấu trừ thuế
              </p>

              <div className="my-7 h-px bg-slate-100" />

              <ul className="space-y-3.5 text-xs font-semibold text-slate-700">
                {[
                  "Tài khoản định danh pháp nhân doanh nghiệp",
                  "Cổng thanh toán VietQR Pro & SePay Webhooks mili-giây",
                  "Tự động gạch nợ đơn hàng & đối soát tự động 24/7",
                  "Tích hợp phần mềm kế toán MISA, Fast, SAP qua API",
                  "Quản trị dòng tiền đa tài khoản & chữ ký kép (Maker-Checker)",
                  "Hóa đơn điện tử tự động kết nối Tổng cục Thuế",
                  "Hạn mức chuyển khoản không giới hạn, hỗ trợ chi lương",
                  "Cam kết thỏa thuận SLA 99.999% có hợp đồng kinh tế",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={handleSelectPlan}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-slate-900 py-4 text-xs font-black text-white transition hover:bg-blue-600"
            >
              <span>Đăng Ký Doanh Nghiệp</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

        </div>

        {/* Enterprise Security Guarantee Footer */}
        <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-blue-600 shrink-0" />
            <div>
              <p className="font-black text-slate-900">Bảo hiểm tiền gửi & Cam kết không phát sinh phụ phí</p>
              <p className="text-slate-500">Mọi tài khoản đều được bảo hiểm theo quy định của Ngân hàng Nhà nước Việt Nam.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-bold">
            <span className="flex items-center gap-1.5"><FileCheck2 className="w-4 h-4 text-emerald-600" /> Hợp đồng điện tử</span>
            <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-blue-600" /> Hỗ trợ mọi thẻ ngân hàng</span>
          </div>
        </div>

      </div>
    </section>
  );
}
