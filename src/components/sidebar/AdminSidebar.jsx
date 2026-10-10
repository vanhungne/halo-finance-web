import React, { useContext, useState } from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarItem,
  SidebarFooter,
  useSidebar,
} from "../ui/sidebar";
import {
  ChartPie,
  User,
  HandCoins,
  Gem,
  ScrollText,
  NotebookPen,
  Megaphone,
  Settings2,
  LogOut,
  Bot,
  ShieldCheck,
} from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../modal/ConfirmModal";

export default function AdminSidebar() {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isOpen } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    setIsModalOpen(false);
    await logout();
    navigate("/login");
  };

  const displayName = auth?.fullName || auth?.email?.split("@")[0] || "Administrator";
  const displayEmail = auth?.email || "admin@trolytaichinh.vn";
  const userInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <Sidebar>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        title="Xác nhận đăng xuất"
        description="Bạn có chắc chắn muốn kết thúc phiên làm việc quản trị không?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        confirmColor="red"
      />

      <SidebarHeader />

      <SidebarContent>
        {/* Nhóm Tổng quan & AI */}
        <SidebarGroup>
          <SidebarGroupLabel>Tổng quan & AI Engine</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarItem icon={<ChartPie size={18} />} label="Tổng quan" path="/admin" />
              <SidebarItem
                icon={<Bot size={18} />}
                label="Quản trị & Train AI"
                path="/admin/ai-management"
                badge="SaaS AI"
                isSpecial={true}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Nhóm Kinh doanh */}
        <SidebarGroup>
          <SidebarGroupLabel>Kinh doanh & Tài chính</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuSub icon={<HandCoins size={18} />} label="Doanh thu">
                <SidebarMenuSubItem
                  icon={<HandCoins size={16} />}
                  label="Thống kê doanh thu"
                  path="/admin/revenue"
                  menu="Doanh thu"
                />
                <SidebarMenuSubItem
                  icon={<HandCoins size={16} />}
                  label="Lịch sử giao dịch"
                  path="/admin/transaction"
                  menu="Doanh thu"
                />
              </SidebarMenuSub>
              <SidebarItem icon={<Gem size={18} />} label="Gói dịch vụ" path="/admin/packages" badge="VIP" />
              <SidebarItem icon={<Megaphone size={18} />} label="Quảng cáo" path="/admin/ads" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Nhóm Quản trị Người dùng */}
        <SidebarGroup>
          <SidebarGroupLabel>Người dùng & Hỗ trợ</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarItem icon={<User size={18} />} label="Quản lý Người dùng" path="/admin/users" />
              <SidebarItem icon={<ScrollText size={18} />} label="Báo cáo & Hỗ trợ" path="/admin/reports" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Nhóm Nội dung & CMS */}
        <SidebarGroup>
          <SidebarGroupLabel>Nội dung & Marketing</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuSub icon={<NotebookPen size={18} />} label="Quản lý Bài viết">
                <SidebarMenuSubItem
                  icon={<NotebookPen size={16} />}
                  label="Danh sách bài viết"
                  path="/admin/blogs"
                  menu="Bài viết"
                />
                <SidebarMenuSubItem
                  icon={<NotebookPen size={16} />}
                  label="Soạn bài mới"
                  path="/admin/blogs/create"
                  menu="Bài viết"
                />
              </SidebarMenuSub>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Nhóm Cấu hình */}
        <SidebarGroup>
          <SidebarGroupLabel>Thiết lập hệ thống</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarItem icon={<Settings2 size={18} />} label="Cấu hình tham số" path="/admin/config" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: Admin Mini Profile Card */}
      <SidebarFooter>
        <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-white border border-slate-200/80 shadow-[0_8px_25px_-18px_rgba(15,23,42,0.35)] transition-all duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-bold text-xs shrink-0 shadow-sm shadow-sky-500/20">
              {auth?.avatar ? (
                <img
                  src={auth.avatar}
                  alt={displayName}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                userInitials
              )}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>

            {isOpen && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[110px]">
                    {displayName}
                  </span>
                  <ShieldCheck size={13} className="text-sky-500 shrink-0" />
                </div>
                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {displayEmail}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            title="Đăng xuất"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
