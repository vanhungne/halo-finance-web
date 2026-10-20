import { lazy, Suspense, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CountUp from "react-countup";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BellRing,
  Bot,
  Check,
  ChevronRight,
  CreditCard,
  Fingerprint,
  Goal,
  LineChart,
  LockKeyhole,
  PieChart,
  ScanLine,
  ShieldCheck,
  Sparkles,
  WalletCards,
  WandSparkles,
  Zap,
  QrCode,
  Building2,
  Lock,
} from "lucide-react";
import images from "../assets/image.js";
import AccordionItem from "../components/faq/AccordionItem.jsx";
import Header from "../components/header/headerComp.jsx";
import Footer from "../components/footer/Footer.jsx";
import StoreButtons from "../components/home/StoreButtons.jsx";
import TrustBadges from "../components/home/TrustBadges.jsx";
import InteractiveShowcase from "../components/home/InteractiveShowcase.jsx";
import SolutionsSegment from "../components/home/SolutionsSegment.jsx";
import AiScannerDeepDive from "../components/home/AiScannerDeepDive.jsx";
import FinancialCalculators from "../components/home/FinancialCalculators.jsx";
import LiveMarketRates from "../components/home/LiveMarketRates.jsx";
import FinancialHealthCheck from "../components/home/FinancialHealthCheck.jsx";
import SecurityCompliance from "../components/home/SecurityCompliance.jsx";
import WallOfLove from "../components/home/WallOfLove.jsx";
import QrDownloadModal from "../components/home/QrDownloadModal.jsx";
import EpicHero from "../components/home/EpicHero.jsx";
import BankingQuickActionBar from "../components/home/BankingQuickActionBar.jsx";
import BankingEcosystemMarquee from "../components/home/BankingEcosystemMarquee.jsx";
import WebPortalShowcase from "../components/home/WebPortalShowcase.jsx";
import VipCardShowcase from "../components/home/VipCardShowcase.jsx";
import AppInteractiveSimulator from "../components/home/AppInteractiveSimulator.jsx";
import CompetitorComparison from "../components/home/CompetitorComparison.jsx";
import MarketingLeadMagnet from "../components/home/MarketingLeadMagnet.jsx";
import StickyDownloadBar from "../components/home/StickyDownloadBar.jsx";
import LiveSocialProofTicker from "../components/home/LiveSocialProofTicker.jsx";
import EbookDownloadModal from "../components/home/EbookDownloadModal.jsx";
import GlobalInfrastructure from "../components/home/GlobalInfrastructure.jsx";
import InstitutionalOnboarding from "../components/home/InstitutionalOnboarding.jsx";
import InstitutionalPricing from "../components/home/InstitutionalPricing.jsx";


const FinanceScene = lazy(() => import("../components/home/FinanceScene.jsx"));
const Motion = motion;

const chartData = [
  { day: "T2", income: 2.4, expense: 1.1 },
  { day: "T3", income: 3.2, expense: 1.8 },
  { day: "T4", income: 2.9, expense: 1.4 },
  { day: "T5", income: 4.5, expense: 2.2 },
  { day: "T6", income: 4.1, expense: 2.7 },
  { day: "T7", income: 5.7, expense: 2.3 },
  { day: "CN", income: 6.4, expense: 3.1 },
];

const features = [
  {
    icon: ScanLine,
    title: "Ghi chép trong tích tắc",
    description: "Thêm khoản thu chi nhanh, rõ ràng và đúng ngữ cảnh ngay khi phát sinh.",
    tone: "bg-sky-50 text-sky-600",
  },
  {
    icon: PieChart,
    title: "Ngân sách trực quan",
    description: "Biết tiền đang đi đâu và còn bao nhiêu trước khi tháng kết thúc.",
    tone: "bg-rose-50 text-rose-500",
  },
  {
    icon: Goal,
    title: "Mục tiêu có lộ trình",
    description: "Chia mục tiêu lớn thành các bước nhỏ, dễ theo dõi và dễ duy trì.",
    tone: "bg-yellow-50 text-yellow-600",
  },
  {
    icon: BellRing,
    title: "Nhắc nhở đúng lúc",
    description: "Theo dõi hóa đơn, giao dịch định kỳ và các mốc tài chính quan trọng.",
    tone: "bg-violet-50 text-violet-600",
  },
  {
    icon: LineChart,
    title: "Báo cáo dễ hiểu",
    description: "Biến dữ liệu thu chi thành xu hướng và góc nhìn có thể hành động.",
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: ShieldCheck,
    title: "Riêng tư là ưu tiên",
    description: "Trải nghiệm được thiết kế với sự minh bạch và quyền kiểm soát của bạn.",
    tone: "bg-slate-100 text-slate-700",
  },
];

const faqItems = [
  {
    q: "Halo Finance được cấp phép và bảo chứng pháp lý như thế nào?",
    a: "Halo Finance là nền tảng công nghệ tài chính số liên kết trực tiếp với mạng lưới chuyển mạch quốc gia NAPAS 24/7 và 54+ ngân hàng thương mại cổ phần tại Việt Nam. Toàn bộ tiền gửi và giao dịch thanh toán được bảo vệ theo quy định của Ngân hàng Nhà nước Việt Nam (NHNN) và Luật Các Tổ Chức Tín Dụng.",
  },
  {
    q: "Tiền gửi và số dư tài khoản của tôi được bảo vệ và mã hóa ra sao?",
    a: "Tài sản của bạn được lưu ký an toàn tại các ngân hàng đối tác chuẩn Tier-1 (Vietcombank, MB, Techcombank). Hạ tầng Halo áp dụng tiêu chuẩn bảo mật dữ liệu thẻ quốc tế cao nhất PCI-DSS Level 1, mã hóa toàn trình AES-256 GCM và đối chiếu sinh trắc học khuôn mặt theo Quyết định 2345/QĐ-NHNN.",
  },
  {
    q: "Mở tài khoản số đẹp có phát sinh phí duy trì hoặc phí ẩn không?",
    a: "Cam kết minh bạch tuyệt đối: 0đ phí mở tài khoản, 0đ phí duy trì số dư tối thiểu trọn đời và 0đ phí chuyển khoản liên ngân hàng 24/7. Bạn được tự do chọn các đuôi số phong thủy (Tứ quý, Thần tài, Lộc phát, Ngày sinh) hoàn toàn miễn phí ngay trong luồng eKYC 60 giây.",
  },
  {
    q: "Công nghệ bóc tách hóa đơn AI Gemini 2.0 hoạt động như thế nào?",
    a: "Trợ lý AI Gemini 2.0 tích hợp mô hình thị giác máy tính OCR đa ngôn ngữ, tự động nhận diện hóa đơn viết tay, bill rách mờ, hóa đơn điện tử VAT hay biên lai quán cafe. Chỉ trong 3 giây, tiền hàng, thuế suất VAT và danh mục chi tiêu được phân loại chính xác tới 99.4% mà không cần nhập thủ công.",
  },
  {
    q: "Đặc quyền và hạn mức chi tiêu của Thẻ Halo Titanium VIP?",
    a: "Thẻ Halo Titanium VIP được chế tác từ kim loại nguyên khối mạ khắc laser, tích hợp chip kép Dual EMV Contactless. Khách hàng VIP được hoàn tiền 3.5% không giới hạn cho ẩm thực, mua sắm, du lịch; miễn phí phòng chờ sân bay DragonPass tại 1.300+ sân bay quốc tế và hạn mức thấu chi tín dụng lên đến 500 triệu đồng.",
  },
  {
    q: "Doanh nghiệp SME và Hộ kinh doanh tích hợp VietQR và SePay như thế nào?",
    a: "Doanh nghiệp có thể tạo cổng thanh toán mã VietQR động theo từng đơn hàng chỉ trong 2 phút qua API Webhooks SePay. Khi khách hàng chuyển khoản, hệ thống tự động đối soát và gạch nợ trong mili-giây, đồng thời kết nối trực tiếp với phần mềm kế toán MISA, Fast và Tổng cục Thuế.",
  },
  {
    q: "Tôi có thể sử dụng Thẻ Halo khi đi du lịch hoặc công tác nước ngoài không?",
    a: "Có. Thẻ Halo Titanium Contactless được chấp nhận tại hơn 200 quốc gia và vùng lãnh thổ, tại hàng triệu điểm thanh toán POS và cây ATM có biểu tượng Visa/Mastercard toàn cầu với tỷ giá ngoại tệ quy đổi cạnh tranh nhất thị trường.",
  },
  {
    q: "Tôi cần hỗ trợ kỹ thuật hoặc khiếu nại giao dịch thì liên hệ ai?",
    a: "Đội ngũ CSKH và Chuyên viên Priority Banker trực tiếp hỗ trợ 24/7/365 qua Hotline khẩn cấp 1900 6868, Live Chat trong ứng dụng hoặc email contact@halofinance.vn với cam kết phản hồi trong vòng 60 giây.",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function HomePage() {
  const reduceMotion = useReducedMotion();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [ebookModalOpen, setEbookModalOpen] = useState(false);
  const motionProps = reduceMotion
    ? {}
    : {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.18 },
        variants: reveal,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <div className="landing-page overflow-x-clip bg-white text-slate-900">
      <Header onOpenEbook={() => setEbookModalOpen(true)} />

      <main>
        {/* Epic High-Converting Hero Section */}
        <EpicHero onOpenQr={() => setQrModalOpen(true)} />

        {/* Commercial Banking Quick Action Bar */}
        <BankingQuickActionBar onOpenQr={() => setQrModalOpen(true)} />

        {/* Institutional Scale Metrics & 54+ Bank Partner Ecosystem */}
        <BankingEcosystemMarquee />

        {/* Omnichannel Internet Banking Web Portal Showcase */}
        <WebPortalShowcase />

        {/* International Payment Cards & VIP Priority Privileges */}
        <VipCardShowcase onOpenQr={() => setQrModalOpen(true)} />

        {/* Live Interactive App Simulator (iPhone 16 Pro Mockup with 5 Real App Modes) */}
        <AppInteractiveSimulator onOpenQr={() => setQrModalOpen(true)} />

        {/* Live Interactive Cashflow & Analytics Dashboard */}
        <section id="product-preview" className="relative overflow-hidden bg-slate-50/50 py-24 text-slate-900 sm:py-32 border-t border-slate-200/80">
          <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <motion.div {...motionProps} className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Một góc nhìn • Toàn bộ dòng tiền</span>
              </div>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl text-slate-900">
                Hiểu tài chính của bạn{" "}
                <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
                  chỉ trong một nhịp nhìn.
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Tổng quan thu chi, hạn mức ngân sách và xu hướng dòng tiền được trực quan hóa chuẩn xác — thông minh, có ngữ cảnh và dễ dàng ra quyết định.
              </p>
            </motion.div>

            <motion.div
              {...motionProps}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-14 overflow-hidden rounded-[2.25rem] border border-slate-200/90 bg-white p-4 shadow-xl shadow-slate-200/50 sm:p-7"
            >
              <div className="relative grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
                {/* Left Card: Available Balance & Budget */}
                <div className="rounded-[1.75rem] border border-slate-100 bg-slate-50/90 p-5 sm:p-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Số dư khả dụng</p>
                        <p className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                          <CountUp end={268.45} decimals={2} duration={1.8} suffix=" triệu đ" enableScrollSpy scrollSpyOnce />
                        </p>
                      </div>
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
                        <WalletCards className="h-6 w-6" />
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4">
                        <p className="text-xs font-bold text-emerald-800">Thu nhập tháng</p>
                        <p className="mt-1 text-lg font-black text-emerald-600">+38,50 triệu đ</p>
                      </div>
                      <div className="rounded-2xl border border-rose-100 bg-rose-50/80 p-4">
                        <p className="text-xs font-bold text-rose-800">Tổng chi tiêu</p>
                        <p className="mt-1 text-lg font-black text-rose-600">-14,28 triệu đ</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-5 text-white shadow-md shadow-blue-500/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-100 opacity-90">Hạn mức ngân sách tháng</p>
                        <p className="mt-1 text-2xl font-black">Còn 54% an toàn</p>
                      </div>
                      <Goal className="h-6 w-6 text-blue-200" />
                    </div>
                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-black/20">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "46%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: 0.35 }}
                        className="h-full rounded-full bg-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Card: 7-Day Cashflow Chart */}
                <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Dòng tiền 7 ngày gần nhất</p>
                      <h3 className="mt-1 text-xl font-black text-slate-900">Biến động Thu nhập & Chi tiêu</h3>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                      Dữ liệu thời gian thực
                    </span>
                  </div>
                  <div className="mt-6 h-[280px] w-full sm:h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="incomeLight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0284c7" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#0284c7" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="expenseLight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 6" vertical={false} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }} dy={8} />
                        <Tooltip
                          contentStyle={{
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: 14,
                            color: "#0f172a",
                            boxShadow: "0 10px 30px -5px rgba(0,0,0,0.1)",
                            fontWeight: "bold",
                          }}
                          formatter={(value) => [`${value} triệu đ`, ""]}
                        />
                        <Area type="monotone" dataKey="income" name="Thu nhập" stroke="#0284c7" strokeWidth={3} fill="url(#incomeLight)" />
                        <Area type="monotone" dataKey="expense" name="Chi tiêu" stroke="#f43f5e" strokeWidth={2.5} fill="url(#expenseLight)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bank-Grade Head-to-Head Comparison Matrix */}
        <CompetitorComparison />

        {/* Tailored Solutions (Personal & Family, Small Business & Online Shop, Investors) */}
        <SolutionsSegment />

        {/* AI Receipt Intelligence v2 Deep Dive */}
        <AiScannerDeepDive />

        {/* Bank-Grade Financial Calculators */}
        <FinancialCalculators />

        {/* Live Market Rates (Currencies, SJC Gold, Deposit Rates) */}
        <LiveMarketRates />

        {/* Financial Health Check Interactive Quiz */}
        <FinancialHealthCheck />

        {/* Bank-grade Security & Compliance */}
        <SecurityCompliance />

        {/* 3-Step World-Class Banking Onboarding Flow */}
        <InstitutionalOnboarding onOpenQr={() => setQrModalOpen(true)} />

        {/* Global Banking Infrastructure & Multi-Region Cloud Network */}
        <GlobalInfrastructure />

        {/* Institutional 3-Tier Pricing & Enterprise Membership */}
        <InstitutionalPricing onOpenQr={() => setQrModalOpen(true)} />

        {/* High-Converting Marketing Lead Magnet: Free 2026 Ebook & 30-Day Premium Gift */}
        <MarketingLeadMagnet />

        {/* App Ratings & Trust Badges */}
        <div className="bg-slate-50/70 border-t border-slate-200/80 py-12">
          <TrustBadges />
        </div>

        {/* Wall of Love: App Store Reviews & Community Banner */}
        <WallOfLove />

        <section id="faq" className="bg-white py-24 sm:py-32">
          <div className="mx-auto grid max-w-[1180px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-12">
            <motion.div {...motionProps}>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-2xs">
                <LockKeyhole className="h-3.5 w-3.5 text-blue-600" />
                <span>Giải Đáp Trực Tuyến 24/7</span>
              </div>
              <h2 className="mt-4 text-3xl sm:text-5xl font-black leading-tight tracking-tight text-slate-900">
                Câu hỏi thường gặp từ{" "}
                <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
                  khách hàng định chế.
                </span>
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Minh bạch pháp lý, tiêu chuẩn an toàn vốn và cam kết dịch vụ chuẩn quốc tế của hệ sinh thái Halo Finance.
              </p>

              <div className="relative mt-10 hidden overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-8 text-white shadow-xl lg:block">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-sky-400/30 blur-3xl pointer-events-none" />
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 backdrop-blur-md text-sky-300">
                  <LockKeyhole className="h-6 w-6" />
                </span>
                <p className="mt-6 text-xl font-black">Cần Tư Vấn Chuyên Sâu?</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  Đội ngũ Chuyên viên Priority Banker & Kỹ sư Giải pháp FinTech luôn trực tuyến hỗ trợ 24/7 qua Hotline khẩn cấp hoặc Cổng trợ giúp riêng.
                </p>
                <div className="mt-6 pt-6 border-t border-white/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Hotline Ưu Tiên</span>
                    <strong className="text-amber-400 text-lg font-black">1900 6868</strong>
                  </div>
                  <a
                    href="tel:19006868"
                    className="rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold transition"
                  >
                    Gọi Ngay
                  </a>
                </div>
              </div>
            </motion.div>
            <motion.div {...motionProps} className="space-y-3">
              {faqItems.map((item, index) => (
                <AccordionItem key={item.q} index={index} q={item.q} a={item.a} defaultOpen={index === 0} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Grand Institutional Final CTA Section */}
        <section className="bg-white px-4 pb-8 sm:px-8 sm:pb-12">
          <div className="relative mx-auto min-h-[560px] max-w-[1440px] overflow-hidden rounded-[2.75rem] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white shadow-2xl">
            <img
              src={images.ready}
              alt="Hệ sinh thái định chế tài chính số Halo Finance"
              className="absolute inset-0 h-full w-full object-cover object-center opacity-30 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
            <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

            <motion.div {...motionProps} className="relative z-10 flex min-h-[560px] max-w-3xl flex-col justify-center px-7 py-16 sm:px-14 lg:px-20">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-sky-300 w-fit">
                <ShieldCheck className="h-4 w-4 text-sky-400" />
                <span>Tiêu Chuẩn Định Chế Tài Chính Quốc Tế</span>
              </div>

              <h2 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
                Gia nhập kỷ nguyên{" "}
                <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  ngân hàng số đỉnh cao.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-slate-300">
                Hơn 3.2 triệu khách hàng cá nhân, chủ hộ kinh doanh và doanh nghiệp đã tin tưởng làm chủ dòng tiền cùng Halo Finance. Khởi tạo tài khoản số đẹp 0đ phí ngay hôm nay.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQrModalOpen(true)}
                  className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-500 to-sky-400 px-7 py-3.5 text-sm font-black text-slate-950 shadow-xl transition hover:opacity-95 hover:-translate-y-0.5"
                >
                  <Building2 className="h-5 w-5" />
                  <span>Mở Tài Khoản eKYC (0đ Phí)</span>
                </button>
                <a
                  href="/app"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition hover:-translate-y-0.5 backdrop-blur-md"
                >
                  <span>Cổng Web Banking</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              {/* Trust Badges Footer in CTA */}
              <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-semibold">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> PCI-DSS Level 1</span>
                <span className="flex items-center gap-1.5"><LockKeyhole className="w-4 h-4 text-sky-400" /> ISO 27001 Certified</span>
                <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-amber-400" /> Liên minh NAPAS 24/7</span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating Action Utility Bar with Quick QR & Scroll-to-Top */}
      <StickyDownloadBar onOpenQr={() => setQrModalOpen(true)} />

      {/* Real-Time CRO Social Proof Activity Toasts */}
      <LiveSocialProofTicker onOpenQr={() => setQrModalOpen(true)} />

      {/* QR Code Modal for Instant Download */}
      <QrDownloadModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />

      {/* Interactive Free 2026 Ebook & VIP Toolkit Download Modal */}
      <EbookDownloadModal isOpen={ebookModalOpen} onClose={() => setEbookModalOpen(false)} />
    </div>
  );
}

export default HomePage;
