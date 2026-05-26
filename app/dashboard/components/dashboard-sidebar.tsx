"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Package,
  Link2,
  Palette,
  Settings,
  ChartBar,
} from "lucide-react";

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

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-[#E7D8C5] bg-[#FFFDF9] lg:flex lg:flex-col">
      <div className="border-b border-[#E7D8C5] px-6 py-6">
        <Link href="/dashboard">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8A6A4F]">
              Listahan
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#3D2A1E]">
              Business Hub
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Multi-tenant business platform
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                active
                  ? "bg-[#596B3F] text-white shadow-md"
                  : "text-stone-600 hover:bg-[#F3E7D7] hover:text-[#3D2A1E]"
              }`}
            >
              <Icon className="h-5 w-5" />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#E7D8C5] p-4">
        <div className="rounded-2xl bg-[#F3E7D7] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A6A4F]">
            Current Plan
          </p>

          <p className="mt-2 text-lg font-bold text-[#3D2A1E]">
            Libre
          </p>

          <p className="mt-1 text-sm text-stone-600">
            Upgrade later for more features.
          </p>
        </div>
      </div>
    </aside>
  );
}

