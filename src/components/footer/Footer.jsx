import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Youtube,
  ShieldCheck,
  Lock,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import images from "../../assets/image.js";

const productLinks = [
  { label: "Sổ Thu Chi Cá Nhân", href: "#features" },
  { label: "Mô Phỏng Trải Nghiệm App", href: "#app-simulator" },
  { label: "Quét Hóa Đơn AI Gemini", href: "#ai-scanner" },
  { label: "Chia Tiền Nhóm VietQR", href: "#group-expense" },
  { label: "Quản Lý Sổ Nợ & Tính Lãi", href: "#app-simulator" },
  { label: "Báo Cáo & Dòng Tiền 360°", href: "#product-preview" },
  { label: "Danh Mục Vàng & Tài Sản", href: "#rates" },
];

const toolLinks = [
  { label: "Tính Lãi Tiền Gửi Tiết Kiệm", href: "#calculators" },
  { label: "Tính Bảng Trả Nợ Vay Ngân Hàng", href: "#calculators" },
  { label: "So Sánh Tính Năng Vượt Trội", href: "#comparison" },
  { label: "Chấm Điểm Sức Khỏe Tài Chính", href: "#health-check" },
  { label: "Tỷ Giá Ngoại Tệ & Giá Vàng SJC", href: "#rates" },
  { label: "Tải Miễn Phí Ebook Tài Chính 2026", href: "#ebook" },
];

const companyLinks = [
  { label: "Giới thiệu Halo Finance", href: "#home" },
  { label: "Bảng giá & Gói Premium", href: "#pricing" },
  { label: "Đánh giá từ cộng đồng", href: "#reviews" },
  { label: "Bảo mật & Cam kết riêng tư", href: "#security" },
  { label: "Câu hỏi thường gặp (FAQ)", href: "#faq" },
  { label: "Cổng Khách Hàng Web (/app)", href: "/app" },
];

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 sm:pt-20 pb-12 border-t border-slate-800">
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
        
        {/* Top 4-Column Grid */}
        <div className="grid gap-12 pb-14 border-b border-slate-800/80 lg:grid-cols-12">
          
          {/* Brand Info & Support */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-2">
              <img src={images.logo} alt="Trợ Lý Tài Chính" className="h-10 w-auto brightness-0 invert" />
            </div>

            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Trợ Lý Tài Chính (Halo Finance) — Nền tảng quản lý tài chính cá nhân & chi tiêu nhóm thông minh, giúp bạn làm chủ dòng tiền, xây dựng kế hoạch tiết kiệm và vững vàng tương lai.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2 pt-1">
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
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:border-blue-500 hover:bg-blue-600 hover:text-white transition"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            {/* Security Compliance Seal */}
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Mã hóa AES-256
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-slate-300">
                <Lock className="h-4 w-4 text-sky-400" />
                TLS 1.3 Chuẩn Ngân Hàng
              </span>
            </div>
          </div>

          {/* Links Column 1: Sản phẩm */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white">Sản phẩm & Tính năng</p>
            <ul className="space-y-2.5 text-sm font-medium">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition hover:underline underline-offset-4">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2: Công cụ tiện ích */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white">Công cụ tài chính</p>
            <ul className="space-y-2.5 text-sm font-medium">
              {toolLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition hover:underline underline-offset-4">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 3: Về chúng tôi & Tải App */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white">Nền tảng & Hỗ trợ</p>
            <ul className="space-y-2.5 text-sm font-medium">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition hover:underline underline-offset-4">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="pt-3">
              <a
                href="#download"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>Tải App Ngay</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="flex flex-col gap-4 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Trợ Lý Tài Chính (Halo Finance) — Bản quyền đã được bảo hộ toàn cầu.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-400">
            <a href="#security" className="hover:text-white transition">Chính sách bảo mật</a>
            <span>•</span>
            <a href="#home" className="hover:text-white transition">Điều khoản sử dụng</a>
            <span>•</span>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
              Sitemap XML <ExternalLink className="h-3 w-3" />
            </a>
            <span>•</span>
            <a href="mailto:hotro@trolytaichinh.vn" className="hover:text-white transition">hotro@trolytaichinh.vn</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
