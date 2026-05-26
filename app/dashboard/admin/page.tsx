import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const adminEmails = [
    "kgcomia@gmail.com",
  ];

  const isAdmin =
    user.email &&
    adminEmails.includes(
      user.email
    );

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const {
    count: totalBusinesses,
  } = await supabase
    .from("businesses")
    .select("*", {
      count: "exact",
      head: true,
    });

  const {
    count: totalUsers,
  } = await supabase
    .from("profiles")
    .select("*", {
      count: "exact",
      head: true,
    });

  const {
    count: totalItems,
  } = await supabase
    .from("items")
    .select("*", {
      count: "exact",
      head: true,
    });

  const {
    count: totalLinks,
  } = await supabase
    .from("business_links")
    .select("*", {
      count: "exact",
      head: true,
    });

  const {
    data: businesses,
  } = await supabase
    .from("businesses")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(10);

  return (
    <main className="min-h-screen bg-[#F7F1E8] px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8A6A4F]">
            Founder Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#3D2A1E]">
            Listahan Admin
          </h1>

          <p className="mt-3 text-stone-600">
            Monitor businesses,
            users, and platform
            growth.
          </p>
        </div>

        {/* METRICS */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Businesses"
            value={
              totalBusinesses || 0
            }
          />

          <MetricCard
            label="Users"
            value={
              totalUsers || 0
            }
          />

          <MetricCard
            label="Items"
            value={
              totalItems || 0
            }
          />

          <MetricCard
            label="Links"
            value={
              totalLinks || 0
            }
          />
        </div>

        {/* RECENT BUSINESSES */}
        <section className="mt-8 rounded-[2rem] border border-[#E7D8C5] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight text-[#3D2A1E]">
            Recent Businesses
          </h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[700px] border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm uppercase tracking-[0.2em] text-stone-500">
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Plan</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>
                {businesses?.map(
                  (business) => (
                    <tr
                      key={
                        business.id
                      }
                      className="bg-[#FFF8EF]"
                    >
                      <td className="rounded-l-2xl px-4 py-4 font-semibold text-[#3D2A1E]">
                        {
                          business.name
                        }
                      </td>

                      <td className="px-4 py-4 text-stone-600">
                        /
                        {
                          business.slug
                        }
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-white px-3 py-1 text-sm text-stone-700">
                          {
                            business.plan_id
                          }
                        </span>
                      </td>

                      <td className="rounded-r-2xl px-4 py-4 text-stone-500">
                        {new Date(
                          business.created_at
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[2rem] border border-[#E7D8C5] bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8A6A4F]">
        {label}
      </p>

      <h2 className="mt-4 text-5xl font-black tracking-tight text-[#3D2A1E]">
        {value}
      </h2>
    </div>
  );
}

