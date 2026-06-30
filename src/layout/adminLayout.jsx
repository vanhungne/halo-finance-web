import AdminSidebar from "../components/sidebar/AdminSidebar";
import AdminHeader from "../components/header/AdminHeader";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../components/ui/sidebar";
import ScrollToTop from "../components/common/ScrollToTop";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader />
          <div>
            <ScrollToTop />
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}