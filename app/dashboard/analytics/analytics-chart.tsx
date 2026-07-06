
"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AnalyticsChartProps = {
  data: {
    date: string;
    visits: number;
  }[];
};

export function AnalyticsChart({
  data,
}: AnalyticsChartProps) {
  return (
    <div className="rounded-[2rem] border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
          Traffic Trend
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#111827]">
          Last 7 Days
        </h2>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <XAxis dataKey="date" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="visits"
              stroke="#16A34A"
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

