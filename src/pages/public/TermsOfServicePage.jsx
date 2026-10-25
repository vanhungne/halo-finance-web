import React from "react";
import Header from "../../components/header/headerComp.jsx";
import Footer from "../../components/footer/Footer.jsx";
import { FileCheck, ShieldAlert, Scale, HelpCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại trang chủ
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <FileCheck className="h-6 w-6" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Quy Định & Pháp Lý
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Điều Khoản Sử Dụng Dịch Vụ
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Cập nhật lần cuối: Tháng 10/2026 | Áp dụng cho ứng dụng di động & website Trợ Lý Tài Chính
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-3">
              <Scale className="h-5 w-5 text-sky-400" />
              1. Chấp thuận các điều khoản
            </h2>
            <p>
              Bằng việc tải, cài đặt hoặc sử dụng ứng dụng <strong>Trợ Lý Tài Chính</strong> hoặc truy cập website trolytaichinh.vn, bạn đồng ý tuân thủ và chịu sự ràng buộc của các Điều khoản Sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản, vui lòng ngừng sử dụng ứng dụng và dịch vụ của chúng tôi.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-3">
              <FileCheck className="h-5 w-5 text-sky-400" />
              2. Quyền và trách nhiệm của người sử dụng
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>
                Bạn có trách nhiệm bảo mật thông tin đăng nhập tài khoản (email, mật khẩu). Mọi hoạt động phát sinh từ tài khoản của bạn sẽ do bạn chịu trách nhiệm hoàn toàn.
              </li>
              <li>
                Bạn cam kết sử dụng ứng dụng vào mục đích quản lý tài chính cá nhân hợp pháp, không sử dụng ứng dụng cho các hành vi vi phạm pháp luật, gian lận, rửa tiền hoặc phá hoại hệ thống kỹ thuật.
              </li>
              <li>
                Người dùng có quyền chủ động ngừng sử dụng dịch vụ và yêu cầu xóa tài khoản cùng toàn bộ dữ liệu cá nhân bất cứ lúc nào.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-3">
              <ShieldAlert className="h-5 w-5 text-amber-400" />
              3. Tuyên bố miễn trừ trách nhiệm về tư vấn đầu tư
            </h2>
            <p className="mb-2">
              <strong>Trợ Lý Tài Chính là công cụ hỗ trợ ghi chép, thống kê và quản lý tài chính cá nhân.</strong>
            </p>
            <p>
              Các biểu đồ, phân tích hoặc số liệu dự báo hiển thị trong ứng dụng chỉ mang tính chất tham khảo dựa trên dữ liệu bạn nhập vào, <strong>không cấu thành bất kỳ lời khuyên đầu tư tài chính, chứng khoán hay cam kết lợi nhuận nào</strong>. Bạn hoàn toàn chịu trách nhiệm đối với các quyết định chi tiêu và đầu tư của chính mình.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-3">
              <HelpCircle className="h-5 w-5 text-sky-400" />
              4. Sở hữu trí tuệ & Thay đổi điều khoản
            </h2>
            <p className="mb-3">
              Mọi nhãn hiệu, giao diện, mã nguồn, biểu tượng và đồ họa liên quan đến Trợ Lý Tài Chính thuộc quyền sở hữu trí tuệ độc quyền của chúng tôi. Nghiêm cấm mọi hành vi sao chép, đảo ngược kỹ thuật hoặc phân phối lại khi chưa có sự đồng ý bằng văn bản.
            </p>
            <p>
              Chúng tôi có quyền điều chỉnh nội dung Điều khoản Sử dụng để phù hợp với quy định pháp luật hiện hành và sự phát triển của sản phẩm. Việc bạn tiếp tục sử dụng ứng dụng sau khi các điều khoản được sửa đổi đồng nghĩa với việc bạn chấp thuận các nội dung mới đó.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
