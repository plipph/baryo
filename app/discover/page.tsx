import { createClient } from "@/lib/supabase/server";
import { BusinessCard } from "@/components/business/business-card";
import { PublicLayout } from "@/components/layout/public-layout";
import { DiscoverSearch } from "./components/discover-search";

export const dynamic = "force-dynamic";

type DiscoverPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

type Business = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  industry: string | null;
  city: string | null;
  province: string | null;
  logo_url: string | null;
  cover_url: string | null;
};

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const { search } = await searchParams;
  const supabase = await createClient();

  const query = supabase
    .from("businesses")
    .select(
      "id, slug, name, description, industry, city, province, logo_url, cover_url"
    )
    .eq("is_active", true);

  if (search) {
    query.or(
      `name.ilike.%${search}%,description.ilike.%${search}%,industry.ilike.%${search}%,city.ilike.%${search}%`
    );
  }

  const { data: businesses, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error(error);
  }

  return (
    <PublicLayout>
      <main className="min-h-screen px-4 py-10 md:px-6">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8 rounded-[2rem] bg-[#14532D] p-6 text-white shadow-[0_30px_80px_-42px_rgba(20,83,45,0.95)] md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#86EFAC]">
              Discover
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight md:text-6xl">
              Explore Local Businesses
            </h1>

            <p className="mt-4 max-w-2xl text-white/75">
              Find restaurants, professionals, retailers, services, and more
              across Mindoro.
            </p>
          </div>

          <DiscoverSearch />

          {(businesses ?? []).length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-[#E5E7EB] bg-white p-10 text-center shadow-sm">
              <h2 className="text-2xl font-black text-[#111827]">
                No businesses found
              </h2>

              <p className="mt-3 text-[#6B7280]">
                Try searching with a different keyword.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {((businesses ?? []) as Business[]).map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </section>
      </main>
    </PublicLayout>
  );
}
