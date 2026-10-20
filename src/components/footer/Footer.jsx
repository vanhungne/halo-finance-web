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
  PhoneCall,
  Building2,
  FileText,
  Award,
} from "lucide-react";
import images from "../../assets/image.js";
import LanguageSwitcher from "../common/LanguageSwitcher.jsx";

const productLinks = [
  { label: "Tài Khoản Thanh Toán Số Đẹp (0đ Phí)", href: "#features" },
  { label: "Mô Phỏng Trải Nghiệm App Mobile", href: "#app-simulator" },
  { label: "Bóc Tách Hóa Đơn Trí Tuệ Nhân Tạo AI", href: "#app-simulator" },
  { label: "Chia Tiền Nhóm Du Lịch VietQR 1 Chạm", href: "#app-simulator" },
  { label: "Quản Lý Sổ Nợ & Tính Lãi Dư Nợ", href: "#calculators" },
  { label: "Báo Cáo Phân Tích Dòng Tiền 360°", href: "#product-preview" },
  { label: "Định Giá Danh Mục Vàng SJC & Tài Sản", href: "#rates" },
];

const toolLinks = [
  { label: "Tính Lãi Tiết Kiệm Tích Lũy Bậc Thang", href: "#calculators" },
  { label: "Bảng Khấu Hao Lịch Trả Nợ Vay Ngân Hàng", href: "#calculators" },
  { label: "Tính Sức Mạnh Lãi Kép Đầu Tư 10 - 30 Năm", href: "#calculators" },
  { label: "Trắc Nghiệm Chấm Điểm Sức Khỏe Tài Chính", href: "#health-check" },
  { label: "Bảng Tỷ Giá Ngoại Tệ & Giá Vàng SJC", href: "#rates" },
  { label: "Ma Trận So Sánh Tính Năng Vượt Trội", href: "#comparison" },
  { label: "Tải Miễn Phí Ebook Tài Chính 2026", href: "#ebook" },
];

const companyLinks = [
  { label: "Về Halo Finance (Trợ Lý Tài Chính)", href: "#home" },
  { label: "Cam Kết Miễn Phí 100% Trọn Đời (0đ)", href: "#free-commitment" },
  { label: "Đánh Giá Từ 3.2M+ Người Dùng", href: "#reviews" },
  { label: "Tiêu Chuẩn Bảo Mật PCI-DSS & ISO 27001", href: "#security" },
  { label: "Tuân Thủ Nghị Định 13/2023/NĐ-CP", href: "#security" },
  { label: "Câu Hỏi Thường Gặp (FAQ)", href: "#faq" },
  { label: "Sổ Thu Chi Miễn Phí 100% Trọn Đời", href: "#free-commitment" },
];

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 sm:pt-20 pb-28 sm:pb-16 border-t border-slate-800">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10">
        
        {/* Top Institutional Header: Hotline & Support Network */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <img src={images.logo} alt="Halo Finance" className="h-10 w-auto brightness-0 invert" />
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="hidden sm:inline text-xs font-bold text-slate-300">
              Định Chế Quản Trị Dòng Tiền & Ngân Hàng Số Thế Hệ Mới
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
                <strong className="text-slate-200 text-xs font-semibold">contact@halofinance.vn</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Bảo chứng an toàn</span>
                <strong className="text-amber-300 text-xs font-bold">PCI-DSS & ISO 27001</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Top 4-Column Links Grid */}
        <div className="grid gap-10 py-14 border-b border-slate-800/80 lg:grid-cols-12">
          
          {/* Brand Info & Legal Entity Details */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-black uppercase text-white tracking-wider">
              Công Ty Cổ Phần Công Nghệ Tài Chính Halo
            </h4>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Nền tảng tài chính số đa phương thức phục vụ hơn 3.2 triệu cá nhân, gia đình và hộ kinh doanh tại Việt Nam. Kết nối 54+ ngân hàng chuẩn NAPAS 24/7, bóc tách hóa đơn Trí Tuệ Nhân Tạo AI trong 3 giây và quản trị dòng tiền chuẩn mực quốc tế.
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

          {/* Column 1: Sản phẩm ngân hàng số */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white">Sản Phẩm & Dịch Vụ</p>
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

          {/* Column 2: Công cụ tài chính */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white">Công Cụ Trực Tuyến</p>
            <ul className="space-y-2 text-xs font-medium">
              {toolLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition hover:underline underline-offset-4">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Pháp lý & Cổng Web */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white">Pháp Lý & Hỗ Trợ</p>
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
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-500/20 transition cursor-pointer"
              >
                <span>Cam Kết 100% Miễn Phí (0đ)</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="flex flex-col gap-4 pt-8 text-xs text-slate-500 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p>© {new Date().getFullYear()} Halo Finance Corporation. Mọi quyền được bảo lưu.</p>
            <LanguageSwitcher variant="footer" />
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-400 text-[11px]">
            <a href="#security" className="hover:text-white transition">Chính sách an toàn thông tin</a>
            <span>•</span>
            <a href="#home" className="hover:text-white transition">Điều khoản dịch vụ ngân hàng</a>
            <span>•</span>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
              Sitemap XML <ExternalLink className="h-3 w-3" />
            </a>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Đã thông báo Bộ Công Thương</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
