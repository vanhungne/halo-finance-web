import React from "react";
import AdminSidebar from "../components/sidebar/AdminSidebar";
import AdminHeader from "../components/header/AdminHeader";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../components/ui/sidebar";
import { ThemeProvider } from "../contexts/ThemeContext";
import ScrollToTop from "../components/common/ScrollToTop";

export default function AdminLayout() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="admin-shell min-h-screen bg-[#f4f8fc] text-slate-900 flex">
          {/* Smart Sidebar */}
          <AdminSidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
              <div className="absolute -top-52 right-[8%] h-[32rem] w-[32rem] rounded-full bg-sky-200/35 blur-3xl" />
              <div className="absolute top-[38%] left-[18%] h-80 w-80 rounded-full bg-cyan-100/45 blur-3xl" />
              <div className="absolute bottom-[-12rem] right-[18%] h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
              <div className="admin-light-grid absolute inset-0 opacity-50" />
            </div>

            {/* Executive Header */}
            <AdminHeader />

            {/* Page Outlet */}
            <main className="flex-1 relative z-10 p-4 sm:p-6 lg:p-8 xl:p-10 max-w-[1680px] w-full mx-auto">
              <ScrollToTop />
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
