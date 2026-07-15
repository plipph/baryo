import Link from "next/link";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";

import { getAccountContext } from "@/lib/account-context";

export default async function AccountSettingsPage() {
  const { user } = await getAccountContext();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-6 py-8 text-stone-900">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-[2rem] border border-[#E5E7EB] bg-white p-7 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0FDF4] text-[#14532D]">
            <Settings className="h-6 w-6" />
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#6B7280]">
            Account
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#111827]">
            Settings
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            Account settings are reserved for a later Phase 1.5A step. No profile fields or preferences can be changed here yet.
          </p>
          <Link
            href="/account"
            className="mt-6 inline-flex rounded-2xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Profile
          </Link>
        </section>
      </div>
    </main>
  );
}
