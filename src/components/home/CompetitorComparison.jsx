import { Check, X, Minus, Sparkles, Shield, Zap, FileSpreadsheet, Smartphone, BookOpen } from "lucide-react";

const COMPARISON_ROWS = [
  {
    feature: "Quét & bóc tách hóa đơn bằng AI",
    subtitle: "Chụp ảnh bill ăn uống, mua sắm; AI tự điền tên món, số tiền và ngày giờ",
    tltc: { status: "full", text: "Tự động nhận diện trong 3 giây, không cần gõ tay" },
    otherApps: { status: "partial", text: "Thường giới hạn lượt quét hoặc chỉ có ở bản trả phí" },
    manual: { status: "none", text: "Phải tự nhìn hóa đơn và gõ tay từng khoản chi" },
  },
  {
    feature: "Chia tiền nhóm & Tạo mã VietQR trả nợ",
    subtitle: "Tính toán số tiền từng người, chia đều hoặc theo tỷ lệ linh hoạt",
    tltc: { status: "full", text: "Tự tính bù trừ ít lần chuyển nhất + có mã VietQR quét trả ngay" },
    otherApps: { status: "partial", text: "Chỉ tính số tiền, phải tự hỏi số tài khoản và tự nhập tiền chuyển" },
    manual: { status: "none", text: "Dễ tính nhầm, phải nhắn tin qua lại nhiều lần để chốt tiền" },
  },
  {
    feature: "Quản lý ngân sách & Hạn mức chi tiêu",
    subtitle: "Đặt giới hạn chi tiêu theo danh mục (như 50/30/20) để tránh 'cháy túi'",
    tltc: { status: "full", text: "Cảnh báo trực quan khi chi tiêu chạm ngưỡng ngân sách" },
    otherApps: { status: "partial", text: "Bị giới hạn số ví hoặc số danh mục ở bản miễn phí" },
    manual: { status: "partial", text: "Phải tự nhớ hoặc tự lập công thức tính toán thủ công" },
  },
  {
    feature: "Chi phí sử dụng",
    subtitle: "Mở đầy đủ mọi tính năng, không có gói tính phí hay chi phí ẩn",
    tltc: { status: "full", text: "100% Hoàn toàn miễn phí cho mọi người dùng" },
    otherApps: { status: "none", text: "Thu phí theo gói tháng/năm (39.000đ – 199.000đ/tháng)" },
    manual: { status: "full", text: "Không tốn tiền mua ứng dụng nhưng mất nhiều thời gian" },
  },
  {
    feature: "Trải nghiệm không quảng cáo",
    subtitle: "Giao diện gọn gàng, tập trung hoàn toàn vào việc quản lý tài chính",
    tltc: { status: "full", text: "Cam kết không chèn banner hay video quảng cáo làm phiền" },
    otherApps: { status: "none", text: "Thường xuyên hiện banner hoặc video quảng cáo ngắt quãng" },
    manual: { status: "full", text: "Không có quảng cáo" },
  },
  {
    feature: "Báo cáo trực quan & Xuất file Excel, PDF",
    subtitle: "Biểu đồ thu chi theo thời gian, danh mục và sao kê chi tiết",
    tltc: { status: "full", text: "Xem biểu đồ trực quan, xuất file Excel và PDF không giới hạn" },
    otherApps: { status: "partial", text: "Tính năng xuất file Excel thường yêu cầu trả phí" },
    manual: { status: "full", text: "Mất nhiều công sức tự tổng hợp số liệu và vẽ biểu đồ" },
  },
  {
    feature: "Đồng bộ đa nền tảng (Điện thoại & Máy tính)",
    subtitle: "Ghi chép nhanh trên app di động, đối soát thoải mái trên web máy tính",
    tltc: { status: "full", text: "Đồng bộ tức thì giữa Mobile App (iOS/Android) và Web Portal" },
    otherApps: { status: "partial", text: "Chủ yếu chỉ có trên điện thoại, thiếu giao diện web khi ngồi làm việc" },
    manual: { status: "none", text: "File Excel mở trên điện thoại rất bất tiện và dễ lỗi hiển thị" },
  },
  {
    feature: "Bảo mật & Quyền riêng tư dữ liệu",
    subtitle: "Dữ liệu tài chính thuộc về riêng bạn, có bảo mật vân tay và Face ID",
    tltc: { status: "full", text: "Mã hóa tiêu chuẩn cao, cam kết không bán dữ liệu người dùng" },
    otherApps: { status: "partial", text: "Chính sách dữ liệu chưa rõ ràng, có thể chia sẻ cho bên thứ ba" },
    manual: { status: "none", text: "Nguy cơ mất trắng nếu hỏng ổ cứng, xóa nhầm file hoặc mất sổ" },
  },
];

export default function CompetitorComparison() {
  return (
    <section id="comparison" className="relative overflow-hidden bg-slate-50/70 py-20 sm:py-28 text-slate-900 border-t border-slate-200/80">
      {/* Background soft ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[750px] rounded-full bg-blue-100/40 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-[2.65rem] text-slate-950 title-3d">
            Tại Sao Nên Chọn Trợ Lý Tài Chính?
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base leading-relaxed">
            Bảng so sánh chi tiết giữa Trợ Lý Tài Chính với phương pháp ghi chép truyền thống và các ứng dụng có phí trên thị trường — giúp bạn dễ dàng chọn giải pháp phù hợp nhất.
          </p>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs font-bold text-blue-700 sm:hidden bg-blue-50/90 py-2.5 px-4 rounded-xl border border-blue-200">
          <span>Vuốt ngang để so sánh các tiêu chí</span>
        </div>

        {/* Responsive Comparison Table Container - Sharp Square Corners (rounded-none) */}
        <p className="mt-5 text-sm text-slate-600 sm:hidden">Lướt ngang để xem đầy đủ bảng so sánh.</p>
        <div role="region" aria-label="Bảng so sánh tính năng" tabIndex={0} className="mt-3 sm:mt-12 overflow-x-auto overscroll-x-contain rounded-none border border-slate-200/90 bg-white p-3 shadow-lg sm:p-6">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs sm:text-sm uppercase tracking-wider">
                <th className="py-4 px-4 font-bold text-slate-500 w-[34%]">Tiêu chí tính năng</th>

                {/* Trợ Lý Tài Chính Column Header - Highlighted */}
                <th className="py-4 px-4 bg-gradient-to-b from-blue-50/90 to-blue-100/40 border-x border-blue-200/60 w-[26%] text-blue-900 font-black">
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-md bg-blue-600 text-white font-extrabold text-xs shadow-xs">
                      TL
                    </span>
                    <span className="text-sm">Trợ Lý Tài Chính</span>
                  </div>
                  <div className="text-[11px] font-bold text-emerald-600 mt-1 uppercase tracking-wider">
                    ★ 100% Hoàn Toàn Miễn Phí
                  </div>
                </th>

                {/* Other Apps Column */}
                <th className="py-4 px-4 text-slate-700 font-bold w-[20%]">
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-slate-400" />
                    <span>App Thu Phí Khác</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-400 mt-1 normal-case">
                    Money Lover, MISA...
                  </div>
                </th>

                {/* Manual Excel Column */}
                <th className="py-4 px-4 text-slate-700 font-bold w-[20%]">
                  <div className="flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                    <span>Ghi Sổ / Excel</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-400 mt-1 normal-case">
                    Ghi chép thủ công
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-50/60 transition-colors">
                  {/* Feature & Description */}
                  <td className="py-4 px-4 align-top">
                    <strong className="block text-slate-900 font-bold text-[13.5px]">
                      {row.feature}
                    </strong>
                    <span className="block text-[11.5px] text-slate-500 mt-0.5 leading-relaxed font-normal">
                      {row.subtitle}
                    </span>
                  </td>

                  {/* Trợ Lý Tài Chính Value - Highlighted Column */}
                  <td className="py-4 px-4 align-top bg-blue-50/40 border-x border-blue-600/20 font-semibold text-slate-900">
                    <div className="flex items-start gap-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500 text-white mt-0.5 shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                      <span className="text-xs sm:text-sm text-blue-950 font-bold">
                        {row.tltc.text}
                      </span>
                    </div>
                  </td>

                  {/* Other Apps Value */}
                  <td className="py-4 px-4 align-top text-slate-600">
                    <div className="flex items-start gap-2">
                      {row.otherApps.status === "full" ? (
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </span>
                      ) : row.otherApps.status === "partial" ? (
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700 mt-0.5">
                          <Minus className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600 mt-0.5">
                          <X className="w-3 h-3 stroke-[2.5]" />
                        </span>
                      )}
                      <span className="text-xs leading-relaxed text-slate-600">
                        {row.otherApps.text}
                      </span>
                    </div>
                  </td>

                  {/* Manual / Excel Value */}
                  <td className="py-4 px-4 align-top text-slate-600">
                    <div className="flex items-start gap-2">
                      {row.manual.status === "full" ? (
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </span>
                      ) : row.manual.status === "partial" ? (
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700 mt-0.5">
                          <Minus className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-500 mt-0.5">
                          <X className="w-3 h-3 stroke-[2.5]" />
                        </span>
                      )}
                      <span className="text-xs leading-relaxed text-slate-500">
                        {row.manual.text}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
