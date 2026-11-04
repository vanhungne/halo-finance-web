import { Check, X } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import "./beforeAfter.css";

const COMPARISONS = [
  {
    id: "recording",
    before: ["Nhớ để ghi, rồi lại quên", "Remember now, record it later"],
    beforeDescription: ["Thu chi nằm rải rác trong ghi chú, tin nhắn và ảnh hóa đơn.", "Income and expenses are scattered across notes, messages and receipt photos."],
    after: ["Ghi chép theo cách bạn quen", "Record it your way"],
    afterDescription: ["Nhập tay, dùng giọng nói hoặc quét hóa đơn. Kiểm tra thông tin trước khi lưu.", "Type, speak or scan a receipt. Review the details before saving."],
  },
  {
    id: "personal-spending",
    before: ["Cuối tháng mới biết tiền đi đâu", "Wait until month-end to review spending"],
    beforeDescription: ["Cộng lại từng khoản, khó theo dõi chi tiêu theo ví và danh mục.", "Add up individual records to work out spending by wallet and category."],
    after: ["Biết đã chi bao nhiêu, cho việc gì", "See what you spent and where"],
    afterDescription: ["Xem lịch sử, phân tích thu chi và tiến độ ngân sách từ các khoản đã ghi nhận.", "View transaction history, spending insights and budget progress from your records."],
  },
  {
    id: "group-balances",
    before: ["Chia tiền qua nhiều tin nhắn", "Split expenses across message threads"],
    beforeDescription: ["Ai trả hộ, ai còn thiếu? Mỗi lần quyết toán lại phải dò cuộc trò chuyện.", "Who paid for whom, and who still owes? Settlement means searching the conversation again."],
    after: ["Mỗi người rõ phần của mình", "Everyone knows their share"],
    afterDescription: ["Chia đều, theo tỷ lệ hoặc số tiền. Xem số dư và ghi nhận các khoản hoàn trả trong nhóm.", "Split equally, by percentage or exact amount. View balances and record group repayments."],
  },
  {
    id: "business-payments",
    before: ["Có khoản ghi nhận, chưa rõ tiền thực tế", "Entries without a clear payment picture"],
    beforeDescription: ["Dễ lẫn doanh thu với tiền đã thu, chi phí với tiền đã chi khi thanh toán nhiều lần.", "It is easy to confuse recorded revenue and costs with actual payments when money moves in stages."],
    after: ["Rõ đã thu, đã chi và số tiền còn lại", "Know what is paid and what remains"],
    afterDescription: ["Theo dõi từng lần thu chi của mỗi khoản, biết còn cần thu, cần chi hoặc đã vượt bao nhiêu.", "Track each payment against an entry to see outstanding or excess amounts."],
  },
  {
    id: "business-reports",
    before: ["Gom từng dự án để làm báo cáo", "Combine projects to prepare reports"],
    beforeDescription: ["Số liệu tách rời giữa các bảng, cần tự cộng lại khi muốn xem toàn công ty.", "Figures live in separate sheets and need adding up for a company-wide view."],
    after: ["Báo cáo từ dự án đến công ty", "Reports from project to company"],
    afterDescription: ["Xem kết quả kinh doanh, dòng tiền, công nợ và xuất báo cáo Excel hoặc PDF.", "View business results, cash flow and debts, and export reports as Excel or PDF."],
  },
];

export default function BeforeAfterSection() {
  const { lang } = useLanguage();
  const languageIndex = lang === "en" ? 1 : 0;
  const beforeLabel = languageIndex ? "Before" : "Trước khi sử dụng";
  const afterLabel = languageIndex ? "With Trợ Lý Tài Chính" : "Cùng Trợ Lý Tài Chính";

  return (
    <section id="before-after" className="before-after" aria-labelledby="before-after-title">
      <div className="before-after__container">
        <div className="before-after__intro">
          <h2 id="before-after-title" className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight text-slate-950 title-3d">
            {languageIndex ? "A clearer view of your everyday finances" : "Tài chính mỗi ngày, rõ ràng hơn"}
          </h2>
          <p>{languageIndex ? "From personal spending to shared expenses and business records." : "Từ chi tiêu cá nhân, khoản chung của nhóm đến thu chi kinh doanh."}</p>
        </div>

        <table className="before-after__table" aria-labelledby="before-after-title">
          <thead>
            <tr>
              <th scope="col" className="before-after__heading before-after__heading--before">{beforeLabel}</th>
              <th scope="col" className="before-after__heading before-after__heading--after">{afterLabel}</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISONS.map((comparison) => (
              <tr key={comparison.id}>
                <td className="before-after__cell before-after__cell--before">
                  <span className="before-after__mobile-label" aria-hidden="true">{beforeLabel}</span>
                  <span className="before-after__mark before-after__mark--before" aria-hidden="true"><X /></span>
                  <h3>{comparison.before[languageIndex]}</h3>
                  <p>{comparison.beforeDescription[languageIndex]}</p>
                </td>
                <td className="before-after__cell before-after__cell--after">
                  <span className="before-after__mobile-label" aria-hidden="true">{afterLabel}</span>
                  <span className="before-after__mark before-after__mark--after" aria-hidden="true"><Check /></span>
                  <h3>{comparison.after[languageIndex]}</h3>
                  <p>{comparison.afterDescription[languageIndex]}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
