import { ShieldCheck, Sparkles, QrCode, CheckCircle2 } from "lucide-react";

const BANK_PARTNERS = [
  { name: "Vietcombank", sub: "VietQR 1 Chạm", code: "VCB", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { name: "Techcombank", sub: "VietQR 1 Chạm", code: "TCB", color: "text-rose-700 bg-rose-50 border-rose-200" },
  { name: "MB Bank", sub: "VietQR 1 Chạm", code: "MB", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { name: "VPBank", sub: "VietQR 1 Chạm", code: "VPB", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { name: "BIDV", sub: "VietQR 1 Chạm", code: "BIDV", color: "text-teal-700 bg-teal-50 border-teal-200" },
  { name: "VietinBank", sub: "VietQR 1 Chạm", code: "CTG", color: "text-blue-800 bg-blue-50 border-blue-200" },
  { name: "ACB", sub: "VietQR 1 Chạm", code: "ACB", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { name: "TPBank", sub: "VietQR 1 Chạm", code: "TPB", color: "text-purple-700 bg-purple-50 border-purple-200" },
  { name: "Sacombank", sub: "VietQR 1 Chạm", code: "STB", color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
  { name: "SePay Webhook", sub: "Biến Động Số Dư", code: "SEPAY", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { name: "VietQR Chuẩn", sub: "Thanh Toán Động", code: "VIETQR", color: "text-sky-700 bg-sky-50 border-sky-200" },
];

export default function BankingEcosystemMarquee() {
  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10">
      {/* 4 Core Metrics Card */}
      <div className="overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 p-6 sm:p-8 bg-gradient-to-b from-white to-slate-50/50">
          
          {/* Metric 1 */}
          <div className="p-3 sm:p-4 text-center">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">Cộng đồng tin cậy</span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-black text-blue-600">50K+</span>
            </div>
            <p className="mt-1 text-xs text-slate-600 font-medium">Người dùng trên iOS & Android</p>
          </div>

          {/* Metric 2 */}
          <div className="p-3 sm:p-4 text-center">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">Hóa đơn bóc tách AI</span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">1.2M+</span>
            </div>
            <p className="mt-1 text-xs text-slate-600 font-medium">Bóc tách tự động chỉ trong 3 giây</p>
          </div>

          {/* Metric 3 */}
          <div className="p-3 sm:p-4 text-center">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">Mạng lưới VietQR</span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600">54+</span>
              <span className="text-sm font-bold text-slate-600">Ngân hàng</span>
            </div>
            <p className="mt-1 text-xs text-slate-600 font-medium">Chia tiền & gạch nợ 1 chạm</p>
          </div>

          {/* Metric 4 */}
          <div className="p-3 sm:p-4 text-center">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">Chi phí sử dụng</span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600">0 VNĐ</span>
            </div>
            <p className="mt-1 text-xs text-slate-600 font-medium">100% Miễn phí trọn đời • Không quảng cáo</p>
          </div>

        </div>

        {/* Bank Partner Marquee Strip */}
        <div className="border-t border-slate-100 bg-slate-50/70 py-4 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2 font-bold text-slate-700 shrink-0">
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>Hỗ trợ tạo mã thanh toán VietQR chuyển tiền tức thì đến mọi ngân hàng:</span>
            </div>

            {/* Tags strip */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {BANK_PARTNERS.map((bank) => (
                <span
                  key={bank.name}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border shadow-2xs ${bank.color}`}
                >
                  <span>{bank.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
