import { createContext, useContext, useState, useEffect } from "react";
import images from "../../assets/image.js";
import {
  ChartPie, ChevronDown, ChevronRight, User, ScrollText,
  HandCoins, Gem, Megaphone, NotebookPen, Settings2
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

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
  const [activeLabel, setActiveLabel] = useState("Tổng quan");
  const [activeIcon, setActiveIcon] = useState(<ChartPie size={20} />);
  const location = useLocation();
  const toggle = () => setIsOpen((prev) => !prev);

  // Map paths to labels and icons
  useEffect(() => {
    const pathMap = {
      "/admin": { label: "Tổng quan", icon: <ChartPie size={20} /> },
      "/admin/users": { label: "Người dùng", icon: <User size={20} /> },
      "/admin/reports": { label: "Báo cáo & Hỗ trợ", icon: <ScrollText size={20} /> },
      "/admin/revenue": { label: "Doanh thu / Thống kê", icon: <HandCoins size={20} /> },
      "/admin/transaction": { label: "Doanh thu / Lịch sử giao dịch", icon: <HandCoins size={20} /> },
      "/admin/packages": { label: "Gói dịch vụ", icon: <Gem size={20} /> },
      "/admin/ads": { label: "Quảng cáo", icon: <Megaphone size={20} /> },
      "/admin/blogs": { label: "Bài viết / Danh sách", icon: <NotebookPen size={20} /> },
      "/admin/blogs/create": { label: "Bài viết / Tạo mới", icon: <NotebookPen size={20} /> },
      "/admin/config": { label: "Cấu hình", icon: <Settings2 size={20} /> },
    };

    const currentPath = location.pathname;
    const match = pathMap[currentPath];

    if (match) {
      setActiveLabel(match.label);
      setActiveIcon(match.icon);
    }
  }, [location.pathname]);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, activeLabel, setActiveLabel, activeIcon, setActiveIcon }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside SidebarProvider");
  return ctx;
};

// ---------------------- Components ----------------------
export const Sidebar = ({ children }) => {
  const { isOpen } = useSidebar();
  const isMd = useMediaQuery("(max-width: 768px)");

  return (
    <aside
      className={`sticky top-0 h-screen flex flex-col bg-white text-black transition-all duration-300 border-r border-black/10
        ${isMd ? "w-20" : isOpen ? "w-64" : "w-20"}
      `}
    >
      {children}
    </aside>
  );
};

export const SidebarHeader = () => {
  const { isOpen } = useSidebar();
  const isMd = useMediaQuery("(max-width: 768px)");
  return (
    <div className="sticky p-4 font-bold text-lg flex justify-center">
      <img
        src={(isOpen && !isMd) ? images.logo : images.icon}
        alt="Trợ Lý Tài Chính"
        className="w-auto" />
    </div>
  );
};

export const SidebarContent = ({ children }) => {
  return (
    <div className="flex-1 h-full overflow-y-auto">
      <nav className="flex-1">{children}</nav>
    </div>
  );
};

export const SidebarGroup = ({ children }) => {
  const { isOpen } = useSidebar();
  const isMd = useMediaQuery("(max-width: 768px)");
  return <div className={`${(isOpen && !isMd) ? "mb-4" : ""}`}>{children}</div>;
};

export const SidebarGroupLabel = ({ children }) => {
  const { isOpen } = useSidebar();
  const isMd = useMediaQuery("(max-width: 768px)");
  if (!isOpen || isMd) {
    return null;
  }
  return (
    <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-900">
      {children}
    </div>
  );
};

export const SidebarGroupContent = ({ children }) => {
  return <div className="space-y-1 mt-1">{children}</div>;
};

export const SidebarMenu = ({ children }) => {
  return <nav className="px-2">{children}</nav>;
};

export const SidebarMenuSub = ({ icon, label, children }) => {
  const [isDropdown, setDropdown] = useState(false);
  const { isOpen } = useSidebar();
  const isMd = useMediaQuery("(max-width: 768px)");
  const showLabel = isOpen && !isMd;

  return (
    <div title={label}>
      <div
        onClick={() => setDropdown(!isDropdown)}
        className={`flex p-2 px-4 items-center cursor-pointer select-none rounded-3xl hover:bg-black/10 transition-colors duration-300
          ${showLabel ? "justify-between" : "justify-center"}`}
      >
        <div className="flex items-center">
          {icon}
          {showLabel && (
            <span
              className="overflow-hidden whitespace-nowrap transition-all duration-300
              opacity-100 w-auto ml-2">
              {label}
            </span>
          )}
        </div>
        {showLabel &&
          (isDropdown ? (
            <ChevronDown className="w-4 h-4 transition-transform duration-200" />
          ) : (
            <ChevronRight className="w-4 h-4 transition-transform duration-200" />
          ))}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${isDropdown ? "max-h-[999px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="border-l-2 border-gray-300 ml-6">{children}</div>
      </div>
    </div>
  );
};

export const SidebarMenuSubItem = ({ icon, label, path, menu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, setActiveLabel, setActiveIcon } = useSidebar();
  const isMd = useMediaQuery("(max-width: 768px)");
  const isActive = location.pathname === path;

  const showLabel = isOpen && !isMd;
  if (!showLabel) {
    return null;
  }
  return (
    <div
      onClick={() => {
        setActiveLabel(`${menu} / ${label}`);
        setActiveIcon(icon);
        navigate(path);
      }}
      className={`flex items-center my-1 p-2 px-4 rounded-3xl cursor-pointer hover:bg-black/10 transition-colors duration-300
        ${isActive ? "bg-black/5 font-medium" : ""}
        ${showLabel ? "opacity-100 w-auto ml-2" : "opacity-0 w-0 ml-0 h-0"}
      `}
    >
      <span className="overflow-hidden whitespace-nowrap transition-all duration-300">
        {label}
      </span>
    </div>
  );
};

export const SidebarItem = ({ icon, label, path }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, setActiveLabel, setActiveIcon } = useSidebar();
  const isMd = useMediaQuery("(max-width: 768px)");
  const isActive = location.pathname === path;

  const showLabel = isOpen && !isMd;

  return (
    <div
      onClick={() => {
        setActiveLabel(label);
        setActiveIcon(icon);
        navigate(path);
      }}
      className={`flex items-center my-1 p-2 px-4 rounded-3xl cursor-pointer hover:bg-black/10 transition-colors duration-300
        ${isActive ? "bg-black/5 font-medium" : ""}
        ${showLabel ? "justify-start" : "justify-center"}
      `}
      title={label}
    >
      {icon}
      <span
        className={`overflow-hidden whitespace-nowrap transition-all duration-300
          ${showLabel ? "opacity-100 w-auto ml-2" : "opacity-0 w-0 ml-0"}
        `}
      >
        {label}
      </span>
    </div>
  );
};

export const SidebarFooter = ({ icon, label, onClick }) => {
  const { isOpen } = useSidebar();
  const isMd = useMediaQuery("(max-width: 768px)");
  const showLabel = isOpen && !isMd;

  return (
    <div className="sticky bottom-0 left-0 w-full bg-white">
      <div
        onClick={onClick}
        className={`flex items-center p-3 border-t border-black/10 
                    hover:bg-black/10 transition-all duration-300 cursor-pointer
                    ${showLabel ? "justify-start px-4" : "justify-center"}
        `}
      >
        {icon && <span className="flex items-center">{icon}</span>}
        <span
          className={`text-sm font-medium transition-all duration-300 overflow-hidden whitespace-nowrap
                      ${showLabel ? "opacity-100 w-auto ml-2" : "opacity-0 w-0 ml-0"}
          `}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

