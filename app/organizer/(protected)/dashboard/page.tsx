import { requireRole } from "@/lib/organizer/session";
import { MOCK_GUESTS } from "@/lib/organizer/mock-guests";
import { computeStats, trendData, nationalityData, slotData, transferData } from "@/lib/organizer/analytics";
import { StatTile } from "@/components/organizer/stat-tile";
import { ChartCard } from "@/components/organizer/chart-card";
import { TrendChart } from "@/components/organizer/trend-chart";
import { SimpleBarChart } from "@/components/organizer/simple-bar-chart";
import { DashboardHeading } from "./dashboard-heading";

export default async function DashboardPage() {
  await requireRole(["admin", "broadcast_manager", "viewer"]);

  const stats = computeStats(MOCK_GUESTS);
  const trend = trendData(MOCK_GUESTS);
  const nationality = nationalityData(MOCK_GUESTS);
  const slots = slotData(MOCK_GUESTS);
  const transfer = transferData(MOCK_GUESTS, { none: "None", shuttle: "Shuttle", vip: "VIP" });

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <DashboardHeading />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile labelKey="statRsvp" descKey="statRsvpD" value={stats.totalRsvps} />
        <StatTile labelKey="statGuests" descKey="statGuestsD" value={stats.expectedGuests} />
        <StatTile labelKey="statTransfer" descKey="statTransferD" value={stats.transferRequests} />
        <StatTile labelKey="statCheck" descKey="statCheckD" value={stats.checkedIn} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ChartCard titleKey="chartTrend">
          <TrendChart data={trend} />
        </ChartCard>
        <ChartCard titleKey="chartNationality">
          <SimpleBarChart data={nationality} />
        </ChartCard>
        <ChartCard titleKey="chartSlot">
          <SimpleBarChart data={slots} />
        </ChartCard>
        <ChartCard titleKey="chartTransfer">
          <SimpleBarChart data={transfer} />
        </ChartCard>
      </div>
    </div>
  );
}
