import { createClient } from "@/lib/supabase/server";

import { BusinessCard } from "./components/business-card";
import { DiscoverSearch } from "./components/discover-search";

export const dynamic = "force-dynamic";

type DiscoverPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function DiscoverPage({
  searchParams,
}: DiscoverPageProps) {
  const { search } = await searchParams;

  const supabase = await createClient();

  const query = supabase
    .from("businesses")
    .select(`
      id,
      slug,
      name,
      description,
      industry,
      city,
      province,
      logo_url,
      cover_url
    `)
    .eq("is_active", true);

  if (search) {
    query.or(
      `name.ilike.%${search}%,description.ilike.%${search}%,industry.ilike.%${search}%`
    );
  }

  const { data: businesses, error } = await query.order(
    "created_at",
    {
      ascending: false,
    }
  );

  if (error) {
    console.error(error);
  }

  return (
    <main className="min-h-screen bg-[#F7F1E8]">
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8A6A4F]">
            Discover
          </p>

          <h1 className="mt-2 text-5xl font-black text-[#3D2A1E]">
            Explore Local Businesses
          </h1>

          <p className="mt-4 max-w-2xl text-stone-600">
            Find restaurants, professionals, retailers,
            services and more across your community.
          </p>
        </div>

        {/* Search */}
        <DiscoverSearch />

        {/* Results */}
        {(businesses ?? []).length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-[#D8C3AC] bg-white p-10 text-center">
            <h2 className="text-2xl font-black text-[#3D2A1E]">
              No businesses found
            </h2>

            <p className="mt-3 text-stone-600">
              Try searching with a different keyword.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {(businesses ?? []).map((business: any) => (
              <BusinessCard
                key={business.id}
                business={business}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}