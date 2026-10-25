import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  QrCode,
  ScanLine,
  Users2,
  HandCoins,
  Building2,
  TrendingUp,
  PiggyBank,
  Calculator,
  Activity,
  Coins,
  User,
  Briefcase,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Scale,
  Lock,
  PhoneCall,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import images from "../../assets/image.js";
import QrDownloadModal from "../home/QrDownloadModal.jsx";
import TopAnnouncementBar from "../home/TopAnnouncementBar.jsx";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import LanguageSwitcher from "../common/LanguageSwitcher.jsx";

const Motion = motion;

// Mega Menu Definitions - FinTech Tier-1 Architecture
const FEATURE_ITEMS = [
  {
    icon: ScanLine,
    title: "Quét Hóa Đơn AI",
    desc: "Bóc tách hóa đơn ăn uống, siêu thị bằng AI thông minh",
    href: "#ai-scanner",
    color: "bg-blue-50 text-blue-600",
    badge: "AI Siêu Tốc",
  },
  {
    icon: Users2,
    title: "Chia Tiền Nhóm VietQR",
    desc: "Tự động tính ai nợ ai & tạo mã QR thanh toán 1 chạm",
    href: "#app-simulator",
    color: "bg-emerald-50 text-emerald-600",
    badge: "Hot",
  },
  {
    icon: HandCoins,
    title: "Sổ Nợ & Tính Lãi Vay",
    desc: "Quản lý nợ mượn, tính lãi theo ngày/tháng & nhắc nợ",
    href: "#app-simulator",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Building2,
    title: "Đồng Bộ Ngân Hàng",
    desc: "Tự động nhận biến động số dư SePay & quét email giao dịch",
    href: "#app-simulator",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Tài Sản & Vàng SJC",
    desc: "Định giá danh mục vàng, đầu tư & chứng khoán real-time",
    href: "#rates",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: ShieldCheck,
    title: "Bảo Mật Chuẩn Ngân Hàng",
    desc: "Mã hóa AES-256, TLS 1.3 và cam kết bảo vệ dữ liệu",
    href: "#security",
    color: "bg-sky-50 text-sky-600",
  },
];

const SOLUTION_ITEMS = [
  {
    icon: User,
    title: "Cá Nhân & Gia Đình",
    desc: "Sổ thu chi hằng ngày, ngân sách 50/30/20 và quỹ chung gia đình",
    href: "#solutions",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Briefcase,
    title: "Chủ Shop & Freelancer",
    desc: "Tách bạch tiền túi và tiền hàng, quản lý công nợ khách hàng",
    href: "#solutions",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: TrendingUp,
    title: "Nhà Đầu Tư Tích Lũy",
    desc: "Theo dõi tài sản ròng (Net Worth), lãi kép và dòng tiền tự do",
    href: "#solutions",
    color: "bg-emerald-50 text-emerald-600",
  },
];

const TOOL_ITEMS = [
  {
    icon: PiggyBank,
    title: "Tính Lãi Tiết Kiệm & Lãi Kép",
    desc: "Dự phóng số tiền tích lũy theo thời gian và lãi suất",
    href: "#calculators",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Calculator,
    title: "Bảng Tính Trả Nợ Vay",
    desc: "Tính lịch trả gốc lãi theo dư nợ giảm dần hoặc cố định",
    href: "#calculators",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Activity,
    title: "Chấm Điểm Sức Khỏe Tài Chính",
    desc: "Làm bài test 2 phút nhận gợi ý phân bổ dòng tiền",
    href: "#health-check",
    color: "bg-emerald-50 text-emerald-600",
    badge: "Trắc nghiệm",
  },
  {
    icon: Coins,
    title: "Tra Cứu Tỷ Giá & Vàng SJC",
    desc: "Cập nhật biến động giá vàng, USD, EUR hằng ngày",
    href: "#rates",
    color: "bg-amber-50 text-amber-600",
  },
];

const RESOURCE_ITEMS = [
  {
    icon: Scale,
    title: "So Sánh Tính Năng",
    desc: "Tại sao ứng dụng vượt trội sổ tay, Excel và các app cũ?",
    href: "#comparison",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: BookOpen,
    title: "Cẩm Nang Quản Trị 2026",
    desc: "Tải miễn phí Ebook 45 trang & nhận 30 ngày Premium",
    href: "#ebook",
    color: "bg-indigo-50 text-indigo-600",
    badge: "Ebook Free",
  },
  {
    icon: HelpCircle,
    title: "Câu Hỏi Thường Gặp (FAQ)",
    desc: "Giải đáp thắc mắc về an toàn dữ liệu, tính phí và hỗ trợ",
    href: "#faq",
    color: "bg-slate-100 text-slate-700",
  },
];

export default function Header({ onOpenEbook }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, strings } = useLanguage();
  const nav = strings?.nav || {};
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const navRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const handleMouseEnter = (name) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  return (
    <>
      {/* Top Notification Announcement Line */}
      <TopAnnouncementBar onOpenQr={() => setQrModalOpen(true)} />

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-slate-200/90 bg-white/95 shadow-md backdrop-blur-xl"
            : "border-b border-slate-200/60 bg-white/90 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-20 lg:h-[84px] max-w-[1420px] items-center justify-between px-4 sm:px-8 lg:px-10">
          
          {/* ============================================================== */}
          {/* LEFT: PROMINENT BRAND LOGO                                     */}
          {/* ============================================================== */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#home" className="group flex items-center shrink-0 gap-2.5" aria-label="Trợ Lý Tài Chính - Trang chủ">
              <img
                src={images.logo}
                alt="Trợ Lý Tài Chính"
                className="h-12 sm:h-13 lg:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="hidden sm:flex flex-col border-l border-slate-300/80 pl-2.5 leading-tight">
                <span className="text-[11px] font-black tracking-wider uppercase text-slate-900">
                  TRỢ LÝ TÀI CHÍNH
                </span>
                <span className="text-[9.5px] font-bold text-blue-600">
                  Định Chế Tài Chính Số
                </span>
              </div>
            </a>
          </div>

          {/* ============================================================== */}
          {/* CENTER: DESKTOP FLOATING PILL NAVIGATION (ZERO TEXT WRAPPING)  */}
          {/* ============================================================== */}
          <nav
            ref={navRef}
            className="hidden lg:flex items-center gap-1 rounded-full border border-slate-200/90 bg-slate-50/80 p-1.5 shadow-2xs backdrop-blur-md"
            onMouseLeave={handleMouseLeave}
            aria-label="Thanh điều hướng chính"
          >
            {/* Dropdown 1: Tính năng */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("features")}
            >
              <button
                type="button"
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-semibold whitespace-nowrap transition-all ${
                  activeDropdown === "features"
                    ? "bg-white text-blue-600 shadow-xs font-bold"
                    : "text-slate-700 hover:text-blue-600 hover:bg-white/60"
                }`}
                aria-expanded={activeDropdown === "features"}
              >
                <span className="whitespace-nowrap">{nav.features || "Tính năng"}</span>
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${activeDropdown === "features" ? "rotate-180 text-blue-600" : "text-slate-400"}`} />
              </button>

              {/* Dropdown Card */}
              <AnimatePresence>
                {activeDropdown === "features" && (
                  <Motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute left-0 top-full mt-2.5 w-[640px] rounded-3xl border border-slate-200/90 bg-white p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl z-50"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {FEATURE_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.title}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-start gap-3.5 rounded-2xl p-3 transition-colors hover:bg-slate-50"
                          >
                            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.color} shadow-xs transition-transform group-hover:scale-110`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-700">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                {item.desc}
                              </p>
                            </div>
                          </a>
                        );
                      })}
                    </div>

                    {/* Dropdown Footer CTA */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/70 -mx-5 -mb-5 px-5 py-3 rounded-b-3xl">
                      <span className="text-slate-600 font-medium">
                        Trải nghiệm trực tiếp trên điện thoại của bạn
                      </span>
                      <a
                        href="#app-simulator"
                        onClick={() => setActiveDropdown(null)}
                        className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                      >
                        Mở màn hình mô phỏng <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dropdown 2: Giải pháp */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("solutions")}
            >
              <button
                type="button"
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-semibold whitespace-nowrap transition-all ${
                  activeDropdown === "solutions"
                    ? "bg-white text-blue-600 shadow-xs font-bold"
                    : "text-slate-700 hover:text-blue-600 hover:bg-white/60"
                }`}
                aria-expanded={activeDropdown === "solutions"}
              >
                <span className="whitespace-nowrap">{nav.solutions || "Giải pháp"}</span>
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${activeDropdown === "solutions" ? "rotate-180 text-blue-600" : "text-slate-400"}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === "solutions" && (
                  <Motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute left-0 top-full mt-2.5 w-[420px] rounded-3xl border border-slate-200/90 bg-white p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl z-50"
                  >
                    <div className="space-y-2">
                      {SOLUTION_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.title}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-start gap-3.5 rounded-2xl p-3 transition-colors hover:bg-slate-50"
                          >
                            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.color} shadow-xs transition-transform group-hover:scale-110`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <span className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                                {item.title}
                              </span>
                              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                {item.desc}
                              </p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dropdown 3: Công cụ tài chính */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("tools")}
            >
              <button
                type="button"
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-semibold whitespace-nowrap transition-all ${
                  activeDropdown === "tools"
                    ? "bg-white text-blue-600 shadow-xs font-bold"
                    : "text-slate-700 hover:text-blue-600 hover:bg-white/60"
                }`}
                aria-expanded={activeDropdown === "tools"}
              >
                <span className="whitespace-nowrap">{nav.tools || "Công cụ tính"}</span>
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${activeDropdown === "tools" ? "rotate-180 text-blue-600" : "text-slate-400"}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === "tools" && (
                  <Motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute left-0 top-full mt-2.5 w-[520px] rounded-3xl border border-slate-200/90 bg-white p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl z-50"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {TOOL_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.title}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-slate-50"
                          >
                            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.color} shadow-xs`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 truncate">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-extrabold text-emerald-800">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                                {item.desc}
                              </p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Direct Link: So sánh */}
            <a
              href="#comparison"
              className="rounded-full px-3.5 py-1.5 text-[13.5px] font-semibold text-slate-700 hover:text-blue-600 hover:bg-white/60 transition whitespace-nowrap"
            >
              {nav.comparison || "So sánh"}
            </a>

            {/* Direct Link: Cam kết 0đ */}
            <a
              href="#free-commitment"
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-semibold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/60 transition whitespace-nowrap"
            >
              <span>{nav.commitment || "Cam kết 0đ"}</span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.2">Free</span>
            </a>

            {/* Dropdown 4: Tài nguyên */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("resources")}
            >
              <button
                type="button"
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-semibold whitespace-nowrap transition-all ${
                  activeDropdown === "resources"
                    ? "bg-white text-blue-600 shadow-xs font-bold"
                    : "text-slate-700 hover:text-blue-600 hover:bg-white/60"
                }`}
                aria-expanded={activeDropdown === "resources"}
              >
                <span className="whitespace-nowrap">{nav.resources || "Tài nguyên"}</span>
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${activeDropdown === "resources" ? "rotate-180 text-blue-600" : "text-slate-400"}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === "resources" && (
                  <Motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2.5 w-[400px] rounded-3xl border border-slate-200/90 bg-white p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl z-50"
                  >
                    <div className="space-y-2">
                      {RESOURCE_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.title}
                            href={item.href}
                            onClick={(e) => {
                              setActiveDropdown(null);
                              if (item.href === "#ebook" && onOpenEbook) {
                                e.preventDefault();
                                onOpenEbook();
                              }
                            }}
                            className="group flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-slate-50 cursor-pointer"
                          >
                            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.color} shadow-xs`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="rounded-full bg-indigo-100 px-1.5 py-0.2 text-[9px] font-extrabold text-indigo-800">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* ============================================================== */}
          {/* RIGHT: ACTIONS & CALL-TO-ACTIONS                               */}
          {/* ============================================================== */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">

            {/* Language Switcher VN | EN */}
            <LanguageSwitcher variant="header" />

            {/* QR Download Trigger */}
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50/50 hover:border-blue-300 hover:text-blue-600 shadow-2xs transition whitespace-nowrap cursor-pointer"
              title="Quét mã QR tải app bằng camera điện thoại"
            >
              <QrCode className="h-3.5 w-3.5 text-blue-600" />
              <span>{nav.appQr || "Mã QR App"}</span>
            </button>

            {/* Primary Action Button - eKYC Account */}
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 px-4.5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-blue-500/25 transition hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
              <span>{nav.openEkyc || "Mở Tài Khoản eKYC"}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-xs lg:hidden transition hover:bg-slate-50"
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* ============================================================== */}
        {/* MOBILE FULL-SCREEN BANKING MENU DRAWER                         */}
        {/* ============================================================== */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <Motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden border-t border-slate-200 bg-white shadow-2xl lg:hidden max-h-[88vh] overflow-y-auto"
            >
              {/* Institutional Welcome Card */}
              <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white font-black text-sm shadow-md shadow-blue-500/30">
                      T
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-sky-400">Trợ Lý Tài Chính</p>
                      <p className="text-sm font-extrabold text-white">Định Chế Tài Chính Số</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-bold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>NAPAS 24/7</span>
                  </div>
                </div>

                {/* 4 Quick Banking Action Tiles */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setQrModalOpen(true);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white shadow-xs text-left"
                  >
                    <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
                    <div>
                      <span className="block font-black text-[11px] leading-tight">Mở eKYC 0đ</span>
                      <span className="text-[9.5px] text-blue-200">Cấp số đẹp tức thì</span>
                    </div>
                  </button>

                  <a
                    href="#cards"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 font-bold text-slate-200 hover:text-white text-left"
                  >
                    <CreditCard className="h-4 w-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="block font-black text-[11px] leading-tight">Thẻ VIP & Virtual</span>
                      <span className="text-[9.5px] text-slate-400">Đặc quyền Priority</span>
                    </div>
                  </a>

                  <a
                    href="tel:19006868"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 font-bold text-slate-200 hover:text-white text-left"
                  >
                    <PhoneCall className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="block font-black text-[11px] leading-tight">Hotline 24/7</span>
                      <span className="text-[9.5px] text-slate-400">1900 6868 (Free)</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="p-4 pb-1">
                <LanguageSwitcher variant="mobile" />
              </div>

              {/* Accordion Categories */}
              <div className="p-5 space-y-3">
                {/* Accordion 1: Dịch vụ ngân hàng số */}
                <div className="border-b border-slate-100 pb-3">
                  <button
                    type="button"
                    onClick={() => setMobileSection(mobileSection === "features" ? null : "features")}
                    className="flex w-full items-center justify-between py-2 text-sm font-black text-slate-900"
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-blue-600" />
                      <span>Dịch Vụ Ngân Hàng Số</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform text-slate-400 ${mobileSection === "features" ? "rotate-180 text-blue-600" : ""}`} />
                  </button>
                  {mobileSection === "features" && (
                    <div className="grid gap-2 pt-2 pl-2">
                      {FEATURE_ITEMS.map((item) => (
                        <a
                          key={item.title}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`grid h-7 w-7 place-items-center rounded-lg ${item.color}`}>
                              <item.icon className="h-3.5 w-3.5" />
                            </span>
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">{item.title}</span>
                              <span className="text-[10px] text-slate-500 line-clamp-1">{item.desc}</span>
                            </div>
                          </div>
                          {item.badge && (
                            <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[9px] font-extrabold text-blue-800">
                              {item.badge}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Accordion 2: Công cụ tài chính */}
                <div className="border-b border-slate-100 pb-3">
                  <button
                    type="button"
                    onClick={() => setMobileSection(mobileSection === "tools" ? null : "tools")}
                    className="flex w-full items-center justify-between py-2 text-sm font-black text-slate-900"
                  >
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-amber-600" />
                      <span>Công Cụ Tài Chính Trực Tuyến</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform text-slate-400 ${mobileSection === "tools" ? "rotate-180 text-blue-600" : ""}`} />
                  </button>
                  {mobileSection === "tools" && (
                    <div className="grid gap-2 pt-2 pl-2">
                      {TOOL_ITEMS.map((item) => (
                        <a
                          key={item.title}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`grid h-7 w-7 place-items-center rounded-lg ${item.color}`}>
                              <item.icon className="h-3.5 w-3.5" />
                            </span>
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">{item.title}</span>
                              <span className="text-[10px] text-slate-500 line-clamp-1">{item.desc}</span>
                            </div>
                          </div>
                          {item.badge && (
                            <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[9px] font-extrabold text-amber-800">
                              {item.badge}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Accordion 3: Giải pháp đối tượng */}
                <div className="border-b border-slate-100 pb-3">
                  <button
                    type="button"
                    onClick={() => setMobileSection(mobileSection === "solutions" ? null : "solutions")}
                    className="flex w-full items-center justify-between py-2 text-sm font-black text-slate-900"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-emerald-600" />
                      <span>Giải Pháp Theo Nhu Cầu</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform text-slate-400 ${mobileSection === "solutions" ? "rotate-180 text-blue-600" : ""}`} />
                  </button>
                  {mobileSection === "solutions" && (
                    <div className="grid gap-2 pt-2 pl-2">
                      {SOLUTION_ITEMS.map((item) => (
                        <a
                          key={item.title}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition"
                        >
                          <span className={`grid h-7 w-7 place-items-center rounded-lg ${item.color}`}>
                            <item.icon className="h-3.5 w-3.5" />
                          </span>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{item.title}</span>
                            <span className="text-[10px] text-slate-500 line-clamp-1">{item.desc}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct Links */}
                <div className="flex flex-col gap-2 pt-1 text-xs font-bold text-slate-800">
                  <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="py-1.5 flex items-center justify-between">
                    <span>So sánh với Ngân hàng & Sổ thu chi truyền thống</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </a>
                  <a href="#cards" onClick={() => setMobileMenuOpen(false)} className="py-1.5 flex items-center justify-between">
                    <span>Hệ sinh thái Thẻ Titanium VIP</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </a>
                  <a href="#free-commitment" onClick={() => setMobileMenuOpen(false)} className="py-1.5 flex items-center justify-between text-emerald-700">
                    <span className="font-extrabold">Cam kết 100% Miễn Phí (0đ)</span>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5">0đ Phí</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenEbook) onOpenEbook();
                    }}
                    className="w-full py-1.5 flex items-center justify-between text-blue-600 font-bold text-xs cursor-pointer text-left"
                  >
                    <span>Tải Miễn Phí Ebook Tài Chính 2026</span>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black">Free Ebook</span>
                  </button>
                </div>

                {/* Security and Trust Guarantee Footer */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      PCI-DSS Level 1
                    </span>
                    <span>•</span>
                    <span>ISO 27001:2022</span>
                    <span>•</span>
                    <span>NĐ 13/2023/NĐ-CP</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setQrModalOpen(true);
                      }}
                      className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                    >
                      {nav.downloadApp || "Tải App Miễn Phí"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setQrModalOpen(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-extrabold text-xs text-center shadow-md shadow-blue-500/20 cursor-pointer"
                    >
                      {nav.openEkyc || "Mở eKYC 0đ Phí"}
                    </button>
                  </div>
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* QR Code Download Modal */}
      <QrDownloadModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
    </>
  );
}
