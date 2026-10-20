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
import ZeroFeeCommitment from "../components/home/ZeroFeeCommitment.jsx";
import RealAppFeatureGrid from "../components/home/RealAppFeatureGrid.jsx";


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
    q: "Halo Finance có thực sự miễn phí 100% trọn đời không? Có phát sinh chi phí ẩn không?",
    a: "Cam kết 100% miễn phí trọn đời: 0đ phí tải app, 0đ phí mở tài khoản eKYC, 0đ phí bóc tách hóa đơn AI Gemini 2.0, 0đ phí chuyển khoản VietQR và 0đ phí duy trì số dư tối thiểu. Toàn bộ tính năng cao cấp đều được mở khóa sẵn mà không có bất kỳ chi phí ẩn nào.",
  },
  {
    q: "Tại sao Halo Finance lại cung cấp AI Gemini và mọi tính năng cao cấp miễn phí 0 đồng?",
    a: "Trong giai đoạn đầu phát triển, Halo Finance ưu tiên tối đa sứ mệnh bình dân hóa công nghệ tài chính, giúp người Việt làm chủ dòng tiền thông minh. Chúng tôi tập trung tạo giá trị thực sự cho cộng đồng thay vì bán các gói đăng ký thu phí rườm rà.",
  },
  {
    q: "Dữ liệu tài chính và thu chi của tôi có bị bán cho bên thứ ba không?",
    a: "Tuyệt đối không! Halo Finance tuân thủ nghiêm ngặt Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân và tiêu chuẩn PCI-DSS Level 1. Toàn bộ dữ liệu thu chi được mã hóa đầu cuối với khóa AES-256 GCM. Chúng tôi độc lập pháp lý và không bao giờ chia sẻ dữ liệu cho công ty bảo hiểm hay tổ chức quảng cáo.",
  },
  {
    q: "Tôi có bị giới hạn số lượng giao dịch hoặc số lượt quét hóa đơn mỗi tháng không?",
    a: "Hoàn toàn không giới hạn! Bạn có thể thêm hàng nghìn khoản thu chi, quét hóa đơn siêu thị, xăng xe, nhà hàng mỗi ngày bằng camera AI Gemini 2.0 mà không bao giờ bị giới hạn số lượt hay bắt nâng cấp tài khoản.",
  },
  {
    q: "Công nghệ bóc tách hóa đơn AI Gemini 2.0 hoạt động như thế nào?",
    a: "Trợ lý AI Gemini 2.0 tích hợp mô hình thị giác máy tính OCR đa ngôn ngữ, tự động nhận diện hóa đơn viết tay, bill in nhiệt mờ, hóa đơn VAT điện tử hay biên lai chuyển khoản. Chỉ trong 3 giây, tiền hàng, thuế suất VAT và danh mục chi tiêu được phân loại chính xác tới 99.4%.",
  },
  {
    q: "Tính năng Quỹ nhóm và Chia tiền VietQR 1 chạm hoạt động như thế nào?",
    a: "Bạn có thể tạo quỹ nhóm cho gia đình, nhóm bạn du lịch hay hội phụ huynh. Khi có chi tiêu phát sinh, hệ thống tự động tính toán phần tiền của từng người và sinh mã VietQR cá nhân hóa. Thành viên chỉ cần quét mã 1 chạm là gạch nợ tự động, có Giám sát viên duyệt chi minh bạch 2 lớp.",
  },
  {
    q: "Halo Finance có hỗ trợ xuất báo cáo ra file Excel để làm kế toán hoặc khai thuế không?",
    a: "Có. Bạn có thể xuất toàn bộ dữ liệu thu chi, sao kê dòng tiền và phân loại ngân sách ra định dạng file Excel (CSV/XLSX) hoặc PDF chuẩn mực hoàn toàn miễn phí chỉ với một thao tác bấm.",
  },
  {
    q: "Tôi cần hỗ trợ kỹ thuật hoặc góp ý phát triển ứng dụng thì liên hệ ai?",
    a: "Đội ngũ kỹ sư và hỗ trợ khách hàng luôn trực tuyến 24/7 qua Hotline 1900 6868, Live Chat trong ứng dụng hoặc email contact@halofinance.vn với cam kết phản hồi nhanh chóng.",
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
        {/* 1. Epic High-Converting Hero Section */}
        <EpicHero onOpenQr={() => setQrModalOpen(true)} />

        {/* 2. Commercial Banking Quick Action Bar */}
        <BankingQuickActionBar onOpenQr={() => setQrModalOpen(true)} />

        {/* 3. Institutional Scale Metrics & 54+ Bank Partner Ecosystem */}
        <BankingEcosystemMarquee />

        {/* 4. Live Interactive App Simulator (iPhone 16 Pro Mockup with 7 Real App Modes - Instant WOW) */}
        <AppInteractiveSimulator onOpenQr={() => setQrModalOpen(true)} />

        {/* 5. Complete Audited 16+ Real App Features Directory */}
        <RealAppFeatureGrid onOpenQr={() => setQrModalOpen(true)} />

        {/* 6. Omnichannel Internet Banking Web Portal Showcase */}
        <WebPortalShowcase />

        {/* 7. Zero Fee Commitment (100% Miễn Phí Trọn Đời - Không Bán Gói - Không Phí Ẩn) */}
        <ZeroFeeCommitment onOpenQr={() => setQrModalOpen(true)} />

        {/* 8. Bank-Grade Head-to-Head Comparison Matrix */}
        <CompetitorComparison />

        {/* 9. Tailored Solutions (Personal & Family, Small Business & Online Shop, Investors) */}
        <SolutionsSegment />

        {/* 10. Bank-Grade Financial Calculators */}
        <FinancialCalculators />

        {/* 11. Live Market Rates (Currencies, SJC Gold, Deposit Rates) */}
        <LiveMarketRates />

        {/* 12. Financial Health Check Interactive Quiz */}
        <FinancialHealthCheck />

        {/* 13. Bank-grade Security & Compliance */}
        <SecurityCompliance />

        {/* 14. 3-Step World-Class Banking Onboarding Flow */}
        <InstitutionalOnboarding onOpenQr={() => setQrModalOpen(true)} />

        {/* 15. Global Banking Infrastructure & Multi-Region Cloud Network */}
        <GlobalInfrastructure />

        {/* 16. High-Converting Marketing Lead Magnet: Free 2026 Ebook */}
        <MarketingLeadMagnet />

        {/* 17. App Ratings & Trust Badges */}
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
