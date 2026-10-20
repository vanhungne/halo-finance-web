import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  QrCode,
  Check,
  Star,
  Users,
  Receipt,
  Wallet,
  PieChart,
  HandCoins,
  ShieldCheck,
  TrendingUp,
  ArrowDownLeft,
  Sparkles,
  Smartphone,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  Laptop,
  Building2,
  Lock,
  CheckCircle2,
} from "lucide-react";
import images from "../../assets/image";
import StoreButtons from "./StoreButtons";

export default function EpicHero({ onOpenQr }) {
  const reduceMotion = useReducedMotion();
  const [showBalance, setShowBalance] = useState(true);

  return (
    <section
      id="home"
      className="relative min-h-[820px] lg:min-h-[920px] overflow-hidden bg-gradient-to-b from-[#f0f6ff] via-[#f8fbff] to-white text-slate-900 pt-28 sm:pt-32 lg:pt-36 pb-20 sm:pb-24"
    >
      {/* 1. Ambient Glow Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[600px] w-[1100px] rounded-full bg-gradient-to-b from-blue-200/40 via-sky-100/30 to-transparent blur-[140px]" />
        <div className="absolute top-10 right-0 h-[450px] w-[450px] rounded-full bg-amber-100/35 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#0068ff0d_1px,transparent_1px)] [background-size:28px_28px] opacity-75" />
      </div>

      {/* 2. Main Hero Content Container */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* ======================================================================= */}
        {/* LEFT COLUMN: INSTITUTIONAL BANKING COPY & HIGH-IMPACT ACTIONS           */}
        {/* ======================================================================= */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Institutional Banking Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/80 bg-blue-50/95 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-blue-800 shadow-xs backdrop-blur-md">
            <Building2 className="h-4 w-4 text-blue-600" />
            <span>Định Chế Tài Chính Số & Quản Trị Dòng Tiền Thế Hệ Mới</span>
          </div>

          {/* Headline - Institutional Scale */}
          <h1 className="text-3xl sm:text-5xl lg:text-[4rem] font-black leading-[1.1] tracking-[-0.035em] text-slate-900">
            <span className="block text-slate-900">Làm Chủ Dòng Tiền.</span>
            <span className="block mt-1 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
              Ngân Hàng Số Cùng AI.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Hệ sinh thái tài chính số đa phương thức <strong className="text-slate-900 font-semibold">(Web Internet Banking & Mobile App)</strong> kết nối trực tiếp <strong className="text-blue-700 font-semibold">54+ ngân hàng chuẩn NAPAS 24/7</strong>. Tự động bóc tách hóa đơn trong 3 giây bằng AI Gemini, chia tiền nhóm VietQR 1 chạm, và bảo vệ tài sản theo chuẩn an ninh <strong className="text-slate-900 font-semibold">PCI-DSS & ISO 27001</strong>.
          </p>

          {/* Action CTAs Suite */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            {/* Primary Open eKYC Account Button */}
            <button
              type="button"
              onClick={onOpenQr}
              className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-500/25 transition hover:opacity-95 hover:-translate-y-0.5"
            >
              <Building2 className="h-5 w-5 text-blue-200" />
              <span>Mở Tài Khoản eKYC (0đ Phí)</span>
            </button>

            {/* Direct Web Internet Banking Portal */}
            <a
              href="/app"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/40 shadow-xs"
            >
              <Laptop className="h-4 w-4 text-blue-600" />
              <span>Cổng Web Internet Banking</span>
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </a>

            {/* Mobile Store Buttons */}
            <StoreButtons buttonClassName="bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-all" onOpenQr={onOpenQr} />
          </div>

          {/* Institutional Trust Guarantees */}
          <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-slate-700">
            <span className="inline-flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              Liên kết 54+ ngân hàng NAPAS 24/7
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-blue-100 text-blue-700">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              Chuẩn an ninh số PCI-DSS & ISO 27001
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-indigo-100 text-indigo-700">
                <ShieldCheck className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              Tuân thủ Nghị định 13/2023/NĐ-CP
            </span>
          </div>

          {/* Social Proof Strip with Ratings */}
          <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-4">
            <div className="flex -space-x-2 overflow-hidden">
              <img
                className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                src={images.avatar}
                alt="Khách hàng Halo Finance"
              />
              <div className="inline-grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-white text-xs font-black ring-2 ring-white">
                3.2M
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="font-extrabold text-slate-900 text-xs ml-1">4.8 / 5.0</span>
                <span className="text-[0.72rem] text-slate-500 font-medium">(42.500+ đánh giá xác thực)</span>
              </div>
              <p className="text-slate-600 text-xs mt-0.5 font-medium">
                Được tin dùng bởi hơn <strong className="text-blue-700 font-bold">+3.2 triệu cá nhân</strong> và hộ kinh doanh trên toàn quốc
              </p>
            </div>
          </div>
        </motion.div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: GRAND DUAL-PLATFORM ENTERPRISE SHOWCASE                   */}
        {/* ======================================================================= */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative flex flex-col items-center justify-center py-4"
        >
          {/* Ambient Lighting Behind Devices */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[95%] w-[95%] rounded-full bg-gradient-to-tr from-blue-300/35 via-sky-200/30 to-amber-100/30 blur-3xl pointer-events-none" />

          {/* Desktop Web Portal Background Canvas (Layer 1) */}
          <div className="hidden sm:block absolute -left-8 -top-6 w-[420px] lg:w-[480px] rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xl shadow-slate-900/10 opacity-90 backdrop-blur-md pointer-events-none">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-slate-400">portal.halofinance.vn</span>
              </div>
              <span className="font-bold text-blue-600">Internet Banking Web</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                <span className="text-slate-500 block text-[8px] font-bold uppercase">Tổng tài sản ròng</span>
                <span className="font-black text-blue-700 text-xs">1.845.200.000 đ</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                <span className="text-slate-500 block text-[8px] font-bold uppercase">Thu tháng 10</span>
                <span className="font-black text-emerald-700 text-xs">+92.500.000 đ</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[8px] font-bold uppercase">54+ Ngân hàng</span>
                <span className="font-black text-slate-800 text-xs">NAPAS 24/7 OK</span>
              </div>
            </div>
          </div>

          {/* Mobile iPhone 16 Pro Foreground Screen (Layer 2) */}
          <div className="relative z-10 w-[310px] sm:w-[340px] aspect-[9/18.6] rounded-[3.25rem] border-[9px] border-slate-900 bg-slate-950 p-2.5 shadow-[0_30px_70px_-15px_rgba(0,55,160,0.22),0_15px_30px_rgba(0,0,0,0.15)] sm:ml-16">
            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-3 -translate-x-1/2 h-5 w-24 rounded-full bg-slate-950 z-30 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-800 mr-2" />
              <div className="h-1 w-6 rounded-full bg-slate-800" />
            </div>

            {/* Screen Inner Container */}
            <div className="relative h-full w-full rounded-[2.5rem] bg-[#f8faff] overflow-hidden text-slate-900 flex flex-col pt-7 pb-3 px-3.5 space-y-3 font-sans text-xs">
              
              {/* App Topbar */}
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">
                    H
                  </div>
                  <div>
                    <span className="text-[0.6rem] text-slate-500 block leading-tight font-medium">Tài Khoản Thanh Toán Số Đẹp</span>
                    <span className="font-extrabold text-slate-900 text-[0.72rem]">Halo Private Banking</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-blue-600 transition"
                  title="Ẩn/Hiện số dư"
                >
                  {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Master Balance Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-md shadow-blue-500/20 space-y-2">
                <div className="flex justify-between items-center text-[0.62rem] text-blue-100 font-bold uppercase tracking-wider">
                  <span>Số Dư Khả Dụng Tổng Hợp</span>
                  <Wallet className="w-4 h-4 text-blue-200" />
                </div>
                <p className="text-xl font-black tracking-tight font-sans">
                  {showBalance ? "268.450.000 đ" : "•••••••• đ"}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20 text-[0.62rem]">
                  <div>
                    <span className="text-blue-200 block text-[0.55rem]">Thu nhập tháng:</span>
                    <span className="font-bold text-emerald-300">+38.500.000 đ</span>
                  </div>
                  <div className="text-right">
                    <span className="text-blue-200 block text-[0.55rem]">Chi tiêu:</span>
                    <span className="font-bold text-rose-200">-14.280.000 đ</span>
                  </div>
                </div>
              </div>

              {/* 4 Feature Shortcuts */}
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <div className="p-1.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-1">
                  <div className="grid h-6 w-6 place-items-center rounded-lg bg-blue-50 text-blue-600 mx-auto">
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-[0.58rem] font-bold text-slate-700 block leading-tight">Chuyển tiền</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-1">
                  <div className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-50 text-emerald-600 mx-auto">
                    <PieChart className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[0.58rem] font-bold text-slate-700 block leading-tight">Báo cáo</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-1">
                  <div className="grid h-6 w-6 place-items-center rounded-lg bg-amber-50 text-amber-600 mx-auto">
                    <HandCoins className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[0.58rem] font-bold text-slate-700 block leading-tight">Vay & Nợ</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-1">
                  <div className="grid h-6 w-6 place-items-center rounded-lg bg-violet-50 text-violet-600 mx-auto">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[0.58rem] font-bold text-slate-700 block leading-tight">Quỹ nhóm</span>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-1.5 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="text-[0.62rem] font-extrabold text-slate-600 uppercase tracking-wider">
                    Giao dịch liên ngân hàng NAPAS
                  </span>
                  <span className="text-[0.58rem] font-bold text-blue-600">Xem tất cả</span>
                </div>

                <div className="space-y-1.5">
                  <div className="p-2 rounded-xl bg-white border border-slate-200/70 flex justify-between items-center shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="font-bold text-slate-800 text-[0.65rem]">Lương chuyển khoản VCB</p>
                        <p className="text-[0.55rem] text-slate-500">16/10 • Thu nhập chính</p>
                      </div>
                    </div>
                    <span className="font-black text-emerald-600 text-[0.7rem]">+38.500.000 đ</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200/70 flex justify-between items-center shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-lg bg-rose-50 text-rose-600">
                        <Receipt className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="font-bold text-slate-800 text-[0.65rem]">Siêu thị WinMart+ (AI Scan)</p>
                        <p className="text-[0.55rem] text-slate-500">16/10 • Bóc tách tự động</p>
                      </div>
                    </div>
                    <span className="font-black text-rose-600 text-[0.7rem]">-348.000 đ</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Floating Trust Cards */}
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 sm:-left-12 top-[12%] hidden sm:flex items-center gap-2.5 p-3 rounded-2xl border border-blue-200 bg-white/95 text-slate-900 shadow-xl backdrop-blur-md z-30 max-w-[230px]"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase text-blue-700">eKYC AI Gemini</p>
              <p className="text-xs font-black text-slate-900">Xác thực FaceID 60s</p>
            </div>
          </motion.div>

          <motion.div
            animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute -right-4 sm:-right-8 bottom-[14%] hidden sm:flex items-center gap-2.5 p-3 rounded-2xl border border-emerald-200 bg-white/95 text-slate-900 shadow-xl backdrop-blur-md z-30 max-w-[240px]"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase text-emerald-700">PCI-DSS Level 1</p>
              <p className="text-xs font-black text-slate-900">Bảo Mật Chuẩn Ngân Hàng</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
