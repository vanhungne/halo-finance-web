import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scan,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Receipt,
  ShieldAlert,
  ArrowRight,
  Cpu,
  Layers,
  Eye,
  Check,
} from "lucide-react";

const SAMPLE_BILLS = [
  {
    id: "coffee",
    merchant: "Highlands Coffee - Landmark 81",
    type: "Hóa Đơn Ăn Uống & Cafe",
    time: "16/10/2026 14:15",
    items: [
      { name: "Freeze Trà Xanh (Size L)", qty: 2, price: 130000 },
      { name: "Phin Sữa Đá Cỡ Vừa", qty: 1, price: 39000 },
      { name: "Bánh Mousse Cacao", qty: 1, price: 35000 },
    ],
    subtotal: 204000,
    discount: 20000,
    vat: 14720,
    total: 198720,
    fraudScore: "0.02 (Cực kỳ an toàn)",
    vatInvoiceNo: "HD00291823",
  },
  {
    id: "mart",
    merchant: "WinMart+ Chu Mạnh Trinh",
    type: "Hóa Đơn Siêu Thị & Tiêu Dùng",
    time: "15/10/2026 19:30",
    items: [
      { name: "Sữa tươi TH True Milk 1L", qty: 2, price: 78000 },
      { name: "Bánh mì gối Sandwich", qty: 1, price: 26000 },
      { name: "Trứng gà Ba Huân Hộp 10", qty: 1, price: 34000 },
      { name: "Táo Envy New Zealand 1kg", qty: 1, price: 119000 },
    ],
    subtotal: 257000,
    discount: 0,
    vat: 20560,
    total: 277560,
    fraudScore: "0.01 (Cực kỳ an toàn)",
    vatInvoiceNo: "WM-HCM-91823",
  },
  {
    id: "petrol",
    merchant: "Petrolimex Cửa hàng 02",
    type: "Hóa Đơn Xăng Dầu & Vận Chuyển",
    time: "14/10/2026 08:20",
    items: [{ name: "Xăng RON 95-V (22.540 đ/L)", qty: "22.18 L", price: 500000 }],
    subtotal: 462963,
    discount: 0,
    vat: 37037,
    total: 500000,
    fraudScore: "0.00 (Chính thức)",
    vatInvoiceNo: "PETRO-817234",
  },
];

export default function AiScannerDeepDive() {
  const [selectedBill, setSelectedBill] = useState(SAMPLE_BILLS[0]);
  const [isScanning, setIsScanning] = useState(false);

  const handleSelect = (bill) => {
    setIsScanning(true);
    setSelectedBill(bill);
    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  return (
    <section id="ai-scanner" className="py-24 sm:py-32 bg-slate-50 text-slate-900 relative overflow-hidden border-t border-slate-200/80">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-cyan-700 mb-4">
            <Cpu className="w-4 h-4 text-cyan-600" />
            Receipt Intelligence v2 Pipeline
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 leading-tight">
            Công Nghệ Bóc Tách Hóa Đơn Bằng AI Độc Quyền
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Không chỉ là đọc chữ (OCR) cơ bản — Hệ thống sử dụng mô hình thị giác đa phương thức (Multimodal Vision AI) kết hợp thuật toán đối soát kế toán và phát hiện giả mạo hóa đơn nhiều lớp.
          </p>
        </div>

        {/* 4 Pipeline Steps Banner */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: "01",
              title: "Tiếp Nhận Chứng Từ",
              desc: "Nhận diện hóa đơn giấy, hóa đơn điện tử VAT, ảnh chụp xiên, mờ, nhăn hay in nhiệt mờ.",
              icon: Receipt,
            },
            {
              step: "02",
              title: "Multimodal AI Extraction",
              desc: "AI bóc tách tên người bán, mã số thuế, từng dòng món ăn, đơn giá, chiết khấu và VAT.",
              icon: Cpu,
            },
            {
              step: "03",
              title: "Đối Soát Kế Toán",
              desc: "Tự động kiểm toán tổng dòng hàng: Subtotal - Discount + Tax + Tip = Total chính xác 100%.",
              icon: FileCheck2,
            },
            {
              step: "04",
              title: "Chống Gian Lận Đa Lớp",
              desc: "Quét điểm ảnh kiểm tra vết chỉnh sửa Photoshop vùng tiền, đối chiếu mã số thuế và phát hiện bill trùng.",
              icon: ShieldAlert,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-cyan-500/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase text-cyan-600 tracking-wider">
                    Bước {item.step}
                  </span>
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Interactive Interactive Scanner Workspace */}
        <div className="mt-14 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Scan className="w-5 h-5 text-cyan-600" />
                Trải Nghiệm Bóc Tách Trực Tiếp Mẫu Hóa Đơn Thực Tế
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bấm vào một trong các loại hóa đơn dưới đây để quan sát AI xử lý:
              </p>
            </div>

            {/* Bill selection buttons */}
            <div className="flex flex-wrap gap-2">
              {SAMPLE_BILLS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleSelect(b)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    selectedBill.id === b.id
                      ? "bg-cyan-600 text-white font-black shadow-md shadow-cyan-600/20"
                      : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200/70"
                  }`}
                >
                  {b.id === "coffee" ? "Hóa đơn Cafe" : b.id === "mart" ? "Siêu thị WinMart" : "Xăng dầu"}
                </button>
              ))}
            </div>
          </div>

          {/* Scanner Viewport */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Receipt Card with Scanner Line */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] rounded-2xl bg-slate-50 text-slate-900 p-6 border border-slate-200 shadow-md font-mono text-xs overflow-hidden">
                {/* Laser scan line */}
                {isScanning && (
                  <motion.div
                    initial={{ top: "0%" }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 0.6, repeat: 1, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)] z-20 pointer-events-none"
                  />
                )}

                {/* Receipt Header */}
                <div className="text-center pb-4 border-b border-dashed border-slate-300">
                  <div className="inline-block p-1.5 rounded-full bg-slate-200/70 text-slate-700 mb-2">
                    <Receipt className="w-5 h-5 mx-auto" />
                  </div>
                  <h4 className="font-black text-sm uppercase">{selectedBill.merchant}</h4>
                  <p className="text-[0.65rem] text-slate-500 mt-0.5">{selectedBill.type}</p>
                  <p className="text-[0.65rem] text-slate-500">{selectedBill.time}</p>
                  <p className="text-[0.65rem] font-bold text-sky-700 mt-1">Số HĐ: {selectedBill.vatInvoiceNo}</p>
                </div>

                {/* Items */}
                <div className="py-4 space-y-2 border-b border-dashed border-slate-300">
                  {selectedBill.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-start text-[0.72rem]">
                      <div>
                        <span className="font-bold">{it.name}</span>
                        <span className="text-slate-500 block text-[0.65rem]">SL: {it.qty}</span>
                      </div>
                      <span className="font-black text-slate-800">{formatMoney(it.price)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="pt-3 space-y-1 text-[0.72rem]">
                  <div className="flex justify-between text-slate-600">
                    <span>Tạm tính:</span>
                    <span>{formatMoney(selectedBill.subtotal)}</span>
                  </div>
                  {selectedBill.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Giảm giá:</span>
                      <span>-{formatMoney(selectedBill.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Thuế VAT (8%):</span>
                    <span>+{formatMoney(selectedBill.vat)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-300 flex justify-between font-black text-sm text-slate-950">
                    <span>TỔNG THANH TOÁN:</span>
                    <span className="text-sky-700">{formatMoney(selectedBill.total)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-2 text-center text-[0.6rem] text-slate-400 border-t border-dashed border-slate-200">
                  Cảm ơn Quý khách & Hẹn gặp lại!
                </div>
              </div>
            </div>

            {/* AI Extraction Live Data Output */}
            <div className="lg:col-span-7 space-y-5">
              <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-600" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-800">
                      Kết Quả Bóc Tách Tức Thì (Extraction JSON v2)
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[0.65rem] font-bold">
                    Confidence: 99.8%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-cyan-100 shadow-xs">
                    <span className="text-slate-500 text-[0.65rem] block font-medium">Người bán nhận diện</span>
                    <span className="font-extrabold text-slate-900 text-sm">{selectedBill.merchant}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-cyan-100 shadow-xs">
                    <span className="text-slate-500 text-[0.65rem] block font-medium">Tổng tiền xác thực</span>
                    <span className="font-black text-cyan-700 text-sm">{formatMoney(selectedBill.total)}</span>
                  </div>
                </div>

                {/* Audit Checklist */}
                <div className="space-y-2 pt-2 border-t border-cyan-100 text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Đối soát toán học hợp lệ: Phép tính tổng dòng hàng khớp tuyệt đối.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Kiểm tra chống sửa ảnh: Không có vết chỉnh sửa photoshop tại vùng số tiền.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Phát hiện hóa đơn trùng: Fingerprint SHA-256 duy nhất, chưa từng ghi nhận trước đó.</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <a
                  href="#download"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-extrabold text-sm shadow-md shadow-cyan-600/20 hover:opacity-95 transition"
                >
                  <Scan className="w-4 h-4" />
                  Trải nghiệm Quét Hóa Đơn Trên App
                </a>
                <span className="text-xs text-slate-500 font-medium text-center sm:text-left">
                  Hỗ trợ cả hóa đơn in nhiệt nhà hàng, vé xe bus, hóa đơn VAT đỏ và biên lai chuyển khoản.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
