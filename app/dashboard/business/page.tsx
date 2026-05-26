
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { BusinessForm } from "./business-form";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";

export default async function BusinessPage() {
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

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl">
        <DashboardHeader
          eyebrow="Business Setup"
          title="Business Information"
          description="Manage the public details of your storefront.Keenan"
        />

        <DashboardCard>
          <BusinessForm
            userId={user.id}
            business={business}
          />
        </DashboardCard>
      </div>
    </main>
  );
}

