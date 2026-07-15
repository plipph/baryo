import { ReactNode } from "react";

import { DashboardSidebar } from "@/app/dashboard/components/dashboard-sidebar";
import { DashboardMobileNav } from "@/app/dashboard/components/dashboard-mobile-nav";
import { getAccountContext } from "@/lib/account-context";

type AccountShellProps = {
  children: ReactNode;
};

export async function AccountShell({ children }: AccountShellProps) {
  const { business } = await getAccountContext();

  return (
    <div className="flex min-h-screen bg-[#FAF7F2] text-[#111827]">
      <div className="hidden lg:block">
        <DashboardSidebar hasBusiness={!!business} />
      </div>

      <div className="min-w-0 flex-1">
        <DashboardMobileNav hasBusiness={!!business} />
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
