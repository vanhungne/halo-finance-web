import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, X } from "lucide-react";

export default function TopAnnouncementBar({ onOpenQr }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("halo_announcement_dismissed");
    if (dismissed === "true") {
      setVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem("halo_announcement_dismissed", "true");
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Thông báo cập nhật ứng dụng"
      className="relative z-50 overflow-hidden bg-slate-950 text-slate-200 border-b border-white/10 px-4 py-2 text-xs"
    >
      <div className="mx-auto flex max-w-[1380px] items-center justify-between">
        <div className="flex flex-1 items-center justify-center gap-2.5 sm:gap-3 text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 border border-blue-400/30 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-sky-300">
            <Sparkles className="h-3 w-3 text-amber-300" /> Bản Mới 2.0
          </span>
          <p className="font-medium text-slate-300 hidden sm:inline">
            <strong className="font-bold text-white">Halo Finance 2.0:</strong> Bóc tách hóa đơn tự động bằng AI Gemini & Chia tiền nhóm VietQR 1 chạm.
          </p>
          <p className="font-medium text-slate-300 sm:hidden">
            <strong className="font-bold text-white">Bản 2.0:</strong> AI Bóc tách hóa đơn & VietQR.
          </p>
          <button
            type="button"
            onClick={onOpenQr}
            className="inline-flex items-center gap-1 font-bold text-sky-400 hover:text-sky-300 underline underline-offset-4 transition"
          >
            <span>Trải nghiệm ngay</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="ml-2 rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white transition"
          aria-label="Đóng thông báo"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
}
