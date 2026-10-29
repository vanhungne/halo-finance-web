import { createContext, useContext, useState, useEffect } from "react";
import images from "../../assets/image.js";
import {
  ChartPie, ChevronDown, ChevronRight, User, ScrollText,
  HandCoins, Gem, Megaphone, NotebookPen, Settings2, Bot, Sparkles, X
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

// ---------------------- Context ----------------------
const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeLabel, setActiveLabel] = useState("Tổng quan");
  const [activeIcon, setActiveIcon] = useState(<ChartPie size={18} />);
  const location = useLocation();

  const toggle = () => setIsOpen((prev) => !prev);
  const toggleMobile = () => setIsMobileOpen((prev) => !prev);
  const closeMobile = () => setIsMobileOpen(false);

  // Map paths to labels and icons
  useEffect(() => {
    const pathMap = {
      "/admin": { label: "Tổng quan", icon: <ChartPie size={18} /> },
      "/admin/users": { label: "Người dùng", icon: <User size={18} /> },
      "/admin/reports": { label: "Báo cáo & Hỗ trợ", icon: <ScrollText size={18} /> },
      "/admin/revenue": { label: "Doanh thu / Thống kê", icon: <HandCoins size={18} /> },
      "/admin/transaction": { label: "Doanh thu / Lịch sử giao dịch", icon: <HandCoins size={18} /> },
      "/admin/packages": { label: "Gói dịch vụ", icon: <Gem size={18} /> },
      "/admin/ads": { label: "Quảng cáo", icon: <Megaphone size={18} /> },
      "/admin/blogs": { label: "Bài viết / Danh sách", icon: <NotebookPen size={18} /> },
      "/admin/blogs/create": { label: "Bài viết / Tạo mới", icon: <NotebookPen size={18} /> },
      "/admin/config": { label: "Cấu hình", icon: <Settings2 size={18} /> },
      "/admin/ai-management": { label: "Quản trị & Train AI", icon: <Bot size={18} /> },
    };

    const currentPath = location.pathname;
    const match = pathMap[currentPath];

    if (match) {
      setActiveLabel(match.label);
      setActiveIcon(match.icon);
    }

    // Auto-close mobile drawer on route change
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggle,
        isMobileOpen,
        toggleMobile,
        closeMobile,
        activeLabel,
        setActiveLabel,
        activeIcon,
        setActiveIcon,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside SidebarProvider");
  return ctx;
};

// ---------------------- Pro Sidebar Components ----------------------
export const Sidebar = ({ children }) => {
  const { isOpen, isMobileOpen, closeMobile } = useSidebar();
  const isTablet = useMediaQuery("(max-width: 1024px)");

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 lg:static flex flex-col
          bg-white/92 backdrop-blur-2xl
          border-r border-slate-200/70
          transition-all duration-300 ease-in-out shadow-[18px_0_60px_-42px_rgba(15,23,42,0.35)]
          ${
            isTablet
              ? isMobileOpen
                ? "translate-x-0 w-72"
                : "-translate-x-full lg:translate-x-0 w-20"
              : isOpen
              ? "w-72"
              : "w-20"
          }
        `}
      >
        {children}
      </aside>
    </>
  );
};

export const SidebarHeader = () => {
  const { isOpen, closeMobile } = useSidebar();
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const showFull = isOpen && !isTablet;

  return (
    <div className="h-[72px] px-4 flex items-center justify-between border-b border-slate-100 select-none">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/20 shrink-0">
          <img
            src={images.icon}
            alt="Biểu tượng Trợ Lý Tài Chính"
            className="w-6 h-6 object-contain drop-shadow"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>

        {showFull && (
          <div className="flex flex-col min-w-0 transition-opacity duration-200">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-base tracking-[-0.025em] truncate">
                Trợ Lý Tài Chính
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                ADMIN
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 truncate flex items-center gap-1">
              <Sparkles size={11} className="text-sky-500" /> Control Center
            </span>
          </div>
        )}
      </div>

      {/* Close button for mobile drawer */}
      <button
        onClick={closeMobile}
        className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export const SidebarContent = ({ children }) => {
  return (
    <div className="flex-1 overflow-y-auto px-3 py-5 space-y-5 custom-scrollbar">
      {children}
    </div>
  );
};

export const SidebarGroup = ({ children }) => {
  return <div className="space-y-1">{children}</div>;
};

export const SidebarGroupLabel = ({ children }) => {
  const { isOpen } = useSidebar();
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const showFull = isOpen && !isTablet;

  if (!showFull) {
    return <div className="h-2 w-full my-1 border-t border-slate-200/50 dark:border-slate-800/50" />;
  }

  return (
    <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
      {children}
    </div>
  );
};

export const SidebarGroupContent = ({ children }) => {
  return <div className="space-y-1">{children}</div>;
};

export const SidebarMenu = ({ children }) => {
  return <nav className="space-y-1">{children}</nav>;
};

export const SidebarItem = ({ icon, label, path, badge, isSpecial = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, setActiveLabel, setActiveIcon } = useSidebar();
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const showFull = isOpen && !isTablet;
  const isActive = location.pathname === path;

  return (
    <div
      onClick={() => {
        setActiveLabel(label);
        setActiveIcon(icon);
        navigate(path);
      }}
      title={!showFull ? label : undefined}
      className={`group relative flex items-center h-10 px-3 rounded-xl cursor-pointer transition-all duration-200 select-none
        ${
          isActive
            ? isSpecial
              ? "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white font-semibold shadow-md shadow-sky-500/20"
              : "bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold shadow-md shadow-sky-500/20"
            : "text-slate-600 hover:text-sky-700 hover:bg-sky-50/80 font-medium"
        }
        ${showFull ? "justify-start" : "justify-center"}
      `}
    >
      {/* Icon with glowing pulse if active */}
      <span className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : ""}`}>
        {icon}
      </span>

      {/* Label and Badge for expanded mode */}
      {showFull && (
        <div className="ml-3 flex-1 flex items-center justify-between overflow-hidden">
          <span className="text-sm truncate">{label}</span>
          {badge && (
            <span
              className={`ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider
                ${
                  isActive
                    ? "bg-white/20 text-white"
                    : isSpecial
                    ? "bg-sky-50 text-sky-700 border border-sky-100"
                    : "bg-amber-50 text-amber-700 border border-amber-100"
                }
              `}
            >
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Tooltip for collapsed mode */}
      {!showFull && (
        <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
          {label}
          {badge && ` (${badge})`}
        </div>
      )}
    </div>
  );
};

export const SidebarMenuSub = ({ icon, label, children, badge }) => {
  const [isDropdown, setDropdown] = useState(false);
  const location = useLocation();
  const { isOpen } = useSidebar();
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const showFull = isOpen && !isTablet;

  // Auto-expand if child path is active
  useEffect(() => {
    // If any child is active, open dropdown
  }, [location.pathname]);

  return (
    <div className="space-y-1">
      <div
        onClick={() => setDropdown(!isDropdown)}
        title={!showFull ? label : undefined}
        className={`group relative flex items-center h-10 px-3 rounded-xl cursor-pointer transition-all duration-200 select-none
          text-slate-600 hover:text-sky-700 hover:bg-sky-50/80 font-medium
          ${showFull ? "justify-between" : "justify-center"}
        `}
      >
        <div className="flex items-center min-w-0">
          <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">{icon}</span>
          {showFull && <span className="ml-3 text-sm truncate">{label}</span>}
        </div>

        {showFull && (
          <div className="flex items-center gap-1.5">
            {badge && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {badge}
              </span>
            )}
            {isDropdown ? (
              <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400 transition-transform duration-200" />
            )}
          </div>
        )}

        {/* Collapsed Tooltip */}
        {!showFull && (
          <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
            {label}
          </div>
        )}
      </div>

      {showFull && (
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isDropdown ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="ml-5 pl-3 border-l-2 border-sky-100 space-y-1 py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export const SidebarMenuSubItem = ({ icon, label, path, menu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveLabel, setActiveIcon } = useSidebar();
  const isActive = location.pathname === path;

  return (
    <div
      onClick={() => {
        setActiveLabel(`${menu} / ${label}`);
        setActiveIcon(icon);
        navigate(path);
      }}
      className={`flex items-center h-8 px-3 rounded-lg cursor-pointer transition-all duration-200 select-none text-xs font-medium
        ${
          isActive
            ? "bg-sky-50 text-sky-700 font-semibold"
            : "text-slate-500 hover:text-sky-700 hover:bg-sky-50/70"
        }
      `}
    >
      <span className="truncate">{label}</span>
    </div>
  );
};

export const SidebarFooter = ({ children }) => {
  return (
    <div className="p-3 border-t border-slate-100 bg-slate-50/65">
      {children}
    </div>
  );
};
