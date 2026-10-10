import { ArrowUpRight, Facebook, Instagram, Mail, MapPin, Youtube } from "lucide-react";
import images from "../../assets/image.js";

const productLinks = [
  { label: "Tính năng", href: "#features" },
  { label: "Cách hoạt động", href: "#how-it-works" },
  { label: "Gói dịch vụ", href: "#pricing" },
  { label: "Câu hỏi thường gặp", href: "#faq" },
];

function Footer() {
  return (
    <footer className="bg-white px-5 pb-8 pt-16 sm:px-8 sm:pt-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-12 border-b border-slate-200 pb-14 lg:grid-cols-[1.35fr_0.65fr_0.8fr_1.2fr]">
          <div>
            <img src={images.logo} alt="Trợ Lý Tài Chính" className="h-10 w-auto" />
            <p className="mt-6 max-w-sm leading-7 text-slate-600">
              Công cụ giúp bạn nhìn rõ dòng tiền, xây dựng thói quen tốt và chủ động hơn với mọi quyết định tài chính.
            </p>
            <div className="mt-7 flex items-center gap-2">
              {[Instagram, Facebook, Youtube].map((Icon, index) => (
                <a key={index} href="#home" aria-label={["Instagram", "Facebook", "YouTube"][index]} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-sky-500 hover:bg-sky-500 hover:text-white">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-400">Sản phẩm</h3>
            <ul className="mt-6 space-y-4 text-sm font-semibold text-slate-700">
              {productLinks.map((link) => <li key={link.href}><a href={link.href} className="transition hover:text-sky-600">{link.label}</a></li>)}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-400">Liên hệ</h3>
            <ul className="mt-6 space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" /><span className="break-all">hotro.trolytaichinh@gmail.com</span></li>
              <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" /><span>Việt Nam</span></li>
            </ul>
          </div>

          <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-sky-400">Bắt đầu ngay</p>
            <h3 className="mt-3 text-xl font-extrabold">Đưa tài chính về đúng quỹ đạo.</h3>
            <a href="#download" className="group mt-6 inline-flex items-center gap-2 rounded-full bg-sky-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300">
              Tải ứng dụng
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Trợ Lý Tài Chính. Bảo lưu mọi quyền.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#home" className="transition hover:text-slate-950">Điều khoản sử dụng</a>
            <a href="#home" className="transition hover:text-slate-950">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
