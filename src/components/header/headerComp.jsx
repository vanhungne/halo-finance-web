import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ArrowRight, Menu, Users2, User, Briefcase, HelpCircle, Scale } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import images from "../../assets/image.js";
import QrDownloadModal from "../home/QrDownloadModal.jsx";
import TopAnnouncementBar from "../home/TopAnnouncementBar.jsx";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import LanguageSwitcher from "../common/LanguageSwitcher.jsx";
import MobileNavigation from "./MobileNavigation.jsx";
import ToolsMenuGroups from './ToolsMenuGroups.jsx';

const Motion = motion;

// Framer Motion variants referenced directly from Dean Studio design system
const panelVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
      staggerChildren: 0.03,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.985,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

const columnVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.01 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

// Mega Menu Definitions - FinTech Architecture
const SOLUTION_ITEMS = [
  { segment: "personal", icon: User, title: "Cá nhân", titleEn: "Personal", descEn: "Track income, spending, budgets and savings goals.", desc: "Ghi thu chi, theo dõi ví, ngân sách và mục tiêu tiết kiệm", href: "#solutions", color: "bg-blue-50 text-blue-600" },
  { segment: "group", icon: Users2, title: "Nhóm", titleEn: "Groups", descEn: "Record shared expenses, split costs and follow repayments.", desc: "Ghi khoản chung, chia tiền và theo dõi hoàn trả", href: "#solutions", color: "bg-emerald-50 text-emerald-600" },
  { segment: "business", icon: Briefcase, title: "Kinh doanh", titleEn: "Business", descEn: "Manage companies, projects, income, expenses and reports.", desc: "Quản lý công ty, dự án, thu chi và báo cáo", href: "#solutions", color: "bg-indigo-50 text-indigo-600" },
];

const RESOURCE_ITEMS = [
  {
    icon: Scale,
    title: "So Sánh Tính Năng", titleEn: "Feature comparison", descEn: "Compare ways to record and manage your finances.",
    desc: "Tại sao ứng dụng vượt trội sổ tay, Excel và các app cũ?",
    href: "#comparison",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: HelpCircle,
    title: "Câu Hỏi Thường Gặp (FAQ)", titleEn: "Frequently asked questions", descEn: "Find answers about the app and your data.",
    desc: "Giải đáp thắc mắc về an toàn dữ liệu, tính phí và hỗ trợ",
    href: "#faq",
    color: "bg-slate-100 text-slate-700",
  },
];

export default function Header({ onOpenQr, onSelectSolution, hideAnnouncement = false }) {
  const location = useLocation();
  const toAnchor = (href) => href.startsWith('#') && location.pathname !== '/' ? '/' + href : href;
  const { strings, isEnglish } = useLanguage();
  const reduceMotion = useReducedMotion();
  const nav = strings?.nav || {};

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [anchorX, setAnchorX] = useState(null);
  const [menuTop, setMenuTop] = useState(68);
  const [leftEdge, setLeftEdge] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const [scrolled, setScrolled] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const handleOpenQr = () => {
    setActiveDropdown(null);
    clearCloseTimer();
    if (onOpenQr) {
      onOpenQr();
    } else {
      setQrModalOpen(true);
    }
  };

  const closeTimer = useRef(null);
  const triggerRefs = useRef({});
  const panelRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    if (activeDropdown !== 'tools') return;
    const closeOutside = event => {
      if (!panelRef.current?.contains(event.target) && !triggerRefs.current.tools?.contains(event.target)) setActiveDropdown(null);
    };
    const closeEscape = event => {
      if (event.key === 'Escape') { setActiveDropdown(null); triggerRefs.current.tools?.focus(); }
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeEscape);
    return () => { document.removeEventListener('pointerdown', closeOutside); document.removeEventListener('keydown', closeEscape); };
  }, [activeDropdown]);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openMenu = useCallback(
    (name) => {
      clearCloseTimer();
      setActiveDropdown(name);
    },
    [clearCloseTimer]
  );

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 140);
  }, [clearCloseTimer]);

  // Dean Studio dynamic alignment: Compute center anchorX of the active nav trigger
  useLayoutEffect(() => {
    if (!activeDropdown) {
      setAnchorX(null);
      setLeftEdge(null);
      return;
    }
    const measure = () => {
      if (window.innerWidth < 1280) { setActiveDropdown(null); return; }
      const el = triggerRefs.current[activeDropdown];
      if (el) {
        const r = el.getBoundingClientRect();
        setAnchorX(r.left + r.width / 2);
        setMenuTop(headerRef.current?.getBoundingClientRect().bottom ?? 68);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, [activeDropdown]);

  // Dean Studio viewport clamping: Ensure dropdown panel never overflows screen edges
  useLayoutEffect(() => {
    if (anchorX == null || !panelRef.current) return;
    const margin = 16;
    const w = panelRef.current.offsetWidth;
    const vw = window.innerWidth;
    let left = anchorX - w / 2;
    const maxLeft = vw - margin - w;
    if (left > maxLeft) left = maxLeft;
    if (left < margin) left = margin;
    setLeftEdge(left);
  }, [anchorX, activeDropdown]);

  return (
    <>
      {/* Top 100% Free Announcement Marquee in #E96C42 */}
      {!hideAnnouncement && <TopAnnouncementBar />}

      {/* Main Dean Studio Style Sticky Header */}
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
            ? "border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur-2xl"
            : "border-b border-slate-200/60 bg-white/80 backdrop-blur-xl"
          }`}
      >
        <div className="mx-auto flex h-16 lg:h-[68px] w-full max-w-screen-2xl items-center justify-between px-4 sm:px-8 lg:px-12">
          {/* ============================================================== */}
          {/* LEFT: BRAND IDENTITY (DEAN STUDIO REFINED STYLE)               */}
          {/* ============================================================== */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/"
              onClick={() => {
                if (location.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="group flex items-center shrink-0 gap-3"
              aria-label="Trợ Lý Tài Chính - Trang chủ"
            >
              <img
                src={images.logo}
                width={2084} height={440}
                alt="Trợ Lý Tài Chính"
                className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <div className="hidden sm:flex flex-col border-l border-slate-200/90 pl-3 leading-tight">
                <span className="text-[12px] font-black tracking-tight text-slate-900 uppercase">
                  TRỢ LÝ TÀI CHÍNH
                </span>
                <span className="text-[9px] font-bold text-blue-600 tracking-wider uppercase">
                  Sổ Thu Chi & Hóa Đơn AI
                </span>
              </div>
            </Link>
          </div>

          {/* ============================================================== */}
          {/* CENTER: DEAN STUDIO STYLE DESKTOP NAVIGATION                   */}
          {/* ============================================================== */}
          <nav
            className="hidden xl:flex items-center gap-1"
            onMouseLeave={scheduleClose}
            aria-label="Thanh điều hướng chính"
          >
            {/* Tính năng links directly to the complete feature directory. */}
            <a
              href={toAnchor('#features')}
              onMouseEnter={() => setActiveDropdown(null)}
              onFocus={() => setActiveDropdown(null)}
              onClick={() => setActiveDropdown(null)}
              className="group/nav relative px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-150"
            >
              <span className="relative">
                {nav.features || "Tính năng"}
                <span className="pointer-events-none absolute -bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-200 group-hover/nav:w-full" />
              </span>
            </a>

            {/* 2. Giải pháp (Solutions) */}
            <button
              ref={(el) => {
                triggerRefs.current["solutions"] = el;
              }}
              type="button"
              onMouseEnter={() => openMenu("solutions")}
              onFocus={() => openMenu("solutions")}
              onClick={() =>
                setActiveDropdown((k) =>
                  k === "solutions" ? null : "solutions"
                )
              }
              aria-haspopup="true"
              aria-expanded={activeDropdown === "solutions"}
              className={`group/nav relative flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer ${activeDropdown === "solutions"
                  ? "text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900"
                }`}
            >
              <span className="relative">
                {nav.solutions || "Giải pháp"}
                <span
                  className={`pointer-events-none absolute -bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-200 ${activeDropdown === "solutions"
                      ? "w-full"
                      : "w-0 group-hover/nav:w-full"
                    }`}
                />
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "solutions"
                    ? "rotate-180 text-blue-600"
                    : "text-slate-400"
                  }`}
              />
            </button>

            {/* 3. Công cụ tính (Tools) */}
            <button
              ref={(el) => {
                triggerRefs.current["tools"] = el;
              }}
              type="button"
              onMouseEnter={() => openMenu("tools")}
              onClick={() => setActiveDropdown('tools')}
              onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); setActiveDropdown('tools'); requestAnimationFrame(() => panelRef.current?.querySelector('a')?.focus()); } }}
              aria-controls="financial-tools-menu"
              aria-haspopup="true"
              aria-expanded={activeDropdown === "tools"}
              className={`group/nav relative flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer ${activeDropdown === "tools"
                  ? "text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900"
                }`}
            >
              <span className="relative">
                {nav.tools || "Công cụ tính"}
                <span
                  className={`pointer-events-none absolute -bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-200 ${activeDropdown === "tools"
                      ? "w-full"
                      : "w-0 group-hover/nav:w-full"
                    }`}
                />
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "tools"
                    ? "rotate-180 text-blue-600"
                    : "text-slate-400"
                  }`}
              />
            </button>

            {/* 3b. Link trực tiếp: Chia tiền nhóm */}
            <Link
              to="/split-bills"
              onMouseEnter={scheduleClose}
              className="group/nav relative px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-150"
            >
              <span className="relative">
                {isEnglish ? "Split Bills" : "Chia tiền nhóm"}
                <span className="pointer-events-none absolute -bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-200 group-hover/nav:w-full" />
              </span>
            </Link>

            {/* 4. Link trực tiếp: So sánh */}
            <a
              href={toAnchor("#comparison")}
              onMouseEnter={scheduleClose}
              className="group/nav relative px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-150"
            >
              <span className="relative">
                {nav.comparison || "So sánh"}
                <span className="pointer-events-none absolute -bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-200 group-hover/nav:w-full" />
              </span>
            </a>

            {/* 5. Link trực tiếp: Miễn Phí (Dấu chấm xanh & gạch chân xanh) */}
            <a
              href={toAnchor("#free-commitment")}
              onMouseEnter={scheduleClose}
              className="group/nav relative inline-flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors duration-150"
            >
              <span className="relative flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{isEnglish ? "Free" : "Miễn Phí"}</span>
                <span className="pointer-events-none absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-emerald-500 group-hover/nav:bg-emerald-600 transition-colors duration-150" />
              </span>
            </a>

            {/* 6. Tài nguyên (Resources) */}
            <button
              ref={(el) => {
                triggerRefs.current["resources"] = el;
              }}
              type="button"
              onMouseEnter={() => openMenu("resources")}
              onFocus={() => openMenu("resources")}
              onClick={() =>
                setActiveDropdown((k) =>
                  k === "resources" ? null : "resources"
                )
              }
              aria-haspopup="true"
              aria-expanded={activeDropdown === "resources"}
              className={`group/nav relative flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer ${activeDropdown === "resources"
                  ? "text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900"
                }`}
            >
              <span className="relative">
                {nav.resources || "Tài nguyên"}
                <span
                  className={`pointer-events-none absolute -bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-200 ${activeDropdown === "resources"
                      ? "w-full"
                      : "w-0 group-hover/nav:w-full"
                    }`}
                />
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "resources"
                    ? "rotate-180 text-blue-600"
                    : "text-slate-400"
                  }`}
              />
            </button>
          </nav>

          {/* ============================================================== */}
          {/* RIGHT: ACTIONS & CALL-TO-ACTIONS (DEAN STUDIO REFINED)          */}
          {/* ============================================================== */}
          <div className="hidden xl:flex items-center gap-2.5 shrink-0">
            {/* Borderless Globe Language Switcher with Dropdown */}
            <LanguageSwitcher variant="header" />

            {/* Single Action Button: "Tải ứng dụng" with Dean Studio loading-gradient and animation */}
            <button
              type="button"
              onClick={handleOpenQr}
              className="loading-gradient inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm border-0 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{nav.downloadApp || "Tải ứng dụng"}</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => { setActiveDropdown(null); setMobileMenuOpen(true); }}
            className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-800 xl:hidden transition hover:bg-slate-200"
            aria-label={isEnglish ? "Open menu" : "Mở menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="landing-mobile-navigation"
            aria-haspopup="dialog"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* ============================================================== */}
        {/* DEAN STUDIO STYLE DYNAMICALLY CENTERED & CLAMPED MEGA MENU     */}
        {/* ============================================================== */}
        <AnimatePresence>
          {activeDropdown && anchorX != null && (
            <div
              ref={panelRef}
              className="absolute top-full z-50 pointer-events-auto"
              style={
                activeDropdown === 'tools'
                  ? { left: '50%', transform: 'translateX(-50%)', "--menu-top": `${menuTop}px` }
                  : leftEdge != null
                  ? { left: leftEdge, "--menu-top": `${menuTop}px` }
                  : { left: anchorX, transform: "translateX(-50%)", "--menu-top": `${menuTop}px` }
              }
              onMouseEnter={clearCloseTimer}
              onMouseLeave={scheduleClose}
            >
              {/* Invisible hover bridge to prevent cursor gap drop */}
              <div
                className="absolute -top-3 inset-x-0 h-4"
                aria-hidden="true"
              />

              {/* 2. Solutions MegaMenu Panel */}
              {activeDropdown === "solutions" && (
                <Motion.div
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-[440px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200/90 bg-white/98 p-5 shadow-[0_24px_70px_-20px_rgba(15,23,42,0.18)] backdrop-blur-2xl"
                >
                  <div className="pb-3 border-b border-slate-100 mb-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Giải Pháp Cho Mọi Đối Tượng
                    </span>
                  </div>

                  <Motion.div variants={columnVariants} className="space-y-1.5">
                    {SOLUTION_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Motion.div key={item.title} variants={itemVariants}>
                          <a
                            href={toAnchor(item.href)}
                            onClick={() => { onSelectSolution?.(item.segment); setActiveDropdown(null); }}
                            className="group/mi flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50"
                          >
                            <div
                              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.color} shadow-2xs transition-transform group-hover/mi:scale-105`}
                            >
                              <Icon className="h-4.5 w-4.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="relative w-fit">
                                  <span className="font-bold text-xs text-slate-900 group-hover/mi:text-blue-600 transition-colors">
                                    {item.title}
                                  </span>
                                  <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-0 bg-blue-600 transition-all duration-200 group-hover/mi:w-full" />
                                </span>
                                {item.badge && (
                                  <span className="rounded-full bg-indigo-100 px-1.5 py-0.2 text-[9px] font-extrabold text-indigo-700">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                {item.desc}
                              </p>
                            </div>
                          </a>
                        </Motion.div>
                      );
                    })}
                  </Motion.div>
                </Motion.div>
              )}

              {/* Tools are grouped by purpose, with shared desktop/mobile content. */}
              {activeDropdown === "tools" && (
                <Motion.div id="financial-tools-menu" variants={panelVariants} initial={reduceMotion ? false : "hidden"} animate="visible" exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : "exit"} className="financial-tools-menu">
                  <ToolsMenuGroups isEnglish={isEnglish} toHref={toAnchor} onSelect={() => setActiveDropdown(null)} idPrefix="desktop-tool-group" />
                </Motion.div>
              )}

              {/* 4. Resources MegaMenu Panel */}
              {activeDropdown === "resources" && (
                <Motion.div
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200/90 bg-white/98 p-5 shadow-[0_24px_70px_-20px_rgba(15,23,42,0.18)] backdrop-blur-2xl"
                >
                  <div className="pb-3 border-b border-slate-100 mb-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {isEnglish ? "Resources" : "Tài nguyên"}
                    </span>
                  </div>

                  <Motion.div variants={columnVariants} className="space-y-1.5">
                    {RESOURCE_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Motion.div key={item.title} variants={itemVariants}>
                          <a
                            key={item.title}
                            href={toAnchor(item.href)}
                            onClick={() => setActiveDropdown(null)}
                            className="group/mi flex items-start gap-2.5 rounded-xl p-2.5 transition-colors hover:bg-slate-50 cursor-pointer"
                          >
                            <div
                              className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${item.color} shadow-2xs`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="relative w-fit">
                                  <span className="font-bold text-xs text-slate-900 group-hover/mi:text-blue-600 transition-colors">
                                    {item.title}
                                  </span>
                                  <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-0 bg-blue-600 transition-all duration-200 group-hover/mi:w-full" />
                                </span>
                                {item.badge && (
                                  <span className="rounded-full bg-indigo-100 px-1.5 py-0.2 text-[9px] font-extrabold text-indigo-800">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                {item.desc}
                              </p>
                            </div>
                          </a>
                        </Motion.div>
                      );
                    })}
                  </Motion.div>
                </Motion.div>
              )}
            </div>
          )}
        </AnimatePresence>

        <MobileNavigation
          open={mobileMenuOpen}
          onClose={closeMobileMenu}
          logo={images.logo}
          pathname={location.pathname}
          groups={[
            { id: "features", label: nav.features || "Tính năng", href: "#features" },
            { id: "solutions", label: nav.solutions || "Giải pháp", items: SOLUTION_ITEMS },
            { id: "tools", label: nav.tools || "Công cụ", groupedTools: true },
            { id: "group-split", label: isEnglish ? "Split Bills" : "Chia tiền nhóm", href: "/split-bills" },
            { id: "resources", label: nav.resources || "Tài nguyên", items: RESOURCE_ITEMS },
          ]}
          onOpenQr={handleOpenQr}
          onSelectSolution={onSelectSolution}
        />

      </header>

      {/* QR Code Download Modal - fallback when not controlled by parent */}
      {!onOpenQr && (
        <QrDownloadModal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
        />
      )}
    </>
  );
}
