
import { ReactNode } from "react";

import { DashboardSidebar } from "./components/dashboard-sidebar";

import { DashboardMobileNav } from "./components/dashboard-mobile-nav";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F7F1E8]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>

      {/* Main Layout */}
      <div className="min-w-0 flex-1">
        {/* Mobile Nav */}
        <DashboardMobileNav />

        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

