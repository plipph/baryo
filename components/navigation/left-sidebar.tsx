"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Compass,
  Gift,
  CalendarDays,
  Newspaper,
  Briefcase,
  Building2,
  HeartHandshake,
  MapPinned,
} from "lucide-react";

const navigation = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Discover",
    href: "/discover",
    icon: Compass,
  },
  {
    label: "Offers",
    href: "/offers",
    icon: Gift,
  },
  {
    label: "Events",
    href: "/events",
    icon: CalendarDays,
  },
  {
    label: "Stories",
    href: "/stories",
    icon: Newspaper,
  },
  {
    label: "Jobs",
    href: "/jobs",
    icon: Briefcase,
  },
];

export function LeftSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-20 h-[calc(100vh-5rem)] border-r border-[#E5E7EB]/80 bg-[#FAF7F2]">

      <div className="px-6 py-8">

        <div className="mb-10">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#16A34A]">
            MyNegosyo
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-[#111827]">
            Mindoro
          </h2>

        </div>

        <nav className="space-y-2">

          {navigation.map((item) => {

            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-2xl px-4 py-3 font-semibold transition-all ${
                  active
                    ? "bg-[#14532D] text-white shadow-[0_16px_32px_-22px_rgba(20,83,45,0.9)]"
                    : "text-[#6B7280] hover:bg-white hover:text-[#111827]"
                }`}
              >
                <Icon className="h-5 w-5" />

                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-10 rounded-3xl bg-[#14532D] p-6 text-white shadow-[0_22px_50px_-30px_rgba(20,83,45,0.9)]">

          <MapPinned className="mb-4 h-8 w-8" />

          <h3 className="text-lg font-bold">
            Explore Mindoro
          </h3>

          <p className="mt-2 text-sm text-white/80">
            Discover local businesses, promotions,
            events and opportunities.
          </p>

        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">

          <HeartHandshake className="mb-3 h-7 w-7 text-[#16A34A]" />

          <h3 className="font-bold">
            Support Local
          </h3>

          <p className="mt-2 text-sm text-stone-600">
            Every visit helps Mindoro businesses grow.
          </p>

        </div>

        <div className="mt-8 rounded-3xl border border-orange-100 bg-orange-50 p-6">

          <Building2 className="mb-3 h-7 w-7 text-[#FB923C]" />

          <h3 className="font-bold">
            Own a Business?
          </h3>

          <p className="mt-2 text-sm text-stone-600">
            Join hundreds of local businesses already on Listahan.
          </p>

          <Link
            href="/register"
            className="mt-5 inline-flex rounded-full bg-[#14532D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#166534]"
          >
            Register Business
          </Link>

        </div>

      </div>

    </aside>
  );
}

export default LeftSidebar;
