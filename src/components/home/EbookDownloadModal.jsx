import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Download,
  Sparkles,
  X,
  FileSpreadsheet,
  Gift,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function EbookDownloadModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Vui lòng nhập địa chỉ email hợp lệ để nhận cẩm nang!");
      return;
    }

    setError("");
    setSubmitted(true);

    // Trigger celebratory confetti burst!
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#0284c7", "#38bdf8", "#f59e0b", "#10b981", "#6366f1"],
      });
    } catch (err) {
      console.log("Confetti trigger:", err);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setEmail("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleReset}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[2.25rem] border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xl text-slate-900 max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-5">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-emerald-100 text-emerald-600 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Gửi Thành Công 100%
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                Chúc Mừng Bạn! Tài Liệu Đã Sẵn Sàng
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                File PDF cẩm nang 45 trang, bộ template Excel 50/30/20 và mã kích hoạt VIP 30 ngày đã được gửi tới:
                <br />
                <strong className="text-blue-600 font-extrabold text-sm">{email}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs">
              <p className="font-extrabold text-slate-900">Chi tiết gói quà tặng bao gồm:</p>
              <div className="space-y-1 text-slate-600">
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ebook 45 trang: 7 Nguyên Tắc Quản Trị Dòng Tiền 2026</span>
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Template Google Sheets quản trị ngân sách 50/30/20</span>
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Voucher mã kích hoạt 30 ngày trải nghiệm VIP</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href="#download"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 hover:bg-blue-700 transition"
              >
                <Download className="w-4 h-4" />
                <span>Tải Ngay Bản PDF Mẫu (Trực Tiếp)</span>
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                Đóng Cửa Sổ
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Modal Header */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-800 shadow-2xs mb-3">
                <Gift className="h-3.5 w-3.5 text-amber-600" />
                <span>Quà Tặng Tri Ân Độc Quyền 2026 • 0đ Phí</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                Tải Miễn Phí Ebook Cẩm Nang:{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  7 Nguyên Tắc Quản Trị Dòng Tiền
                </span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                45 trang thực chiến đúc kết bởi chuyên gia tài chính định chế Trợ Lý Tài Chính. Đã có hơn <strong className="text-blue-700 font-bold">+18.400 cá nhân và chủ hộ kinh doanh</strong> tải về và áp dụng thành công.
              </p>
            </div>

            {/* 4 In-depth Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-2 font-black text-slate-900">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-100 text-blue-700 text-[10px]">
                    1
                  </span>
                  <span>Quy Tắc 50/30/20 Cải Tiến</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Cách phân bổ thu nhập thông minh phù hợp với mức sống thực tế tại các đô thị Việt Nam.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-2 font-black text-slate-900">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-700 text-[10px]">
                    2
                  </span>
                  <span>Bí Quyết Gom 54+ Bank</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Quản lý dòng tiền nhiều tài khoản Vietcombank, Techcombank, MB mà không bị thất thoát.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-2 font-black text-slate-900">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-amber-100 text-amber-700 text-[10px]">
                    3
                  </span>
                  <span>Chiến Lược Hoàn Tiền 1.5%</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Tận dụng tối đa quyền lợi thẻ Visa/Mastercard và tránh mọi loại phí ẩn thường niên.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-2 font-black text-slate-900">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-indigo-100 text-indigo-700 text-[10px]">
                    4
                  </span>
                  <span>File Excel Ngân Sách 500k</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Tặng kèm mẫu bảng tính tự động công thức tính tài sản ròng Net Worth và tự do tài chính.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label
                  htmlFor="ebook-email"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Nhập địa chỉ email của bạn để nhận ngay:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="ebook-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nguyenvana@gmail.com"
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white font-black text-xs shadow-md shadow-blue-500/25 hover:opacity-95 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Nhận Ebook & Quà VIP (0đ)</span>
                  </button>
                </div>
                {error && <p className="text-xs font-bold text-rose-600 mt-1.5">{error}</p>}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Bảo mật 100% • Không spam quảng cáo
                </span>
                <span>Tập tin PDF • 45 Trang</span>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
