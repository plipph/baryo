import Link from "next/link";

import {
  Search,
  MapPin,
  Star,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export const dynamic =
  "force-dynamic";

export default async function BusinessesPage() {
  const supabase =
    await createClient();

  const { data: businesses } =
    await supabase
      .from("businesses")
      .select("*")
      .eq("is_active", true)
      .order("created_at", {
        ascending: false,
      });

  return (
    <main className="min-h-screen bg-[#F7F1E8]">
      {/* HERO */}

      <section className="border-b border-[#E7D8C5] bg-gradient-to-b from-[#FFFDF9] to-[#F7F1E8]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8A6A4F]">
            Directory
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#3D2A1E] md:text-6xl">
            Discover Local
            Businesses
          </h1>

          <p className="mt-4 max-w-2xl text-stone-600">
            Explore restaurants,
            clinics, stores,
            professionals, and
            local services across
            Oriental Mindoro.
          </p>

          {/* SEARCH UI */}

          <div className="mt-8 flex flex-col gap-4 md:flex-row">
            <div className="flex flex-1 items-center rounded-2xl border border-[#E7D8C5] bg-white px-4 py-4 shadow-sm">
              <Search className="mr-3 h-5 w-5 text-stone-400" />

              <input
                placeholder="Search businesses..."
                disabled
                className="w-full bg-transparent outline-none"
              />
            </div>

            <button className="rounded-2xl bg-[#596B3F] px-8 py-4 font-bold text-white">
              Search
            </button>
          </div>

          {/* INDUSTRY CHIPS */}

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              "All",
              "Restaurant",
              "Clinic",
              "Retail",
              "Services",
            ].map((chip) => (
              <button
                key={chip}
                className="rounded-full border border-[#E7D8C5] bg-white px-5 py-2 text-sm font-semibold text-[#3D2A1E]"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}

      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="mb-6 flex items-center gap-3">
          <Star className="h-5 w-5 text-amber-500" />

          <h2 className="text-2xl font-black text-[#3D2A1E]">
            Featured Businesses
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {(businesses || [])
            .slice(0, 3)
            .map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                featured
              />
            ))}
        </div>
      </section>

      {/* ALL BUSINESSES */}

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-[#3D2A1E]">
            All Businesses
          </h2>

          <p className="mt-2 text-stone-600">
            {businesses?.length ||
              0}{" "}
            businesses found
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(businesses || []).map(
            (business) => (
              <BusinessCard
                key={business.id}
                business={business}
              />
            )
          )}
        </div>
      </section>
    </main>
  );
}

function BusinessCard({
  business,
  featured = false,
}: {
  business: any;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/${business.slug}`}
      className="overflow-hidden rounded-[2rem] border border-[#E7D8C5] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-48 bg-[#EFE3D3]">
        {business.cover_url ? (
          <img
            src={business.cover_url}
            alt={business.name}
            className="h-full w-full object-cover"
          />
        ) : null}

        {featured && (
          <div className="absolute left-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
            Featured
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-4">
          {business.logo_url ? (
            <img
              src={business.logo_url}
              alt={business.name}
              className="h-14 w-14 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7D8C5] font-black text-[#3D2A1E]">
              {business.name[0]}
            </div>
          )}

          <div>
            <h3 className="font-black text-[#3D2A1E]">
              {business.name}
            </h3>

            <p className="text-sm text-stone-500">
              {business.industry}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-stone-500">
          <MapPin className="h-4 w-4" />

          <span>
            {business.city}
          </span>
        </div>

        <p className="mt-4 line-clamp-2 text-sm text-stone-600">
          {business.description}
        </p>
      </div>
    </Link>
  );
}