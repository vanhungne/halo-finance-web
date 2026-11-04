import { Building2, Camera, FileDown, LockKeyhole, ReceiptText, UsersRound } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import './securityGrid.css';

const CONTENT = {
  vi: {
    badge: 'Bảo mật & Quyền riêng tư',
    title: 'An tâm hơn với ',
    titleHighlight: 'dữ liệu của bạn',
    description: 'Thông tin cá nhân, hóa đơn và dữ liệu kinh doanh được quản lý theo tài khoản và quyền truy cập. Bạn chủ động khi thêm ảnh, dùng camera hoặc chia sẻ báo cáo.',
    privacy: 'Tìm hiểu về quyền riêng tư & bảo mật',
    items: [
      ['Tài khoản của riêng bạn', 'Đăng nhập để quản lý thu chi, số dư và lịch sử giao dịch gắn với tài khoản của bạn.'],
      ['Hóa đơn được bảo vệ', 'Ảnh hóa đơn được mã hóa khi lưu và được kiểm tra quyền truy cập trước khi xem.'],
      ['Quyền trên thiết bị', 'Bạn cho phép dùng camera hoặc chọn ảnh khi quét mã, chụp và thêm hóa đơn.'],
      ['Chia sẻ đúng nhóm', 'Khoản chi chung gắn với nhóm bạn tham gia, với quyền xem và thao tác theo vai trò.'],
      ['Phân quyền theo dự án', 'Dữ liệu kinh doanh được tách theo công ty và dự án. Mỗi người truy cập theo vai trò được cấp.'],
      ['Chủ động gửi báo cáo', 'Bạn chọn nơi lưu hoặc người nhận khi chia sẻ báo cáo Excel, PDF từ ứng dụng.'],
    ],
  },
  en: {
    badge: 'Security & Privacy',
    title: 'Feel more at ease with ',
    titleHighlight: 'your data',
    description: 'Personal information, receipts and business records are managed by account and access permissions. You choose when to add photos, use your camera or share reports.',
    privacy: 'Learn about your privacy & security',
    items: [
      ['Your own account', 'Sign in to manage the income, expenses, balances and transaction history linked to your account.'],
      ['Protected receipt images', 'Receipt images are encrypted when stored, and access permissions are checked before viewing.'],
      ['Device permissions you choose', 'You allow camera access or select photos when scanning codes, taking pictures or adding receipts.'],
      ['Sharing within your group', 'Shared expenses belong to the group you join, with viewing and editing permissions based on each person’s role.'],
      ['Access by company and project', 'Business records are separated by company and project. Each person’s access follows their assigned role.'],
      ['Reports you choose to share', 'You choose where to save an Excel or PDF report, or who to send it to from the app.'],
    ],
  },
};

const FEATURES = [
  { id: 'account', icon: LockKeyhole },
  { id: 'receipts', icon: ReceiptText },
  { id: 'device', icon: Camera },
  { id: 'groups', icon: UsersRound },
  { id: 'business', icon: Building2 },
  { id: 'reports', icon: FileDown },
];

export default function SecurityCompliance() {
  const { isEnglish } = useLanguage();
  const copy = CONTENT[isEnglish ? 'en' : 'vi'];

  return (
    <section
      id="security"
      className="security-section relative py-20 sm:py-28 overflow-hidden bg-white text-slate-900 border-t border-slate-200/80"
      aria-labelledby="security-title"
    >
      <div className="security-section__container relative z-10">
        <div className="security-section__heading">
          <h2 id="security-title" className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight text-slate-950 title-3d">
            {isEnglish ? "Feel more at ease with your data" : "An tâm hơn với dữ liệu của bạn"}
          </h2>

          <p className="mt-3.5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {copy.description}
          </p>
        </div>

        {/* 6-cell Grid with Clean Unified Icons */}
        <ul className="security-grid">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <li key={feature.id} className="security-grid__cell group">
                <div className="security-grid__identity">
                  <Icon size={20} strokeWidth={2} className="shrink-0" aria-hidden="true" />
                  <h3>{copy.items[index][0]}</h3>
                </div>

                <p>{copy.items[index][1]}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
