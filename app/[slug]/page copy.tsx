import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { LinkIcon } from "@/components/link-icon";
import { PublicStorefront } from "./public-storefront";

import {
  MapPin,
  Clock3,
  ExternalLink,
} from "lucide-react";

type PublicBusinessPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicBusinessPage({
  params,
}: PublicBusinessPageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  /* BUSINESS */

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!business) {
    notFound();
  }

  /* CATEGORIES */

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("business_id", business.id)
    .order("sort_order", {
      ascending: true,
    });

  /* ITEMS */

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("business_id", business.id)
    .eq("is_visible", true)
    .order("sort_order", {
      ascending: true,
    });

  /* LINKS */

  const { data: links } = await supabase
    .from("business_links")
    .select("*")
    .eq("business_id", business.id)
    .eq("is_visible", true)
    .order("sort_order", {
      ascending: true,
    });

  /* APPEARANCE */

  const { data: appearance } = await supabase
    .from("appearance_settings")
    .select("*")
    .eq("business_id", business.id)
    .maybeSingle();

  /* THEME ENGINE */

  const accentColor =
    appearance?.accent_color || "#C85A32";

  const buttonStyle =
    appearance?.button_style || "rounded";

  const buttonRadiusClass =
    buttonStyle === "pill"
      ? "rounded-full"
      : buttonStyle === "sharp"
      ? "rounded-none"
      : "rounded-2xl";

  const theme =
    appearance?.theme || "earthy";

  const pageThemeClass =
    theme === "dark"
      ? "bg-[#111827] text-white"
      : theme === "minimal"
      ? "bg-white text-stone-900"
      : "bg-[#F6F1E8] text-stone-900";

  return (
    <main
      className={`min-h-screen ${pageThemeClass}`}
    >
      {/* HERO */}
      <section className="relative overflow-hidden">
        {business.cover_url ? (
          <div className="relative h-[320px] md:h-[420px]">
            <img
              src={business.cover_url}
              alt={business.name}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/40" />
          </div>
        ) : (
          <div
            className="h-[260px]"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #111827)`,
            }}
          />
        )}

        {/* HERO CARD */}
        <div className="relative mx-auto -mt-20 max-w-5xl px-4 pb-6 md:-mt-24 md:px-5 md:pb-8">
          <div className="rounded-[2rem] border border-white/30 bg-white/70 p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {/* LEFT SIDE */}
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                {business.logo_url ? (
                  <img
                    src={business.logo_url}
                    alt={business.name}
                    className="h-24 w-24 rounded-[2rem] border-4 border-white bg-white object-cover shadow-xl md:h-28 md:w-28"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#E7D8C5] text-3xl font-black text-[#5A3825] md:h-28 md:w-28">
                    {business.name.charAt(0)}
                  </div>
                )}

                <div>
                  <div className="inline-flex rounded-full bg-[#F3E7D7] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8A6A4F]">
                    {business.industry}
                  </div>

                  <h1
                    className={`mt-4 text-3xl font-black tracking-tight md:text-5xl ${
                      theme === "dark"
                        ? "text-white"
                        : "text-[#3D2A1E]"
                    }`}
                  >
                    {business.name}
                  </h1>

                  {business.description && (
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600 md:text-lg">
                      {business.description}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-4 text-sm text-stone-600">
                    {business.city && (
                      <div className="flex items-center gap-2">
                        <MapPin
                          className="h-4 w-4"
                          style={{
                            color: accentColor,
                          }}
                        />

                        {business.city}

                        {business.province
                          ? `, ${business.province}`
                          : ""}
                      </div>
                    )}

                    {business.opening_hours && (
                      <div className="flex items-center gap-2">
                        <Clock3
                          className="h-4 w-4"
                          style={{
                            color: accentColor,
                          }}
                        />

                        {business.opening_hours}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* PRIMARY ACTIONS */}
              <div className="grid w-full gap-3 sm:flex sm:flex-wrap">
                {links
                  ?.filter(
                    (link) => link.is_primary
                  )
                  .map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] sm:w-auto ${buttonRadiusClass}`}
                      style={{
                        backgroundColor:
                          accentColor,
                      }}
                    >
                      <LinkIcon
                        type={link.type}
                      />

                      {link.label}

                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ))}
              </div>
            </div>

            {/* SOCIAL LINKS */}
            {links &&
              links.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 border border-[#E7D8C5] bg-white px-4 py-3 text-sm font-medium text-stone-700 transition-all hover:-translate-y-1 hover:shadow-md ${buttonRadiusClass}`}
                    >
                      <LinkIcon
                        type={link.type}
                      />

                      {link.label}
                    </a>
                  ))}
                </div>
              )}
          </div>
        </div>
      </section>

      {/* STOREFRONT */}
      <section className="mx-auto max-w-5xl px-5 pb-24">
        <PublicStorefront
          categories={categories || []}
          items={items || []}
          links={links || []}
          appearance={appearance || null}
        />
      </section>

      {/* MOBILE CTA */}
      {links?.some(
        (link) => link.is_primary
      ) && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
          <div className="rounded-2xl border border-white/20 bg-white/80 p-3 shadow-2xl backdrop-blur-xl">
            <div className="flex gap-3 overflow-x-auto">
              {links
                .filter(
                  (link) => link.is_primary
                )
                .map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white ${buttonRadiusClass}`}
                    style={{
                      backgroundColor:
                        accentColor,
                    }}
                  >
                    <LinkIcon
                      type={link.type}
                    />

                    {link.label}
                  </a>
                ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

