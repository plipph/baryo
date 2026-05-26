import { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";


import { DashboardSidebar } from "./components/dashboard-sidebar";


type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
 
return (
  <DashboardShell>
    <div className="flex min-h-screen">
      {/* Desktop Sidebar Only */}
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  </DashboardShell>
);
}


