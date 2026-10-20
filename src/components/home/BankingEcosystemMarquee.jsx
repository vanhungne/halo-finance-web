import { motion } from "framer-motion";
import { ShieldCheck, Building2, Zap, Award, CheckCircle2, Lock, ArrowUpRight } from "lucide-react";

const BANK_PARTNERS = [
  { name: "Vietcombank", sub: "Ngân hàng Ngoại thương", code: "VCB", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { name: "Techcombank", sub: "Kỹ Thương Việt Nam", code: "TCB", color: "text-rose-700 bg-rose-50 border-rose-200" },
  { name: "MB Bank", sub: "Ngân hàng Quân Đội", code: "MB", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { name: "VPBank", sub: "Việt Nam Thịnh Vượng", code: "VPB", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { name: "BIDV", sub: "Đầu tư & Phát triển", code: "BIDV", color: "text-teal-700 bg-teal-50 border-teal-200" },
  { name: "VietinBank", sub: "Công Thương Việt Nam", code: "CTG", color: "text-blue-800 bg-blue-50 border-blue-200" },
  { name: "ACB", sub: "Á Châu Bank", code: "ACB", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { name: "TPBank", sub: "Tiên Phong Bank", code: "TPB", color: "text-purple-700 bg-purple-50 border-purple-200" },
  { name: "Sacombank", sub: "Sài Gòn Thương Tín", code: "STB", color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
  { name: "NAPAS 24/7", sub: "Chuyển mạch Quốc gia", code: "NAPAS", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { name: "VNPay QR", sub: "Cổng thanh toán Quốc gia", code: "VNPAY", color: "text-sky-700 bg-sky-50 border-sky-200" },
  { name: "Visa / Master", sub: "Thẻ thanh toán Quốc tế", code: "EMV", color: "text-slate-800 bg-slate-100 border-slate-300" },
];

export default function BankingEcosystemMarquee() {
  return (
    <section className="relative z-20 mt-10 sm:mt-14 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10">
      {/* 4 Grand Institutional Metrics Card */}
      <div className="overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 p-6 sm:p-8 bg-gradient-to-b from-white to-slate-50/50">
          
          {/* Metric 1 */}
          <div className="p-3 sm:p-4 text-center">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">Quy mô người dùng</span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-black text-blue-600">3.2M+</span>
            </div>
            <p className="mt-1 text-xs text-slate-600 font-medium">Khách hàng cá nhân & Hộ kinh doanh</p>
          </div>

          {/* Metric 2 */}
          <div className="p-3 sm:p-4 text-center">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">Dòng tiền quản trị</span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">48.500+</span>
              <span className="text-sm font-bold text-slate-600">Tỷ VNĐ</span>
            </div>
            <p className="mt-1 text-xs text-slate-600 font-medium">Lưu chuyển & đối soát an toàn mỗi năm</p>
          </div>

          {/* Metric 3 */}
          <div className="p-3 sm:p-4 text-center">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">Mạng lưới liên kết</span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600">54+</span>
              <span className="text-sm font-bold text-slate-600">Ngân hàng</span>
            </div>
            <p className="mt-1 text-xs text-slate-600 font-medium">Kết nối tự động chuẩn NAPAS 24/7</p>
          </div>

          {/* Metric 4 */}
          <div className="p-3 sm:p-4 text-center">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">Chuẩn an ninh số</span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-black text-sky-600">99.99%</span>
            </div>
            <p className="mt-1 text-xs text-slate-600 font-medium">PCI-DSS Level 1 & ISO 27001:2022</p>
          </div>

        </div>

        {/* Bank Logo Marquee Strip */}
        <div className="border-t border-slate-100 bg-slate-50/80 py-4 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span className="font-extrabold text-slate-900 uppercase tracking-wider">
                Hệ sinh thái định chế tài chính & Ngân hàng kết nối trực tiếp
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">
              Chuyển mạch tức thì • Không gián đoạn 24/7
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            {BANK_PARTNERS.map((bank, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-2xs hover:shadow-xs hover:border-blue-400 transition cursor-default"
              >
                <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-md border ${bank.color}`}>
                  {bank.code}
                </span>
                <div>
                  <p className="text-xs font-black text-slate-900 leading-tight">{bank.name}</p>
                  <p className="text-[9.5px] text-slate-500 font-medium">{bank.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
