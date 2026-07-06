import Link from "next/link";
import { ArrowRight, MapPinned, Search, ShieldCheck, Sparkles, Users } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="px-4 pb-8 pt-6 md:px-6 md:pb-12 md:pt-10">
      <div className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[2rem] bg-[#14532D] p-5 text-white shadow-[0_30px_80px_-42px_rgba(20,83,45,0.95)] md:grid-cols-[1.08fr_0.92fr] md:p-8 lg:p-10">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 ring-1 ring-white/15">
            <MapPinned className="h-4 w-4" />
            Discover Local. Support Mindoro.
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight md:text-6xl lg:text-7xl">
            Find Mindoro businesses worth visiting.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
            Search restaurants, cafes, resorts, shops, freelancers, and local
            services in one clean community directory.
          </p>

          <form action="/discover" className="mt-8 rounded-[1.5rem] bg-white p-2 shadow-2xl shadow-black/15 sm:flex">
            <div className="flex min-h-14 flex-1 items-center gap-3 px-4 text-[#111827]">
              <Search className="h-5 w-5 shrink-0 text-[#16A34A]" />
              <input
                name="search"
                aria-label="Search local businesses"
                placeholder="Search restaurants, resorts, salons..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#6B7280] md:text-base"
              />
            </div>
            <button
              type="submit"
              className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#FB923C] px-6 text-sm font-black text-white transition hover:bg-[#F97316] sm:mt-0 sm:w-auto"
            >
              Search
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 grid max-w-xl gap-3 text-sm text-white/85 sm:grid-cols-3">
            {[
              { label: "Verified pages", icon: ShieldCheck },
              { label: "Local picks", icon: Sparkles },
              { label: "Community first", icon: Users },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[#86EFAC]" />
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-white p-4 text-[#111827] shadow-2xl shadow-black/10 md:p-5">
          <div className="overflow-hidden rounded-[1.35rem] bg-[#FAF7F2]">
            <div className="h-44 bg-[linear-gradient(135deg,rgba(20,83,45,0.92),rgba(22,163,74,0.55)),url('/globe.svg')] bg-cover bg-center" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#16A34A]">
                    Featured nearby
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight">
                    Local favorites, curated daily
                  </h2>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-[#14532D]">
                  New
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {["Restaurants", "Resorts", "Coffee", "Services"].map(
              (item) => (
                <Link
                  key={item}
                  href={`/discover?search=${encodeURIComponent(item)}`}
                  className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-4 text-sm font-bold transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50"
                >
                  {item}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
