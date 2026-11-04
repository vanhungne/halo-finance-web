import { useState } from "react";
import Header from "../../components/header/headerComp.jsx";
import Footer from "../../components/footer/Footer.jsx";
import QrDownloadModal from "../../components/home/QrDownloadModal.jsx";
import { ShieldAlert, Scale, HelpCircle, FileCheck } from "lucide-react";
import "../../styles/landingTheme.css";

export default function TermsOfServicePage() {
  const [qrModalOpen, setQrModalOpen] = useState(false);

  return (
    <div className="landing-page min-h-screen bg-slate-50/60 text-slate-900 flex flex-col justify-between">
      <Header
        onOpenQr={() => setQrModalOpen(true)}
      />

      <main className="relative z-10 mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Page Hero Header */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black text-slate-950 tracking-tight leading-tight title-3d">
            Điều Khoản Sử Dụng Dịch Vụ
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            Cập nhật lần cuối: Tháng 10/2026 | Áp dụng cho ứng dụng di động & website Trợ Lý Tài Chính
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-6 sm:space-y-8 text-sm leading-relaxed text-slate-600">
          {/* Section 1 */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="flex items-center gap-3 text-lg sm:text-xl font-bold text-slate-950 mb-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <Scale className="h-5 w-5" />
              </span>
              1. Chấp thuận các điều khoản
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Bằng việc tải, cài đặt hoặc sử dụng ứng dụng <strong className="font-semibold text-slate-900">Trợ Lý Tài Chính</strong> hoặc truy cập website <strong className="font-semibold text-slate-900">trolytaichinh.vn</strong>, bạn đồng ý tuân thủ và chịu sự ràng buộc của các Điều khoản Sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản, vui lòng ngừng sử dụng ứng dụng và dịch vụ của chúng tôi.
            </p>
          </section>

          {/* Section 2 */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="flex items-center gap-3 text-lg sm:text-xl font-bold text-slate-950 mb-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <FileCheck className="h-5 w-5" />
              </span>
              2. Quyền và trách nhiệm của người sử dụng
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-blue-500">
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

          {/* Section 3 */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 sm:p-8 shadow-xs">
            <h2 className="flex items-center gap-3 text-lg sm:text-xl font-bold text-amber-950 mb-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </span>
              3. Tuyên bố miễn trừ trách nhiệm về tư vấn đầu tư
            </h2>
            <p className="mb-2 text-amber-950 font-semibold">
              Trợ Lý Tài Chính là công cụ hỗ trợ ghi chép, thống kê và quản lý tài chính cá nhân.
            </p>
            <p className="text-amber-900/80 leading-relaxed">
              Các biểu đồ, phân tích hoặc số liệu dự báo hiển thị trong ứng dụng chỉ mang tính chất tham khảo dựa trên dữ liệu bạn nhập vào, <strong className="font-semibold text-amber-950">không cấu thành bất kỳ lời khuyên đầu tư tài chính, chứng khoán hay cam kết lợi nhuận nào</strong>. Bạn hoàn toàn chịu trách nhiệm đối với các quyết định chi tiêu và đầu tư của chính mình.
            </p>
          </section>

          {/* Section 4 */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="flex items-center gap-3 text-lg sm:text-xl font-bold text-slate-950 mb-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <HelpCircle className="h-5 w-5" />
              </span>
              4. Sở hữu trí tuệ & Thay đổi điều khoản
            </h2>
            <p className="mb-3 text-slate-600 leading-relaxed">
              Mọi nhãn hiệu, giao diện, mã nguồn, biểu tượng và đồ họa liên quan đến Trợ Lý Tài Chính thuộc quyền sở hữu trí tuệ độc quyền của chúng tôi. Nghiêm cấm mọi hành vi sao chép, đảo ngược kỹ thuật hoặc phân phối lại khi chưa có sự đồng ý bằng văn bản.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Chúng tôi có quyền điều chỉnh nội dung Điều khoản Sử dụng để phù hợp với quy định pháp luật hiện hành và sự phát triển của sản phẩm. Việc bạn tiếp tục sử dụng ứng dụng sau khi các điều khoản được sửa đổi đồng nghĩa với việc bạn chấp thuận các nội dung mới đó.
            </p>
          </section>
        </div>
      </main>

      <Footer
        onOpenQr={() => setQrModalOpen(true)}
      />

      {/* Modals */}
      <QrDownloadModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
    </div>
  );
}
