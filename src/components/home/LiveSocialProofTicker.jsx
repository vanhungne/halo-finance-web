import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ScanLine,
  CreditCard,
  Building2,
  Users2,
  TrendingUp,
  Award,
  CheckCircle2,
  X,
  ShieldCheck,
} from "lucide-react";

const RECENT_ACTIVITIES = [
  {
    id: 1,
    name: "Anh Hoàng Nam",
    location: "Cầu Giấy, Hà Nội",
    action: "vừa mở tài khoản số đẹp đuôi •8888 (0đ phí)",
    icon: Sparkles,
    iconBg: "bg-blue-600 text-white",
    time: "2 phút trước",
    verified: "CCCD gắn chip eKYC",
  },
  {
    id: 2,
    name: "Chị Thùy Trang",
    location: "Quận 1, TP. Hồ Chí Minh",
    action: "vừa bóc tách hóa đơn Highlands 185k bằng Trí Tuệ Nhân Tạo AI",
    icon: ScanLine,
    iconBg: "bg-cyan-600 text-white",
    time: "4 phút trước",
    verified: "AI OCR Siêu Tốc",
  },
  {
    id: 3,
    name: "Anh Quốc Bảo",
    location: "Hải Châu, Đà Nẵng",
    action: "vừa kích hoạt Thẻ Halo Platinum Dual Contactless",
    icon: CreditCard,
    iconBg: "bg-amber-500 text-slate-950",
    time: "7 phút trước",
    verified: "EMV Chip Contactless",
  },
  {
    id: 4,
    name: "Hộ KD Minh Khang",
    location: "Hồng Bàng, Hải Phòng",
    action: "vừa đồng bộ tự động 2 tài khoản Vietcombank & TCB",
    icon: Building2,
    iconBg: "bg-emerald-600 text-white",
    time: "9 phút trước",
    verified: "NAPAS 24/7 SePay",
  },
  {
    id: 5,
    name: "Nhóm Phượt Đà Lạt",
    location: "4 thành viên",
    action: "vừa quyết toán bill 1.250.000đ qua mã VietQR 1 chạm",
    icon: Users2,
    iconBg: "bg-indigo-600 text-white",
    time: "12 phút trước",
    verified: "VietQR 1 Chạm",
  },
  {
    id: 6,
    name: "Chị Mai Lan",
    location: "Ninh Kiều, Cần Thơ",
    action: "vừa tính lãi kép tích lũy 500 triệu kỳ hạn 24 tháng",
    icon: TrendingUp,
    iconBg: "bg-rose-600 text-white",
    time: "15 phút trước",
    verified: "6.2%/năm Lãi Kép",
  },
  {
    id: 7,
    name: "Anh Tuấn Anh",
    location: "Tây Hồ, Hà Nội",
    action: "vừa nâng cấp Thẻ Halo Black Titanium VIP Nguyên Khối",
    icon: Award,
    iconBg: "bg-slate-950 text-amber-400 border border-amber-400/40",
    time: "18 phút trước",
    verified: "Đặc Quyền Priority",
  },
];

export default function LiveSocialProofTicker({ onOpenQr }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    // Initial delay before showing first social proof toast
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 1500);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (!visible || closed) return;

    // Keep visible for 6 seconds, then hide for 8 seconds, then next item
    const hideTimer = setTimeout(() => {
      setVisible(false);

      const nextTimer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_ACTIVITIES.length);
        setVisible(true);
      }, 7000);

      return () => clearTimeout(nextTimer);
    }, 6000);

    return () => clearTimeout(hideTimer);
  }, [visible, closed, currentIndex]);

  if (closed) return null;

  const current = RECENT_ACTIVITIES[currentIndex];
  const Icon = current.icon;

  return (
    <div className="fixed bottom-20 left-3 right-3 sm:right-auto sm:bottom-6 sm:left-6 z-40 pointer-events-none">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto max-w-sm sm:max-w-[360px] rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-3 shadow-2xl shadow-slate-300/60 ring-1 ring-slate-900/5 hover:border-blue-400 transition cursor-pointer"
            onClick={onOpenQr}
          >
            <div className="flex items-start gap-2.5">
              {/* Action Icon */}
              <div
                className={`grid h-9 w-9 place-items-center rounded-xl shrink-0 shadow-xs ${current.iconBg}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* Text Information */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-xs font-black text-slate-900 truncate">
                      {current.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium truncate">
                      ({current.location})
                    </span>
                  </div>
                  <span className="text-[9.5px] font-bold text-slate-400 shrink-0">
                    {current.time}
                  </span>
                </div>

                <p className="text-[11px] font-semibold text-slate-700 leading-snug mt-0.5 line-clamp-2">
                  {current.action}
                </p>

                {/* Verification Badge */}
                <div className="mt-1.5 flex items-center gap-2 text-[9.5px]">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200/80">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>{current.verified}</span>
                  </span>
                  <span className="text-slate-400 font-medium">
                    Nhấp để mở tài khoản
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setClosed(true);
                }}
                className="grid h-5 w-5 place-items-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0"
                aria-label="Đóng thông báo"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
