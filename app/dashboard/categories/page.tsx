import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CategoriesManager } from "./categories-manager";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!business) {
    redirect("/dashboard/business");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("business_id", business.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen bg-[#F7F1E8] px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8A6A4F]">
            Listahan Dashboard
          </p>
          <h1 className="mt-2 text-4xl font-bold text-[#3D2A1E]">
            Categories
          </h1>
          <p className="mt-3 text-stone-600">
            Organize your products or services into clear groups.
          </p>
        </div>

        <CategoriesManager
          businessId={business.id}
          initialCategories={categories || []}
        />
      </div>
    </main>
  );
}