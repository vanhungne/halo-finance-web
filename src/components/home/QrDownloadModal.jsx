import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, Smartphone, Sparkles, CheckCircle2 } from "lucide-react";

export default function QrDownloadModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-slate-900 p-7 text-white shadow-2xl z-10"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Heading */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 px-3 py-1 text-xs font-bold text-sky-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Tải Nhanh Trong 5 Giây
            </div>
            <h3 className="text-2xl font-black text-white">Quét Mã QR Để Tải App</h3>
            <p className="text-xs text-slate-400 mt-1">
              Hỗ trợ đầy đủ thiết bị iPhone, iPad và điện thoại Android
            </p>
          </div>

          {/* QR Code Container */}
          <div className="mt-6 flex justify-center">
            <div className="relative rounded-2xl bg-white p-4 shadow-xl ring-4 ring-sky-500/30">
              <svg viewBox="0 0 160 160" className="w-48 h-48" fill="none">
                {/* SVG QR Code Illustration */}
                <rect width="160" height="160" fill="white" />
                {/* Top Left Marker */}
                <rect x="12" y="12" width="40" height="40" rx="4" fill="#0f172a" />
                <rect x="20" y="20" width="24" height="24" rx="2" fill="white" />
                <rect x="26" y="26" width="12" height="12" rx="1" fill="#0f172a" />
                {/* Top Right Marker */}
                <rect x="108" y="12" width="40" height="40" rx="4" fill="#0f172a" />
                <rect x="116" y="20" width="24" height="24" rx="2" fill="white" />
                <rect x="122" y="26" width="12" height="12" rx="1" fill="#0f172a" />
                {/* Bottom Left Marker */}
                <rect x="12" y="108" width="40" height="40" rx="4" fill="#0f172a" />
                <rect x="20" y="116" width="24" height="24" rx="2" fill="white" />
                <rect x="26" y="122" width="12" height="12" rx="1" fill="#0f172a" />
                {/* Data Pixels */}
                <g fill="#0284c7">
                  <rect x="60" y="20" width="8" height="8" />
                  <rect x="76" y="28" width="16" height="8" />
                  <rect x="60" y="44" width="8" height="8" />
                  <rect x="92" y="44" width="8" height="8" />
                  <rect x="20" y="60" width="16" height="8" />
                  <rect x="44" y="60" width="8" height="16" />
                  <rect x="60" y="68" width="16" height="8" />
                  <rect x="84" y="60" width="8" height="8" />
                  <rect x="100" y="68" width="16" height="16" />
                  <rect x="124" y="60" width="8" height="8" />
                  <rect x="140" y="68" width="8" height="8" />
                  <rect x="28" y="84" width="8" height="16" />
                  <rect x="44" y="84" width="16" height="8" />
                  <rect x="68" y="84" width="8" height="8" />
                  <rect x="84" y="84" width="8" height="16" />
                  <rect x="108" y="84" width="8" height="8" />
                  <rect x="132" y="84" width="16" height="8" />
                  <rect x="60" y="100" width="8" height="16" />
                  <rect x="76" y="108" width="16" height="8" />
                  <rect x="100" y="108" width="8" height="8" />
                  <rect x="116" y="100" width="8" height="8" />
                  <rect x="140" y="100" width="8" height="16" />
                  <rect x="60" y="124" width="16" height="8" />
                  <rect x="84" y="132" width="16" height="8" />
                  <rect x="108" y="124" width="8" height="8" />
                  <rect x="124" y="124" width="16" height="8" />
                  <rect x="140" y="132" width="8" height="8" />
                </g>
                {/* Center App Logo Badge */}
                <rect x="64" y="64" width="32" height="32" rx="8" fill="#0f172a" />
                <circle cx="80" cy="80" r="10" fill="#38bdf8" />
                <path d="M76 80L79 83L84 77" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Guide Steps */}
          <div className="mt-6 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Mở ứng dụng Camera hoặc Zalo trên điện thoại</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Quét mã QR ở trên để chuyển hướng tới App Store / CH Play</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bấm cài đặt để bắt đầu sử dụng ngay lập tức</span>
            </div>
          </div>

          {/* Store links buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition text-xs font-bold text-white border border-white/10"
            >
              <Smartphone className="w-4 h-4" />
              App Store
            </a>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition text-xs font-bold text-white border border-white/10"
            >
              <Smartphone className="w-4 h-4" />
              Google Play
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
