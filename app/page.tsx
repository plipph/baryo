import { createClient } from "@/lib/supabase/server";

import { PublicLayout } from "@/components/layout/public-layout";

import { HeroBanner } from "@/components/hero/hero-banner";
import { CategoryGrid } from "@/components/categories/category-grid";
import { BusinessCard } from "@/components/business/business-card";
import { Section } from "@/components/ui/section";
import Link from "next/link";
import {
  CalendarDays,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: businesses } = await supabase
    .from("businesses")
    .select("*")
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    });

  return (
    <PublicLayout>
      <div>

        <HeroBanner />

        <CategoryGrid />

        <Section
          title="Featured Businesses"
          subtitle="Polished storefronts and local favorites worth checking out first."
        >
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {(businesses ?? [])
              .slice(0, 3)
              .map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                />
              ))}
          </div>
        </Section>

        <Section
          title="Nearby in Mindoro"
          subtitle="Fresh listings from across Oriental and Occidental Mindoro."
        >
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {(businesses ?? []).slice(0, 6).map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
              />
            ))}
          </div>
        </Section>

        <Section
          title="Events and Community"
          subtitle="A simple pulse for what locals can discover next."
        >
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Weekend finds",
                text: "Restaurants, cafes, and resorts locals are searching for.",
                icon: CalendarDays,
              },
              {
                title: "Local buzz",
                text: "Fresh businesses, services, and community picks in one feed.",
                icon: MessageCircle,
              },
              {
                title: "Support local",
                text: "Discover small businesses and help Mindoro entrepreneurs grow.",
                icon: HeartHandshake,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] bg-white p-6 shadow-[0_18px_50px_-34px_rgba(17,24,39,0.45)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-[#111827]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </Section>

        <Section
          title="Recommended for You"
          subtitle={`${businesses?.length ?? 0} businesses available on MyNegosyo Mindoro.`}
        >
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[1.5rem] bg-[#14532D] p-7 text-white shadow-[0_30px_80px_-42px_rgba(20,83,45,0.95)]">
              <Sparkles className="h-8 w-8 text-[#86EFAC]" />
              <h3 className="mt-5 text-3xl font-black tracking-tight">
                Explore the local map of Mindoro.
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/75">
                Browse by city, service, category, or mood. Every visit helps a
                local entrepreneur become easier to find.
              </p>
              <Link
                href="/discover"
                className="mt-6 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-black text-[#14532D]"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Open Discover
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {(businesses ?? []).slice(3, 7).map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          </div>
        </Section>

      </div>
    </PublicLayout>
  );
}
