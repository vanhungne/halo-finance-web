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
      className="relative z-50 overflow-hidden bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 px-4 py-2 text-white shadow-xs"
    >
      <div className="mx-auto flex max-w-[1380px] items-center justify-between text-xs sm:text-sm">
        <div className="flex flex-1 items-center justify-center gap-2 sm:gap-3 text-center">
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-amber-300" /> Bản Mới 2.0
          </span>
          <p className="font-medium text-white/95">
            <strong className="font-bold text-white">Halo Finance 2.0 đã ra mắt:</strong> Bóc tách hóa đơn AI siêu tốc & Chia tiền nhóm VietQR 1 chạm.
          </p>
          <button
            type="button"
            onClick={onOpenQr}
            className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-white underline underline-offset-4 transition"
          >
            Tải app ngay <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="ml-2 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white transition"
          aria-label="Đóng thông báo"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
}
