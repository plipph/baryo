import { ReactNode } from "react";

import TopNavbar from "../navigation/top-navbar";
import LeftSidebar from "../navigation/left-sidebar";
import RightSidebar from "../navigation/right-sidebar";
import { MobileBottomNav } from "../navigation/mobile-bottom-nav";
import Footer from "./footer";

type PublicLayoutProps = {
  children: ReactNode;
};

export function PublicLayout({
  children,
}: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <TopNavbar />

      <div className="mx-auto flex max-w-[1760px]">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 xl:block">
          <LeftSidebar />
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <div className="min-h-screen">{children}</div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden w-96 shrink-0 2xl:block">
          <RightSidebar />
        </aside>
      </div>

      <Footer />

      <MobileBottomNav />
    </div>
  );
}
