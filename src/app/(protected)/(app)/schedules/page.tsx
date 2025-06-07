"use client";

import { CronCard, CronData } from "@/components/crons";
import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import { useAuth } from "@/context/auth-context";
import apiClient, { ApiResponse } from "@/services/api-client";
import { useEffect, useState } from "react";

export default function SchedulesPage() {
  const [crons, setCrons] = useState<CronData[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeTeamId } = useAuth()!;

  useEffect(() => {
    const fetchCrons = async () => {
      try {
        const response = await apiClient.get<ApiResponse<CronData[]>>(
          "/crons",
          {
            headers: {
              "x-team-id": activeTeamId,
            },
          },
        );

        setCrons(response.data.responseObject || []);
      } finally {
        setLoading(false);
      }
    };

    fetchCrons();
  }, [activeTeamId]);

  if (loading) return <Loading />;

  return (
    <div className="mr-5">
      <Header title="Schedules" description="Manage your cron jobs" />
      <div className="mt-8">
        {crons.length ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {crons
              .sort((a, b) => a.type.localeCompare(b.type))
              .map((cron) => (
                <CronCard key={cron.id} cron={cron} />
              ))}
          </div>
        ) : (
          <div className="text-xl">
            Please connect your Slack account to see your schedules
          </div>
        )}
      </div>
    </div>
  );
}
