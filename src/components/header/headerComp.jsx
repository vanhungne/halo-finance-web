import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X, QrCode, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import images from "../../assets/image.js";
import QrDownloadModal from "../home/QrDownloadModal.jsx";
import TopAnnouncementBar from "../home/TopAnnouncementBar.jsx";

const Motion = motion;

const links = [
  { label: "Trang chủ", href: "#home" },
  { label: "Mô phỏng App", href: "#app-simulator" },
  { label: "Tính năng", href: "#features" },
  { label: "AI Scanner", href: "#ai-scanner" },
  { label: "So sánh", href: "#comparison" },
  { label: "Tính lãi suất", href: "#calculators" },
  { label: "Tỷ giá", href: "#rates" },
  { label: "Bảng giá", href: "#pricing" },
  { label: "Ebook", href: "#ebook" },
  { label: "Hỏi đáp", href: "#faq" },
];

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const openLogin = () => navigate("/login");

  return (
    <>
      {/* Top Marketing Announcement Banner */}
      <TopAnnouncementBar onOpenQr={() => setQrModalOpen(true)} />

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "border-b border-slate-200/90 bg-white/95 shadow-md shadow-slate-200/50 backdrop-blur-xl"
            : "border-b border-slate-100 bg-white/90 backdrop-blur-md shadow-xs"
        }`}
      >
        <div className="mx-auto flex h-18 sm:h-20 max-w-[1380px] items-center justify-between px-4 sm:px-8 lg:px-12">
          {/* Logo Brand */}
          <a href="#home" className="group relative z-10 flex items-center gap-2.5" aria-label="Halo Finance - Trang chủ">
            <img
              src={images.logo}
              alt="Halo Finance - Sổ Thu Chi & Trợ Lý Tài Chính"
              className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </a>

          {/* Center Navigation Menu (Desktop) */}
          <nav
            className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/90 p-1 shadow-xs backdrop-blur-md xl:flex"
            aria-label="Điều hướng chính"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-white hover:text-blue-600 hover:shadow-xs"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Suite */}
          <div className="hidden items-center gap-2.5 lg:flex">
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-600 transition shadow-xs"
              title="Quét mã QR tải app bằng điện thoại"
            >
              <QrCode className="h-4 w-4 text-blue-600" />
              <span>Mã QR</span>
            </button>
            <button
              type="button"
              onClick={openLogin}
              className="rounded-full px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:text-blue-600"
            >
              Đăng nhập
            </button>
            <a
              href="/app"
              className="group inline-flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-blue-500/25 transition hover:-translate-y-0.5"
            >
              <span>Internet Banking</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="relative z-10 grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xs xl:hidden transition hover:bg-slate-50"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <Motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
              className="mx-4 mb-4 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl xl:hidden"
            >
              <div className="grid grid-cols-2 gap-1.5 py-2">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setQrModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-xs font-bold text-blue-700"
                >
                  <QrCode className="h-4 w-4" />
                  <span>Quét mã QR tải app điện thoại</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      openLogin();
                    }}
                    className="w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 text-center"
                  >
                    Đăng nhập
                  </button>
                  <a
                    href="/app"
                    onClick={() => setMenuOpen(false)}
                    className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white text-center shadow-md shadow-blue-500/20"
                  >
                    Cổng Khách Hàng
                  </a>
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

export default Header;
