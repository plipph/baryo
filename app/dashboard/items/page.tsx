
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { ItemsManager } from "./items-manager";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";

export default async function ItemsPage() {
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
    });

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("business_id", business.id)
    .order("sort_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: false,
    });

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl">
        <DashboardHeader
          eyebrow="Items"
          title="Products & Services"
          description="Manage your storefront catalog and offerings."
        />

        <DashboardCard>
          <ItemsManager
            businessId={business.id}
            businessPlan={business.plan_id}
            categories={categories || []}
            initialItems={items || []}
          />
        </DashboardCard>
      </div>
    </main>
  );
}

