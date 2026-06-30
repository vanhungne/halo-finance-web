import images from "../../assets/image.js";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <img src={images.logo} alt="ViNance" className="h-7 w-auto" />
            <div className="mt-6 space-y-3 text-sm text-gray-700">
              <p className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600">✉️</span>{" "}
                Help@vinance.com
              </p>
              <p className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600">📞</span>{" "}
                +1234 456 678 89
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg">Liên kết</h4>
            <ul className="mt-4 space-y-3 text-gray-700 text-sm">
              <li><a href="#" className="hover:text-black">Trang chủ</a></li>
              <li><a href="#" className="hover:text-black">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-black">Đặt lịch</a></li>
              <li><a href="#" className="hover:text-black">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg">Pháp lý</h4>
            <ul className="mt-4 space-y-3 text-gray-700 text-sm">
              <li><a href="#" className="hover:text-black">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-black">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-black">Chính sách cookie</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg">Sản phẩm</h4>
            <ul className="mt-4 space-y-3 text-gray-700 text-sm">
              <li><a href="#" className="hover:text-black">Tham quan</a></li>
              <li><a href="#" className="hover:text-black">Hỗ trợ trực tuyến</a></li>
              <li><a href="#" className="hover:text-black">Đánh giá</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg">Bản tin</h4>
            <p className="mt-4 text-sm text-gray-600">Cập nhật mới nhất</p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-black text-white px-4 py-2 text-sm hover:bg-gray-900">Tải trên Google Play</button>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-100 pt-6 text-center text-sm text-gray-600">
          Bản quyền © 2025 ViNance. Tất cả các quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}

export default Footer;

