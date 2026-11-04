import {
  Gift,
  CheckCircle2,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const FREE_ANNOUNCEMENTS = [
  {
    icon: Gift,
    badgeVi: "HOÀN TOÀN MIỄN PHÍ",
    badgeEn: "COMPLETELY FREE",
    descVi: "Trợ Lý Tài Chính là nền tảng quản lý tài chính hoàn toàn miễn phí cho mọi người dùng",
    descEn: "Halo Finance is a completely free financial management platform for all users",
    href: "#free-commitment",
  },
  {
    icon: CheckCircle2,
    badgeVi: "CAM KẾT MIỄN PHÍ",
    badgeEn: "FREE COMMITMENT",
    descVi: "Không phí duy trì, không phụ phí ẩn và không yêu cầu liên kết thẻ tín dụng",
    descEn: "Zero maintenance fees, zero hidden charges & no credit card required",
    href: "#free-commitment",
  },
  {
    icon: Sparkles,
    badgeVi: "QUÉT BILL AI MIỄN PHÍ",
    badgeEn: "FREE AI SCANNER",
    descVi: "Bóc tách hóa đơn ăn uống, mua sắm bằng AI tự động mà không mất bất kỳ chi phí nào",
    descEn: "Scan and extract receipts with AI automatically at zero cost",
    href: "#free-commitment",
  },
  {
    icon: HeartHandshake,
    badgeVi: "CHIA TIỀN NHÓM MIỄN PHÍ",
    badgeEn: "FREE GROUP SPLIT",
    descVi: "Tạo quỹ nhóm, chia bill VietQR 1 chạm và quản lý công nợ hoàn toàn miễn phí",
    descEn: "Create group funds, 1-tap VietQR bill split & debt tracking completely free",
    href: "#free-commitment",
  },
  {
    icon: ShieldCheck,
    badgeVi: "BẢO MẬT MIỄN PHÍ",
    badgeEn: "FREE BANK SECURITY",
    descVi: "Dữ liệu được mã hóa chuẩn ngân hàng AES-256 an toàn tuyệt đối mà không tốn chi phí",
    descEn: "Bank-grade AES-256 data encryption and privacy protection at zero fee",
    href: "#free-commitment",
  },
  {
    icon: CreditCard,
    badgeVi: "DÙNG NGAY MIỄN PHÍ",
    badgeEn: "START FOR FREE",
    descVi: "Tải ứng dụng hoặc mở tài khoản web để trải nghiệm nền tảng hoàn toàn miễn phí",
    descEn: "Download app or sign up on web to experience the completely free platform",
    href: "#free-commitment",
  },
];

export default function TopAnnouncementBar() {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  const renderTrackItems = (prefix) =>
    FREE_ANNOUNCEMENTS.map((item, index) => {
      const Icon = item.icon;
      const badge = isEn ? item.badgeEn : item.badgeVi;
      const desc = isEn ? item.descEn : item.descVi;

      return (
        <a
          key={`${prefix}-${item.badgeVi}-${index}`}
          href={item.href}
          tabIndex={prefix === 'track-2' ? -1 : undefined}
          className="group/item inline-flex items-center gap-2 px-3.5 py-1 hover:bg-black/10 rounded-full transition-colors shrink-0"
        >
          {/* Free Badge with Icon */}
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-black text-[10px] bg-white text-[#E96C42] shadow-xs shrink-0 transition-transform group-hover/item:scale-105">
            <Icon className="w-3 h-3 text-[#E96C42] shrink-0" />
            <span>{badge}</span>
          </span>

          {/* Commitment Description */}
          <span className="text-white/95 font-medium group-hover/item:text-white transition-colors">
            {desc}
          </span>

          {/* Broadcast-style separator */}
          <span className="text-white/50 mx-2 text-[8px]">◆</span>
        </a>
      );
    });

  return (
    <aside
      aria-label="Thông báo nền tảng hoàn toàn miễn phí"
      className="group relative z-50 h-9 bg-[#E96C42] text-white border-b border-[#d85e35] overflow-hidden text-[11px] font-medium select-none shadow-xs"
    >
      {/* Edge Gradient Mask for smooth entry and exit */}
      <div className="w-full h-full marquee-mask flex items-center overflow-hidden">
        {/* Track 1 */}
        <div className="marquee-track items-center cursor-pointer">
          {renderTrackItems("track-1")}
        </div>

        {/* Track 2 - Exact duplicate seamlessly continuing the loop */}
        <div
          className="marquee-track items-center cursor-pointer"
          aria-hidden="true"
        >
          {renderTrackItems("track-2")}
        </div>
      </div>
    </aside>
  );
}
