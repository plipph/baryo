import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { AnalyticsChart } from "./analytics-chart";


export default async function AnalyticsPage() {
  const supabase =
    await createClient();

  /*
    AUTH
  */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  /*
    BUSINESS
  */

  const {
    data: business,
  } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!business) {
    redirect("/dashboard/business");
  }

  /*
    TOTAL VISITS
  */

  const {
    count: totalVisits,
  } = await supabase
    .from("business_analytics")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq(
      "business_id",
      business.id
    );

  /*
    TODAY VISITS
  */

  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const {
    count: todayVisits,
  } = await supabase
    .from("business_analytics")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq(
      "business_id",
      business.id
    )
    .gte(
      "visited_at",
      today.toISOString()
    );

  /*
    LAST 7 DAYS
  */

  const sevenDaysAgo =
    new Date();

  sevenDaysAgo.setDate(
    sevenDaysAgo.getDate() -
      7
  );

  const {
    count: weeklyVisits,
  } = await supabase
    .from("business_analytics")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq(
      "business_id",
      business.id
    )
    .gte(
      "visited_at",
      sevenDaysAgo.toISOString()
    );

const chartData = [];

for (let i = 6; i >= 0; i--) {
  const start = new Date();

  start.setDate(
    start.getDate() - i
  );

  start.setHours(
    0,
    0,
    0,
    0
  );

  const end = new Date(start);

  end.setHours(
    23,
    59,
    59,
    999
  );

  const { count } =
    await supabase
      .from(
        "business_analytics"
      )
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "business_id",
        business.id
      )
      .gte(
        "visited_at",
        start.toISOString()
      )
      .lte(
        "visited_at",
        end.toISOString()
      );

  chartData.push({
    date:
      start.toLocaleDateString(
        "en-US",
        {
          weekday: "short",
        }
      ),
    visits: count || 0,
  });
}



  return (
    <main className="min-h-screen bg-[#F7F1E8] px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8A6A4F]">
            Analytics
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#3D2A1E]">
            Business Insights
          </h1>

          <p className="mt-3 text-stone-600">
            Track storefront
            traffic and customer
            engagement.
          </p>
        </div>

        {/* METRICS */}
        <div className="grid gap-5 md:grid-cols-3">
          <AnalyticsCard
            label="Total Visits"
            value={
              totalVisits || 0
            }
          />

          <AnalyticsCard
            label="Today's Visits"
            value={
              todayVisits || 0
            }
          />

          <AnalyticsCard
            label="Last 7 Days"
            value={
              weeklyVisits || 0
            }
          />
        </div>

    
<div className="mt-8">
  <AnalyticsChart
    data={chartData}
  />
</div>



        {/* EMPTY STATE */}
        {(totalVisits || 0) ===
          0 && (
          <div className="mt-8 rounded-[2rem] border border-dashed border-[#D8C3AC] bg-white p-10 text-center">
            <h2 className="text-2xl font-black text-[#3D2A1E]">
              No analytics yet
            </h2>

            <p className="mt-3 text-stone-600">
              Share your storefront
              link to start tracking
              visitors.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function AnalyticsCard({
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

