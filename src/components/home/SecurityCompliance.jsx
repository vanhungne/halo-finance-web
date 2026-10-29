import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Server,
  FileText,
  EyeOff,
  CheckCircle,
  Building2,
} from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "Mã Hóa Cấp Ngân Hàng AES-256",
    desc: "Mọi dữ liệu số dư, lịch sử giao dịch và hóa đơn được mã hóa bằng tiêu chuẩn mã hóa quân đội AES-256 cả khi lưu trữ lẫn khi truyền qua đường truyền mạng TLS 1.3.",
  },
  {
    icon: KeyRound,
    title: "Xác Thực 2 Yếu Tố (2FA / TOTP)",
    desc: "Bảo vệ tài khoản an toàn tuyệt đối với mã OTP từ Google Authenticator hoặc Authy, ngăn chặn 100% rủi ro bị lộ mật khẩu.",
  },
  {
    icon: Server,
    title: "Hạ Tầng Đạt Chuẩn Tier 3 Tại Việt Nam",
    desc: "Dữ liệu được lưu trữ trên các trung tâm dữ liệu tiêu chuẩn quốc tế tại Việt Nam với cơ chế sao lưu tự động đa vùng (Multi-zone backup) mỗi ngày.",
  },
  {
    icon: FileText,
    title: "Tuân Thủ Nghị Định 13/2023/NĐ-CP",
    desc: "Cam kết tuân thủ nghiêm ngặt quy định pháp luật Việt Nam về Bảo vệ Dữ liệu Cá nhân (PDPD). Tuyệt đối không chia sẻ hay bán thông tin người dùng cho bên thứ ba.",
  },
  {
    icon: EyeOff,
    title: "Quyền Riêng Tư Là Ưu Tiên Số 1",
    desc: "Chỉ duy nhất bạn có chìa khóa giải mã dữ liệu của chính mình. Đội ngũ phát triển hay quản trị viên không thể can thiệp hay đọc trộm số dư cá nhân của bạn.",
  },
  {
    icon: Building2,
    title: "Sẵn Sàng Cho Doanh Nghiệp & Kiểm Toán",
    desc: "Nhật ký truy vết (Audit logs) lưu vết mọi thao tác đăng nhập và đổi thiết bị, giúp bạn kiểm soát an ninh tối đa.",
  },
];

export default function SecurityCompliance() {
  return (
    <section id="security" className="py-24 sm:py-32 bg-slate-900 text-white relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-[700px] bg-gradient-to-r from-sky-500/10 via-emerald-500/10 to-indigo-500/10 blur-[130px] pointer-events-none" />

      <div className="relative mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-300 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            An Ninh & Pháp Lý Tiêu Chuẩn Ngân Hàng
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Tài Sản & Dữ Liệu Của Bạn Luôn Được Bảo Vệ Cao Nhất
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Chúng tôi hiểu rằng dữ liệu tài chính là điều nhạy cảm và quan trọng nhất. Halo Finance áp dụng các tiêu chuẩn an ninh mạng khắt khe tương đương với các tổ chức ngân hàng số hàng đầu thế giới.
          </p>
        </div>

        {/* 6 Security Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all duration-300"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-white mb-2 leading-snug">{sec.title}</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  {sec.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges Footer Bar */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-wrap items-center justify-around gap-6 text-center text-xs font-bold text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>256-bit SSL / TLS 1.3 Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>2-Factor Authentication Protected</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Nghị định 13/2023/NĐ-CP Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Daily Automated Cloud Backup</span>
          </div>
        </div>
      </div>
    </section>
  );
}
