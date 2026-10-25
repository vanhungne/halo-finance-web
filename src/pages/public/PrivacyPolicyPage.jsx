import React from "react";
import Header from "../../components/header/headerComp.jsx";
import Footer from "../../components/footer/Footer.jsx";
import { ShieldCheck, Lock, UserCheck, EyeOff, FileText, Database, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="h-6 w-6" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Chính Sách & Tiêu Chuẩn Bảo Mật
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Chính Sách Bảo Mật Quyền Riêng Tư
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Cập nhật lần cuối: Tháng 10/2026 | Tuân thủ Nghị định 13/2023/NĐ-CP, Apple App Store & Google Play Data Safety
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-3">
              <UserCheck className="h-5 w-5 text-sky-400" />
              1. Giới thiệu & Cam kết bảo vệ dữ liệu
            </h2>
            <p>
              Ứng dụng <strong>Trợ Lý Tài Chính</strong> (thuộc sở hữu và vận hành bởi đội ngũ phát triển Trợ Lý Tài Chính) cam kết tuyệt đối tôn trọng và bảo vệ quyền riêng tư cá nhân của người sử dụng. Chúng tôi áp dụng các nguyên tắc quản trị dữ liệu minh bạch, chỉ thu thập những dữ liệu cần thiết để phục vụ trực tiếp cho trải nghiệm quản lý thu chi cá nhân của bạn, và <strong>tuyệt đối không kinh doanh, bán hoặc chia sẻ dữ liệu người dùng cho bất kỳ bên thứ ba nào vì mục đích quảng cáo/thương mại</strong>.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-3">
              <Database className="h-5 w-5 text-sky-400" />
              2. Dữ liệu chúng tôi thu thập và lý do thu thập
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white">a. Thông tin tài khoản định danh:</h3>
                <p className="text-slate-300 mt-1">
                  Khi bạn đăng ký tài khoản qua Email hoặc Google: Họ tên hiển thị, địa chỉ email và ảnh đại diện (avatar). Thông tin này được sử dụng để xác thực danh tính, bảo vệ tài khoản và khôi phục mật khẩu.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white">b. Dữ liệu giao dịch & tài chính cá nhân:</h3>
                <p className="text-slate-300 mt-1">
                  Số tiền thu chi, hạng mục chi tiêu, thời gian, ghi chú, thông tin ví tiền, ngân sách chi tiêu và quỹ chung/quỹ nhóm. Dữ liệu này được xử lý nhằm hiển thị thống kê biểu đồ dòng tiền, phân tích hạn mức chi tiêu và hỗ trợ bạn ra quyết định tài chính cá nhân.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white">c. Quyền truy cập thiết bị (Chỉ khi người dùng chủ động cho phép):</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-300">
                  <li>
                    <strong>Camera (Máy ảnh):</strong> Chỉ sử dụng khi bạn chủ động quét mã QR nhóm/quỹ để tham gia hoặc chụp ảnh hóa đơn phục vụ bóc tách thu chi tự động (OCR). Chúng tôi không âm thầm chụp ảnh hay bật camera nền.
                  </li>
                  <li>
                    <strong>Thư viện ảnh (Photos / Media Library):</strong> Chỉ truy cập ảnh hóa đơn cụ thể do bạn chọn từ thư viện để tải lên bóc tách hoặc lưu ảnh QR thanh toán khi bạn bấm lưu.
                  </li>
                  <li>
                    <strong>Microphone (Micro ghi âm):</strong> Chỉ kích hoạt khi bạn chủ động bấm và giữ nút ghi âm giọng nói để trợ lý ảo nhận diện câu lệnh thu chi (Speech-to-Text). Ứng dụng không bao giờ thu âm nền.
                  </li>
                  <li>
                    <strong>Thông báo đẩy (Push Notifications):</strong> Để gửi lời nhắc ghi chép thu chi hàng ngày, thông báo biến động số dư quỹ nhóm mà bạn tham gia. Bạn có thể tắt thông báo bất cứ lúc nào trong Cài đặt điện thoại.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-3">
              <Lock className="h-5 w-5 text-sky-400" />
              3. Tiêu chuẩn bảo mật dữ liệu
            </h2>
            <p>
              Toàn bộ dữ liệu trao đổi giữa thiết bị người dùng và máy chủ đều được mã hóa bằng giao thức bảo mật cao cấp <strong>HTTPS / TLS 1.3</strong>. Dữ liệu nhạy cảm được bảo vệ nghiêm ngặt theo các tiêu chuẩn bảo mật hiện đại, phòng chống rò rỉ dữ liệu hoặc tấn công mạng.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-3">
              <EyeOff className="h-5 w-5 text-sky-400" />
              4. Quyền của người dùng & Xóa vĩnh viễn tài khoản (Account Deletion)
            </h2>
            <p className="mb-3">
              Tuân thủ chính sách nghiêm ngặt của Apple App Store (Guideline 5.1.1) và Google Play Data Safety, chúng tôi trao cho bạn toàn quyền kiểm soát dữ liệu của chính mình:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>
                <strong>Xem và chỉnh sửa:</strong> Bạn có thể xem, chỉnh sửa toàn bộ thông tin cá nhân, sửa/xóa từng giao dịch thu chi bất kỳ lúc nào trong ứng dụng.
              </li>
              <li>
                <strong>Xóa tài khoản ngay trong ứng dụng:</strong> Bạn có thể vào <em>Cài đặt &gt; Xóa tài khoản</em>. Sau khi xác nhận mật khẩu, tài khoản cùng toàn bộ lịch sử giao dịch, ví tiền, ảnh hóa đơn liên quan sẽ bị xóa khỏi hệ thống.
              </li>
              <li>
                <strong>Yêu cầu xóa tài khoản qua Web:</strong> Nếu bạn đã gỡ cài đặt ứng dụng hoặc không có thiết bị, bạn có thể gửi yêu cầu xóa tài khoản trực tiếp qua trang trực tuyến của chúng tôi tại:{" "}
                <Link to="/delete-account" className="text-sky-400 underline font-semibold hover:text-sky-300">
                  https://trolytaichinh.vn/delete-account
                </Link>
                . Yêu cầu của bạn sẽ được xác nhận và xóa sạch khỏi máy chủ trong vòng tối đa 30 ngày.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-3">
              <FileText className="h-5 w-5 text-sky-400" />
              5. Thay đổi chính sách & Thông tin liên hệ
            </h2>
            <p className="mb-3">
              Chính sách bảo mật này có thể được cập nhật theo thời gian để đáp ứng các quy định pháp luật mới hoặc thay đổi tính năng ứng dụng. Mọi cập nhật sẽ được thông báo rõ ràng trên ứng dụng và website.
            </p>
            <p>
              Nếu bạn có bất kỳ câu hỏi nào liên quan đến chính sách bảo mật hoặc việc xử lý dữ liệu cá nhân, vui lòng liên hệ:
            </p>
            <div className="mt-3 rounded-xl bg-slate-950/80 p-4 border border-slate-800/80 text-xs">
              <p><strong>Bộ phận Bảo vệ Dữ liệu - Trợ Lý Tài Chính</strong></p>
              <p className="mt-1">Email hỗ trợ: <a href="mailto:hotro.trolytaichinh@gmail.com" className="text-sky-400">hotro.trolytaichinh@gmail.com</a></p>
              <p>Email liên hệ ban quản trị: <a href="mailto:contact@trolytaichinh.vn" className="text-sky-400">contact@trolytaichinh.vn</a></p>
              <p>Website: <a href="https://trolytaichinh.vn" className="text-sky-400">https://trolytaichinh.vn</a></p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
