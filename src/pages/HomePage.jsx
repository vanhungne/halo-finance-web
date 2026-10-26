import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import images from "../assets/image.js";
import AccordionItem from "../components/faq/AccordionItem.jsx";
import Header from "../components/header/headerComp.jsx";
import Footer from "../components/footer/Footer.jsx";
import EpicHero from "../components/home/EpicHero.jsx";
import BankingEcosystemMarquee from "../components/home/BankingEcosystemMarquee.jsx";
import RealAppFeatureGrid from "../components/home/RealAppFeatureGrid.jsx";
import AppInteractiveSimulator from "../components/home/AppInteractiveSimulator.jsx";
import WebPortalShowcase from "../components/home/WebPortalShowcase.jsx";
import CompetitorComparison from "../components/home/CompetitorComparison.jsx";
import ZeroFeeCommitment from "../components/home/ZeroFeeCommitment.jsx";
import SolutionsSegment from "../components/home/SolutionsSegment.jsx";
import SecurityCompliance from "../components/home/SecurityCompliance.jsx";
import FinancialHealthCheck from "../components/home/FinancialHealthCheck.jsx";
import MarketingLeadMagnet from "../components/home/MarketingLeadMagnet.jsx";
import TrustBadges from "../components/home/TrustBadges.jsx";
import WallOfLove from "../components/home/WallOfLove.jsx";
import QrDownloadModal from "../components/home/QrDownloadModal.jsx";
import EbookDownloadModal from "../components/home/EbookDownloadModal.jsx";
import StickyDownloadBar from "../components/home/StickyDownloadBar.jsx";

const faqItems = [
  {
    q: "Trợ Lý Tài Chính có thực sự miễn phí 100% trọn đời không? Có phát sinh chi phí ẩn không?",
    a: "Cam kết 100% miễn phí trọn đời: 0đ phí tải app, 0đ phí quét hóa đơn AI, 0đ phí tạo quỹ nhóm và chia tiền VietQR. Toàn bộ tính năng cao cấp đều được mở khóa sẵn mà không có bất kỳ chi phí ẩn nào.",
  },
  {
    q: "Công nghệ bóc tách hóa đơn bằng Trí Tuệ Nhân Tạo AI hoạt động như thế nào?",
    a: "Chỉ cần chụp ảnh hóa đơn nhà hàng, siêu thị, hóa đơn tiền điện hay bill in nhiệt mờ. Trí Tuệ Nhân Tạo AI tự động nhận diện tên từng món, đơn giá, số lượng, thuế VAT 8-10% và tự động phân loại đúng danh mục chi tiêu trong chưa đầy 3 giây.",
  },
  {
    q: "Tính năng Quỹ nhóm và Chia tiền VietQR 1 chạm hoạt động như thế nào?",
    a: "Bạn có thể tạo quỹ nhóm cho chuyến du lịch, hội bạn thân hay quỹ gia đình. Khi phát sinh chi tiêu, hệ thống tự động tính ai nợ ai số lần chuyển khoản ít nhất và tạo mã VietQR cá nhân hóa. Thành viên chỉ cần quét mã 1 chạm là tiền về đúng tài khoản và tự động gạch nợ minh bạch.",
  },
  {
    q: "Dữ liệu thu chi của tôi có được bảo mật không? Có bị bán cho bên thứ ba không?",
    a: "Tuyệt đối không! Trợ Lý Tài Chính tuân thủ nghiêm ngặt Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân. Toàn bộ dữ liệu thu chi được mã hóa đầu cuối với khóa AES-256. Chúng tôi cam kết độc lập pháp lý, không bao giờ bán hay chia sẻ dữ liệu tài chính cho công ty quảng cáo hay bảo hiểm.",
  },
  {
    q: "Tôi có bị giới hạn số lượng giao dịch hoặc số lượt quét hóa đơn mỗi tháng không?",
    a: "Hoàn toàn không giới hạn! Bạn có thể thêm hàng nghìn khoản thu chi, quét hóa đơn ăn uống, mua sắm mỗi ngày mà không bao giờ bị giới hạn số lượt hay bắt nâng cấp tài khoản.",
  },
  {
    q: "Trợ Lý Tài Chính có hỗ trợ xuất báo cáo ra file Excel để kiểm tra không?",
    a: "Có. Bạn có thể xuất toàn bộ dữ liệu thu chi, sao kê dòng tiền và phân loại ngân sách ra định dạng file Excel (XLSX, CSV) hoặc PDF chuẩn mực hoàn toàn miễn phí chỉ với một thao tác bấm.",
  },
  {
    q: "Tôi cần hỗ trợ kỹ thuật hoặc góp ý phát triển ứng dụng thì liên hệ ai?",
    a: "Đội ngũ phát triển luôn trực tuyến 24/7 qua Hotline 1900 6868, Live Chat trong ứng dụng hoặc email contact@trolytaichinh.vn với cam kết phản hồi nhanh chóng.",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
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
        viewport: { once: true, amount: 0.15 },
        variants: reveal,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <div className="landing-page overflow-x-clip bg-white text-slate-900">
      {/* 0. Clean Sticky Header */}
      <Header onOpenEbook={() => setEbookModalOpen(true)} />

      <main>
        {/* 1. Clear Value Proposition & Mobile Mockup Hero */}
        <EpicHero onOpenQr={() => setQrModalOpen(true)} />

        {/* 2. Trust Metrics Bar & 54+ VietQR Supported Banks */}
        <BankingEcosystemMarquee />

        {/* 3. Core 16+ App Features (AI OCR, Voice, 50/30/20, VietQR) */}
        <RealAppFeatureGrid onOpenQr={() => setQrModalOpen(true)} />

        {/* 4. Live Interactive App Simulator (Smart Phone Experience) */}
        <AppInteractiveSimulator onOpenQr={() => setQrModalOpen(true)} />

        {/* 5. Web Portal Showcase (Convenience on Work Laptops & PCs) */}
        <WebPortalShowcase />

        {/* 6. Honest Comparison Table (TLTC vs Sổ tay/Excel vs Paid Apps) */}
        <CompetitorComparison />

        {/* 7. Zero Fee & 3-NOs Guarantee (100% Free, No Ads, No Data Selling) */}
        <ZeroFeeCommitment onOpenQr={() => setQrModalOpen(true)} />

        {/* 8. Tailored Solutions (Personal, Student, Family, Group, Shop) */}
        <SolutionsSegment />

        {/* 9. Security & Privacy Compliance (AES-256, 2FA, Decree 13) */}
        <SecurityCompliance />

        {/* 10. Financial Health Check Interactive Quiz */}
        <FinancialHealthCheck />

        {/* 11. Free 2026 Ebook Lead Magnet */}
        <MarketingLeadMagnet />

        {/* 12. App Ratings & Trust Badges */}
        <div className="bg-slate-50/70 border-t border-slate-200/80 py-10">
          <TrustBadges />
        </div>

        {/* 13. Wall of Love: Community & Store Reviews */}
        <WallOfLove />

        {/* 14. Frequently Asked Questions (FAQ) */}
        <section id="faq" className="bg-white py-20 sm:py-28 border-t border-slate-200/80">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10">
            <motion.div {...motionProps}>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-2xs">
                <LockKeyhole className="h-3.5 w-3.5 text-blue-600" />
                <span>Giải Đáp Thắc Mắc 24/7</span>
              </div>
              <h2 className="mt-4 text-2xl sm:text-4xl font-black leading-tight tracking-tight text-slate-900">
                Câu hỏi thường gặp từ{" "}
                <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
                  người dùng.
                </span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                Mọi thông tin về tính năng, bảo mật dữ liệu và cam kết 100% miễn phí trọn đời của Trợ Lý Tài Chính.
              </p>

              <div className="relative mt-8 hidden overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-7 text-white shadow-xl lg:block">
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-400/25 blur-3xl pointer-events-none" />
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 backdrop-blur-md text-sky-300">
                  <LockKeyhole className="h-5 w-5" />
                </span>
                <p className="mt-5 text-lg font-black">Cần Hỗ Trợ Trực Tiếp?</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                  Đội ngũ phát triển và hỗ trợ kỹ thuật của Trợ Lý Tài Chính luôn sẵn sàng đồng hành và giải đáp mọi thắc mắc của bạn 24/7.
                </p>
                <div className="mt-5 pt-5 border-t border-white/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Hotline Trực Tuyến</span>
                    <strong className="text-amber-400 text-base font-black">1900 6868</strong>
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

        {/* 15. Clean, High-Converting Final CTA Section */}
        <section className="bg-white px-4 pb-8 sm:px-8 sm:pb-12">
          <div className="relative mx-auto min-h-[500px] max-w-[1400px] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white shadow-2xl">
            <img
              src={images.ready}
              alt="Làm chủ tài chính cùng Trợ Lý Tài Chính"
              className="absolute inset-0 h-full w-full object-cover object-center opacity-25 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
            <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

            <motion.div {...motionProps} className="relative z-10 flex min-h-[500px] max-w-3xl flex-col justify-center px-6 py-14 sm:px-12 lg:px-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-sky-300 w-fit">
                <Sparkles className="h-4 w-4 text-sky-400" />
                <span>100% Miễn Phí Trọn Đời • 0đ Phí Ẩn</span>
              </div>

              <h2 className="mt-5 text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
                Bắt đầu làm chủ dòng tiền{" "}
                <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  cùng Trí Tuệ Nhân Tạo AI.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-slate-300">
                Hơn 50.000 người dùng đã lựa chọn Trợ Lý Tài Chính để bóc tách hóa đơn trong 3 giây, quản lý ngân sách thông minh và chia tiền nhóm sòng phẳng. Cài đặt hoàn toàn miễn phí ngay hôm nay.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => setQrModalOpen(true)}
                  className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-500 to-sky-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-xl transition hover:opacity-95 hover:-translate-y-0.5 cursor-pointer"
                >
                  <QrCode className="h-5 w-5" />
                  <span>Quét Mã Tải App (0đ)</span>
                </button>
                <a
                  href="/login"
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-xs font-bold text-white hover:bg-white/20 transition hover:-translate-y-0.5 backdrop-blur-md cursor-pointer"
                >
                  <span>Dùng Bản Web Portal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Trust Badges Footer in CTA */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-5 text-xs text-slate-400 font-semibold">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Chuẩn bảo mật AES-256</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Không bao giờ bán dữ liệu</span>
                <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-amber-400" /> Hỗ trợ 54+ ngân hàng VietQR</span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Clean, Non-Intrusive Sticky Utility Bar */}
      <StickyDownloadBar onOpenQr={() => setQrModalOpen(true)} />

      {/* QR Code Modal for Instant Download */}
      <QrDownloadModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />

      {/* Interactive Free 2026 Ebook Download Modal */}
      <EbookDownloadModal isOpen={ebookModalOpen} onClose={() => setEbookModalOpen(false)} />
    </div>
  );
}

export default HomePage;
