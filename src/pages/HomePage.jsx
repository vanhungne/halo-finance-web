import images from "../assets/image.js";
import AccordionItem from "../components/faq/AccordionItem.jsx";
import Header from "../components/header/headerComp.jsx";
import Footer from "../components/footer/Footer.jsx";

function HomePage() {
  const faqItems = [
    {
      q: "Trợ Lý Tài Chính có miễn phí không?",
      a: "Trợ Lý Tài Chính có phiên bản miễn phí với tính năng cơ bản. Bạn có thể nâng cấp Premium để trải nghiệm đầy đủ hơn.",
    },
    {
      q: "Có dùng được khi không có internet?",
      a: "Bạn có thể ghi chép khi offline. Dữ liệu sẽ tự đồng bộ khi có mạng trở lại.",
    },
    {
      q: "Làm sao theo dõi chi tiêu theo danh mục?",
      a: "Trợ Lý Tài Chính tự nhóm giao dịch theo danh mục và hiển thị biểu đồ rõ ràng, dễ hiểu.",
    },
    {
      q: "Có xuất dữ liệu ra CSV/Google Sheet không?",
      a: "Chỉ vài thao tác trong phần Cài đặt là bạn có thể xuất/nhập dữ liệu tiện lợi.",
    },
    {
      q: "Trợ Lý Tài Chính có hỗ trợ nhiều loại tiền tệ?",
      a: "Có. Bạn có thể chọn loại tiền ưa thích để theo dõi chi tiêu phù hợp.",
    },
  ];
  return (
    <>
      <Header />
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-5 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="uppercase tracking-[0.25em] text-gray-500 text-sm">
              Tối ưu tài chính
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Đưa Ra Quyết Định Tài Chính Tốt Nhất
            </h1>
            <p className="mt-6 text-gray-600 max-w-xl">
              Công cụ quản lý chi tiêu mạnh mẽ giúp bạn kiểm soát ngân sách,
              theo dõi thu chi và tiết kiệm thông minh.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button className="px-6 py-3 rounded-md bg-black text-white hover:bg-gray-900 transition">
                Tải xuống
              </button>
              <button className="px-6 py-3 rounded-md border border-gray-300 hover:bg-gray-50 transition">
                Xem video
              </button>
            </div>
          </div>
          <div className="relative">
            <img
              src={images.hero}
              alt="Xem trước ứng dụng"
              className="w-full max-w-xl mx-auto drop-shadow-2xl rounded-2xl"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-1 lg:order-1">
            <img
              src={images.premium}
              alt="Tính năng Premium"
              className="w-full max-w-xl mx-auto drop-shadow-2xl rounded-2xl"
            />
          </div>
          <div className="order-2 lg:order-2">
            <p className="uppercase tracking-[0.25em] text-rose-500 text-sm">
              Tính năng
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold">
              Trợ Lý Tài Chính Premium
            </h2>
            <ul className="mt-6 space-y-6 text-gray-700">
              <li className="flex gap-4">
                <span className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600 font-semibold">
                  1
                </span>
                <div>
                  <h3 className="font-semibold text-lg">
                    Khoảng thời gian ngân sách
                  </h3>
                  <p className="mt-1 text-gray-600">
                    Dễ dàng đặt ngân sách theo tuần/tháng/quý và theo dõi mức sử
                    dụng theo thời gian.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600 font-semibold">
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-lg">Phân tích chi tiết</h3>
                  <p className="mt-1 text-gray-600">
                    Theo dõi chi tiêu và thu nhập bằng biểu đồ trực quan và các
                    chỉ số hữu ích.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600 font-semibold">
                  3
                </span>
                <div>
                  <h3 className="font-semibold text-lg">
                    Thông báo thông minh
                  </h3>
                  <p className="mt-1 text-gray-600">
                    Không bỏ lỡ hóa đơn hay gia hạn gói nhờ nhắc nhở chính xác
                    và kịp thời.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="uppercase tracking-[0.25em] text-rose-500 text-sm">
              Ưu điểm
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold">
              Vì sao chọn Trợ Lý Tài Chính?
            </h2>
            <div className="mt-6 space-y-6">
              <div className="flex gap-4">
                <span className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
                  🔔
                </span>
                <div>
                  <h3 className="font-semibold text-lg">
                    Thông báo thông minh
                  </h3>
                  <p className="mt-1 text-gray-600">
                    Nhắc nhở chi tiêu, hóa đơn và mục tiêu tiết kiệm được cá
                    nhân hóa cho bạn.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
                  ⚙️
                </span>
                <div>
                  <h3 className="font-semibold text-lg">Tùy biến linh hoạt</h3>
                  <p className="mt-1 text-gray-600">
                    Tùy chỉnh danh mục, ngân sách và cảnh báo để phù hợp thói
                    quen của bạn.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src={images.customize}
              alt="Vì sao chọn"
              className="w-full max-w-xl mx-auto drop-shadow-2xl rounded-2xl"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
            <img
              src={images.feedback}
              alt="Hình minh họa đánh giá"
              className="w-full max-w-xl mx-auto drop-shadow-2xl rounded-2xl"
            />
          </div>
          <div>
            <p className="uppercase tracking-[0.25em] text-gray-500 text-sm">
              Đánh giá
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold">
              Người dùng nói gì về chúng tôi?
            </h2>
            <p className="mt-6 text-gray-600 max-w-xl">
              “Ứng dụng rất dễ sử dụng, biểu đồ đẹp và nhắc nhở cực kỳ hữu ích.
              Tôi đã kiểm soát chi tiêu tốt hơn chỉ sau vài tuần.”
            </p>
            <div className="mt-6">
              <p className="font-semibold">Nick Jonas</p>
            </div>
          </div>
          
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <p className="uppercase tracking-[0.25em] text-rose-500 text-sm">Câu hỏi thường gặp</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold">Những câu hỏi phổ biến</h2>
              <div className="mt-8 space-y-4">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} index={index} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 p-10">
              <img src={images.question} alt="Câu hỏi" className="h-40 w-40 object-contain drop-shadow-xl" />
              <h3 className="mt-8 text-2xl font-extrabold">Bạn còn thắc mắc?</h3>
              <p className="mt-2 text-gray-600 text-center max-w-sm">Hãy để lại câu hỏi, chúng tôi sẽ phản hồi sớm nhất.</p>
              <div className="mt-6 w-full max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nhắn cho Trợ Lý Tài Chính</label>
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="Nhập câu hỏi của bạn" className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" />
                  <button className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900">Gửi</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="relative overflow-hidden rounded-2xl border border-blue-400/60">
            <img
              src={images.ready}
              alt="Hình nền CTA"
              className="w-full h-[360px] sm:h-[420px] lg:h-[440px] object-cover"
            />
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 sm:px-12 lg:px-16 text-white">
                <h2 className="text-3xl sm:text-4xl font-extrabold">
                  Sẵn sàng để bắt đầu?
                </h2>
                <p className="mt-3 max-w-xl text-white/80">
                  Khởi tạo thói quen tài chính lành mạnh ngay hôm nay cùng
                  Trợ Lý Tài Chính.
                </p>
                <button className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white text-black hover:bg-gray-100 transition">
                  Tải xuống
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default HomePage;
