import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F1E8] text-stone-900">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold tracking-tight text-[#5A3825]">
              Listahan
            </p>
            <p className="text-xs uppercase tracking-[0.25em] text-[#8A6A4F]">
              Business websites made simple
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-stone-700 hover:bg-white/60"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-[#C85A32] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#A94727]"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-[#D9C7B3] bg-white/60 px-4 py-2 text-sm text-[#5A3825]">
              Built for Filipino MSMEs
            </div>

            <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-[#3D2A1E] md:text-7xl">
              Create your business website in minutes.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-700">
              Listahan helps restaurants, resorts, salons, shops, freelancers,
              and local businesses publish a mobile-friendly mini-website with
              products, services, photos, location, and social links.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-2xl bg-[#C85A32] px-6 py-3 font-semibold text-white shadow-md hover:bg-[#A94727]"
              >
                Start Free
              </Link>
              <Link
                href="/p/demo-kainan"
                className="rounded-2xl border border-[#BCA892] bg-white/70 px-6 py-3 font-semibold text-[#5A3825] hover:bg-white"
              >
                View Sample
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E2D4C2] bg-white/70 p-4 shadow-2xl">
            <div className="rounded-[1.5rem] bg-[#FFF8EF] p-5">
              <div className="rounded-3xl bg-[#596B3F] p-6 text-white">
                <p className="text-sm opacity-80">Public Business Page</p>
                <h2 className="mt-2 text-3xl font-bold">Demo Kainan</h2>
                <p className="mt-2 text-sm opacity-90">
                  Lutong-bahay na masarap, serbisyo na maaasahan.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {["Chicken Inasal", "Pork Sisig", "Halo-Halo", "Kare-Kare"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#E7D8C5] bg-white p-4"
                    >
                      <div className="mb-3 h-24 rounded-xl bg-[#E9D8C0]" />
                      <p className="font-semibold text-[#3D2A1E]">{item}</p>
                      <p className="text-sm text-stone-500">Sample item</p>
                    </div>
                  )
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {["Facebook", "Instagram", "Messenger", "Map", "Call"].map(
                  (link) => (
                    <span
                      key={link}
                      className="rounded-full bg-[#F1E5D4] px-3 py-1 text-xs font-medium text-[#5A3825]"
                    >
                      {link}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}