import React, { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
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
  CreditCard,
  Wifi,
  ExternalLink,
  Shield,
  FileSpreadsheet,
  Gift,
} from "lucide-react";
import images from "../../assets/image";
import StoreButtons from "./StoreButtons";
import { useLanguage } from "../../contexts/LanguageContext";

export default function EpicHero({ onOpenQr }) {
  const reduceMotion = useReducedMotion();
  const [showBalance, setShowBalance] = useState(true);
  const [heroMode, setHeroMode] = useState("mobile"); // "mobile" | "card" | "web"
  const [cardLocked, setCardLocked] = useState(false);
  const { lang, strings } = useLanguage();
  const hero = strings?.hero || {};

  return (
    <section
      id="home"
      className="relative min-h-[840px] lg:min-h-[940px] overflow-hidden bg-gradient-to-b from-[#f0f6ff] via-[#f8fbff] to-white text-slate-900 pt-28 sm:pt-32 lg:pt-36 pb-20 sm:pb-24"
    >
      {/* 1. Ambient Lighting Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[600px] w-[1100px] rounded-full bg-gradient-to-b from-blue-200/40 via-sky-100/30 to-transparent blur-[140px]" />
        <div className="absolute top-10 right-0 h-[450px] w-[450px] rounded-full bg-amber-100/35 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#0068ff0d_1px,transparent_1px)] [background-size:28px_28px] opacity-75" />
      </div>

      {/* 2. Main Content Container */}
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
          {/* 100% Free Guarantee Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/80 bg-emerald-50/95 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-900 shadow-xs backdrop-blur-md shimmer-badge">
            <Gift className="h-4 w-4 text-emerald-600" />
            <span>{hero.badge || "Cam Kết 100% Miễn Phí Trọn Đời • 0đ Phí Ẩn"}</span>
          </div>

          {/* Headline - Institutional Scale */}
          <h1 className="text-3xl sm:text-5xl lg:text-[4.1rem] font-black leading-[1.08] tracking-[-0.035em] text-slate-900">
            <span className="block text-slate-900">{hero.title1 || "Làm Chủ Dòng Tiền."}</span>
            <span className="block mt-1 bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-600 bg-clip-text text-transparent">
              {hero.title2 || "Quản Trị Tài Chính Cùng AI."}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {hero.desc || "Hệ sinh thái quản trị tài chính cá nhân & quỹ nhóm 100% miễn phí trọn đời kết nối trực tiếp 54+ ngân hàng NAPAS 24/7. Tự động bóc tách hóa đơn trong 3 giây bằng Trí Tuệ Nhân Tạo AI, chia tiền nhóm VietQR 1 chạm, và bảo vệ tài sản chuẩn PCI-DSS & ISO 27001."}
          </p>

          {/* Action CTAs Suite */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            {/* Primary Open eKYC Account Button */}
            <button
              type="button"
              onClick={onOpenQr}
              className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-blue-500/25 transition hover:opacity-95 hover:-translate-y-0.5 cursor-pointer"
            >
              <Building2 className="h-5 w-5 text-blue-200" />
              <span>{hero.ctaEkyc || "Mở Tài Khoản eKYC (0đ Phí)"}</span>
            </button>

            {/* Download App 0d */}
            <button
              type="button"
              onClick={onOpenQr}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/40 shadow-xs cursor-pointer"
            >
              <QrCode className="h-4 w-4 text-emerald-600" />
              <span>{hero.ctaDownload || "Tải App 0đ Trọn Đời"}</span>
            </button>

            {/* Mobile Store Buttons */}
            <StoreButtons buttonClassName="bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-all" onOpenQr={onOpenQr} />
          </div>

          {/* Institutional Trust Guarantees */}
          <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-slate-700">
            <span className="inline-flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              {hero.guarantee1 || "Liên kết 54+ ngân hàng NAPAS 24/7"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-blue-100 text-blue-700">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              {hero.guarantee2 || "Chuẩn an ninh số PCI-DSS & ISO 27001"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-indigo-100 text-indigo-700">
                <ShieldCheck className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              {hero.guarantee3 || "Tuân thủ Nghị định 13/2023/NĐ-CP"}
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
        {/* RIGHT COLUMN: 3-MODE INTERACTIVE DIGITAL BANKING SHOWCASE                */}
        {/* ======================================================================= */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative flex flex-col items-center justify-center py-4"
        >
          {/* Ambient Lighting Behind Devices */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[95%] w-[95%] rounded-full bg-gradient-to-tr from-blue-300/35 via-sky-200/30 to-amber-100/30 blur-3xl pointer-events-none" />

          {/* Interactive Mode Switcher Pills */}
          <div className="relative z-30 mb-5 flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 text-white shadow-xl backdrop-blur-xl border border-slate-700/80">
            <button
              type="button"
              onClick={() => setHeroMode("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                heroMode === "mobile"
                  ? "bg-blue-600 text-white shadow-sm font-black"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>App Mobile 24/7</span>
            </button>
            <button
              type="button"
              onClick={() => setHeroMode("card")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                heroMode === "card"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Thẻ Titanium VIP</span>
            </button>
            <button
              type="button"
              onClick={() => setHeroMode("web")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                heroMode === "web"
                  ? "bg-blue-600 text-white shadow-sm font-black"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Cổng Web Portal</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            
            {/* ------------------------------------------------------------------- */}
            {/* MODE 1: IPHONE 16 PRO MOBILE BANKING APP                            */}
            {/* ------------------------------------------------------------------- */}
            {heroMode === "mobile" && (
              <motion.div
                key="mobile-hero"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.28 }}
                className="relative z-10 w-[310px] sm:w-[340px] aspect-[9/18.6] rounded-[3.25rem] border-[9px] border-slate-900 bg-slate-950 p-2.5 shadow-[0_30px_70px_-15px_rgba(0,55,160,0.22),0_15px_30px_rgba(0,0,0,0.15)]"
              >
                {/* Dynamic Island */}
                <div className="absolute left-1/2 top-3 -translate-x-1/2 h-5 w-24 rounded-full bg-slate-950 z-30 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-800 mr-2" />
                  <div className="h-1 w-6 rounded-full bg-slate-800" />
                </div>

                {/* Screen Inner */}
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
              </motion.div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* MODE 2: 3D LUXURY TITANIUM BLACK METAL CARD                         */}
            {/* ------------------------------------------------------------------- */}
            {heroMode === "card" && (
              <motion.div
                key="card-hero"
                initial={{ opacity: 0, rotateY: -15, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="relative z-10 w-full max-w-[380px] space-y-4"
              >
                {/* 3D Titanium Metal Card */}
                <div className="relative aspect-[1.586/1] w-full rounded-3xl p-6 text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-amber-400/30 overflow-hidden bg-gradient-to-br from-slate-950 via-neutral-900 to-stone-900 flex flex-col justify-between">
                  {/* Subtle Metallic Brushed Texture & Specular Glare */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.18),transparent_60%)] pointer-events-none" />
                  <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

                  {/* Card Header: Brand & Contactless */}
                  <div className="relative z-10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black tracking-[0.2em] uppercase text-amber-400">
                        HALO TITANIUM
                      </span>
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-black">
                        VIP
                      </span>
                    </div>
                    <Wifi className="w-5 h-5 text-amber-200/80 rotate-90" />
                  </div>

                  {/* Gold EMV Chip */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-11 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 border border-yellow-200/80 shadow-inner flex items-center justify-center p-1">
                      <div className="w-full h-full border border-amber-900/30 rounded flex divide-x divide-amber-900/30">
                        <div className="flex-1" />
                        <div className="flex-1" />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 tracking-widest">
                      {cardLocked ? "CARD TEMPORARILY LOCKED" : "ACTIVE • CONTACTLESS"}
                    </span>
                  </div>

                  {/* Card Number & Holder */}
                  <div className="relative z-10 space-y-1">
                    <div className="font-mono text-lg sm:text-xl font-bold tracking-[0.25em] text-slate-100 drop-shadow">
                      •••• •••• •••• 8888
                    </div>
                    <div className="flex justify-between items-end text-[10px] uppercase font-mono tracking-wider text-slate-400 pt-1">
                      <div>
                        <span className="block text-[8px] text-slate-500 font-sans">Chủ thẻ</span>
                        <strong className="text-slate-200 text-xs">NGUYEN VAN HALO</strong>
                      </div>
                      <div>
                        <span className="block text-[8px] text-slate-500 font-sans">Hiệu lực</span>
                        <strong className="text-slate-200">12/29</strong>
                      </div>
                      <span className="font-black italic text-base tracking-tighter text-amber-400">
                        VISA Infinite
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Controls & VIP Privileges */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-lg space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Trạng thái thẻ:</span>
                    <button
                      type="button"
                      onClick={() => setCardLocked(!cardLocked)}
                      className={`px-3 py-1 rounded-full font-black text-[11px] transition ${
                        cardLocked
                          ? "bg-rose-100 text-rose-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {cardLocked ? "🔒 Đang khóa thẻ" : "🟢 Đang hoạt động (Khóa 24/7)"}
                    </button>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Hoàn tiền 1.5% không giới hạn mọi chi tiêu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Phòng chờ thương gia tại 1.200+ sân bay quốc tế</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Bảo hiểm du lịch toàn cầu 10.5 tỷ VNĐ</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* MODE 3: HIGH-FIDELITY WEB INTERNET BANKING PORTAL                   */}
            {/* ------------------------------------------------------------------- */}
            {heroMode === "web" && (
              <motion.div
                key="web-hero"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.28 }}
                className="relative z-10 w-full max-w-[420px] rounded-3xl border border-slate-300/90 bg-white shadow-2xl overflow-hidden"
              >
                {/* Browser Top Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 border-b border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-[10.5px] font-mono text-slate-600 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>portal.halofinance.vn/dashboard</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600">Web Portal</span>
                </div>

                {/* Web Dashboard Content */}
                <div className="p-4 space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white space-y-1">
                    <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">
                      Tổng tài sản ròng (Net Worth)
                    </span>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xl font-black">1.845.200.000 đ</span>
                      <span className="text-[10.5px] font-bold text-emerald-300">+12.4% quý này</span>
                    </div>
                  </div>

                  {/* Multi-bank row */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider block">
                      Tài khoản ngân hàng liên kết trực tiếp (NAPAS 24/7)
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[9px]">VCB</span>
                        <span className="font-bold text-slate-800 text-[11px]">Vietcombank • 9823</span>
                      </div>
                      <span className="font-black text-slate-900 text-xs">142.500.000 đ</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-extrabold text-[9px]">TCB</span>
                        <span className="font-bold text-slate-800 text-[11px]">Techcombank • 1029</span>
                      </div>
                      <span className="font-black text-slate-900 text-xs">85.000.000 đ</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-extrabold text-[9px]">SJC</span>
                        <span className="font-bold text-amber-900 text-[11px]">Vàng SJC • 12 Lượng</span>
                      </div>
                      <span className="font-black text-amber-700 text-xs">1.038.000.000 đ</span>
                    </div>
                  </div>

                  {/* One-click Export Action */}
                  <button
                    type="button"
                    onClick={onOpenQr}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Xuất Báo Cáo Kế Toán Excel / PDF</span>
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

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
              <p className="text-[10px] font-extrabold uppercase text-blue-700">eKYC Sinh Trắc Học AI</p>
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
