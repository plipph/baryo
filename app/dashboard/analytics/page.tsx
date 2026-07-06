import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { AnalyticsChart } from "./analytics-chart";

type LinkedBusinessLink = {
  id: string;
  label: string;
  type: string;
};

type LinkClick = {
  link_id: string;
  business_links: LinkedBusinessLink | LinkedBusinessLink[] | null;
};

type LinkedItem = {
  id: string;
  name: string;
  price: number | null;
};

type ItemClick = {
  item_id: string;
  items: LinkedItem | LinkedItem[] | null;
};

type LinkEngagement = LinkedBusinessLink & {
  clicks: number;
};

type ItemEngagement = LinkedItem & {
  clicks: number;
};

function firstRelated<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

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


const { data: topLinks } =
  await supabase
    .from("link_clicks")
    .select(`
      link_id,
      business_links (
        id,
        label,
        type
      )
    `)
    .eq(
      "business_id",
      business.id
    );




    
const groupedLinks =
  Object.values(
    ((topLinks || []) as LinkClick[]).reduce<Record<string, LinkEngagement>>(
      (acc, click) => {
        const link =
          firstRelated(click.business_links);

        if (!link) {
          return acc;
        }

        if (!acc[link.id]) {
          acc[link.id] = {
            id: link.id,
            label:
              link.label,
            type: link.type,
            clicks: 0,
          };
        }

        acc[link.id].clicks += 1;

        return acc;
      },
      {}
    )
  )
    .sort(
      (a, b) =>
        b.clicks - a.clicks
    )
    .slice(0, 5);

/*
  TOP ITEMS
*/

const { data: topItems } =
  await supabase
    .from("item_clicks")
    .select(`
      item_id,
      items (
        id,
        name,
        price
      )
    `)
    .eq(
      "business_id",
      business.id
    );

const groupedItems = Object.values(
  ((topItems || []) as ItemClick[]).reduce<Record<string, ItemEngagement>>(
    (acc, click) => {
      const item = firstRelated(click.items);

      if (!item) {
        return acc;
      }

      if (!acc[item.id]) {
        acc[item.id] = {
          id: item.id,
          name: item.name,
          price: item.price,
          clicks: 0,
        };
      }

      acc[item.id].clicks += 1;

      return acc;
    },
    {}
  )
)
  .sort(
    (a, b) =>
      b.clicks - a.clicks
  )
  .slice(0, 5);



  return (
    <main className="min-h-screen bg-[#FAF7F2] px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#6B7280]">
            Analytics
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#111827]">
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


<div className="mt-8 rounded-[2rem] border border-[#E5E7EB] bg-white p-6 shadow-sm">
  <div className="mb-6">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
      Engagement
    </p>

    <h2 className="mt-2 text-2xl font-black text-[#111827]">
      Top Links
    </h2>
  </div>

  <div className="space-y-4">
    {groupedLinks.length ===
    0 ? (
      <p className="text-sm text-stone-500">
        No link clicks yet.
      </p>
    ) : (
      groupedLinks.map(
        (link) => (
          <div
            key={link.id}
            className="flex items-center justify-between rounded-2xl border border-[#F3F4F6] bg-[#FFFFFF] px-4 py-4"
          >
            <div>
              <p className="font-bold text-[#111827]">
                {link.label}
              </p>

              <p className="text-sm capitalize text-stone-500">
                {link.type}
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-black text-[#16A34A]">
                {
                  link.clicks
                }
              </p>

              <p className="text-xs uppercase tracking-[0.15em] text-stone-500">
                Clicks
              </p>
            </div>
          </div>
        )
      )
    )}
  </div>
</div>


<div className="mt-8 rounded-[2rem] border border-[#E5E7EB] bg-white p-6 shadow-sm">
  <div className="mb-6">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
      Products
    </p>

    <h2 className="mt-2 text-2xl font-black text-[#111827]">
      Top Items
    </h2>
  </div>

  <div className="space-y-4">
    {groupedItems.length ===
    0 ? (
      <p className="text-sm text-stone-500">
        No item engagement yet.
      </p>
    ) : (
      groupedItems.map(
        (item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-[#F3F4F6] bg-[#FFFFFF] px-4 py-4"
          >
            <div>
              <p className="font-bold text-[#111827]">
                {item.name}
              </p>

             
{item.price !== null && (
  <p className="text-sm text-stone-500">
    ₱{item.price}
  </p>
)}


            </div>

            <div className="text-right">
              <p className="text-2xl font-black text-[#16A34A]">
                {
                  item.clicks
                }
              </p>

              <p className="text-xs uppercase tracking-[0.15em] text-stone-500">
                Views
              </p>
            </div>
          </div>
        )
      )
    )}
  </div>
</div>

        {/* EMPTY STATE */}
        {(totalVisits || 0) ===
          0 && (
          <div className="mt-8 rounded-[2rem] border border-dashed border-[#E5E7EB] bg-white p-10 text-center">
            <h2 className="text-2xl font-black text-[#111827]">
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

