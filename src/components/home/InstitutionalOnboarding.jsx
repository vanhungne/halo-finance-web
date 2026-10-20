import { useState } from "react";
import { motion } from "framer-motion";
import {
  Fingerprint,
  ScanLine,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building2,
  Sparkles,
  Smartphone,
  ChevronRight,
} from "lucide-react";

const ONBOARDING_STEPS = [
  {
    step: "01",
    tag: "Định danh tức thì",
    title: "eKYC 100% Online trong 60 giây",
    desc: "Chụp CCCD gắn chip và quét khuôn mặt sinh trắc học Face Liveness (tuân thủ Quyết định 2345/QĐ-NHNN). Hệ thống đối chiếu dữ liệu C06 và cấp ngay số tài khoản VIP phong thủy 0đ phí.",
    features: [
      "Quét chip NFC & OCR tự động",
      "Xác thực khuôn mặt FIDO2 chống giả mạo",
      "Chọn miễn phí đuôi số đẹp 6868, 8888, 9999",
    ],
    highlight: "Hoàn tất trong 60 giây",
    tone: "from-blue-600 to-sky-600",
  },
  {
    step: "02",
    tag: "Đồng bộ đa kênh",
    title: "Kết nối Open Banking 54+ Ngân Hàng",
    desc: "Liên kết tức thì với tài khoản ngân hàng sẵn có qua mạng lưới chuyển mạch NAPAS 24/7. Trợ lý AI Gemini 2.0 tự động nhận diện hóa đơn và đồng bộ dòng tiền mà không cần nhập thủ công.",
    features: [
      "Kết nối VCB, Techcombank, MB, ACB, BIDV...",
      "Bóc tách hóa đơn đa định dạng qua ảnh chụp",
      "Tự động phân loại 18+ danh mục thu chi",
    ],
    highlight: "Không cần nhập liệu tay",
    tone: "from-indigo-600 to-blue-600",
  },
  {
    step: "03",
    tag: "Khai mở đặc quyền",
    title: "Kích Hoạt Thẻ Quốc Tế & Tự Động Sinh Lời",
    desc: "Phát hành thẻ ảo Contactless dùng ngay cho Apple Pay / Google Wallet. Bật tính năng tích lũy qua đêm để dòng tiền nhàn rỗi tự động sinh lời với lãi suất lên đến 6.2%/năm.",
    features: [
      "Thẻ ảo dùng ngay không cần chờ thẻ cứng",
      "Hoàn tiền 3.5% mọi chi tiêu ăn uống, mua sắm",
      "Tích lũy linh hoạt, rút tiền không mất lãi gốc",
    ],
    highlight: "Sinh lời mỗi ngày",
    tone: "from-emerald-600 to-teal-600",
  },
];

export default function InstitutionalOnboarding({ onOpenQr }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-white py-24 sm:py-32 text-slate-900 border-t border-slate-200/80">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-blue-700 shadow-2xs">
            <Zap className="h-4 w-4 text-blue-600" />
            <span>Quy Trình Khởi Tạo Định Chế Số</span>
          </div>

          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl text-slate-900">
            3 bước gia nhập.{" "}
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Vận hành ngay lập tức.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
            Không cần đến phòng giao dịch, không giấy tờ phức tạp. Trải nghiệm ngân hàng số không ma sát với chuẩn bảo mật ngân hàng quốc tế.
          </p>
        </div>

        {/* 3 Step Interactive Grid */}
        <div className="relative mt-16 grid gap-8 lg:grid-cols-3">
          {/* Connector Line (Desktop) */}
          <div className="absolute left-[18%] right-[18%] top-16 hidden h-0.5 border-t-2 border-dashed border-slate-200 lg:block pointer-events-none" />

          {ONBOARDING_STEPS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.15 }}
              onClick={() => setActiveStep(index)}
              className={`relative flex flex-col justify-between rounded-[2.25rem] border p-8 transition-all cursor-pointer ${
                activeStep === index
                  ? "border-blue-500 bg-gradient-to-b from-blue-50/50 to-white shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20"
                  : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${item.tone} text-white font-black text-sm shadow-md`}>
                    {item.step}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                    {item.tag}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-600 font-medium">
                  {item.desc}
                </p>

                <div className="mt-6 space-y-2.5 pt-5 border-t border-slate-100">
                  {item.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {item.highlight}
                </span>
                <span className="font-extrabold text-slate-400 flex items-center gap-1 group-hover:text-blue-600">
                  Bắt đầu <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Fast Track Banner */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shrink-0">
              <Smartphone className="h-7 w-7" />
            </span>
            <div>
              <h4 className="text-base sm:text-lg font-black text-white">Sẵn Sàng Mở Tài Khoản Số Đẹp Ngay Bây Giờ?</h4>
              <p className="text-xs text-slate-300 mt-0.5">Không cần chứng minh thu nhập • Miễn phí trọn đời • Cấp thẻ ảo tức thì</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={onOpenQr}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-sky-400 px-6 py-3.5 text-xs font-black text-slate-950 shadow-md transition hover:opacity-95"
            >
              <span>Mở Tài Khoản eKYC (0đ)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="/app"
              className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-xs font-bold text-white hover:bg-white/20 transition"
            >
              <span>Web Banking</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
