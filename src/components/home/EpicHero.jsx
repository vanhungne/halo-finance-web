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
  Calendar,
  Sparkles,
  Smartphone,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";
import images from "../../assets/image";
import StoreButtons from "./StoreButtons";

export default function EpicHero({ onOpenQr }) {
  const reduceMotion = useReducedMotion();
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // MISA-style quick navigation tabs on phone
  const screenModes = [
    { id: 0, label: "Sổ Thu Chi", subtitle: "Thu chi hàng ngày" },
    { id: 1, label: "Báo Cáo Phân Tích", subtitle: "Biểu đồ trực quan" },
    { id: 2, label: "Quỹ Gia Đình", subtitle: "Chia sẻ minh bạch" },
  ];

  return (
    <section
      id="home"
      className="relative min-h-[780px] lg:min-h-[880px] overflow-hidden bg-gradient-to-b from-[#f0f6ff] via-[#f8fbff] to-white text-slate-900 pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20"
    >
      {/* 1. MISA Clean Ambient Glow Elements (Soft Blue, Warm Gold, Subtle Grid) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft sky-blue radial glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[550px] w-[950px] rounded-full bg-gradient-to-b from-blue-200/40 via-sky-100/30 to-transparent blur-[120px]" />
        {/* Top-right warm amber accent */}
        <div className="absolute top-10 right-0 h-[400px] w-[400px] rounded-full bg-amber-100/35 blur-[100px]" />
        {/* Subtle friendly background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#0068ff0d_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      {/* 2. Main Hero Content Container */}
      <div className="relative z-10 mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* ======================================================================= */}
        {/* LEFT COLUMN: MISA-STYLE AUTHENTIC COPY & HIGH-CONVERSION CTA SUITE       */}
        {/* ======================================================================= */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Top Laurel / Trust Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/90 px-3.5 py-1.5 text-xs font-bold text-blue-700 shadow-xs backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Nền tảng Quản lý Tài chính & Chia tiền Nhóm #1 Việt Nam</span>
          </div>

          {/* Headline - High-Impact Modern Typography */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.85rem] font-black leading-[1.1] tracking-[-0.035em] text-slate-900">
            <span className="block text-slate-900">Làm Chủ Dòng Tiền.</span>
            <span className="block mt-1 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
              Quản Trị Thông Minh Cùng AI.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Không còn mệt mỏi với những cuốn sổ tay hay bảng tính rườm rà. <strong className="text-slate-900 font-semibold">Halo Finance</strong> tự động hóa bóc tách hóa đơn trong 3 giây, chia tiền nhóm du lịch ăn uống VietQR 1 chạm, và đồng bộ biến động tài khoản ngân hàng an toàn tuyệt đối.
          </p>


          {/* Action CTAs Suite */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            {/* Primary App Store & Google Play Store Buttons */}
            <StoreButtons buttonClassName="bg-slate-900 text-white hover:bg-blue-700 shadow-md transition-all duration-200" onOpenQr={onOpenQr} />


            {/* QR Download Button */}
            <button
              type="button"
              onClick={onOpenQr}
              className="inline-flex min-h-16 items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-xs transition hover:-translate-y-0.5 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/40"
            >
              <QrCode className="h-5 w-5 text-blue-600" />
              <span>Quét mã QR tải app</span>
            </button>

            {/* Web Banking Direct Portal */}
            <a
              href="/app"
              className="inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-extrabold text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white hover:border-transparent shadow-xs"
            >
              <span>Dùng thử trên Web</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              Hoàn toàn miễn phí trọn đời
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-blue-100 text-blue-600">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              Ghi chép thu chi chỉ với 1 chạm
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-indigo-100 text-indigo-600">
                <ShieldCheck className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              Bảo mật tiêu chuẩn quốc tế ISO 27001
            </span>
          </div>

          {/* Social Proof Strip with Avatars & Ratings (MISA 2.5M message) */}
          <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-4">
            <div className="flex -space-x-2 overflow-hidden">
              <img
                className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                src={images.avatar}
                alt="Người dùng Halo Finance"
              />
              <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 ring-2 ring-white text-white font-bold text-xs">
                TH
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 ring-2 ring-white text-white font-bold text-xs">
                LP
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-500 ring-2 ring-white text-white font-bold text-xs">
                MD
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="font-extrabold text-slate-900 text-xs ml-1">4.8 / 5.0</span>
                <span className="text-[0.72rem] text-slate-500 font-medium">(37.500+ đánh giá)</span>
              </div>
              <p className="text-slate-600 text-xs mt-0.5 font-medium">
                Tham gia ngay cùng hơn <strong className="text-blue-700 font-bold">+2.5 triệu người dùng</strong> và gia đình Việt
              </p>
            </div>
          </div>
        </motion.div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: REALISTIC MISA-STYLE SMARTPHONE & APP SCREENS              */}
        {/* ======================================================================= */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative flex flex-col items-center justify-center py-4"
        >
          {/* Soft Friendly Shadow Orb behind phone */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[90%] w-[90%] rounded-full bg-gradient-to-tr from-blue-300/35 via-sky-200/30 to-amber-100/30 blur-3xl pointer-events-none" />

          {/* Clean Phone Chassis */}
          <div className="relative z-10 w-[315px] sm:w-[345px] aspect-[9/18.6] rounded-[3.25rem] border-[9px] border-slate-900 bg-slate-950 p-2.5 shadow-[0_30px_70px_-15px_rgba(0,55,160,0.18),0_15px_30px_rgba(0,0,0,0.1)]">
            {/* Dynamic Island / Speaker */}
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
                    <span className="text-[0.6rem] text-slate-500 block leading-tight font-medium">Sổ Thu Chi Gia Đình</span>
                    <span className="font-extrabold text-slate-900 text-[0.72rem]">Tháng 10 / 2026</span>
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

              {/* Master Balance Card (MISA Blue Signature Card) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20 space-y-2">
                <div className="flex justify-between items-center text-[0.62rem] text-blue-100 font-bold uppercase tracking-wider">
                  <span>Tổng Số Dư Khả Dụng</span>
                  <Wallet className="w-4 h-4 text-blue-200" />
                </div>
                <p className="text-xl font-black tracking-tight font-sans">
                  {showBalance ? "268.450.000 đ" : "•••••••• đ"}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20 text-[0.62rem]">
                  <div>
                    <span className="text-blue-200 block text-[0.55rem]">Tổng thu:</span>
                    <span className="font-bold text-emerald-300">+38.500.000 đ</span>
                  </div>
                  <div className="text-right">
                    <span className="text-blue-200 block text-[0.55rem]">Tổng chi:</span>
                    <span className="font-bold text-rose-200">-14.280.000 đ</span>
                  </div>
                </div>
              </div>

              {/* 4 Feature Shortcut Badges (MISA Style) */}
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <div className="p-1.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-1">
                  <div className="grid h-6 w-6 place-items-center rounded-lg bg-blue-50 text-blue-600 mx-auto">
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-[0.58rem] font-bold text-slate-700 block leading-tight">Ghi chép</span>
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
                  <span className="text-[0.58rem] font-bold text-slate-700 block leading-tight">Vay nợ</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs space-y-1">
                  <div className="grid h-6 w-6 place-items-center rounded-lg bg-violet-50 text-violet-600 mx-auto">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[0.58rem] font-bold text-slate-700 block leading-tight">Quỹ nhóm</span>
                </div>
              </div>

              {/* Recent Real Life Expense Records */}
              <div className="space-y-1.5 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="text-[0.62rem] font-extrabold text-slate-600 uppercase tracking-wider">
                    Giao dịch gần đây
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
                        <p className="font-bold text-slate-800 text-[0.65rem]">Siêu thị WinMart+</p>
                        <p className="text-[0.55rem] text-slate-500">16/10 • Đi chợ, thực phẩm</p>
                      </div>
                    </div>
                    <span className="font-black text-rose-600 text-[0.7rem]">-348.000 đ</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200/70 flex justify-between items-center shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-lg bg-amber-50 text-amber-600">
                        <CoffeeIcon />
                      </span>
                      <div>
                        <p className="font-bold text-slate-800 text-[0.65rem]">Highlands Coffee</p>
                        <p className="text-[0.55rem] text-slate-500">15/10 • Gặp bạn bè</p>
                      </div>
                    </div>
                    <span className="font-black text-rose-600 text-[0.7rem]">-85.000 đ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 3 CLEAN MISA-STYLE FLOATING WHITE CARDS WITH NATURAL SHADOW           */}
          {/* ===================================================================== */}

          {/* Floating Card 1 (Top Left): Hạn mức chi tiêu tháng */}
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-4 sm:-left-10 top-[14%] hidden sm:flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200/80 bg-white/95 text-slate-900 shadow-[0_12px_30px_rgba(0,55,160,0.12)] backdrop-blur-md z-20 max-w-[240px]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <PieChart className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[0.62rem] font-bold text-slate-500 uppercase">Hạn mức chi tiêu tháng</p>
              <p className="text-xs font-black text-slate-900 mt-0.5">Còn 16.500.000 đ</p>
              <div className="mt-1 h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[45%]" />
              </div>
            </div>
          </motion.div>

          {/* Floating Card 2 (Bottom Right): Quét hóa đơn AI */}
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute -right-4 sm:-right-8 bottom-[18%] hidden sm:flex items-center gap-3 p-3.5 rounded-2xl border border-blue-200/80 bg-white/95 text-slate-900 shadow-[0_15px_35px_rgba(0,55,160,0.12)] backdrop-blur-md z-20 max-w-[250px]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Receipt className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[0.62rem] font-bold text-blue-600 uppercase">Quét Hóa Đơn AI</span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              </div>
              <p className="text-xs font-black text-slate-900 mt-0.5">WinMart+ • 348.000 đ</p>
              <p className="text-[0.58rem] text-slate-500">Tự động điền danh mục F&B</p>
            </div>
          </motion.div>

          {/* Floating Card 3 (Bottom Left): Quỹ nhóm & gia đình */}
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute -left-2 sm:-left-6 bottom-[6%] hidden sm:block p-3 rounded-2xl border border-slate-200/80 bg-white/95 text-slate-900 shadow-[0_12px_30px_rgba(0,55,160,0.12)] backdrop-blur-md z-20"
          >
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-violet-600" />
              <span className="text-[0.62rem] font-extrabold uppercase text-slate-700">
                Sổ Quỹ Gia Đình 🏡
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800">45.800.000 đ</p>
            <p className="text-[0.58rem] text-slate-500 mt-0.5">3 thành viên cùng chia sẻ</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function CoffeeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}
