"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, LogIn, Store } from "lucide-react";

const links = [
  { label: "Home", href: "/", icon: Home },
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "Register", href: "/register", icon: Store },
  { label: "Login", href: "/login", icon: LogIn },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E7EB] bg-white/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_40px_-28px_rgba(17,24,39,0.55)] backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-4 gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex min-h-14 flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs font-bold transition ${
                active ? "bg-green-50 text-[#14532D]" : "text-[#6B7280]"
              }`}
            >
              <Icon className="mb-1 h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
