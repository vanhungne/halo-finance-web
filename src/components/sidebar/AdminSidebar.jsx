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
} from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../modal/ConfirmModal";

export default function AdminSidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    setIsModalOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <Sidebar>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        title="Xác nhận đăng xuất"
        description="Bạn có chắc chắn muốn đăng xuất không?"
        confirmText="Có"
        cancelText="Không"
        confirmColor="yellow"
      />
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Hệ thống</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarItem icon={<ChartPie size={20} />} label="Tổng quan" path="/admin" />
              <SidebarItem icon={<User size={20} />} label="Người dùng" path="/admin/users" />
              <SidebarItem icon={<ScrollText size={20} />} label="Báo cáo & Hỗ trợ" path="/admin/reports" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Kinh doanh</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuSub icon={<HandCoins size={20} />} label="Doanh thu">
                <SidebarMenuSubItem icon={<HandCoins size={20} />} label="Thống kê" path="/admin/revenue" menu="Doanh thu" />
                <SidebarMenuSubItem icon={<HandCoins size={20} />} label="Lịch sử giao dịch" path="/admin/transaction" menu="Doanh thu" />
              </SidebarMenuSub>
              <SidebarItem icon={<Gem size={20} />} label="Gói dịch vụ" path="/admin/packages" />
              <SidebarItem icon={<Megaphone size={20} />} label="Quảng cáo" path="/admin/ads" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Nội dung</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuSub icon={<NotebookPen size={20} />} label="Bài viết">
                <SidebarMenuSubItem icon={<NotebookPen size={20} />} label="Danh sách" path="/admin/blogs" menu="Bài viết" />
                <SidebarMenuSubItem icon={<NotebookPen size={20} />} label="Tạo mới" path="/admin/blogs/create" menu="Bài viết" />
              </SidebarMenuSub>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Thiết lập hệ thống</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarItem icon={<Settings2 size={20} />} label="Cấu hình" path="/admin/config" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter icon={<LogOut size={20} />} label="Đăng xuất" onClick={() => setIsModalOpen(true)} />
    </Sidebar>
  );
}
