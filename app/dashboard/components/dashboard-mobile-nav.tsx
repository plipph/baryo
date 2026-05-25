"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { label: "Overview", href: "/dashboard" },
  { label: "Business", href: "/dashboard/business" },
  { label: "Categories", href: "/dashboard/categories" },
  { label: "Items", href: "/dashboard/items" },
  { label: "Links", href: "/dashboard/links" },
  { label: "Appearance", href: "/dashboard/appearance" },
  { label: "Settings", href: "/dashboard/settings" },
];

export function DashboardMobileNav() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-[#E7D8C5] bg-[#FFFDF9] px-4 py-4 lg:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A6A4F]">
            Listahan
          </p>

          <h1 className="text-lg font-black text-[#3D2A1E]">
            Dashboard
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-stone-300 bg-white p-2"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7D8C5] px-5 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A6A4F]">
                  Listahan
                </p>

                <h2 className="mt-1 text-xl font-black text-[#3D2A1E]">
                  Dashboard
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-stone-300 bg-white p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-1 p-4">
              {navigation.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-2xl px-4 py-3 text-sm font-semibold ${
                      active
                        ? "bg-[#596B3F] text-white"
                        : "text-stone-700 hover:bg-[#F3E7D7]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

