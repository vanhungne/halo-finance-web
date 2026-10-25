import React, { useState } from "react";
import Header from "../../components/header/headerComp.jsx";
import Footer from "../../components/footer/Footer.jsx";
import { Trash2, AlertTriangle, CheckCircle2, ArrowLeft, Mail, Clock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function DeleteAccountRequestPage() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !confirmed) return;
    setLoading(true);
    // Giả lập lưu request xóa tài khoản
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại trang chủ
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <Trash2 className="h-6 w-6" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Quyền Riêng Tư & Dữ Liệu Cá Nhân
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Yêu Cầu Xóa Tài Khoản & Dữ Liệu
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Cổng tiếp nhận yêu cầu xóa tài khoản trực tuyến theo chính sách của Google Play & Apple App Store
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Đã Tiếp Nhận Yêu Cầu Xóa Tài Khoản</h2>
            <p className="text-slate-300 text-sm max-w-lg mx-auto mb-6">
              Hệ thống đã ghi nhận yêu cầu hủy tài khoản gắn với email: <strong className="text-white">{email}</strong>. Chúng tôi sẽ tiến hành xác thực và xóa sạch toàn bộ hồ sơ dữ liệu cá nhân, lịch sử thu chi và ví tiền của bạn khỏi máy chủ trong vòng <strong>30 ngày</strong>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-6 py-3 text-xs font-bold text-white transition"
              >
                Trở về trang chủ
              </Link>
              <a
                href="mailto:hotro.trolytaichinh@gmail.com"
                className="text-xs text-sky-400 hover:underline"
              >
                Cần hủy yêu cầu? Liên hệ hỗ trợ
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-300 text-base mb-1">
                    Cảnh báo quan trọng trước khi gửi yêu cầu xóa
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Hành động xóa tài khoản là <strong>vĩnh viễn và không thể đảo ngược</strong>. Khi yêu cầu hoàn tất:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-slate-300">
                    <li>Toàn bộ thông tin định danh cá nhân (Họ tên, email, avatar) sẽ bị xóa sạch khỏi cơ sở dữ liệu.</li>
                    <li>Toàn bộ lịch sử thu chi, ví tiền, ngân sách, ghi chú và hóa đơn đính kèm sẽ bị hủy vĩnh viễn.</li>
                    <li>Bạn sẽ tự động rời khỏi các nhóm và quỹ chung đã tham gia.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-6">
                Biểu mẫu yêu cầu xóa tài khoản qua Web
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Địa chỉ Email đăng ký tài khoản <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Mail className="h-5 w-5" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="ví dụ: nguyenvana@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Lý do yêu cầu xóa (Tùy chọn)
                  </label>
                  <textarea
                    id="reason"
                    rows={3}
                    placeholder="Hãy cho chúng tôi biết lý do bạn muốn ngừng sử dụng..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input
                    id="confirmCheck"
                    type="checkbox"
                    required
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-950 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <label htmlFor="confirmCheck" className="text-xs text-slate-300 cursor-pointer">
                    Tôi hiểu rằng toàn bộ dữ liệu tài khoản, lịch sử giao dịch và ví tiền của tôi sẽ bị xóa vĩnh viễn và không thể phục hồi.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email || !confirmed}
                  className="w-full rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 py-3.5 text-sm font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/20"
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

              <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-sky-400 shrink-0" />
                  <span>Thời gian xử lý: Tối đa 30 ngày kể từ ngày tiếp nhận yêu cầu.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Nếu bạn vẫn còn ứng dụng, bạn có thể xóa tức thì trong <em>Cài đặt &gt; Xóa tài khoản</em>.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
