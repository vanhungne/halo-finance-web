import React from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import images from "../../assets/image.js";

const GOOGLE_PLAY_URL =
  import.meta.env.VITE_GOOGLE_PLAY_URL ||
  "https://play.google.com/store/apps/details?id=com.trolytaichinh.app";

function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 28 31" className="h-6 w-6 shrink-0" aria-hidden="true">
      <path fill="#00d6ff" d="M1.1 1.8 16.7 15.5 1.2 29.2C.4 28.7 0 27.8 0 26.7V4.3c0-1 .4-1.9 1.1-2.5Z" />
      <path fill="#ffda00" d="m21.7 11.1-5 4.4L1.1 1.8C1.7 1.4 2.5 1.3 3.3 1.7l18.4 9.4Z" />
      <path fill="#ff3a44" d="m21.7 19.9-18.5 9.4c-.7.4-1.5.3-2-.1l15.5-13.7 5 4.4Z" />
      <path fill="#00f076" d="m27 13.8-5.3-2.7-5 4.4 5 4.4 5.3-2.7c1.3-.7 1.3-2.7 0-3.4Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 32 43" className="h-6 w-6 shrink-0 fill-current text-white" aria-hidden="true">
      <path
        d="M26.9 20.1c0-5.1 4.2-7.6 4.4-7.7-2.4-3.5-6.1-4-7.4-4.1-3.1-.3-6.2 1.9-7.8 1.9-1.7 0-4.2-1.9-6.9-1.8-3.5.1-6.8 2.1-8.6 5.2-3.7 6.4-.9 15.8 2.6 21 1.8 2.5 3.8 5.3 6.5 5.2 2.6-.1 3.6-1.7 6.8-1.7 3.1 0 4.1 1.7 6.8 1.6 2.8 0 4.6-2.5 6.3-5.1 2-2.9 2.8-5.8 2.8-6-.1 0-5.4-2.1-5.5-8.5ZM21.9 5c1.4-1.8 2.4-4.2 2.1-6.6-2.1.1-4.8 1.5-6.3 3.3-1.4 1.6-2.6 4-2.2 6.3 2.4.2 4.8-1.2 6.4-3Z"
        transform="translate(0 2)"
      />
    </svg>
  );
}

export default function ReadyToControlSection({ onOpenQr }) {
  const { isEnglish } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: "easeOut" },
      };

  return (
    <section id="download" className="relative w-full overflow-hidden bg-gradient-to-r from-[#f8fafc] via-[#f1f5f9] to-[#edf2f7] text-slate-900 border-t border-slate-200/80">
      {/* Subtle Ambient Reflections */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-blue-400/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 right-10 h-96 w-96 rounded-full bg-indigo-400/10 blur-[130px]" />

      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 pt-0 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* ========================================================= */}
          {/* PANEL TRÁI (Span 7 trên Desktop): Căn giữa theo chiều dọc */}
          {/* ========================================================= */}
          <Motion.div
            {...motionProps}
            className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center my-auto py-10 sm:py-14 lg:py-16"
          >
            {/* Headline on 1 single line on desktop */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.2rem] xl:text-[2.65rem] font-black tracking-tight leading-tight text-slate-950 whitespace-normal lg:whitespace-nowrap title-3d">
              {isEnglish ? "Ready To Take Control Of Your Financial Life?" : "Sẵn Sàng Làm Chủ Tài Chính Của Bạn?"}
            </h2>

            {/* Subtitle on balanced 2 lines */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-[17px] text-slate-600 leading-relaxed max-w-[740px] xl:max-w-[760px] font-normal">
              {isEnglish
                ? "Turn complicated budgeting into effortless moments. With TroLyTaiChinh, managing your money is just a tap away — secure, smart, and made for you."
                : "Biến thói quen quản lý chi tiêu thành trải nghiệm thảnh thơi mỗi ngày. Với Trợ Lý Tài Chính, quản lý tiền bạc, quỹ nhóm và dòng tiền chỉ cách bạn một chạm — an toàn, thông minh và tối ưu cho bạn."}
            </p>

            {/* 2 Black Badges Side-By-Side (Matching Image Reference) */}
            <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5">
              {/* Google Play Badge */}
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-xl bg-black hover:bg-slate-900 text-white px-4 py-2.5 transition-all duration-200 hover:scale-[1.03] shadow-md border border-black active:scale-95 cursor-pointer"
                aria-label={isEnglish ? "Get it on Google Play" : "Tải về trên Google Play"}
              >
                <GooglePlayIcon />
                <div className="text-left leading-tight">
                  <span className="block text-[9px] font-semibold uppercase tracking-wider text-white/70">
                    {isEnglish ? "GET IT ON" : "TẢI VỀ TỪ"}
                  </span>
                  <span className="block text-xs sm:text-sm font-bold text-white tracking-tight">
                    Google Play
                  </span>
                </div>
              </a>

              {/* App Store Badge */}
              <button
                type="button"
                onClick={onOpenQr}
                className="group inline-flex items-center gap-3 rounded-xl bg-black hover:bg-slate-900 text-white px-4 py-2.5 transition-all duration-200 hover:scale-[1.03] shadow-md border border-black active:scale-95 cursor-pointer"
                aria-label={isEnglish ? "Download on the App Store" : "Tải về trên App Store"}
                title={isEnglish ? "Click to scan QR code" : "Bấm để quét mã QR tải ứng dụng"}
              >
                <AppleIcon />
                <div className="text-left leading-tight">
                  <span className="block text-[9px] font-medium text-white/70">
                    {isEnglish ? "Download on the" : "Tải về trên"}
                  </span>
                  <span className="block text-xs sm:text-sm font-bold text-white tracking-tight">
                    App Store
                  </span>
                </div>
              </button>

            </div>
          </Motion.div>

          {/* ========================================================= */}
          {/* PANEL PHẢI (Span 5 trên lg, 4 trên xl): Phone chìm 1/3 đáy */}
          {/* ========================================================= */}
          <Motion.div
            {...motionProps}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 xl:col-span-4 flex items-start justify-center lg:justify-end w-full pt-4 sm:pt-6 lg:pt-8"
          >
            <div className="relative w-full flex items-start justify-center lg:justify-end leading-none">
              <img
                src={images.mockupPersonal}
                alt={isEnglish ? "TroLyTaiChinh Mobile App Mockup" : "Ứng dụng Trợ Lý Tài Chính trên điện thoại"}
                className="w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] xl:max-w-[450px] h-auto object-contain block -mb-[160px] sm:-mb-[200px] lg:-mb-[240px] xl:-mb-[260px] drop-shadow-[0_25px_60px_rgba(15,23,42,0.22)] transition-transform duration-300 hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          </Motion.div>

        </div>
      </div>
    </section>
  );
}
