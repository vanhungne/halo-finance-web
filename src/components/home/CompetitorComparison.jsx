import { Check, X, Minus, Sparkles, Shield, Zap } from "lucide-react";

const COMPARISON_ROWS = [
  {
    feature: "Bóc tách hóa đơn bằng AI tiếng Việt",
    subtitle: "Quét bill ăn uống, siêu thị đọc rõ từng dòng món và VAT",
    halo: { status: "full", text: "Tự động 100% trong 3s (Gemini 2.0)" },
    notebook: { status: "none", text: "Thủ công hoàn toàn" },
    excel: { status: "none", text: "Tự gõ từng dòng" },
    others: { status: "partial", text: "Chỉ đọc tổng tiền, hay lỗi font" },
  },
  {
    feature: "Chia tiền nhóm & Tạo mã VietQR 1 chạm",
    subtitle: "Tự tính ai nợ ai số lần chuyển ít nhất, quét mã trả tiền ngay",
    halo: { status: "full", text: "Có sẵn thuật toán & VietQR động" },
    notebook: { status: "none", text: "Tính tay dễ nhầm lẫn" },
    excel: { status: "partial", text: "Phải tự tạo công thức phức tạp" },
    others: { status: "partial", text: "Không có mã VietQR chuyển khoản" },
  },
  {
    feature: "Đồng bộ biến động số dư ngân hàng",
    subtitle: "Tự động nhận thông báo biến động SePay & quét email giao dịch",
    halo: { status: "full", text: "Tự động hóa an toàn qua webhook" },
    notebook: { status: "none", text: "Không hỗ trợ" },
    excel: { status: "none", text: "Phải tải file sao kê về nhập" },
    others: { status: "partial", text: "Yêu cầu trả phí rất đắt" },
  },
  {
    feature: "Trợ lý giọng nói ghi chép (AI Whisper)",
    subtitle: "Nói 'Vừa ăn trưa 45 nghìn' -> Tự động thêm vào sổ thu chi",
    halo: { status: "full", text: "Nhận diện giọng nói chuẩn xác" },
    notebook: { status: "none", text: "Không hỗ trợ" },
    excel: { status: "none", text: "Không hỗ trợ" },
    others: { status: "none", text: "Không có" },
  },
  {
    feature: "Sổ nợ & Công cụ tính lãi suất vay",
    subtitle: "Theo dõi nợ nhiều đợt, tính lãi theo ngày/tháng, gửi lời nhắc",
    halo: { status: "full", text: "Tính lãi chính xác & nhắc nợ lịch sự" },
    notebook: { status: "partial", text: "Dễ quên hoặc mất sổ" },
    excel: { status: "partial", text: "Công thức tính ngày phức tạp" },
    others: { status: "partial", text: "Chỉ ghi số tiền cơ bản" },
  },
  {
    feature: "Trải nghiệm sạch — Không quảng cáo rác",
    subtitle: "Giao diện tinh tế, không popup che màn hình ép mua hàng",
    halo: { status: "full", text: "100% Không quảng cáo khó chịu" },
    notebook: { status: "full", text: "Không quảng cáo" },
    excel: { status: "full", text: "Không quảng cáo" },
    others: { status: "none", text: "Quảng cáo tràn lan che hết số liệu" },
  },
  {
    feature: "Đồng bộ đa nền tảng (Mobile App + Web Portal)",
    subtitle: "Xem trên điện thoại iPhone/Android và máy tính công ty",
    halo: { status: "full", text: "Đồng bộ đám mây tức thời" },
    notebook: { status: "none", text: "Chỉ có cuốn sổ vật lý" },
    excel: { status: "partial", text: "Xem trên điện thoại rất khó thao tác" },
    others: { status: "partial", text: "Thường chỉ có app mobile" },
  },
  {
    feature: "Bảo mật mã hóa chuẩn ngân hàng (Bank-Grade)",
    subtitle: "Mã hóa AES-256, TLS 1.3, không bán dữ liệu cho bên thứ ba",
    halo: { status: "full", text: "Mã hóa cao cấp & Cam kết bảo mật" },
    notebook: { status: "none", text: "Ai cũng có thể mở ra xem" },
    excel: { status: "partial", text: "Dễ bị lộ file hoặc virus" },
    others: { status: "partial", text: "Chính sách dữ liệu chưa rõ ràng" },
  },
];

export default function CompetitorComparison() {
  return (
    <section id="comparison" className="relative overflow-hidden bg-slate-50/70 py-24 sm:py-32 text-slate-900 border-t border-slate-200/80">
      {/* Background soft ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[750px] rounded-full bg-blue-100/40 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-2xs">
            <Zap className="h-4 w-4 text-blue-600" />
            <span>So sánh sự khác biệt</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl text-slate-900">
            Tại sao người dùng thông thái chọn{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Trợ Lý Tài Chính
            </span>
            ?
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Khác biệt vượt bậc so với việc ghi chép sổ tay, bảng tính Excel hay những ứng dụng tài chính cũ kỹ.
          </p>
        </div>

        {/* Responsive Comparison Table Container */}
        <div className="mt-14 overflow-x-auto rounded-[2rem] border border-slate-200/90 bg-white p-3 shadow-xl sm:p-6">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs sm:text-sm uppercase tracking-wider">
                <th className="py-4 px-4 font-bold text-slate-500 w-[34%]">Tiêu chí so sánh</th>
                <th className="py-4 px-4 font-black text-blue-700 bg-blue-50/90 rounded-t-2xl text-center w-[25%] border-x-2 border-t-2 border-blue-500/40">
                  <div className="flex items-center justify-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span>Halo Finance</span>
                  </div>
                  <span className="text-[10px] lowercase font-semibold text-blue-600 block mt-0.5">Thế hệ mới 2.0</span>
                </th>
                <th className="py-4 px-3 font-semibold text-slate-500 text-center w-[13%]">Sổ tay giấy</th>
                <th className="py-4 px-3 font-semibold text-slate-500 text-center w-[14%]">Excel / Sheets</th>
                <th className="py-4 px-3 font-semibold text-slate-500 text-center w-[14%]">App cũ khác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {COMPARISON_ROWS.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-4 font-semibold text-slate-700">
                    <div className="font-bold text-slate-900 text-sm sm:text-base">{row.feature}</div>
                    <div className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">{row.subtitle}</div>
                  </td>

                  {/* Halo Finance Highlight Column */}
                  <td className="py-4 px-4 bg-blue-50/40 border-x-2 border-blue-500/30 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-white font-black shadow-md shadow-blue-500/25">
                        <Check className="h-4 w-4 stroke-[3]" />
                      </span>
                      <span className="text-xs font-extrabold text-blue-900">{row.halo.text}</span>
                    </div>
                  </td>

                  {/* Sổ tay giấy */}
                  <td className="py-4 px-3 text-center text-slate-600">
                    <div className="flex flex-col items-center justify-center gap-1">
                      {row.notebook.status === "none" ? (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-50 text-rose-500">
                          <X className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-50 text-amber-600">
                          <Minus className="h-4 w-4" />
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 font-medium">{row.notebook.text}</span>
                    </div>
                  </td>

                  {/* Excel */}
                  <td className="py-4 px-3 text-center text-slate-600">
                    <div className="flex flex-col items-center justify-center gap-1">
                      {row.excel.status === "none" ? (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-50 text-rose-500">
                          <X className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-50 text-amber-600">
                          <Minus className="h-4 w-4" />
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 font-medium">{row.excel.text}</span>
                    </div>
                  </td>

                  {/* App cũ khác */}
                  <td className="py-4 px-3 text-center text-slate-600">
                    <div className="flex flex-col items-center justify-center gap-1">
                      {row.others.status === "none" ? (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-50 text-rose-500">
                          <X className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-50 text-amber-600">
                          <Minus className="h-4 w-4" />
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 font-medium">{row.others.text}</span>
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
