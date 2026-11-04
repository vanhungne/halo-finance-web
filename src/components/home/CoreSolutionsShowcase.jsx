import React from "react";
import {
  Wallet,
  Users,
  Briefcase,
  Sparkles,
  QrCode,
  Receipt,
  PiggyBank,
  TrendingUp,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Coins,
  ScanLine,
  Percent,
} from "lucide-react";
import images from "../../assets/image";
import { useLanguage } from "../../contexts/LanguageContext";

export default function CoreSolutionsShowcase() {
  const { isEnglish } = useLanguage();

  return (
    <div id="solutions" className="relative bg-white text-slate-900 overflow-hidden">
      {/* Background Subtle Ambient Gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-[40%] right-[5%] w-[600px] h-[600px] bg-purple-50/40 blur-3xl rounded-full" />
        <div className="absolute top-[75%] left-[5%] w-[600px] h-[600px] bg-emerald-50/40 blur-3xl rounded-full" />
      </div>

      <div className="mx-auto max-w-[1360px] px-4 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-24 sm:space-y-32">

        {/* ================================================================= */}
        {/* PHẦN 1: QUẢN LÝ TÀI CHÍNH CÁ NHÂN (Ảnh Trái - Thông Tin Phải)      */}
        {/* ================================================================= */}
        <section
          id="solutions-personal"
          aria-labelledby="title-personal"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* CỘT HÌNH ẢNH MOBILE HERO (BÊN TRÁI) */}
          <div className="order-2 lg:order-1 lg:col-span-5 flex justify-center relative">
            {/* Ambient Lighting Behind Phone */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/25 via-sky-300/20 to-transparent blur-3xl rounded-full scale-90 -z-10" />

            {/* Floating Badge 1 (Top Left) */}
            <div className="hidden sm:flex absolute -top-3 -left-4 sm:-left-8 z-30 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-md px-3.5 py-2.5 shadow-lg shadow-blue-500/10">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-100 text-emerald-700 text-xs font-black">
                AI
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-500 font-medium">Bóc tách hóa đơn</p>
                <p className="text-xs font-bold text-slate-900">Highlands Coffee • 65.000đ</p>
              </div>
            </div>

            {/* Floating Badge 2 (Bottom Right) */}
            <div className="hidden sm:flex absolute -bottom-3 -right-4 sm:-right-6 z-30 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-md px-3.5 py-2.5 shadow-lg shadow-blue-500/10">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-100 text-blue-700">
                <PiggyBank className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-500 font-medium">Tiết kiệm mục tiêu</p>
                <p className="text-xs font-bold text-emerald-600">Đạt 72% (+2.500.000đ)</p>
              </div>
            </div>

            {/* Hero Mobile Image */}
            <div className="relative z-10 w-full flex items-center justify-center py-4">
              <img
                src={images.mockupPersonal}
                alt="Giao diện Quản lý thu chi cá nhân trên Trợ Lý Tài Chính"
                className="w-auto h-auto max-h-[460px] sm:max-h-[520px] max-w-[280px] sm:max-w-[340px] md:max-w-[380px] object-contain block drop-shadow-[0_20px_50px_rgba(2,132,199,0.22)] transition-transform duration-300 hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          </div>

          {/* CỘT THÔNG TIN (BÊN PHẢI) */}
          <div className="order-1 lg:order-2 lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Tiêu Đề 3D */}
            <h2
              id="title-personal"
              className="title-3d text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-slate-950 tracking-tight leading-[1.18]"
            >
              {isEnglish ? (
                <>
                  Master personal spending. <br className="hidden sm:inline" />
                  Clear down to the last penny.
                </>
              ) : (
                <>
                  Quản lý thu chi cá nhân. <br className="hidden sm:inline" />
                  Rõ ràng từng đồng, <span className="inline-block">nhẹ gánh âu lo.</span>
                </>
              )}
            </h2>

            {/* Mô Tả Dẫn Dắt */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              {isEnglish
                ? "Keep daily expenses, income streams and automated savings goals organized in one frictionless space. Understand your cash flow so you can save more and stress less."
                : "Gom toàn bộ thu nhập, các khoản chi sinh hoạt và mục tiêu tích lũy vào một góc nhìn tinh gọn. Tự động nhận diện dòng tiền để bạn biết chính xác tiền của mình đang đi đâu mỗi ngày."}
            </p>

            {/* 3 Tính Năng Cốt Lõi (Dính nhau, Không bo góc, Icon ngang hàng Title, Title nhỏ lại) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border border-slate-200 bg-white pt-0">
              <div className="p-3.5 sm:p-4 border-b sm:border-b-0 sm:border-r border-slate-200 transition-colors hover:bg-slate-50/70">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <ScanLine className="w-3.5 h-3.5 shrink-0 text-slate-800" />
                  <span className="solution-feature-title font-bold text-slate-900 text-xs sm:text-[13px] leading-snug">
                    {isEnglish ? "AI Receipt OCR (3s)" : "Bóc tách hóa đơn AI 3s"}
                  </span>
                </div>
                <p className="solution-feature-desc text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal">
                  {isEnglish
                    ? "Snap meal or grocery bills — AI extracts line items and categorizes wallets in seconds."
                    : "Chụp bill ăn uống, siêu thị hoặc ảnh chuyển khoản — AI đọc số tiền và lưu sổ tự động."}
                </p>
              </div>

              <div className="p-3.5 sm:p-4 border-b sm:border-b-0 sm:border-r border-slate-200 transition-colors hover:bg-slate-50/70">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <PiggyBank className="w-3.5 h-3.5 shrink-0 text-slate-800" />
                  <span className="solution-feature-title font-bold text-slate-900 text-xs sm:text-[13px] leading-snug">
                    {isEnglish ? "Smart Budgets & 6-Jars" : "Ngân sách & 6 Lọ tài chính"}
                  </span>
                </div>
                <p className="solution-feature-desc text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal">
                  {isEnglish
                    ? "Set limits per category with proactive alerts before overspending."
                    : "Thiết lập hạn mức chi tiêu theo tháng, cảnh báo trước khi bạn kịp tiêu lạm vào tiền tiết kiệm."}
                </p>
              </div>

              <div className="p-3.5 sm:p-4 transition-colors hover:bg-slate-50/70">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0 text-slate-800" />
                  <span className="solution-feature-title font-bold text-slate-900 text-xs sm:text-[13px] leading-snug">
                    {isEnglish ? "Debts & Visual Analytics" : "Sổ nợ & Biểu đồ trực quan"}
                  </span>
                </div>
                <p className="solution-feature-desc text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal">
                  {isEnglish
                    ? "Monitor loans, interest repayment schedules and cash flow patterns."
                    : "Ghi nhớ ai nợ mình, mình nợ ai kèm lịch hẹn trả nợ và biểu đồ dòng tiền sinh động."}
                </p>
              </div>
            </div>


          </div>
        </section>

        {/* ================================================================= */}
        {/* PHẦN 2: CHIA TIỀN NHÓM & QUỸ CHUNG (Thông Tin Trái - Ảnh Phải)     */}
        {/* ================================================================= */}
        <section
          id="solutions-group"
          aria-labelledby="title-group"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* CỘT THÔNG TIN (BÊN TRÁI - SO LE) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Tiêu Đề 3D */}
            <h2
              id="title-group"
              className="title-3d text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-slate-950 tracking-tight leading-[1.18]"
            >
              {isEnglish ? (
                <>
                  Shared group expenses. <br className="hidden sm:inline" />
                  Who pays whom, settled in seconds.
                </>
              ) : (
                <>
                  Chia tiền nhóm & Quỹ chung. <br className="hidden sm:inline" />
                  Ai trả bao nhiêu, <span className="inline-block">tính ngay chớp mắt.</span>
                </>
              )}
            </h2>

            {/* Mô Tả Dẫn Dắt */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              {isEnglish
                ? "Eliminate the spreadsheet nightmare after holidays, dinner parties, and shared apartments. Automatically calculate net debts and generate instant 1-tap VietQR codes to settle up effortlessly."
                : "Giải quyết triệt để nỗi ám ảnh tính toán sau mỗi chuyến du lịch, tiệc tùng hay tiền phòng trọ. Hệ thống tự động cân đối ai nợ ai và tạo mã VietQR thanh toán chỉ với 1 chạm mà không cần dò lịch sử chat."}
            </p>

            {/* 3 Tính Năng Cốt Lõi (Dính nhau, Không bo góc, Icon ngang hàng Title, Title nhỏ lại) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border border-slate-200 bg-white pt-0">
              <div className="p-3.5 sm:p-4 border-b sm:border-b-0 sm:border-r border-slate-200 transition-colors hover:bg-slate-50/70">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Coins className="w-3.5 h-3.5 shrink-0 text-slate-800" />
                  <span className="solution-feature-title font-bold text-slate-900 text-xs sm:text-[13px] leading-snug">
                    {isEnglish ? "Optimal Net Settlement" : "Thuật toán rút gọn nợ"}
                  </span>
                </div>
                <p className="solution-feature-desc text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal">
                  {isEnglish
                    ? "Eliminates multi-hop transfers. Minimizes repayments into the fewest direct transactions."
                    : "Tự triệt tiêu các khoản bù trừ nợ qua lại, chỉ giữ lại số lượt chuyển tiền ít nhất trong nhóm."}
                </p>
              </div>

              <div className="p-3.5 sm:p-4 border-b sm:border-b-0 sm:border-r border-slate-200 transition-colors hover:bg-slate-50/70">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Percent className="w-3.5 h-3.5 shrink-0 text-slate-800" />
                  <span className="solution-feature-title font-bold text-slate-900 text-xs sm:text-[13px] leading-snug">
                    {isEnglish ? "Flexible Splitting" : "Đa phương thức chia tiền"}
                  </span>
                </div>
                <p className="solution-feature-desc text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal">
                  {isEnglish
                    ? "Split equally, by exact amount, percentages or custom dishes per person."
                    : "Chia đều cho cả nhóm, chia theo người tham gia thực tế, theo tỷ lệ % hoặc số phần ăn riêng lẻ."}
                </p>
              </div>

              <div className="p-3.5 sm:p-4 transition-colors hover:bg-slate-50/70">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <QrCode className="w-3.5 h-3.5 shrink-0 text-slate-800" />
                  <span className="solution-feature-title font-bold text-slate-900 text-xs sm:text-[13px] leading-snug">
                    {isEnglish ? "VietQR 1-Tap Pay" : "VietQR thanh toán 1 chạm"}
                  </span>
                </div>
                <p className="solution-feature-desc text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal">
                  {isEnglish
                    ? "Dynamic QR with prefilled bank, amount and note for instant banking transfer."
                    : "Tạo sẵn mã QR có sẵn STK, số tiền chính xác từng đồng và nội dung chuyển khoản rõ ràng."}
                </p>
              </div>
            </div>


          </div>

          {/* CỘT HÌNH ẢNH MOBILE HERO (BÊN PHẢI - SO LE) */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Ambient Lighting Behind Phone */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/25 via-indigo-300/20 to-transparent blur-3xl rounded-full scale-90 -z-10" />

            {/* Floating Badge 1 (Top Right) */}
            <div className="hidden sm:flex absolute -top-3 -right-4 sm:-right-6 z-30 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-md px-3.5 py-2.5 shadow-lg shadow-purple-500/10">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-100 text-indigo-700">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-500 font-medium">VietQR 1 Chạm</p>
                <p className="text-xs font-bold text-slate-900">Quét app chuyển tiền ngay</p>
              </div>
            </div>

            {/* Floating Badge 2 (Bottom Left) */}
            <div className="hidden sm:flex absolute -bottom-3 -left-4 sm:-left-8 z-30 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-md px-3.5 py-2.5 shadow-lg shadow-purple-500/10">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-purple-100 text-purple-700 text-xs font-black">
                ⚖️
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-500 font-medium">Thuật toán rút gọn nợ</p>
                <p className="text-xs font-bold text-indigo-600">12 lượt chuyển → chỉ còn 3 lượt</p>
              </div>
            </div>

            {/* Hero Mobile Image */}
            <div className="relative z-10 w-full flex items-center justify-center py-4">
              <img
                src={images.mockupGroup}
                alt="Giao diện Chia tiền nhóm & Quỹ chung trên Trợ Lý Tài Chính"
                className="w-auto h-auto max-h-[460px] sm:max-h-[520px] max-w-[280px] sm:max-w-[340px] md:max-w-[380px] object-contain block drop-shadow-[0_20px_50px_rgba(127,34,254,0.22)] transition-transform duration-300 hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* PHẦN 3: DÒNG TIỀN KINH DOANH & DỰ ÁN (Ảnh Trái - Thông Tin Phải)   */}
        {/* ================================================================= */}
        <section
          id="solutions-business"
          aria-labelledby="title-business"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* CỘT HÌNH ẢNH MOBILE HERO (BÊN TRÁI - SO LE) */}
          <div className="order-2 lg:order-1 lg:col-span-5 flex justify-center relative">
            {/* Ambient Lighting Behind Phone */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/25 via-teal-300/20 to-transparent blur-3xl rounded-full scale-90 -z-10" />

            {/* Floating Badge 1 (Top Left) */}
            <div className="hidden sm:flex absolute -top-3 -left-4 sm:-left-8 z-30 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-md px-3.5 py-2.5 shadow-lg shadow-emerald-500/10">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-500 font-medium">Lợi nhuận ròng tháng</p>
                <p className="text-xs font-bold text-emerald-600">+43.250.000đ (50.6%)</p>
              </div>
            </div>

            {/* Floating Badge 2 (Bottom Right) */}
            <div className="hidden sm:flex absolute -bottom-3 -right-4 sm:-right-6 z-30 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-md px-3.5 py-2.5 shadow-lg shadow-emerald-500/10">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-teal-100 text-teal-700 text-xs font-black">
                ✓
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-500 font-medium">Tạm ứng nhân viên</p>
                <p className="text-xs font-bold text-slate-900">Đã duyệt chi: 5.000.000đ</p>
              </div>
            </div>

            {/* Hero Mobile Image */}
            <div className="relative z-10 w-full flex items-center justify-center py-4">
              <img
                src={images.mockupBusiness}
                alt="Giao diện Dòng tiền kinh doanh & Dự án trên Trợ Lý Tài Chính"
                className="w-auto h-auto max-h-[460px] sm:max-h-[520px] max-w-[280px] sm:max-w-[340px] md:max-w-[380px] object-contain block drop-shadow-[0_20px_50px_rgba(5,150,105,0.22)] transition-transform duration-300 hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          </div>

          {/* CỘT THÔNG TIN (BÊN PHẢI) */}
          <div className="order-1 lg:order-2 lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Tiêu Đề 3D */}
            <h2
              id="title-business"
              className="title-3d text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-slate-950 tracking-tight leading-[1.18]"
            >
              {isEnglish ? (
                <>
                  Business & Project Cash Flow. <br className="hidden sm:inline" />
                  Separate revenue, command profit.
                </>
              ) : (
                <>
                  Dòng tiền kinh doanh & Dự án. <br className="hidden sm:inline" />
                  Tách bạch doanh thu, <span className="inline-block">kiểm soát lợi nhuận.</span>
                </>
              )}
            </h2>

            {/* Mô Tả Dẫn Dắt */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              {isEnglish
                ? "Built for shop owners, freelancers, SMBs and multi-project managers. Keep personal funds and business capital separate, track actual vs accrued revenues, and review expense claims with ease."
                : "Dành riêng cho chủ shop online, hộ kinh doanh, freelancer và người chạy nhiều dự án. Không còn nhầm lẫn giữa tiền cá nhân và vốn làm ăn, quản lý thu chi chuẩn xác theo từng hợp đồng."}
            </p>

            {/* 3 Tính Năng Cốt Lõi (Dính nhau, Không bo góc, Icon ngang hàng Title, Title nhỏ lại) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border border-slate-200 bg-white pt-0">
              <div className="p-3.5 sm:p-4 border-b sm:border-b-0 sm:border-r border-slate-200 transition-colors hover:bg-slate-50/70">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-800" />
                  <span className="solution-feature-title font-bold text-slate-900 text-xs sm:text-[13px] leading-snug">
                    {isEnglish ? "Multi-Entity & Projects" : "Đa công ty & Đa dự án"}
                  </span>
                </div>
                <p className="solution-feature-desc text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal">
                  {isEnglish
                    ? "Isolate finances per shop or contract without data mixing."
                    : "Dữ liệu thu chi được tách riêng theo từng cửa hàng, chi nhánh hoặc dự án độc lập."}
                </p>
              </div>

              <div className="p-3.5 sm:p-4 border-b sm:border-b-0 sm:border-r border-slate-200 transition-colors hover:bg-slate-50/70">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Coins className="w-3.5 h-3.5 shrink-0 text-slate-800" />
                  <span className="solution-feature-title font-bold text-slate-900 text-xs sm:text-[13px] leading-snug">
                    {isEnglish ? "Cash Flow vs Accruals" : "Thực thu chi vs Ghi nhận"}
                  </span>
                </div>
                <p className="solution-feature-desc text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal">
                  {isEnglish
                    ? "Track received, paid, outstanding balances and advance deposits."
                    : "Phân biệt rõ ràng tiền đã thực thu về ví với doanh thu ghi nhận và công nợ gối đầu."}
                </p>
              </div>

              <div className="p-3.5 sm:p-4 transition-colors hover:bg-slate-50/70">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 shrink-0 text-slate-800" />
                  <span className="solution-feature-title font-bold text-slate-900 text-xs sm:text-[13px] leading-snug">
                    {isEnglish ? "Advances & Excel Reports" : "Tạm ứng & Báo cáo Excel"}
                  </span>
                </div>
                <p className="solution-feature-desc text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal">
                  {isEnglish
                    ? "Review employee requests and export P&L statements in 1 click."
                    : "Chủ doanh nghiệp duyệt tạm ứng nhân viên và xuất báo cáo kết quả kinh doanh tức thì."}
                </p>
              </div>
            </div>


          </div>
        </section>

      </div>
    </div>
  );
}
