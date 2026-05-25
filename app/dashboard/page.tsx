
import { LogoutButton } from "@/components/logout-button";

import { createClient } from "@/lib/supabase/server";

import { redirect } from "next/navigation";

import Link from "next/link";

import {
  Store,
  Grid2x2,
  Package,
  Link2,
  Palette,
  ArrowRight,
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const { data: businesses } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id);

  const quickActions = [
    {
      label: "Business Setup",
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

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <DashboardHeader
            eyebrow="Overview"
            title={`Welcome, ${
              profile?.full_name ||
              profile?.email ||
              "Owner"
            }`}
            description="Manage your storefront, products, links, and appearance."
          />

          <div className="md:pt-2">
            <LogoutButton />
          </div>
        </div>

        {/* HERO */}
        <section className="overflow-hidden rounded-[2rem] border border-[#E7D8C5] bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#C85A32] to-[#596B3F] p-6 text-white md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] opacity-80">
              Storefront Platform
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
              Your business is now online.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
              Continue customizing your storefront experience,
              manage products and services, and optimize your
              public business page.
            </p>
          </div>

          {/* STATS */}
          <div className="grid gap-px bg-[#E7D8C5] md:grid-cols-3">
            <div className="bg-white p-6">
              <p className="text-sm text-stone-500">
                Businesses
              </p>

              <p className="mt-3 text-4xl font-black text-[#3D2A1E]">
                {businesses?.length || 0}
              </p>
            </div>

            <div className="bg-white p-6">
              <p className="text-sm text-stone-500">
                Current Plan
              </p>

              <p className="mt-3 text-4xl font-black text-[#3D2A1E]">
                Libre
              </p>
            </div>

            <div className="bg-white p-6">
              <p className="text-sm text-stone-500">
                Status
              </p>

              <p className="mt-3 text-4xl font-black text-[#596B3F]">
                Active
              </p>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-black tracking-tight text-[#3D2A1E]">
              Quick Actions
            </h2>

            <p className="mt-2 text-sm text-stone-600">
              Jump directly into managing your storefront.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-[2rem] border border-[#E7D8C5] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F4EC]">
                      <Icon className="h-6 w-6 text-[#C85A32]" />
                    </div>

                    <ArrowRight className="h-5 w-5 text-stone-400 transition-transform group-hover:translate-x-1" />
                  </div>

                  <h3 className="mt-6 text-2xl font-black tracking-tight text-[#3D2A1E]">
                    {item.label}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    Manage and customize your{" "}
                    {item.label.toLowerCase()}.
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
