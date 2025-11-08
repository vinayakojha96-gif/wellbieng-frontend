"use client";

import { App, AppsCard } from "@/components/apps-card";
import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import { useAuth } from "@/context/auth-context";
import apiClient, { ApiResponse } from "@/services/api-client";
import { useEffect, useState } from "react";

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { activeTeamId, user } = useAuth()!;

  useEffect(() => {
    if (!activeTeamId) return;
    const fetchApps = async () => {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get<ApiResponse<App[]>>("/apps", {
          headers: {
            "x-team-id": activeTeamId,
          },
        });
        // const apps = (data.success && data.responseObject) || [];
        const defaultApps: App[] = [
          {
            name: "Slack",
            description: "Integrate Slack for efficient team communication.",
            icon: "/icons/slack.svg",
            connectUrl: "/integrations/slack",
          },
          {
            name: "Google Calendar",
            description: "Sync your events and schedules from Google Calendar.",
            icon: "/icons/google-calendar.svg",
            connectUrl: "/integrations/google-calendar",
          },
        ];
        const apps = (data.success && data.responseObject) || [];
        const mergedApps = [
          ...apps,
          ...defaultApps.filter((a) => !apps.find((b) => b.name === a.name)),
        ];

        setApps(mergedApps);
      } catch (error) {
        console.error("Error fetching apps:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.role === "Member") return;
    fetchApps();
  }, [activeTeamId, user?.role]);

  if (user?.role === "Member") {
    return <Loading className="h-screen" />;
  }

  return (
    <>
      <Header
        title="App Integrations"
        description="Here's a list of your apps for the integration!"
      />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="mt-8">
          <ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 md:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(apps) ? (
              apps.map((app) => <AppsCard key={app.name} app={app} />)
            ) : (
              <div className="w-full animate-pulse rounded-lg bg-gray-800 p-6 shadow-md">
                <div className="mb-4 h-10 w-10 rounded-full bg-gray-700"></div>
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-700"></div>
                <div className="h-3 w-5/6 rounded bg-gray-700"></div>
              </div>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
