import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Zap,
  Bot,
  QrCode,
  Users2,
  FileSpreadsheet,
  Ban,
  Lock,
  ArrowRight,
  TrendingDown,
  Gift,
  HeartHandshake,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function ZeroFeeCommitment({ onOpenQr }) {
  const [txCount, setTxCount] = useState(150);
  const { lang, strings } = useLanguage();
  const commitment = strings?.commitment || {};

  // Calculate annual savings vs competing apps charging 49k-99k/month or 599k/year
  const monthlyCostCompetitor = txCount > 100 ? 99000 : 49000;
  const annualSavings = monthlyCostCompetitor * 12;

  const comparisonRows = [
    {
      feature: "Chi phí sử dụng hàng tháng",
      other: "49.000đ – 199.000đ/tháng",
      otherSub: "Bắt buộc trả phí để mở tính năng",
      halo: "0đ Miễn Phí Trọn Đời",
      haloSub: "Cam kết không thu phí người dùng",
      haloHighlight: true,
    },
    {
      feature: "Bóc tách hóa đơn AI (OCR)",
      other: "Giới hạn 10 – 30 lượt/tháng",
      otherSub: "Bắt mua thêm gói lượt quét",
      halo: "Không giới hạn số lượng",
      haloSub: "Trí Tuệ Nhân Tạo AI xử lý trong 3 giây",
      haloHighlight: true,
    },
    {
      feature: "Quảng cáo trong ứng dụng",
      other: "Quảng cáo popup & banner rác",
      otherSub: "Gây ức chế khi đang nhập số liệu",
      halo: "Hoàn toàn không có quảng cáo",
      haloSub: "Giao diện sạch sẽ, tập trung 100%",
      haloHighlight: true,
    },
    {
      feature: "Quỹ nhóm & Chia tiền VietQR",
      other: "Khóa tính năng hoặc tính phí",
      otherSub: "Không hỗ trợ luồng duyệt 2 lớp",
      halo: "Tự do tạo không giới hạn nhóm",
      haloSub: "VietQR 1 chạm + Duyệt chi Giám sát viên",
      haloHighlight: true,
    },
    {
      feature: "Trợ lý AI Giọng nói (Voice AI)",
      other: "Chưa hỗ trợ hoặc tính phí Pro",
      otherSub: "Chỉ cho gõ bàn phím thủ công",
      halo: "Tích hợp sẵn 0đ",
      haloSub: "Nhận diện giọng nói 3 miền tiếng Việt",
      haloHighlight: true,
    },
    {
      feature: "Xuất báo cáo Excel / PDF",
      other: "Phải nâng cấp gói VIP",
      otherSub: "Không cho tải sao kê chi tiết",
      halo: "Xuất file chuẩn mực 0đ",
      haloSub: "Phù hợp kê khai thuế & đối soát cá nhân",
      haloHighlight: true,
    },
    {
      feature: "Bảo mật & Quyền riêng tư",
      other: "Tiêu chuẩn cơ bản",
      otherSub: "Nguy cơ tiếp thị bảo hiểm, tài chính",
      halo: "Mã hóa AES-256 + Nghị định 13",
      haloSub: "Cam kết tuyệt đối KHÔNG bán dữ liệu",
      haloHighlight: true,
    },
  ];

  const zeroPillars = [
    {
      icon: <Zap className="h-6 w-6 text-emerald-400" />,
      title: "0đ Phí Khởi Tạo & eKYC",
      desc: "Kích hoạt tài khoản siêu nhanh trong 60 giây, không yêu cầu thẻ tín dụng, không phí kích hoạt ban đầu.",
      badge: "Free 100%",
    },
    {
      icon: <Bot className="h-6 w-6 text-sky-400" />,
      title: "0đ Bóc Tách Hóa Đơn AI",
      desc: "Trải nghiệm sức mạnh bóc tách AI siêu tốc không giới hạn lượt quét bill cafe, siêu thị, xăng xe.",
      badge: "Không giới hạn",
    },
    {
      icon: <Users2 className="h-6 w-6 text-indigo-400" />,
      title: "0đ Quỹ Nhóm & Chia Tiền",
      desc: "Tạo quỹ gia đình, nhóm bạn du lịch hay hội phụ huynh. Chia tiền sòng phẳng và tạo mã VietQR 1 chạm.",
      badge: "Không thu phí",
    },
    {
      icon: <Ban className="h-6 w-6 text-rose-400" />,
      title: "0 Quảng Cáo Phiền Toái",
      desc: "Không có video 30 giây ép xem, không có banner che màn hình. Trải nghiệm mượt mà, đẳng cấp tuyệt đối.",
      badge: "Không rác",
    },
    {
      icon: <FileSpreadsheet className="h-6 w-6 text-amber-400" />,
      title: "0đ Xuất Báo Cáo & Sổ Nợ",
      desc: "Quản trị danh mục nợ vay, tính lãi suất thông minh và xuất toàn bộ lịch sử chi tiêu ra Excel bất cứ lúc nào.",
      badge: "Chuẩn kế toán",
    },
    {
      icon: <Lock className="h-6 w-6 text-teal-400" />,
      title: "Bảo Vệ Dữ Liệu Tối Thượng",
      desc: "Mã hóa đầu cuối chuẩn AES-256. Halo cam kết độc lập pháp lý, không chia sẻ hay kinh doanh số liệu thu chi.",
      badge: "Chuẩn PCI-DSS",
    },
  ];

  return (
    <section id="free-commitment" className="relative overflow-hidden bg-slate-900 py-24 sm:py-32 text-white">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-emerald-600/20 via-teal-500/15 to-sky-500/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-300 shimmer-badge">
            <Gift className="h-4 w-4 text-emerald-400" />
            <span>{commitment.badge || "Cam Kết Minh Bạch — 100% Miễn Phí Trọn Đời"}</span>
          </div>

          <h2 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
            {commitment.title || "Không Bán Gói. Không Phí Ẩn."}{" "}
            <span className="block bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              {commitment.titleHighlight || "Mở Khóa Toàn Bộ Sức Mạnh Tài Chính 0đ."}
            </span>
          </h2>

          <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-300">
            {commitment.subtitle || "Halo Finance hướng tới sứ mệnh bình dân hóa công nghệ tài chính cho người Việt. Mọi tính năng cao cấp từ Trí Tuệ Nhân Tạo AI, Voice AI đến chia tiền VietQR đều mở sẵn 100% miễn phí, không giới hạn."}
          </p>
        </div>

        {/* Interactive Savings Calculator Banner */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 via-slate-900/90 to-teal-950/60 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                <TrendingDown className="h-4 w-4" />
                <span>Công Cụ Tính Tiền Tiết Kiệm Khi Chọn Halo Finance</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Bạn thực hiện khoảng bao nhiêu giao dịch & quét hóa đơn/tháng?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Kéo thanh trượt bên dưới để ước tính số tiền bạn tiết kiệm được so với việc phải mua các gói app quản lý chi tiêu khác:
              </p>

              {/* Slider */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-300">
                  <span>30 giao dịch</span>
                  <span className="text-emerald-400 text-sm font-black bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                    {txCount} giao dịch & hóa đơn / tháng
                  </span>
                  <span>500+ giao dịch</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="500"
                  step="10"
                  value={txCount}
                  onChange={(e) => setTxCount(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                />
              </div>
            </div>

            {/* Savings Result Card */}
            <div className="lg:col-span-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center space-y-3 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
              <p className="text-xs uppercase font-extrabold tracking-wider text-emerald-300">
                Số Tiền Bạn Tiết Kiệm Được Mỗi Năm
              </p>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                {annualSavings.toLocaleString("vi-VN")} đ
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Thay vì phải trả phí duy trì ứng dụng từ 599.000đ – 1.200.000đ/năm, với Halo Finance bạn được trải nghiệm trọn vẹn với <strong className="text-emerald-300 font-black">chi phí 0 đồng</strong>.
              </p>
              <button
                type="button"
                onClick={onOpenQr}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 text-xs font-black text-slate-950 shadow-lg hover:opacity-95 transition cursor-pointer"
              >
                <QrCode className="h-4 w-4" />
                <span>Nhận Tài Khoản 0đ Ngay</span>
              </button>
            </div>
          </div>
        </div>

        {/* Head-to-Head Transparency Matrix */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Bảng So Sánh Minh Bạch: Halo Finance vs Ứng Dụng Khác
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Không giấu giếm, không mập mờ tính năng. Mọi quyền lợi của bạn được minh bạch hóa rõ ràng.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-700/80 bg-slate-800/60 shadow-xl backdrop-blur-md">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-700/90 bg-slate-900/80">
                  <th className="py-4 px-5 sm:px-6 font-bold text-slate-400 w-[34%]">Tính Năng & Quyền Lợi</th>
                  <th className="py-4 px-5 sm:px-6 font-bold text-rose-300/90 w-[33%]">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-rose-400" />
                      <span>App Quản Lý Khác (Trả Phí)</span>
                    </div>
                  </th>
                  <th className="py-4 px-5 sm:px-6 font-black text-emerald-300 bg-emerald-500/10 border-l border-r border-emerald-500/30 w-[33%]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Halo Finance (100% Free)</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-700/30 transition">
                    <td className="py-4 px-5 sm:px-6 font-bold text-slate-200">
                      {row.feature}
                    </td>
                    <td className="py-4 px-5 sm:px-6 text-slate-400">
                      <span className="font-semibold text-rose-300 block">{row.other}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">{row.otherSub}</span>
                    </td>
                    <td className="py-4 px-5 sm:px-6 font-bold bg-emerald-500/5 border-l border-r border-emerald-500/20 text-emerald-300">
                      <span className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        {row.halo}
                      </span>
                      <span className="text-[11px] text-emerald-200/80 mt-0.5 block">{row.haloSub}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6 Zero-Fee Pillars Grid */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              6 Trụ Cột Cam Kết Vững Chắc Từ Đội Ngũ Sáng Lập
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Trải nghiệm tài chính công nghệ cao không phải là đặc quyền của riêng ai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {zeroPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-800/50 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-800/80 hover:shadow-xl hover:shadow-emerald-500/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 group-hover:scale-110 transition duration-300">
                    {pillar.icon}
                  </div>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-black text-emerald-400">
                    {pillar.badge}
                  </span>
                </div>
                <h4 className="text-base font-black text-white group-hover:text-emerald-300 transition">
                  {pillar.title}
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Reassurance Box */}
        <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-300">
            <HeartHandshake className="h-4 w-4" />
            <span>Sứ Mệnh Phục Vụ Cộng Đồng</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Bạn Sẵn Sàng Làm Chủ Dòng Tiền Hoàn Toàn Miễn Phí?
          </h3>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-400 leading-relaxed">
            Hơn 3.2 triệu người dùng tại Việt Nam đã nói lời tạm biệt với các cuốn sổ ghi tay và các ứng dụng thu phí rườm rà. Bắt đầu ngay hôm nay mà không tốn một đồng nào.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenQr}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-7 py-3.5 text-xs font-black text-slate-950 shadow-xl hover:opacity-95 transition hover:-translate-y-0.5 cursor-pointer"
            >
              <QrCode className="h-4 w-4" />
              <span>Quét Mã Tải App 0đ (iOS & Android)</span>
            </button>
            <a
              href="#app-simulator"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-xs font-bold text-white hover:bg-white/20 transition hover:-translate-y-0.5"
            >
              <span>Trải Nghiệm Trực Tiếp Trên Web</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
