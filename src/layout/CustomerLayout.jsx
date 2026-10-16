import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ScanLine,
  Users2,
  TrendingUp,
  HandCoins,
  PiggyBank,
  FileSpreadsheet,
  ShieldCheck,
  Bell,
  Search,
  Plus,
  QrCode,
  ArrowUpRight,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Eye,
  EyeOff,
  User,
  CreditCard,
  Building,
} from "lucide-react";
import images from "../assets/image";

const NAV_ITEMS = [
  { label: "Tổng Quan 360°", icon: LayoutDashboard, path: "/app" },
  { label: "Tài Khoản & Ví", icon: Wallet, path: "/app/wallets" },
  { label: "AI Quét Hóa Đơn", icon: ScanLine, path: "/app/receipt-ai", badge: "AI v2" },
  { label: "Quỹ Nhóm & Gia Đình", icon: Users2, path: "/app/group-fund" },
  { label: "Tài Sản Đầu Tư", icon: TrendingUp, path: "/app/investments" },
  { label: "Sổ Vay Nợ", icon: HandCoins, path: "/app/debts" },
  { label: "Sổ Tiết Kiệm", icon: PiggyBank, path: "/app/savings" },
  { label: "Báo Cáo Kế Toán", icon: FileSpreadsheet, path: "/app/reports" },
  { label: "Bảo Mật & 2FA", icon: ShieldCheck, path: "/app/security" },
];

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { title: "Lương tháng 10", desc: "+ 38.500.000 đ từ Công ty CP Công Nghệ ABC", time: "10 phút trước", unread: true },
    { title: "Quỹ Gia Đình Nhỏ", desc: "Lan Phương đã đóng góp 5.000.000 đ vào quỹ chung", time: "2 giờ trước", unread: true },
    { title: "AI Quét Hóa Đơn", desc: "Bóc tách thành công hóa đơn WinMart 277.560 đ", time: "Hôm qua", unread: false },
    { title: "Nhắc nhở đáo hạn", desc: "Sổ tiết kiệm BIDV 12 tháng sắp đến hạn tái tục", time: "2 ngày trước", unread: false },
  ];

  return (
    <div className="min-h-screen bg-[#090e17] text-slate-100 flex flex-col font-sans">
      {/* Top Internet Banking Navbar */}
      <header className="sticky top-0 z-40 h-20 border-b border-slate-800 bg-[#0d1424]/90 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between">
        {/* Left: Brand & Mobile Menu toggle */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="lg:hidden grid h-10 w-10 place-items-center rounded-xl bg-slate-800/80 text-slate-200"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <a href="/" className="flex items-center gap-3">
            <img src={images.logo} alt="Halo Finance" className="h-9 w-auto" />
            <div className="hidden sm:block">
              <span className="block text-[0.65rem] font-extrabold uppercase tracking-widest text-sky-400">
                Internet Banking & Wealth Hub
              </span>
              <span className="block text-sm font-black text-white">Khách Hàng Cá Nhân</span>
            </div>
          </a>
        </div>

        {/* Middle: Net Worth Quick Pill (Desktop) */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-xs text-slate-400 font-semibold">Tổng tài sản ròng:</span>
          <span className="text-sm font-black text-emerald-400">
            {hideBalance ? "•••••••••• đ" : "267.900.000 đ"}
          </span>
          <button
            type="button"
            onClick={() => setHideBalance(!hideBalance)}
            className="text-slate-400 hover:text-white transition"
            title={hideBalance ? "Hiện số dư" : "Ẩn số dư"}
          >
            {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Right: Quick actions, notifications, user avatar */}
        <div className="flex items-center gap-3">
          {/* Back to Home Portal */}
          <a
            href="/"
            className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition"
          >
            Trang chủ Portal
          </a>

          {/* Quick Transfer Button */}
          <button
            type="button"
            onClick={() => alert("Mở modal tạo lệnh chuyển tiền nhanh VietQR NAPAS 24/7")}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold text-xs shadow-lg shadow-sky-500/25 hover:opacity-95 transition"
          >
            <QrCode className="w-4 h-4" />
            <span>Chuyển tiền VietQR</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative grid h-10 w-10 place-items-center rounded-xl bg-slate-800/80 text-slate-200 hover:bg-slate-700 transition"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-slate-900 animate-pulse" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <span className="font-extrabold text-white text-sm">Thông Báo Biến Động</span>
                  <span className="text-[0.65rem] text-sky-400 font-bold cursor-pointer">Đánh dấu đã đọc</span>
                </div>
                <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto mt-2">
                  {notifications.map((n, i) => (
                    <div key={i} className="py-2.5 hover:bg-white/5 px-2 rounded-xl transition cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{n.title}</span>
                        <span className="text-[0.65rem] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-slate-400 mt-1 text-[0.72rem] leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User profile capsule */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-600 text-slate-950 font-black text-sm shadow-md">
              H
            </div>
            <div className="hidden lg:block text-left text-xs">
              <span className="block font-extrabold text-white">Nguyễn Tuấn Hùng</span>
              <span className="block text-[0.65rem] text-sky-400 font-semibold">Tài khoản Premium VIP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Shell (Sidebar + Content) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 top-20 z-30 w-64 bg-[#0a0f1d] border-r border-slate-800/80 p-4 flex flex-col justify-between transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Nav links */}
          <nav className="space-y-1.5 overflow-y-auto">
            <div className="px-3 pb-2 text-[0.65rem] font-extrabold uppercase tracking-widest text-slate-500">
              Phân Hệ Quản Lý
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === "/app" && location.pathname === "/app/");
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  type="button"
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-sky-500/20 to-blue-600/20 border border-sky-500/30 text-sky-300 shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-sky-400" : "text-slate-500"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[0.6rem] font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Card: Security Status */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Bảo Mật Cấp Ngân Hàng</span>
              </div>
              <p className="text-[0.65rem] text-slate-500 leading-relaxed">
                Phiên làm việc được mã hóa TLS 1.3 với chứng chỉ số SSL an toàn.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất phiên làm việc</span>
            </button>
          </div>
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8 xl:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
