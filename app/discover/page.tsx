
import { createClient } from "@/lib/supabase/server";
import { BusinessCard } from "./components/business-card";

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const supabase = await createClient();

  const { data: businesses } = await supabase
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
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    });

  return (
    <main className="min-h-screen bg-[#F7F1E8]">
      <section className="mx-auto max-w-7xl px-6 py-12">
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

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
  {(businesses ?? []).map((business) => (
    <BusinessCard
      key={business.id}
      business={business}
    />
  ))}
</div>
       
      </section>
    </main>
  );
}