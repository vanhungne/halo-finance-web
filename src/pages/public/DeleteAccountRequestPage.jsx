import { useState } from "react";
import Header from "../../components/header/headerComp.jsx";
import Footer from "../../components/footer/Footer.jsx";
import QrDownloadModal from "../../components/home/QrDownloadModal.jsx";
import { Trash2, AlertTriangle, CheckCircle2, Mail, Clock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/landingTheme.css";

export default function DeleteAccountRequestPage() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !confirmed) return;
    setLoading(true);
    // Giả lập lưu request xóa tài khoản
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="landing-page min-h-screen bg-slate-50/60 text-slate-900 flex flex-col justify-between">
      <Header
        onOpenQr={() => setQrModalOpen(true)}
      />

      <main className="relative z-10 mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Page Hero Header */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black text-slate-950 tracking-tight leading-tight title-3d">
            Yêu Cầu Xóa Tài Khoản & Dữ Liệu
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            Cổng tiếp nhận yêu cầu xóa tài khoản trực tuyến theo chính sách của Google Play & Apple App Store
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 sm:p-10 text-center shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 border border-emerald-200">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mb-2 title-3d">
              Đã Tiếp Nhận Yêu Cầu Xóa Tài Khoản
            </h2>
            <p className="text-slate-600 text-sm max-w-lg mx-auto mb-6 leading-relaxed">
              Hệ thống đã ghi nhận yêu cầu hủy tài khoản gắn với email: <strong className="font-semibold text-slate-900">{email}</strong>. Chúng tôi sẽ tiến hành xác thực và xóa sạch toàn bộ hồ sơ dữ liệu cá nhân, lịch sử thu chi và ví tiền của bạn khỏi máy chủ trong vòng <strong className="font-semibold text-slate-900">30 ngày</strong>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="rounded-xl bg-slate-950 hover:bg-slate-800 px-6 py-3 text-xs font-bold text-white transition shadow-sm"
              >
                Trở về trang chủ
              </Link>
              <a
                href="mailto:hotro.trolytaichinh@gmail.com"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Cần hủy yêu cầu? Liên hệ hỗ trợ
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Warning Callout Box */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 sm:p-7 shadow-xs">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-700 border border-amber-200 shrink-0 mt-0.5">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-amber-950 text-base mb-1">
                    Cảnh báo quan trọng trước khi gửi yêu cầu xóa
                  </h3>
                  <p className="text-amber-900/80 text-sm leading-relaxed">
                    Hành động xóa tài khoản là <strong className="font-semibold text-amber-950">vĩnh viễn và không thể đảo ngược</strong>. Khi yêu cầu hoàn tất:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs sm:text-sm text-amber-900/80 marker:text-amber-600">
                    <li>Toàn bộ thông tin định danh cá nhân (Họ tên, email, avatar) sẽ bị xóa sạch khỏi cơ sở dữ liệu.</li>
                    <li>Toàn bộ lịch sử thu chi, ví tiền, ngân sách, ghi chú và hóa đơn đính kèm sẽ bị hủy vĩnh viễn.</li>
                    <li>Bạn sẽ tự động rời khỏi các nhóm và quỹ chung đã tham gia.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg sm:text-xl font-bold text-slate-950 mb-6">
                Biểu mẫu yêu cầu xóa tài khoản qua Web
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Địa chỉ Email đăng ký tài khoản <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Mail className="h-5 w-5" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="ví dụ: nguyenvana@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/10 shadow-2xs transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Lý do yêu cầu xóa (Tùy chọn)
                  </label>
                  <textarea
                    id="reason"
                    rows={3}
                    placeholder="Hãy cho chúng tôi biết lý do bạn muốn ngừng sử dụng..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none shadow-2xs transition"
                  />
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input
                    id="confirmCheck"
                    type="checkbox"
                    required
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <label htmlFor="confirmCheck" className="text-xs sm:text-sm text-slate-600 cursor-pointer leading-normal">
                    Tôi hiểu rằng toàn bộ dữ liệu tài khoản, lịch sử giao dịch và ví tiền của tôi sẽ bị xóa vĩnh viễn và không thể phục hồi.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email || !confirmed}
                  className="w-full rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 py-3.5 text-sm font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.99]"
                >
                  {loading ? (
                    <span>Đang gửi yêu cầu...</span>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Xác Nhận Gửi Yêu Cầu Xóa Dữ Liệu</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Thời gian xử lý: Tối đa 30 ngày kể từ ngày tiếp nhận yêu cầu.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Nếu bạn vẫn còn ứng dụng, bạn có thể xóa tức thì trong <em>Cài đặt &gt; Xóa tài khoản</em>.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer
        onOpenQr={() => setQrModalOpen(true)}
      />

      {/* Modals */}
      <QrDownloadModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
    </div>
  );
}
