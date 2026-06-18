"use client";

import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { TrendPoint } from "@/lib/organizer/analytics";

const TICK_STYLE = { fontSize: 11, fill: "#757274" };

export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#95A76A" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#95A76A" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#E8E2D2" />
          <XAxis dataKey="label" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={{ border: "1px solid #E8E2D2", fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#405E2D"
            strokeWidth={2}
            fill="url(#trendFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
