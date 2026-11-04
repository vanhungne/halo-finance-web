import React from "react";
import { PhoneCall, Mail } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext.jsx";

export default function QuickContactBubbles() {
  const { isEnglish } = useLanguage();

  return (
    <aside
      aria-label={isEnglish ? "Quick action tools" : "Tiện ích thao tác nhanh"}
      className="fixed right-4 sm:right-6 bottom-8 sm:bottom-10 z-50 flex flex-col gap-3.5 items-end pointer-events-auto select-none"
    >
      {/* 1. Hotline CSKH 24/7 Bubble */}
      <a
        href="tel:19006868"
        aria-label={isEnglish ? "Call 24/7 Hotline 1900 6868" : "Gọi Tổng đài CSKH 24/7 1900 6868"}
        className="group relative flex items-center justify-end cursor-pointer"
      >
        {/* Slide-out tooltip to the left on hover */}
        <div className="pointer-events-none absolute right-full mr-3 hidden sm:flex items-center gap-3 rounded-2xl border border-blue-400/30 bg-[#161619]/95 px-4 py-2.5 text-xs text-white shadow-2xl backdrop-blur-md opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-400">
              {isEnglish ? "24/7 Hotline" : "Tổng đài CSKH 24/7"}
            </span>
            <strong className="text-white text-sm font-bold tracking-tight">1900 6868</strong>
          </div>
        </div>

        {/* Circular Action Bubble with loading-gradient */}
        <div className="loading-gradient relative grid h-12 w-12 sm:h-13 sm:w-13 place-items-center rounded-full text-white shadow-lg shadow-blue-500/35 border border-sky-300/40 transition-all duration-300 group-hover:scale-110 group-hover:brightness-115 active:scale-95">
          <span className="absolute inset-0 rounded-full bg-sky-400/40 animate-ping pointer-events-none" />
          <PhoneCall className="h-5 w-5 sm:h-5.5 sm:w-5.5 relative z-10" />
        </div>
      </a>

      {/* 2. Email Support Bubble */}
      <a
        href="mailto:contact@trolytaichinh.vn"
        aria-label={isEnglish ? "Send email to contact@trolytaichinh.vn" : "Gửi email tới contact@trolytaichinh.vn"}
        className="group relative flex items-center justify-end cursor-pointer"
      >
        {/* Slide-out tooltip to the left on hover */}
        <div className="pointer-events-none absolute right-full mr-3 hidden sm:flex items-center gap-3 rounded-2xl border border-blue-400/30 bg-[#161619]/95 px-4 py-2.5 text-xs text-white shadow-2xl backdrop-blur-md opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-400">
              {isEnglish ? "Support Email" : "Email tiếp nhận"}
            </span>
            <strong className="text-white text-xs font-semibold tracking-tight">contact@trolytaichinh.vn</strong>
          </div>
        </div>

        {/* Circular Action Bubble with loading-gradient */}
        <div className="loading-gradient relative grid h-12 w-12 sm:h-13 sm:w-13 place-items-center rounded-full text-white shadow-lg shadow-blue-500/35 border border-sky-300/40 transition-all duration-300 group-hover:scale-110 group-hover:brightness-115 active:scale-95">
          <Mail className="h-5 w-5 sm:h-5.5 sm:w-5.5 relative z-10" />
        </div>
      </a>
    </aside>
  );
}
