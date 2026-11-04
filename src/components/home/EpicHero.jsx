import React from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import {
  Check,
  ShieldCheck,
} from "lucide-react";
import images from "../../assets/image";
import StoreButtons from "./StoreButtons";
import { useLanguage } from "../../contexts/LanguageContext";

export default function EpicHero({ onOpenQr }) {
  const reduceMotion = useReducedMotion();
  const { strings } = useLanguage();
  const hero = strings?.hero || {};

  return (
    <section
      id="home"
      className="landing-hero relative w-full overflow-hidden bg-[#EBF4FE] text-slate-900 flex flex-col justify-center min-h-[calc(100svh-100px)] lg:min-h-[calc(100dvh-104px)] box-border"
    >
      {/* 1. Ambient Lighting Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#0068ff0a_1px,transparent_1px)] [background-size:28px_28px] opacity-60" />
      </div>

      {/* 2. Main Content Container: centered vertically within full viewport */}
      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 items-center my-auto py-2">
        {/* ======================================================================= */}
        {/* LEFT COLUMN: CRISP VALUE PROPOSITION & DIRECT CALL-TO-ACTIONS          */}
        {/* ======================================================================= */}
        <Motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hero-editorial-copy lg:col-span-7 space-y-3.5 lg:space-y-3 xl:space-y-3.5 lg:pl-6 xl:pl-8"
        >
          {/* Editorial headline: High-contrast typography with 3D depth */}
          <h1 className="hero-editorial-title title-3d">
            <span className="hero-editorial-line">
              <span className="hero-title-bold">{hero.titleBold1 || "Quản lý"}</span>{" "}
              <span className="hero-title-muted">{hero.titleMuted1 || "tài chính"}</span>
            </span>
            <span className="hero-editorial-line">
              <span className="hero-title-muted">{hero.titleMuted2 || "nhẹ nhàng hơn,"}</span>
            </span>
            <span className="hero-editorial-line">
              <span className="hero-title-muted">{hero.titleMuted3 || "cùng"}</span>{" "}
              <span className="hero-title-bold">{hero.titleBold2 || "Trợ Lý Tài Chính."}</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-editorial-description text-slate-600">
            {hero.desc || "Ghi chép thu chi, chia tiền nhóm và theo dõi dòng tiền kinh doanh trong một ứng dụng, với AI hỗ trợ nhập liệu."}
          </p>

          {/* Action CTAs Suite */}
          <div className="hero-editorial-actions">
            {/* Mobile Store Buttons */}
            <StoreButtons className="hero-editorial-stores" onOpenQr={onOpenQr} />
          </div>

          {/* Core Trust Guarantees: strictly 1 horizontal row */}
          <div className="landing-hero__trust pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-[13px] font-medium">
            <span className="inline-flex items-center gap-1.5 shrink-0">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              <span>{hero.guarantee1 || "Hỗ trợ 54+ ngân hàng qua VietQR"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 shrink-0">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-blue-100 text-blue-700 shrink-0">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              <span>{hero.guarantee2 || "Chuẩn mã hóa an toàn AES-256"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 shrink-0">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-indigo-100 text-indigo-700 shrink-0">
                <ShieldCheck className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              <span>{hero.guarantee3 || "Tuân thủ Nghị định 13/2023/NĐ-CP"}</span>
            </span>
          </div>


        </Motion.div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: INTERACTIVE PHONE MOCKUP SHOWCASING REAL APP MODES        */}
        {/* ======================================================================= */}
        <Motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative flex items-center justify-center py-0"
        >
          {/* Real Mobile Mockup Image */}
          <div className="relative z-10 w-full flex items-center justify-center">
            <img
              src={images.mockupPersonal}
              alt="Giao diện Trang chủ Quản lý tài chính Trợ Lý Tài Chính"
              className="w-auto h-auto max-h-[380px] sm:max-h-[440px] md:max-h-[480px] lg:max-h-[min(560px,calc(100dvh-170px))] xl:max-h-[min(620px,calc(100dvh-160px))] max-w-[340px] sm:max-w-[400px] md:max-w-[460px] lg:max-w-[500px] xl:max-w-[560px] object-contain block drop-shadow-[0_20px_50px_rgba(15,23,42,0.18)] transition-transform duration-300 hover:scale-[1.02]"
              loading="eager"
            />
          </div>
        </Motion.div>

      </div>
    </section>
  );
}
