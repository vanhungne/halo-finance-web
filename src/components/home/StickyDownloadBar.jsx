import { useState, useEffect } from "react";
import { QrCode, ArrowUp, Smartphone } from "lucide-react";

export default function StickyDownloadBar({ onOpenQr }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 450);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Thanh công cụ tiện ích nhanh"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      {/* Quick Download CTA Button */}
      <button
        type="button"
        onClick={onOpenQr}
        className="group flex items-center gap-2.5 rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-xl shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 border border-white/20"
        title="Quét mã QR tải app bằng điện thoại"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-white">
          <QrCode className="h-3.5 w-3.5" />
        </span>
        <span className="hidden sm:inline">Tải App Miễn Phí</span>
        <span className="sm:hidden">Tải App</span>
      </button>

      {/* Back to top button */}
      <button
        type="button"
        onClick={scrollToTop}
        className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg shadow-slate-200/50 hover:bg-slate-50 hover:text-blue-600 transition hover:-translate-y-0.5"
        title="Cuộn lên đầu trang"
        aria-label="Cuộn lên đầu trang"
      >
        <ArrowUp className="h-4 w-4 stroke-[2.5]" />
      </button>
    </aside>
  );
}
