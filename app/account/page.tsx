import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, Compass, UserRound } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { getAccountContext } from "@/lib/account-context";

export default async function AccountPage() {
  const { user, business } = await getAccountContext();

  if (!user) {
    redirect("/login");
  }

  if (business) {
    redirect("/dashboard");
  }

  const fullName =
    typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : null;

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-6 py-8 text-stone-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#6B7280]">
              MyNegosyo Account
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#111827]">
              Welcome{fullName ? `, ${fullName}` : ""}
            </h1>
            <p className="mt-3 max-w-2xl text-stone-600">
              Discover local businesses across Mindoro, or register a business whenever you are ready.
            </p>
          </div>

          <LogoutButton />
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-[#E5E7EB] bg-white p-7 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0FDF4] text-[#14532D]">
              <UserRound className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-2xl font-black tracking-tight text-[#111827]">
              Your profile
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Your Listahan account is ready. Profile editing will be introduced in a later Phase 1.5A step.
            </p>
            <Link
              href="/account/settings"
              className="mt-6 inline-flex rounded-2xl border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#111827]"
            >
              View Settings
            </Link>
          </div>

          <div className="rounded-[2rem] bg-[#14532D] p-7 text-white shadow-[0_30px_80px_-42px_rgba(20,83,45,0.95)]">
            <Building2 className="h-8 w-8 text-[#86EFAC]" />
            <h2 className="mt-5 text-3xl font-black tracking-tight">
              Register a business when you are ready.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/75">
              Business ownership is optional. You can continue exploring Listahan without creating a storefront.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard/business"
                className="inline-flex items-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#14532D]"
              >
                Register Business
              </Link>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-5 py-3 text-sm font-semibold text-white"
              >
                <Compass className="h-4 w-4" />
                Discover
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
