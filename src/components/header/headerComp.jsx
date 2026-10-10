import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import images from "../../assets/image.js";

const Motion = motion;

const links = [
  { label: "Trang chủ", href: "#home" },
  { label: "Tính năng", href: "#features" },
  { label: "Cách hoạt động", href: "#how-it-works" },
  { label: "Gói dịch vụ", href: "#pricing" },
  { label: "Hỏi đáp", href: "#faq" },
];

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const openLogin = () => navigate("/login");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-24 max-w-[1380px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#home" className="group relative z-10 flex items-center" aria-label="Trợ Lý Tài Chính - Trang chủ">
          <img
            src={images.logo}
            alt="Trợ Lý Tài Chính"
            className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:h-12"
          />
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-white/70 p-1.5 shadow-sm backdrop-blur-xl lg:flex" aria-label="Điều hướng chính">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-950 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={openLogin}
            className="rounded-full px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:text-slate-950"
          >
            Đăng nhập
          </button>
          <a
            href="#download"
            className="group inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(15,23,42,0.7)] transition hover:-translate-y-0.5 hover:bg-sky-500"
          >
            Tải ứng dụng
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-950 shadow-sm lg:hidden"
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
            <a
              href="#download"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 font-bold text-white"
            >
              Tải ứng dụng <ArrowUpRight className="h-4 w-4" />
            </a>
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
