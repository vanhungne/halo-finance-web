import { Link, useLocation } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  ExternalLink,
  MapPin,
} from "lucide-react";
import images from "../../assets/image.js";
import { useLanguage } from "../../contexts/LanguageContext.jsx";

const getFooterColumns = (isEn) => [
  {
    title: isEn ? "Company" : "Công ty",
    links: [
      { label: isEn ? "About Us" : "Giới thiệu", href: "#home" },
      { label: isEn ? "Customers" : "Khách hàng", href: "#reviews" },
    ],
  },
  {
    title: isEn ? "Product" : "Sản phẩm",
    links: [
      { label: isEn ? "Personal Finance" : "Tài chính cá nhân", href: "#features-personal" },
      { label: isEn ? "Business Finance" : "Tài chính kinh doanh", href: "#features-business" },
      { label: isEn ? "Group Expense" : "Nhóm chi tiêu", href: "#features-group" },
      { label: isEn ? "Group Splitter (Free)" : "Chia tiền nhóm (Miễn phí)", href: "/split-bills", isRouter: true },
      { label: isEn ? "AI Assistant" : "Trợ lý AI", href: "#features" },
    ],
  },
  {
    title: isEn ? "Explore" : "Tìm hiểu",
    links: [
      { label: isEn ? "User Guide" : "Hướng dẫn sử dụng", href: "#solutions" },
      { label: isEn ? "Product Updates" : "Cập nhật sản phẩm", href: "#features" },
    ],
  },
  {
    title: isEn ? "Support" : "Hỗ trợ",
    links: [
      { label: isEn ? "Help Center (FAQ)" : "Câu hỏi thường gặp", href: "#faq" },
      { label: isEn ? "Contact Support" : "Liên hệ hỗ trợ", href: "tel:19006868" },
      { label: isEn ? "Feedback & Bug Report" : "Báo lỗi & góp ý", href: "mailto:contact@trolytaichinh.vn" },
      { label: isEn ? "User Community" : "Cộng đồng người dùng", href: "#reviews" },
    ],
  },
  {
    title: isEn ? "Policy" : "Chính sách",
    links: [
      { label: isEn ? "Data Security" : "Bảo mật dữ liệu", href: "#security" },
      { label: isEn ? "Payment & Refunds" : "Thanh toán & hoàn tiền", href: "#free-commitment" },
      { label: isEn ? "Decree 13 Compliance" : "Tuân thủ Nghị định 13", href: "#security" },
      { label: isEn ? "AES-256 Security" : "Cam kết an toàn AES-256", href: "#security" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
];

export default function Footer({ onOpenQr }) {
  const { pathname } = useLocation();
  const currentYear = new Date().getFullYear();
  const { isEnglish } = useLanguage();

  const footerColumns = getFooterColumns(isEnglish);

  return (
    <>
    <footer className="relative w-full border-t border-white/10 bg-[#161619] text-white overflow-hidden">
      {/* Ambient background glow subtly matching Dean Studio dark mode */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-40 left-1/4 h-80 w-96 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute -bottom-40 right-1/4 h-80 w-96 rounded-full bg-indigo-600/15 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 sm:px-10 lg:px-16 xl:px-20 pt-14 pb-8 sm:pb-10">
        {/* ========================================================= */}
        {/* ROW 1: 5 Link Columns (Nằm trên cùng 1 hàng riêng)        */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 sm:pb-14 border-b border-white/10">
          {footerColumns.map((col) => (
            <div key={col.title} className="flex flex-col">
              <h3 className="mb-4 text-xs sm:text-sm font-medium tracking-wide flex items-center gap-1.5">
                <span className="text-white/40 font-mono select-none">//</span>
                <span className="text-white/90 font-medium">{col.title}</span>
              </h3>

              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.isRouter ? (
                      <Link
                        to={link.href}
                        className="group/link relative flex w-fit items-center gap-1 py-0.5 text-xs sm:text-sm text-white/60 transition-colors duration-150 hover:text-white"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-0 bg-blue-400 transition-all duration-200 group-hover/link:w-full" />
                        </span>
                      </Link>
                    ) : (
                      <a
                        href={link.href.startsWith('#') ? '/' + link.href : link.href}
                        target={link.isExternal ? "_blank" : undefined}
                        rel={link.isExternal ? "noopener noreferrer" : undefined}
                        className="group/link relative flex w-fit items-center gap-1 py-0.5 text-xs sm:text-sm text-white/60 transition-colors duration-150 hover:text-white"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-0 bg-blue-400 transition-all duration-200 group-hover/link:w-full" />
                        </span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ========================================================= */}
        {/* ROW 2: Brand Info & Office Address + Social Links         */}
        {/* ========================================================= */}
        <div className="py-10 sm:py-12 border-b border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Brand Info & Social Links (Span 7 on Desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-2.5 w-fit group">
              <img
                src={images.logo}
                width={2084} height={440}
                alt="Trợ Lý Tài Chính"
                className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>

            <p className="max-w-xl text-sm leading-relaxed text-white/60">
              {isEnglish
                ? "Smart financial management app for personal wealth, group expenses, and business cash flow. Easily track income and expenses, plan budgets, monitor debts, view visual reports, and leverage AI for instant receipt scanning and voice transaction entry."
                : "Ứng dụng quản lý tài chính cá nhân, chi tiêu nhóm và dòng tiền kinh doanh. Hỗ trợ ghi chép thu chi, lập ngân sách, theo dõi công nợ và xem báo cáo trực quan, tích hợp AI giúp quét hóa đơn và nhập giao dịch bằng giọng nói."}
            </p>

            {/* Social Links (Theo dõi chúng tôi - Nằm dưới mô tả) */}
            <div className="flex flex-col gap-2.5 pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/45">
                {isEnglish ? "Follow Us" : "Theo dõi chúng tôi"}
              </span>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-white hover:scale-105 transition-all duration-200"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Office Address & Mobile App Badges (Span 5 on Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:pl-6">
            {/* Office Address */}
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold tracking-wide">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{isEnglish ? "HCMC Office:" : "VP. HCM:"}</span>
              </div>
              <a
                href="tel:+84896691313"
                className="text-base sm:text-lg font-bold text-white hover:text-blue-400 transition-colors tracking-tight w-fit my-0.5"
              >
                (+84) 896 69 1313
              </a>
              <p className="text-white/60 leading-relaxed max-w-sm">
                Tầng 2, Tòa Jasmine 1, Hà Đô Centrosa Garden, 200 Đường 3/2, Phường Hòa Hưng, TP.HCM
              </p>
            </div>

            {/* Mobile App Downloads (Trợ Lý Tài Chính đã có mặt trên) */}
            <div className="flex flex-col gap-2.5 pt-1">
              <span className="text-xs font-semibold text-white/70">
                {isEnglish
                  ? "TroLyTaiChinh is available on:"
                  : "Trợ Lý Tài Chính đã có mặt trên:"}
              </span>

              <div className="flex flex-wrap items-center gap-3">
                {/* App Store Button */}
                <a
                  href={pathname === '/' ? '#download' : '/#download'}
                  onClick={(e) => {
                    if (onOpenQr) {
                      e.preventDefault();
                      onOpenQr();
                    }
                  }}
                  className="group inline-flex items-center gap-2.5 rounded-xl bg-[#eef2ff] hover:bg-white text-slate-950 px-3.5 py-2 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-500/10 active:scale-95 border border-white/20 cursor-pointer"
                  title={isEnglish ? "Click to scan QR code" : "Bấm để quét mã QR tải ứng dụng"}
                >
                  <svg viewBox="0 0 32 43" className="h-6 w-6 shrink-0 fill-current text-slate-950" aria-hidden="true">
                    <path d="M26.9 20.1c0-5.1 4.2-7.6 4.4-7.7-2.4-3.5-6.1-4-7.4-4.1-3.1-.3-6.2 1.9-7.8 1.9-1.7 0-4.2-1.9-6.9-1.8-3.5.1-6.8 2.1-8.6 5.2-3.7 6.4-.9 15.8 2.6 21 1.8 2.5 3.8 5.3 6.5 5.2 2.6-.1 3.6-1.7 6.8-1.7 3.1 0 4.1 1.7 6.8 1.6 2.8 0 4.6-2.5 6.3-5.1 2-2.9 2.8-5.8 2.8-6-.1 0-5.4-2.1-5.5-8.5ZM21.9 5c1.4-1.8 2.4-4.2 2.1-6.6-2.1.1-4.8 1.5-6.3 3.3-1.4 1.6-2.6 4-2.2 6.3 2.4.2 4.8-1.2 6.4-3Z" transform="translate(0 2)" />
                  </svg>
                  <div className="text-left leading-tight">
                    <span className="block text-[9px] font-medium text-slate-700">
                      {isEnglish ? "Download on the" : "Tải về trên"}
                    </span>
                    <span className="block text-xs sm:text-sm font-bold text-slate-950 tracking-tight">App Store</span>
                  </div>
                </a>

                {/* Google Play Button */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.trolytaichinh.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-xl bg-[#eef2ff] hover:bg-white text-slate-950 px-3.5 py-2 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-500/10 active:scale-95 border border-white/20"
                >
                  <svg viewBox="0 0 28 31" className="h-6 w-6 shrink-0" aria-hidden="true">
                    <path fill="#00d6ff" d="M1.1 1.8 16.7 15.5 1.2 29.2C.4 28.7 0 27.8 0 26.7V4.3c0-1 .4-1.9 1.1-2.5Z" />
                    <path fill="#ffda00" d="m21.7 11.1-5 4.4L1.1 1.8C1.7 1.4 2.5 1.3 3.3 1.7l18.4 9.4Z" />
                    <path fill="#ff3a44" d="m21.7 19.9-18.5 9.4c-.7.4-1.5.3-2-.1l15.5-13.7 5 4.4Z" />
                    <path fill="#00f076" d="m27 13.8-5.3-2.7-5 4.4 5 4.4 5.3-2.7c1.3-.7 1.3-2.7 0-3.4Z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-700">
                      {isEnglish ? "GET IT ON" : "TẢI VỀ TỪ"}
                    </span>
                    <span className="block text-xs sm:text-sm font-bold text-slate-950 tracking-tight">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ROW 3: Copyright & Legal Links (Bottom Row)               */}
        {/* ========================================================= */}
        <div className="pt-8 sm:pt-10 flex flex-col gap-4 text-xs text-white/45 lg:flex-row lg:items-center lg:justify-between">
          <p>
            {isEnglish
              ? `© ${currentYear} TroLyTaiChinh. All rights reserved.`
              : `© ${currentYear} Trợ Lý Tài Chính. Bảo lưu mọi quyền.`}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white text-[12px] font-medium">
            <Link
              to="/privacy"
              className="text-white underline underline-offset-4 decoration-white/70 hover:decoration-white hover:text-white transition-all"
            >
              {isEnglish ? "Privacy Policy" : "Chính sách bảo mật"}
            </Link>
            <Link
              to="/terms"
              className="text-white underline underline-offset-4 decoration-white/70 hover:decoration-white hover:text-white transition-all"
            >
              {isEnglish ? "Terms of Service" : "Điều khoản sử dụng"}
            </Link>
            <Link
              to="/delete-account"
              className="text-white underline underline-offset-4 decoration-white/70 hover:decoration-white hover:text-white transition-all"
            >
              {isEnglish ? "Delete Account Request" : "Yêu cầu xóa tài khoản"}
            </Link>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-4 decoration-white/70 hover:decoration-white hover:text-white transition-all inline-flex items-center gap-1.5 group"
            >
              <span>Sitemap XML</span>
              <ExternalLink className="h-3.5 w-3.5 text-white/80 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
