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
import AppInteractiveSimulator from "../components/home/AppInteractiveSimulator.jsx";
import CompetitorComparison from "../components/home/CompetitorComparison.jsx";
import MarketingLeadMagnet from "../components/home/MarketingLeadMagnet.jsx";
import StickyDownloadBar from "../components/home/StickyDownloadBar.jsx";


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
    q: "Trợ Lý Tài Chính có phiên bản miễn phí không?",
    a: "Có. Bạn có thể bắt đầu với những tính năng quản lý tài chính thiết yếu và nâng cấp khi cần thêm trải nghiệm chuyên sâu.",
  },
  {
    q: "Tôi có thể quản lý những khoản nào?",
    a: "Bạn có thể tổ chức thu nhập, chi tiêu, ví, ngân sách, mục tiêu tiết kiệm, khoản nợ và các giao dịch định kỳ trong cùng một nơi.",
  },
  {
    q: "Dữ liệu được trình bày như thế nào?",
    a: "Các khoản thu chi được gom theo nhóm và chuyển thành biểu đồ, xu hướng cùng báo cáo trực quan để bạn dễ theo dõi.",
  },
  {
    q: "Tôi có thể tùy chỉnh danh mục không?",
    a: "Có. Bạn có thể thiết lập danh mục và cách theo dõi phù hợp với thói quen tài chính của mình.",
  },
  {
    q: "Làm sao để bắt đầu?",
    a: "Chọn “Bắt đầu miễn phí”, đăng nhập tài khoản và tạo khoản thu chi đầu tiên. Giao diện sẽ hướng dẫn bạn qua từng bước.",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function HomePage() {
  const reduceMotion = useReducedMotion();
  const [qrModalOpen, setQrModalOpen] = useState(false);
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
    <Motion.div className="landing-page overflow-hidden bg-[#f8f8f5] text-slate-950">
      <Header />

      <main>
        {/* Epic High-Converting Hero Section */}
        <EpicHero onOpenQr={() => setQrModalOpen(true)} />

        {/* MISA & Banking Style Trust Badges */}
        <TrustBadges />

        <section className="border-y border-slate-200/80 bg-white py-5" aria-label="Nhóm tính năng nổi bật">
          <div className="marquee-mask mx-auto flex max-w-[1380px] overflow-hidden px-5">
            <div className="marquee-track flex min-w-max items-center gap-8 pr-8 text-sm font-extrabold uppercase tracking-[0.18em] text-slate-400 sm:gap-14 sm:pr-14">
              {[WalletCards, PieChart, Bot, Goal, CreditCard, ShieldCheck, WalletCards, PieChart, Bot, Goal, CreditCard, ShieldCheck].map((Icon, index) => (
                <span key={`${Icon.displayName}-${index}`} className="flex items-center gap-2.5 whitespace-nowrap">
                  <Icon className="h-5 w-5 text-sky-500" />
                  {[
                    "Ví & giao dịch",
                    "Ngân sách",
                    "Trợ lý thông minh",
                    "Mục tiêu",
                    "Khoản định kỳ",
                    "Bảo mật",
                  ][index % 6]}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Live Interactive App Simulator (iPhone 16 Pro Mockup with 5 Real App Modes) */}
        <AppInteractiveSimulator onOpenQr={() => setQrModalOpen(true)} />

        <section id="product-preview" className="relative overflow-hidden bg-slate-950 py-24 text-white sm:py-32">
          {!reduceMotion && (
            <div className="absolute inset-0 hidden opacity-40 lg:block">
              <Suspense fallback={null}>
                <FinanceScene variant="insight" />
              </Suspense>
            </div>
          )}
          <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <motion.div {...motionProps} className="mx-auto max-w-3xl text-center">
              <p className="section-kicker text-sky-400">Một góc nhìn. Toàn bộ dòng tiền.</p>
              <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-[-0.045em] sm:text-6xl">
                Hiểu tài chính của bạn chỉ trong một nhịp nhìn.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                Tổng quan thu chi, ngân sách và xu hướng được đặt đúng chỗ — gọn gàng, có ngữ cảnh và dễ hành động.
              </p>
            </motion.div>

            <motion.div
              {...motionProps}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-14 overflow-hidden rounded-[2rem] border border-white/10 bg-[#111827] p-3 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.8)] sm:p-6"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(14,165,233,0.16),transparent_32%)]" />
              <div className="relative grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 sm:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-400">Số dư khả dụng</p>
                      <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        <CountUp end={7.54} decimals={2} duration={1.8} suffix=" triệu" enableScrollSpy scrollSpyOnce />
                      </p>
                    </div>
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-400 text-slate-950">
                      <WalletCards className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/[0.06] p-4">
                      <p className="text-xs font-semibold text-slate-500">Thu nhập</p>
                      <p className="mt-2 text-lg font-extrabold text-emerald-400">+5,28 triệu</p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.06] p-4">
                      <p className="text-xs font-semibold text-slate-500">Chi tiêu</p>
                      <p className="mt-2 text-lg font-extrabold text-rose-400">-2,08 triệu</p>
                    </div>
                  </div>
                  <div className="mt-6 rounded-2xl bg-gradient-to-br from-cyan-300 to-sky-500 p-5 text-slate-950">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-60">Ngân sách tháng</p>
                        <p className="mt-2 text-2xl font-extrabold">68%</p>
                      </div>
                      <Goal className="h-6 w-6" />
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/40">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "68%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: 0.35 }}
                        className="h-full rounded-full bg-slate-950"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-400">Dòng tiền 7 ngày</p>
                      <h3 className="mt-1 text-xl font-extrabold">Thu nhập & chi tiêu</h3>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-400">Dữ liệu minh họa</span>
                  </div>
                  <div className="mt-8 h-[280px] w-full sm:h-[330px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 4, left: -24, bottom: 0 }}>
                        <defs>
                          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.42} />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fb7185" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#fb7185" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#334155" strokeDasharray="4 8" vertical={false} opacity={0.45} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
                        <Tooltip
                          contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 14, color: "white" }}
                          formatter={(value) => [`${value} triệu`, ""]}
                        />
                        <Area type="monotone" dataKey="income" stroke="#38bdf8" strokeWidth={3} fill="url(#income)" />
                        <Area type="monotone" dataKey="expense" stroke="#fb7185" strokeWidth={2.5} fill="url(#expense)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Interactive Feature Showcase with Central Phone Mockup (MISA & FinTech style) */}
        <InteractiveShowcase />

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

        <section className="pb-24 sm:pb-32">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <div className="grid overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-cyan-100 via-sky-100 to-indigo-100 lg:grid-cols-2">
              <motion.div {...motionProps} className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-sky-300">
                  <WandSparkles className="h-6 w-6" />
                </span>
                <h2 className="mt-8 text-4xl font-extrabold leading-tight tracking-[-0.045em] sm:text-5xl">
                  Một trải nghiệm mang đúng nhịp sống của bạn.
                </h2>
                <p className="mt-5 max-w-xl leading-7 text-slate-700">
                  Cá nhân hay kinh doanh, chi tiêu hằng ngày hay kế hoạch dài hạn — bạn chủ động chọn điều cần theo dõi và cách muốn nhìn thấy nó.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {["Danh mục linh hoạt", "Cá nhân & kinh doanh", "Mục tiêu riêng", "Báo cáo theo nhu cầu"].map((item) => (
                    <span key={item} className="flex items-center gap-2.5 font-bold text-slate-800">
                      <Check className="h-5 w-5 stroke-[3]" /> {item}
                    </span>
                  ))}
                </div>
              </motion.div>

              <div className="relative flex min-h-[580px] items-end justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-sky-950 p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.26),transparent_32%)]" />
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 80, rotate: 4 }}
                  whileInView={{ opacity: 1, y: 48, rotate: 4 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-[300px] rounded-[3rem] border-[9px] border-slate-900 bg-slate-900 p-1 shadow-[0_30px_90px_rgba(0,0,0,0.55)] sm:w-[340px]"
                >
                  <div className="absolute left-1/2 top-3 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-slate-950" />
                  <img src={images.mobileDashboard} alt="Màn hình thực tế của ứng dụng Trợ Lý Tài Chính" className="w-full rounded-[2.35rem]" />
                </motion.div>
                <div className="absolute left-5 top-6 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white backdrop-blur-lg sm:left-8 sm:top-10">
                  Ảnh giao diện thật của bạn
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <motion.div {...motionProps} className="mx-auto max-w-3xl text-center">
              <p className="section-kicker text-sky-600">Bắt đầu nhẹ nhàng</p>
              <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-[-0.045em] sm:text-6xl">
                Ba bước để tiền bắt đầu “có lời giải”.
              </h2>
            </motion.div>

            <div className="relative mt-16 grid gap-5 lg:grid-cols-3">
              <div className="absolute left-[16.6%] right-[16.6%] top-14 hidden border-t-2 border-dashed border-slate-200 lg:block" />
              {[
                { icon: Fingerprint, step: "01", title: "Tạo không gian của bạn", text: "Đăng nhập và chọn cách bạn muốn tổ chức tài chính cá nhân." },
                { icon: ScanLine, step: "02", title: "Ghi nhận dòng tiền", text: "Thêm giao dịch, ngân sách và mục tiêu theo nhịp sống thực tế." },
                { icon: Zap, step: "03", title: "Biến hiểu biết thành hành động", text: "Theo dõi xu hướng, nhận gợi ý và điều chỉnh kế hoạch khi cần." },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.step}
                    {...motionProps}
                    transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className="relative rounded-[1.75rem] border border-slate-200 bg-[#f8f8f5] p-8 text-center"
                  >
                    <span className="relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-sky-300 shadow-lg">
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.22em] text-sky-600">Bước {item.step}</p>
                    <h3 className="mt-3 text-xl font-extrabold">{item.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24 sm:py-32">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
            <motion.div {...motionProps} className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="section-kicker text-sky-600">Chọn theo nhu cầu</p>
                <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-[-0.045em] sm:text-6xl">Bắt đầu miễn phí. Nâng cấp khi bạn sẵn sàng.</h2>
              </div>
              <p className="max-w-xl text-lg leading-8 text-slate-600 lg:justify-self-end">
                Trải nghiệm các công cụ nền tảng trước, rồi mở khóa thêm chiều sâu khi kế hoạch tài chính của bạn phát triển.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-5 lg:grid-cols-2">
              <motion.article {...motionProps} className="rounded-[2rem] border border-slate-200 bg-white p-8 sm:p-10">
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-600">Khởi đầu</span>
                <h3 className="mt-6 text-3xl font-extrabold">Miễn phí</h3>
                <p className="mt-3 text-slate-600">Dành cho những bước đầu tiên để hiểu và quản lý dòng tiền.</p>
                <div className="my-8 h-px bg-slate-200" />
                <ul className="space-y-4 text-sm font-semibold text-slate-700">
                  {["Ghi chép thu chi cơ bản", "Theo dõi danh mục", "Tổng quan tài chính", "Trải nghiệm trên ứng dụng"].map((item) => (
                    <li key={item} className="flex items-center gap-3"><Check className="h-5 w-5 text-emerald-500" /> {item}</li>
                  ))}
                </ul>
                <a href="#download" className="mt-9 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3.5 font-bold transition hover:border-slate-950 hover:bg-slate-950 hover:text-white">
                  Bắt đầu ngay <ArrowRight className="h-4 w-4" />
                </a>
              </motion.article>

              <motion.article
                {...motionProps}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-sky-950 p-8 text-white shadow-[0_35px_90px_-35px_rgba(15,23,42,0.75)] sm:p-10"
              >
                <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-sky-400/30 blur-3xl" />
                <div className="relative">
                  <span className="rounded-full bg-sky-400 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-950">Trọn vẹn</span>
                  <h3 className="mt-6 text-3xl font-extrabold">Premium</h3>
                  <p className="mt-3 text-slate-400">Dành cho kế hoạch cần thêm chiều sâu, tự động hóa và góc nhìn nâng cao.</p>
                  <div className="my-8 h-px bg-white/10" />
                  <ul className="space-y-4 text-sm font-semibold text-slate-200">
                    {["Toàn bộ trải nghiệm miễn phí", "Phân tích chuyên sâu", "Nhắc nhở và kế hoạch nâng cao", "Thêm không gian tùy chỉnh"].map((item) => (
                      <li key={item} className="flex items-center gap-3"><Check className="h-5 w-5 text-sky-400" /> {item}</li>
                    ))}
                  </ul>
                  <a href="#download" className="mt-9 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-400 px-6 py-3.5 font-extrabold text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-300">
                    Khám phá Premium <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.article>
            </div>
          </div>
        </section>

        {/* High-Converting Marketing Lead Magnet: Free 2026 Ebook & 30-Day Premium Gift */}
        <MarketingLeadMagnet />

        {/* Wall of Love: App Store Reviews & Community Banner */}
        <WallOfLove />

        <section id="faq" className="bg-white py-24 sm:py-32">
          <div className="mx-auto grid max-w-[1180px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-12">
            <motion.div {...motionProps}>
              <p className="section-kicker text-sky-600">Câu hỏi thường gặp</p>
              <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-[-0.045em] sm:text-5xl">Mọi điều bạn cần biết trước khi bắt đầu.</h2>
              <div className="relative mt-10 hidden overflow-hidden rounded-[1.75rem] bg-slate-950 p-7 text-white lg:block">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-sky-400/30 blur-3xl" />
                <LockKeyhole className="h-7 w-7 text-sky-400" />
                <p className="mt-5 text-lg font-extrabold">Bạn vẫn còn câu hỏi?</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">Đội ngũ Trợ Lý Tài Chính luôn sẵn sàng đồng hành cùng bạn.</p>
              </div>
            </motion.div>
            <motion.div {...motionProps} className="space-y-3">
              {faqItems.map((item, index) => (
                <AccordionItem key={item.q} index={index} q={item.q} a={item.a} defaultOpen={index === 0} />
              ))}
            </motion.div>
          </div>
        </section>

        <section className="bg-white px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="relative mx-auto min-h-[540px] max-w-[1380px] overflow-hidden rounded-[2.25rem] bg-slate-950">
            <img src={images.ready} alt="Các màn hình ứng dụng Trợ Lý Tài Chính" className="absolute inset-0 h-full w-full object-cover object-center opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/5" />
            <motion.div {...motionProps} className="relative z-10 flex min-h-[540px] max-w-2xl flex-col justify-center px-7 py-16 text-white sm:px-14 lg:px-20">
              <p className="section-kicker text-sky-400">Sẵn sàng để bắt đầu?</p>
              <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-[-0.045em] sm:text-6xl">Một quyết định nhỏ hôm nay. Một tương lai chủ động hơn.</h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg">Bắt đầu xây dựng thói quen tài chính rõ ràng cùng Trợ Lý Tài Chính.</p>
              <StoreButtons className="mt-9" buttonClassName="border-white/20 bg-white/10 backdrop-blur-xl" />
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating Action Utility Bar with Quick QR & Scroll-to-Top */}
      <StickyDownloadBar onOpenQr={() => setQrModalOpen(true)} />

      {/* QR Code Modal for Instant Download */}
      <QrDownloadModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
    </Motion.div>
  );
}

export default HomePage;
