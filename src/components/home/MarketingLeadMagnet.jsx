import { useState } from "react";
import { BookOpen, Check, Send, Sparkles, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function MarketingLeadMagnet() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Vui lòng nhập địa chỉ email hợp lệ!");
      return;
    }

    setError("");
    setSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#38bdf8", "#fbbf24", "#34d399", "#818cf8"],
      });
    } catch (err) {}
  };

  return (
    <section id="ebook" className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-sky-600 to-indigo-800 py-20 text-white">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.15),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Quà tặng độc quyền 2026</span>
            </div>

            <h2 className="text-3xl font-black sm:text-5xl tracking-tight leading-tight">
              Tải miễn phí Ebook: <br className="hidden sm:inline" />
              <span className="text-amber-300">“7 Nguyên Tắc Quản Trị Dòng Tiền & Tự Do Tài Chính”</span>
            </h2>

            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl">
              Cẩm nang thực chiến dài 45 trang được đội ngũ chuyên gia tài chính Halo Finance đúc kết: phương pháp phân bổ thu nhập 6 chiếc lọ cải tiến, chiến lược trả nợ tuyết lăn và cách tạo thói quen tích lũy không áp lực.
            </p>

            <div className="grid gap-2.5 sm:grid-cols-2 pt-1 text-sm font-semibold text-white/95">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-300 stroke-[3]" />
                <span>File PDF độ phân giải cao gửi về email</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-300 stroke-[3]" />
                <span>Tặng thêm 30 ngày trải nghiệm Premium AI</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-300 stroke-[3]" />
                <span>Mẫu bảng tính ngân sách 50/30/20</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-300 stroke-[3]" />
                <span>Hoàn toàn miễn phí, không cam kết</span>
              </div>
            </div>
          </div>

          {/* Right Lead Capture Card */}
          <div className="lg:col-span-5">
            <div className="rounded-[2rem] border border-white/20 bg-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-400 text-slate-950 shadow-lg">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Đăng ký thành công!</h3>
                  <p className="text-sm text-white/90 leading-relaxed">
                    Ebook và mã kích hoạt Premium 30 ngày đã được gửi tới hòm thư <strong className="text-amber-300 font-bold">{email}</strong>. Vui lòng kiểm tra hộp thư đến (hoặc hòm thư Spam) nhé!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-white/15 pb-4">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400 text-slate-950 font-black">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-extrabold text-white">Nhận tài liệu ngay</p>
                      <p className="text-xs text-white/70">Hơn 12.000+ người đã tải trong tháng này</p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lead-email" className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Email nhận cẩm nang & mã kích hoạt
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vidu@gmail.com"
                      className="w-full rounded-xl border border-white/20 bg-white/15 px-4 py-3.5 text-sm text-white placeholder-white/50 focus:border-amber-300 focus:outline-hidden focus:ring-2 focus:ring-amber-300/40"
                    />
                    {error && <p className="mt-1.5 text-xs font-semibold text-rose-300">{error}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-amber-400 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-400/30 hover:bg-amber-300 transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                  >
                    <Send className="h-4 w-4" />
                    <span>Gửi cẩm nang miễn phí cho tôi</span>
                  </button>

                  <p className="text-[11px] text-center text-white/60">
                    Chúng tôi tôn trọng quyền riêng tư và cam kết không spam email của bạn.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
