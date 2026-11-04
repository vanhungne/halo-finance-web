import { Quote, Star } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import "./userReviews.css";

const reviews = [
  {
    author: "Nguyễn Tuấn Anh",
    role: "Freelance Designer, Hà Nội",
    time: "2 ngày trước",
    rating: 5,
    title: "Không còn cảnh 'cháy túi' không rõ lý do",
    content:
      "Trước đây mình có tiền trong Techcombank, VPBank và ví MoMo, tháng nào cũng hết nhẵn mà không biết tiêu vào đâu. Từ khi dùng Trợ Lý Tài Chính quản lý dòng tiền tập trung, mình cắt giảm được 30% các khoản chi lặt vặt và tháng vừa rồi đã tích lũy được 9.5 triệu!",
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
      "Mình theo dõi cả vàng miếng SJC, danh mục cổ phiếu và sổ tiết kiệm 12 tháng. Trợ Lý Tài Chính tính toán tổng tài sản ròng Net Worth và PnL thời gian thực rất chuẩn xác. Giao diện mượt mà và sang trọng, vượt trội so với các app truyền thống.",
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
  const { isEnglish } = useLanguage();

  return (
    <section id="reviews" className="user-reviews border-t border-slate-200/80" aria-labelledby="user-reviews-title">
      <div className="user-reviews__container">
        <div className="user-reviews__heading">
          <h2 id="user-reviews-title" className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight text-slate-950 title-3d">
            {isEnglish ? "Thoughts on Trợ Lý Tài Chính" : "Cảm nhận về Trợ Lý Tài Chính"}
          </h2>
          <p className="user-reviews__notice">{isEnglish ? "Sample reviews for this interface. These are not verified testimonials." : "Nội dung nhận xét minh họa giao diện, chưa phải phản hồi được xác thực."}</p>
        </div>

        <ul className="user-reviews__grid">
          {reviews.map((review, index) => (
            <li key={review.author} className="review-note">
              <article aria-labelledby={`review-${index}`}>
                <div className="review-note__top">
                  <div className="review-note__rating" role="img" aria-label={isEnglish ? `${review.rating} out of 5 stars (sample)` : `${review.rating} trên 5 sao (minh họa)`}>
                    {Array.from({ length: 5 }, (_, starIndex) => (
                      <Star key={starIndex} className={starIndex < review.rating ? "review-note__star review-note__star--filled" : "review-note__star"} aria-hidden="true" />
                    ))}
                  </div>
                  <Quote className="review-note__quote" aria-hidden="true" />
                </div>
                <h3 id={`review-${index}`} className="review-note__title">{review.title}</h3>
                <blockquote className="review-note__content">
                  <p className="review-note__body">{review.content}</p>
                </blockquote>
                <footer className="review-note__author">
                  <p className="review-note__name">{review.author}</p>
                  <p className="review-note__role">{review.role}</p>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

