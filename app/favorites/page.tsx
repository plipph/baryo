import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { redirect } from "next/navigation";

import { BusinessCard } from "@/components/business/business-card";
import { getAccountContext } from "@/lib/account-context";
import { getProfileFavorites } from "@/lib/services/favorites/get-profile-favorites";

export default async function FavoritesPage() {
  const { user } = await getAccountContext();

  if (!user) {
    redirect("/login");
  }

  const businesses = await getProfileFavorites();

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-6 py-8 text-stone-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#6B7280]">
            MyNegosyo Account
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FDECEC] text-[#DC2626]">
              <Heart className="h-6 w-6 fill-current" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-[#111827]">
                Favorite Businesses
              </h1>
              <p className="mt-1 text-sm text-[#6B7280]">
                Keep local businesses you want to revisit in one place.
              </p>
            </div>
          </div>
        </header>

        {businesses.length === 0 ? (
          <section className="rounded-[2rem] border border-dashed border-[#D1D5DB] bg-white p-10 text-center shadow-sm">
            <Heart className="mx-auto h-10 w-10 text-[#DC2626]" />
            <h2 className="mt-5 text-2xl font-black text-[#111827]">
              Your favorites will appear here.
            </h2>
            <p className="mt-3 text-[#6B7280]">
              You haven&apos;t saved any businesses yet.
            </p>
            <Link
              href="/discover"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white"
            >
              <MapPin className="h-4 w-4" />
              Discover Businesses
            </Link>
          </section>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                isAuthenticated
                isFavorite
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
