import {
  BellRing, Building2, CalendarClock, ChartColumnIncreasing,
  ChartNoAxesCombined, ClipboardCheck, FileChartColumn, FolderKanban,
  HandCoins, History, Landmark, ListFilter, Mic, Paperclip, PieChart,
  PiggyBank, ReceiptText, Repeat2, ScanLine, Scale, Shapes, Sparkles, Split,
  Tags, UserRoundPlus, UsersRound, Wallet,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import "./featureDirectory.css";

// Describes existing app flows, without implying automatic bank transfers.
const FEATURE_GROUPS = [
  {
    id: "personal", name: ["Cá nhân", "Personal"],
    features: [
      ["transactions", ReceiptText, "Ghi chép thu chi", "Track income & expenses", "Ghi lại số tiền, ví, danh mục và ghi chú cho từng khoản thu chi.", "Record the amount, wallet, category and notes for each transaction."],
      ["wallets", Wallet, "Quản lý ví", "Manage wallets", "Theo dõi số dư và các giao dịch trong từng ví của bạn.", "Keep track of balances and transactions in each of your wallets."],
      ["receipts", ScanLine, "Quét hóa đơn bằng AI", "AI receipt scanning", "Đọc thông tin từ ảnh hóa đơn, kiểm tra lại trước khi lưu khoản chi.", "Extract receipt details from a photo and review them before saving.", true],
      ["assistant", Mic, "Trợ lý AI", "AI assistant", "Nhập nội dung hoặc dùng giọng nói để tạo bản nháp thu chi.", "Draft income and expense records using text or your voice.", true],
      ["budgets", PieChart, "Ngân sách chi tiêu", "Spending budgets", "Đặt ngân sách và theo dõi mức chi tiêu theo từng danh mục.", "Set budgets and monitor spending across your categories."],
      ["savings", PiggyBank, "Mục tiêu tiết kiệm", "Savings goals", "Đặt mục tiêu, số tiền cần tích lũy và theo dõi tiến độ thực hiện.", "Set a savings target and keep track of your progress."],
      ["debts", HandCoins, "Sổ vay và cho vay", "Borrowing & lending", "Ghi lại khoản vay, cho vay và lịch sử trả tiền của từng khoản.", "Record money borrowed or lent and its repayment history."],
      ["assets", Landmark, "Quản lý tài sản", "Asset tracking", "Lưu thông tin tài sản, cập nhật giá trị và ghi nhận khi thanh lý.", "Record assets, update their value and track disposals."],
      ["recurring", CalendarClock, "Thu chi định kỳ", "Recurring transactions", "Thiết lập các khoản lặp lại theo lịch để theo dõi thu chi đều đặn.", "Schedule recurring records to keep regular income and expenses in view."],
      ["history", History, "Lịch sử giao dịch", "Transaction history", "Tìm kiếm, lọc và xem lại các khoản thu chi đã ghi nhận.", "Search, filter and revisit your recorded income and expenses."],
      ["categories", Tags, "Danh mục thu chi", "Income & expense categories", "Sắp xếp danh mục cha, con để phân loại các khoản theo nhu cầu.", "Organize parent and child categories to suit your records."],
      ["analytics", ChartNoAxesCombined, "Phân tích tài chính", "Financial insights", "Xem biểu đồ thu chi theo thời gian, danh mục và xuất dữ liệu Excel.", "View income and spending by period or category and export to Excel."],
    ],
  },
  {
    id: "group", name: ["Nhóm", "Groups"],
    features: [
      ["membership", UserRoundPlus, "Tạo và tham gia nhóm", "Create & join groups", "Lập nhóm chi tiêu, mời thành viên và cùng theo dõi các khoản chung.", "Create a spending group, invite members and track shared expenses."],
      ["expenses", ReceiptText, "Ghi nhận chi phí chung", "Shared expense records", "Ghi số tiền, người trả và các thành viên tham gia từng khoản chi.", "Record each expense, who paid and which members took part."],
      ["split", Split, "Chia tiền linh hoạt", "Flexible expense splitting", "Chia đều, theo số tiền, tỷ lệ phần trăm hoặc số phần của mỗi người.", "Split equally, by exact amounts, percentages or individual shares.", true],
      ["balances", Scale, "Số dư từng thành viên", "Member balances", "Biết ai đã trả hộ, ai cần trả thêm và số tiền chênh lệch trong nhóm.", "See who paid for others and how much each member owes or is owed."],
      ["settlements", Repeat2, "Đối soát và quyết toán", "Settlements", "Ghi nhận, xác nhận các khoản hoàn trả và theo dõi lịch sử quyết toán.", "Record and confirm repayments and review settlement history.", true],
      ["discussion", Paperclip, "Bình luận và chứng từ", "Comments & attachments", "Trao đổi ngay tại khoản chi và đính kèm chứng từ để cả nhóm xem lại.", "Discuss expenses and attach supporting documents for the group."],
      ["recurring", CalendarClock, "Chi phí nhóm định kỳ", "Recurring group expenses", "Thiết lập những khoản chi chung lặp lại theo lịch của nhóm.", "Set up shared expenses that repeat on your group's schedule."],
      ["statistics", ChartColumnIncreasing, "Thống kê chi tiêu nhóm", "Group spending insights", "Tổng hợp các khoản chi, xem phân bổ và xuất dữ liệu của nhóm.", "Review spending totals and breakdowns, and export group data."],
    ],
  },
  {
    id: "business", name: ["Kinh doanh", "Business"],
    features: [
      ["companies", Building2, "Quản lý nhiều công ty", "Manage multiple companies", "Tạo công ty với tên, logo và quản lý dữ liệu riêng cho từng công ty.", "Create companies with a name and logo and keep their records separate."],
      ["projects", FolderKanban, "Quản lý dự án", "Project management", "Tổ chức nhiều dự án trong mỗi công ty, theo dõi từ khi tạo đến kết thúc.", "Organize projects within each company and follow them through to closure.", true],
      ["entries", ReceiptText, "Ghi nhận khoản thu chi", "Income & expense entries", "Phân loại các khoản ghi nhận theo sáu loại phát sinh của dự án.", "Organize project entries across six income and expense types."],
      ["payments", HandCoins, "Theo dõi thu chi từng lần", "Track individual payments", "Biết mỗi khoản đã thu, đã chi, còn lại hoặc vượt số tiền ghi nhận bao nhiêu.", "See paid, received, outstanding and excess amounts for each entry."],
      ["categories", Shapes, "Danh mục theo công ty", "Company categories", "Dùng danh mục mặc định hoặc tạo danh mục cha, con cho mọi dự án trong công ty.", "Use default or custom parent and child categories across company projects."],
      ["overview", ChartNoAxesCombined, "Tổng quan kinh doanh", "Business overview", "Xem kết quả, dòng tiền và các mục cần chú ý ở cấp công ty hoặc dự án.", "Review results, cash flow and items needing attention by company or project."],
      ["members", UsersRound, "Thành viên dự án", "Project members", "Mời nhân viên bằng mã hoặc QR, tiếp nhận và duyệt yêu cầu tham gia.", "Invite employees by code or QR and review requests to join a project."],
      ["requests", ClipboardCheck, "Duyệt yêu cầu chi tiêu", "Expense request approvals", "Tiếp nhận tạm ứng, đề nghị chi và khoản nhân viên đã chi trong dự án.", "Review project advances, payment requests and employee-paid expenses.", true],
      ["advances", Wallet, "Tạm ứng và quyết toán", "Advances & reimbursements", "Theo dõi tiền đã ứng, đã dùng, cần hoàn và đã trả lại của từng nhân viên.", "Track employee advances, amounts used, reimbursements and returns.", true],
      ["reports", FileChartColumn, "Ba bảng báo cáo", "Three financial reports", "Xem kết quả kinh doanh, dòng tiền, công nợ và xuất báo cáo Excel hoặc PDF.", "View business results, cash flow and debts; export reports as Excel or PDF."],
      ["activity", BellRing, "Lịch sử hoạt động", "Activity history", "Theo dõi thay đổi tại các công ty, dự án trong phạm vi bạn được xem.", "Follow changes in the companies and projects you have access to."],
      ["closing", ListFilter, "Đối soát và kết thúc", "Reconcile & close projects", "Kiểm tra khoản còn chênh lệch, yêu cầu và tạm ứng trước khi kết thúc dự án.", "Review outstanding amounts, requests and advances before closing a project."],
    ],
  },
];

export default function RealAppFeatureGrid({ onOpenQr }) {
  const { lang } = useLanguage();
  const english = lang === "en";

  return (
    <section id="features" className="feature-directory" aria-label={english ? "App features" : "Tính năng ứng dụng"}>
      <div className="feature-directory__container px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.2rem] xl:text-[2.65rem] font-black tracking-tight leading-tight text-slate-950 title-3d">
            {english
              ? "Comprehensive Financial Ecosystem For Life & Work"
              : "Hệ Sinh Thái Tài Chính Toàn Diện Cho Cuộc Sống & Công Việc"}
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-[17px] text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            {english
              ? "From daily personal expense tracking and transparent group funds to multi-project business cash flow."
              : "Từ sổ thu chi cá nhân mỗi ngày, quỹ nhóm bạn bè minh bạch đến dòng tiền kinh doanh đa dự án."}
          </p>
        </div>

        {FEATURE_GROUPS.map((group) => {
          return (
            <div key={group.id} className={`feature-directory__group feature-directory__group--${group.id}`}>
              <div className="feature-directory__heading">
                <h3 id={`features-${group.id}`} className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{group.name[english ? 1 : 0]}</h3>
                <span className="feature-directory__count">{group.features.length} {english ? "features" : "tính năng"}</span>
              </div>
              <ul className="feature-directory__grid" aria-labelledby={`features-${group.id}`}>
                {group.features.map((feature) => {
                  const [id, Icon, viTitle, enTitle, viDescription, enDescription, isHighlight] = feature;
                  const title = english ? enTitle : viTitle;
                  const content = (
                    <>
                      <div className="feature-directory__header">
                        <div className="feature-directory__identity">
                          <Icon size={20} strokeWidth={2} className="feature-directory__icon shrink-0" aria-hidden="true" />
                          <h4 className="feature-directory__title">{title}</h4>
                        </div>
                        {isHighlight && (
                          <span className="feature-badge-new">
                            <Sparkles size={10} strokeWidth={2.5} className="shrink-0 text-amber-600" aria-hidden="true" />
                            {english ? "New" : "Mới"}
                          </span>
                        )}
                      </div>
                      <p className="feature-directory__description">{english ? enDescription : viDescription}</p>
                    </>
                  );
                  return (
                    <li key={id} className={`feature-directory__cell${isHighlight ? " feature-directory__cell--highlight" : ""}`}>
                      {onOpenQr ? (
                        <button
                          type="button"
                          className="feature-directory__item"
                          onClick={onOpenQr}
                          aria-label={english ? `Trải nghiệm ${title} trên ứng dụng` : `Trải nghiệm ${title} trên ứng dụng`}
                        >
                          {content}
                        </button>
                      ) : (
                        <div className="feature-directory__item">{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
