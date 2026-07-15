
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
  CircleUserRound,
} from "lucide-react";

import { useState } from "react";

type DashboardMobileNavProps = {
  hasBusiness: boolean;
};

const businessNavigation = [
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
    label: "Profile",
    href: "/profile",
    icon: CircleUserRound,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const accountNavigation = [
  {
    label: "Profile",
    href: "/profile",
    icon: CircleUserRound,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    label: "Register Business",
    href: "/dashboard/business",
    icon: Building2,
  },
];

export function DashboardMobileNav({ hasBusiness }: DashboardMobileNavProps) {
  const pathname =
    usePathname();

  const navigation = hasBusiness ? businessNavigation : accountNavigation;

  const [open, setOpen] =
    useState(false);

  return (
    <>
      {/* TOP BAR */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#E5E7EB]/80 bg-white/90 px-4 py-4 backdrop-blur-xl lg:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#16A34A]">
            MyNegosyo
          </p>

          <h1 className="text-lg font-black text-[#111827]">
            {hasBusiness ? "Dashboard" : "Account"}
          </h1>
        </div>

        <button
          type="button"
          onClick={() =>
            setOpen(true)
          }
          className="rounded-full border border-[#E5E7EB] bg-white p-2 shadow-sm"
        >
          <Menu className="h-5 w-5 text-[#111827]" />
        </button>
      </div>

      {/* DRAWER */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden">
          <div className="absolute left-0 top-0 flex h-full w-80 flex-col bg-white shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#16A34A]">
                  MyNegosyo
                </p>

                <h2 className="mt-1 text-2xl font-black text-[#111827]">
                  {hasBusiness ? "Business Hub" : "MyNegosyo"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-full border border-[#E5E7EB] bg-white p-2 shadow-sm"
              >
                <X className="h-5 w-5 text-[#111827]" />
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
                          ? "bg-[#14532D] text-white shadow-md"
                          : "text-[#6B7280] hover:bg-[#F0FDF4] hover:text-[#111827]"
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
            {hasBusiness && (
            <div className="border-t border-[#E5E7EB] p-4">
              <div className="rounded-2xl bg-[#F0FDF4] p-4 ring-1 ring-green-100">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#14532D]">
                  Current Plan
                </p>

                <p className="mt-2 text-lg font-bold text-[#111827]">
                  Libre
                </p>

                <p className="mt-1 text-sm text-stone-600">
                  Upgrade later for
                  more features.
                </p>
              </div>
            </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

