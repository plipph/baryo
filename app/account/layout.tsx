import { ReactNode } from "react";

import { DashboardSidebar } from "@/app/dashboard/components/dashboard-sidebar";
import { DashboardMobileNav } from "@/app/dashboard/components/dashboard-mobile-nav";

type AccountLayoutProps = {
  children: ReactNode;
};

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#FAF7F2] text-[#111827]">
      <div className="hidden lg:block">
        <DashboardSidebar hasBusiness={false} />
      </div>

      <div className="min-w-0 flex-1">
        <DashboardMobileNav hasBusiness={false} />
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
