import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import images from "../../assets/image.js";
import QrDownloadModal from "../home/QrDownloadModal.jsx";

const Motion = motion;

const links = [
  { label: "Trang chủ", href: "#home" },
  { label: "Tính năng", href: "#features" },
  { label: "Giải pháp", href: "#solutions" },
  { label: "AI Scanner", href: "#ai-scanner" },
  { label: "Tính lãi suất", href: "#calculators" },
  { label: "Tỷ giá", href: "#rates" },
  { label: "Chấm điểm tài chính", href: "#health-check" },
  { label: "Bảo mật", href: "#security" },
  { label: "Đánh giá", href: "#reviews" },
  { label: "Bảng giá", href: "#pricing" },
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
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl"
            : "border-b border-slate-100 bg-white/90 backdrop-blur-md shadow-[0_2px_15px_rgba(0,0,0,0.03)]"
        }`}
      >
        <div className="mx-auto flex h-20 sm:h-22 max-w-[1380px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#home" className="group relative z-10 flex items-center gap-2.5" aria-label="Halo Finance - Trang chủ">
            <img
              src={images.logo}
              alt="Halo Finance - Sổ Thu Chi"
              className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </a>

          <nav
            className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/80 p-1.5 shadow-sm backdrop-blur-md xl:flex"
            aria-label="Điều hướng chính"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-white hover:text-blue-600 hover:shadow-xs"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 lg:flex">
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-blue-300 transition shadow-xs"
              title="Quét mã QR tải app bằng điện thoại"
            >
              <QrCode className="h-4 w-4 text-blue-600" />
              Mã QR
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
              className="group inline-flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-blue-500/20 transition hover:-translate-y-0.5"
            >
              Internet Banking
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

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

      <AnimatePresence>
        {menuOpen && (
          <Motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="mx-4 overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl lg:hidden"
          >
            <nav className="grid" aria-label="Điều hướng di động">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <a
                href="/app"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 font-extrabold text-xs text-white"
              >
                Internet Banking <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="#download"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-2xl bg-slate-950 px-4 py-3 font-bold text-xs text-white"
              >
                Tải ứng dụng
              </a>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </header>

    <QrDownloadModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
    </>
  );
}

export default Header;
