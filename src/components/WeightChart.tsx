"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartEntry = {
  date: string;
  weight: number;
  trend?: number;
};

function parseDateMs(date: string): number {
  return Date.parse(`${date}T00:00:00Z`);
}

function formatTick(ms: number): string {
  return new Date(ms).toISOString().slice(5, 10);
}

export default function WeightChart({
  data,
  targetWeight,
}: {
  data: ChartEntry[];
  targetWeight: number | null;
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
        Log a weight entry to see your trend here.
      </div>
    );
  }

  const chartData = data.map((d) => ({ ...d, t: parseDateMs(d.date) }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
          <XAxis
            dataKey="t"
            type="number"
            domain={["dataMin", "dataMax"]}
            tick={{ fontSize: 12 }}
            tickFormatter={formatTick}
          />
          <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
          <Tooltip
            labelFormatter={(value) => `Date: ${formatTick(Number(value))}`}
            formatter={(value, name) =>
              [Number(value).toFixed(1), name] as [string, string]
            }
          />
          {targetWeight != null && (
            <ReferenceLine
              y={targetWeight}
              stroke="#16a34a"
              strokeDasharray="4 4"
              label={{ value: "Goal", position: "insideTopRight", fontSize: 12, fill: "#16a34a" }}
            />
          )}
          <Line
            type="monotone"
            dataKey="weight"
            name="Weight"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="linear"
            dataKey="trend"
            stroke="#9333ea"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            dot={false}
            isAnimationActive={false}
            legendType="none"
            name="Trend"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
