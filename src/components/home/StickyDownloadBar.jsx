import { useState, useEffect } from "react";
import { QrCode, ArrowUp, Sparkles, Laptop, PhoneCall, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StickyDownloadBar({ onOpenQr }) {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <>
      {/* ======================================================================= */}
      {/* 1. MOBILE NATIVE BANKING BOTTOM ACTION DOCK (< sm)                      */}
      {/* ======================================================================= */}
      <div
        aria-label="Thanh tác vụ ngân hàng di động"
        className="fixed bottom-0 inset-x-0 z-50 sm:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/90 px-3 py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] animate-in fade-in slide-in-from-bottom-4"
      >
        <div className="flex items-center gap-2 max-w-md mx-auto">
          {/* Hotline 24/7 button */}
          <a
            href="tel:19006868"
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700 hover:text-blue-600 hover:bg-slate-200 transition shrink-0"
            title="Tổng đài CSKH 24/7: 1900 6868"
            aria-label="Tổng đài 1900 6868"
          >
            <PhoneCall className="h-4 w-4 text-sky-600" />
          </a>

          {/* QR Code trigger */}
          <button
            type="button"
            onClick={onOpenQr}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition shrink-0 shadow-2xs cursor-pointer"
            title="Quét mã tải app 0đ"
            aria-label="Quét mã tải app"
          >
            <QrCode className="h-4 w-4 text-emerald-600" />
          </button>

          {/* Primary eKYC / App Download Action Button */}
          <button
            type="button"
            onClick={onOpenQr}
            className="flex-1 flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white font-black text-xs shadow-md shadow-blue-500/25 transition active:scale-[0.98]"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300 fill-amber-300 shrink-0" />
            <span className="truncate">Tải App Miễn Phí (0đ)</span>
          </button>

          {/* Scroll to top button */}
          <button
            type="button"
            onClick={scrollToTop}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 transition shrink-0"
            title="Lên đầu trang"
            aria-label="Lên đầu trang"
          >
            <ArrowUp className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 2. DESKTOP FLOATING ACTION TOOLS (>= sm)                                */}
      {/* ======================================================================= */}
      <aside
        aria-label="Thanh công cụ tiện ích nhanh"
        className="hidden sm:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
      >
        {/* Quick Download CTA Button */}
        <button
          type="button"
          onClick={onOpenQr}
          className="group flex items-center gap-2.5 rounded-full bg-blue-600 hover:bg-blue-700 px-4.5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-xl shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 border border-white/20"
          title="Quét mã QR tải app bằng điện thoại"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-white">
            <QrCode className="h-3.5 w-3.5" />
          </span>
          <span>Tải App Miễn Phí (0đ)</span>
        </button>

        {/* Back to top button */}
        <button
          type="button"
          onClick={scrollToTop}
          className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg shadow-slate-200/50 hover:bg-slate-50 hover:text-blue-600 transition hover:-translate-y-0.5"
          title="Cuộn lên đầu trang"
          aria-label="Cuộn lên đầu trang"
        >
          <ArrowUp className="h-4 w-4 stroke-[2.5]" />
        </button>
      </aside>
    </>
  );
}

