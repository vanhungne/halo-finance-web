import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Menu,
  PanelLeftClose,
  PanelLeft,
  Bell,
  ChevronRight,
  Bot,
  Sparkles,
  ExternalLink,
  Activity,
  CheckCircle2,
  AlertTriangle,
  User,
  Settings,
  LogOut,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { AuthContext } from "../../contexts/AuthContext";
import { aiManagementService } from "../../services/aiManagementService";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../modal/ConfirmModal";

export default function AdminHeader() {
  const { isOpen, toggle, toggleMobile, activeLabel, activeIcon } = useSidebar();
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Gateway status state
  const [gatewayStatus, setGatewayStatus] = useState({
    checking: false,
    healthy: null,
    latencyMs: null,
    model: "gemini-3.7-flash",
    message: "Chưa kiểm tra",
  });
  const [showGatewayPopover, setShowGatewayPopover] = useState(false);
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const gatewayRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Check Aggeee Gateway Status
  const checkHealth = async () => {
    setGatewayStatus((prev) => ({ ...prev, checking: true }));
    try {
      const res = await aiManagementService.checkGatewayHealth();
      setGatewayStatus({
        checking: false,
        healthy: res.healthy,
        latencyMs: res.latencyMs,
        model: res.model,
        message: res.message,
      });
    } catch {
      setGatewayStatus({
        checking: false,
        healthy: false,
        latencyMs: null,
        model: "gemini-3.7-flash",
        message: "Lỗi kết nối",
      });
    }
  };

  useEffect(() => {
    checkHealth();
    // Auto-ping every 60s
    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (gatewayRef.current && !gatewayRef.current.contains(e.target)) {
        setShowGatewayPopover(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotificationPopover(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
    navigate("/login");
  };

  const displayName = auth?.fullName || auth?.email?.split("@")[0] || "Administrator";
  const displayEmail = auth?.email || "admin@trolytaichinh.vn";
  const userInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Xác nhận đăng xuất"
        description="Bạn có chắc chắn muốn kết thúc phiên làm việc quản trị không?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        confirmColor="red"
      />

      <header className="sticky top-0 z-30 h-[72px] w-full bg-white/80 backdrop-blur-2xl border-b border-slate-200/70 shadow-[0_10px_30px_-28px_rgba(15,23,42,0.45)]">
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left section: Sidebar toggle & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Desktop Toggle Button */}
            <button
              onClick={toggle}
              title={isOpen ? "Thu gọn menu (Collapse)" : "Mở rộng menu (Expand)"}
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200/80 bg-white text-slate-500 shadow-sm hover:border-sky-200 hover:text-sky-700 hover:bg-sky-50 transition-colors"
            >
              {isOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
            </button>

            {/* Mobile Toggle Button */}
            <button
              onClick={toggleMobile}
              title="Mở menu quản trị"
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200/80 bg-white text-slate-500 shadow-sm hover:text-sky-700 hover:bg-sky-50 transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-sm font-medium min-w-0 overflow-hidden">
              <span className="text-slate-400 hidden sm:inline">Quản trị</span>
              <ChevronRight size={14} className="text-slate-300 hidden sm:inline shrink-0" />
              <div className="flex items-center gap-2 min-w-0 text-slate-900 font-bold truncate">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-50 text-sky-600 shrink-0">{activeIcon}</span>
                <span className="truncate">{activeLabel}</span>
              </div>
            </nav>
          </div>

          {/* Right section: Aggeee Status Pill, Notifications, Theme Switcher, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Aggeee Gateway Live Pill */}
            <div className="relative" ref={gatewayRef}>
              <button
                onClick={() => setShowGatewayPopover(!showGatewayPopover)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all select-none border
                  ${
                    gatewayStatus.checking
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      : gatewayStatus.healthy
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 shadow-sm shadow-emerald-500/10"
                      : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60"
                  }
                `}
              >
                <span className="relative flex h-2 w-2">
                  {gatewayStatus.healthy && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      gatewayStatus.checking
                        ? "bg-amber-400"
                        : gatewayStatus.healthy
                        ? "bg-emerald-500"
                        : "bg-rose-500"
                    }`}
                  ></span>
                </span>

                <Bot size={14} className="shrink-0 hidden xs:inline" />
                <span className="hidden md:inline">
                  {gatewayStatus.checking
                    ? "Kiểm tra Gateway..."
                    : gatewayStatus.healthy
                    ? `Aggeee: ${gatewayStatus.latencyMs}ms`
                    : "Lỗi Aggeee Cookie"}
                </span>
                <span className="md:hidden">AI</span>
              </button>

              {/* Gateway Live Status Popover */}
              {showGatewayPopover && (
                <div className="absolute right-0 mt-2 w-80 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        <Zap size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          Aggeee AI SaaS Gateway
                        </h4>
                        <a
                          href="https://aggeee.io.vn"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          aggeee.io.vn <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={checkHealth}
                      disabled={gatewayStatus.checking}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Kiểm tra lại kết nối"
                    >
                      <RefreshCw size={14} className={gatewayStatus.checking ? "animate-spin" : ""} />
                    </button>
                  </div>

                  <div className="py-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">Trạng thái:</span>
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          gatewayStatus.healthy ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {gatewayStatus.healthy ? (
                          <>
                            <CheckCircle2 size={13} /> Sẵn sàng
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={13} /> Cần nạp Cookie
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">Model hoạt động:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                        {gatewayStatus.model}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">Độ trễ phản hồi:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                        {gatewayStatus.latencyMs ? `${gatewayStatus.latencyMs} ms` : "---"}
                      </span>
                    </div>

                    <p className="mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                      {gatewayStatus.message}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setShowGatewayPopover(false);
                        navigate("/admin/ai-management");
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
                    >
                      <Bot size={14} /> Mở Trung Tâm Quản Trị AI
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Center */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotificationPopover(!showNotificationPopover)}
                title="Thông báo hệ thống"
                className="relative flex items-center justify-center w-9 h-9 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-900" />
              </button>

              {showNotificationPopover && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Bell size={16} className="text-indigo-600 dark:text-indigo-400" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Thông báo hoạt động
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      3 mới
                    </span>
                  </div>

                  <div className="py-2 divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                    <div className="py-2.5 flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 shrink-0 mt-0.5">
                        <Activity size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          AI bóc tách hóa đơn Highlands thành công
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Độ tin cậy: 98% • Trích xuất 2 mặt hàng
                        </p>
                        <span className="text-[10px] text-slate-400">2 phút trước</span>
                      </div>
                    </div>

                    <div className="py-2.5 flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 shrink-0 mt-0.5">
                        <Sparkles size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          Giao dịch SePay nạp số dư #9812
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          +500.000đ từ MBBank • Tự động kích hoạt
                        </p>
                        <span className="text-[10px] text-slate-400">15 phút trước</span>
                      </div>
                    </div>

                    <div className="py-2.5 flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/50 text-violet-600 shrink-0 mt-0.5">
                        <User size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          Tài khoản Admin đã được xác thực
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          hungse17003@gmail.com được cấp quyền Super Admin
                        </p>
                        <span className="text-[10px] text-slate-400">1 giờ trước</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-xs shadow-sm">
                  {auth?.avatar ? (
                    <img
                      src={auth.avatar}
                      alt={displayName}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    userInitials
                  )}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {displayEmail}
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Super Admin
                    </span>
                  </div>

                  <div className="py-1 text-xs">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/admin/ai-management");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Bot size={15} className="text-indigo-500" /> Quản trị & Train AI
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/admin/config");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Settings size={15} className="text-slate-400" /> Cấu hình hệ thống
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold transition-colors"
                    >
                      <LogOut size={15} /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
