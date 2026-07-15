
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  CheckCircle2,
  Store,
  LayoutGrid,
  Package,
  Link2,
  Palette,
  ArrowRight,
  Globe,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getAccountContext } from "@/lib/account-context";

import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  const { user, business: accountBusiness } = await getAccountContext();

  if (!user) {
    redirect("/login");
  }

  if (!accountBusiness) {
    redirect("/account");
  }

  const supabase = await createClient();

  const { data: profile } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

  const { data: business } =
    await supabase
      .from("businesses")
      .select("*")
      .eq("id", accountBusiness.id)
      .maybeSingle();

  const businessId =
    business?.id;

  const { count: categoryCount } =
    await supabase
      .from("categories")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "business_id",
        businessId
      );

  const { count: itemCount } =
    await supabase
      .from("items")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "business_id",
        businessId
      );

  const { count: linkCount } =
    await supabase
      .from("business_links")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "business_id",
        businessId
      );

  const {
    data: appearance,
  } = await supabase
    .from(
      "appearance_settings"
    )
    .select("*")
    .eq(
      "business_id",
      businessId
    )
    .maybeSingle();

  const checklist = [
    {
      label:
        "Business Information",
      complete: !!business,
      href: "/dashboard/business",
      icon: Store,
    },
    {
      label: "Upload Logo",
      complete:
        !!business?.logo_url,
      href: "/dashboard/business",
      icon: Store,
    },
    {
      label: "Upload Cover",
      complete:
        !!business?.cover_url,
      href: "/dashboard/business",
      icon: Store,
    },
    {
      label: "Add Categories",
      complete:
        (categoryCount || 0) >
        0,
      href: "/dashboard/categories",
      icon: LayoutGrid,
    },
    {
      label: "Add Items",
      complete:
        (itemCount || 0) > 0,
      href: "/dashboard/items",
      icon: Package,
    },
    {
      label: "Add Social Links",
      complete:
        (linkCount || 0) > 0,
      href: "/dashboard/links",
      icon: Link2,
    },
    {
      label:
        "Customize Storefront",
      complete: !!appearance,
      href:
        "/dashboard/appearance",
      icon: Palette,
    },
  ];

  const completed =
    checklist.filter(
      (item) => item.complete
    ).length;

  const progress = Math.round(
    (completed /
      checklist.length) *
      100
  );

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-6 py-8 text-stone-900">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#6B7280]">
              Listahan Dashboard
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#111827]">
              Welcome back,
              {" "}
              {profile?.full_name ||
                "Owner"}
            </h1>

            <p className="mt-3 max-w-2xl text-stone-600">
              Launch your
              storefront and start
              sharing your business
              online.
            </p>
          </div>

          <LogoutButton />
        </header>

        {/* PROGRESS CARD */}
        <section className="overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-white shadow-sm">
          <div className="grid gap-8 p-8 md:grid-cols-[1.4fr_0.8fr]">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF6E9] px-4 py-2 text-sm font-semibold text-[#3D6B35]">
                <CheckCircle2 className="h-4 w-4" />

                Setup Progress
              </div>

              <h2 className="mt-5 text-5xl font-black tracking-tight text-[#111827]">
                {progress}%
              </h2>

              <p className="mt-3 text-stone-600">
                Your storefront setup
                is currently{" "}
                {progress}% complete.
              </p>


{/* GUIDANCE ALERTS */}
<div className="mt-6 space-y-4">
  {!business && (
    <div className="rounded-[2rem] border border-[#E5E7EB] bg-[#FFFFFF] p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
        Getting Started
      </p>

      <h3 className="mt-2 text-2xl font-black tracking-tight text-[#111827]">
        Create your first business
      </h3>

      <p className="mt-3 max-w-2xl text-stone-600">
        Start by setting up your
        business information,
        storefront name, and
        branding.
      </p>

      <Link
        href="/dashboard/business"
        className="mt-6 inline-flex rounded-2xl bg-[#14532D] px-5 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
      >
        Start Setup
      </Link>
    </div>
  )}

  {business &&
    (categoryCount || 0) ===
      0 && (
      <div className="rounded-[2rem] border border-[#E5E7EB] bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
          Recommended Next Step
        </p>

        <h3 className="mt-2 text-2xl font-black tracking-tight text-[#111827]">
          Add categories
        </h3>

        <p className="mt-3 max-w-2xl text-stone-600">
          Categories help organize
          your storefront and make
          browsing easier for
          customers.
        </p>

        <Link
          href="/dashboard/categories"
          className="mt-6 inline-flex rounded-2xl bg-[#14532D] px-5 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
        >
          Create Categories
        </Link>
      </div>
    )}

  {business &&
    (categoryCount || 0) >
      0 &&
    (itemCount || 0) ===
      0 && (
      <div className="rounded-[2rem] border border-[#E5E7EB] bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
          Recommended Next Step
        </p>

        <h3 className="mt-2 text-2xl font-black tracking-tight text-[#111827]">
          Add products or services
        </h3>

        <p className="mt-3 max-w-2xl text-stone-600">
          Start showcasing your
          menu, services, products,
          or offerings to visitors.
        </p>

        <Link
          href="/dashboard/items"
          className="mt-6 inline-flex rounded-2xl bg-[#14532D] px-5 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
        >
          Add Items
        </Link>
      </div>
    )}

  {business &&
    (itemCount || 0) >
      0 &&
    (linkCount || 0) ===
      0 && (
      <div className="rounded-[2rem] border border-[#E5E7EB] bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
          Recommended Next Step
        </p>

        <h3 className="mt-2 text-2xl font-black tracking-tight text-[#111827]">
          Add contact links
        </h3>

        <p className="mt-3 max-w-2xl text-stone-600">
          Allow customers to
          contact your business via
          Messenger, Instagram,
          WhatsApp, or booking
          links.
        </p>

        <Link
          href="/dashboard/links"
          className="mt-6 inline-flex rounded-2xl bg-[#14532D] px-5 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
        >
          Add Links
        </Link>
      </div>
    )}

  {progress === 100 && (
    <div className="rounded-[2rem] border border-[#D9E8D0] bg-[#EEF6E9] p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4F6B43]">
        Storefront Ready
      </p>

      <h3 className="mt-2 text-3xl font-black tracking-tight text-[#2F4A24]">
        🎉 Your storefront is live
      </h3>

      <p className="mt-3 max-w-2xl text-[#51634A]">
        Your business storefront
        is now fully configured and
        ready to share with
        customers.
      </p>

      {business?.slug && (
        <Link
          href={`/${business.slug}`}
          target="_blank"
          className="mt-6 inline-flex rounded-2xl bg-[#16A34A] px-5 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
        >
          Open Storefront
        </Link>
      )}
    </div>
  )}
</div>




              {/* BAR */}
              <div className="mt-6 h-4 overflow-hidden rounded-full bg-[#EEE3D4]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                    backgroundColor:
                      "#14532D",
                  }}
                />
              </div>

              {/* CTA */}
              {business?.slug && (
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={`/${business.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#14532D] px-5 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                  >
                    <Globe className="h-5 w-5" />

                    View Storefront
                  </Link>

                  <Link
                    href="/dashboard/business"
                    className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4 font-semibold text-[#111827]"
                  >
                    Manage Business

                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="rounded-[2rem] bg-[#FFFFFF] p-6">
              <h3 className="text-lg font-black text-[#111827]">
                Launch Checklist
              </h3>

              <div className="mt-5 space-y-3">
                {checklist.map(
                  (item) => {
                    const Icon =
                      item.icon;

                    return (
                      <Link
                        key={
                          item.label
                        }
                        href={item.href}
                        className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 transition hover:scale-[1.01]"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                              item.complete
                                ? "bg-[#EEF6E9] text-[#3D6B35]"
                                : "bg-[#F3ECE2] text-[#6B7280]"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="font-semibold text-[#111827]">
                              {
                                item.label
                              }
                            </p>

                            <p className="text-sm text-stone-500">
                              {item.complete
                                ? "Completed"
                                : "Pending"}
                            </p>
                          </div>
                        </div>

                        <CheckCircle2
                          className={`h-5 w-5 ${
                            item.complete
                              ? "text-[#3D6B35]"
                              : "text-stone-300"
                          }`}
                        />
                      </Link>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

