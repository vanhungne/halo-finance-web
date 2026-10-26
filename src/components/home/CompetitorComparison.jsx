import { Check, X, Minus, Sparkles, Shield, Zap, FileSpreadsheet, Smartphone, BookOpen } from "lucide-react";

const COMPARISON_ROWS = [
  {
    feature: "Bóc tách hóa đơn bằng Trí Tuệ Nhân Tạo AI",
    subtitle: "Chụp ảnh bill trong 3s, tự bóc tách từng món ăn, chiết khấu và thuế VAT",
    tltc: { status: "full", text: "AI OCR tự động 3 giây, chính xác 99.4%" },
    otherApps: { status: "partial", text: "Bắt mua gói VIP mới dùng được, hay lỗi font" },
    manual: { status: "none", text: "Không có, phải gõ tay từng dòng mất thời gian" },
  },
  {
    feature: "Chia tiền quỹ nhóm & VietQR 1 chạm",
    subtitle: "Tự tính ai nợ ai với số lần chuyển khoản ít nhất, quét mã trả tiền ngay",
    tltc: { status: "full", text: "Tối ưu hóa số lệnh nợ + tạo mã VietQR 1 chạm" },
    otherApps: { status: "partial", text: "Chỉ tính số tiền, không sinh mã VietQR cá nhân" },
    manual: { status: "none", text: "Tính nhẩm dễ nhầm lẫn, tranh cãi mất lòng nhau" },
  },
  {
    feature: "Quản lý ngân sách theo quy tắc 50/30/20",
    subtitle: "Đặt hạn mức danh mục, cảnh báo thông minh khi chi tiêu vượt trần",
    tltc: { status: "full", text: "Tự động phân bổ & nhắc nhở đúng lúc" },
    otherApps: { status: "partial", text: "Bị giới hạn số lượng ví và danh mục ngân sách" },
    manual: { status: "partial", text: "Phải tự viết công thức Excel phức tạp" },
  },
  {
    feature: "Chi phí sử dụng trọn đời",
    subtitle: "Mở khóa toàn bộ tính năng cao cấp không phát sinh chi phí ẩn",
    tltc: { status: "full", text: "100% Miễn phí trọn đời (0đ)" },
    otherApps: { status: "none", text: "Thu phí theo tháng/năm (39k - 199k/tháng)" },
    manual: { status: "full", text: "Miễn phí nhưng tốn rất nhiều thời gian" },
  },
  {
    feature: "Trải nghiệm không quảng cáo rác",
    subtitle: "Giao diện thanh lịch, sạch sẽ, không có banner quảng cáo che màn hình",
    tltc: { status: "full", text: "Tuyệt đối không chèn quảng cáo" },
    otherApps: { status: "none", text: "Quảng cáo pop-up và video xuất hiện dày đặc" },
    manual: { status: "full", text: "Không có quảng cáo" },
  },
  {
    feature: "Báo cáo trực quan & Xuất file Excel/PDF",
    subtitle: "Biểu đồ thu chi tuần/tháng/năm và xuất sao kê chỉ với 1 click",
    tltc: { status: "full", text: "Xuất file Excel (XLSX) và PDF hoàn toàn 0đ" },
    otherApps: { status: "partial", text: "Tính năng xuất Excel nằm trong gói trả phí" },
    manual: { status: "full", text: "Tự lập báo cáo thủ công" },
  },
  {
    feature: "Đồng bộ đa nền tảng (Mobile App + Web)",
    subtitle: "Quản lý tiện lợi trên điện thoại iOS/Android và máy tính văn phòng",
    tltc: { status: "full", text: "Đồng bộ tức thì trên Mobile & Web Portal" },
    otherApps: { status: "partial", text: "Đa số chỉ có app mobile, không có web tiện lợi" },
    manual: { status: "none", text: "File Excel mở trên điện thoại rất khó thao tác" },
  },
  {
    feature: "Bảo mật & Quyền riêng tư dữ liệu",
    subtitle: "Mã hóa AES-256, sinh trắc học Face ID và cam kết không bán dữ liệu",
    tltc: { status: "full", text: "Mã hóa AES-256 • Cam kết 3 KHÔNG" },
    otherApps: { status: "partial", text: "Chính sách dữ liệu không rõ ràng, có quảng cáo" },
    manual: { status: "none", text: "Dễ thất lạc sổ sách hoặc mất file Excel" },
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
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-2xs">
            <Zap className="h-4 w-4 text-blue-600" />
            <span>So Sánh Minh Bạch</span>
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-4xl text-slate-900">
            Tại Sao Nên Chọn{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Trợ Lý Tài Chính
            </span>
            ?
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base leading-relaxed">
            Xem ngay bảng so sánh chi tiết giữa Trợ Lý Tài Chính với phương pháp ghi chép thủ công và các ứng dụng thu phí trên thị trường.
          </p>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs font-bold text-blue-700 sm:hidden bg-blue-50/90 py-2.5 px-4 rounded-xl border border-blue-200">
          <span>Vuốt ngang để so sánh các tiêu chí</span>
        </div>

        {/* Responsive Comparison Table Container */}
        <div className="mt-6 sm:mt-12 overflow-x-auto rounded-[2rem] border border-slate-200/90 bg-white p-3 shadow-xl sm:p-6">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs sm:text-sm uppercase tracking-wider">
                <th className="py-4 px-4 font-bold text-slate-500 w-[34%]">Tiêu chí tính năng</th>

                {/* Trợ Lý Tài Chính Column Header - Highlighted */}
                <th className="py-4 px-4 bg-gradient-to-b from-blue-50/90 to-blue-100/50 rounded-t-2xl border-t-2 border-x border-blue-600 w-[26%] text-blue-900 font-black">
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-blue-600 text-white font-extrabold text-xs shadow-xs">
                      TL
                    </span>
                    <span className="text-sm">Trợ Lý Tài Chính</span>
                  </div>
                  <div className="text-[11px] font-bold text-emerald-600 mt-1 uppercase tracking-wider">
                    ★ 100% Miễn Phí Trọn Đời
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
