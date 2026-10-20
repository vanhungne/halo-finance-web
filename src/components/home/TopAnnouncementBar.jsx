import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, X, PhoneCall, MapPin, Globe, ShieldCheck, TrendingUp, Laptop } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopAnnouncementBar({ onOpenQr }) {
  const [activeSegment, setActiveSegment] = useState("personal"); // "personal" | "business" | "priority"
  const navigate = useNavigate();

  return (
    <aside
      aria-label="Thanh tiện ích ngân hàng số"
      className="relative z-50 bg-slate-900 text-slate-300 border-b border-slate-800 text-[11px] font-medium"
    >
      <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-between px-2.5 sm:px-8 lg:px-10 overflow-x-auto no-scrollbar">
        {/* Left: Customer Segment Switcher (Standard on all Tier-1 Bank Portals) */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950/60 border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSegment("personal")}
            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-md transition-all font-semibold text-[10px] sm:text-[11px] whitespace-nowrap ${
              activeSegment === "personal"
                ? "bg-slate-800 text-sky-300 font-bold border border-slate-700 shadow-xs ring-1 ring-sky-400/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Cá nhân
          </button>
          <button
            type="button"
            onClick={() => setActiveSegment("business")}
            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-md transition-all font-semibold text-[10px] sm:text-[11px] whitespace-nowrap ${
              activeSegment === "business"
                ? "bg-slate-800 text-emerald-300 font-bold border border-slate-700 shadow-xs ring-1 ring-emerald-400/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Doanh nghiệp & Hộ KD
          </button>
          <button
            type="button"
            onClick={() => setActiveSegment("priority")}
            className={`hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-md transition-all font-semibold ${
              activeSegment === "priority"
                ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-xs"
                : "text-amber-400/90 hover:text-amber-300"
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            Khách hàng Ưu tiên (Priority)
          </button>
        </div>

        {/* Center: Live Financial Market Indicator (Institutional Credibility) */}
        <div className="hidden xl:flex items-center gap-4 text-slate-400 font-mono text-[10.5px]">
          <span className="flex items-center gap-1 text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">USD/VND:</span>
            <strong className="text-white">25.480</strong>
            <span className="text-emerald-400 font-bold">+0.12%</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1 text-slate-300">
            <span className="text-slate-400">Vàng SJC:</span>
            <strong className="text-amber-400">86.50 Tr/Lượng</strong>
            <span className="text-emerald-400 font-bold">+0.35%</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1 text-slate-300">
            <span className="text-slate-400">Lãi suất gửi:</span>
            <strong className="text-sky-400">đến 6.2%/năm</strong>
          </span>
        </div>

        {/* Right: Hotline 24/7, Network, Web Portal */}
        <div className="flex items-center gap-2 sm:gap-4 text-slate-400 shrink-0 ml-2">
          <a
            href="tel:19006868"
            className="hidden sm:inline-flex items-center gap-1.5 hover:text-white transition"
          >
            <PhoneCall className="w-3 h-3 text-sky-400" />
            <span>Hotline 24/7: <strong className="text-white">1900 6868</strong></span>
          </a>

          <a
            href="#rates"
            className="hidden lg:inline-flex items-center gap-1 hover:text-white transition"
          >
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>Điểm giao dịch</span>
          </a>

          <button
            type="button"
            onClick={() => navigate("/app")}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-sky-300 hover:text-white hover:bg-blue-600 transition font-bold text-[10px] sm:text-[11px] whitespace-nowrap"
          >
            <Laptop className="w-3 h-3" />
            <span className="hidden sm:inline">Web Internet Banking</span>
            <span className="sm:hidden">Web Banking</span>
          </button>

          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-300 font-bold">
            <Globe className="w-3 h-3 text-slate-400" />
            VN
          </span>
        </div>
      </div>
    </aside>
  );
}
