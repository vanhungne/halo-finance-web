import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "../../utils/cn.jsx";
import { useLanguage } from "../../contexts/LanguageContext.jsx";

const getFaqData = (isEn) => [
  {
    q: isEn
      ? "What is TroLyTaiChinh platform used for?"
      : "Nền tảng Trợ Lý Tài Chính dùng để làm gì?",
    a: isEn
      ? "TroLyTaiChinh is an intelligent personal finance platform that automates expense tracking via AI receipt scanning, manages group funds with 1-tap VietQR debt settlement, applies the 50/30/20 budgeting rule, and monitors total net worth in real-time."
      : "Trợ Lý Tài Chính là giải pháp quản lý tài chính thông minh giúp bạn tự động ghi chép thu chi qua hóa đơn AI, quản lý quỹ nhóm & chia tiền VietQR, lập ngân sách 50/30/20 và theo dõi dòng tiền cá nhân lẫn kinh doanh.",
  },
  {
    q: isEn
      ? "Is the application truly 100% free?"
      : "Ứng dụng có thực sự miễn phí 100% không?",
    a: isEn
      ? "100% Free Guarantee: free app download, free AI receipt scanning, free group fund creation, and zero hidden charges. All premium capabilities are fully unlocked with absolutely no annoying advertisements."
      : "Cam kết 100% miễn phí: hoàn toàn miễn phí tải app, miễn phí quét hóa đơn AI, miễn phí tạo quỹ nhóm. Toàn bộ tính năng cao cấp đều được mở khóa sẵn mà không có chi phí ẩn hay quảng cáo làm phiền.",
  },
  {
    q: isEn
      ? "How does the AI receipt scanning technology work?"
      : "Công nghệ quét hóa đơn AI bóc tách những gì?",
    a: isEn
      ? "Simply snap a photo of any receipt (dining, supermarket, utility, or thermal printed bills). The AI automatically recognizes item names, quantities, unit prices, VAT taxes, and categorizes the expense in under 3 seconds."
      : "Chỉ cần chụp ảnh hóa đơn nhà hàng, siêu thị hay bill in nhiệt mờ. Trí Tuệ Nhân Tạo AI tự động nhận diện tên món, đơn giá, số lượng, thuế VAT và tự động ghi chép vào danh mục chi tiêu trong chưa đầy 3 giây.",
  },
  {
    q: isEn
      ? "Is my financial transaction data secure and private?"
      : "Dữ liệu tài chính của tôi có được bảo mật không?",
    a: isEn
      ? "Completely safe. All data is end-to-end encrypted with bank-grade AES-256 standards. We strictly comply with Decree 13/2023/ND-CP on personal data protection and never sell or share user data with third parties."
      : "Dữ liệu được mã hóa đầu cuối với chuẩn AES-256 cao cấp nhất của ngành ngân hàng. Chúng tôi tuân thủ nghiêm ngặt Nghị định 13/2023/NĐ-CP và cam kết không bao giờ bán hoặc chia sẻ dữ liệu cho bên thứ ba.",
  },
  {
    q: isEn
      ? "How does Group Fund and 1-tap VietQR split work?"
      : "Tính năng Quỹ nhóm và Chia tiền VietQR hoạt động ra sao?",
    a: isEn
      ? "Create a group fund for family, roommates, or trips. When expenses arise, the algorithm calculates debt netting to minimize transfers and generates personalized VietQR codes for instant 1-tap reconciliation."
      : "Bạn có thể tạo quỹ nhóm cho gia đình hoặc hội bạn. Hệ thống tự động tính toán bù trừ nợ thông minh với số lần chuyển khoản ít nhất, đồng thời tạo mã VietQR cá nhân hóa để mọi người gạch nợ tức thì.",
  },
  {
    q: isEn
      ? "Are there any limits on transactions or AI scans per month?"
      : "Tôi có bị giới hạn số lượng giao dịch hay quét hóa đơn không?",
    a: isEn
      ? "Zero limits! You can record thousands of income and expense transactions, manage multiple wallets, and scan receipts daily without ever encountering paywalls or quotas."
      : "Hoàn toàn không giới hạn! Bạn có thể thêm không giới hạn các khoản thu chi, sổ giao dịch và quét hóa đơn AI mỗi ngày mà không bao giờ bị khóa tính năng hay yêu cầu nâng cấp trả phí.",
  },
  {
    q: isEn
      ? "Can I sync data seamlessly across mobile and PC?"
      : "Có thể đồng bộ dữ liệu giữa điện thoại và máy tính không?",
    a: isEn
      ? "Yes. TroLyTaiChinh provides true multi-platform synchronization: native mobile applications (iOS / Android) and full-featured desktop Web Portal sync instantly and securely in real-time."
      : "Có. Dữ liệu được đồng bộ tức thì trên nền tảng đám mây an toàn giữa ứng dụng di động (iOS/Android) và phiên bản Web Portal trên máy tính cá nhân.",
  },
  {
    q: isEn
      ? "Does the app support exporting reports to Excel and PDF?"
      : "Ứng dụng có hỗ trợ xuất báo cáo Excel, PDF không?",
    a: isEn
      ? "Yes. You can export complete transaction ledgers, cash flow statements, and budget breakdowns to standard Excel (XLSX, CSV) or formatted PDF documents with a single click."
      : "Có. Bạn có thể xuất toàn bộ lịch sử thu chi, sao kê dòng tiền và báo cáo ngân sách ra file Excel (XLSX, CSV) hoặc PDF chuẩn mực chỉ với một chạm để đối soát kế toán.",
  },
  {
    q: isEn
      ? "Which banks and payment networks are integrated?"
      : "Trợ Lý Tài Chính hỗ trợ những ngân hàng nào?",
    a: isEn
      ? "We support over 54 commercial banks across Vietnam via Napas 247 and the National VietQR standard (Vietcombank, MB, Techcombank, VPBank, ACB, BIDV, Agribank, etc.) for instant transaction matching."
      : "Hệ thống tích hợp trực tiếp mạng lưới Napas 247 và hơn 54 ngân hàng thương mại tại Việt Nam (Vietcombank, MB, Techcombank, VPBank, ACB, BIDV...) thông qua chuẩn VietQR tự động.",
  },
  {
    q: isEn
      ? "How can I reach customer support or submit feedback?"
      : "Khi cần hỗ trợ kỹ thuật hoặc góp ý thì liên hệ thế nào?",
    a: isEn
      ? "Our dedicated support team is available 24/7 via Hotline 1900 6868, in-app Live Chat, or email at contact@trolytaichinh.vn, with guaranteed response within 15 minutes."
      : "Đội ngũ hỗ trợ kỹ thuật luôn trực tuyến 24/7 qua Hotline 1900 6868, Live Chat trong app hoặc email contact@trolytaichinh.vn với cam kết xử lý phản hồi trong vòng 15 phút.",
  },
];

export default function FaqSection() {
  const { isEnglish } = useLanguage();
  const [open, setOpen] = useState(0); // Mở câu đầu tiên mặc định như Dean Studio

  const items = getFaqData(isEnglish);
  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];

  return (
    <section id="faq" className="relative w-full py-20 sm:py-28 bg-white text-slate-900 overflow-hidden border-t border-slate-200/80">
      {/* Subtle Ambient Reflections */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-blue-100/40 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-indigo-100/40 blur-[140px]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
        {/* Section Heading matching Dean Studio */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight text-slate-950 title-3d">
            {isEnglish ? "Frequently Asked Questions" : "Câu hỏi thường gặp"}
          </h2>
        </div>

        {/* 2-Column Accordion Layout */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-0">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col">
              {col.map((item, idx) => {
                const index = colIdx * half + idx;
                const isOpen = open === index;
                return (
                  <FaqItem
                    key={index}
                    number={index + 1}
                    item={item}
                    isOpen={isOpen}
                    onToggle={() => setOpen(isOpen ? -1 : index)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ number, item, isOpen, onToggle }) {
  const Icon = isOpen ? Minus : Plus;
  return (
    <div className="border-b border-slate-200/80">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-4 py-5 text-left group cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-lg"
      >
        <span
          className={cn(
            "text-base sm:text-lg font-semibold leading-snug transition-colors",
            isOpen
              ? "text-blue-600 font-bold"
              : "text-slate-900 group-hover:text-blue-600"
          )}
        >
          {number}. {item.q}
        </span>
        <Icon
          className={cn(
            "mt-1 h-5 w-5 shrink-0 transition-colors",
            isOpen ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="pb-5 text-sm sm:text-[15px] leading-relaxed text-slate-600">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
