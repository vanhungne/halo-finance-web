import React, { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  QrCode,
  Check,
  Star,
  Receipt,
  Wallet,
  PieChart,
  ShieldCheck,
  Smartphone,
  Eye,
  EyeOff,
  Sparkles,
  Users2,
  ScanLine,
  CheckCircle2,
  FileSpreadsheet,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import images from "../../assets/image";
import StoreButtons from "./StoreButtons";
import { useLanguage } from "../../contexts/LanguageContext";

export default function EpicHero({ onOpenQr }) {
  const reduceMotion = useReducedMotion();
  const [showBalance, setShowBalance] = useState(true);
  const [heroMode, setHeroMode] = useState("overview"); // "overview" | "ocr" | "group"
  const { lang, strings } = useLanguage();
  const hero = strings?.hero || {};

  return (
    <section
      id="home"
      className="relative min-h-[780px] lg:min-h-[860px] overflow-hidden bg-gradient-to-b from-[#f0f6ff] via-[#f8fbff] to-white text-slate-900 pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20"
    >
      {/* 1. Ambient Lighting Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[550px] w-[1000px] rounded-full bg-gradient-to-b from-blue-200/35 via-sky-100/25 to-transparent blur-[140px]" />
        <div className="absolute top-10 right-0 h-[400px] w-[400px] rounded-full bg-emerald-100/30 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#0068ff0d_1px,transparent_1px)] [background-size:28px_28px] opacity-75" />
      </div>

      {/* 2. Main Content Container */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* ======================================================================= */}
        {/* LEFT COLUMN: CRISP VALUE PROPOSITION & DIRECT CALL-TO-ACTIONS          */}
        {/* ======================================================================= */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 space-y-6"
        >
          {/* 100% Free Guarantee Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/80 bg-emerald-50 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-900 shadow-2xs backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>{hero.badge || "Cam Kết 100% Miễn Phí Trọn Đời • 0đ Phí Ẩn"}</span>
          </div>

          {/* Headline - Standard H1 for SEO */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.8rem] font-black leading-[1.1] tracking-[-0.035em] text-slate-900">
            <span className="block text-slate-900">{hero.title1 || "Làm Chủ Dòng Tiền."}</span>
            <span className="block mt-1 bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-600 bg-clip-text text-transparent">
              {hero.title2 || "Quản Trị Chi Tiêu Cùng AI."}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {hero.desc || "Ứng dụng quản trị tài chính cá nhân & quỹ nhóm 100% miễn phí trọn đời. Tự động bóc tách hóa đơn trong 3 giây bằng Trí Tuệ Nhân Tạo AI, quản trị ngân sách thông minh và chia tiền nhóm VietQR 1 chạm. Tuyệt đối không quảng cáo, không bán gói."}
          </p>

          {/* Action CTAs Suite */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            {/* Primary Download App Button */}
            <button
              type="button"
              onClick={onOpenQr}
              className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-blue-500/25 transition hover:opacity-95 hover:-translate-y-0.5 cursor-pointer"
            >
              <QrCode className="h-5 w-5 text-blue-200" />
              <span>{hero.ctaEkyc || "Tải Ứng Dụng Ngay (0đ)"}</span>
            </button>

            {/* Mobile Store Buttons */}
            <StoreButtons buttonClassName="bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-all" onOpenQr={onOpenQr} />

            {/* Web Portal Link */}
            <a
              href="/login"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-xs font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-400 hover:text-blue-600 shadow-2xs"
            >
              <span>Dùng Bản Web Portal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Core Trust Guarantees */}
          <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-slate-700">
            <span className="inline-flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              {hero.guarantee1 || "Hỗ trợ 54+ ngân hàng qua VietQR"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-blue-100 text-blue-700">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              {hero.guarantee2 || "Chuẩn mã hóa an toàn AES-256"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-indigo-100 text-indigo-700">
                <ShieldCheck className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              {hero.guarantee3 || "Không bán dữ liệu • Không quảng cáo"}
            </span>
          </div>

          {/* Social Proof Strip with Ratings */}
          <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-4">
            <div className="flex -space-x-2 overflow-hidden">
              <img
                className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                src={images.avatar}
                alt="Người dùng Trợ Lý Tài Chính"
              />
              <div className="inline-grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-white text-xs font-black ring-2 ring-white">
                50K+
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="font-extrabold text-slate-900 text-xs ml-1">4.9 / 5.0</span>
                <span className="text-[0.72rem] text-slate-500 font-medium">(Đánh giá trên App Store & Google Play)</span>
              </div>
              <p className="text-slate-600 text-xs mt-0.5 font-medium">
                Được tin dùng bởi hơn <strong className="text-blue-700 font-bold">+50.000 người dùng</strong> trên toàn quốc
              </p>
            </div>
          </div>
        </motion.div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: INTERACTIVE PHONE MOCKUP SHOWCASING REAL APP MODES        */}
        {/* ======================================================================= */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative flex flex-col items-center justify-center py-2"
        >
          {/* Ambient Lighting Behind Phone */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[95%] w-[95%] rounded-full bg-gradient-to-tr from-blue-300/30 via-sky-200/25 to-emerald-100/25 blur-3xl pointer-events-none" />

          {/* Screen Switcher Tabs */}
          <div className="relative z-30 mb-4 flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 text-white shadow-xl backdrop-blur-xl border border-slate-700/80">
            <button
              type="button"
              onClick={() => setHeroMode("overview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                heroMode === "overview"
                  ? "bg-blue-600 text-white shadow-sm font-black"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Sổ Thu Chi</span>
            </button>
            <button
              type="button"
              onClick={() => setHeroMode("ocr")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                heroMode === "ocr"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <ScanLine className="w-3.5 h-3.5 text-cyan-300" />
              <span>Quét Hóa Đơn AI</span>
            </button>
            <button
              type="button"
              onClick={() => setHeroMode("group")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                heroMode === "group"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Users2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Quỹ Nhóm VietQR</span>
            </button>
          </div>

          {/* iPhone 16 Pro Style Mockup Frame */}
          <div className="relative z-10 w-[300px] sm:w-[330px] aspect-[9/18.5] rounded-[3.25rem] border-[8px] border-slate-900 bg-slate-950 p-2 shadow-[0_30px_70px_-15px_rgba(0,55,160,0.22),0_15px_30px_rgba(0,0,0,0.15)]">
            
            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-3 -translate-x-1/2 h-4.5 w-24 rounded-full bg-slate-950 z-30 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-800 mr-2" />
              <div className="h-1 w-6 rounded-full bg-slate-800" />
            </div>

            {/* Screen Inner Container */}
            <div className="relative h-full w-full rounded-[2.5rem] bg-[#f8faff] overflow-hidden text-slate-900 flex flex-col pt-7 pb-3 px-3.5 space-y-3 font-sans text-xs">
              <AnimatePresence mode="wait">
                
                {/* ========================================================= */}
                {/* TAB 1: SỔ THU CHI & NGÂN SÁCH                              */}
                {/* ========================================================= */}
                {heroMode === "overview" && (
                  <motion.div
                    key="tab-overview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col h-full space-y-3"
                  >
                    {/* App Topbar */}
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                      <div className="flex items-center gap-2">
                        <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">
                          TL
                        </div>
                        <div>
                          <span className="text-[0.6rem] text-slate-500 block leading-tight font-medium">Sổ Thu Chi Cá Nhân</span>
                          <span className="font-extrabold text-slate-900 text-[0.72rem]">Tháng 10/2026</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowBalance(!showBalance)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-blue-600 transition cursor-pointer"
                        title="Ẩn/Hiện số dư"
                      >
                        {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Master Balance Card */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-md shadow-blue-500/20 space-y-2">
                      <div className="flex justify-between items-center text-[0.62rem] text-blue-100 font-bold uppercase tracking-wider">
                        <span>Số Dư Khả Dụng</span>
                        <Wallet className="w-3.5 h-3.5 text-blue-200" />
                      </div>
                      <p className="text-xl font-black tracking-tight font-sans">
                        {showBalance ? "28.450.000 đ" : "•••••••• đ"}
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20 text-[0.62rem]">
                        <div>
                          <span className="text-blue-200 block text-[0.55rem]">Thu nhập:</span>
                          <span className="font-bold text-emerald-300">+35.000.000 đ</span>
                        </div>
                        <div className="text-right">
                          <span className="text-blue-200 block text-[0.55rem]">Đã chi tiêu:</span>
                          <span className="font-bold text-rose-200">-6.550.000 đ</span>
                        </div>
                      </div>
                    </div>

                    {/* Budget Progress Indicator */}
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
                      <div className="flex justify-between text-[0.62rem] font-bold">
                        <span className="text-slate-600">Ngân sách tháng (50/30/20)</span>
                        <span className="text-blue-600">Còn lại 65%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 w-[35%]" />
                      </div>
                    </div>

                    {/* Recent Transactions List */}
                    <div className="space-y-1.5 flex-1 overflow-hidden">
                      <span className="text-[0.62rem] font-extrabold text-slate-500 uppercase tracking-wider block">
                        Giao dịch gần đây
                      </span>

                      <div className="space-y-1.5">
                        <div className="p-2 rounded-xl bg-white border border-slate-200/70 flex justify-between items-center shadow-2xs">
                          <div className="flex items-center gap-2">
                            <span className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                              <ArrowDownLeft className="w-3.5 h-3.5" />
                            </span>
                            <div>
                              <p className="font-bold text-slate-800 text-[0.65rem]">Nhận tiền lương tháng</p>
                              <p className="text-[0.55rem] text-slate-500">Hôm nay • Thu nhập</p>
                            </div>
                          </div>
                          <span className="font-black text-emerald-600 text-[0.7rem]">+35.000.000 đ</span>
                        </div>

                        <div className="p-2 rounded-xl bg-white border border-slate-200/70 flex justify-between items-center shadow-2xs">
                          <div className="flex items-center gap-2">
                            <span className="grid h-6 w-6 place-items-center rounded-lg bg-cyan-50 text-cyan-600">
                              <Receipt className="w-3.5 h-3.5" />
                            </span>
                            <div>
                              <p className="font-bold text-slate-800 text-[0.65rem]">WinMart+ (Quét Bill AI)</p>
                              <p className="text-[0.55rem] text-slate-500">Bóc tách tự động</p>
                            </div>
                          </div>
                          <span className="font-black text-rose-600 text-[0.7rem]">-245.000 đ</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ========================================================= */}
                {/* TAB 2: QUÉT HÓA ĐƠN AI (3 GIÂY)                          */}
                {/* ========================================================= */}
                {heroMode === "ocr" && (
                  <motion.div
                    key="tab-ocr"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col h-full space-y-2.5"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
                      <div className="flex items-center gap-1.5">
                        <ScanLine className="w-4 h-4 text-cyan-600" />
                        <span className="font-black text-[0.72rem] text-slate-900">AI Bóc Tách Hóa Đơn</span>
                      </div>
                      <span className="text-[0.58rem] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                        ⚡ 3 giây
                      </span>
                    </div>

                    {/* Simulated Receipt Preview Card */}
                    <div className="p-3 rounded-2xl bg-white border-2 border-dashed border-cyan-400 shadow-sm space-y-2">
                      <div className="flex justify-between items-center text-[0.6rem] font-bold text-slate-600">
                        <span>Highlands Coffee</span>
                        <span className="text-emerald-600 font-extrabold">Đã quét 100%</span>
                      </div>
                      
                      <div className="divide-y divide-slate-100 text-[0.62rem] text-slate-700 space-y-1">
                        <div className="flex justify-between pt-1">
                          <span>2x Phin Sữa Đá (L)</span>
                          <span className="font-bold">78.000 đ</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span>1x Trà Sen Vàng (M)</span>
                          <span className="font-bold">65.000 đ</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span>1x Bánh mì que thịt</span>
                          <span className="font-bold">25.000 đ</span>
                        </div>
                        <div className="flex justify-between pt-1 text-slate-500 text-[0.55rem]">
                          <span>Thuế VAT (8%)</span>
                          <span>13.440 đ</span>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-slate-200 flex justify-between font-black text-[0.72rem] text-slate-900">
                        <span>Tổng thanh toán:</span>
                        <span className="text-blue-600">168.000 đ</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-200/70 text-[0.62rem] text-cyan-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                      <span>Đã tự động phân loại vào danh mục <strong>Ăn uống / Cà phê</strong></span>
                    </div>
                  </motion.div>
                )}

                {/* ========================================================= */}
                {/* TAB 3: QUỸ NHÓM & CHIA TIỀN VIETQR                        */}
                {/* ========================================================= */}
                {heroMode === "group" && (
                  <motion.div
                    key="tab-group"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col h-full space-y-2.5"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
                      <div className="flex items-center gap-1.5">
                        <Users2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-black text-[0.72rem] text-slate-900">Quỹ Nhóm Du Lịch Đà Lạt</span>
                      </div>
                      <span className="text-[0.58rem] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        4 Thành viên
                      </span>
                    </div>

                    {/* Group Fund Summary */}
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm space-y-1">
                      <span className="text-[0.58rem] text-emerald-100 uppercase tracking-wider font-bold">Tổng chi tiêu chuyến đi</span>
                      <p className="text-lg font-black font-sans">4.800.000 đ</p>
                      <p className="text-[0.58rem] text-emerald-100">Bình quân: 1.200.000 đ / người</p>
                    </div>

                    {/* 1-Tap Split QR Card */}
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between text-[0.62rem]">
                        <span className="font-bold text-slate-700">Mã VietQR Quyết Toán</span>
                        <span className="text-emerald-600 font-extrabold">Gạch nợ 1 chạm</span>
                      </div>
                      <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white border border-slate-200 shadow-2xs">
                          <QrCode className="w-6 h-6 text-slate-800" />
                        </div>
                        <div className="text-[0.6rem] leading-tight">
                          <p className="font-bold text-slate-900">Quét chuyển khoản VietQR</p>
                          <p className="text-slate-500">Tự động điền số tiền & nội dung</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
