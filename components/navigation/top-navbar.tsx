"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Store } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Discover", href: "/discover" },
  { label: "Login", href: "/login" },
];

export default function TopNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E7EB]/80 bg-[#FAF7F2]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1760px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#14532D] text-white shadow-[0_18px_30px_-20px_rgba(20,83,45,0.9)]">
            <Store className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-black leading-none tracking-tight text-[#111827]">
              MyNegosyo
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#16A34A]">
              Mindoro
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  active
                    ? "bg-white text-[#14532D] shadow-sm"
                    : "text-[#6B7280] hover:bg-white hover:text-[#111827]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/discover"
            className="hidden h-11 w-11 items-center justify-center rounded-full bg-white text-[#14532D] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex"
            aria-label="Search businesses"
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#14532D] shadow-sm md:hidden"
            aria-label="Open menu"
            type="button"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
