import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/profile/profile-form";
import { getAccountContext } from "@/lib/account-context";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const { user } = await getAccountContext();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, city, province, bio")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-6 py-8 text-stone-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#6B7280]">
            Account
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#111827]">
            Settings
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Manage your account display name and review the email connected to Listahan.
          </p>
        </header>

        <ProfileForm profile={profile} variant="settings" />

        <p className="mt-6 text-sm text-stone-500">
          Password changes are not available because the current authentication flow does not provide a supported password-update experience.
        </p>
      </div>
    </main>
  );
}
