import { Sparkles, PhoneCall } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSwitcher from "../common/LanguageSwitcher";

export default function TopAnnouncementBar({ onOpenQr }) {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <aside
      aria-label="Thông báo cập nhật mới"
      className="relative z-50 bg-slate-900 text-slate-300 border-b border-slate-800 text-[11px] font-medium"
    >
      <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-between px-3 sm:px-8 lg:px-10">
        {/* Left: Announcement Tag */}
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] shrink-0 border border-blue-400/30">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Mới</span>
          </span>
          <span className="text-slate-300 text-[11px] truncate">
            {isEn
              ? "Trợ Lý Tài Chính 2.5: Instant AI Receipt Scanner & VietQR 1-Tap Split."
              : "Trợ Lý Tài Chính 2.5: Bóc tách hóa đơn AI 3 giây & Chia tiền nhóm VietQR 1 chạm."}
          </span>
        </div>

        {/* Right: Hotline, Free Badge & Language Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0 text-slate-400">
          <a
            href="tel:19006868"
            className="hidden md:inline-flex items-center gap-1.5 hover:text-white transition"
          >
            <PhoneCall className="w-3 h-3 text-blue-400" />
            <span>Hotline: <strong className="text-white">1900 6868</strong></span>
          </a>

          <button
            type="button"
            onClick={onOpenQr}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 hover:text-white hover:bg-emerald-600 transition font-bold text-[10.5px] cursor-pointer"
          >
            <span>{isEn ? "100% Free Lifetime" : "100% Miễn Phí Trọn Đời"}</span>
          </button>

          <span className="hidden sm:inline text-slate-700">|</span>

          {/* Language Switcher */}
          <LanguageSwitcher variant="topbar" />
        </div>
      </div>
    </aside>
  );
}
