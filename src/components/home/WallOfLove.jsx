import { motion } from "framer-motion";
import { Star, MessageCircle, Heart, Users, ExternalLink, ShieldCheck } from "lucide-react";

const reviews = [
  {
    author: "Nguyễn Tuấn Anh",
    role: "Freelance Designer, Hà Nội",
    time: "2 ngày trước",
    rating: 5,
    title: "Không còn cảnh 'cháy túi' không rõ lý do",
    content:
      "Trước đây mình có tiền trong Techcombank, VPBank và ví MoMo, tháng nào cũng hết nhẵn mà không biết tiêu vào đâu. Từ khi dùng Halo Finance quản lý dòng tiền tập trung, mình cắt giảm được 30% các khoản chi lặt vặt và tháng vừa rồi đã tích lũy được 9.5 triệu!",
    tag: "Quản lý dòng tiền",
  },
  {
    author: "Trần Thị Ngọc Mai",
    role: "Kế toán Doanh nghiệp, TP.HCM",
    time: "1 tuần trước",
    rating: 5,
    title: "AI quét hóa đơn bóc tách quá thần thánh!",
    content:
      "Đi ăn liên hoan cả phòng 15 người hết hơn 6 triệu. Chỉ cần chụp ảnh hóa đơn, AI tự bóc tách từng món ăn, thuế VAT 8% và tiền giảm giá, sau đó tự chia đều cho từng bạn kèm link VietQR. Cực kỳ tiện lợi và minh bạch, không ai phải ngại ngùng!",
    tag: "AI Receipt Scanner",
  },
  {
    author: "Lê Trọng Hiếu",
    role: "Kỹ sư phần mềm & Nhà đầu tư",
    time: "2 tuần trước",
    rating: 5,
    title: "App quản lý tài sản đầu tư tốt nhất hiện nay",
    content:
      "Mình theo dõi cả vàng miếng SJC, danh mục cổ phiếu và sổ tiết kiệm 12 tháng. Halo Finance tính toán tổng tài sản ròng Net Worth và PnL thời gian thực rất chuẩn xác. Giao diện mượt mà và sang trọng, vượt trội so với các app truyền thống.",
    tag: "Tài sản đầu tư",
  },
  {
    author: "Hoàng Minh Đức",
    role: "Chủ chuỗi Cửa hàng bán lẻ",
    time: "Tháng trước",
    rating: 5,
    title: "Xuất dữ liệu Excel chuẩn chỉnh cho kế toán",
    content:
      "Tính năng xuất báo cáo Excel và PDF rất chi tiết, có thể trích xuất theo từng tháng và phân loại hạng mục thu chi rõ ràng. Mình dùng để đối soát doanh thu cá nhân và nộp kê khai thuế mà không tốn công nhập liệu thủ công.",
    tag: "Báo cáo Excel",
  },
  {
    author: "Đặng Lan Phương",
    role: "Bác sĩ Nha khoa, Đà Nẵng",
    time: "1 tháng trước",
    rating: 5,
    title: "Quỹ gia đình minh bạch, vợ chồng cùng theo dõi",
    content:
      "Vợ chồng mình dùng chung tính năng Quỹ gia đình. Cả hai cùng ghi nhận chi phí sinh hoạt, tiền học của con và tiền chợ hàng ngày. Cuối tháng nhìn vào biểu đồ là biết ngay quỹ chung còn bao nhiêu, gia đình hạnh phúc hơn hẳn!",
    tag: "Quỹ gia đình",
  },
  {
    author: "Vũ Bảo Long",
    role: "Kinh doanh tự do, Hải Phòng",
    time: "2 tháng trước",
    rating: 5,
    title: "Sổ theo dõi vay nợ cứu cánh cho người hay quên",
    content:
      "Kinh doanh hay cho bạn bè, khách hàng mượn tiền tạm. Có app ghi nhận từng đợt trả nợ, tính lãi tự động và có lịch nhắc hạn giúp mình không bao giờ bị sót khoản nợ nào. Đáng đồng tiền bát gạo!",
    tag: "Sổ Vay Nợ",
  },
];

export default function WallOfLove() {
  return (
    <section id="reviews" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-widest text-rose-600 mb-4">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            Cảm Nhận Chân Thực Của Người Dùng
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Được Hơn 2.5 Triệu Người Dùng Tin Cậy
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Xem cộng đồng nói gì về trải nghiệm làm chủ tài chính và quản lý dòng tiền thông minh mỗi ngày cùng Halo Finance.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-[#fdfdfb] p-7 shadow-[0_15px_35px_-20px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_50px_-20px_rgba(15,23,42,0.18)] hover:border-sky-200"
            >
              <div>
                {/* Header: Stars & Tag */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[0.65rem] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {rev.tag}
                  </span>
                </div>

                {/* Title & Content */}
                <h3 className="font-extrabold text-slate-900 text-base mb-2 leading-snug">
                  "{rev.title}"
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {rev.content}
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    {rev.author}
                    <ShieldCheck className="w-4 h-4 text-sky-500" title="Đã xác thực tài khoản" />
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{rev.role}</p>
                </div>
                <span className="text-xs text-slate-400 font-medium">{rev.time}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Community Banner (MISA style FB group / Support) */}
        <div className="mt-16 rounded-[2.25rem] bg-gradient-to-r from-slate-950 via-[#071328] to-slate-950 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-sky-300 mb-3">
                <Users className="w-3.5 h-3.5" />
                Cộng đồng Tài Chính Thông Minh
              </div>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Tham Gia Cùng Hơn 150.000+ Thành Viên Chia Sẻ Kinh Nghiệm
              </h3>
              <p className="mt-3 text-slate-300 text-sm sm:text-base">
                Tham gia Group Facebook và Zalo chính thức để giao lưu phương pháp quản lý dòng tiền, nhận hỗ trợ 24/7 từ đội ngũ phát triển và cập nhật tính năng mới nhất.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm transition shadow-lg shadow-sky-500/30"
              >
                Tham gia Group Facebook
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition"
              >
                Hỗ trợ qua Zalo OA
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
