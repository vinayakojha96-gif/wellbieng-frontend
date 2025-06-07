import { TeamMoodChart } from "@/components/team-mood-chart";
import { TeamStressChart } from "@/components/team-stress-chart";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8">
      <TeamMoodChart />
      <TeamStressChart />
    </div>
  );
}
