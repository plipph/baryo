import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, Compass } from "lucide-react";

import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { ProfileForm } from "@/components/profile/profile-form";
import { LogoutButton } from "@/components/logout-button";
import { getAccountContext } from "@/lib/account-context";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const { user, business } = await getAccountContext();

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
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <ProfileAvatar
              name={profile.full_name}
              avatarUrl={profile.avatar_url}
              className="h-16 w-16 text-xl"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#6B7280]">
                MyNegosyo Account
              </p>
              <h1 className="mt-1 text-4xl font-black tracking-tight text-[#111827]">
                Your Profile
              </h1>
            </div>
          </div>
          <LogoutButton />
        </header>

        <ProfileForm profile={profile} />

        {!business && (
          <section className="mt-8 rounded-[2rem] bg-[#14532D] p-7 text-white shadow-[0_30px_80px_-42px_rgba(20,83,45,0.95)]">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#86EFAC]">
              Welcome to Listahan
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              You have not registered a business yet.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
              Keep discovering local businesses, or create a storefront when you are ready.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard/business"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#14532D]"
              >
                <Building2 className="h-4 w-4" />
                Register Business
              </Link>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-5 py-3 text-sm font-semibold text-white"
              >
                <Compass className="h-4 w-4" />
                Continue Discovering
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
