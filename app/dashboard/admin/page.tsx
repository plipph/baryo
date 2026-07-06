import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { adminSupabase } from "@/lib/supabase/admin";



import { toggleBusinessStatus } from "./actions/business-actions";


export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

 /*
  ADMIN CHECK
*/

const {
  data: profile,
  error: profileError,
} = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

if (
  profileError ||
  profile?.role !== "admin"
) {
  redirect("/dashboard");
}

  /*
    METRICS
  */

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

  /*
    BUSINESSES
  */

 const { data: businesses } = await adminSupabase .from("businesses") .select("*") .order("created_at", { ascending: false, }) .limit(20);
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#6B7280]">
            Founder Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#111827]">
            MyNegosyo Mindoro - Admin Dashboard
          </h1>

          <p className="mt-3 text-stone-600">
            Manage storefronts,
            monitor growth, and
            oversee platform
            activity.
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

        {/* BUSINESSES */}
        <section className="mt-8 rounded-[2rem] border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[#111827]">
                Businesses
              </h2>

              <p className="mt-2 text-stone-600">
                Manage storefronts
                and platform users.
              </p>
            </div>

            <div className="rounded-full bg-[#F0FDF4] px-4 py-2 text-sm font-semibold text-[#111827]">
              {businesses?.length || 0}{" "}
              stores loaded
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1100px] border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm uppercase tracking-[0.2em] text-stone-500">
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Slug</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {businesses?.map(
                  (business) => (
                    <tr
                      key={
                        business.id
                      }
                      className="bg-[#FFFFFF]"
                    >
                      {/* NAME */}
                      <td className="rounded-l-2xl px-4 py-4 font-semibold text-[#111827]">
                        {
                          business.name
                        }
                      </td>

                      {/* OWNER */}
                      <td className="px-4 py-4 text-sm text-stone-600">
                       {business.owner_id}
                      </td>

                      {/* SLUG */}
                      <td className="px-4 py-4 text-stone-600">
                        /
                        {
                          business.slug
                        }
                      </td>

                      {/* PLAN */}
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-white px-3 py-1 text-sm text-stone-700">
                          {
                            business.plan_id
                          }
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4">
                        {business.is_active ? (
                          <span className="rounded-full bg-[#EEF6E9] px-3 py-1 text-sm font-semibold text-[#3D6B35]">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                            Disabled
                          </span>
                        )}
                      </td>

                      {/* CREATED */}
                      <td className="px-4 py-4 text-stone-500">
                        {new Date(
                          business.created_at
                        ).toLocaleDateString()}
                      </td>

                      {/* ACTIONS */}
                      <td className="rounded-r-2xl px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={`/${business.slug}`}
                            target="_blank"
                            className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100"
                          >
                            Open
                          </a>

                  
<form action={toggleBusinessStatus}> <input type="hidden" name="businessId" value={business.id} /> <input type="hidden" name="currentStatus" value={ business.is_active ? "true" : "false" } /> <button type="submit" className={`rounded-xl px-3 py-2 text-sm font-semibold text-white ${ business.is_active ? "bg-red-500 hover:bg-red-600" : "bg-[#16A34A] hover:bg-[#15803D]" }`} > {business.is_active ? "Disable" : "Enable"} </button> </form>

                        </div>
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
    <div className="rounded-[2rem] border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
        {label}
      </p>

      <h2 className="mt-4 text-5xl font-black tracking-tight text-[#111827]">
        {value}
      </h2>
    </div>
  );
}

