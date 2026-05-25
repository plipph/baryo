import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { AppearanceForm } from "./appearance-form";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";

export default async function AppearancePage() {
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

  const { data: appearance } = await supabase
    .from("appearance_settings")
    .select("*")
    .eq("business_id", business.id)
    .maybeSingle();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl">
        <DashboardHeader
          eyebrow="Appearance"
          title="Customize Appearance"
          description="Personalize the look and feel of your storefront."
        />

        <DashboardCard>
          <AppearanceForm
            businessId={business.id}
            initialAppearance={appearance}
          />
        </DashboardCard>
      </div>
    </main>
  );
}

