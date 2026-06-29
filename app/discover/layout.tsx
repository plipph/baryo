import { ReactNode } from "react";
import { DiscoverHeader } from "./components/discover-header";

export default function DiscoverLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F1E8]">
      <DiscoverHeader />

      {children}
    </div>
  );
}