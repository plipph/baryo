
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
    <div className="rounded-[2rem] border border-[#E7D8C5] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8A6A4F]">
          Traffic Trend
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#3D2A1E]">
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
              stroke="#596B3F"
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

