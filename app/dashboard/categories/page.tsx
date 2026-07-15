
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { CategoriesManager } from "./categories-manager";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";

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
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (!business) {
    redirect("/account");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("business_id", business.id)
    .order("sort_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: true,
    });

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl">
        <DashboardHeader
          eyebrow="Categories"
          title="Manage Categories"
          description="Organize products and services into clear sections."
        />

        <DashboardCard>
          <CategoriesManager
            businessId={business.id}
            initialCategories={
              categories || []
            }
          />
        </DashboardCard>
      </div>
    </main>
  );
}

