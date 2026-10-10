import images from "../../assets/image.js";
import { useNavigate, useLocation } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <header className="bg-white sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={images.logo} alt="Trợ Lý Tài Chính" className="h-7 w-auto" />
        </div>
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium text-gray-700">
            <li><a href="#" className="hover:text-black">Trang chủ</a></li>
            <li><a href="#" className="hover:text-black">Về chúng tôi</a></li>
            <li><a href="#" className="hover:text-black">Bảng giá</a></li>
            <li><a href="#" className="hover:text-black">Tính năng</a></li>
          </ul>
        </nav>
        <div className="flex items-center">
          <button onClick={() => navigate('/login')} className="px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50">Đăng nhập</button>
        </div>
      </div>
    </header>
  );
}

export default Header;


