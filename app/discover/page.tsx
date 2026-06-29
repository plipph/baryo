import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
            <Link
              key={business.id}
              href={`/${business.slug}`}
              className="group overflow-hidden rounded-[2rem] border border-[#E7D8C5] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-52 bg-[#EFE3D3]">
                {business.cover_url ? (
                  <img
                    src={business.cover_url}
                    alt={business.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-5xl font-black text-[#8A6A4F]">
                    {business.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  {business.logo_url ? (
                    <img
                      src={business.logo_url}
                      alt={business.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#EFE3D3] font-bold">
                      {business.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h2 className="text-xl font-black text-[#3D2A1E]">
                      {business.name}
                    </h2>

                    <p className="text-sm text-[#8A6A4F]">
                      {business.industry}
                    </p>
                  </div>
                </div>

                <p className="line-clamp-3 text-sm text-stone-600">
                  {business.description}
                </p>

                <div className="mt-5 flex items-center justify-between text-sm text-stone-500">
                  <span>{business.city}</span>

                  <span>View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}