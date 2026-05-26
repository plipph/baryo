
"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  Menu,
  X,
  LayoutDashboard,
  Building2,
  FolderKanban,
  Package,
  Link2,
  Palette,
  Settings,
  ChartBar,
} from "lucide-react";

import { useState } from "react";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Business",
    href: "/dashboard/business",
    icon: Building2,
  },
  {
    label: "Categories",
    href: "/dashboard/categories",
    icon: FolderKanban,
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
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: ChartBar,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardMobileNav() {
  const pathname =
    usePathname();

  const [open, setOpen] =
    useState(false);

  return (
    <>
      {/* TOP BAR */}
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
          onClick={() =>
            setOpen(true)
          }
          className="rounded-2xl border border-stone-300 bg-white p-2 shadow-sm"
        >
          <Menu className="h-5 w-5 text-[#3D2A1E]" />
        </button>
      </div>

      {/* DRAWER */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden">
          <div className="absolute left-0 top-0 flex h-full w-80 flex-col bg-[#FFFDF9] shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-[#E7D8C5] px-5 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A6A4F]">
                  Listahan
                </p>

                <h2 className="mt-1 text-2xl font-black text-[#3D2A1E]">
                  Business Hub
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-2xl border border-stone-300 bg-white p-2 shadow-sm"
              >
                <X className="h-5 w-5 text-[#3D2A1E]" />
              </button>
            </div>

            {/* NAV */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              {navigation.map(
                (item) => {
                  const Icon =
                    item.icon;

                  const active =
                    pathname ===
                      item.href ||
                    (item.href !==
                      "/dashboard" &&
                      pathname.startsWith(
                        item.href
                      ));

                  return (
                    <Link
                      key={
                        item.href
                      }
                      href={
                        item.href
                      }
                      onClick={() =>
                        setOpen(
                          false
                        )
                      }
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                        active
                          ? "bg-[#596B3F] text-white shadow-md"
                          : "text-stone-700 hover:bg-[#F3E7D7]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />

                      <span>
                        {
                          item.label
                        }
                      </span>
                    </Link>
                  );
                }
              )}
            </nav>

            {/* FOOTER */}
            <div className="border-t border-[#E7D8C5] p-4">
              <div className="rounded-2xl bg-[#F3E7D7] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A6A4F]">
                  Current Plan
                </p>

                <p className="mt-2 text-lg font-bold text-[#3D2A1E]">
                  Libre
                </p>

                <p className="mt-1 text-sm text-stone-600">
                  Upgrade later for
                  more features.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

