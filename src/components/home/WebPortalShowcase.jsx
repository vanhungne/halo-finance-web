import { motion } from "framer-motion";
import {
  Laptop,
  Smartphone,
  ShieldCheck,
  FileSpreadsheet,
  Users,
  LineChart,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Wallet,
  TrendingUp,
  Receipt,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WebPortalShowcase() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white py-24 sm:py-32 border-t border-slate-200/80">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[900px] bg-gradient-to-tr from-blue-500/5 via-sky-500/5 to-transparent blur-[140px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-700 mb-4 shadow-2xs">
            <Laptop className="w-4 h-4 text-blue-600" />
            Hệ Sinh Thái Đa Nền Tảng • Web Portal & Mobile App
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Quản Trị Tài Chính Không Giới Hạn{" "}
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Trên Màn Hình Lớn
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Không chỉ gói gọn trên chiếc điện thoại di động. Trợ Lý Tài Chính cung cấp Cổng Web Internet Banking chuyên nghiệp dành cho máy tính, giúp bạn làm chủ dòng tiền, phân tích đa chiều và xuất dữ liệu kế toán chuẩn mực.
          </p>
        </div>

        {/* 3 Pillars Comparison Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 mb-5">
              <LineChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Báo Cáo Dòng Tiền 360°</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Xem biểu đồ thu chi đa chiều theo tuần, tháng và quý. So sánh tốc độ tăng trưởng tài sản ròng Net Worth và phát hiện ngay những nguồn rò rỉ ngân sách.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 mb-5">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Xuất Dữ Liệu Excel / PDF Thuế</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Trích xuất toàn bộ sổ quỹ, danh mục hóa đơn VAT điện tử và nhật ký giao dịch sang định dạng Excel/PDF chuẩn kế toán chỉ với 1 cú click chuột.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-50 text-purple-600 mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Phân Quyền Thành Viên</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Thiết lập quyền quản trị linh hoạt cho vợ chồng trong gia đình hoặc phân quyền kế toán, thủ quỹ ghi chép thu chi cho cửa hàng kinh doanh.
            </p>
          </div>
        </div>

        {/* Grand Desktop Portal Mockup Chassis */}
        <div className="mt-14 overflow-hidden rounded-[2.5rem] border border-slate-200/90 bg-white shadow-2xl shadow-slate-300/60 p-4 sm:p-8">
          
          {/* Browser Window Chrome Topbar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <div className="ml-4 hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 text-xs font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>https://portal.trolytaichinh.vn/dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase">
                Bảo Mật TLS 1.3 Chuẩn Ngân Hàng
              </span>
              <a
                href="#free-commitment"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition"
              >
                <span>Trải Nghiệm Miễn Phí 100%</span>
                <Sparkles className="w-3.5 h-3.5" />
              </a>

            </div>
          </div>

          {/* Desktop Portal Screen Body */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Sidebar Preview */}
            <div className="hidden lg:block lg:col-span-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 p-4 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white font-black text-xs">
                  TL
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 leading-tight">Cổng Web Tài Chính</p>
                  <p className="text-[10px] text-slate-500 font-medium">Bản Doanh Nghiệp & Cá Nhân</p>
                </div>
              </div>

              <div className="space-y-1 text-xs font-bold text-slate-700">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-between shadow-2xs">
                  <span>Tổng quan tài sản</span>
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                </div>
                <div className="p-2.5 rounded-xl text-slate-600 hover:bg-white transition flex items-center justify-between">
                  <span>Sổ quỹ đa tài khoản</span>
                </div>
                <div className="p-2.5 rounded-xl text-slate-600 hover:bg-white transition flex items-center justify-between">
                  <span>Kho hóa đơn AI Vision</span>
                </div>
                <div className="p-2.5 rounded-xl text-slate-600 hover:bg-white transition flex items-center justify-between">
                  <span>Sổ nợ & Lịch thanh toán</span>
                </div>
                <div className="p-2.5 rounded-xl text-slate-600 hover:bg-white transition flex items-center justify-between">
                  <span>Báo cáo thuế & Kế toán</span>
                </div>
              </div>
            </div>

            {/* Main Dashboard Canvas */}
            <div className="lg:col-span-9 space-y-5">
              
              {/* Stat Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">Tổng tài sản ròng Net Worth</span>
                  <p className="text-2xl font-black mt-1">1.845.200.000 đ</p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-100 font-medium">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
                    <span>+12.4% so với quý trước</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Dòng tiền thu tháng 10</span>
                  <p className="text-2xl font-black text-emerald-600 mt-1">+92.500.000 đ</p>
                  <span className="text-[11px] text-slate-500 mt-1 block">Tự động đồng bộ từ 3 tài khoản VCB & TCB</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Chi tiêu & Hạn mức</span>
                  <p className="text-2xl font-black text-rose-600 mt-1">-34.120.000 đ</p>
                  <span className="text-[11px] text-slate-500 mt-1 block">Còn 63% hạn mức ngân sách an toàn</span>
                </div>
              </div>

              {/* Connected Bank Accounts Strip */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-extrabold uppercase tracking-wider text-slate-700">Tài khoản ngân hàng liên kết trực tiếp</span>
                  <span className="text-blue-600 font-bold">NAPAS 24/7 Đồng bộ tức thì</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center shadow-2xs">
                    <div>
                      <p className="font-extrabold text-slate-900">Vietcombank • 9823</p>
                      <p className="text-[10px] text-slate-500">Tài khoản chi tiêu chính</p>
                    </div>
                    <span className="font-black text-slate-900">142.500.000 đ</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center shadow-2xs">
                    <div>
                      <p className="font-extrabold text-slate-900">Techcombank • 1029</p>
                      <p className="text-[10px] text-slate-500">Quỹ khẩn cấp sinh lời</p>
                    </div>
                    <span className="font-black text-slate-900">85.000.000 đ</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center shadow-2xs">
                    <div>
                      <p className="font-extrabold text-slate-900">Sổ Vàng SJC • 12 Lượng</p>
                      <p className="text-[10px] text-slate-500">Định giá thị trường hôm nay</p>
                    </div>
                    <span className="font-black text-amber-700">1.038.000.000 đ</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
