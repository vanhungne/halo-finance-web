import {
  Facebook,
  Instagram,
  Mail,
  Youtube,
  ShieldCheck,
  PhoneCall,
  Building2,
  FileText,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import images from "../../assets/image.js";
import LanguageSwitcher from "../common/LanguageSwitcher.jsx";

const productLinks = [
  { label: "Bóc Tách Hóa Đơn AI (OCR 3 Giây)", href: "#features" },
  { label: "Chia Tiền Nhóm VietQR 1 Chạm", href: "#app-simulator" },
  { label: "Sổ Thu Chi & Ngân Sách 50/30/20", href: "#features" },
  { label: "Báo Cáo Dòng Tiền & Xuất File Excel", href: "#features" },
  { label: "Quản Lý Quỹ Chung & Hội Nhóm", href: "#features" },
  { label: "Cổng Web Portal Tiện Lợi Trên PC", href: "/login" },
];

const resourceLinks = [
  { label: "Ma Trận So Sánh Tính Năng", href: "#comparison" },
  { label: "Cam Kết 100% Miễn Phí (0đ Phí Ẩn)", href: "#free-commitment" },
  { label: "Trắc Nghiệm Sức Khỏe Tài Chính", href: "#health-check" },
  { label: "Tải Cẩm Nang Tài Chính Miễn Phí", href: "#ebook" },
  { label: "Mô Phỏng Trải Nghiệm App Mobile", href: "#app-simulator" },
];

const companyLinks = [
  { label: "Về Trợ Lý Tài Chính", href: "#home" },
  { label: "Cam Kết Quyền Riêng Tư & An Toàn", href: "#security" },
  { label: "Tuân Thủ Nghị Định 13/2023/NĐ-CP", href: "#security" },
  { label: "Đánh Giá Từ Cộng Đồng Người Dùng", href: "#reviews" },
  { label: "Câu Hỏi Thường Gặp (FAQ)", href: "#faq" },
  { label: "Chính Sách Bảo Mật", href: "/privacy" },
  { label: "Điều Khoản Sử Dụng", href: "/terms" },
];

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-24 sm:pb-16 border-t border-slate-800">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10">
        
        {/* Top Header: Hotline & Support Network */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-10 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <img src={images.logo} alt="Trợ Lý Tài Chính" className="h-10 w-auto brightness-0 invert" />
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="hidden sm:inline text-xs font-bold text-slate-300">
              Sổ Thu Chi Thông Minh & Bóc Tách Hóa Đơn AI
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/10 text-sky-400">
                <PhoneCall className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Tổng đài CSKH 24/7</span>
                <strong className="text-white text-sm font-black">1900 6868</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Mail className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Email tiếp nhận</span>
                <strong className="text-slate-200 text-xs font-semibold">contact@trolytaichinh.vn</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Bảo chứng an toàn</span>
                <strong className="text-amber-300 text-xs font-bold">Mã Hóa AES-256</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Links Grid */}
        <div className="grid gap-10 py-12 border-b border-slate-800/80 lg:grid-cols-12">
          
          {/* Brand Info & Mission Details */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-black uppercase text-white tracking-wider">
              Trợ Lý Tài Chính (TroLyTaiChinh)
            </h3>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Ứng dụng quản trị tài chính cá nhân và quỹ nhóm thông minh hàng đầu tại Việt Nam. Bóc tách hóa đơn bằng AI trong 3 giây, quản trị ngân sách 50/30/20, chia tiền nhóm VietQR 1 chạm và mã hóa an toàn dữ liệu chuẩn AES-256.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-1">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span><strong>Trụ sở chính:</strong> Tầng 48, Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Q. Bình Thạnh, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span><strong>Chi nhánh Hà Nội:</strong> Tầng 32, Keangnam Hanoi Landmark 72, Đường Phạm Hùng, Q. Nam Từ Liêm, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Giấy chứng nhận ĐKDN số: 0317892345 do Sở KH&ĐT cấp</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              {[
                { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
                { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
                { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:border-blue-500 hover:bg-blue-600 hover:text-white transition"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 1: Tính năng */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.16em] text-white">Tính Năng Cốt Lõi</h4>
            <ul className="space-y-2 text-xs font-medium">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition hover:underline underline-offset-4">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Tài nguyên */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.16em] text-white">Tài Nguyên</h4>
            <ul className="space-y-2 text-xs font-medium">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition hover:underline underline-offset-4">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Pháp lý & Hỗ trợ */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.16em] text-white">Pháp Lý & Hỗ Trợ</h4>
            <ul className="space-y-2 text-xs font-medium">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition hover:underline underline-offset-4">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <a
                href="#free-commitment"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-xs font-black text-white shadow-md shadow-emerald-500/20 transition cursor-pointer"
              >
                <span>Cam Kết 100% Miễn Phí</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="flex flex-col gap-4 pt-6 text-xs text-slate-500 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p>© {new Date().getFullYear()} Trợ Lý Tài Chính. Mọi quyền được bảo lưu.</p>
            <LanguageSwitcher variant="footer" />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400 text-[11px]">
            <a href="/privacy" className="hover:text-white transition">Chính sách bảo mật</a>
            <span>•</span>
            <a href="/terms" className="hover:text-white transition">Điều khoản sử dụng</a>
            <span>•</span>
            <a href="/delete-account" className="hover:text-white transition">Yêu cầu xóa tài khoản</a>
            <span>•</span>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
              Sitemap XML <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
