
import { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";

import { notFound } from "next/navigation";
import { logBusinessVisit } from "@/lib/analytics/log-visit";
import { LinkIcon } from "@/components/link-icon";
import { FavoriteButton } from "@/components/favorites/favorite-button";
import { isFavorite } from "@/lib/services/favorites/is-favorite";
import { getBusinessReviews } from "@/lib/services/reviews/get-business-reviews";
import { getProfileReview } from "@/lib/services/reviews/get-profile-review";

import { PublicStorefront } from "./public-storefront";
import { ReviewsSection } from "./reviews-section";

import {
  MapPin,
  ExternalLink,
  Clock3,
} from "lucide-react";

type PublicBusinessPageProps = {
  params: Promise<{
    slug: string;
  }>;
};


export const dynamic =
  "force-dynamic";


export async function generateMetadata({
  params,
}: PublicBusinessPageProps): Promise<Metadata> {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!business) {
    return {
      title: "Business Not Found",
    };
  }

  const title = `${business.name} | MyNegosyo Mindoro`;

  const description =
    business.description ||
    `Explore ${business.name} on MyNegosyo Mindoro.`;

  const image =
    business.cover_url ||
    business.logo_url ||
    "/og-default.jpg";

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

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

  /*
    IMPORTANT:
    disabled/nonexistent stores
    become hidden publicly
  */

  if (!business) {
    notFound();
  }
  const [favoriteContext, reviews, profileReviewContext] = await Promise.all([
    isFavorite(business.id),
    getBusinessReviews(business.id),
    getProfileReview(business.id),
  ]);
  await logBusinessVisit( business.id );

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
    appearance?.accent_color || "#14532D";

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
      : "bg-[#FAF7F2] text-stone-900";

  const primaryLinks =
    links?.filter(
      (link) => link.is_primary
    ) || [];

  return (
    <main
      className={`relative min-h-screen w-full overflow-x-clip ${pageThemeClass}`}
    >
      {/* HERO */}
      <section className="relative w-full overflow-hidden">
        {/* COVER */}
        <div className="relative h-[220px] w-full md:h-[520px]">
          {business.cover_url ? (
            <img
              src={business.cover_url}
              alt={business.name}
              draggable={false}
              className="block h-full w-full object-cover"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, #111827)`,
              }}
            />
          )}

          {/* OVERLAYS */}
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />
        </div>

        {/* CONTENT WRAPPER */}
        <div className="relative z-10 -mt-16 md:absolute md:inset-x-0 md:bottom-0">
          <div className="mx-auto w-full max-w-5xl px-4 pb-6 md:px-6 md:pb-10">
            <div className="flex min-w-0 flex-col gap-5 rounded-[2rem] bg-black/40 p-5 backdrop-blur-xl md:flex-row md:items-end md:bg-transparent md:p-0 md:backdrop-blur-none">
              {/* LOGO */}
              <div className="relative shrink-0">
                {business.logo_url ? (
                  <img
                    src={business.logo_url}
                    alt={business.name}
                    draggable={false}
                    className="h-24 w-24 rounded-[2rem] border-4 border-white bg-white object-cover shadow-2xl md:h-40 md:w-40"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border-4 border-white bg-[#F3F4F6] text-4xl font-black text-[#14532D] shadow-2xl md:h-40 md:w-40">
                    {business.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="min-w-0 flex-1 text-white">
                <h1 className="break-words text-3xl font-black tracking-tight md:text-6xl">
                  {business.name}
                </h1>

                <p className="mt-2 break-words text-base text-white/80 md:text-2xl">
                  {business.industry}
                </p>

                {/* META */}
                <div className="mt-5 flex max-w-full flex-col gap-3 text-sm md:flex-row md:flex-wrap md:gap-6 md:text-base">
                  <div className="flex min-w-0 items-center gap-2">
                    <MapPin
                      className="h-5 w-5 shrink-0"
                      style={{
                        color: "#FACC15",
                      }}
                    />

                    <div className="min-w-0">
                      <p className="break-words font-bold">
                        {business.city ||
                          "Philippines"}
                      </p>

                      <p className="break-words text-white/70">
                        {business.province ||
                          "Local Business"}
                      </p>
                    </div>
                  </div>

                  {business.opening_hours && (
                    <div className="flex items-center gap-2 text-white/90">
                      <Clock3
                        className="h-4 w-4 shrink-0"
                        style={{
                          color: "#f1f0eccb",
                        }}
                      />

                      <span className="break-words">
                        {
                          business.opening_hours
                        }
                      </span>
                    </div>
                  )}
                </div>

                {/* DESCRIPTION */}
                {business.description && (
                  <p className="mt-6 max-w-2xl break-words text-sm leading-relaxed text-white/80 md:text-base">
                    {business.description}
                  </p>
                )}

                <div className="mt-6">
                  <FavoriteButton
                    businessId={business.id}
                    isAuthenticated={favoriteContext.isAuthenticated}
                    initialIsFavorite={favoriteContext.isFavorite}
                    className="border border-white/40 bg-white/15 text-white shadow-none hover:bg-white/25"
                  />
                </div>

                {/* BUTTONS */}
                {primaryLinks.length > 0 && (
                  <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {primaryLinks.map((link) => (
                      <a
                        key={link.id}
                       href={`/api/track-link?businessId=${business.id}&linkId=${link.id}&target=${encodeURIComponent(link.url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white shadow-xl transition-opacity hover:opacity-90 sm:w-auto ${buttonRadiusClass}`}
                        style={{
                          backgroundColor:
                            accentColor,
                        }}
                      >
                        <LinkIcon
                          type={link.type}
                        />

                        <span>
                          {link.label}
                        </span>

                        <ExternalLink className="h-4 w-4 shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STOREFRONT */}
      <section className="relative z-10 mx-auto w-full max-w-5xl overflow-hidden px-4 pb-32 pt-8 md:px-6">
        <PublicStorefront
          businessId={business.id}
          categories={categories ?? []}
          items={items ?? []}
          links={links ?? []}
          appearance={appearance}
        />
        <ReviewsSection
          businessId={business.id}
          reviews={reviews}
          currentReview={profileReviewContext.review}
          isAuthenticated={profileReviewContext.isAuthenticated}
        />
      </section>
    </main>
  );
}

