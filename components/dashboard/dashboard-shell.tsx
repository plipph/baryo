
"use client";

import { ReactNode, useState } from "react";

import Link from "next/link";

import {
  LayoutDashboard,
  Store,
  Grid2x2,
  Package,
  Link2,
  Palette,
  Menu,
  X,
} from "lucide-react";

type DashboardShellProps = {
  children: ReactNode;
};

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Business",
    href: "/dashboard/business",
    icon: Store,
  },

  {
    label: "Categories",
    href: "/dashboard/categories",
    icon: Grid2x2,
  },

  {
    label: "Items",
    href: "/dashboard/items",
    icon: Package,
  },

  {
    label: "Links",
    href: "/dashboard/links",
    icon: Link2,
  },

  {
    label: "Appearance",
    href: "/dashboard/appearance",
    icon: Palette,
  },
];

export function DashboardShell({
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-xl font-black text-[#111827]">
              Listahan
            </p>

            <p className="text-xs text-stone-500">
              Dashboard
            </p>
          </div>

          <button
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* SIDEBAR */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[280px] border-r border-[#E5E7EB] bg-white transition-transform duration-300 lg:sticky lg:translate-x-0 ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            {/* BRAND */}
            <div className="border-b border-[#EFE3D4] px-6 py-7">
              <p className="text-2xl font-black text-[#111827]">
                Listahan
              </p>

              <p className="mt-1 text-sm text-stone-500">
                Business Dashboard
              </p>
            </div>

            {/* NAVIGATION */}
            <nav className="flex-1 space-y-2 overflow-y-auto p-4">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-semibold text-stone-700 transition-all hover:bg-[#F9FAFB]"
                  >
                    <Icon className="h-5 w-5" />

                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* OVERLAY */}
        {mobileOpen && (
          <button
            onClick={() =>
              setMobileOpen(false)
            }
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
        )}

        {/* CONTENT */}
        <main className="min-w-0 flex-1 px-4 py-6 md:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

