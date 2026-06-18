"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { BarDatum } from "@/lib/organizer/analytics";

const TICK_STYLE = { fontSize: 11, fill: "#757274" };

export function SimpleBarChart({ data }: { data: BarDatum[] }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid horizontal={false} stroke="#E8E2D2" />
          <XAxis type="number" tick={TICK_STYLE} axisLine={false} tickLine={false} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="label"
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            width={110}
          />
          <Tooltip
            cursor={{ fill: "#DFE3B7", opacity: 0.4 }}
            contentStyle={{ border: "1px solid #E8E2D2", fontSize: 12 }}
          />
          <Bar dataKey="value" fill="#95A76A" radius={[0, 2, 2, 0]} maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
