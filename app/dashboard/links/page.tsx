
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import LinksManager  from "./links-manager";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";

export default async function LinksPage() {
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
    redirect("/dashboard/business");
  }

  const { data: links } = await supabase
    .from("business_links")
    .select("*")
    .eq("business_id", business.id)
    .order("sort_order", {
      ascending: true,
    });

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl">
        <DashboardHeader
          eyebrow="Links"
          title="Social & Contact Links"
          description="Manage social media, inquiry, and customer contact channels."
        />

        <DashboardCard>
          <LinksManager
            businessId={business.id}
            businessPlan={business.plan_id}
            initialLinks={links || []}
          />
        </DashboardCard>
      </div>
    </main>
  );
}
