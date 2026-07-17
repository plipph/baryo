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
  CircleUserRound,
  Heart,
} from "lucide-react";

type DashboardSidebarProps = {
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
    label: "Favorites",
    href: "/favorites",
    icon: Heart,
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
    label: "Favorites",
    href: "/favorites",
    icon: Heart,
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

export function DashboardSidebar({ hasBusiness }: DashboardSidebarProps) {
  const pathname = usePathname();
  const navigation = hasBusiness ? businessNavigation : accountNavigation;

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-[#E5E7EB]/80 bg-white/90 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="border-b border-[#E5E7EB]/80 px-6 py-6">
        <Link href="/dashboard">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#16A34A]">
              MyNegosyo
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#111827]">
              {hasBusiness ? "Business Hub" : "MyNegosyo"}
            </h1>

            <p className="mt-2 text-sm text-[#6B7280]">
              {hasBusiness
                ? "Manage your local storefront"
                : "Your local account"}
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
                  ? "bg-[#14532D] text-white shadow-[0_16px_32px_-22px_rgba(20,83,45,0.9)]"
                  : "text-[#6B7280] hover:bg-[#F0FDF4] hover:text-[#111827]"
              }`}
            >
              <Icon className="h-5 w-5" />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {hasBusiness && (
      <div className="border-t border-[#E5E7EB]/80 p-4">
        <div className="rounded-2xl bg-[#F0FDF4] p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#14532D]">
            Current Plan
          </p>

          <p className="mt-2 text-lg font-bold text-[#111827]">
            Libre
          </p>

          <p className="mt-1 text-sm text-stone-600">
            Upgrade later for more features.
          </p>
        </div>
      </div>
      )}
    </aside>
  );
}

