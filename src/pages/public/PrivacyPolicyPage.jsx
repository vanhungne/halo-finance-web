import { useState } from "react";
import Header from "../../components/header/headerComp.jsx";
import Footer from "../../components/footer/Footer.jsx";
import QrDownloadModal from "../../components/home/QrDownloadModal.jsx";
import { Lock, UserCheck, EyeOff, FileText, Database } from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/landingTheme.css";

export default function PrivacyPolicyPage() {
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
            Chính Sách Bảo Mật Quyền Riêng Tư
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            Cập nhật lần cuối: Tháng 10/2026 | Tuân thủ Nghị định 13/2023/NĐ-CP, Apple App Store & Google Play Data Safety
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-6 sm:space-y-8 text-sm leading-relaxed text-slate-600">
          {/* Section 1 */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="flex items-center gap-3 text-lg sm:text-xl font-bold text-slate-950 mb-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <UserCheck className="h-5 w-5" />
              </span>
              1. Giới thiệu & Cam kết bảo vệ dữ liệu
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Ứng dụng <strong className="font-semibold text-slate-900">Trợ Lý Tài Chính</strong> (thuộc sở hữu và vận hành bởi đội ngũ phát triển Trợ Lý Tài Chính) cam kết tuyệt đối tôn trọng và bảo vệ quyền riêng tư cá nhân của người sử dụng. Chúng tôi áp dụng các nguyên tắc quản trị dữ liệu minh bạch, chỉ thu thập những dữ liệu cần thiết để phục vụ trực tiếp cho trải nghiệm quản lý thu chi cá nhân của bạn, và <strong className="font-semibold text-slate-900">tuyệt đối không kinh doanh, bán hoặc chia sẻ dữ liệu người dùng cho bất kỳ bên thứ ba nào vì mục đích quảng cáo/thương mại</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="flex items-center gap-3 text-lg sm:text-xl font-bold text-slate-950 mb-4">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <Database className="h-5 w-5" />
              </span>
              2. Dữ liệu chúng tôi thu thập và lý do thu thập
            </h2>
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50/80 p-4 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">a. Thông tin tài khoản định danh:</h3>
                <p className="text-slate-600 mt-1.5 leading-relaxed">
                  Khi bạn đăng ký tài khoản qua Email hoặc Google: Họ tên hiển thị, địa chỉ email và ảnh đại diện (avatar). Thông tin này được sử dụng để xác thực danh tính, bảo vệ tài khoản và khôi phục mật khẩu.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50/80 p-4 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">b. Dữ liệu giao dịch & tài chính cá nhân:</h3>
                <p className="text-slate-600 mt-1.5 leading-relaxed">
                  Số tiền thu chi, hạng mục chi tiêu, thời gian, ghi chú, thông tin ví tiền, ngân sách chi tiêu và quỹ chung/quỹ nhóm. Dữ liệu này được xử lý nhằm hiển thị thống kê biểu đồ dòng tiền, phân tích hạn mức chi tiêu và hỗ trợ bạn ra quyết định tài chính cá nhân.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50/80 p-4 border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">c. Quyền truy cập thiết bị (Chỉ khi người dùng chủ động cho phép):</h3>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600 marker:text-blue-500">
                  <li>
                    <strong className="text-slate-800">Camera (Máy ảnh):</strong> Chỉ sử dụng khi bạn chủ động quét mã QR nhóm/quỹ để tham gia hoặc chụp ảnh hóa đơn phục vụ bóc tách thu chi tự động (OCR). Chúng tôi không âm thầm chụp ảnh hay bật camera nền.
                  </li>
                  <li>
                    <strong className="text-slate-800">Thư viện ảnh (Photos / Media Library):</strong> Chỉ truy cập ảnh hóa đơn cụ thể do bạn chọn từ thư viện để tải lên bóc tách hoặc lưu ảnh QR thanh toán khi bạn bấm lưu.
                  </li>
                  <li>
                    <strong className="text-slate-800">Microphone (Micro ghi âm):</strong> Chỉ kích hoạt khi bạn chủ động bấm và giữ nút ghi âm giọng nói để trợ lý ảo nhận diện câu lệnh thu chi (Speech-to-Text). Ứng dụng không bao giờ thu âm nền.
                  </li>
                  <li>
                    <strong className="text-slate-800">Thông báo đẩy (Push Notifications):</strong> Để gửi lời nhắc ghi chép thu chi hàng ngày, thông báo biến động số dư quỹ nhóm mà bạn tham gia. Bạn có thể tắt thông báo bất cứ lúc nào trong Cài đặt điện thoại.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="flex items-center gap-3 text-lg sm:text-xl font-bold text-slate-950 mb-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <Lock className="h-5 w-5" />
              </span>
              3. Tiêu chuẩn bảo mật dữ liệu
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Toàn bộ dữ liệu trao đổi giữa thiết bị người dùng và máy chủ đều được mã hóa bằng giao thức bảo mật cao cấp <strong className="font-semibold text-slate-900">HTTPS / TLS 1.3</strong>. Dữ liệu nhạy cảm được bảo vệ nghiêm ngặt theo các tiêu chuẩn bảo mật hiện đại chuẩn <strong className="font-semibold text-slate-900">AES-256</strong>, phòng chống rò rỉ dữ liệu hoặc tấn công mạng.
            </p>
          </section>

          {/* Section 4 */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="flex items-center gap-3 text-lg sm:text-xl font-bold text-slate-950 mb-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <EyeOff className="h-5 w-5" />
              </span>
              4. Quyền của người dùng & Xóa vĩnh viễn tài khoản (Account Deletion)
            </h2>
            <p className="text-slate-600 mb-3 leading-relaxed">
              Tuân thủ chính sách nghiêm ngặt của Apple App Store (Guideline 5.1.1) và Google Play Data Safety, chúng tôi trao cho bạn toàn quyền kiểm soát dữ liệu của chính mình:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-blue-500">
              <li>
                <strong className="text-slate-800">Xem và chỉnh sửa:</strong> Bạn có thể xem, chỉnh sửa toàn bộ thông tin cá nhân, sửa/xóa từng giao dịch thu chi bất kỳ lúc nào trong ứng dụng.
              </li>
              <li>
                <strong className="text-slate-800">Xóa tài khoản ngay trong ứng dụng:</strong> Bạn có thể vào <em>Cài đặt &gt; Xóa tài khoản</em>. Sau khi xác nhận mật khẩu, tài khoản cùng toàn bộ lịch sử giao dịch, ví tiền, ảnh hóa đơn liên quan sẽ bị xóa khỏi hệ thống.
              </li>
              <li>
                <strong className="text-slate-800">Yêu cầu xóa tài khoản qua Web:</strong> Nếu bạn đã gỡ cài đặt ứng dụng hoặc không có thiết bị, bạn có thể gửi yêu cầu xóa tài khoản trực tiếp qua trang trực tuyến của chúng tôi tại:{" "}
                <Link to="/delete-account" className="font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2">
                  Yêu Cầu Xóa Tài Khoản Trực Tuyến
                </Link>
                . Yêu cầu của bạn sẽ được xác nhận và xóa sạch khỏi máy chủ trong vòng tối đa 30 ngày.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="flex items-center gap-3 text-lg sm:text-xl font-bold text-slate-950 mb-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <FileText className="h-5 w-5" />
              </span>
              5. Thay đổi chính sách & Thông tin liên hệ
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Chính sách bảo mật này có thể được cập nhật theo thời gian để đáp ứng các quy định pháp luật mới hoặc thay đổi tính năng ứng dụng. Mọi cập nhật sẽ được thông báo rõ ràng trên ứng dụng và website.
            </p>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs sm:text-sm text-slate-700 space-y-1.5">
              <p className="font-bold text-slate-900">Bộ phận Bảo vệ Dữ liệu – Trợ Lý Tài Chính</p>
              <p>Email hỗ trợ: <a href="mailto:hotro.trolytaichinh@gmail.com" className="text-blue-600 hover:underline">hotro.trolytaichinh@gmail.com</a></p>
              <p>Email liên hệ ban quản trị: <a href="mailto:contact@trolytaichinh.vn" className="text-blue-600 hover:underline">contact@trolytaichinh.vn</a></p>
              <p>Website: <a href="https://trolytaichinh.vn" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">https://trolytaichinh.vn</a></p>
            </div>
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
