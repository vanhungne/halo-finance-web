import { Check, X, Minus, Sparkles, Shield, Zap, Building2, Landmark, Smartphone, FileSpreadsheet, ArrowRight } from "lucide-react";

const COMPARISON_ROWS = [
  {
    feature: "Mở tài khoản & Định danh eKYC số đẹp",
    subtitle: "Xác thực CCCD gắn chip & FaceID online 100% không cần ra quầy",
    tltc: { status: "full", text: "Online 60s, chọn số đẹp 0đ" },
    tradBank: { status: "partial", text: "Phải ra quầy xếp hàng, thủ tục giấy tờ" },
    otherApps: { status: "none", text: "Chỉ ghi chép ảo, không có tài khoản" },
    manual: { status: "none", text: "Không hỗ trợ" },
  },
  {
    feature: "Gom dòng tiền 54+ Ngân hàng liên kết (NAPAS)",
    subtitle: "Quản lý tập trung Vietcombank, Techcombank, MB, VPB trên 1 màn hình",
    tltc: { status: "full", text: "Hub gom tự động 54+ ngân hàng" },
    tradBank: { status: "none", text: "Chỉ xem được tài khoản nội bộ ngân hàng đó" },
    otherApps: { status: "none", text: "Phải tự nhập tay từng giao dịch" },
    manual: { status: "none", text: "Tự tải sao kê về gõ lại" },
  },
  {
    feature: "Bóc tách hóa đơn ăn uống/siêu thị bằng Trí Tuệ Nhân Tạo AI",
    subtitle: "Chụp ảnh bill trong 3s, tự bóc tách từng món ăn, chiết khấu và thuế VAT",
    tltc: { status: "full", text: "AI OCR Đa Tầng nhận diện chính xác 100%" },
    tradBank: { status: "none", text: "Không có tính năng bóc tách hóa đơn" },
    otherApps: { status: "partial", text: "Chỉ đọc tổng tiền, hay lỗi font chữ" },
    manual: { status: "none", text: "Tự gõ từng dòng rất tốn thời gian" },
  },
  {
    feature: "Chia tiền nhóm & Tạo mã VietQR thanh toán 1 chạm",
    subtitle: "Tự tính ai nợ ai số lần chuyển ít nhất, quét mã QR trả tiền ngay",
    tltc: { status: "full", text: "Thuật toán tối ưu + VietQR động 1 chạm" },
    tradBank: { status: "partial", text: "Phải hỏi số tài khoản từng người, chuyển tay" },
    otherApps: { status: "partial", text: "Chỉ tính số tiền, không có mã VietQR" },
    manual: { status: "none", text: "Tính tay dễ nhầm lẫn, mất tình cảm" },
  },
  {
    feature: "Biểu phí quản lý & Dịch vụ số",
    subtitle: "Phí mở tài khoản, phí chuyển tiền NAPAS 24/7 và phí thường niên",
    tltc: { status: "full", text: "0đ Phí trọn đời, 0đ SMS, 0đ chuyển tiền" },
    tradBank: { status: "partial", text: "Thu phí SMS 11k-55k/tháng, phí duy trì" },
    otherApps: { status: "none", text: "Thu phí theo tháng hoặc chèn quảng cáo phiền toái" },
    manual: { status: "full", text: "Miễn phí nhưng tốn nhiều thời gian" },
  },
  {
    feature: "Cổng Web Internet Banking đa thiết bị (PC + Mobile)",
    subtitle: "Làm việc linh hoạt trên máy tính văn phòng và điện thoại cá nhân",
    tltc: { status: "full", text: "Web Portal chuyên nghiệp + App Mobile" },
    tradBank: { status: "partial", text: "Web thường nặng, giao diện cũ kỹ" },
    otherApps: { status: "none", text: "Đa số chỉ có app điện thoại" },
    manual: { status: "partial", text: "Excel xem trên điện thoại rất khó thao tác" },
  },
  {
    feature: "Bảo mật & Tuân thủ an ninh số quốc tế",
    subtitle: "Mã hóa AES-256, TLS 1.3, chuẩn PCI-DSS Level 1 & ISO 27001",
    tltc: { status: "full", text: "PCI-DSS Level 1 & Tuân thủ NĐ 13" },
    tradBank: { status: "full", text: "Chuẩn an ninh ngân hàng" },
    otherApps: { status: "partial", text: "Chính sách dữ liệu không rõ ràng" },
    manual: { status: "none", text: "Dễ thất lạc sổ sách hoặc mất file" },
  },
];

export default function CompetitorComparison() {
  return (
    <section id="comparison" className="relative overflow-hidden bg-slate-50/70 py-24 sm:py-32 text-slate-900 border-t border-slate-200/80">
      {/* Background soft ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[750px] rounded-full bg-blue-100/40 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-blue-700 shadow-2xs">
            <Zap className="h-4 w-4 text-blue-600" />
            <span>Ma Trận Năng Lực So Sánh Trực Tiếp</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl text-slate-900">
            Trợ Lý Tài Chính Khác Gì So Với{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Ngân Hàng Truyền Thống
            </span>
            ?
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Sự kết hợp hoàn hảo giữa công nghệ AI thế hệ mới và tính toàn diện của một định chế ngân hàng số hiện đại.
          </p>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="mt-8 flex items-center justify-center gap-1.5 text-xs font-bold text-blue-700 sm:hidden bg-blue-50/90 py-2.5 px-4 rounded-xl border border-blue-200">
          <ArrowRight className="w-3.5 h-3.5 animate-pulse text-blue-600" />
          <span>Vuốt ngang bảng để so sánh chi tiết các tiêu chí</span>
        </div>

        {/* Responsive Comparison Table Container */}
        <div className="mt-6 sm:mt-14 overflow-x-auto rounded-[2rem] border border-slate-200/90 bg-white p-3 shadow-xl sm:p-6">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs sm:text-sm uppercase tracking-wider">
                <th className="py-4 px-4 font-bold text-slate-500 w-[30%]">Tiêu chí năng lực</th>
                <th className="py-4 px-4 font-black text-blue-700 bg-blue-50/90 rounded-t-2xl text-center w-[28%] border-x-2 border-t-2 border-blue-500/40">
                  <div className="flex items-center justify-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="text-sm sm:text-base">Trợ Lý Tài Chính</span>
                  </div>
                  <span className="text-[10px] lowercase font-extrabold text-blue-600 block mt-0.5">Thế hệ Ngân hàng số 2.0</span>
                </th>
                <th className="py-4 px-3 font-semibold text-slate-600 text-center w-[16%]">
                  <span className="block font-bold">Ngân Hàng Truyền Thống</span>
                  <span className="text-[10px] text-slate-400 lowercase font-normal">App đơn lẻ</span>
                </th>
                <th className="py-4 px-3 font-semibold text-slate-600 text-center w-[13%]">
                  <span className="block font-bold">App Ghi Chép Cũ</span>
                  <span className="text-[10px] text-slate-400 lowercase font-normal">Sổ thu chi</span>
                </th>
                <th className="py-4 px-3 font-semibold text-slate-600 text-center w-[13%]">
                  <span className="block font-bold">Excel / Sổ Tay</span>
                  <span className="text-[10px] text-slate-400 lowercase font-normal">Thủ công</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {COMPARISON_ROWS.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-4 font-semibold text-slate-700">
                    <div className="font-bold text-slate-900 text-sm sm:text-base">{row.feature}</div>
                    <div className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">{row.subtitle}</div>
                  </td>

                  {/* Trợ Lý Tài Chính Highlight Column */}
                  <td className="py-4 px-4 bg-blue-50/40 border-x-2 border-blue-500/30 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-white font-black shadow-md shadow-blue-500/25">
                        <Check className="h-4 w-4 stroke-[3]" />
                      </span>
                      <span className="text-xs font-black text-blue-900">{row.tltc.text}</span>
                    </div>
                  </td>

                  {/* Ngân hàng truyền thống */}
                  <td className="py-4 px-3 text-center text-slate-600">
                    <div className="flex flex-col items-center justify-center gap-1">
                      {row.tradBank.status === "full" ? (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-emerald-600 font-bold">
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        </span>
                      ) : row.tradBank.status === "partial" ? (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-50 text-amber-600 font-bold">
                          <Minus className="h-3.5 w-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-50 text-rose-500">
                          <X className="h-4 w-4" />
                        </span>
                      )}
                      <span className="text-[11px] font-medium text-slate-600">{row.tradBank.text}</span>
                    </div>
                  </td>

                  {/* App ghi chép cũ */}
                  <td className="py-4 px-3 text-center text-slate-600">
                    <div className="flex flex-col items-center justify-center gap-1">
                      {row.otherApps.status === "full" ? (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-emerald-600 font-bold">
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        </span>
                      ) : row.otherApps.status === "partial" ? (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-50 text-amber-600 font-bold">
                          <Minus className="h-3.5 w-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-50 text-rose-500">
                          <X className="h-4 w-4" />
                        </span>
                      )}
                      <span className="text-[11px] font-medium text-slate-600">{row.otherApps.text}</span>
                    </div>
                  </td>

                  {/* Excel / Sổ tay */}
                  <td className="py-4 px-3 text-center text-slate-600">
                    <div className="flex flex-col items-center justify-center gap-1">
                      {row.manual.status === "full" ? (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-emerald-600 font-bold">
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        </span>
                      ) : row.manual.status === "partial" ? (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-50 text-amber-600 font-bold">
                          <Minus className="h-3.5 w-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-50 text-rose-500">
                          <X className="h-4 w-4" />
                        </span>
                      )}
                      <span className="text-[11px] font-medium text-slate-600">{row.manual.text}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Banner Note */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-slate-900 text-white p-5 sm:p-6 shadow-md">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
              <Shield className="h-5 w-5" />
            </span>
            <div>
              <p className="font-extrabold text-sm sm:text-base">Trải nghiệm vượt trội không rủi ro</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Đăng ký tài khoản trong 60 giây. Toàn bộ tính năng nền tảng hoàn toàn miễn phí trọn đời.
              </p>
            </div>
          </div>
          <a
            href="#home"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-black text-white hover:bg-blue-500 transition shrink-0"
          >
            <span>Mở Tài Khoản Ngay</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          </a>
        </div>
      </div>
    </section>
  );
}
